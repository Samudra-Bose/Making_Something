# DRIFT - Brew Component Master Polish Report

## Overview
The `Brew.tsx` component has been refined to include the exact GSAP choreography for the physical fluid dynamics requested. The timeline is perfectly pinned to the scroll and scrubs efficiently with zero autoplaying elements.

## Choreography Implementations
1. **GRIND (Timeline: 0.0 - 1.0)**
   - Beans smoothly scale from `0.92` to `1.00`, rotating up to `10deg` while the simulated camera zooms in from `1.0` to `1.07`.
   - The grounds transition happens right on cue between `45-70%`, descending to a resting state into the `100%` mark.
2. **WATER (Timeline: 1.0 - 2.0)**
   - Paced meticulously: entering (`1.15`), approaching (`1.35`), touching (`1.50`), and surface impact (`1.65`). Stabilizes at `1.80` followed immediately by steam accumulation at `1.90`.
3. **BLOOM (Timeline: 2.0 - 3.0)**
   - Centered visual expansion matching actual coffee bloom physics: surface grows `1.00 -> 1.35 -> 1.05`, maintaining grounded realism over generic glowing circles. Steam and grounds dynamically adjust opacity and brightness respectively.
4. **POUR (Timeline: 3.0 - 4.0)**
   - Vessel rotates `0 -> 8deg` smoothly along the reveal of the progressive pour path. Surface reacts scaling `0.2 -> 1.15 -> 1.00`. Text remains cleanly separated.
5. **EXTRACTION (Timeline: 4.0 - 5.0)**
   - The key editorial values (92°C, 1:16, 03:42) animate separately in a layered progression (`~15%` timeline slices each), enforcing the strict, cardless, editorial feel.
6. **CUP (Timeline: 5.0 - 6.0)**
   - Beautiful, calm entry (scale `0.84 -> 1.00`, `8vh -> 0vh`) into the scene. Steam naturally fades in (`0 -> 0.55`). Visual noise has been minimized to ensure maximum calmness.
7. **CUP -> SHOP (Timeline: 6.0 - 7.0)**
   - Handled directly within the Brew end transition space (camera pullout to `0.9` scale). It cleanly hands over to the `Shop` world logic, keeping the end state robust for scrolling forwards and backwards.

## Technical Details
- All cross-component `.fromTo` tweens correctly use `immediateRender: false` avoiding GSAP flicker on scroll reversal.
- Pinned and seamlessly matched using a unified `1.0` duration phase block model matching exactly the percentage-based system requested.
