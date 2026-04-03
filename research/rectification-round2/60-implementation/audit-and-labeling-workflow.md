# Audit And Labeling Workflow

## Goal
Define the operational workflow that turns raw birth-time records and evidence into auditable labels for strict gold, challenge, quarantine, or reject.

## Workflow Roles

### Auditor
Performs the initial review against the hard gates.

Responsibilities:
- inspect source note and collector trail
- verify original local time
- verify timezone and DST handling
- assess minute precision plausibility
- detect rounded, quoted, or rectified contamination

### Secondary Reviewer
Checks consistency and resolves borderline cases.

Responsibilities:
- confirm the audit decision
- review conflicting sources
- validate route assignment
- sign off on quarantine versus reject when needed

### Label Curator
Maintains the label manifest and cohort routing.

Responsibilities:
- preserve audit decisions
- assign source strata
- maintain gold/challenge boundaries
- record final labels and reason codes

## Label States

Use the following record-level states:
- `gold`
- `challenge`
- `quarantine`
- `reject`
- `needs_manual_review`

Use the following birth-time status values:
- `original`
- `quoted`
- `rectified`
- `estimated`
- `unknown`

Use the following provenance states:
- `documentary`
- `near_documentary`
- `family_memory`
- `hearsay`
- `mixed`

## Record Intake Order

1. Read the source note before the chart.
2. Identify the original local time and source class.
3. Attach collector trail and original document links.
4. Resolve timezone and DST history.
5. Check for conflicts, duplicates, and rectification contamination.
6. Determine whether minute precision is plausible.
7. Assign the record state.

## Gold Routing Rules

A record may enter strict gold only if all of the following are true:
- the source is documentary or equivalently strong contemporaneous evidence
- the original local time is preserved
- timezone and DST conversion are auditable
- conflicts are resolved
- the time is not rectified or estimated
- minute precision is supported by the source
- the intended birth moment is unambiguous

If any hard gate fails, route the record away from strict gold.

## Challenge Routing Rules

Use `challenge` when the record is still useful but fails one or more gold gates.

Typical challenge cases:
- rounded documentary times
- near-documentary records with partial provenance
- explicit rectified times
- records with strong evidence but unresolved timezone ambiguity
- fuzzy event histories that are still useful for coarse narrowing

Challenge records may support calibration, abstention, and coarse-to-fine evaluation, but not strict minute-level scoring unless stratified.

## Quarantine Rules

Use `quarantine` when the record is promising but unsafe to score directly.

Typical quarantine triggers:
- unresolved source conflict
- unclear birth moment semantics
- missing original local time
- unknown DST handling
- minute heaping that suggests transcription or rounding artifact
- duplicated sources with inconsistent wording

Quarantine is temporary. A quarantined record should either be repaired, demoted to challenge, or rejected.

## Reject Rules

Use `reject` when the record cannot be audited well enough for any benchmark use.

Typical reject triggers:
- no traceable source trail
- pure hearsay
- unresolvable conflict
- indistinguishable rectified and documentary labels
- no reliable local-time context

## Minute-Heaping Workflow

For each source stratum:
1. extract original local minute values
2. separate documentary, quoted, and rectified records
3. compute heaping metrics
4. compare round-minute bins to adjacent bins
5. flag source families with strong rounding or transcription artifacts
6. quarantine strata that are unsafe for exact-minute training

Heaping results should influence routing, but they should not overwrite provenance labels.

## Labeling Fields To Store

Each audited record should store:
- `audit_decision`
- `audit_reason_codes`
- `source_grade`
- `time_status`
- `minute_precision_plausible`
- `conflicts_present`
- `rounding_artifact_flag`
- `timezone_rule`
- `dst_rule`
- `collector_trail`
- `reviewer_id`
- `review_status`
- `audit_version`

## Machine-Readable Reason Codes

Suggested reason codes:
- `DIRECT_DOCUMENTARY_SOURCE`
- `SOURCE_NOT_TRACEABLE`
- `TIMEZONE_UNCLEAR`
- `DST_UNCLEAR`
- `RECTIFIED_LABEL_CONTAMINATION`
- `ROUNDING_ARTIFACT`
- `CONFLICT_UNRESOLVED`
- `BIRTH_MOMENT_AMBIGUOUS`
- `MINUTE_PRECISION_IMPLAUSIBLE`
- `GOLD_OK`

Reason codes should be short, stable, and reusable in reports.

## Escalation Rules

Escalate to secondary review when:
- a record is borderline gold versus challenge
- provenance and minute precision disagree
- multiple sources conflict but one may be salvageable
- heaping suggests a likely label artifact
- a collector trail is incomplete but not obviously invalid

## Audit Output

Every audited record should emit:
- a final label
- a routing decision
- a confidence note
- a list of evidence used
- a list of evidence ignored
- a manual-review flag when needed

## Labeling Principles

- provenance is part of the label
- minute precision must be justified, not assumed
- challenge records are not failures; they are separate evaluation material
- quarantine is better than forced certainty
- the audit record should explain the decision without requiring the chart

## Integration With Benchmarking

The audit workflow feeds the benchmark pipeline as follows:
- `gold` records enter strict minute-level scoring
- `challenge` records enter calibration and robustness scoring
- `quarantine` records are held out until repaired or manually resolved
- `reject` records are excluded from benchmark scoring

The benchmark report must preserve these distinctions.

## Related Specs
- [gold-audit-checklist.md](/Users/eiko/astrocartography/research/rectification-round2/20-data/gold-audit-checklist.md)
- [minute-heaping-audit-spec.md](/Users/eiko/astrocartography/research/rectification-round2/20-data/minute-heaping-audit-spec.md)
- [data-schema.md](/Users/eiko/astrocartography/research/rectification-round2/60-implementation/data-schema.md)
- [evidence-object-model.md](/Users/eiko/astrocartography/research/rectification-round2/60-implementation/evidence-object-model.md)
