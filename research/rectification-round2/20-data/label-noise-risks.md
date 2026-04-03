# Label Noise Risks

The main risk in rectification is treating a recorded birth time as if it were a clean label when it may be a rounded, delayed, reconstructed, or disputed observation.

## Noise Modes That Matter

The biggest noise sources are:

- Family memory or hearsay presented as if it were documentary.
- Conflicting times across records, especially when later collectors have chosen one version.
- Rectified times mixed into the same pool as original times.
- Timezone and DST mistakes, which can shift a chart by an hour or more.
- Different definitions of the birth moment, such as first breath, crowning, or cord cutting.
- Hospital or administrative delay between the event and the recorded timestamp.
- Minute-heaping, where recorded times cluster at round values or convenient increments.

Astro-Databank’s own guidance makes the provenance problem obvious: `C` data can have unknown origin, `DD` data can be conflicting, and even `AA` data still needs the source notes to be trustworthy. That means a minute label can be structurally overconfident even before any astrology enters the picture.

## Why Minute-Heaping Matters

If many times are rounded to `00`, `15`, `30`, or `45`, a model can learn the rounding convention instead of the birth event. More generally, any digit-preference pattern can create fake precision and inflate apparent performance when candidate bins are close together.

For this reason, exact-minute training should be treated as noisy interval learning unless the source note and record type justify a true minute-level claim.

## What To Watch For In Data Audits

- Excess mass on round minutes or half-hours.
- Times that are suspiciously repeated across unrelated people.
- Source notes that say `about`, `approximately`, `before noon`, `family says`, or `rectified`.
- Entries where the record source is clear but the actual original document is absent.
- Cases where timezone or DST has been inferred later and not preserved separately from the source time.

## Modeling Implication

Label noise is not just a data-cleaning issue. It changes the correct objective. If the labels are noisy, the model should predict a posterior interval or confidence-weighted time distribution rather than a single deterministic minute.

## Sources

- [Astro-Databank Rodden Rating help](https://www.astro.com/astro-databank/Help%3ARR)
- [Astro-Databank handbook chapter 01](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01)
- [Astro-Databank time zone help](https://www.astro.com/astro-databank/Help%3ATimezone)
- [Astrodienst Astrowiki on the moment of birth](https://www.astro.com/astrowiki/en/Moment_of_Birth)
- [Digit preference review](https://research.fs.usda.gov/treesearch/17075)
- [Digit preference modeling paper](https://academic.oup.com/jrsssc/article/66/5/893/7058305)
