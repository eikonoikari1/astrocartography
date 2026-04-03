# Missing Ground Truth

The hardest data problem is not just noisy labels. It is the missing information needed to know whether a label is noisy in the first place.

## What Is Often Missing

- The original birth record itself.
- The exact wording of the source note.
- The collector trail that explains where the time came from.
- The timezone and DST rule actually applied.
- The local clock convention at the birth location.
- Whether the time was written at the event or reconstructed later.
- Whether the time refers to first breath, crowning, cord cutting, or paperwork completion.
- Alternative candidate times that were considered and rejected.

## Why This Matters

Without this metadata, a birth time may look minute-precise while actually being an approximation, an administrative entry, or a later reconstruction. That creates a false sense of resolution and makes exact-minute training targets untrustworthy.

The missing-ground-truth problem also affects evaluation. If a chart appears to be predicted within two minutes but the label itself is only approximate, the benchmark is overstating performance.

## What Would Help

The best missing fields to recover or add are:

- A scan or transcription of the original document.
- A source note that states the collector and original source explicitly.
- A flag for original, quoted, rectified, or estimated time.
- A timezone and DST audit trail.
- A confidence or uncertainty interval on the original time.
- A reason code for alternative times or conflicts.

## Research Implication

This suggests that rectification research should not only search for a better model. It should also build a cleaner truth layer. In practice, that means assembling a gold subset with explicit provenance and separate uncertainty handling rather than trusting database labels at face value.

## Sources

- [Astro-Databank handbook chapter 01](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01)
- [Astro-Databank Rodden Rating help](https://www.astro.com/astro-databank/Help%3ARR)
- [Astro-Databank edit help](https://www.astro.com/astro-databank/Help%3AEdit)
- [Astro-Databank time zone help](https://www.astro.com/astro-databank/Help%3ATimezone)
- [Astrodienst Astrowiki on the moment of birth](https://www.astro.com/astrowiki/en/Moment_of_Birth)
