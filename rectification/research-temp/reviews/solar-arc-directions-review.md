# Verdict

The brief is mostly coherent and the core solar-arc math is sound for planetary contacts. The main weakness is on angle handling: the plan treats the ecliptic version as the practical phase-1 implementation without making clear enough that this is a simplified approximation, not the exact angular-direction model.

# Mathematically Sound Points

- `SA_true = norm360(λ☉(tprog) - λ☉(b))` is the correct true-solar-arc definition, and the brief correctly distinguishes it from the Naibod / mean arc.
- `SA_mean = age * 0.98564733°` is a valid mean-solar-arc constant, so keeping it as an alternate mode is mathematically reasonable.
- The candidate-time dependence is right: changing the natal UTC birth time changes the natal Sun and the candidate angle set, so solar arc must be evaluated per candidate bin.
- Reusing `progressedDate()` and `progressedChart()` as the Sun-motion source is coherent with the current engine, because the engine already defines secondary progressions as day-for-a-year.

# Issues Or Caveats

- The angle section at [solar-arc-directions.md:45-47](/Users/eiko/astrocartography/rectification/research-temp/solar-arc-directions.md#L45) is too casual about adding the same ecliptic arc to ASC/MC/IC/DSC. That is acceptable as a phase-1 heuristic, but it is not the mathematically exact angular-direction model and should not be presented as interchangeable with RA/ARMC directioning.
- The validation claim at [solar-arc-directions.md:76](/Users/eiko/astrocartography/rectification/research-temp/solar-arc-directions.md#L76) is too broad. `validate_groundtruth.test.mjs` validates progressions and solar returns, but it does not validate solar-arc direction math. It can support Sun-motion sanity checks, not solar-arc correctness.
- The brief blurs two separate concerns: computing a directed arc and generating target angles. The current `houses.js` machinery is a target-angle provider, not a solar-arc direction solver.

# Required Corrections

- Make the API contract explicit: `method: "true" | "mean"` and `angleModel: "ecliptic" | "RA_ARMC"`, with the ecliptic option clearly labeled as an approximation for angles.
- Replace the progression-validation claim with a narrower statement: reuse progressions tests for `progressedDate` and Sun-motion sanity only, then add solar-arc-specific regression fixtures for exactness.
- Add a note that angle directioning is separate from target-angle geometry. Do not let the module silently fall back from an exact angular model to an ecliptic shortcut.
- If the phase-1 implementation stays ecliptic-only, the brief should say that explicitly as a compromise for scoring, not as the standard solar-arc method.

# Final Recommendation

Approve with revisions. The planet-arc math is correct, the reuse path through the progression module is coherent, and the candidate-grid plan is sensible. The brief needs a tighter contract for angle directioning and a narrower validation claim before it is implementation-ready.
