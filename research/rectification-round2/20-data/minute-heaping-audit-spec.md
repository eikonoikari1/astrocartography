# Minute-Heaping Audit Spec

This spec measures whether recorded birth times show rounding or digit-preference artifacts that would inflate rectification performance.

## Scope

Audit the original local birth time field only. Do not audit chart-converted times, UTC-normalized outputs, or later derived fields as if they were source labels.

## Core Hypothesis

If the data are clean, minute values within the hour should be close to evenly distributed except for genuine source-specific structure. If they are rounded, the distribution will spike at preferred bins such as `00`, `05`, `10`, `15`, `30`, and `45`.

## Required Normalization

- Keep original local time and source type separate.
- Parse minute values in the range `0-59`.
- Record whether the source was documentary, quoted, estimated, or rectified.
- Preserve timezone and DST metadata, but do not mix them into the heaping calculation.
- Exclude records without a stable minute field from the main heaping analysis and report them separately.

## Stratification

Report all heaping results by at least these strata:

- source type
- year or birth decade
- geography or timezone family
- collector or database source
- original versus quoted versus rectified time

If a stratum is too small, merge only with an explicitly documented rule.

## Primary Metrics

| Metric | Definition | Why it matters |
|---|---|---|
| `round_minute_share` | Share of records at `:00` | Detects exact-hour heaping |
| `quarter_hour_share` | Share at `:00`, `:15`, `:30`, `:45` | Detects coarse rounding |
| `five_minute_share` | Share at multiples of 5 minutes | Detects common human rounding practice |
| `ten_minute_share` | Share at multiples of 10 minutes | Detects coarser digit preference |
| `terminal_digit_entropy` | Entropy of minute terminal digits `0-9` | Captures concentration beyond one or two bins |
| `heap_ratio_k` | Observed mass on multiples of `k` divided by baseline expectation | Summarizes heaping strength for `k = 5, 15, 30, 60` |
| `adjacent_bin_asymmetry` | Mass at heap bins versus neighboring bins | Helps separate rounding from genuine clustering |
| `top_bin_concentration` | Share captured by the most common minute values | Shows whether one or a few bins dominate |

## Recommended Tests

- Use a chi-square goodness-of-fit test against a uniform minute distribution within each stratum when sample size is adequate.
- Use a permutation or Monte Carlo test for small strata.
- Compare against an objective-control baseline when available, for example time labels known to be free of self-report rounding.
- Fit a simple rounding-mixture model to estimate the probability that a record was rounded to `5`, `15`, `30`, or `60` minute grids.

## Heaping Diagnostics To Report

For each stratum, report:

- sample size
- minute histogram
- the most common minute values
- `round_minute_share`
- `quarter_hour_share`
- `five_minute_share`
- `heap_ratio_5`, `heap_ratio_15`, `heap_ratio_30`, `heap_ratio_60`
- p-value or permutation score
- an effect-size summary
- whether the pattern is consistent with rounding, transcription noise, or genuine schedule structure

## Interpretation Rules

- If the distribution spikes only at round bins and neighboring bins are depleted, treat that as rounding.
- If the distribution is broad but still favors a few bins, inspect source notes for transcription conventions or administrative recording practices.
- If heaping is strong in documentary records, do not use the pool for exact-minute training without additional filtering.
- If heaping varies heavily by source type, source type must be part of the label model.

## Provisional Review Flags

Flag a stratum for manual review when any of the following hold:

- quarter-hour share is materially above adjacent-bin share
- five-minute share is much larger than non-multiples of five
- the top three minute bins dominate the distribution
- the result changes sharply when rectified records are removed
- the pattern differs materially across collector or source classes

The exact numeric threshold should be calibrated on the dataset, not assumed in advance.

## Reporting Format

Each audit run should emit:

1. A table of metrics by stratum.
2. A minute histogram for each major stratum.
3. A note on whether the pool is safe for strict gold use.
4. A note on whether any source class should be quarantined.
5. A separate list of records with obvious minute rounding artifacts.

## Operational Outcome

- `clean`: safe for strict gold consideration.
- `mixed`: usable only after stratification or source filtering.
- `heaped`: not safe for exact-minute training without additional cleaning.

## Sources

- [Are self-reported times rounded? Insights from times reported by an objective third party](https://www.sciencedirect.com/science/article/pii/S2590198222001580)
- [Rounding of Arrival and Departure Times in Travel Surveys: An Interpretation in Terms of Scheduled Activities](https://www.bts.gov/archive/publications/journal_of_transportation_and_statistics/volume_05_number_01/paper_05/index)
- [Digit preference review](https://research.fs.usda.gov/treesearch/17075)
- [Digit preference modeling paper](https://academic.oup.com/jrsssc/article/66/5/893/7058305)
- [Statistical analysis for rounded data](https://www.sciencedirect.com/science/article/abs/pii/S0378375808004722)
