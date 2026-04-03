# Research System

This folder is the canonical research and methodology layer for the app.
Read it in order when you need progressive disclosure:

```text
research/README
  -> principles/          doctrine, selection, synthesis guardrails
  -> workflows/           how a professional reading is structured
  -> techniques/README    index of individual techniques
  -> techniques/*         leaf pages for focused study and implementation
```

## Start Here

If you are trying to answer a client question, begin with one of these:

| Question | Start with |
|---|---|
| "What is the natal promise?" | [workflows/natal.md](./workflows/natal.md) |
| "When is this topic active?" | [workflows/timing.md](./workflows/timing.md) |
| "Where is this best lived?" | [workflows/relocation.md](./workflows/relocation.md) |
| "Which technique belongs to which school?" | [principles/doctrine-map.md](./principles/doctrine-map.md) |
| "Which technique should I use at all?" | [principles/technique-selection.md](./principles/technique-selection.md) |
| "How do I synthesize multiple techniques?" | [principles/synthesis-rules.md](./principles/synthesis-rules.md) |

## How This Research Is Organized

The structure separates four different concerns that were mixed together before:

| Concern | Where it lives |
|---|---|
| Professional method and boundaries | `principles/` |
| End-to-end reading sequence | `workflows/` |
| Technique-specific guidance | `techniques/` |
| Legacy notebook-style research | `archive/` |

## Read by Question

### Natal analysis
- Start with [workflows/natal.md](./workflows/natal.md)
- Then use [techniques/foundations/lots.md](./techniques/foundations/lots.md) and [techniques/foundations/fixed-stars.md](./techniques/foundations/fixed-stars.md) only when the chart and question justify it

### Predictive timing
- Start with [workflows/timing.md](./workflows/timing.md)
- Core techniques live under [techniques/timing/](./techniques/timing/README.md)

### Relocation and astrocartography
- Start with [workflows/relocation.md](./workflows/relocation.md)
- Core location techniques live under [techniques/location/](./techniques/location/README.md)

### Specialized or separate disciplines
- Read [techniques/specialized/horary.md](./techniques/specialized/horary.md) before using horary at all

## Read by Doctrine

| Doctrine lane | Primary pages |
|---|---|
| Modern / hybrid natal interpretation | [workflows/natal.md](./workflows/natal.md), [techniques/timing/transits.md](./techniques/timing/transits.md), [techniques/timing/progressions.md](./techniques/timing/progressions.md), [techniques/timing/solar-returns.md](./techniques/timing/solar-returns.md) |
| Traditional / Hellenistic timing | [techniques/timing/profections.md](./techniques/timing/profections.md), [techniques/timing/zodiacal-releasing.md](./techniques/timing/zodiacal-releasing.md), [techniques/timing/firdaria.md](./techniques/timing/firdaria.md), [techniques/foundations/lots.md](./techniques/foundations/lots.md) |
| Relocation and locational astrology | [techniques/location/astrocartography-lines.md](./techniques/location/astrocartography-lines.md), [techniques/location/relocated-charts.md](./techniques/location/relocated-charts.md), [techniques/location/cyclocartography.md](./techniques/location/cyclocartography.md), [techniques/location/parans.md](./techniques/location/parans.md), [techniques/location/local-space.md](./techniques/location/local-space.md) |
| Separate divinatory discipline | [techniques/specialized/horary.md](./techniques/specialized/horary.md) |

## Read by Implementation Status

The research distinguishes astrology from engineering.

| Status | Meaning |
|---|---|
| Implemented | A dedicated CLI command or code module exists |
| Derivable | The current CLI can support the technique with manual synthesis |
| Planned | The technique is astrologically relevant but still needs code |
| Specialized | Useful in practice, but should not be treated as a default layer |

See [techniques/README.md](./techniques/README.md) for the full matrix.

## Relationship to the Legacy Research Files

[RESEARCH_advanced_techniques.md](../RESEARCH_advanced_techniques.md) is now a transition index that points here.
[RESEARCH_interpretation_guide.md](../RESEARCH_interpretation_guide.md) remains a large-form reference and source notebook; this folder is the easier entrypoint for practice and product decisions.
