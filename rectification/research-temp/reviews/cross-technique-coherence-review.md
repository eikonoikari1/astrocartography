# Cross-Technique Coherence Review

## Overall Verdict

The briefs are mostly coherent as a set. They converge on the same architecture: a separate `rectification/` subsystem, a candidate-time grid, explicit evidence objects, frozen orbs, and coarse-to-fine scoring. The main gaps are not about overall direction, but about terminology and a few mathematical claims that need normalization before implementation.

The largest coherence risks are solar-return sensitivity, progression-versus-solar-arc naming, and zodiacal-releasing documentation that needs to match the current engine’s actual support level.

## Consistent Patterns

- Every brief keeps rectification separate from the current astrocartography scoring path in `astro.mjs`.
- Every brief treats rectification as candidate-grid inference, not a single-point lookup.
- The annual layers are consistently framed as coarse priors or confirmers rather than minute-level solvers.
- All briefs prefer fixed orbs, traceable scoring, and interval-censored evidence over vague narrative matching.
- Primary directions are consistently treated as incompatible with the current longitude-first engine and as a research-only or sidecar track.

## Conflicts Or Inconsistencies

- The solar-returns brief contains a material sensitivity error. A 1-hour natal birth-time error shifts the solar return by about 1 hour, not 1 minute. That needs correction before any shared implementation assumptions are built on it.
- The secondary-progressions and solar-arc briefs need stricter method separation. Secondary progressions should own the day-for-year progressed chart; solar arc should remain a separate derived transform, not a blurred alternate progression mode.
- The solar-arc brief is correct to call the ecliptic path a phase-1 approximation, but it needs to stay explicit that RA/ARMC angle progression is a different, stricter model.
- The zodiacal-releasing brief understates the current engine’s capability by saying it only goes to `L2`. The current `zodiacalReleasing.js` already supports recursive generation through `L4` when requested, so the brief should be rewritten to match that reality.
- The zodiacal-releasing brief also needs to treat the `360-day-year` conversion as display-only, not source-of-truth state.
- The annual-profections brief is mathematically sound, but its language around `completedAge`, `ASC`-based whole-sign mapping, and year-lord terminology should be normalized so it cannot be misread as quadrant-house logic.
- The transits-to-angles brief’s scoring core is mathematically correct in shape, but `min_{t in I_e}` is too loose unless the evidence layer distinguishes exact timestamps from interval-censored events and freezes orb policy up front.
- The primary-directions brief is internally coherent, but its terminology still needs final freezing. `zodiacal`, `mundane`, `Regiomontanus-style`, and `Topocentric / Polich-Page` should remain distinct labels, because they are not interchangeable doctrines.

## Required Normalization Changes

- Standardize one evidence schema across all techniques: exact timestamp, date window, and interval-censored event must be represented differently.
- Standardize technique labels:
  - `secondary progressions` for the day-for-year chart
  - `solar arc` for the derived arc transform
  - `annual profections` for whole-sign year lords
  - `zodiacal releasing` for Fortune/Spirit chapter timing
  - `primary directions` for the separate geometry-heavy track
- Make `true` versus `mean` solar arc an explicit method choice, not an implicit fallback.
- Keep the RA/ARMC solar-arc angle path separate from the ecliptic approximation path.
- Rewrite the ZR brief so it matches the current recursive L1-L4 implementation and clearly marks peak-period and Loosing-of-the-Bond logic as doctrine overlays.
- Keep primary directions under a separate research-only subtree or sidecar architecture until it has its own benchmark harness.

## Recommended Implementation Order

1. Build the shared rectification infrastructure first: candidate grid, evidence objects, angle targets, frozen orb policy, and posterior fusion.
2. Implement the coarse annual layers next: annual profections, zodiacal releasing, and solar-return scoring.
3. Add the minute-sensitive layers after that: transits to angles, secondary-progressions rectification, and solar arc.
4. Leave primary directions for last, in a separate research-only path with its own geometry and validation model.

