# Relocation Workflow

Use this workflow when the question is place-based: where to live, work, date, retreat, launch, or recover.

## Reading Sequence

```text
natal condition of the planet
  -> angular line emphasis
    -> relocated houses and angles
      -> current timing activation
        -> advanced locational refinements
```

## Core Questions

- Which planets become angular here?
- Are those planets helpful, difficult, or mixed in the natal chart?
- Which houses become activated in the relocated chart?
- Is the current timing reinforcing this place, or working against it?

## Core Techniques

| Technique | Role | Status |
|---|---|---|
| ACG lines | first-pass map | implemented |
| City scoring | ranking layer | implemented |
| Relocated charts | structural deep dive | derivable with current tools |
| Cyclocartography | time-sensitive location activation | derivable |
| Parans | advanced locational refinement | planned |
| Local space | local directional refinement | planned |

## Professional Guardrails

- Never read a line without checking natal condition.
- Never rank cities by score alone.
- Never trust angle-heavy location work with weak birth time.
- Do not confuse ACG and relocated charts. They answer related but different questions.
- Treat AS and DS curve work carefully. It is not interchangeable with MC and IC longitude comparisons.

## CLI Support

```bash
node astro.mjs lines
node astro.mjs score-cities '{"category":"Vocation & Career"}'
node astro.mjs score '{"lat":48.86,"lon":2.35}'
node astro.mjs houses '{"lat":41.39,"lon":2.17}'
```

## Cross-Links

- [Astrocartography lines](../techniques/location/astrocartography-lines.md)
- [Relocated charts](../techniques/location/relocated-charts.md)
- [Cyclocartography](../techniques/location/cyclocartography.md)
- [Parans](../techniques/location/parans.md)
- [Local space](../techniques/location/local-space.md)
