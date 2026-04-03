# Annual Profections

## Current-Engine Fit

Annual profections fit this engine well as a coarse annual-activation layer, but only if they are implemented as a new rectification feature family in `rectification/`, not folded into `astro.mjs` or the existing transit/progression code.

The current engine already provides the pieces profections need:
- `chartCaster.js` for deterministic ecliptic longitude and equatorial positions
- `houses.js` for angle work, though profections themselves must not use quadrant houses
- `transits.js` for trigger-style exact-search scoring
- `solarReturn.js` for annual confirmation
- `progressions.js` for developmental layering
- `zodiacalReleasing.js` for broader chapter context
- `profile.js` for timezone and birth-time normalization

For rectification, profections should sit alongside the other timing modules as a separate feature extractor and scorer. The important architectural point is that profections are whole-sign, sign-based, and year-level. They should not reuse Placidus or equal-house logic except indirectly when candidate charts are generated and the Ascendant sign is derived.

This technique is birth-time sensitive in the rectification setting because the candidate Ascendant sign is the input that drives the profection cycle. If the birth window is so wide that candidate Ascendant signs remain unstable, profections should be treated as a weak coarse prior, not a deciding signal.

## Mathematical Model

Annual profections are a discrete sign cycle. For a natal chart with Ascendant sign index `A` in tropical zodiac order (`0..11`), the profected sign for completed age `n` is:

```text
P(n) = (A + n) mod 12
```

If the Ascendant is in `Gemini` and the native is 33 years old in completed years, the profected sign is:

```text
Gemini + 33 = Pisces
```

The profected house is the whole-sign house whose sign equals `P(n)`. The year lord is the traditional ruler of that sign, using the seven classical planets only:
- Aries -> Mars
- Taurus -> Venus
- Gemini -> Mercury
- Cancer -> Moon
- Leo -> Sun
- Virgo -> Mercury
- Libra -> Venus
- Scorpio -> Mars
- Sagittarius -> Jupiter
- Capricorn -> Saturn
- Aquarius -> Saturn
- Pisces -> Jupiter

The default engine should use completed age, not the ordinal year label. That avoids off-by-one confusion:
- age `0` means the 1st house
- age `1` means the 2nd house
- age `11` means the 12th house
- age `12` returns to the 1st house

This matches the practical modern convention that the profection year runs from birthday to birthday, and it also matches the repo’s existing workflow docs.

Doctrine constraints:
- Use whole-sign houses only.
- Use traditional rulership only by default.
- Do not let modern outer-planet rulers replace the classical year lord.
- Treat sect as a modifier on interpretation, not part of the arithmetic.
- Treat profections as a yearly focus, not an event list.

Valens-style annual profections are also topic-specific in the sense that the Ascendant is the default source point, but other points can be profected for specific questions. For this engine, ASC should be the canonical default. Sun, Moon, or Lot-based profections can be added later as explicit secondary modes.

## Candidate-Grid Implications

Profections are too coarse for minute-level rectification on their own, but they are useful as a strong pruning signal.

In a candidate-time grid, profections only change when the candidate Ascendant sign changes. That means adjacent 2-minute bins often share the same profection state for long stretches, while bins crossing sign boundaries can switch the profected house and year lord immediately. This makes profections useful for:
- coarse pruning across broad candidate windows
- clustering candidate bins by Ascendant sign
- weighting event families by annual topic before finer timing methods run
- rejecting candidate ranges whose sign-based annual focus repeatedly conflicts with the person’s life history

For rectification, profections should be evaluated at the candidate chart level, not on the basis of the final rectified minute. The correct usage is:
- build candidate charts
- derive the Ascendant sign for each candidate
- compute profected sign and year lord for the relevant completed age
- score event families against the profected house and year lord

Useful feature outputs per candidate:
- `profectedHouse`
- `profectedSign`
- `yearLord`
- `yearLordSign`
- `yearLordHouse`
- `planetsInProfectedHouse`
- `natalAspectsToYearLord`
- `sectAdjustedYearLordWeight`

## Open-Source Implementations

The best open-source implementation found is Stellium:
- [Stellium docs](https://stellium.readthedocs.io/en/stable/api/index.html)
- [Stellium GitHub](https://github.com/katelouie/stellium)

Stellium exposes profections as a first-class API:
- `chart.profection(age=30)`
- `chart.profection(date="2025-06-15")`
- `chart.timeline(25, 35)`

The returned `ProfectionResult` already includes the fields this engine should mirror:
- `source_point`
- `source_sign`
- `source_house`
- `units`
- `unit_type`
- `profected_house`
- `profected_sign`
- `ruler`
- `ruler_position`
- `ruler_house`
- `planets_in_house`

That makes Stellium a good shape reference even if the current engine does not adopt its full architecture.

Two other useful references:
- [Astro Engine annual profections guide](https://astro-engine.com/blog/annual-profections-guide) for user-facing convention, birthday-to-birthday sequencing, and year-lord emphasis
- [Valens profections translation PDF](https://library.keplercollege.org/wp-content/uploads/2022/01/profectionsvalens.pdf) for the classical handover / take-over framing and the whole-sign emphasis

The repo should not depend on those products, but they are useful as reference models for expected UX and data shape.

## Integration Plan

### 1. Add A Dedicated Profections Module

Create `rectification/features/profections.js` with a small, explicit API:
- `getProfectedSignIndex(ascSignIndex, completedAge)`
- `getProfectionSnapshot(chart, completedAge, { point = "ASC", rulership = "traditional" })`
- `getYearLord(sign, { rulership = "traditional" })`
- `buildProfectionTimeline(startAge, endAge, point = "ASC")`

The module should accept the candidate chart’s Ascendant sign and return only structured data. No interpretation text belongs here.

### 2. Add Whole-Sign Helpers

Because `houses.js` is quadrant-house oriented, profections need a separate whole-sign helper. That helper should:
- map zodiac sign index to whole-sign house number from the candidate Ascendant sign
- map natal planet sign to whole-sign house number
- expose the sign ruler using the traditional seven-planet table

This keeps doctrinal boundaries clean and avoids mixing profections with Placidus-style cusps.

### 3. Encode Profections As A Feature Family

Add a profection scorer in `rectification/scoring/profectionScorer.js` that can score event families against the annual activation:
- career events against 10th-house profections and strong year lords
- relationship events against 7th-house profections and the ruler of the profected sign
- family/home events against 4th-house profections
- health/workload events against 6th-house profections
- withdrawal/crisis/institutional events against 12th-house profections

The score should be auditable and separate from the base candidate posterior.

### 4. Integrate With Candidate Evaluation

During rectification:
- compute the candidate Ascendant sign for each bin
- compute the profected house for the target completed age
- compare that annual focus to the event family attached to the evidence object
- add the result as a coarse likelihood term before minute-level scorers

This should happen after triage and before fine-grained transit or direction scoring.

### 5. Wire Into Existing Annual Layers

Profections should act as the annual organizer for:
- solar return interpretation
- year-lord transit emphasis
- broad event family prioritization

The integration rule is simple:
- profections choose the planet and topic
- solar returns describe the annual context
- transits provide triggers
- progressions and solar arcs supply finer timing

### 6. Add CLI Or Internal API Support

The long-term engine API should support at least:
- profection by age
- profection by date
- profection timeline
- profection snapshot from a candidate chart

If exposed in `astro.mjs`, it should be a new command rather than an option on an existing timing command.

## Risks

- Profections are coarse, so they can mislead if over-weighted in a minute-level search.
- Using quadrant-house logic would violate the doctrine and produce the wrong output shape.
- Using modern rulers as the default would conflict with the classical time-lord model.
- A candidate-time rectification system can overfit to profection narratives if the event families are not frozen before scoring.
- The year-lord emphasis is easy to narrativize after the fact, so the implementation needs strict evidence logging.

## Validation/Tests

Minimum tests should cover:
- the 12-sign cycle from ages `0..11`
- reset at age `12`
- traditional ruler mapping for all 12 signs
- `ASC`-based profection snapshots for known charts
- birthday-to-birthday boundary behavior
- candidate-grid consistency across adjacent bins that share the same Ascendant sign
- rejection of modern outer-planet rulers in default mode
- event-family scoring order remains stable under replay

Good regression fixtures:
- charts where the Ascendant is near a sign boundary
- charts where the profected house changes the year lord but not the topic family
- charts with repeated career or relationship events that should cluster under the same annual focus

For rectification benchmarking, profections should be measured as a coarse filter:
- does the profected year improve candidate separation over a random baseline?
- does it improve top-K ranking before fine timing methods run?
- does it stay calibrated when tested on held-out events?

## Sources With Links

- [Repo timing workflow](../../research/workflows/timing.md)
- [Repo annual profections note](../../research/techniques/timing/profections.md)
- [Repo rectification inference flow](../../research/rectification-round2/60-implementation/inference-flow.md)
- [Stellium API reference](https://stellium.readthedocs.io/en/stable/api/index.html)
- [Stellium GitHub](https://github.com/katelouie/stellium)
- [Astro Engine annual profections guide](https://astro-engine.com/blog/annual-profections-guide)
- [Valens profections translation PDF](https://library.keplercollege.org/wp-content/uploads/2022/01/profectionsvalens.pdf)
- [Astro.com article on annual profections, lots, and zodiacal releasing](https://www.astro.com/astrology/tma_article190314_e.htm)
