# Triage Classifier Spec

## Purpose
Decide whether a chart is worth minute-level refinement before the system spends interaction budget on fine rectification.

This is a selection problem, not a final rectification model. The output should be a decision about whether to refine, coarse-narrow, or abstain.

## Output Labels
- `high`: worth minute-level refinement now.
- `medium`: worth coarse narrowing first, then refine only if the posterior contracts.
- `low`: do not spend minute-level effort; return a wider interval or abstain.

## Inputs

### 1. Source Provenance
Required fields:
- source class (`AA`, `A`, `B`, `C`, `DD`, `X`, `XX`)
- original local birth time
- timezone and DST state
- whether the time is documentary, quoted, reconstructed, or rectified
- whether the original note or scan exists
- whether alternative times exist

### 2. Local Geometry
Computed from the candidate-time grid:
- angle and cusp proximity
- whether the chart crosses a sign, house, or axis boundary inside `2`, `5`, `10`, or `15` minutes
- whether any sensitive point sits near an angle or cusp
- whether the chart is dominated by stable planetary sign placements rather than angle-sensitive structure

### 3. Evidence Richness
Collected before or during intake:
- count of dated life events
- count of distinct life domains covered
- event date precision (`day`, `week`, `month`, `season`, `year`)
- whether the events are independently checkable
- whether the evidence is mostly generic self-description

### 4. Response Quality Signals
Observed during intake:
- contradiction rate
- answer stability across similar prompts
- use of `not sure` or uncertain answers
- degree of self-attribution language
- whether the user can distinguish between broad life structure and generic personality description

### 5. Triage Context
- tradition family being tested, if any
- whether the user wants exact-minute work or just coarse narrowing
- whether the case is public, private, or lightly documented

## Hard Gates
If any of these are true, output `low` unless the user explicitly asks for exploratory work:
- timezone or DST cannot be resolved for the source time
- the only available time is rounded and no documentary source exists
- the record is rectified and the rectification chain is missing
- there are no dated life events and no strong non-event evidence
- all evidence is generic or self-flattering with no contradiction path

## Soft Score
Use a 100-point score after hard gates.

Suggested weights:
- source provenance: 35
- local geometry: 25
- event richness: 20
- response quality: 10
- cross-checkability and contradiction structure: 10

Suggested interpretation:
- `75-100`: `high`
- `50-74`: `medium`
- `<50`: `low`

This score is intentionally conservative. A chart only becomes `high` when provenance, geometry, and evidence richness all support the same conclusion.

## Decision Rules

### High
Use when all of the following hold:
- documentary or near-documentary source quality
- explicit timezone/DST handling
- at least several concrete events across different domains
- local geometry changes meaningfully in the `2-15` minute range
- interview answers are specific enough to discriminate chart families

Action:
- proceed to minute-level refinement
- allow pairwise candidate comparisons
- enable adaptive questioning

### Medium
Use when the chart has some discriminative potential but one major dimension is still weak.

Typical cases:
- good source quality but thin life evidence
- rich life evidence but weak local geometry
- geometry looks promising but the interview is still too generic

Action:
- do coarse narrowing first
- defer minute-level work until the posterior contracts
- cap question budget

### Low
Use when one of the hard gates fails or when the chart is too flat to distinguish nearby bins.

Action:
- return a coarse interval
- abstain if the evidence is too weak
- do not force a fine-time answer

## Failure Cases
- overrating charts with vivid biographies but weak local geometry
- overrating charts with one dramatic event but little cross-domain support
- treating rounded or reconstructed source times as if they were documentary
- selecting charts that look separable only because of label noise or hindsight fit
- confusing user recognition of a description with actual discriminative power

## Validation Method
The triage classifier should be judged against eventual posterior contraction and against the separability benchmark's eligibility label, not just plausibility.

Required checks:
- compare `high`, `medium`, and `low` labels to actual contraction on held-out known-time charts
- measure false-`high` rate on low-separability charts
- measure missed-opportunity rate on charts that later contract sharply
- report selection-conditional coverage, because triage changes the evaluation population

## Benchmark Use
The classifier is the gatekeeper for the separability benchmark:
- `high` charts enter minute-level refinement
- `medium` charts enter coarse-to-fine refinement
- `low` charts stay in the challenge set and are evaluated for abstention quality

## Sources
- [Astro-Databank Rodden Rating help](https://www.astro.com/astro-databank/Help%3ARR)
- [Astro-Databank handbook chapter 01](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01)
- [Astrodienst Astrowiki on the moment of birth](https://www.astro.com/astrowiki/en/Moment_of_Birth)
- [The Astrology Podcast, Ep. 169 transcript](https://theastrologypodcast.com/transcripts/ep-169-transcript-rectification-using-astrology-to-find-your-birth-time/)
- [Bayesian Experimental Design: A Review](https://people.eecs.berkeley.edu/~jordan/courses/260-spring10/readings/chaloner-verdinelli.pdf)
- [Conformal Prediction: A Unified Review of Theory and New Challenges](https://arxiv.org/abs/2005.07972)
