# Leakage And Shortcut Risks

## Purpose
Rectification benchmarks are vulnerable to fake success. The model can appear accurate because it learns dataset artifacts, collection conventions, or biography shortcuts instead of birth-time structure.

This document lists the main leakage modes and how to block them.

## Main Leakage Modes
### 1. Person overlap leakage
The same person appears in train and test under different sessions, summaries, or source records.

Why it matters:
- the model memorizes identity rather than rectification signal

Mitigation:
- split by person, not session
- deduplicate aliases and repeated records
- keep all entries for one person in the same fold

### 2. Source-note leakage
Source notes or metadata mention whether a time is exact, rounded, rectified, approximate, or disputed.

Why it matters:
- the model can learn provenance quality as a proxy for the target

Mitigation:
- strip direct label descriptors from model inputs
- keep provenance for auditing, not as a predictive feature
- quarantine rectified and documentary records when needed

### 3. Collector leakage
The same collector, archive, or database convention appears in both train and test.

Why it matters:
- the model learns collector habits, not birth-time structure

Mitigation:
- hold out by collector or archive when possible
- report performance by source family

### 4. Rounding leakage
Exact minutes are overrepresented at round values because of transcription or reporting convention.

Why it matters:
- the model can learn rounding artifacts instead of timing structure

Mitigation:
- audit digit preference and minute-heaping
- keep rounded and documentary records in separate strata

### 5. Biography duplication leakage
Public biographies or interview summaries are repeated, paraphrased, or lightly edited across cases.

Why it matters:
- the model can match repeated narratives rather than infer anything causal

Mitigation:
- deduplicate near-duplicate text
- redact repeated boilerplate
- run similarity checks across splits

### 6. Event-window leakage
Event descriptions contain the target time indirectly, or were assembled using chart knowledge after the fact.

Why it matters:
- the timing engine may be judged on evidence that already contains the answer

Mitigation:
- separate raw event descriptions from chart-driven interpretations
- track whether events were recorded before or after rectification

### 7. Timezone and DST leakage
Timezone handling varies across records and may encode a shift that the model should not infer from text.

Why it matters:
- one hour errors can dominate the benchmark and hide real failure

Mitigation:
- store conversion rules explicitly
- audit local time and zone history separately from predictive features

### 8. Public-figure leakage
Famous people often have richer biographies, more consistent documentation, and more event data.

Why it matters:
- performance on public figures may overstate real-world utility

Mitigation:
- report results separately for public and non-public cases
- weight benchmark slices by documentation quality

## Shortcut Risks
The strongest shortcuts are usually not astrology-specific. They are generic machine-learning shortcuts:
- length of biography
- number of events mentioned
- level of self-presentation detail
- demographic regularities
- source-grade regularities
- archive-specific phrasing

If a model performs well using these cues, it may still fail at rectification.

## Detection Tests
- remove astrology-related features and see whether performance survives
- hold out a collector or archive family
- redact date words, round-number patterns, and source-grade markers
- compare exact-label performance against interval-based performance
- evaluate on paraphrased biographies

## Design Rule
Anything that can be inferred without chart structure should be treated as a potential shortcut unless it is explicitly being used as a baseline.

## Sources
- [Counterfactual Invariance to Spurious Correlations](https://proceedings.neurips.cc/paper_files/paper/2021/file/8710ef761bbb29a6f9d12e4ef8e4379c-Paper.pdf)
- [Spawrious: A Benchmark for Fine Control of Spurious Correlation Biases](https://arxiv.org/abs/2303.05470)
- [Confidence on the Focal: Conformal Prediction with Selection-Conditional Coverage](https://arxiv.org/abs/2403.03868)
- [Selective conformal inference with false coverage-statement rate control](https://academic.oup.com/biomet/article/111/3/727/7611650)
