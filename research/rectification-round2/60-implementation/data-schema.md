# Data Schema

## Purpose
Define the implementation-ready entities for rectification so the system can ingest provenance-aware evidence, run triage, and produce calibrated birth-time posteriors without mixing label quality into the value itself.

## Core Entities

### `Person`
Represents the subject of rectification.

Required fields:
- `person_id`
- `display_name`
- `external_ids`
- `birth_location`
- `birth_date_local`
- `population_tags`
- `privacy_level`

Recommended fields:
- `sex_at_birth`
- `gender_identity`
- `culture_region`
- `source_summary`

### `BirthTimeRecord`
Represents one candidate birth-time source or label.

Required fields:
- `birth_time_record_id`
- `person_id`
- `original_local_time`
- `time_status` with values like `original`, `quoted`, `rectified`, `estimated`
- `source_type`
- `source_note`
- `collector_id`
- `source_grade`
- `timezone_rule`
- `dst_rule`
- `audit_decision`

Recommended fields:
- `support_interval`
- `minute_precision_plausible`
- `conflicts_present`
- `document_scan_uri`
- `transcription_uri`
- `collector_confidence`

### `EvidenceItem`
Represents one piece of evidence used in rectification.

Required fields:
- `evidence_item_id`
- `person_id`
- `evidence_family`
- `evidence_type`
- `value`
- `support_interval`
- `precision_class`
- `source_grade`
- `collector_confidence`
- `model_reliability_weight`
- `provenance`

Recommended fields:
- `observed_at`
- `recorded_by`
- `recorded_source_id`
- `label_status`
- `fuzzy_value`
- `retrieval_uri`

### `QuestionResponse`
Represents one response in the adaptive interview.

Required fields:
- `question_response_id`
- `person_id`
- `question_family`
- `question_type`
- `prompt_version`
- `response_value`
- `response_confidence`
- `response_time_ms`
- `response_status`

Recommended fields:
- `candidate_set_snapshot_id`
- `generated_by`
- `contradiction_flag`
- `free_text_raw`
- `free_text_normalized`

### `CandidateTimeBin`
Represents one candidate birth-time bin in the posterior grid.

Required fields:
- `candidate_time_bin_id`
- `person_id`
- `start_local_time`
- `end_local_time`
- `bin_width_seconds`
- `posterior_probability`
- `rank`

Recommended fields:
- `prior_probability`
- `log_posterior_score`
- `interval_label`
- `is_top_interval_member`

### `TriageCase`
Represents one pre-inference case for routing to high, medium, or low separability.

Required fields:
- `triage_case_id`
- `person_id`
- `source_quality_tier`
- `evidence_richness_tier`
- `local_geometry_score`
- `triage_label`
- `triage_threshold_version`

Recommended fields:
- `triage_score`
- `triage_reason_codes`
- `audit_sample_inclusion_probability`

### `PosteriorRun`
Represents one full rectification inference run.

Required fields:
- `posterior_run_id`
- `person_id`
- `run_type`
- `model_version`
- `triage_case_id`
- `input_snapshot_id`
- `posterior_summary`
- `abstention_decision`
- `created_at`

Recommended fields:
- `top_interval`
- `calibration_version`
- `evidence_family_scores`
- `question_budget_used`

## Shared Provenance Object

Every record that contributes to rectification should embed a `provenance` object with:
- `source_id`
- `source_type`
- `source_note`
- `collector_id`
- `collector_trail`
- `original_document_uri`
- `transcription_uri`
- `source_grade`
- `recorded_local_time`
- `timezone_rule`
- `dst_rule`
- `conversion_method`
- `conflict_status`
- `audit_status`

This is the minimum needed to audit whether a label is truly minute-level or merely minute-shaped.

## Interval-Censored Event Representation

Event evidence should not be stored as a single date when the date is uncertain.

Use an interval object:
- `event_id`
- `person_id`
- `event_type`
- `start_date_local`
- `end_date_local`
- `support_precision`
- `date_source_grade`
- `date_status`
- `confidence`
- `provenance`

If the evidence is fuzzy, keep the interval explicit and let the likelihood module marginalize over the support range.

## Core Relationships

- One `Person` has many `BirthTimeRecord` entries.
- One `Person` has many `EvidenceItem` entries.
- One `Person` has many `QuestionResponse` entries.
- One `Person` has many `CandidateTimeBin` entries per run.
- One `PosteriorRun` belongs to one `Person` and one `TriageCase`.

## Recommended Storage Separation

Keep these layers separate:
- raw source records
- normalized evidence items
- interview responses
- candidate-time posterior outputs
- audit and triage metadata

That separation prevents a model from learning provenance artifacts as if they were chart signal.

## Validation Rules

- Do not allow `rectified` and `documentary` labels to share the same undifferentiated field.
- Do not allow confidence to overwrite value.
- Do not allow timezone conversion logic to be inferred from free text.
- Do not allow a triage label to be reused as a truth label.
- Do not allow interval-censored events to be collapsed into single dates unless the interval is genuinely exact.

## Implementation Notes

The schema should support both strict gold and broader challenge sets. The same entity types should be used in both, but the admissible `source_grade`, `precision_class`, and `audit_decision` values should be stricter for gold.

