# High-Separability Subsets

## Question
Which charts are most likely to support precise rectification, and which should be expected to stay ambiguous?

## Why This Matters
The product should know when to spend effort on fine rectification and when to stop at a wider interval.

## Best Available Sources
- [Astrodienst Astrowiki: Time of Birth](https://www.astro.com/astrowiki/en/Time_of_Birth)
- [Astrodienst Astrowiki: Primary Direction](https://www.astro.com/astrowiki/en/Primary_Directions)
- [The Astrology Podcast Ep. 169 transcript](https://theastrologypodcast.com/transcripts/ep-169-transcript-rectification-using-astrology-to-find-your-birth-time/)
- [Astro-Databank: Rodden Rating](https://www.astro.com/astro-databank/Help:Rodden_Rating)
- [Astro-Databank: Data collecting](https://www.astro.com/astro-databank/Astro-Databank%3AData_collecting)

## High-Separability Inclusion Criteria
The strongest subset is the intersection of three things:
- A trustworthy birth-time source.
- Enough concrete life events to cross-check multiple techniques.
- Chart geometry that actually changes inside narrow time bins.

## Source Quality Criteria
Prefer cases where the birth time comes from:
- a birth certificate or registry
- a family record made close to birth
- a documented hospital record with known timezone and DST handling

Treat the following as lower confidence:
- family memory with no written source
- rounded times
- pre-1970 times with uncertain timezone or DST handling
- rectified times that are not clearly labeled as rectified

## Geometry Criteria
High-separability charts are more likely when:
- an angle or cusp is near a sign boundary
- a significant planet or sensitive point lies near an angle or cusp
- the candidate window crosses a day/night or rising-sign family boundary
- the chart is being assessed with axis-based timing techniques

Low-separability charts are more likely when:
- the same rising sign persists across a broad uncertainty window
- no planet or point sits near a cusp or angle
- the evidence family is mostly generic personality description
- event dates are vague and cannot be anchored to a narrow window

## Evidence-Rich Subsets
The best cases for a research benchmark are people with:
- several dated life events across different domains
- documented career turns, relocations, marriages, separations, surgeries, or crises
- written biography plus third-party verification
- at least one source of non-event evidence that can be independently checked

## Evidence-Poor Subsets
Expect poor identifiability when:
- the user has few major life events
- the user is unsure of dates or only knows seasons
- the source time is rounded to the hour or half hour
- the chart is being asked to resolve purely from personality descriptions

## Practical Triage Order
1. Start with exact or near-exact source quality.
2. Check whether the chart changes materially inside 2 to 15 minute bins.
3. Ask for high-salience events only if the geometry looks promising.
4. Use adaptive interview only after coarse narrowing has already happened.

## Open Gaps
- Whether any subset consistently supports exact-minute resolution from a 24-hour start.
- Whether broad life-structure signals outperform event timing on any subset.
- Whether some traditions produce cleaner subset definitions than others.

## Recommended Next Experiment
Construct a triage classifier that labels charts as `high`, `medium`, or `low` separability before any question asking begins. The classifier should use source quality, event richness, and local geometry, then be checked against eventual posterior contraction.

## Deliverables
- This memo should feed the go/no-go criteria.
- Its inclusion criteria should determine the initial benchmark subset.
- Its exclusion criteria should trigger abstention or coarse interval output.
