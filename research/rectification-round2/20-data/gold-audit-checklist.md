# Strict Gold Audit Checklist

Use this checklist to decide whether a record belongs in the strict gold subset for minute-level rectification.

## Decision Rule

A record is `gold` only if every hard gate passes. If a record is strong but not fully documentary, move it to the broader challenge set rather than weakening the gold standard.

## Hard Gates

| Gate | What to inspect | Pass condition | Fail condition | Action |
|---|---|---|---|---|
| 1. Direct provenance | Source note, collector trail, original document | The birth time comes from a direct documentary source or an equivalently strong contemporaneous record | The time is hearsay, reconstructed, or only inferential | Reject from strict gold |
| 2. Source traceability | Original note text, citation, scan or transcription | The source note identifies the original source, not just the later collector | The note is absent, vague, or only gives a database tag | Reject from strict gold |
| 3. Original local time | Record time, local time convention | The original local birth time is preserved separately from chart conversion | Only converted chart time is available, or the original local time is unclear | Reject or quarantine |
| 4. Timezone and DST audit trail | Location, date, timezone rule, DST rule | The conversion to chart time can be reproduced from the birth location and date | Timezone or DST is unknown, assumed, or inconsistent | Reject or quarantine |
| 5. Conflict resolution | Alternate times, duplicates, collector notes | Conflicts are resolved and the selected time is justified in the record | Conflicting times remain unresolved | Reject from strict gold |
| 6. Label type | Source metadata | The time is explicitly original, not rectified or estimated | A rectified time is mixed into the documentary pool | Reject from strict gold |
| 7. Minute precision plausibility | Minute values, source wording, document type | The source supports exact-minute precision rather than rounded or approximate time | The entry is rounded, approximate, or minute precision is unsupported | Reject from strict gold |
| 8. Birth moment semantics | Source wording | The record clearly refers to the intended birth moment and that definition is recorded | The source could refer to first breath, crowning, cord cutting, or paperwork completion without clarification | Quarantine or reject |

## Additional Checks

- Confirm that the record is not duplicated under another collector or database entry.
- Confirm that minute precision is not an artifact of transcription or later formatting.
- Confirm that the source is not a rectified time presented as documentary.
- Confirm that any scan, transcription, or copied note matches the original wording closely enough to audit.

## Gold vs Challenge Set Routing

- `gold`: all hard gates pass and the source is documentary or comparably strong.
- `challenge`: the record is useful, but one or more hard gates are missing or weaker.
- `reject`: the record has unresolved conflict, unknown provenance, or obvious contamination.

## Recommended Review Workflow

1. Read the source note first, not the chart.
2. Verify the original time and its local context.
3. Verify timezone and DST handling.
4. Check for conflict, rounding, and rectification contamination.
5. Assign `gold`, `challenge`, or `reject`.
6. Record the reason for the decision in a machine-readable note.

## Minimum Metadata To Store

- `original_local_time`
- `source_type`
- `source_note`
- `collector_trail`
- `timezone_rule`
- `dst_rule`
- `document_scan_present`
- `time_status` (`original`, `quoted`, `rectified`, `estimated`)
- `conflicts_present`
- `rounding_artifact_flag`
- `audit_decision`

## Why This Is Strict

Minute-level rectification is only meaningful if the label itself is genuinely minute-level. A permissive benchmark would reward the model for fitting rounding artifacts, not birth-time structure.

## Sources

- [Astro-Databank handbook chapter 01](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01)
- [Astro-Databank Rodden Rating help](https://www.astro.com/astro-databank/Help%3ARR)
- [Astro-Databank edit help](https://www.astro.com/astro-databank/Help%3AEdit)
- [Astro-Databank time zone help](https://www.astro.com/astro-databank/Help%3ATimezone)
- [Astrodienst Astrowiki on the moment of birth](https://www.astro.com/astrowiki/en/Moment_of_Birth)
