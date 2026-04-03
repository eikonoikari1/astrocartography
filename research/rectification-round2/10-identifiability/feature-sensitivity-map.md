# Feature Sensitivity Map

## Question
What changes, and what does not change, when birth time shifts by 2, 5, 10, and 15 minutes?

## Why This Matters
This determines whether fine rectification is even theoretically separable, and which chart features deserve weight in a search over candidate times.

## Best Available Sources
- [Astrodienst Astrowiki: Time of Birth](https://www.astro.com/astrowiki/en/Time_of_Birth)
- [Astrodienst Astrowiki: Directions](https://www.astro.com/astrowiki/en/Directions)
- [Astrodienst Astrowiki: Primary Direction](https://www.astro.com/astrowiki/en/Primary_Directions)
- [The Astrology Podcast Ep. 169 transcript](https://theastrologypodcast.com/transcripts/ep-169-transcript-rectification-using-astrology-to-find-your-birth-time/)
- [The Astrology Podcast Ep. 270 transcript](https://theastrologypodcast.com/transcripts/ep-270-transcript-how-to-read-a-natal-chart-with-no-birth-time/)

## Findings
The main mechanical fact is simple: a few minutes of birth-time error mostly change the horizon and meridian framework, not planetary sign positions. Astrodienst says the Ascendant advances by about one degree every four minutes on average, and its directions page says primary directions map roughly four minutes of birth time to one year of life. That is an inference anchor, not a complete rectification proof.

From that anchor, the local geometry is clear. A 2-minute shift is roughly half a degree of axial movement. A 5-minute shift is about 1.25 degrees. A 10-minute shift is about 2.5 degrees. A 15-minute shift is about 3.75 degrees. These are approximate and latitude-dependent, but they are useful enough for a separability design.

The highest-sensitivity features are the angles and any house or axis-derived structure. That includes the Ascendant, MC, IC, Descendant, quadrant house cusps, and anything the technique explicitly keys to axes, such as primary directions and many rectification heuristics. If a planet or point sits near a cusp or angle, small time shifts can change the interpretation materially. If it is nowhere near one, the minute shift will usually not matter much.

The lowest-sensitivity features are sign placements of planets and most aspect patterns between planets. Over 2 to 15 minutes, planetary longitudes are effectively fixed for rectification purposes. So are any conclusions that depend only on the natal planetary configuration without house or angle dependence.

This creates a practical split.

| Shift | What can change | What usually does not change | Rectification value |
| --- | --- | --- | --- |
| 2 min | Angle degree, cusp proximity, exact timing triggers near a boundary | Planet signs, most interplanetary aspects | High only near boundaries |
| 5 min | House placement for near-cusp bodies, angular emphasis, primary-direction timing by about a year | Planet signs, most aspects | Useful for fine-tuning after coarse narrowing |
| 10 min | Several house-based interpretations, angular hits, sign-boundary edge cases | Planet signs, most aspects | Useful for candidate pruning, not usually final exactness |
| 15 min | More obvious house reclassification, stronger angle shifts, some sign-boundary flips | Planet signs, most aspects | Strong for separating coarse candidates, weaker for exact-minute certainty |

The Astrology Podcast adds a second important inference: if the birth time is only known within a few hours, the first discriminator is often the rising-sign family, not the exact degree. In a 24-hour frame there are only 12 rising signs, so coarse narrowing by day/night and rising-sign family is a legitimate first stage before minute-level work begins.

## Contradictions And Disagreements
The mechanical sensitivity is clear, but the interpretive sensitivity is not. Practitioners disagree on how much signal comes from exact angle hits versus broader chart symbolism, and there is no strong controlled literature that measures these shifts directly as rectification accuracy.

The same 2 to 15 minute change can matter a lot on one chart and almost not at all on another. That means sensitivity is local, not uniform.

## Evidence Quality
- Overall quality: medium for geometric sensitivity, low for empirical separability.
- Main limitations: we can infer which features move, but not yet how informative they are in practice.
- What is based on inference: the degree-based change table and the claim that only angle/cusp features are useful at minute scale.

## Open Gaps
- Which chart geometries are actually separable at 2, 5, 10, and 15 minutes.
- Whether minute sensitivity is concentrated around angles or also appears in specific timing methods only.
- Whether some life domains create stronger discrimination than others for the same geometric shift.

## Recommended Next Experiment
Build a sensitivity atlas over a dense candidate-time grid. For each chart, calculate how many chart features change meaningfully between adjacent bins and score local separability around angles, cusps, and timing triggers.

## Deliverables
- Use this memo as the basis for the simulation spec.
- Carry the degree-change inference into the model benchmark only as a derived assumption.
- Treat house-and-angle features as the first family to test, not the only family to keep.
