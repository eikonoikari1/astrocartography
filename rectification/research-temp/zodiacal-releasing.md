# Zodiacal Releasing

## Current Engine Fit

- The current repo already has the right primitives for ZR: `chartCaster.js` for deterministic chart positions, `houses.js` for ASC/MC and house cusps, and `zodiacalReleasing.js` for an initial Fortune-based timeline.
- For rectification, ZR should move from a single CLI-style helper into a rectification feature module under `rectification/features/zr.js` with snapshot and timeline APIs.
- ZR should be treated as a coarse chapter filter and tie-breaker. It is useful for narrowing candidate birth times and event families, but it should not be the only or dominant minute-level solver.
- The current implementation is structurally useful but incomplete for rectification because it only exposes one lot path, only goes to L2, and uses civil-year style date arithmetic for display.
- The current engine should reuse the existing chart and house math, then add ZR-specific data structures rather than replacing the astronomy stack.

## Mathematical Model

- Use the Valens core: start from the Lot of Fortune for bodily topics and the Lot of Spirit, also called Daimon, for action, reputation, and career topics.
- Keep the day/night inversion explicit.
  - Fortune: day = `ASC + Moon - Sun`, night = `ASC + Sun - Moon`.
  - Spirit: day = `ASC + Sun - Moon`, night = `ASC + Moon - Sun`.
- Major periods advance in zodiacal order starting from the sign containing the chosen lot.
- Each sign’s period length comes from the traditional planetary-year table:
  - Sun 19
  - Moon 25
  - Mercury 20
  - Venus 8
  - Mars 15
  - Jupiter 12
  - Saturn 27
- The period tree should be recursive: L1 is the sign period, L2-L4 are subdivisions of the parent period, preserving the same zodiacal sign order and ruler-year weighting.
- The period tree should be stored in a timeline object with exact UTC start and end timestamps and a query API by date and by age.
- Use a 360-day-year calendar conversion for rendering period boundaries, because that is the common modern software convention for ZR display.
- Keep doctrine-specific annotations separate from the core arithmetic.
  - Peak-period tags are interpretation-layer metadata.
  - Loosing-of-the-Bond tags are transition annotations.
  - Angularity and ruler condition should be scored separately from the period generator.

## Candidate-Grid Implications

- ZR is sensitive to birth-time shifts because the lot longitude depends on the ASC, which depends on the exact birth time.
- In a rectification search, ZR becomes informative when candidate times cross a lot sign boundary or move the lot near one.
- If the lot sign is stable across the current candidate window, ZR should stay in the coarse pruning layer only.
- The practical grid shape should be:
  - 24-hour coarse sweep first
  - 2-minute bins for broad ZR boundary detection
  - 1-minute or 30-second refinement only near sign-boundary windows
- The candidate grid should preserve both local time and UTC time, because ZR output changes with timezone and DST conversion before any astrology is applied.
- Event windows should be interval-censored, not forced to a single date, because ZR is a chapter system and often supports coarse life-phase matching better than exact event timing.

## Open-Source Implementations

- [SiderealAstroPy](https://github.com/aschubauer/SiderealAstroPy) is a small open-source Python implementation that ships a `zrcsv.py` ZR calculator and documents a `Birthchart.calculateZR(lot)` workflow. It uses Swiss Ephemeris and exports CSV period tables.
- [Stellium](https://pypi.org/project/stellium/) and its docs at [Stellium API Reference](https://stellium.readthedocs.io/en/stable/api/index.html) provide a more production-shaped open-source model:
  - `ZodiacalReleasingEngine(chart, lot='Part of Fortune', max_level=4, lifespan=100, method='valens')`
  - `ZodiacalReleasingAnalyzer(...)`
  - `zr_at_age(...)`
  - `zr_at_date(...)`
  - `find_peaks(...)`
  - `find_loosing_bonds(...)`
  - optional `fractal` calculation mode
- Stellium is useful as an architectural reference because it separates chart calculation from timing analysis and already exposes query-by-age/date APIs that are closer to what rectification needs.
- A useful conclusion from the open-source landscape is that ZR should be modeled as an analyzer over a computed chart, not as a special case buried inside the chart engine.

## Integration Plan

- Step 1: Move ZR into a rectification-owned feature module.
  - Add `rectification/features/zr.js`.
  - Expose `fortuneLot`, `spiritLot`, `zrTimeline`, `zrSnapshot`, and `zrAtDate`/`zrAtAge`.
  - Keep the current `zodiacalReleasing.js` as a compatibility wrapper until the rectification pipeline is ready.
- Step 2: Replace the current shallow period output with a full timeline object.
  - Support L1 through L4.
  - Store `lot`, `lotSign`, `birthDate`, `periods`, and `maxLevel`.
  - Add `findPeaks` and `findLoosingBonds` helpers as derived annotations.
- Step 3: Make lot selection doctrine-explicit.
  - Fortune for health and embodiment questions.
  - Spirit for work, reputation, and action questions.
  - Optional lots later, but only after the Fortune and Spirit path is validated.
- Step 4: Use ZR only as a coarse rectification scorer.
  - Boost candidate bins whose period structure matches the event family.
  - Use it to rank years, life chapters, and event domains.
  - Do not use it to force a minute when the lot boundary is not informative.
- Step 5: Integrate with the existing rectification stack.
  - Feed ZR into `rectification/pipeline/triage.js` as a chapter-layer feature.
  - Combine it with transits, progressions, solar returns, and solar arc in the fusion layer.
  - Let the fusion layer control whether ZR is used as pruning, confirmation, or tie-break.
- Step 6: Align CLI and API shape with the rest of the engine.
  - Add a dedicated rectification command for timeline queries.
  - Keep the existing `astro.mjs zodiacal-releasing` command as a diagnostic path only.

## Risks

- The biggest risk is overclaiming precision. ZR is chapter-scale evidence and should not be presented as a minute-level solver by itself.
- The current implementation’s civil-year-style timeline generation is too loose for a proper Valens-style ZR display pipeline.
- Peak-period and Loosing-of-the-Bond rules vary by school and teaching lineage, so they must be stored as explicit doctrine config instead of hidden inside the generator.
- If lot selection is not locked down, the system will become ambiguous and hard to audit.
- Because ZR depends on the exact birth time through the ASC, it can become unstable near lot sign cusps. That instability is a feature for rectification only when the search window is already narrow enough to justify it.

## Validation / Tests

- Unit-test Fortune and Spirit formulas for day and night charts.
- Unit-test sign order and ruler-year lookup against the traditional table.
- Unit-test boundary cases where the lot falls near a sign cusp and a small birth-time change flips the starting sign.
- Round-trip test `zrAtAge(age)` and `zrAtDate(date)` against the same timeline object.
- Compare the timeline output against published examples from Valens-based tutorials and against open-source outputs from SiderealAstroPy and Stellium.
- Add snapshot tests for:
  - L1 only
  - L1-L2
  - L1-L4
  - Fortune versus Spirit
  - 360-day display conversion
- Add rectification-specific tests that verify ZR only changes the ranking when the lot or a release boundary actually changes, not on unrelated minute shifts.

## Sources

- [Vettius Valens, *Anthologies* translated by Mark T. Riley](https://www.skyscript.co.uk/pdf/pubs/texts/valens/griscti/docs/Valens-Anthologies.pdf)
- [Valens Book IV, distribution of chronocratorships starting with Fortune and Daimon](https://www.skyscript.co.uk/pdf/pubs/texts/valens/griscti/docs/Valens-Anthologies.pdf#page=329)
- [Valens Book IV, loosing of the bond and maximum years for each sign](https://www.skyscript.co.uk/pdf/pubs/texts/valens/griscti/docs/Valens-Anthologies.pdf#page=336)
- [Stellium PyPI project page](https://pypi.org/project/stellium/0.15.1/)
- [Stellium API Reference](https://stellium.readthedocs.io/en/stable/api/index.html)
- [Stellium chart types guide](https://stellium.readthedocs.io/en/stable/CHART_TYPES.html)
- [SiderealAstroPy GitHub repository](https://github.com/aschubauer/SiderealAstroPy)
- [AstroApp Zodiacal Releasing help page](https://astroapp.com/help/1/aphesis_zod_release.html)
- [Current engine ZR module](../../zodiacalReleasing.js)
- [Current timing workflow](../../research/workflows/timing.md)
