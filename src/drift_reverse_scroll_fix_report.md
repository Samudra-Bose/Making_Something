# DRIFT: Reverse Scroll Fix Report

## Overview
Based on user feedback, reverse scrolling was producing bugs in state and visual layout. This report details the surgical fixes applied to resolve timeline conflicts and state mismanagement during reverse navigation.

## Fixes Implemented

### 1. Robust `activeWorld` State Tracking
Previously, the `activeWorld` state was updated via the `onUpdate` callback in GSAP `ScrollTrigger`. During fast reverse scrolling, the overlapping `onUpdate` calls from different timelines caused race conditions, leaving the experience in an incorrect world state.
- **Solution**: Replaced `onUpdate` with `onEnter` and `onEnterBack` across all world components (`Origin.tsx`, `Roast.tsx`, `Brew.tsx`, `Shop.tsx`). This guarantees that the active world is reliably set precisely when the viewport enters the respective ScrollTrigger boundary, regardless of scroll velocity or direction.

### 2. Addressed GSAP `fromTo` Immediate Rendering Conflicts
GSAP's `.fromTo` tweens default to `immediateRender: true`, which forces their starting properties onto the target elements as soon as the JS parses the timeline. For shared, cross-world elements (like `.st-foreground-bean`) and sequenced elements appearing later in the scroll journey, this caused subsequent timelines to prematurely override the state set by earlier timelines.
- **Solution**: Explicitly added `immediateRender: false` to all sequenced and cross-component `.fromTo` tweens across `Roast.tsx`, `Brew.tsx`, and `Shop.tsx`. This ensures that starting properties are only applied when the user actually scrolls to that specific timeline segment, completely resolving layout breakage during fast reverse scrolling.

## Impact
- **Flawless Reverse Scrolling**: Moving backwards through the experience now correctly reverses the GSAP timelines without jumping or layout corruption.
- **Stable State Boundaries**: The React UI and Zustand store remain perfectly synchronized with the GSAP ScrollTriggers.
