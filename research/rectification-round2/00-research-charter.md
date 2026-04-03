# Rectification Research Round 2 Charter

## Purpose
This round exists to answer the highest-value questions blocking a credible birth-time rectification system. The target claim is narrow and demanding: determine whether a calibrated system can shrink an unknown 24-hour birth-time range toward a defensible `±2 min` interval for some meaningful subset of cases.

## Scope
- Evaluate feasibility, not belief.
- Compare evidence families without privileging one in advance.
- Focus on questions that can change architecture, evidence weighting, benchmark design, or the feasibility target.
- Treat event timing as one evidence family among several.
- Treat adaptive QA as a serious candidate component, not an assumed solution.

## Non-Goals
- General astrology research without rectification relevance.
- Product UX design beyond what is needed to evaluate the interview format.
- Implementing the model stack before the evidence and benchmark story are good enough.
- Treating persuasive narrative quality as evidence of system quality.

## Core Research Principles
1. The best method is the one that works best under evaluation.
2. Every positive hypothesis needs a negative control.
3. Every evidence family needs a failure-mode analysis.
4. Claimed precision and measured precision are different variables.
5. A narrower answer is not better unless calibration improves too.
6. The system must be allowed to abstain and return a wider interval.

## Primary Decision Questions
1. Is `±2 min` identifiable often enough to justify the target?
2. Which evidence families actually split nearby candidate times?
3. Which interview formats add information rather than confidence theater?
4. How noisy are the available birth-time labels?
5. Which model and benchmark designs are strict enough to prevent self-deception?

## Required Deliverables
- A ranked hypothesis board.
- A ranked open-questions registry.
- Source-anchored memos for each workstream.
- A benchmark and falsification plan.
- A go/no-go memo for moving into implementation.

## Kill Criteria
- If nearby candidate times are rarely distinguishable even in theory, the target must be reframed.
- If label quality is too poor for exact-minute training, the project must shift to interval targets or fresh data collection.
- If adaptive QA does not outperform static or random questioning on posterior contraction, it should not drive the system.
- If astrology-informed models do not beat strong non-astrological baselines, the modeling story needs revision before implementation.

## Working Rule For This Round
Only pursue a question if its answer could change what we build, what evidence we trust, or how we would prove the system works.
