# Natal Workflow

Use this workflow when the primary question is descriptive: life pattern, temperament, strengths, vulnerabilities, relationship style, vocation, or core themes.

## Reading Order

1. Establish chart context: sect, Ascendant, chart ruler, luminaries.
2. Rank the most influential planets before reading details.
3. Read sign, house, rulership, and aspect condition in that order.
4. Add specialized layers only when they answer the same question more clearly.

## Core Questions

- Which planets dominate the life narrative?
- Which houses receive the most pressure or support?
- Which life topics repeat through rulership chains?
- Where is there ease, and where is there chronic friction?

## Use These Techniques

| Layer | Role | Current support |
|---|---|---|
| Natal chart + houses | Baseline map | implemented |
| Planet condition / natal-strength | Ranking and weighting | implemented |
| Lots | Optional refinement | derivable / planned expansion |
| Fixed stars | Optional specialized refinement | planned |

## Do Not Start With

- transits
- relocation lines
- horary
- exotic techniques added only to make the reading feel deeper

## Input Quality

Natal work tolerates imperfect birth time better than timing or location work, but house-based judgments still degrade when the time is loose.

## CLI Support

```bash
node astro.mjs chart
node astro.mjs natal-strength
node astro.mjs houses '{"lat":56.01,"lon":92.867}'
```

## Cross-Links

- [Technique selection](../principles/technique-selection.md)
- [Synthesis rules](../principles/synthesis-rules.md)
- [Lots](../techniques/foundations/lots.md)
- [Fixed stars](../techniques/foundations/fixed-stars.md)
