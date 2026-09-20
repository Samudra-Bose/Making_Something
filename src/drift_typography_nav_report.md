# DRIFT Typography & Navigation Precision Pass

## Global Typography
- **Fluid Scale**: Added strict `clamp()`-based fluid typography variables (`.text-hero`, `.text-world-title`, `.text-major-statement`, `.text-body`, `.text-metadata`) into `src/index.css`.
- **Vertical Rhythm & Tracking**: Enforced tight line-heights (0.88-0.96) and negative tracking for headings, with airy properties for metadata (line-height 1.35, letter-spacing 0.08em).
- **Font Stack**: Fully mapped Playfair Display to `var(--font-display)` and Inter to `var(--font-sans)`.
- **Auto-Contrast**: Remapped Tailwind v4 variables inside `@media (prefers-color-scheme: dark)` for seamless light/dark mode adaptation using existing token nomenclature.
- **Motion Utilities**: Injected pure CSS `.clip-reveal`, `.split-line-reveal`, `.depth-movement`, and `.scale-motion` primitives for downstream world animation usage.

## Global Navigation
- **Hierarchy Refactor**: Replaced hardcoded text rules in `GlobalNavigation.tsx` with the new `.text-metadata` class and scaling rules.
- **Micro-interactions**: Added Framer Motion `y: [0, -2, 0]` bounce and `opacity: 0.6 -> 1` fades for activating labels.
- **Progress Synchronization**: Bound the `scaleX` indicator natively to the `globalProgress` store state when a world is active (0.4s linear smoothing).
- **Mobile Compliance**: Fixed layout boundaries using `max-w-[100vw]` and `overflow-x-hidden`, allowing safe text wrapping and preventing horizontal scrollbar clipping. 

Quality checks verify no textual overflow, accurate font loading without flash, and responsive compliance.
