# Secondary Progressions Review

## Verdict

Mostly sound and aligned with the current engine. The brief correctly treats secondary progressions as day-for-a-year chart casting built on `progressions.js`, and it correctly insists that rectification needs angle-aware scoring rather than progressed longitudes alone.

## Mathematically Sound Points

- The core day-for-a-year rule is correct: `P = B + a days`, with fractional ages supported.
- The event-time framing is reasonable if the year-length convention is fixed and documented.
- Keeping progressed planets as simple ephemeris snapshots at `P` matches the current `progressions.js` implementation.
- The insistence on a location-aware wrapper is correct because the current module does not compute progressed houses or angles.
- The minute-level sensitivity claim is directionally correct for angle work: a one-minute birth shift changes the progressed datetime by one minute, which is enough to move progressed angles meaningfully.

## Issues Or Caveats

- The brief conflates secondary progressions with a solar-arc angle convention in `secondary-progressions.md:36-47` and `:77-80`. That is a doctrine boundary problem. `dateCast` is a secondary-progression method; `solarArcMC` belongs to solar arc directions or should be labeled explicitly as a compatibility mode, not as part of the canonical progression definition.
- The `365.2422` convention in `secondary-progressions.md:19-25` is acceptable as a fixed choice, but the brief should say it is an implementation convention, not an intrinsic property of the technique. Otherwise cross-software comparisons will drift if the reference baseline uses a different year-length convention.
- The brief implies the angle method can be treated as a general secondary-progression option, but the engine should validate `dateCast` first and only add alternate angle handling after it has reference vectors. Without that, the implementation will be hard to test against `progressions.js` and external baselines.

## Required Corrections

- Make `dateCast` the canonical secondary-progression mode.
- Move `solarArcMC` out of the core secondary-progression definition, or mark it as a separate compatibility mode with its own tests and documentation.
- Pin the year-length convention in config and test fixtures, and state which reference software it matches.
- Add explicit test vectors for progressed angles so the new wrapper can be compared against a known baseline before scoring logic is added.

## Final Recommendation

Approve the plan after separating secondary progressions from solar-arc angle handling and locking the year-length convention. The rest of the brief is coherent with the current engine and the proposed wrapper/module split is the right shape.
