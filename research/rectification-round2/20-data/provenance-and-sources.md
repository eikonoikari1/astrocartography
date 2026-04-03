# Provenance And Sources

Rectification work only becomes meaningful when source quality is separated from astrological interpretation. The Rodden system is useful because it encodes where a time came from, not whether the chart theory is true.

## What The Rating System Actually Means

Astro-Databank uses these broad source classes:

- `AA` for a birth certificate or other direct birth record, including comparable official or family-record documents.
- `A` for quoted memory or close-source testimony, including the person, parent, relative, friend, or associate.
- `B` for biography or autobiography.
- `C` for caution cases where the original source is unknown or the data were rectified.
- `DD` for dirty data, especially conflicting times or unreliable provenance.
- `X` and `XX` when time or date is missing or contested.

The important point is that the Rodden label is a provenance label, not a guarantee of exact minute accuracy. Astro-Databank explicitly warns that the rating alone is never a substitute for the source notes.

## What Good Source Notes Need

The Astro-Databank handbook says source notes should identify the original publication or document, the person who supplied it, and the original time signature if that is disputed. It also notes that different records may conflict even when they are all presented as coming from the same person.

For a benchmark dataset, the source note matters as much as the letter rating. A clean `AA` entry with a scanned birth record is much stronger than a bare `AA` tag without the document. A rectified time is a different object from a documentary time, even if both are precise to the minute.

## Why Time Precision Is Still Tricky

Astrodienst notes that there is no universal standard for the exact moment of birth. Some traditions use first breath, some use cord cutting, and civil records may reflect administrative recording rather than the physiological moment.

Astro-Databank also distinguishes between the wall-clock birth time and the later conversion to timezone and DST-adjusted chart time. That means the benchmark has to preserve both the original local time and the conversion metadata.

## Benchmark Implication

For serious rectification benchmarking, the safest default is a gold subset built from the strongest documentary sources, with source notes preserved verbatim and timezone history explicit. Lower-grade source classes can still be useful, but they should be used as separate strata rather than blended into the core evaluation set.

## Sources

- [Astro-Databank Rodden Rating help](https://www.astro.com/astro-databank/Help%3ARR)
- [Astro-Databank handbook chapter 01](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01)
- [Astro-Databank time zone help](https://www.astro.com/astro-databank/Help%3ATimezone)
- [Astrodienst Astrowiki on the moment of birth](https://www.astro.com/astrowiki/en/Moment_of_Birth)
