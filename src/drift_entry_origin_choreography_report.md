# DRIFT - Entry & Origin Choreography Report

## Overview
This report details the execution of the exact GSAP choreography in `Origin.tsx` (which combines Entry and Origin timelines). The first viewport has been transformed into a premium coffee campaign with staggered initial load animations, precise 300px immediate scroll triggers, split headline offsets, and an organic mask transition into Roast.

## Exact GSAP Changes

### 1. ENTRY LOAD (Staggered initial load animations)
- **Logo:** `opacity` animates from 0 -> 1, `y` animates from `-20vh` -> `0vh` over 1.0s.
- **Headline (Clip Reveal):** `.st-hero-title-line` `y` animates from `100%` -> `0%` over 1.0s with a `0.1s` stagger.
- **Hero Image:** `.st-hero-subject-container` `scale` animates from `0.9` -> `1.0` over 1.2s.
- **Metadata:** `.st-entry-meta-top` and `.st-entry-meta-bottom` `opacity` animates from 0 -> 1, `y` animates from `16px` -> `0px` with stagger.
- All animations utilize `immediateRender: false` and `ease: 'power3.out'` / `'power2.out'` to prevent layout jumps on reverse scrolling.

### 2. FIRST 300PX (Precise Immediate Scroll Triggers)
A dedicated `ScrollTrigger` mapped exactly to `300px` (`end: "+=300px"`) drives micro-interactions smoothly:
- **75px (progress 0.25):** Hero container scales from `1.0` to `1.02`.
- **120px (progress 0.40):** Headline `y` shifts from `0vh` to `-2vh`.
- **170px (progress 0.56):** Metadata drifts `y` from `0vh` to `-3vh`.
- **220px (progress 0.73):** Hero container scales further to `1.05`.
- **300px (progress 1.00):** Headline container scales to `1.03`, and the foreground bean object moves `x: 2vw`.

### 3. ORIGIN CAMERA PUSH & HEADLINE SPLIT (Main Timeline)
Over the `0 -> 1` progress of the main pinned `400vh` scroll:
- **Camera Push:** `.st-hero-subject-img` scales `1.0 -> 1.15` and `objectPosition` transitions precisely `70% 30% -> 68% 26%`.
- **Headline Split:**
  - Line 1 moves to `y: -5vh, x: -1vw`
  - Line 2 moves to `y: -7vh, x: +1vw`
  - Line 3 moves to `y: -9vh, x: +2vw`
- **Origin Object (Green Bean):** Traverses `x: -10vw -> 0vw -> +8vw` and rotation `-2deg -> +2deg -> 0deg`.

### 4. ORIGIN -> ROAST TRANSITION (Organic Mask Strategy)
- **20%:** Image scale increases +4%.
- **35%:** Image crop tightens (`clip-path: inset(10% 15% 10% 15%)`).
- **45%:** Headline fades out (`opacity: 0, y: -20vh`).
- **55%:** An organic circular mask begins shrinking on the main `.st-origin-content-wrapper` from `circle(150% at 70% 30%)` to `circle(0% at 70% 30%)`.
- **65%:** A placeholder Roast visual (matching Roast.tsx initial state) smoothly fades in `opacity 0 -> 1` behind the organic mask, giving the illusion of revealing Roast.
- **80%:** The mask continues tightening, dropping Origin image visibility significantly.
- **100%:** Origin content wrapper clip-path reaches 0%, making Origin fully gone and smoothly passing the baton to `Roast.tsx` (which pins immediately following).

## Exact Tailwind Changes (Clean, Editorial Aesthetic)

To enforce strict visual constraints (warm cream, paper, natural green, deep charcoal, coffee imagery) and remove UI tropes:
- Removed predefined `opacity-0` utilities from HTML to prevent clashing with GSAP `fromTo` immediate states.
- Re-architected DOM structure to include an `.st-origin-content-wrapper` (with background `#F2F0EB`) that wraps all Origin content to allow a clean `clip-path` transition.
- Added a `.st-roast-placeholder` layered underneath the wrapper, bearing a flat background of `#E3E8E0` (matching Roast's initial state). It contains a minimalistic "ROAST" typography overlay for the reveal instead of complex UI elements.
- Maintained absence of glass panels, excessive borders, rounded UI cards, neon glows, and futuristic decorations in favor of absolute positioned, borderless typographic blocks and immersive imagery.
