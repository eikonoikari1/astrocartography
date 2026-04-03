# Proxy Leakage Risks

## Question
How can multimodal signals leak the answer or create a shortcut that looks predictive but is not actually rectification signal?

## Why This Matters
If the model learns identity, demographics, social class, or biography structure instead of birth-time structure, the benchmark will reward the wrong thing.

## Main Leakage Paths

### 1. Demographic Proxy Leakage
Appearance, voice, and text style all carry signals for age, gender, accent, dialect, region, and sometimes socio-economic status. Those attributes are correlated with life trajectory and self-presentation, so a model can improve by inferring demographic profile rather than chart timing.

### 2. Biography Reconstruction Leakage
Public biographies often contain the target indirectly. If the model sees a rich biography, it may learn the life story itself instead of the timing logic that should map that life story back to a birth time.

### 3. Selection Bias Leakage
Public figures and well-documented people have richer multimodal traces and cleaner timelines. A model trained or evaluated on them may look stronger than it really is because the dataset is not representative.

### 4. Platform And Context Leakage
Text style depends on platform norms, topic, audience, and genre. Voice depends on recording context, question prompt, and speaking task. Appearance depends on camera angle, styling, lighting, and age. These are all confounded with the modality itself.

### 5. Stereotype Amplification
Appearance-based and voice-based judgments can become self-fulfilling. A model can learn what humans expect to see, not what is actually there, and still appear to perform well on human-labeled data.

## What The Evidence Suggests

- Facial trait inferences can look accurate, but confidence does not reliably track accuracy, and self-fulfilling effects may explain part of the apparent signal.
- Machine-learned facial bias does not necessarily generalize as real-world predictive signal.
- Written language does carry personality-related information, but the effect sizes are modest and the same language also encodes age and gender.
- Voice contains both acoustic and linguistic cues, plus accent and socio-economic information, which makes it a strong proxy channel as well as a potential signal channel.
- Recent speech-based personality models still warn about low discriminant validity and unresolved criterion validity.
- Personality-computing research explicitly flags privacy, algorithmic bias, and manipulation as core threats.

## Controls That Should Be Mandatory

1. Strict ablations by modality.
2. Person-level splits with no repeated identity across train and test.
3. Biography-only, text-only, voice-only, and appearance-only baselines.
4. Demographic fairness slices by age, gender, region, and accent when available.
5. Leakage tests that remove direct biography clues and check whether performance collapses.
6. Counterfactual tests that perturb style, accent, or image presentation while holding content constant.

## Practical Rules

1. Do not let a modality enter the main posterior unless it beats a simpler non-multimodal baseline on held-out gold cases.
2. Do not use the same source both as evidence and as a label generator without marking that dependency.
3. Do not mix public biography into a gold evaluation set unless the benchmark is explicitly testing event-extraction rather than rectification.
4. Do not treat a strong result on rich public figures as evidence that the modality generalizes.
5. Do not assume that more channels means more birth-time signal.

## Recommended Handling By Modality

### Appearance / image
Treat as high-risk, low-confidence corroboration. Use only with explicit consent and only if it survives a strict ablation against stereotype and demographic leakage.

### Voice
Treat as high-risk because it carries accent and context. If used, separate acoustic features from linguistic content and test each alone.

### Public biography
Treat as a structured event source, not as a predictive channel. Its main job is timeline construction.

### Text style
Treat as the most leakage-prone channel. It can be informative, but it is also the easiest place for the model to learn age, gender, topic, platform, and identity.

## Benchmark Requirement

Any multimodal experiment should report:
- incremental lift over biography-only and event-only baselines
- calibration before and after adding the modality
- whether the modality improves the strict gold set or only the easier challenge set
- whether the modality survives a removal or perturbation test

If a modality only helps on the easier challenge set, it is probably a shortcut rather than a rectification signal.

## Recommendation

Multimodal signals should be treated as optional research branches, not as core system inputs.

The only low-risk exception is structured public biography used for event extraction. Everything else needs hard ablations and a default assumption of leakage until proven otherwise.

## Source Anchors

- [A review of privacy-preserving biometric identification and authentication protocols](https://www.sciencedirect.com/science/article/abs/pii/S0167404824006151)
- [Twenty Years of Personality Computing: Threats, Challenges and Future Directions](https://arxiv.org/abs/2503.02082)
- [Face-Based Judgments: Accuracy, Validity, and a Potential Underlying Mechanism](https://pubmed.ncbi.nlm.nih.gov/34410853/)
- [A set of distinct facial traits learned by machines is not predictive of appearance bias in the wild](https://link.springer.com/article/10.1007/s43681-020-00035-y)
- [Can personality traits be measured analyzing written language? A meta-analytic study on computational methods](https://www.sciencedirect.com/science/article/pii/S0191886921001938)
- [Personality, gender, and age in the language of social media: the open-vocabulary approach](https://pubmed.ncbi.nlm.nih.gov/24086296/)
- [Speech-based personality prediction using deep learning with acoustic and linguistic embeddings](https://www.nature.com/articles/s41598-024-81047-0)
- [Trait impressions from voices: Considering multiple origin stories and the dynamic nature of trait-related cues](https://onlinelibrary.wiley.com/doi/10.1111/bjop.12616)
