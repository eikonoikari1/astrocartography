# Rectification Research Synthesis

## Status

Completed:
- per-technique research briefs
- per-technique review notes
- cross-technique coherence reviews

Main brief files:
- `transits-to-angles.md`
- `secondary-progressions.md`
- `solar-arc-directions.md`
- `annual-profections.md`
- `solar-returns.md`
- `zodiacal-releasing.md`
- `primary-directions.md`

Main review files:
- `reviews/transits-to-angles-review.md`
- `reviews/secondary-progressions-review.md`
- `reviews/solar-arc-directions-review.md`
- `reviews/annual-profections-review.md`
- `reviews/solar-returns-review.md`
- `reviews/zodiacal-releasing-review.md`
- `reviews/primary-directions-review.md`
- `reviews/fast-timing-review.md`
- `reviews/annual-and-chapter-review.md`

## Normalized Conclusions

### Strong Phase-1 Fit

- `transits to angles`
- `secondary progressions`
- `solar arc directions`

These techniques fit the current engine because they reuse:
- `chartCaster.js`
- `houses.js`
- `transits.js`
- `progressions.js`

But they need a separate `rectification/` subsystem for:
- candidate-time grids
- evidence objects
- technique-specific scorers
- posterior fusion

### Coarse Or Annual Layers

- `annual profections`
- `solar returns`
- `zodiacal releasing`

These should not be treated as minute-level solvers.

Recommended role:
- profections: yearly activation prior
- solar returns: annual overlay and confirmation
- zodiacal releasing: chapter structure and tie-breaker near lot boundaries

### Research-Only Track

- `primary directions`

Primary directions are materially incompatible with the current engine because they need a dedicated equatorial and directional geometry layer:
- `RAMC`
- oblique ascension
- ascensional difference
- semi-arcs
- meridian distance
- explicit time keys

Recommended placement:

```text
rectification/research/primary-directions/
```

## Mathematical Corrections From Review

### Transits To Angles

- The aspect-separation math is sound.
- The scoring loop should not rely only on `min_{t in I_e}` for wide event windows.
- Interval-censored evidence needs a stricter likelihood model.
- Cusp-based extensions should stay phase 2 because high-latitude fallback in `houses.js` weakens them.

### Secondary Progressions

- Day-for-year progression is sound.
- `dateCast` should be the canonical secondary-progression mode.
- Any `solarArcMC` style angle handling should stay separate or be labeled very explicitly.
- The year-length convention must be frozen.

### Solar Arc Directions

- True solar arc is the right default.
- Mean solar arc / Naibod should remain an explicit option.
- Ecliptic angle shifting is acceptable for a first pass, but it is an approximation.
- RA/ARMC angle handling is a later refinement, not something to blur into the default.

### Annual Profections

- The core sign-cycle math is sound.
- Keep terminology precise: completed age, profected sign, profected house, year lord.
- Keep whole-sign logic and traditional rulers explicit.
- Do not let profections act like a minute-level solver.

### Solar Returns

- Return-finding math is sound.
- One sensitivity claim in the research brief was wrong and must stay corrected:
  - a `1 hour` natal birth-time error shifts the solar return by about `1 hour`, not `1 minute`
- Return-location policy must be explicit before wiring scoring.

### Zodiacal Releasing

- Core ZR math is sound.
- The current repo already supports recursive generation beyond L2 when requested.
- Fortune/Spirit depends on the day-chart test, so that dependency should be validated.
- `360-day-year` conversion should stay display-only, not source-of-truth state.

### Primary Directions

- The staging recommendation is correct: do not place primary directions in phase 1.
- Freeze one canonical method bundle before any implementation:
  - zodiacal or mundane
  - direct or converse
  - time key
  - promissor/significator set
- Benchmark against at least two external oracles before letting the output influence the main posterior.

## Recommended Implementation Order

1. `transits to angles`
2. `secondary progressions`
3. `solar arc directions`
4. `annual profections`
5. `solar returns`
6. `zodiacal releasing`
7. `primary directions` as research-only

## Required Normalization Before Coding

- Freeze orb policy for all fast-timing scorers.
- Freeze interval handling for event evidence.
- Freeze progression angle method.
- Freeze solar-arc method labels.
- Freeze profection doctrine:
  - whole-sign
  - traditional rulers
- Freeze ZR doctrine:
  - Fortune vs Spirit
  - display-calendar convention
- Freeze primary-direction method bundle if that track is pursued.

## Architecture Direction

All technique work should stay under a dedicated rectification subsystem with this shape:

```text
rectification/
  time/
  data/
  features/
  scoring/
  pipeline/
```

The existing low-level engine should remain reusable and mostly unchanged.
