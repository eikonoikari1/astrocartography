# Baseline And Controls Research

## What The Baseline Must Prove

The baseline is not a throwaway comparator. It has to answer a simple question:

can biography and public evidence, without any chart-derived features, recover enough of the time signal to challenge the rectification system?

If the answer is yes, then the astrology-specific system has to beat a serious non-astrological competitor. If not, the project risks confusing biography richness with timing intelligence.

## Corpus Sources Worth Using

| Source | What it gives | Bias profile | Best use |
|---|---|---|---|
| Wikidata | structured facts, dates, places, occupations, relations | broad but uneven coverage; relies on contributor quality | structured features, metadata, candidate filtering |
| Wikipedia / MediaWiki dumps / REST API | biography text, infoboxes, page history | systemic coverage bias by gender, geography, language, and notability | text baseline, event extraction, life-period extraction |
| Pantheon | curated globally famous biographies with manual verification and occupation taxonomy | strongly selection-biased toward globally prominent, multilingual figures | benchmark slice, fame-rich cohort, holdout tests |
| WikiBio / Wikipedia biography datasets | infobox + first paragraph at scale | inherits Wikipedia selection and editorial bias | large-scale text baseline and extraction tests |
| Chronicling America / loc.gov newspaper APIs | contemporaneous event verification and dated mentions | historically American and newspaper-centric | event anchoring, date verification, life-period support |

Source access and licensing matter:
- Wikidata structured data is CC0.
- Wikimedia dumps are broadly CC BY-SA / GFDL for text, with exceptions by namespace.
- Chronicle-style newspaper APIs are publicly accessible but not representative of all countries or eras.
- Pantheon is useful and openly available as a site/data resource, but it is a curated elite-biography slice, not a neutral population sample.

## Why Historical Figures Are Misleading

Historical figures are excellent for evaluation and very bad as a naive proxy for the population.

They are overrepresented in:
- major public events
- precise dates
- editorial documentation
- multilingual coverage
- repeated biographies
- archive traces

That makes them easier to model than ordinary users. A system can look strong simply because the corpus is rich, not because the timing logic is sharp.

This is exactly the kind of trap exposed by biography-based ML work. In the Bias in Bios study, biographies retained predictive signal even after explicit gender indicators were scrubbed, showing that proxies survive cleanup. That means biography-only baselines can be surprisingly strong and must be treated seriously, not as a weak strawman. See [Bias in Bios](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/bios_bias.pdf) and [What's in a Name?](https://aclanthology.org/N19-1424.pdf).

Wikipedia itself is not a neutral corpus. Gender and notability bias are persistent, and biographies are unevenly distributed across gender, geography, and language. That matters because a baseline can learn corpus structure, not just life structure. Relevant background includes [First Women, Second Sex: Gender Bias in Wikipedia](https://arxiv.org/abs/1502.02341), [Women through the glass ceiling](https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-016-0066-4), and Wikipedia's broader systemic-bias literature.

Pantheon helps because it gives a manually verified elite-biography slice with manual demographic and occupation taxonomy, but it is also heavily selected. Pantheon 1.0 is restricted to biographies present in more than 25 language editions and is explicitly a globally famous cohort; the current site says Pantheon has data on more than 85,000 biographies present in at least 15 languages. That makes it strong for a benchmark slice and weak for population representativeness. See [Pantheon 1.0](https://www.nature.com/articles/sdata201575) and [Pantheon site](https://pantheon.world/).

## Strongest Baseline Design

The strongest baseline should be a hybrid biography model, not a toy heuristic.

### Baseline 1: Structured Biography Only
Use structured non-astrological features only:
- occupation and profession history
- marriage and family status
- relocation patterns
- major awards or appointments
- public office or institutional role changes
- birth/death dates where relevant to life-stage calculations
- event counts and event timing bins

This baseline answers whether ordinary life-structure already contains enough time signal.

### Baseline 2: Text Only
Use biography text, page summaries, and event descriptions without any chart-derived features.

This baseline tests whether free-form life narrative can infer the candidate time distribution on its own.

### Baseline 3: Hybrid Biography Baseline
Combine structured features and text. This is the baseline that should be hardest to beat.

If the rectification model does not beat this model, the astrology-specific lift is not established.

### Baseline 4: Minimal Heuristic Baseline
Use simple rules:
- career-heavy vs relationship-heavy
- mobile vs rooted
- crisis-prone vs stable
- public vs private

This is not the main baseline, but it is useful as a sanity check and for debugging leakage.

## What The Baseline Must Not Use

The baseline should not use:
- chart features
- angles
- houses
- timing triggers
- rectification labels
- source-grade labels if they leak birth-time quality directly
- any field that encodes the answer by construction

## Fair Comparison Rules

To make the baseline meaningful:
- use the same raw evidence budget as the rectification system
- keep person-level splits
- match candidate-bin resolution
- use the same calibration method and abstention rule
- report the same metrics
- compare on both strict gold and broader challenge slices

## Controls That Must Be Included

### Shuffle Controls
- shuffle birth times across people
- shuffle event assignments
- shuffle biography-text/person associations

### Placebo Controls
- placebo chart features
- placebo question families
- random question ordering

### Leakage Controls
- hold out collectors or source families
- hold out public figures
- redact or paraphrase biographies
- fuzz event dates
- swap source-grade labels where appropriate to detect dependence on label quality proxies

### Selection Controls
- report selected-set and full-population results separately
- freeze triage before test evaluation
- do not use triage acceptance rate as prevalence

## Metrics To Report For Every Baseline

- top-1 time error
- median absolute error
- `% within ±2 min`
- `% within ±5 min`
- `% within ±10 min`
- posterior entropy reduction
- interval width
- calibration error
- abstention behavior
- selected-set performance
- full-population performance

## What Would Count As A Real Baseline Failure

The rectification system fails to beat the baseline if:
- biography-only equals or exceeds timing-based performance on strict gold
- gains disappear under public-figure or collector holdouts
- performance depends mainly on source richness instead of timing structure
- the timing model is only better after the triage has already selected easy cases

If that happens, the system is not yet timing-based in a meaningful sense.

## Research Conclusion

The baseline should be a strong biography model with strict controls, not a weak sanity check.

The minimum honest benchmark is:
- structured biography baseline
- text biography baseline
- hybrid biography baseline
- shuffled and placebo controls
- selection-aware reporting

That is the only way to know whether timing techniques add value beyond life-story regularities.

## Sources

- [Wikidata Licensing](https://www.wikidata.org/wiki/Wikidata%3ALicensing)
- [Wikimedia dump licensing](https://dumps.wikimedia.org/legal.html)
- [MediaWiki REST API](https://www.mediawiki.org/wiki/API%3AREST_API)
- [Chronicling America API](https://www.loc.gov/apis/additional-apis/chronicling-america-api/)
- [Pantheon 1.0](https://www.nature.com/articles/sdata201575)
- [Pantheon site](https://pantheon.world/)
- [WikiBio dataset](https://github.com/DavidGrangier/wikipedia-biography-dataset)
- [Bias in Bios](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/bios_bias.pdf)
- [What's in a Name?](https://aclanthology.org/N19-1424.pdf)
- [First Women, Second Sex: Gender Bias in Wikipedia](https://arxiv.org/abs/1502.02341)
- [Women through the glass ceiling](https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-016-0066-4)
