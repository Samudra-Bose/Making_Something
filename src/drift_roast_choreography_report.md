# DRIFT Roast Component Master Polish - Choreography Report

## 1. GREEN (0-18%)
- Bean scale configured from `0.92` to `1.00`.
- Rotation subtle from `-2deg` to `0deg`.
- Typographic layer set up for raw space and minimal movement.

## 2. HEAT (18-38%)
- Bean scale increases from `1.00` to `1.07`.
- Upward drift `y: -3vh` added.
- Rotation transitions from `0deg` to `3deg`.

## 3. GOLD (38-55%)
- Continuous background color shifts set: `Green (#E3E8E0) -> Yellow (#F2E3C6) -> Gold (#D4AF37)`.
- Secondary typography (Warmth, Radiance, Glow) executes horizontal scrolling movement.

## 4. FIRST CRACK (60-68%)
- Reduced motion before crack.
- Crack impulse configured at `0.60`.
- Bean translates `x: 14px` then settles back.
- Main typography scaling pops `1.00 -> 1.15 -> 1.00`.
- Foreground object triggers a `+/-18px` impulse and settles.
- Particle radial explosions completely eliminated.

## 5. DEVELOPMENT (68-90%)
- Complex color progression complete: `Gold (#D4AF37) -> Caramel (#C68E58) -> Chestnut (#8B4513) -> Brown (#5C3A21)`.
- Primary bean rescales safely `1.02 -> 1.10`.
- Sensory notes (`JASMINE`, `CARAMEL`, `COCOA`) sequence softly fading in with slight upward drift.

## 6. CHARACTER (90-100%)
- Motion settles down as "RICH" text emphasizes the single dominant sensory note.

## 7. ROAST -> BREW TRANSITION (end)
- Roasted bean scales up massively.
- Organic mask creates the crop transition.
- Grounds texture enters inside the organic mask smoothly.
- No water droplets/pour added to strictly follow constraints.

## Technical Details
- Added `immediateRender: false` precisely to cross-world fromTo tweens and newly added `fromTo` calls on `.st-roast-bean-img` to avoid unwanted scrub rewinds.
- Confirmed modifications isolated completely inside `src/worlds/Roast.tsx`.
