"""
Build the CRT in 3D and render it turning, as line art.

Run headless:

    "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" \
        --background --python scripts/crt_turntable.py

Everything is built in code — there is no .blend file to lose. Freestyle
draws the outlines, the surfaces are flat paper, and the film is
transparent, so the frames drop onto the page in the same ink-on-paper
language as the drawings the browser makes.
"""

import math
import os
import sys

import bpy

FRAMES = 40
RES = 900
OUT = os.path.join(os.getcwd(), "scripts", "_turntable")

def srgb(hex_colour):
    """#rrggbb -> linear RGBA, which is what Blender's nodes actually take."""
    h = hex_colour.lstrip("#")
    out = []
    for i in range(0, 6, 2):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


INK = srgb("#121110")
PAPER = srgb("#faf8f4")
GLASS = srgb("#e6e2da")


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def flat(name, colour, hatched=False):
    """A shadeless material — the render carries no lighting, only line.

    With `hatched`, the faces turned away from the key direction are filled
    with diagonal bands instead of flat paper: the same cross-hatch the
    browser draws on the 2D machines, so the two registers agree.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    emit = nodes.new("ShaderNodeEmission")
    emit.inputs["Strength"].default_value = 1.0
    links.new(emit.outputs["Emission"], out.inputs["Surface"])

    if not hatched:
        emit.inputs["Color"].default_value = colour
        return mat

    # diagonal bands, hard-edged
    wave = nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "DIAGONAL"
    wave.inputs["Scale"].default_value = 11.0
    wave.inputs["Distortion"].default_value = 0.25
    bands = nodes.new("ShaderNodeValToRGB")
    bands.color_ramp.interpolation = "CONSTANT"
    bands.color_ramp.elements[0].position = 0.5
    bands.color_ramp.elements[0].color = INK
    bands.color_ramp.elements[1].position = 0.72
    bands.color_ramp.elements[1].color = colour
    links.new(wave.outputs["Fac"], bands.inputs["Fac"])

    # which side is turned away from the light
    geo = nodes.new("ShaderNodeNewGeometry")
    dot = nodes.new("ShaderNodeVectorMath")
    dot.operation = "DOT_PRODUCT"
    dot.inputs[1].default_value = (-0.62, -0.5, 0.6)
    side = nodes.new("ShaderNodeValToRGB")
    side.color_ramp.interpolation = "CONSTANT"
    side.color_ramp.elements[0].position = 0.0
    side.color_ramp.elements[0].color = (1, 1, 1, 1)
    side.color_ramp.elements[1].position = 0.34
    side.color_ramp.elements[1].color = (0, 0, 0, 1)
    links.new(geo.outputs["Normal"], dot.inputs[0])
    links.new(dot.outputs["Value"], side.inputs["Fac"])

    mix = nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["A"].default_value = colour
    links.new(side.outputs["Color"], mix.inputs["Factor"])
    links.new(bands.outputs["Color"], mix.inputs["B"])
    links.new(mix.outputs["Result"], emit.inputs["Color"])
    return mat


def box(name, size, location, bevel=0.03, segments=2):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.scale = size
    bpy.ops.object.transform_apply(scale=True)
    m = ob.modifiers.new("bevel", "BEVEL")
    m.width = bevel
    m.segments = segments
    m.limit_method = "ANGLE"
    return ob


def cyl(name, r, depth, location, rotation=(0, 0, 0), verts=24):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=r, depth=depth, location=location, rotation=rotation, vertices=verts
    )
    ob = bpy.context.object
    ob.name = name
    return ob


def build():
    """The machine, in the proportions of the one drawn in the hero."""
    paper = flat("paper", PAPER, hatched=True)
    glass = flat("glass", GLASS)
    parts = []

    body = box("body", (2.3, 1.75, 1.75), (0, 0, 1.25), bevel=0.14, segments=3)
    parts.append(body)

    # the screen, recessed into the front face
    screen = box("screen", (1.55, 0.1, 1.2), (-0.16, -0.9, 1.35), bevel=0.05)
    screen.data.materials.append(glass)
    parts.append(screen)

    # the brow above the glass and the two knobs beside it
    parts.append(cyl("knob-a", 0.17, 0.12, (0.86, -0.9, 1.72), (math.pi / 2, 0, 0)))
    parts.append(cyl("knob-b", 0.12, 0.12, (0.86, -0.9, 1.22), (math.pi / 2, 0, 0)))

    # neck and base
    parts.append(cyl("neck", 0.42, 0.75, (0, 0, 0.3), verts=20))
    parts.append(cyl("base", 1.0, 0.22, (0, 0, 0.05), verts=28))

    for ob in parts:
        if not ob.data.materials:
            ob.data.materials.append(paper)

    # one empty at the origin turns the whole machine
    bpy.ops.object.empty_add(location=(0, 0, 0))
    pivot = bpy.context.object
    pivot.name = "pivot"
    for ob in parts:
        ob.parent = pivot
    return pivot


def camera():
    bpy.ops.object.camera_add(location=(0, -9.2, 3.4), rotation=(math.radians(76), 0, 0))
    cam = bpy.context.object
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 4.5
    bpy.context.scene.camera = cam


def freestyle(scene):
    """Black outlines, nothing else. This is the whole look."""
    scene.render.use_freestyle = True
    scene.render.line_thickness_mode = "ABSOLUTE"
    scene.render.line_thickness = 4.6

    vl = scene.view_layers[0]
    vl.use_freestyle = True
    fs = vl.freestyle_settings
    fs.as_render_pass = False
    for ls in list(fs.linesets):
        fs.linesets.remove(ls)

    ls = fs.linesets.new("ink")
    ls.select_silhouette = True
    ls.select_border = True
    ls.select_crease = True
    ls.select_edge_mark = True
    ls.edge_type_combination = "OR"
    ls.linestyle.color = INK[:3]
    ls.linestyle.thickness = 4.6
    # a little jitter so the line reads as drawn, like the browser's own
    geo = ls.linestyle.geometry_modifiers
    mod = geo.new("perlin", "PERLIN_NOISE_1D")
    mod.amplitude = 1.1
    mod.frequency = 11.0
    mod.octaves = 3


def render(pivot):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = RES
    scene.render.resolution_y = RES
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "Standard"
    freestyle(scene)
    camera()

    os.makedirs(OUT, exist_ok=True)
    for i in range(FRAMES):
        pivot.rotation_euler[2] = (i / FRAMES) * math.tau
        scene.render.filepath = os.path.join(OUT, "crt-%03d.png" % i)
        bpy.ops.render.render(write_still=True)
        print("frame %d/%d" % (i + 1, FRAMES), flush=True)


if __name__ == "__main__":
    only = "--one" in sys.argv
    if only:
        FRAMES = 1
    clear()
    pivot = build()
    render(pivot)
    print("done ->", OUT)
