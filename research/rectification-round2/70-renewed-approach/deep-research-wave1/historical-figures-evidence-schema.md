# Historical Figures Evidence Schema

## Purpose

Define the evidence model for open-source historical-figure rectification benchmarks.

The schema has to support three things at once:
- provenance-aware labels
- interval-censored life evidence
- benchmarking across full-day candidate times

## Design Rule

Separate:
- what happened
- when it happened
- how sure we are
- where the fact came from
- how the fact was extracted

Do not merge these into one confidence score.

## Core Entities

### `Person`
One benchmark subject.

Required fields:
- `person_id`
- `display_name`
- `canonical_ids`
- `birth_date`
- `birth_place`
- `death_date`
- `death_place`
- `occupation_tags`
- `era_tag`
- `source_set`

Recommended fields:
- `gender`
- `country_or_region`
- `language`
- `public_figure_flag`
- `biography_density_score`

### `SourceRecord`
One source document or page used for extraction.

Required fields:
- `source_id`
- `source_type`
- `source_url`
- `source_title`
- `revision_id_or_dump_version`
- `access_date`
- `license_note`
- `collector_id`

Recommended fields:
- `page_or_section`
- `text_span`
- `retrieval_method`
- `citation_text`
- `archival_reference`

### `EvidenceItem`
One extracted fact, relation, or event.

Required fields:
- `evidence_id`
- `person_id`
- `evidence_kind`
- `event_type`
- `value`
- `support_interval`
- `date_precision`
- `source_grade`
- `confidence`
- `provenance`

Recommended fields:
- `event_role`
- `extraction_method`
- `extractor_version`
- `review_status`
- `entity_link`
- `notes`

### `LifePeriod`
A span of life inferred from multiple evidence items.

Required fields:
- `period_id`
- `person_id`
- `period_type`
- `start_date`
- `end_date`
- `support_strength`
- `source_ids`
- `provenance`

Recommended fields:
- `anchor_events`
- `period_summary`
- `precision_class`
- `review_status`

### `ReviewDecision`
The audit outcome for an item or period.

Required fields:
- `decision_id`
- `target_id`
- `decision`
- `reason_codes`
- `reviewer_id`
- `review_date`
- `audit_version`

Possible decisions:
- `gold`
- `challenge`
- `quarantine`
- `reject`
- `needs_manual_review`

## Evidence Item Structure

Use the same structure for both point facts and interval facts.

```json
{
  "evidence_id": "ev_001",
  "person_id": "person_001",
  "evidence_kind": "event",
  "event_type": "marriage",
  "value": {
    "start_date": "1934-05-01",
    "end_date": "1934-05-31"
  },
  "support_interval": {
    "start": "1934-05-01",
    "end": "1934-05-31"
  },
  "date_precision": "month_precise",
  "source_grade": "contemporaneous",
  "confidence": {
    "value_confidence": 0.78,
    "trust_confidence": 0.91,
    "extraction_confidence": 0.84
  },
  "provenance": {
    "source_id": "src_123",
    "source_url": "https://example.org/page",
    "source_type": "Wikipedia revision",
    "revision_id_or_dump_version": "rev_456",
    "text_span": "married X in May 1934",
    "collector_id": "collector_a",
    "retrieval_method": "api",
    "extraction_method": "rules+review"
  }
}
```

## Controlled Vocabularies

### `event_type`
Use a closed set.

Suggested values:
- `birth`
- `death`
- `marriage`
- `divorce`
- `education`
- `appointment`
- `promotion`
- `award`
- `publication`
- `relocation`
- `residence_change`
- `illness`
- `surgery`
- `legal_event`
- `imprisonment`
- `office_term`
- `career_phase`
- `public_recognition`
- `family_change`

### `date_precision`
Suggested values:
- `exact_day`
- `month_precise`
- `year_precise`
- `interval`
- `approximate`
- `unknown`

### `source_grade`
Suggested values:
- `documentary`
- `contemporaneous`
- `near_contemporaneous`
- `retrospective`
- `secondary_summary`
- `unknown`

### `evidence_kind`
Suggested values:
- `point_event`
- `interval_event`
- `life_period`
- `relation`
- `attribute`

## Provenance Object

Every evidence item should carry a provenance object with:
- source identifier
- source URL
- source type
- access date
- revision or dump version
- collector trail
- text span
- extraction method
- review status

This is the minimum needed to decide whether an item is benchmark-grade or just biography noise.

## Confidence Model

Confidence should be split into separate channels:
- `value_confidence`: how sure we are about the event itself
- `trust_confidence`: how trustworthy the source is
- `extraction_confidence`: how well the span was parsed

Optional:
- `alignment_confidence`: how sure we are that the event aligns to the right person or period

This separation matters because a cleanly extracted but weakly sourced event is not the same as a strongly sourced but fuzzily extracted one.

## Life-Period Encoding

Life periods should be stored as first-class objects, not reconstructed lazily from events.

Use periods for:
- career phases
- relocation eras
- family-duty eras
- public-recognition eras
- crisis-heavy eras

Each period should be anchored by:
- one or more events
- a source span or spans
- a start and end date or date window
- a confidence score

## Audit Metadata

For benchmarking, store:
- `audit_decision`
- `audit_reason_codes`
- `review_status`
- `reviewer_id`
- `audit_version`
- `corpus_slice`
- `provenance_tier`

This lets the benchmark explain why an item was included or excluded.

## Recommended Tables

At minimum:
- `people`
- `source_records`
- `evidence_items`
- `life_periods`
- `review_decisions`
- `corpus_slices`

That is enough to support corpus-scale extraction, audit, and model training.

## Realistic Field Priorities

If storage or annotation budget is tight, prioritize these fields first:
- `person_id`
- `event_type`
- `value`
- `support_interval`
- `date_precision`
- `source_grade`
- `source_url`
- `revision_id_or_dump_version`
- `text_span`
- `confidence`
- `review_status`

Everything else is secondary.

## Why This Schema Fits Rectification

Rectification needs more than facts. It needs facts with:
- date precision
- provenance
- auditability
- interval support
- confidence separation

Without those, the model will learn the shape of the corpus rather than the shape of the person’s life.

## Source Anchors

- [Wikidata licensing and CC0 data policy](https://www.wikidata.org/wiki/Wikidata:Licensing)
- [Wikidata data access and dumps](https://www.wikidata.org/wiki/Help:Data_access)
- [Wikipedia export and revision history](https://www.mediawiki.org/wiki/Help:Export)
- [Chronicling America / Library of Congress API access](https://www.loc.gov/apis/additional-apis/chronicling-america-api/)
- [BiographyNet provenance and perspective framing](https://research.vu.nl/en/publications/biographynet-extracting-relations-between-people-and-events-2/)
- [Guidelines and a Corpus for Extracting Biographical Events](https://arxiv.org/abs/2206.03547)
- [EventKG+BT timeline generation from knowledge graphs](https://arxiv.org/abs/2012.06306)
- [Paths of A Million People: Extracting Life Trajectories from Wikipedia](https://arxiv.org/abs/2406.00032)
