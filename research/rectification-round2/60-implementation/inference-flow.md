# Inference Flow

## Goal
Define the runtime path from raw evidence to a calibrated birth-time interval or abstention.

## Flow Overview

### Step 1: Ingest Evidence
Input sources arrive as:
- birth record or registry entry
- user-provided event history
- structured interview answers
- pairwise chart comparisons
- optional biography text or multimodal cues

At ingestion:
- preserve raw source text
- normalize dates into intervals when needed
- attach confidence and provenance fields
- assign evidence family and source grade

### Step 2: Audit And Triage
The triage layer scores the case before any minute-level refinement.

It uses:
- provenance quality
- event richness
- source completeness
- local geometry sensitivity
- expected response quality

The output is one of:
- `high`
- `medium`
- `low`

Decision meaning:
- `high`: enter minute-level refinement
- `medium`: coarse-to-fine only
- `low`: abstain or return coarse interval

Triage thresholds are frozen before evaluation.

### Step 3: Build Candidate Grid
Create the candidate-time grid for the birth date and location.

Default:
- 2-minute bins across the full day

Refinement:
- 1-minute or 30-second bins only around the top posterior mass

The grid is always deterministic and reproducible.

### Step 4: Compute Chart Features
For each candidate bin, compute:
- angles
- houses
- rulers
- lots
- timing triggers
- neighborhood deltas

The output is a feature matrix indexed by candidate bin.

### Step 5: Encode Evidence
Convert each evidence family into a likelihood term or preference signal.

Rules:
- event windows become interval-censored or soft probabilistic evidence
- interview answers become family-specific discriminators
- pairwise comparisons become relative preference scores
- confidence stays separate from semantic value

Each evidence item contributes both:
- a content signal
- a trust signal

### Step 6: Score With Doctrine Experts
Each doctrine-specific expert consumes the chart features and relevant evidence encodings.

Expected outputs:
- log-likelihood over candidate bins
- family-specific confidence on the fit
- optional contradiction flags

The experts remain separate until fusion.

### Step 7: Fuse Into A Posterior
Combine all expert scores and evidence likelihoods into a shared posterior.

Fusion order:
1. apply prior over bins
2. add evidence-family likelihood terms
3. add doctrine-expert scores
4. normalize into posterior mass

The posterior should retain:
- top-K candidate bins
- HPD interval
- entropy
- neighborhood stability

### Step 8: Calibrate
Run the posterior through the calibration layer.

Calibration updates:
- confidence scores
- interval width
- selective risk estimate
- abstention threshold

If calibration is weak, the system should widen the interval rather than force an exact minute.

### Step 9: Decide Output
The system returns one of three outputs:
- exact or near-exact time when confidence is exceptionally high
- interval when evidence supports narrowing but not exactness
- abstention when the case is too weak or ambiguous

### Step 10: Log The Run
Store a complete audit trail:
- input source ids
- provenance strata
- triage label and reason codes
- evidence family configuration
- candidate grid resolution
- posterior snapshot
- calibration version
- abstention decision
- benchmark version if this is an evaluation run

## Query Loop
If the system is interactive, the loop repeats:
1. inspect current posterior
2. select the most informative next question
3. ingest the user response
4. update evidence encodings
5. rescore and recalibrate

Stop when:
- posterior entropy stops contracting
- the target interval is reached
- the system reaches a refusal threshold

## Runtime Guards
- Never let a triage score re-enter the posterior as a predictive feature.
- Never let the LLM rewrite source facts inside the scoring loop.
- Never convert confidence into a fake point estimate.
- Never compare a triaged selected set to an untriaged full-population baseline without reporting selection-aware metrics.

## Logging Schema
Each run should log:
- run id
- person id
- dataset version
- triage decision
- evidence families enabled
- query budget used
- candidate resolution used
- calibration method
- abstention policy
- final output type
- final posterior metrics

## Failure States
- If too many charts get `high` triage labels, selection bias is probably too loose.
- If the posterior remains flat after multiple evidence families, the case should abstain.
- If the baseline outperforms the astrology-aware system, the architecture is not yet justified.
- If confidence rises faster than calibration improves, the system is overclaiming.

## Operational Principle
The runtime should prefer a narrower correct interval over an exact but unstable answer.
