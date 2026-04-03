# Timing Workflow

Use this workflow when the question is predictive: when does a topic activate, which life chapter is in force, or what is the shape of the current year?

## Timing Sequence

```text
natal promise
  -> major period or chapter
    -> annual activation
      -> yearly overlay
        -> triggers
```

## Reading Order

1. Confirm the natal topic and the relevant planets.
2. Identify the broad chapter with traditional timing methods when birth time allows.
3. Narrow to the year with profections and solar return.
4. Use transits as triggers.
5. Add progressions when they clarify developmental or psychological change.

## Core Techniques

| Technique | Role | Status |
|---|---|---|
| Transits | trigger layer | implemented |
| Solar returns | annual overlay | implemented |
| Progressions | developmental timing | implemented |
| Zodiacal releasing | chapter structure | implemented, still partial |
| Annual profections | yearly activation | derivable |
| Firdaria | supporting chapter layer | planned |

## Professional Guardrails

- Do not read transits without first identifying the activated planet or topic.
- Do not use exact time-lord methods with weak birth time.
- Do not speak as if multiple converging methods eliminate uncertainty.
- Do not force every chart through every timing method.

## CLI Support

```bash
node astro.mjs transits '{"natalLongitudes":{"Sun":185.22},"start":"2026-01-01","end":"2026-12-31"}'
node astro.mjs solar-return '{"year":2026,"lat":35.68,"lon":139.69}'
node astro.mjs progressions '{"birthDate":"2002-09-28T12:45:00Z","startAge":20,"endAge":30}'
node astro.mjs zodiacal-releasing
```

## Cross-Links

- [Synthesis rules](../principles/synthesis-rules.md)
- [Transits](../techniques/timing/transits.md)
- [Progressions](../techniques/timing/progressions.md)
- [Solar returns](../techniques/timing/solar-returns.md)
- [Zodiacal releasing](../techniques/timing/zodiacal-releasing.md)
- [Profections](../techniques/timing/profections.md)
- [Firdaria](../techniques/timing/firdaria.md)
