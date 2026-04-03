# Kill Criteria

## Purpose

Define the conditions under which the project should narrow scope, change target, or stop pursuing exact-minute rectification as a primary goal.

## Criterion 1: Weak Full-Day Separability

Kill or sharply narrow the `±2 min` target if:
- full-day candidate scoring rarely produces meaningful concentration near the true time
- nearby candidate bins remain flat or highly multimodal on the audited corpus
- the best techniques only help after the answer is already nearly known

## Criterion 2: Baseline Dominance

Kill claims of astrology-specific value if:
- biography-only baselines match or exceed the timing-based system
- gains vanish under shuffled or placebo controls
- performance depends mostly on documentation richness, public visibility, or source artifacts

## Criterion 3: Provenance Collapse

Narrow the target if:
- the strict gold subset is too small for meaningful benchmark conclusions
- provenance and minute-heaping audits show that open-source minute labels are too contaminated
- the system only looks strong on weakly audited or mixed-label corpora

## Criterion 4: Triage Inflation

Reject optimistic framing if:
- selected-set performance is strong but full-population performance is weak
- triage acceptance rate is mistaken for prevalence
- false-high triage rates remain substantial

## Criterion 5: Interview Non-Value

Demote the interview layer if:
- structured question families do not improve posterior contraction beyond timing-only and biography-only paths
- gains depend mostly on wording polish or narrative style
- contradiction probes do not improve calibration

## Criterion 6: Complexity Without Lift

Cut additions such as:
- doctrine fusion
- pairwise narratives
- multimodal inputs
- extra timing systems

unless they provide measurable lift on the frozen benchmark.

## Narrowed Success Condition

Even if `±2 min` fails as a broad target, the project may still succeed in a narrower form:
- calibrated coarse-to-fine interval rectification
- strong abstention
- useful narrowing on a validated high-separability subset

That is still a real product outcome if it is honest and measurable.

## Decision Rule

The project should prefer:
- a smaller true claim

over:
- a larger attractive claim supported mainly by narrative fit

## Immediate Use

Run these criteria after the first serious corpus-scale benchmark, not after architecture completion.
