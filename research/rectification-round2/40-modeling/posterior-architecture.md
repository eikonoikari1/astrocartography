# Posterior Architecture

## Core Decision
Represent birth time as a discrete posterior over candidate times, then refine locally.

The main reason to prefer a discrete latent-time grid is that rectification is not a smooth regression problem. Small time shifts can flip angles, houses, lots, and timing triggers in discontinuous ways, so a binned posterior is easier to audit than a single point estimate. A continuous model can still be used internally, but the product-facing object should be an interval or a ranked set of candidate bins.

## Recommended Representation
- Start with a 24-hour grid at 2-minute bins for the full search space.
- Within the top mass, refine to 30-second or 1-minute bins only when the coarse posterior justifies it.
- Keep a calibrated probability for each bin plus a top-K list of alternatives.
- Report a highest-posterior-density interval, not only the single most likely minute.

## Why This Is Better Than A Single Score
- It preserves uncertainty instead of collapsing it into a misleading point estimate.
- It lets the system compare nearby candidate windows directly.
- It makes abstention and widening the interval a normal outcome.
- It supports coarse-to-fine search, which is important when the initial prior is the full day.

## Evidence Model
Use a factorized likelihood over evidence families:
- Event timing likelihood.
- Adaptive interview answers.
- Pairwise chart comparisons.
- Life-theme and biography signals.
- Optional multimodal signals such as appearance or voice.

Each family should contribute an explicit likelihood or score term, then the posterior is updated from the product of those terms with a prior over time bins. This keeps the system auditable and makes ablation straightforward.

## Recommended First-Pass Design
1. Build a deterministic feature engine that computes chart features for every candidate time.
2. Train one scoring head per evidence family.
3. Fuse the heads into a shared posterior over time bins.
4. Calibrate the posterior on held-out known-time charts.
5. Only then add more expressive models such as sequence encoders or multimodal fusion.

## Model Variants To Compare
- Pure discrete ranking over bins.
- Factor graph with separate evidence terms.
- Hierarchical model with a broad prior and local refinement.
- Mixture-of-experts by tradition or technique family.
- Neural ranker with calibration layer on top.

## Design Constraints
- Time-zone and DST handling must be deterministic, not learned.
- Chart math must be separate from the LLM layer.
- The model must support abstention and interval output natively.
- Every score should be traceable back to a specific evidence source.

## Sources
- [Settles, Active Learning Literature Survey](https://burrsettles.com/pub/settles.activelearning.pdf)
- [Chaloner & Verdinelli, Bayesian Experimental Design: A Review](https://people.eecs.berkeley.edu/~jordan/courses/260-spring10/readings/chaloner-verdinelli.pdf)
- [Houlsby et al., Bayesian Active Learning for Classification and Preference Learning](https://mlg.eng.cam.ac.uk/pub/pdf/HouHusGha11a.pdf)

