# Solar Arc Directions

## Current-Engine Fit

- Solar arc is a good fit for this engine because the project already has deterministic ephemeris, chart casting, house computation, and a verified secondary-progressions path.
- The cleanest reuse path is `progressions.js`: solar arc is derived from the progressed Sun, so the existing day-for-a-year convention already matches the standard method.
- `chartCaster.js` gives the natal and progressed longitudes needed for arc calculation, and `houses.js` already provides angle/house geometry for candidate charts.
- `solarReturn.js` is nearby conceptually but not the right primitive. Solar returns solve for the Sun’s return date, while solar arc directions use the Sun’s daily motion as a symbolic key.
- The current engine has no direction subsystem, so this needs a new `rectification/` feature module rather than a small tweak inside `astro.mjs`.
- The current repo’s own notes already treat solar arc as a derivable timing technique and state that interpretation is still manual or planned, which is consistent with adding a dedicated rectification layer now.

## Mathematical Model

Solar arc has two mathematically distinct variants that should not be conflated.

```text
Let λ☉(t) be the Sun’s geocentric ecliptic longitude at UTC datetime t.
Let b be the candidate natal UTC datetime.
Let age be the event age in years.

Progressed datetime:
  tprog = b + age days

True solar arc:
  SA_true = norm360(λ☉(tprog) - λ☉(b))

Mean solar arc / Naibod key:
  SA_mean = age * 0.98564733°
         = age * (0°59′08.33″)

Directed point:
  λdir = norm360(λnatal + SA)

Angular distance:
  sep(a, b) = min(|a - b|, 360 - |a - b|)

Hit condition:
  sep(λdir, λtarget) <= orb
```

- The default implementation should be `SA_true`, because it uses the actual solar motion and is the same quantity implied by the current progressed-chart machinery.
- `SA_mean` should remain an option for compatibility with software that uses the Naibod key or mean solar arc.
- For rectification, each candidate birth time changes the natal Sun longitude, so the arc is candidate-dependent even when the event date is fixed.
- For planet contacts, the standard move is to direct every natal point by the same arc and test aspects to natal target points.
- For angle contacts, the ecliptic solar-arc version adds the same arc to ASC, MC, IC, and DSC longitudes in the natal chart frame.
- For angle contacts, the RA/ARMC solar-arc version advances the meridian key by the solar-arc key, then recomputes angles and cusps from the progressed ARMC and latitude. This is the more exact angle treatment, but it is a second-stage enhancement.
- The practical phase-1 model for this engine should use the ecliptic version, because the current data model is already longitudes-first and the existing house geometry can supply the target angles for scoring.

## Candidate-Grid Implications

- Solar arc is slow, but rectification is still sensitive to birth-time shifts because the candidate birth time changes the natal angle set that solar arcs are tested against.
- A full-day candidate search should start at 2-minute bins, then refine to 1 minute and 30 seconds around the top mass.
- Solar arc scoring should cache per-candidate natal chart data, progressed Sun longitude, arc value, and directed positions. The arc itself is cheap; repeated chart casting is the expensive part.
- Event-date uncertainty matters less than birth-time uncertainty for this technique, but interval-censored events should still be integrated rather than collapsed to a single timestamp.
- The best solar-arc rectification targets are natal angles, luminaries, chart rulers, and other high-value natal planets tied to the event topic.
- The hit threshold should stay tight. A 1-degree orb is already generous for many solar-arc workflows; angle hits can justify going tighter when the event data are strong.
- In the final scoring stack, solar arc should be a fine-grained confirmer, not the only signal. It should sit after coarse pruning from chapter methods such as profections or zodiacal releasing.

## Open-Source Implementations

- `Stellium` is the strongest open-source reference I found for a modern architecture. Its repository advertises an `arc_directions_cookbook.py` with 14 examples covering solar arc, Naibod, lunar, chart ruler, sect, and planetary arcs. That makes it a useful reference for API shape and for multiple direction variants in one package.
- `Astrolog` is the other major reference. Its README explicitly lists secondary progressions and solar arc progressions, exact transit hits, transits to house cusps, and return charts, all exposed through a command-line friendly source tree.
- `OpenAstro2` is a broader open-source astrology library that is useful as a secondary reference for package shape and ephemeris integration, even though I did not confirm solar-arc-specific logic from the snippet I found.
- These projects are useful as implementation templates, but none of them map 1:1 to this repo’s current `astronomy-engine` plus custom-house stack.

## Integration Plan

- Add `rectification/features/solarArc.js` as the canonical solar-arc module.
- Export `solarArcAtAge(birthDate, ageYears, options)` and `directSolarArc(natalChart, arc, options)`.
- Reuse `progressedDate()` and `progressedChart()` from `progressions.js` rather than reimplementing day-for-a-year logic.
- Add `rectification/scoring/solarArcScorer.js` to score directed contacts against event windows.
- Add `rectification/features/angleTargets.js` so the scorer can use ASC, MC, DSC, IC, and later optional cusps in a single place.
- Add a `solar-arc` CLI command in `astro.mjs` for debugging, regression, and manual inspection.
- Default to true solar arc, but expose `method: "true" | "mean"` so the engine can compare Naibod-style behavior against the actual solar motion.
- Keep solar arc separate from transits and solar returns. It should consume the same natal chart data, but its math and scoring are different.
- Use the existing `validate_groundtruth.test.mjs` progression validation as the trust base for the Sun motion calculation, then add solar-arc-specific regression tests on top.
- In the final rectification pipeline, score solar arc after coarse filters and alongside progressed angles, transits to angles, and solar-return emphasis.

## Risks

- Angle math is the main risk. Ecliptic solar arc and RA/ARMC solar arc are related but not identical, and the code should not silently mix them.
- Mean solar arc and true solar arc can diverge over longer spans, so the chosen method must be explicit in output and tests.
- Loose orbs will inflate false positives quickly, especially if the event list is large.
- Because the current engine is not already a direction engine, there is a real risk of hiding doctrine choices inside convenience code. That should be avoided by making the method selection explicit.
- Solar arc should not be treated as a standalone proof of rectification. It is one high-sensitivity scorer inside a broader evidence stack.

## Validation / Tests

- Verify `age = 0` gives `SA_true = 0`.
- Verify `SA_true` is computed directly from the progressed Sun and matches the value returned by the new solar-arc helper exactly.
- Verify that `SA_mean` equals `age * 0.98564733°` within rounding tolerance.
- Verify directed-point contacts behave symmetrically under the angular distance function.
- Build regression tests that compare known-time charts and documented life events against preregistered solar-arc hits.
- Keep fit and validation events separate so the scorer cannot overfit to the same evidence it is later evaluated on.
- Add a test for angle contacts that confirms the same arc can be applied to both planets and axes, with a stricter path reserved later for RA-based angle progression.

## Sources With Links

- Astrodienst Astrowiki, Solar Arc: https://www.astro.com/astrowiki/en/Solar_Arc_Direction
- Astrodienst Astrowiki, Naibodic Arc: https://www.astro.com/astrowiki/en/Naibodic_Arc
- Astrodienst Astrowiki, Directions: https://www.astro.com/astrowiki/en/Directions
- Astrodienst Astrowiki, Naibod Key: https://www.astro.com/astrowiki/en/Naibod_Key
- Astrodienst Astrowiki, Tertiary Directions: https://www.astro.com/astrowiki/en/Tertiary_Directions
- `Stellium` repository: https://github.com/katelouie/stellium
- `Astrolog` repository: https://github.com/koson/astrolog-3
- `OpenAstro2` repository: https://github.com/dimmastro/openastro2
- Local engine references: [progressions.js](/Users/eiko/astrocartography/progressions.js), [solarReturn.js](/Users/eiko/astrocartography/solarReturn.js), [validate_groundtruth.test.mjs](/Users/eiko/astrocartography/validate_groundtruth.test.mjs), [RESEARCH_interpretation_guide.md](/Users/eiko/astrocartography/RESEARCH_interpretation_guide.md)
