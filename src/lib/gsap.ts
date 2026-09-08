import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// dev-only handle so the running timelines can be inspected from the console
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__gsap = gsap;
  (window as unknown as Record<string, unknown>).__ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger, useGSAP };
