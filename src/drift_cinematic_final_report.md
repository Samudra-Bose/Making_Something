# DRIFT Cinematic Orchestration Report

## 1. Master Integration Overview
The goal of this phase was to consolidate state and behavior across the codebase to ensure a seamless "continuous interactive film" experience. This requires resolving fighting animations, nested scroll panes, duplicate physics loops, and maintaining global narrative consistency.

## 2. Conflicts Found & Root Causes

### A. Nested and Duplicated Scrolls (The "Boxed Website" look)
- **Root Cause:** When multiple forks were opened (e.g. Origin and Roast side by side), the `ForkPane` component used `overflow-hidden` while its inner children (like `Roast.tsx`) used native `overflow-y-auto`. `AppShell` disabled global scrolling (`overflow-hidden max-h-screen`).
- **Effect:** The user experienced standard "boxed" web scrollbars inside each pane. Furthermore, the `Lenis` instance mounted in `Journey.tsx` was unmounted, completely losing smooth scrolling and velocity-based visual impacts.

### B. GSAP Trigger Fighting
- **Root Cause:** Inside `Origin`, `Roast`, `Brew`, and `Shop`, the `ScrollTrigger` used `scroller: isJourney ? window : containerRef.current`. When in Fork Mode, they expected to be triggered by scrolling inside their container.
- **Effect:** Opening a world inside a Fork pane reset its scroll to `0`, treating it like an independent page rather than a single continuous timeline.

### C. Duplicated / Lost Physics (Reactive BG)
- **Root Cause:** Velocity tracking (`setGlobalVelocity`) and Pointer interactions were fragmented. In Fork mode, `Journey.tsx`'s pointer and scroll velocity impulses were destroyed.

## 3. Orchestration Fixes Applied

### A. Unified Global Scroll (Lenis)
Moved the `Lenis` instantiation to `ExperienceController.tsx` which is ALWAYS mounted. This ensures there is exactly ONE global scroll source running at all times, tracking `globalVelocity` and `scroll` centrally via Zustand. Removed `overflow-hidden` from `AppShell`.

### B. Removing Nested Scrolls
Stripped `overflow-y-auto` from all World components. They are now purely visual layers. 

### C. The "Virtual Scroll Track" (Cinematic 4-Window Mode)
In 4-window (Fork) mode, `App.tsx` now renders an invisible `#global-scroll-track` with `height: 1300vh`. 
This allows the global `window` to continue scrolling the exact same narrative timeline. The absolute `ForkPane`s stay visually pinned on screen, but their interior GSAP timelines scrub perfectly in sync with the global scroll. 
- `Origin` maps to `0vh - 400vh`
- `Roast` maps to `400vh - 700vh`
- `Brew` maps to `700vh - 1000vh`
- `Shop` maps to `1000vh - 1300vh`

### D. GSAP Audit & Refactor
Re-wrote all `ScrollTrigger` definitions inside the World components. 
- **Scroller:** Fixed to `window` for all scenarios.
- **Trigger/Start/End:** Uses dynamic assignment. In `Journey` mode, it uses relative triggers (`trigger: '.st-hero-pin'`). In Fork mode, it uses absolute pixel triggers (`start: '400vh', end: '700vh'`). This allows the visual elements to live inside fixed panes without confusing `ScrollTrigger`.
- **Pinning:** Disabled `pin: true` in Fork mode, since the elements are already inside absolutely positioned, static panes. 

## 4. Final State & Remaining Issues
- **Continuous Canvas:** The website now feels like a unified piece of software rather than a set of nested web pages.
- **Reactive Background:** `ReactiveField.tsx` perfectly picks up velocity spikes and story progression across all 4 windows simultaneously, matching the narrative vibe (turbulent for roast, radial for brew, calm for shop).
- **Reduced Motion:** Verified that media queries gracefully bypass high-frequency spatial tracking.
- **Next Steps:** Monitor performance of the 4-window mode on low-end devices, as 4 concurrent GSAP scrubs on complex filters can be heavy.
