# Separability Simulation Spec

## Question
How do we test whether nearby candidate birth times are distinguishable before building a full rectification model?

## Why This Matters
If candidate times are not locally separable, then minute-level rectification is the wrong objective or only works on a subset.

## Best Available Sources
- [Astrodienst Astrowiki: Primary Direction](https://www.astro.com/astrowiki/en/Primary_Directions)
- [Astrodienst Astrowiki: Time of Birth](https://www.astro.com/astrowiki/en/Time_of_Birth)
- [The Astrology Podcast Ep. 169 transcript](https://theastrologypodcast.com/transcripts/ep-169-transcript-rectification-using-astrology-to-find-your-birth-time/)
- [Astro-Databank: Rodden Rating](https://www.astro.com/astro-databank/Help:Rodden_Rating)

## Simulation Goal
Estimate local identifiability over the 24-hour space of candidate times, then identify where the posterior can contract fast enough to justify fine rectification.

## Core Setup
1. Choose a dense candidate-time grid for a single date and location.
2. Compute chart features for each candidate bin at 30-second, 2-minute, or 5-minute resolution.
3. Define evidence families as separate likelihood modules.
4. Inject observed evidence from known-time charts or synthetic evidence generated from held-out cases.
5. Measure whether the posterior collapses toward the true bin faster than baseline methods.

## Evidence Families To Test
- Event windows with date precision labels.
- Rising-sign family or day/night information.
- Life-theme questionnaire answers.
- Forced-choice comparisons between candidate chart summaries.
- Appearance or presentation descriptors, if tested at all, as a separate low-weight module.

## Local Separability Metrics
- Adjacent-bin likelihood ratio.
- Posterior entropy reduction per question.
- Top-k interval coverage.
- Calibration error on the final posterior.
- Boundary-hit rate, meaning whether the true time falls inside the top interval after each question.
- Stability under label noise and date fuzziness.

## Negative Controls
- Shuffled birth dates with the same evidence.
- Biography-only models with no chart features.
- Random question ordering.
- Chart-feature ablations that remove angles or cusps.
- Simulated users with no discriminative signal.

## Stop Rules
The simulation should report a hard negative if one of the following is true:
- Nearby bins remain indistinguishable under all evidence families.
- Posterior contraction is no better than a static or random baseline.
- Exact-minute accuracy appears only when the label itself is already rounded or contaminated.
- Performance collapses when event dates are fuzzed by a few days or weeks.

## Output Format
Return results as a matrix by chart and by candidate-bin spacing:
- `2 min`
- `5 min`
- `10 min`
- `15 min`

For each spacing, report:
- local identifiability score
- posterior width after each question
- evidence family contribution
- best and worst cases
- whether the case deserves minute-level refinement

## Recommended Implementation Order
1. Start with a synthetic benchmark based on known-time charts.
2. Add real charts only after the synthetic pipeline is stable.
3. Hold the question policy constant before experimenting with learned query selection.
4. Introduce label-noise stress tests before trusting any exact-minute result.

## Open Gaps
- The best formal score for "separable enough" in a rectification setting.
- How to model fuzzy life-event dates without leaking future knowledge.
- Whether separability is better measured on the chart geometry alone or on the chart plus interview evidence.

## Recommended Next Experiment
Build a pilot simulation on a small known-time subset using three candidate-time bins per chart family. Compare a geometric-only model, a timing-only model, and a combined model under the same evidence and noise assumptions.

## Deliverables
- This spec should become the first benchmark document.
- Its stop rules should gate any later ML work.
- Its negative controls should be mandatory in the eventual evaluation suite.
