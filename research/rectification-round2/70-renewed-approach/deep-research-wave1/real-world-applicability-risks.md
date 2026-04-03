# Real-World Applicability Risks

## Core Question

What would actually justify moving from historical-figure benchmarking toward a product that can help ordinary users?

The answer is stricter than a good demo on famous people.

## Why Historical Figures Do Not Transfer Cleanly

Historical figures and public biographies create an optimistic data regime:
- more dated events
- more public milestones
- cleaner written trails
- better archive coverage
- more precise provenance in some cases
- more editorial repetition

Ordinary users have far less of this. They usually have:
- fewer publicly anchored events
- less formal documentation
- more uncertain birth records
- fewer externally visible life periods
- more ambiguous or mixed self-report

That means a model that works on public figures may fail on ordinary people even if it looks strong in benchmark tests.

## Main Transfer Risks

### 1. Public-Figure Bias
The benchmark can overestimate performance because famous people are unusually documented and unusually timeable.

Pantheon is a clear example: it is built from biographies present in many Wikipedia language editions, which makes it valuable but strongly selected. Wikipedia itself also has well-known systemic bias in who gets a page and how biographies are written. That selection pressure is a real risk for transfer.

### 2. Selection Effects
The system may look accurate only after triage or only on cases with rich evidence.

If the benchmark score is driven by selected easy cases, it does not tell us how the system behaves on the harder cases ordinary users will present.

### 3. Biography Leakage
The model may learn the life story rather than the birth time.

This is especially dangerous because biography text, event lists, and profession histories are themselves predictive of many demographic and social variables. Bias in Bios showed that even after scrubbing explicit gender indicators, biographies still contained enough proxy signal to infer gender and occupation-related structure. That is a direct warning for rectification.

### 4. Source-Quality Leakage
Exact-looking time labels may encode source quality, not true exactness.

If the model learns that well-documented cases are more likely to be in the gold set, it may become a provenance detector instead of a rectifier.

### 5. Cultural And Geographic Transfer
Public corpora skew toward high-income countries, major languages, and globally visible professions.

If the system is trained mainly on those cases, it may underperform for:
- lower-documentation users
- non-English biographies
- non-Western naming and date conventions
- weaker archival environments

### 6. User Interaction Risk
Ordinary users often provide ambiguous or emotionally loaded answers.

If the system depends on interview quality, it will degrade when people are unsure, inconsistent, or trying to fit themselves into the model.

## What Would Actually Justify Productization

The bar should be high enough to survive real-world noise.

### Minimum Evidence For A Product Claim
- the rectification system beats the strongest biography-only baseline on strict gold
- performance holds under public-figure holdout and collector/source-family holdout
- intervals are calibrated, not just narrow
- abstention works when evidence is weak
- results remain meaningful on sparse-biography or reduced-evidence slices
- the system still helps after date fuzzing and provenance stratification

If any of those fail, the system is not ready for ordinary users.

### Better-Than-Research Product Claim
Even stronger would be:
- a validated high-separability subset for minute-level work
- a second, broader mode for coarse interval narrowing
- explicit confidence and abstention controls
- documented failure modes by source quality and evidence richness

That would justify a limited expert-tool product, not a universal consumer claim.

## What Productization Should Not Mean

It should not mean:
- always returning an exact minute
- treating every user like a historical figure
- using multimodal proxies because they are convenient
- relying on a single selected benchmark slice
- presenting high confidence when the evidence is thin

## Real-World Deployment Risks

### False Precision
Users will overinterpret a narrow interval.

That is why calibrated intervals and abstention are required. Narrow output without calibration is a liability.

### Confirmation Bias
Once users hear a chart story, they can adapt their self-report to fit it.

That means interactive systems can become self-fulfilling unless they are structured around contradiction and uncertainty.

### Ethical And Reputational Risk
If the system overclaims on public figures, the same failure mode will hit ordinary users harder.

This is a product-risk issue, not just a research issue.

### Dataset Shift
The benchmark corpus will never perfectly match real users.

Historical figures are an upper-bound environment. Ordinary users are the real deployment environment. The system has to survive the gap.

## Best Real-World Test Before Productization

The most useful intermediate test is not broad consumer launch.
It is a sparse-evidence simulation:
- remove rich event data from public figures
- downsample to more ordinary-user-like evidence
- measure how much the system degrades

If performance collapses under that stress test, the product should remain a research tool only.

## Recommended Deployment Path

1. Benchmark on historical and public figures with known times.
2. Benchmark on sparse-biography slices from the same corpus.
3. Benchmark on selected holdouts with reduced event density.
4. Only then test a limited opt-in pilot on ordinary users.

That sequence reduces the risk of mistaking elite-biography signal for real-world utility.

## Bottom Line

Historical-figure benchmarking can justify further research.
It cannot justify productization by itself.

Productization becomes defensible only when the system:
- beats strong biography baselines
- survives selection and leakage controls
- remains calibrated on sparse cases
- degrades gracefully on ordinary-user-like evidence

Until then, the right claim is research value, not consumer reliability.

## Sources

- [Pantheon 1.0](https://www.nature.com/articles/sdata201575)
- [Pantheon site](https://pantheon.world/)
- [First Women, Second Sex: Gender Bias in Wikipedia](https://arxiv.org/abs/1502.02341)
- [Women through the glass ceiling](https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-016-0066-4)
- [Bias in Bios](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/bios_bias.pdf)
- [What's in a Name?](https://aclanthology.org/N19-1424.pdf)
- [Wikidata Licensing](https://www.wikidata.org/wiki/Wikidata%3ALicensing)
- [Wikimedia dump licensing](https://dumps.wikimedia.org/legal.html)
- [Chronicling America API](https://www.loc.gov/apis/additional-apis/chronicling-america-api/)
