# DRIFT Visual Composition & Asset Quality Pass

## Overview
A comprehensive visual composition and asset quality pass was executed across the DRIFT experience (`Entry.tsx`, `Origin.tsx`, `Roast.tsx`, `Brew.tsx`, `Shop.tsx`) to implement premium, asymmetric editorial design patterns. The goal was to eliminate empty, generic, or symmetrical layouts while ensuring that the coffee material inherently dominates 35-55% of the visual field in each state.

## 1. Origin & Entry (`Origin.tsx`)
**Weaknesses Found:**
- The entry "DRIFT" logo was perfectly centered, resulting in a generic, static feel.
- The hero image of the coffee cherries was too small (45vw desktop / smaller mobile) and symmetrically placed.
- Metadata was tucked into standard corners.

**Fixes Applied:**
- Shifted the Entry sequence to an asymmetric left-aligned structure.
- Increased the primary hero image scale (up to 85vw on mobile, 55vw on desktop) using a cinematic intentional crop (`object-position: 70% 30%`).
- Typography now spans behind and across the image boundary using `mix-blend-difference` to integrate text and imagery.
- The `Reactive_BG` layer opacity was aggressively subordinated to ensure content dominance.

## 2. Roast (`Roast.tsx`)
**Weaknesses Found:**
- Reliance on cheap-looking gradients (heat distortion) and CSS shapes/blurs (First Crack radial displacement) to communicate roasting.
- The central bean was too small (35vw) and centered.
- Typography was loosely scattered without intent.

**Fixes Applied:**
- Removed unnecessary heat distortion gradients and radial blurs.
- Increased the central bean's size significantly (80vw mobile, 45vw desktop) and placed it asymmetrically on the right edge.
- Shifted all typography into an asymmetric, layered structure. "DEVELOPMENT", "FIRST CRACK", and sensory notes now use `mix-blend-difference` and overlap the primary subject matter.
- Visual hierarchy now correctly handles the transition without relying purely on CSS tricks.

## 3. Brew (`Brew.tsx`)
**Weaknesses Found:**
- Empty, centered background colors carrying the load.
- Over-reliance on vector/CSS paths for the pour sequence.
- Images were used as full-screen backgrounds rather than hero subjects.

**Fixes Applied:**
- Transformed the layout to feature one unmistakable, massive hero object per stage.
- **Grind & Water**: Massive crops of grounds/water overlapping the screen asymmetrically.
- **Bloom & Pour**: A massive 60vw vessel intentionally pushed off the screen boundary to create negative space tension. Typography heavily overlaps the vessel.
- **Cup**: The cup was scaled up to a massive 120vw (mobile) / 60vw (desktop), overflowing the bottom-right corner.

## 4. Shop (`Shop.tsx`)
**Weaknesses Found:**
- Standard e-commerce 50/50 split.
- Product wrapper had cheap-looking drop shadows, borders, and a generic label.

**Fixes Applied:**
- Removed all drop shadows and unnecessary borders from the product wrapper.
- Converted to a clean, borderless container relying entirely on the visual weight of the imagery and the typography.
- Shifted the layout to be heavily typographic, with massive display text (`mix-blend-multiply`) overlapping the content. The layout is highly asymmetric and relies on negative space.

## A/B Test: Static Layout & Reduced Motion
As requested, an A/B test was performed by simulating a 0-opacity `ReactiveField`. 
**Result:** The layout maintains extreme structural integrity. Because the coffee visuals and massive typography were scaled up to take 45-60% of the visual space with strong intentional overlapping and asymmetric positioning, the design no longer relies on the background animation to fill space. It remains highly premium, editorial, and readable in a static state, completely fulfilling the mobile and reduced-motion requirements.
