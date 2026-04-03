# Gold Subset Criteria

The benchmark subset should be smaller than the full archive and much stricter than the general training pool. Its job is to support honest evaluation, not maximize chart count.

## Recommended Default

Use a tiered subset, with the core benchmark built from the highest-confidence documentary records:

- Tier 1: direct birth records, birth certificates, hospital birth records, parish records, baby books, or comparable contemporaneous documents.
- Tier 2: close-source testimony with strong provenance and no conflicting records.
- Tier 3: biography-based entries only if they are explicitly documented and independently cross-checkable.

For the main benchmark, Tier 1 should carry most of the weight. Tier 2 can be retained as a secondary slice, but it should not be blended silently into the gold score.

## Required Fields

Each benchmark record should include:

- Original local birth time.
- Timezone and DST state at the birth location and date.
- Source type.
- Source note text.
- Whether the time is original, quoted, or rectified.
- Whether there are alternative times.
- Whether the original document was scanned or copied.
- Whether the record has been independently cross-checked.

## Exclusion Rules

Exclude or quarantine records with any of the following:

- No original source note.
- Conflicting times that are not resolved.
- Rectified times presented as if they were documentary.
- Unknown timezone history.
- Unknown date style or unresolved local-time conversion.
- Pure hearsay with no traceable collector trail.
- Entries with obvious rounding artifacts when minute precision is required.

## Why Not Use Everything

Astro-Databank itself recommends AA, A, and B data for studying houses or Moon positions, while allowing lower-grade data for more forgiving questions. That is a useful clue: if rectification is supposed to test minute-sensitive timing, the benchmark should be stricter than the general research pool.

## Benchmark Design Recommendation

Keep at least two evaluation sets:

- A strict gold set for minute-level scoring.
- A broader challenge set that includes noisier records and tests abstention, calibration, and robustness.

That split lets the system prove itself on clean labels without pretending the noisier world is equally exact.

## Sources

- [Astro-Databank handbook chapter 01](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01)
- [Astro-Databank Rodden Rating help](https://www.astro.com/astro-databank/Help%3ARR)
- [Astro-Databank filter guide PDF](https://www.astro.com/adbexport/adb_pc_old/adb_filter.pdf)
- [Astro-Databank edit help](https://www.astro.com/astro-databank/Help%3AEdit)
