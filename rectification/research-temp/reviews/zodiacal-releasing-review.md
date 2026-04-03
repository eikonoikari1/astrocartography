# Zodiacal Releasing Review

## Verdict

The brief is directionally correct and coherent. It captures the right role for zodiacal releasing in this engine as a coarse chapter-layer feature, not a minute-level rectifier, and the integration shape fits the existing `zodiacalReleasing.js` module well.

## Mathematically Sound Points

- The Fortune and Spirit inversion formulas are correct for the standard Valens-style setup.
- The sign order plus traditional planetary-year table is the right basis for period lengths.
- Treating ZR as a coarse prior and tie-breaker is mathematically sane, because the technique is driven by lot sign structure rather than minute-by-minute angular motion.
- The candidate-grid guidance is sound: ZR only changes when the lot or releasing structure changes, so it should not be used as a fine solver unless the search window is already narrow.

## Issues Or Caveats

- The brief understates the current implementation. `zodiacalReleasing.js` already supports recursive generation through `maxLevel`, and the CLI can request up to L4. The real gap is that the default path is still Fortune-only and the docs describe the feature as partial, not that the code is capped at L2.
- The `360-day-year` idea should be presentation-only. Internal storage should stay on exact timestamps or exact calendrical boundaries, otherwise the timeline will drift from the actual period math.
- The day/night decision for Fortune vs Spirit needs stronger wording. The current engine uses an `isDayChart(sunLon, ascLon)` proxy rather than a full horizon test, so the brief should treat day/night classification as a validated dependency rather than a settled fact.
- Peak-period and Loosing-of-the-Bond logic are still doctrine-specific overlays, not core arithmetic. The brief is right to keep them separate, but it should say explicitly that they are future annotations, not part of the first shipping generator.

## Required Corrections

- Rewrite the current-capability statement so it distinguishes default CLI behavior from underlying generator capability.
- Specify that 360-day conversion is only for display and query formatting, not for the source timeline state.
- Add an explicit contract for day/night classification, ideally derived from actual chart altitude or a validated house-based rule, before Spirit/ZR branching is treated as reliable.
- Keep the initial integration limited to Fortune and Spirit, with any additional lots, peaks, or bond rules gated behind explicit doctrine config.

## Final Recommendation

Proceed with the integration plan, but tighten the wording around current engine capability and day/night detection before implementation. The core math is sound enough to build on, and the best next step is a dedicated `rectification/features/zr.js` layer with exact UTC timelines, query-by-date/age helpers, and doctrine-configured annotations.
