# Baselines And Negative Controls

## Purpose
The benchmark needs to prove that rectification adds signal beyond generic biography inference and beyond accidental pattern fitting.

## Baselines To Include

### Biography-Only Baseline
Predict birth-time bins from non-astrological life structure only.
- Inputs: career history, relationship history, major moves, health crises, family structure, self-description.
- Why: tests whether the interview alone explains most of the apparent signal.

### Demographic Baseline
Use age cohort, sex/gender if available, region, and simple life-history counts.
- Why: catches spurious correlations and cheap shortcuts.

### Static Questionnaire Baseline
Use a fixed set of questions with no adaptive policy.
- Why: isolates the value of adaptivity.

### Event-Only Baseline
Use only dated life events and a timing engine.
- Why: tests whether non-event evidence adds anything beyond the standard practitioner approach.

### Random Or Shuffled Baseline
Shuffle chart labels, birth times, or event assignments.
- Why: establishes the floor and detects leakage.

### Non-Astrological Heuristic Baseline
Use simple NLP or tabular models over biography without chart features.
- Why: checks whether the system is learning general personology rather than rectification.

## Negative Controls
- Shuffle birth times across people while preserving the event distribution.
- Permute evidence family labels within person.
- Evaluate on held-out people only, never on held-out sessions from the same person.
- Compare against placebo chart features that should not have predictive value.
- Repeat with intentionally rounded or corrupted timestamps to verify sensitivity.

## Why These Controls Matter
Rectification systems are vulnerable to self-confirming narrative fit. A model can sound persuasive even when it is only learning broad personality or demographic patterns. The benchmark must make that failure visible.

## Minimum Acceptance Rule
A rectification model should only be considered useful if it beats the strongest non-astrological baseline, the static questionnaire baseline, and the shuffled-control benchmark with calibrated uncertainty.

## Sources
- [Wyman & Vyse, Science versus the Stars](https://pubmed.ncbi.nlm.nih.gov/18649494/)
- [Carlson, A Double-Blind Test of Astrology](https://www.nature.com/articles/318419a0)
- [Hume, Is There an Association Between Astrological Data and Personality?](https://pubmed.ncbi.nlm.nih.gov/893697/)

