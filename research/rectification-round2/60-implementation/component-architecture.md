# Component Architecture

## Goal
Turn the research stack into a system that can ingest evidence, score candidate birth times, and return a calibrated interval or abstain. The architecture should keep chart math deterministic, keep evidence quality explicit, and make every score traceable.

## Top-Level Modules

### 1. Ingestion Layer
Owns all external input normalization.

Responsibilities:
- ingest birth records, biographies, event packets, interview answers, and optional multimodal inputs
- preserve original source text and provenance
- normalize dates, intervals, and uncertainty classes
- assign record and evidence identifiers

Outputs:
- canonical person record
- evidence packets
- provenance metadata
- quality flags

### 2. Audit And Triage Layer
Decides whether a chart is worth minute-level refinement.

Responsibilities:
- score source quality
- score evidence richness
- score local chart separability
- predict `high`, `medium`, or `low` triage label
- freeze triage thresholds before evaluation

Outputs:
- triage label
- triage score
- eligibility reason codes
- abstain / coarse / refine decision

### 3. Deterministic Chart Engine
Computes all astrology-derived features without any learned ambiguity.

Responsibilities:
- generate candidate birth-time bins
- compute houses, angles, lots, timing triggers, and other chart features
- support 2-minute, 1-minute, and 30-second refinement grids
- handle timezone and DST conversion deterministically

Outputs:
- chart feature matrix by candidate bin
- neighborhood deltas
- geometry sensitivity signals

### 4. Evidence Encoders
Convert each evidence family into a model-ready representation.

Responsibilities:
- encode event windows as interval-censored or soft probabilistic evidence
- encode interview answers as family-level signals
- encode pairwise comparisons as relative preferences
- attach confidence objects to each evidence item
- keep confidence separate from semantic content

Outputs:
- evidence likelihood terms
- confidence-weighted latent vectors
- family-specific reliability scores

### 5. Doctrine-Specific Experts
Score candidate bins using doctrine-specific semantics.

Recommended separation:
- Western expert
- Vedic expert
- optional specialist experts for techniques such as primary directions, dashas, profections, or solar returns

Responsibilities:
- consume deterministic chart features and evidence encodings
- produce per-bin log-likelihoods or ranking scores
- remain independently auditable

Outputs:
- expert score vectors over candidate bins
- confidence on expert fit

### 6. Posterior Fusion Layer
Combines all evidence families into a shared latent posterior over candidate birth times.

Responsibilities:
- fuse expert outputs with evidence-family likelihoods
- apply prior over candidate bins
- maintain top-K candidates and HPD intervals
- support coarse-to-fine refinement

Outputs:
- normalized posterior over bins
- top-K candidate list
- posterior intervals

### 7. Calibration And Abstention Layer
Turns raw posterior mass into a trustworthy decision.

Responsibilities:
- calibrate posterior scores on held-out known-time charts
- estimate selective risk and coverage
- decide whether to return exact, interval, or abstain
- widen the interval when evidence is weak

Outputs:
- calibrated confidence
- interval width
- abstention decision

### 8. Logging And Evaluation Layer
Captures every decision needed to audit the result.

Responsibilities:
- log inputs, feature versions, triage reasons, and posterior snapshots
- store selection-aware metrics
- record control-condition outcomes
- track benchmark version and dataset version

Outputs:
- immutable run log
- audit trail
- benchmark report payload

## Data Contracts

### Person Record
Contains:
- person id
- source set id
- provenance strata
- split assignment
- triage state

### Evidence Packet
Contains:
- evidence id
- person id
- evidence family
- semantic value
- support interval
- precision class
- source grade
- collector confidence
- model reliability weight
- extraction provenance

### Candidate Time Grid
Contains:
- candidate bin id
- local timestamp
- UTC timestamp
- resolution
- neighborhood id

### Posterior Object
Contains:
- bin probabilities
- top-K bins
- HPD interval
- calibration score
- abstention status
- selection state

## Design Rules
- Do not let learned components perform timezone or DST conversion.
- Do not let confidence metadata leak into the raw birth-time target.
- Do not mix documentary and rectified labels in the same gold path.
- Do not reuse triage score as a downstream feature.
- Do not allow multimodal signals into the core posterior unless they survive ablation.

## Recommended Deployment Shape
Run the system as a staged pipeline:
1. ingest and audit
2. triage
3. deterministic chart feature generation
4. evidence encoding
5. doctrine-specific scoring
6. posterior fusion
7. calibration and abstention
8. logging and report generation

## Minimal Interface Between Modules
Each module should accept and return only structured objects. Free text is allowed only at ingestion and interpretation boundaries, not inside the scoring core.

## Open Architectural Decisions
- whether the Western and Vedic experts share an initial geometry encoder
- whether the pairwise comparison head is a separate expert or a shared evidence family
- whether multimodal signals are enabled at all outside research mode
- how much pruning to apply before local refinement
