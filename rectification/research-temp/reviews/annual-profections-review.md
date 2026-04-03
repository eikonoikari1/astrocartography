# Verdict

The brief is directionally correct and fits the current engine as a coarse annual layer. The core profections arithmetic is sound, but the integration plan should be tightened around terminology and around how little minute-level information profections actually contribute.

# Mathematically Sound Points

- The sign-cycle formula `P(n) = (A + n) mod 12` is correct for completed-age profections when `A` is the natal Ascendant sign index.
- Using completed age and birthday-to-birthday year boundaries matches the engine’s existing timing workflow and avoids off-by-one ambiguity.
- Restricting the year lord to the seven traditional planetary rulers is the right default for a classical profection implementation.
- Keeping profections whole-sign and separate from `houses.js` is correct; profections are sign-based, while the current house engine is quadrant-based.
- Treating profections as candidate-chart features rather than a final rectified-minute calculation is mathematically appropriate.

# Issues Or Caveats

- The brief overstates how much rectification discrimination profections can provide. Within a given event, profection output is piecewise constant across all candidate times that share the same Ascendant sign, so it is inherently coarse.
- The text mixes `profectedHouse`, `profectedSign`, and year-lord topics in a way that can blur sign-based arithmetic with house-based interpretation. In whole-sign profections, the sign is primary and the house number is only a relative label.
- `ASC`-only profections are a defensible default, but the brief should say more explicitly that Sun-, Moon-, or Lot-based profections are separate doctrines, not just alternate inputs.
- The scoring language implies annual activation can meaningfully prune minute-level candidate grids by itself. In practice, it should only provide a coarse prior unless the candidate window is already close to a sign boundary.
- The brief assumes `completedAge` will be unambiguous everywhere. That should be made explicit in the API, because some astrology tooling uses inclusive year counting and some uses anniversary counting.

# Required Corrections

- Add an explicit API contract that accepts `completedAge` or an event date and computes profections from that, rather than relying on a vague age label.
- Return `profectedSignIndex` and `profectedHouseNumber` as separate fields, and keep `yearLordPlanet` distinct from both.
- State clearly that profections are piecewise constant over candidate bins and should be used as a coarse filter, not as a minute-level solver.
- Keep the default doctrine locked to whole-sign, ASC-based, traditional-ruler profections, and treat Sun/Moon/Lot variants as separate modes.
- In the rectification scorer, freeze the event-family mapping before evaluation so profection narratives cannot be adjusted after seeing the candidate posterior.

# Final Recommendation

Approve the brief with minor revisions. The math is correct, but the plan needs sharper terminology and a stronger warning that profections are a broad annual organizer, not a fine rectification signal. Keep it in the separate `rectification/features/profections.js` path and use it only as a pruning and weighting layer before transits, solar returns, progressions, and solar arcs.
