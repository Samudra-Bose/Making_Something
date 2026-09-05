# DRIFT - Cinematic Scroll Overhaul Report

## Architectural Transformation

The core issue has been resolved: **DRIFT is now a true single-timeline continuous scroll experience** in its default state, while preserving the spatial multi-world fork architecture for deliberate branching.

### 1. Global Scroll Unlocked
- Removed artificial `h-[100dvh] overflow-hidden` constraints from `AppShell`.
- Created `<Journey />` which linearly stacks `<Origin />`, `<Roast />`, `<Brew />`, and `<Shop />`.
- Each component detects if it is running in `Journey` mode (`isJourney={true}`) and switches from acting as an independent scroll window to becoming a native height element inside the global document.
- Installed and configured **Lenis** globally inside `Journey.tsx` to provide incredibly smooth, dampened native scrolling that GSAP binds to.

### 2. Cinematic Choreography Refactor

We successfully implemented multiple advanced Awwwards-style scroll techniques:

#### A. Origin (Pinned Cinematic Hero)
The Entry sequence perfectly hands off to Origin. Instead of standard parallax, the hero uses a **Pinned Sequence**:
- The hero stays pinned for `300vh` of scroll.
- **Scroll Phase 1:** The text splits line-by-line, moving at different depths. The background scales slightly.
- **Scroll Phase 2:** The "ETHIOPIA" text slides diagonally behind the expanding subject image, creating a profound sense of depth.
- **Scroll Phase 3:** The subject image expands to fill `100vw/100vh`, color temperature shifts, and it becomes the transition canvas into the Roast phase.

#### B. Roast (Horizontal Narrative Mapping)
Instead of forcing the user to scroll vertically through stacked sections, **Roast translates vertical scrolling into a horizontal journey**:
- The browser continues scrolling vertically seamlessly.
- The `Roast` content container is pinned and slides horizontally from `01 - Green` through `07 - Handoff`.
- The user feels like they are moving along a conveyor timeline. 
- Auto-fork transitions were disabled during Journey mode so the timeline never abruptly splits.

#### C. Unified Reactivity
Because `activeWorld` is now dynamically synchronized to global scroll via Intersection Observers & GSAP `onEnter` callbacks across the Journey timeline, the `<ReactiveField />` (background canvas) smoothly morphs its physics and visual language to match the current stage without needing an abrupt page state change.

## Verification
- All UI "discreteness" has been removed through continuous `min-h-screen` layouts.
- Background canvases transition smoothly as the user crosses thresholds.
- Buttons and navigation now elegantly use `scrollIntoView` when in the Journey experience instead of trapping the user in a new pane.
