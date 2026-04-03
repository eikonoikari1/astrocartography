# Fast Timing Review

Reviewed briefs:
- `transits-to-angles.md`
- `secondary-progressions.md`
- `solar-arc-directions.md`

## Coherence

- The three briefs fit together well as a phase-1 rectification stack.
- The dependency order is coherent:
  - transits to angles for exact event triggering
  - progressed angles for developmental timing with angle sensitivity
  - solar arc as a fine-grained confirmer built on the progression layer
- All three briefs correctly keep the new logic in `rectification/` instead of overloading the existing low-level modules.

## Approach

- The transits brief is the most implementation-ready. It maps directly onto the existing bisection-based transit solver and clearly identifies that the missing step is target generalization from planets to angles.
- The secondary-progressions brief correctly isolates the main product risk: progressed-angle conventions vary across software. The recommendation to make the angle method explicit is necessary.
- The solar-arc brief correctly distinguishes true solar arc from Naibod / mean solar arc. That distinction should stay explicit in config and in output payloads.

## Mathematical Accuracy

- `transits-to-angles.md`
  - Core separation math is sound for zodiacal angle contacts.
  - The interval-based event scoring model is appropriate.
  - Caution: this is longitude-based angle scoring, not a full mundane directional geometry. The brief already treats it as a practical phase-1 method, which is correct.

- `secondary-progressions.md`
  - The day-for-a-year formulation is correct.
  - The event-age conversion is acceptable as long as the year-length convention is frozen.
  - The brief correctly identifies that progressed-angle methods differ across products.
  - Main caution: the engine must not silently mix `dateCast` and `solarArcMC` angle conventions.

- `solar-arc-directions.md`
  - The distinction between `SA_true` and `SA_mean` is correct.
  - The recommendation to start with ecliptic solar arc and defer RA/ARMC angle directions is mathematically reasonable for this codebase.
  - Main caution: angle contacts under ecliptic solar arc are useful and practical, but they are not equivalent to primary directions or a full RA-based angle progression framework.

## Recommended Adjustments

- Freeze a single default orb table shared by all three scorers.
- Add a config surface for angle-method selection in progressions before implementation starts.
- Keep solar arc and secondary progressions separate in the code even though they share primitives.
- Require a held-out validation split before claiming minute-level performance from any of these three techniques.

## Bottom Line

- The fast-timing stack is coherent and implementable.
- Transits to angles should ship first.
- Secondary progressions should ship only with explicit angle-method labeling.
- Solar arc should be added after the progression primitives are locked.
