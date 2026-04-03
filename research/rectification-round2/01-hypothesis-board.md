# Hypothesis Board

Status values: `open`, `active`, `supported`, `weakened`, `killed`, `needs-split`

## H1: Fine rectification is feasible on a high-separability subset
- Status: `supported`
- Why it matters: If this is false, `±2 min` across a full-day frame is the wrong product target.
- Current confidence: Medium
- Evidence quality: Moderate
- Failure modes: The subset may be too small, too curated, or too dependent on unusually rich event history.
- Decisive experiment: Build a separability simulation that tests how often `2-5 min` shifts produce meaningfully distinct chart structures and timing outputs.
- Round 1 update: The identifiability memo supports the subset version and weakens any universal `±2 min` claim.
- Round 3 update: Subset prevalence now has to be estimated on a frozen audited sample with weights; triage acceptance rate is not a valid prevalence estimate.

## H2: Adaptive QA can materially contract the posterior
- Status: `active`
- Why it matters: This is the main candidate for overcoming sparse or fuzzy life-event data.
- Current confidence: Medium
- Evidence quality: Moderate from adjacent fields, still thin in rectification specifically
- Failure modes: Questions trigger self-attribution and inflate false confidence.
- Decisive experiment: Compare adaptive questioning, static questionnaires, and random questioning on posterior contraction using known-time cases.
- Round 1 update: The interview-design pack strengthened the case for adaptive QA, but only if it uses discriminative item families and contradiction checks.
- Round 3 update: The best candidate families are now ranked, so adaptive QA can move from a generic idea toward a staged instrument.

## H3: Forced-choice and pairwise judgments outperform absolute self-ratings
- Status: `active`
- Why it matters: If true, the interview interface should compare candidate-chart themes instead of asking generic identity questions.
- Current confidence: Medium
- Evidence quality: Moderate in psychometrics, thin in rectification
- Failure modes: Pairwise prompts may become too verbose or too subtle for stable answers.
- Decisive experiment: A/B test absolute items versus pairwise chart contrasts for discrimination, consistency, and calibration.
- Round 1 update: The evidence pack now treats forced-choice and pairwise comparison as first-class candidates rather than optional UI variants.
- Round 3 update: Pairwise narratives now have generation constraints, which makes this hypothesis more testable without turning prompts into leading summaries.

## H4: Event windows remain the strongest evidence family for final narrowing
- Status: `active`
- Why it matters: If true, non-event evidence should mainly narrow the field before timing methods take over.
- Current confidence: Medium to high
- Evidence quality: Moderate from practitioner consensus
- Failure modes: Event dates are too fuzzy; multiple techniques can fit the same biography after the fact.
- Decisive experiment: Evaluate marginal gain from event windows after controlling for non-event evidence, and vice versa.
- Round 1 update: First-wave evidence ranking still places event windows at the top for final narrowing, but not as the only viable evidence family.

## H5: Non-event life-structure signals are stronger than generic personality signals
- Status: `supported`
- Why it matters: It determines what the question bank should ask about.
- Current confidence: Medium
- Evidence quality: Moderate
- Failure modes: Life-structure signals may still be too broad and overlapping across candidate charts.
- Decisive experiment: Compare question families based on life axes, relationship dynamics, vocational patterns, and generic personality descriptors.
- Round 1 update: The evidence taxonomy and item bank both converge on life-structure splits as the best non-event signal family.
- Round 3 update: The priority matrix now ranks career axis, relationship axis, family duty, and mobility as the core families, while generic temperament remains outside the core path.

## H6: Appearance and presentation add signal only late in the process
- Status: `supported`
- Why it matters: This affects whether multimodal features are core or optional.
- Current confidence: Low
- Evidence quality: Thin
- Failure modes: Appearance cues may reflect culture, styling, age, or stereotype more than chart structure.
- Decisive experiment: Measure incremental value from presentation cues when the candidate interval is already narrow.
- Round 1 update: Current evidence places appearance and presentation in a low-weight corroboration role rather than a core inference role.
- Round 3 update: The multimodal review further constrains these cues to research-only or late-stage corroboration unless they beat simpler baselines under strict ablation.

## H7: Separate expert models by tradition will calibrate better than a blended doctrine
- Status: `active`
- Why it matters: It shapes the overall inference architecture.
- Current confidence: Medium
- Evidence quality: Thin
- Failure modes: Separate systems may disagree constantly and complicate synthesis without improving accuracy.
- Decisive experiment: Compare calibration and interval coverage for a blended model versus separate Western and Vedic experts feeding a shared posterior.
- Round 1 update: Still unresolved. No first-wave memo narrowed this question enough.
- Round 2 update: The architecture work now favors separate doctrine experts with late fusion, but this still needs benchmark confirmation.

## H8: Available ground-truth data is too noisy for direct exact-minute supervision
- Status: `supported`
- Why it matters: If true, supervised training must be interval-aware and source-aware from the start.
- Current confidence: Medium to high
- Evidence quality: Moderate
- Failure modes: Noise may be overestimated if high-grade records are clean enough for a subset.
- Decisive experiment: Audit minute-heaping, provenance, timezone issues, and source reliability on the best available dataset.
- Round 1 update: The data-quality memos strongly support treating provenance as part of the label and reserving exact-minute work for a strict documentary subset.

## H9: Strong non-astrological baselines can explain much of the apparent signal
- Status: `supported`
- Why it matters: This is the main falsification pressure on the project.
- Current confidence: Medium
- Evidence quality: Thin
- Failure modes: Weak baseline design could make astrology-informed methods look better than they are.
- Decisive experiment: Benchmark against biography-only, demographic-only, and shuffled-chart controls.
- Round 1 update: The modeling pack elevated this from a caution to a mandatory benchmark requirement.
- Round 3 update: The baseline docs and counterfactual tests make shortcut learning a first-class failure mode rather than a side caution.

## H10: A calibrated abstaining system is a better product than a forced exact-time system
- Status: `supported`
- Why it matters: It changes both evaluation and user trust.
- Current confidence: High
- Evidence quality: Strong from probabilistic modeling practice, thin in rectification specifically
- Failure modes: Wider intervals may reduce perceived usefulness if the product is framed around exactness.
- Decisive experiment: Compare user-facing and benchmark outcomes for forced exact predictions versus confidence-calibrated interval outputs.
- Round 1 update: The modeling and data packs both make abstention and interval output look like core product requirements, not conservative extras.
