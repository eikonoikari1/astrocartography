# Forced-Choice And Adaptive QA

The interview should behave like a psychometric instrument, not a casual conversation.

## Design Goal

Maximize posterior contraction per user answer while minimizing social desirability, vague endorsement, and retrospective narrative fitting.

## Why Forced-Choice Helps

Forced-choice formats are useful because they make it harder to endorse every flattering statement at once. In psychometrics, this is one of the standard ways to reduce response distortion in personality-style instruments.

They are especially attractive here because rectification questions are often subjective. The system should ask the user to choose between two plausible life-shapes, two interpretations, or two candidate-chart families rather than rate a statement in the abstract.

## Adaptive Questioning Principle

```text
candidate posterior
  -> choose most informative next item
  -> update likelihoods
  -> remove low-value questions
  -> stop when interval is narrow enough or evidence stops improving
```

## Recommended Question Families

| Family | Example intent | Why it discriminates |
|---|---|---|
| Career vs relationship emphasis | "Which has been more defining?" | separates public-axis and partnership-axis charts |
| Public visibility vs private work | "Do you move toward visibility or behind-the-scenes depth?" | splits angular and cadent emphasis |
| Caretaking vs self-direction | "Were you pulled into responsibility early?" | helps with family-duty and duty-heavy charts |
| Stability vs mobility | "Was relocation, travel, or reinvention a recurring pattern?" | useful for location and angularity hypotheses |
| Crisis cadence | "Were there a few sharp turning points or a slow continuous arc?" | helps timing and intensity patterns |
| Body / presentation family | "Do people notice your physical presence immediately, or your mind/work first?" | late-stage Ascendant corroboration |

## Adaptive Policy

The next question should come from the highest expected information gain, not from whatever seems astrologically interesting.

Practical policy:
- prefer questions that split the top 2-4 candidate families
- avoid asking about a topic already well separated
- mix evidence families so the same bias does not repeat
- include a stop rule when posterior entropy stops dropping

## Contradiction Checks

The system should deliberately ask for conflicts, not only confirmations.

Examples:
- "Which description fits less well?"
- "What is the strongest counterexample to this reading?"
- "Which life area is surprisingly ordinary?"
- "If one candidate chart were wrong, where would it fail first?"

Contradiction checks are important because self-report can drift toward agreement. A good rectification interview should reward disconfirming information.

## Invalid-Response Detection

Use multiple lightweight checks rather than one obvious trap.

Signals to watch:
- very fast completion time
- repeated straight-lining or always choosing the same side
- contradictory answers across nearby questions
- answers that match every option too well
- inconsistent confidence relative to detail
- suspiciously high agreement with flattering options

Possible controls:
- instruction checks
- repeated items in slightly different form
- pairwise consistency checks
- response-time flags
- a "not sure" option when the question is genuinely underdetermined

## Recommended Scoring Logic

1. Treat each answer as a likelihood update.
2. Penalize inconsistent or overly generic answer patterns.
3. Lower the weight of any answer family that appears to be faked or satisficed.
4. Keep a separate uncertainty score for the interview itself.

## Good Baseline Formats

- paired forced-choice between two chart families
- three-way choice with a "not sure" exit
- ranking of life priorities
- contradiction prompt after a cluster of positive items

## Source Anchors

- [Forced-choice inventories and faking resistance, meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC8511514/)
- [Item desirability matching in forced-choice test construction](https://www.sciencedirect.com/science/article/pii/S0191886921004931)
- [Careless responding in questionnaire measures: Detection, impact, and remedies](https://www.sciencedirect.com/science/article/pii/S1048984320300114)
- [Careless responding detection revisited](https://link.springer.com/article/10.3758/s13428-024-02484-3)
- [The Astrology Podcast, Ep. 169 transcript](https://theastrologypodcast.com/transcripts/ep-169-transcript-rectification-using-astrology-to-find-your-birth-time/)
