# Deep Research Wave 1 Synthesis

## What This Wave Clarified

The renewed approach now has a much sharper empirical starting point.

The most important finding is that the corpus must be split into two very different layers:
- open and reusable biography/event sources
- provenance-rich birth-time label sources

Those layers cannot be treated as interchangeable.

## Stable Conclusions

### 1. Open sources are strong for evidence, weak for exact-time truth
Wikidata, Wikipedia, Pantheon, CBDB, and public archives can support:
- cohort seeding
- event extraction
- life-period extraction
- metadata and bias analysis

They cannot generally support minute-level truth labels.

For exact-time provenance, the project still depends on a much narrower class of sources with auditable source notes. That means the first benchmark will be smaller and more rights-constrained than the full evidence corpus.

### 2. The first experiment should be falsification-first
The timing experiment should start with:
- full-day unknown-time setup
- 10-minute sweep across the whole day
- refinement to 2-minute bins only in the top regions
- 30-second bins only as a stress test

That is the right design because it exposes weak separability quickly.

### 3. The first technique pack should stay small
The current best starting pack is:
- transits
- solar arcs
- secondary progressions
- annual profections

Solar returns are conditional.
Primary directions, zodiacal releasing, and firdaria are deferred until the core pack shows real lift.

### 4. Event extraction should stay anchored and conservative
The first extraction targets should be:
- birth and death
- marriage and divorce
- education
- appointments and office changes
- awards
- publications
- relocations
- major legal or health transitions

Life periods should be stored as intervals, not turned into fake exact points.

### 5. The baseline has to be hard to beat
The correct comparator is a hybrid biography baseline that uses the same raw evidence budget as the rectification system but no chart-derived features.

If the timing-based system does not beat that baseline on strict gold, the project does not yet have evidence of astrology-specific value.

### 6. Historical figures are useful and dangerous
They are useful because they create a rich benchmark environment.
They are dangerous because they are heavily selected, biography-rich, and easier than real users.

So historical figures should remain a benchmark slice, not a proxy for deployment reliability.

## What This Means For The Next Step

The next practical move is no longer broad research.
It is a first executable benchmark package with:
- source inventory
- audited label slice
- event extraction pilot
- one small technique pack
- one strong biography baseline
- one control bundle

## Immediate Build Order

1. Finalize the source and licensing manifest.
2. Freeze the first audited known-time cohort.
3. Build the event and life-period extraction pilot.
4. Implement the 10-minute full-day sweep for the small technique pack.
5. Implement the hybrid biography baseline.
6. Run shuffled and fuzzed controls before adding more techniques.

## What Should Not Happen Next

- do not add multimodal inputs
- do not expand doctrine coverage
- do not build the full interview path first
- do not claim open-source labels are enough for minute-level truth
- do not optimize architecture before the first timing behavior report exists

## Bottom Line

This wave made the renewed approach more realistic.

The project now has a concrete empirical spine:
- open-source evidence corpus
- narrow provenance-rich label slice
- falsification-first timing experiment
- strong biography baseline
- historical figures treated as a benchmark slice only

That is strong enough to move into the first real benchmark implementation.
