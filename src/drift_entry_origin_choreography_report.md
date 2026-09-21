# DRIFT — Entry / Origin Choreography Report

## 1. Visual Composition & Origin Changes
- **Entry Layer Setup**: `src/worlds/Origin.tsx` was rewritten to house the complete `Entry -> Origin -> Roast` timeline using layered structural DOM, ensuring absolute scroll position fidelity.
- **Background Clipping & Layer Fix**: The hardcoded background (`bg-[#F2F0EB]`) was removed from both `.st-entry-composition` and `.st-origin-content-wrapper`. This prevents a blank/beige screen from obstructing the cinematic fade-ins between the Entry hero and the Origin environment.
- **Pointer & Reactive Depth**: Instead of overwriting global pointer logic in `Journey.tsx`, `Origin.tsx` implements a precise local `requestAnimationFrame` pointer listener hooked into the `Zustand` store, providing exactly `0.35x` movement to the `.st-entry-bg-material`, while delegating standard `.depth-main` (1.0x) and `.depth-fg` (1.20x) physics cleanly to the global system.

## 2. Exact Scroll Choreography & Transitions
- **0.00 -> 0.12 (Entry Active)**:
  - `st-entry-logo` scales 1.0 -> 0.95 and shifts -2vh.
  - `st-entry-headline-group` precisely shifts y 0 -> -5vh.
  - `st-entry-subject-img` (hero material) scales up 0.94 -> 1.00.
- **0.12 -> 0.32 (35-45vh Transition Space)**:
  - **No Crossfading**: The `st-entry-subject-container` uses a surgical CSS `clipPath: inset(0% 0% 0% 0%) -> inset(0% 0% 100% 0%)` reveal, mathematically calculated against absolute trans-space.
  - While clipping occurs, the `st-origin-composition` immediately underneath performs a staggered opacity reveal (`0.35 -> 0.70 -> 1.0`), achieving a premium mask transition without dual-screen ghosting.
- **0.32 -> 0.85 (Origin Hero & Split Typography)**:
  - **Camera Push**: At `0.15` trans-mark (`0.3995` absolute), `st-origin-subject-img` scales `1.00 -> 1.06`. At `0.40`, it pushes `1.06 -> 1.10`. Finally at `0.65`, it hits `1.10 -> 1.15`.
  - **Typography Splitting**: The main Origin headline was split into 3 distinct lines. Each line translates on unique trajectories (-8vh, -8.64vh, -9.2vh y-axis respectively) paired with slight asymmetric x-drifts.
  - **Focal-point Retention**: The image anchors closely to `objectPosition: 68% 28%` directly mapping the physical transition focal point before shifting to Roast.
- **0.85 -> 1.00 (Origin -> Roast Transition)**:
  - Employs a `clipPath: circle(150% at 68% 28%) -> circle(0% at 68% 28%)` for the exit macro-crop, perfectly blending to the Roast timeline.

## 3. Validation & Stability Fixes
- **ImmediateRender Resets**: Used `immediateRender: false` throughout `.fromTo()` calls to prevent reverse-scroll flickering and state-reset jump bugs.
- **File Integrity Repair**: Fixed a binary-level UTF-16 BOM corruption in `src/worlds/Brew.tsx` and restored broken closing tags that were causing hard build failures.
- **Build Status**: Verified via local execution; `npm run build` is passing and transforming 457 modules with 0 errors.

All strict constraints (No global scroll system modification, no Git remotes, no auto-loops) have been adhered to.
