# Benchmark Pipeline

## Goal
Define the implementation path from raw source records to a triage-aware rectification benchmark report. The pipeline must support strict gold evaluation, broader challenge evaluation, selection-aware reporting, and reproducible abstention.

## Pipeline Inputs

The benchmark pipeline consumes:
- raw birth-time records
- provenance metadata
- event histories
- interview responses
- candidate-time posterior outputs
- triage labels
- audit decisions
- optional control-condition artifacts

All inputs must be versioned and tied to a dataset snapshot.

## Pipeline Stages

### Stage 1: Ingest
Load raw source records and normalize them into canonical person, evidence, and birth-time objects.

Required actions:
- preserve raw source text
- preserve original local time separately from chart-converted time
- attach provenance objects to all source-derived records
- assign stable person ids and source ids
- record whether each record is documentary, quoted, rectified, estimated, or ambiguous

Outputs:
- canonical person record
- normalized evidence packets
- audit-ready birth-time records
- ingest log with source hashes

### Stage 2: Audit And Route
Run the gold audit workflow and minute-heaping audit before any benchmark score is computed.

Required actions:
- evaluate each record against strict gold gates
- assign `gold`, `challenge`, `quarantine`, or `reject`
- flag minute-heaped strata
- separate exact-minute candidates from rounded or reconstructed records

Outputs:
- audit decision per record
- provenance quality tier
- heaping status by source stratum
- routing label for each person or record

### Stage 3: Build Cohorts
Construct benchmark cohorts from audited records.

Required actions:
- split by person, not by session
- keep all records for one person on the same side of the split
- preserve provenance strata
- keep the strict gold set separate from the broader challenge set
- freeze cohort membership before model comparison begins

Recommended cohorts:
- strict gold
- challenge
- low-provenance stress set
- heaped-label stress set

Outputs:
- train fold
- validation fold
- test fold
- selected benchmark slices

### Stage 4: Freeze Triage
Apply the triage classifier to every candidate case using frozen thresholds.

Required actions:
- load the fixed triage model and threshold version
- compute `high`, `medium`, or `low`
- store triage reasons and scores
- prevent triage labels from entering downstream inference as features

Outputs:
- triage label
- triage score
- triage reason codes
- selection probability or audit inclusion probability when available

### Stage 5: Run Rectification Tracks
Execute the rectification system on each benchmark case.

Recommended tracks:
- geometry only
- event windows only
- life-structure interview only
- pairwise candidate comparisons only
- full combined system
- biography-only baseline
- random control

Required actions:
- use the same candidate grid across comparable tracks
- keep question budgets fixed for fair comparison
- log posterior snapshots after each evidence update

Outputs:
- per-case posterior runs
- top-K candidate bins
- HPD interval
- abstention decision

### Stage 6: Score Selected And Full Populations
Report results on both the selected subset and the full population.

Selected population metrics:
- top-1 minute error
- `% within ±2 min`
- `% within ±5 min`
- `% within ±10 min`
- interval width
- posterior entropy reduction per question
- conditional calibration

Full population metrics:
- selection rate
- false-high rate
- abstention rate
- marginal calibration
- full-population interval width
- selection-conditional coverage

Required rule:
- never report selected-set results without full-population results

### Stage 7: Apply Controls
Run all negative controls in the same benchmark harness.

Required controls:
- shuffled birth times
- shuffled evidence assignments
- biography-only baseline
- static questionnaire baseline
- random question ordering
- placebo geometry features
- rounded or corrupted timestamps

The benchmark should fail if the main system only looks strong under weak or corrupted controls.

### Stage 8: Aggregate And Report
Generate a frozen benchmark report from the run outputs.

Required report contents:
- dataset version
- split protocol
- provenance strata
- gold/challenge composition
- triage label distribution
- evidence families enabled
- calibration method
- abstention rule
- metric table by cohort
- metric table by triage label
- metric table by separability spacing
- control-condition comparison
- worst-case failure analysis

## Report Format

Each run should emit:
- a machine-readable JSON summary
- a human-readable markdown report
- a provenance manifest
- a cohort manifest
- a calibration manifest
- an audit manifest

## Frozen Configuration

The following must be frozen before test evaluation:
- triage thresholds
- gold/challenge routing rules
- cohort splits
- candidate grid resolution
- calibration method
- abstention rule
- question budget
- control-condition definitions

If any of these change, the benchmark version must change.

## Implementation Interfaces

### `ingest_raw_sources()`
Input:
- raw source payloads

Output:
- canonical records and provenance objects

### `audit_record()`
Input:
- normalized birth-time or evidence record

Output:
- audit decision and reason codes

### `route_case()`
Input:
- audit decision, provenance tier, heaping status

Output:
- gold, challenge, quarantine, or reject

### `run_triage()`
Input:
- routed case plus frozen triage config

Output:
- high, medium, or low

### `score_case()`
Input:
- benchmark case and evidence bundle

Output:
- posterior run and calibration output

### `report_benchmark()`
Input:
- per-case results and control runs

Output:
- frozen benchmark report

## Failure Conditions

Abort or mark the run invalid if:
- triage thresholds were not frozen
- person-level splits were violated
- gold and challenge records were mixed without stratification
- selection-aware coverage was not reported
- label noise or heaping was ignored
- the baseline set was weaker than the main system by construction

## Related Specs
- [benchmark-spec.md](/Users/eiko/astrocartography/research/rectification-round2/40-modeling/benchmark-spec.md)
- [separability-benchmark-protocol.md](/Users/eiko/astrocartography/research/rectification-round2/40-modeling/separability-benchmark-protocol.md)
- [gold-audit-checklist.md](/Users/eiko/astrocartography/research/rectification-round2/20-data/gold-audit-checklist.md)
- [minute-heaping-audit-spec.md](/Users/eiko/astrocartography/research/rectification-round2/20-data/minute-heaping-audit-spec.md)

