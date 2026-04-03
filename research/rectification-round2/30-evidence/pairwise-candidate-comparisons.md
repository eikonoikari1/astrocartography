# Pairwise Candidate Comparisons

Pairwise comparison is the cleanest way to use the user once the candidate set is small enough.

## Core Idea

Instead of asking the user to rate a chart on a vague scale, present two or three competing chart narratives and ask which one better matches the life structure.

This is attractive because humans are better at relative judgment than at precise absolute judgment, and because pairwise ranking methods already have a mature literature in active learning and preference elicitation.

## When To Use It

Use pairwise comparisons after:
- the birth-time window has already been narrowed
- the interview has gathered a few stable evidence families
- the system wants to split the top candidates quickly

Do not use pairwise comparisons too early. If the candidates are too broad, the user will just compare vague stories.

## Good Pairing Strategy

| Pair type | Why it helps |
|---|---|
| Adjacent times, same rising sign | tests minute-level sensitivity |
| Nearby times, different house cusps | tests life-structure split |
| Competing rising signs | tests the first major narrowing |
| Candidate charts with different angular emphasis | tests visibility, career, and event-axis questions |
| Candidate charts with different relationship weighting | tests partnership versus independence |

## Question Forms

### 1. Direct preference
"Which chart narrative feels more like the person?"

### 2. Forced contrast
"If one of these is wrong, which one fails harder?"

### 3. Feature-specific choice
"Which chart better fits career pressure, and which better fits relationship pressure?"

### 4. Consistency check
"Which of these two descriptions can you rule out more confidently?"

## Scoring Implications

Pairwise answers should update a ranking model, not just a score.

Useful model families:
- Bradley-Terry style ranking
- pairwise preference learning
- active learning with information gain
- Bayesian preference models

## Contradiction Logic

The system should actively look for cross-examples:

- if a chart seems right for career, does it fail on relationship structure?
- if a chart fits appearance, does it fail on family duty?
- if two candidates both fit, which one becomes wrong under a concrete event timeline?

That keeps the method from becoming a story-fitting exercise.

## Implementation Rules For Later

1. Keep chart descriptions short and comparable.
2. Do not reveal the full model rationale before the comparison is answered.
3. Randomize presentation order.
4. Record confidence separately from choice.
5. Keep a "cannot tell" option.

## Source Anchors

- [Active Learning for Ranking from Pairwise Preferences with an Almost Optimal Query Complexity](https://www.jmlr.org/papers/v13/ailon12a.html)
- [Real-time Multiattribute Bayesian Preference Elicitation with Pairwise Comparison Queries](https://proceedings.mlr.press/v9/guo10b.html)
- [Active Preference Learning for Ordering Items In- and Out-of-sample](https://arxiv.org/abs/2405.03059)
- [The Astrology Podcast, Ep. 169 transcript](https://theastrologypodcast.com/transcripts/ep-169-transcript-rectification-using-astrology-to-find-your-birth-time/)
