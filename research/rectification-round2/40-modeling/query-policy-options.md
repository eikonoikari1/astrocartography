# Query Policy Options

## Goal
Choose each next question so it reduces posterior uncertainty as much as possible per unit of user effort.

## Candidate Policies

### 1. Static Questionnaire
Ask the same fixed sequence for every user.
- Strength: simple to implement.
- Weakness: wastes questions when the posterior already made the answer obvious.

### 2. Uncertainty Sampling
Ask the question whose answer the model is most uncertain about.
- Strength: easy baseline.
- Weakness: uncertainty alone can pick questions that do not split the candidate posterior well.

### 3. Expected Information Gain
Choose the question with the highest expected posterior entropy reduction.
- Strength: principled.
- Weakness: expensive unless approximated.

### 4. BALD / Bayesian Active Learning
Choose the question that maximizes disagreement over the latent posterior.
- Strength: well aligned with uncertainty-driven acquisition.
- Weakness: can still over-focus on epistemic uncertainty that is not decision-relevant.

### 5. Pairwise Candidate Comparison
Ask the user to compare two nearby chart hypotheses or two nearby life-theme interpretations.
- Strength: often easier than absolute rating.
- Weakness: requires a good candidate generator and careful wording.

### 6. Cost-Aware Hybrid Policy
Mix broad discriminators early, then pairwise contrasts inside the top cluster.
- Strength: best practical balance.
- Weakness: more complex to implement.

## Recommended Policy
Use a hybrid policy:
- Early stage: ask high-yield, broad-splitting questions that distinguish large chart families.
- Mid stage: switch to pairwise comparisons among top candidate clusters.
- Late stage: ask only the narrowest questions that separate the remaining top bins.
- Stop when the expected gain is below the cost of another question.

## Question Families Worth Prioritizing
- Relationship structure and attachment pattern.
- Career/public-role shape.
- Mobility, relocation, and change intensity.
- Crisis cadence and pressure points.
- Family burden and caregiving role.
- Presentation or body cues only after the posterior is already narrow.

## Why This Needs To Be Adaptive
Active learning works because not all questions are equally informative. The literature on active learning and Bayesian experimental design treats query choice as a decision problem, not a fixed script. That is the right framing for rectification as well.

## Sources
- [Settles, Active Learning Literature Survey](https://burrsettles.com/pub/settles.activelearning.pdf)
- [Chaloner & Verdinelli, Bayesian Experimental Design: A Review](https://people.eecs.berkeley.edu/~jordan/courses/260-spring10/readings/chaloner-verdinelli.pdf)
- [Houlsby et al., Bayesian Active Learning for Classification and Preference Learning](https://mlg.eng.cam.ac.uk/pub/pdf/HouHusGha11a.pdf)
- [Ailon et al., Active Learning for Ranking from Pairwise Preferences](https://www.jmlr.org/papers/v13/ailon12a.html)
- [Asking Useful Questions: Active Learning with Rich Queries](https://escholarship.org/uc/item/7404618f)

