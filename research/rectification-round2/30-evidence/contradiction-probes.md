# Contradiction Probes

Contradiction probes are designed to break smooth false fits without turning the interview into a trick test.

## Purpose
A contradiction probe asks the user where the current fit fails, where it is weakest, or which competing life-shape is less true.

It should do one of three things:
- expose a false positive
- narrow a too-broad candidate set
- lower confidence in a candidate that is overfitting the story

## Design Rules

1. Keep the tone neutral.
2. Do not frame the probe as a challenge to the user's honesty.
3. Do not reveal the expected answer.
4. Do not use a hidden gotcha.
5. Ask for the weakest point, not just the strongest agreement.
6. Allow `not sure` when the user genuinely lacks evidence.

## Probe Types

### Weakest-Fit Probe
Ask which part of the current reading feels least true.

Use when:
- the candidate looks too smooth
- too many items have been endorsed

Example:
- "Which part of this description fits least well?"

### Counterexample Probe
Ask for a concrete exception that would break the current reading.

Use when:
- the interview needs a reality check
- the current fit is relying on broad self-recognition

Example:
- "What is the clearest example that does not fit this picture?"

### Domain-Swap Probe
Ask whether the candidate fails in another life domain.

Use when:
- the chart seems plausible in one area but not another

Example:
- "If this were wrong, would it fail more in career, relationships, family duty, or mobility?"

### Specificity Probe
Ask for details that broad agreement cannot satisfy.

Use when:
- the answer is too generic

Example:
- "What happened that made this pattern concrete, not just a feeling?"

### Temporal Consistency Probe
Ask whether the pattern is stable over time or only true for a short period.

Use when:
- the user may be confounding one episode with a lifelong theme

Example:
- "Has this always been true, or only during one chapter?"

### Confidence Stress Probe
Ask how certain the user is and what would make them revise.

Use when:
- the session is drifting toward overconfidence

Example:
- "How sure are you, and what evidence would change your answer?"

## Bad Probes
Avoid probes that:
- suggest the correct answer
- imply a moral judgment
- force the user to defend a chart they never chose
- bundle two ideas into one question
- ask for a conclusion before the evidence is presented

## Scoring Rules
Contradiction probes should update the model in a limited way.

Recommended interpretation:
- strong contradiction lowers the weight of the current family
- weak contradiction is treated as noise
- unresolved contradiction keeps the candidate alive but less confident

Do not let one contradiction silently erase all prior evidence unless the contradiction is specific and externally anchored.

## Probe Sequencing
Good sequence:
1. ask a neutral family item
2. ask for a specific example
3. ask for the strongest counterexample
4. ask what would falsify the current fit

This sequence helps separate stable evidence from agreement drift.

## Validation Checks
Before deploying a probe, test whether it:
- produces useful disagreement
- reduces generic endorsement
- avoids lower-quality "yes, that sounds right" behavior
- remains understandable to users without astrology knowledge

## Source Anchors
- [Cognitive interviewing as a method to inform questionnaire design](https://www.sagepub.com/sites/default/files/upm-assets/65453_book_item_65453.pdf)
- [CCSG cognitive interviewing guidance](https://ccsg.isr.umich.edu/chapters/pretesting/cognitive-interviewing/)
- [Leading question bias in surveys](https://link.springer.com/article/10.1007/s11135-024-01934-6)
- [Careless responding in questionnaire measures](https://www.sciencedirect.com/science/article/pii/S1048984320300114)
