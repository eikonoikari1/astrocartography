# Annual And Chapter Review

Reviewed briefs:
- `annual-profections.md`
- `solar-returns.md`
- `zodiacal-releasing.md`

## Coherence

- These three briefs align well as the annual and chapter layer above the fast-timing stack.
- The role boundaries are clear:
  - profections for yearly activation
  - solar returns for annual overlay
  - zodiacal releasing for chapter structure and tie-breaking
- None of the briefs overclaims minute-level precision from coarse techniques, which is the correct architectural stance.

## Approach

- `annual-profections.md` is well scoped. It correctly insists on whole-sign houses and traditional rulers, which prevents doctrine drift.
- `solar-returns.md` is correctly conservative. It treats solar returns as annual confirmation rather than a fine rectifier.
- `zodiacal-releasing.md` is directionally strong and correctly identifies lot-boundary sensitivity as the only place where ZR becomes sharply discriminative in a narrow candidate window.

## Mathematical Accuracy

- `annual-profections.md`
  - The discrete cycle `P(n) = (A + n) mod 12` is correct for completed-age annual profections.
  - Birthday-to-birthday handling is correctly emphasized.
  - Main caution: keep whole-sign helper logic separate from quadrant-house code.

- `solar-returns.md`
  - The return-finding equation is correct.
  - The note that solar returns are weak minute discriminators is accurate and important.
  - The recommendation to tighten the search window around the birthday is sensible.
  - Main caution: use the exact natal Sun longitude convention consistently across natal and return calculations.

- `zodiacal-releasing.md`
  - Fortune and Spirit formulas are correctly stated.
  - The planetary-year table is correct.
  - The chapter-scale interpretation is properly bounded.
  - Main caution: the brief should keep the period-calendar convention explicit, because modern implementations differ on how schematic or astronomical the date rendering should be.

## Recommended Adjustments

- Add a single doctrine-config object for:
  - profection rulership
  - ZR lot selection
  - ZR timeline rendering convention
  - solar-return house system
- Keep these scorers upstream of minute-level fusion weights.
- Treat all three as pruning or confirmation layers unless the candidate window is already narrow.

## Bottom Line

- The annual and chapter briefs are coherent and mathematically usable.
- Annual profections are the cleanest coarse filter.
- Solar returns are useful yearly context, not a main rectifier.
- Zodiacal releasing should stay optional and become influential only near lot-boundary-sensitive windows.
