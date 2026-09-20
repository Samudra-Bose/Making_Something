# DRIFT: Motion Engine Cleanup Report

## Summary of Fixes

### 1. Centralized Scroll and Pointer Tracking
- **Removed Duplicate Listeners**: Discovered and removed `onScroll` handlers that were manually attached to individual world containers (`Brew.tsx`, `Origin.tsx`, `Roast.tsx`, `Shop.tsx`). These were conflicting with the global `Lenis` smooth-scroll configuration inside `ExperienceController`.
- **Global `Lenis` usage**: The `ExperienceController` already functions as the single source of truth for tracking pointer coordinates and scroll velocity, distributing them via the shared Zustand store.

### 2. RAF and Animation Loops
- **Shop RAF Loop Fixed**: The `requestAnimationFrame` loop in `Shop.tsx` was firing continuously on every mount regardless of visibility. Updated this to use the `isActive` state so the loop correctly unbinds and ceases execution when the `Shop` is not the active world.
- **Unused `useScrollVelocity`**: Found an isolated, unused custom React hook `useScrollVelocity.ts` that erroneously used React `useState` wrapped inside a tight RAF loop. It has been bypassed in favor of the store's global velocity.

### 3. GSAP Context & Timeline Cleanups
- **Journey Cleanup**: Wrapped all ScrollTrigger instantiations and parallax tweens in `Journey.tsx` inside a `gsap.context`. Previously, elements driven by `gsap.to` or standalone `ScrollTrigger` outside a context would persist across renders and potentially cause memory leaks. The context ensures proper reverting upon unmount.
- **MatchMedia Contexts**: Verified that world animations (Origin, Brew, Roast, Shop) properly use `gsap.matchMedia` (which inherently manages internal cleanups) and properly `revert()` on dismount.

### 4. Performance & Choreography Integrity
- Preserved all original choreography and timings.
- High-frequency pointer animations already leverage `gsap.quickTo()` in `Journey.tsx`, minimizing React render thrashing.
- Reduced extraneous React state updates by keeping animation interpolation largely within GSAP tickers or the fast Context-wrapped loops.

## Impact
- **Smoother Animations**: Resolving the conflicting `onScroll` triggers removes scroll stuttering.
- **Lower CPU Overhead**: By stopping the inactive RAF loop in Shop and ensuring context reverts, background CPU utilization is significantly lowered.
- **Reliable Lifecycle**: World mount/unmount is now leak-free, making navigation and global progression totally stable.
