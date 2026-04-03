# Primary Directions Review

Reviewed brief:
- `primary-directions.md`

## Coherence

- The brief is internally coherent and correctly treats primary directions as an isolated research track rather than a phase-1 engine feature.
- The separation between current-engine-compatible methods and primary directions is clear.
- The recommendation to place primary directions under `rectification/research/primary-directions/` is consistent with the rest of the integration plan.

## Approach

- The brief correctly identifies the real problem: the current engine lacks the directional geometry layer that primary directions require.
- The option set is well framed:
  - sidecar engine
  - native zodiacal-only research implementation
  - full native zodiacal plus mundane engine
- The recommendation to start with sidecar or zodiacal-only research mode is technically sound.

## Mathematical Accuracy

- The brief correctly identifies the core variables:
  - RA
  - declination
  - RAMC
  - ascensional difference
  - semi-arcs
  - meridian distance
  - oblique ascension
- The distinction between zodiacal and mundane directions is correctly preserved.
- The description of time keys is directionally accurate and sufficient for system design.

Main cautions:
- The exact pole choice and OA formulation differ across schools. That should stay an explicit method parameter, not a hidden constant.
- Topocentric / Polich-Page practice should not be conflated with a generic zodiacal primary-direction implementation.
- Circumpolar handling will need real test vectors before any production use.

## Recommended Adjustments

- If primary directions move beyond research mode, freeze one canonical method bundle first:
  - zodiacal or mundane
  - direct or converse handling
  - time key
  - promissor / significator set
- Benchmark against Stellium and at least one second oracle before trusting any arc-to-date output.
- Do not let primary directions enter the main posterior until the simpler methods are already benchmarked and calibrated.

## Bottom Line

- The primary-directions brief is coherent and appropriately cautious.
- The mathematical framing is good enough to guide implementation planning.
- The recommendation to keep it out of the phase-1 rectification engine is correct.
