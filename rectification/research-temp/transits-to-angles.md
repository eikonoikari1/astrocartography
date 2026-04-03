# Transits To Angles

## Current-Engine Fit

- The current engine already has the key primitives for this technique: exact planetary transit search in [transits.js](/Users/eiko/astrocartography/transits.js), angle computation in [houses.js](/Users/eiko/astrocartography/houses.js), deterministic chart casting in [chartCaster.js](/Users/eiko/astrocartography/chartCaster.js), and timezone normalization in [profile.js](/Users/eiko/astrocartography/profile.js).
- `transits.js` currently searches natal planet longitudes only. Rectification by transits to angles needs the same solver, but with natal targets expanded to `ASC`, `MC`, `DSC`, `IC`, and later selected cusps and lots.
- The right fit is a new `rectification/` subsystem that consumes the existing chart and transit primitives rather than rewriting them. The current astrocartography scoring code in [astro.mjs](/Users/eiko/astrocartography/astro.mjs) should stay separate.
- This technique is a good phase-1 rectification candidate because transits to angles are one of the highest-sensitivity event triggers and are already aligned with the repo’s exact-search infrastructure.

## Mathematical Model

- Let a candidate birth time be `b`. For that candidate, compute the natal chart `C_b`, especially the angle longitudes `A_b = {ASC_b, MC_b, DSC_b, IC_b}`.
- For a transit body `p`, event time `t`, natal angle `a`, and aspect angle `α` in `{0°, 60°, 90°, 120°, 180°}`, define the signed separation:

```text
d(t; b, p, a, α) = wrap180(λ_p(t) - λ_a(b) - α)
```

- `λ_p(t)` is the geocentric ecliptic longitude of the transiting body at time `t`.
- `λ_a(b)` is the candidate-dependent natal angle longitude.
- `wrap180(x)` maps the angular difference into `(-180°, 180°]`.
- A perfect transit hit occurs when `d = 0`. The current bisection logic in [transits.js](/Users/eiko/astrocartography/transits.js) already solves this kind of root-finding problem for planet-to-planet aspects.
- For a dated event window `I_e = [t0, t1]`, score the candidate by the minimum angular miss inside the window:

```text
miss(e, b, p, a, α) = min_{t in I_e} |d(t; b, p, a, α)|
```

- A practical candidate score is a weighted sum over events, bodies, angles, and aspects:

```text
S(b) = Σ_e Σ_p Σ_a Σ_α w(p, a, α) · g(miss(e, b, p, a, α))
```

where `g` can be a quadratic proximity kernel such as `max(0, 1 - miss/orb)^2`.
- If exact event timestamps are available, evaluate at the event time first. If only date ranges exist, integrate over the interval instead of collapsing to a point.
- Applying/separating state should be preserved. The current code already approximates applying by sampling just before and after the exact hit; that logic should be kept for angles as well.

## Candidate-Grid Implications

- Transits to angles are minute-sensitive because small birth-time changes shift the natal ASC and MC quickly. The rectification grid should therefore be fine enough to catch changes in angle longitudes, not just planet positions.
- A 2-minute coarse grid is a sensible default for a 24-hour search. Refinement should step to 1 minute, then 30 seconds around the posterior mass if the evidence supports it.
- Date-only events should be normalized to local-day intervals, not single timestamps. The evidence model must keep that interval structure all the way into scoring.
- Candidate scoring should prioritize angle hits over generic planet-to-planet hits because angle contacts are the actual rectification signal.
- High latitudes need explicit handling. [houses.js](/Users/eiko/astrocartography/houses.js) falls back to equal houses above 60° latitude for cusp work, but `ASC`/`MC` still remain available. That is acceptable for this technique, but the fallback should be logged and treated as a sensitivity risk for cusp-based extensions.

## Open-Source Implementations

- [TimePassages support docs](https://support.astrograph.com/support/solutions) describe rectification workflows that use transits, progressions, solar arcs, and angle sensitivity. The manual-style guidance is useful because it treats ASC/MC as the main minute-level levers rather than planetary longitudes.
- [Kerykeion](https://kerykeion.net/pydocs/kerykeion) has an explicit `create_transit_chart_data(...)` API with `active_points` that includes `Ascendant`, `Medium_Coeli`, `Descendant`, and `Imum_Coeli`. It also exposes `axis_orb_limit`, which is a useful pattern for keeping angle orbs separate from planet orbs.
- [OpenAstro2](https://github.com/dimmastro/openastro2) provides transit chart generation on top of Swiss Ephemeris and supports high-precision chart calculations. Its architecture is useful as a reference for a clean transit-chart API.
- [Astrolog](https://www.astrolog.org/ftp/updat640.htm) explicitly supports transit-to-natal graphs and transit-to-natal time searches. That makes it a useful oracle for validating aspect detection, hit ordering, and repeated transit passes.
- The implementation pattern across these tools is consistent: keep a chart model, allow a configurable point list, and evaluate transits against both planets and angle points with separate orb handling.

## Proprietary Workflow References

- [TimePassages rectification article](https://support.astrograph.com/support/solutions/articles/66000530419-does-timepassages-have-a-rectification-module-) is useful because it explicitly frames rectification as shifting the chart until ASC and other placements line up with life events.
- [TimePassages manual PDF](https://www.astrograph.com/doc/Manual6.pdf) explicitly mentions chart rectification, `Rising and MC` interpretations, and a method based on adjusting the Rising Sign and checking how the chart changes.
- These are not open-source, but they are good UX and workflow references for how a user-facing rectification tool can expose angle-driven iteration.

## Integration Plan

- Add a new rectification module family under `rectification/` instead of extending the astrocartography scoring path.
- Introduce an `angleTargets` helper that returns natal `ASC`, `MC`, `DSC`, and `IC` for each candidate birth time.
- Extend the transit search API so targets can be either planet longitudes or angle longitudes. Keep the default planet-only behavior unchanged for existing CLI users.
- Build a `transitScorer` that accepts event intervals, candidate angle targets, and a frozen orb table. It should output per-event hits, exact hit times, applying/separating flags, and a candidate score trace.
- Make `rectification/` produce ranked candidate bins plus an uncertainty interval, not a single forced minute.
- Add a CLI entry point for rectification-only workflows, leaving `astro.mjs transits` as the low-level primitive and putting candidate-fusion logic in the new subsystem.
- Use the existing transit root finder instead of reimplementing ephemeris logic. The main new math is the inverse problem over candidate birth times, not the planet transit solver itself.
- Preserve provenance in the evidence layer. Event dates, event windows, source grades, and timezone assumptions must stay separate from the score.

## Risks

- Loose orb rules will overfit. This method is especially vulnerable to finding many plausible hits if the orb table is not frozen before evaluation.
- False precision is a real risk because ASC and MC react strongly to birth-time perturbations. The output should stay interval-based unless the evidence is unusually strong.
- If the event dataset is noisy, transit-to-angle scoring can still produce a convincing but wrong peak. That makes provenance and held-out validation mandatory.
- High-latitude charts are harder to generalize because angle geometry and cusp behavior become less stable. That should be reported, not hidden.

## Validation / Tests

- Compare exact transit hits against [Astrolog](https://www.astrolog.org/ftp/updat640.htm), [Kerykeion](https://kerykeion.net/pydocs/kerykeion), and [OpenAstro2](https://github.com/dimmastro/openastro2) on the same birth/event inputs.
- Build known-time rectification fixtures and perturb the birth time by ±1, ±2, ±4, and ±8 minutes to verify that the score peaks near the true time.
- Test that `ASC` and `MC` move enough between adjacent bins to make the grid separable, and that 30-second refinement changes the score ordering when the case is genuinely minute-sensitive.
- Verify applying/separating labeling for repeated transit passes, especially retrograde planets that make multiple hits to the same angle.
- Validate interval handling by giving date-only events and confirming the scorer integrates over the full local-day window instead of treating the event as a point.
- Cross-check against the existing [transits.js](/Users/eiko/astrocartography/transits.js) bisection output for planet-to-planet hits so the generalized angle path does not regress the current solver.

## Sources With Links

- [Astronomy Engine GitHub](https://github.com/cosinekitty/astronomy)
- [Astronomy Engine JS docs](https://sx.qaiu.top/astronomy/source/js/)
- [Swiss Ephemeris manual PDF](https://www.astro.com/swisseph/swisseph.pdf)
- [TimePassages support docs](https://support.astrograph.com/support/solutions)
- [TimePassages rectification article](https://support.astrograph.com/support/solutions/articles/66000530419-does-timepassages-have-a-rectification-module-)
- [TimePassages manual PDF](https://www.astrograph.com/doc/Manual6.pdf)
- [Kerykeion API docs](https://kerykeion.net/pydocs/kerykeion)
- [OpenAstro2 GitHub](https://github.com/dimmastro/openastro2)
- [Astrolog 6.40 changes](https://www.astrolog.org/ftp/updat640.htm)
- [Current transit solver](/Users/eiko/astrocartography/transits.js)
- [Current house solver](/Users/eiko/astrocartography/houses.js)
- [Current chart caster](/Users/eiko/astrocartography/chartCaster.js)
