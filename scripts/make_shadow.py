"""Cut a cast-shadow silhouette out of a photo shot on a white ground.

    python scripts/make_shadow.py <input image> <output png> [width]

The figure is found by flood-filling the white backdrop in from the edges, so
light areas *inside* the figure (a collar, a shirt) are not punched out. The
result is a black silhouette on transparency, softened, ready to be skewed
into a long shadow in CSS. Requires Pillow and numpy.
"""
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter


def main() -> None:
    src, dst = sys.argv[1], sys.argv[2]
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 540

    im = Image.open(src).convert("RGB")
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    light = lum >= 246

    # backdrop = light pixels connected to the frame edge
    bg = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if light[y, x] and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if light[y, x] and not bg[y, x]:
                bg[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and light[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True
                q.append((ny, nx))

    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8), "L")
    alpha = alpha.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(2))
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.putalpha(alpha)
    out.save(dst, optimize=True)
    print(f"{dst}: {w}x{h}, figure covers {100 - bg.mean() * 100:.1f}% of frame")


if __name__ == "__main__":
    main()
