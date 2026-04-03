# Evidence Object Model

## Purpose
Define how a single evidence item should be represented in the rectification pipeline so that trust, uncertainty, and provenance are explicit and machine-readable.

## Evidence Object

An evidence object should contain five distinct layers:

1. What was observed.
2. How precise the observation is.
3. How trustworthy the source is.
4. How much the model should rely on it.
5. Where the observation came from.

These layers should not be merged into one score.

## Recommended Shape

```json
{
  "evidence_item_id": "ev_123",
  "person_id": "person_456",
  "evidence_family": "event_timing",
  "evidence_type": "interval_censored_event",
  "value": {
    "event_type": "marriage",
    "start_date_local": "1998-06-01",
    "end_date_local": "1998-06-30"
  },
  "support_interval": {
    "start": "1998-06-01",
    "end": "1998-06-30"
  },
  "precision_class": "month_precise",
  "source_grade": "documentary",
  "collector_confidence": 0.92,
  "model_reliability_weight": 0.84,
  "confidence": {
    "trust_level": 0.92,
    "value_uncertainty": 0.40,
    "annotation_uncertainty": 0.10
  },
  "provenance": {
    "source_id": "src_789",
    "source_type": "birth_certificate",
    "source_note": "Original record scan",
    "collector_id": "collector_a",
    "collector_trail": ["archive_x", "index_y"],
    "original_document_uri": "uri://scan/abc",
    "transcription_uri": "uri://transcript/def",
    "recorded_local_time": "1987-03-11T10:14:00",
    "timezone_rule": "America/New_York",
    "dst_rule": "1987-summer-time-rule",
    "conversion_method": "deterministic_local_to_utc",
    "conflict_status": "none",
    "audit_status": "gold_candidate"
  }
}
```

## Field Semantics

### `value`
The semantic content of the evidence. For birth time evidence, this may be an exact time, a range, or an interval-censored event description. For a question response, this may be a forced-choice selection or a normalized free-text label.

### `support_interval`
The range of admissible values supported by the source. For exact minute labels, this can collapse to a point only if the provenance truly supports exactness.

### `precision_class`
An ordinal label describing how sharp the source is.

Suggested values:
- `exact_minute`
- `minute_precise`
- `hour_precise`
- `day_precise`
- `month_precise`
- `approximate`
- `unknown`

### `source_grade`
The provenance tier.

Suggested values:
- `documentary`
- `near_documentary`
- `family_memory`
- `hearsay`
- `rectified`
- `unknown`

### `collector_confidence`
How confident the collector or auditor is that the source note was interpreted correctly.

### `model_reliability_weight`
The weight the model should apply after calibration, which may differ from the raw human confidence.

### `confidence`
A separate confidence object that captures uncertainty in both the observation and the trust relationship.

Suggested subfields:
- `trust_level`
- `value_uncertainty`
- `annotation_uncertainty`
- `evidence_completeness`

## Interval-Censored Event Evidence

Use interval censoring when the event is known only to a date range or rough window.

Represent it as:
- `event_type`
- `start_date_local`
- `end_date_local`
- `support_precision`
- `date_status`
- `confidence`

The likelihood function should integrate over the interval instead of forcing a single date. The schema should never collapse the interval into one point just because downstream code prefers point values.

## Confidence Rules

Confidence should affect inference in this order:
1. posterior width
2. abstention threshold
3. model reliability weight
4. only then point estimate preference

That rule prevents weak evidence from dominating the posterior just because it was formatted cleanly.

## Provenance Rules

Every evidence object should preserve:
- original source note
- source type
- collector trail
- original local timestamp or interval
- timezone and DST rules
- conflict state
- scan or transcription links

If any of those are missing, the evidence should be demoted to the challenge set or quarantined.

## Evidence Family Encoding

The object model should support at least these families:
- `event_timing`
- `life_structure`
- `relationship_pattern`
- `career_axis`
- `family_duty`
- `mobility`
- `crisis_pattern`
- `identity_pressure`
- `work_style`
- `emotional_posture`
- `presentation`
- `public_biography`
- `multimodal_research_only`

## Recommended Processing Pipeline

1. Ingest raw source record.
2. Normalize provenance and confidence.
3. Convert date ranges to interval-censored evidence when needed.
4. Assign source grade and precision class.
5. Compute model reliability weight.
6. Feed the object into the evidence-specific likelihood module.
7. Update the posterior.

## Hard Constraints

- Do not use provenance fields as direct predictive features unless the baseline explicitly does so.
- Do not collapse confidence into a single scalar if the source distinguishes value uncertainty from trust uncertainty.
- Do not overwrite an uncertain interval with a point estimate during ingestion.
- Do not let a rectified time look identical to a documentary time in storage.

## Storage Recommendation

Store raw and normalized forms side by side:
- `raw_evidence_object`
- `normalized_evidence_object`
- `audit_decision`
- `likelihood_input`

That keeps auditability intact and makes it easier to run ablation studies later.

