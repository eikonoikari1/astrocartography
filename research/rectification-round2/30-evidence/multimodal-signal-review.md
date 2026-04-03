# Multimodal Signal Review

## Bottom Line
Multimodal signals are not a good core path for rectification. They may help as auxiliary evidence in narrow cases, but their incremental value is too mixed, their confounding is too strong, and their proxy-leakage risk is too high to justify mixing them into the main posterior without strict ablation and gating.

The strongest research conclusion is that these signals are more useful for extracting or normalizing evidence than for directly predicting birth time.

## Signal By Signal

| Modality | Likely value | Main confounds | Recommendation |
|---|---|---|---|
| Appearance / image | Low to weak-medium as late corroboration | stereotype effects, styling, age, culture, camera conditions, observer bias | do not use as a core signal; at most late-stage corroboration |
| Voice / speech | Moderate in principle, but unstable in practice | accent, dialect, SES, language, recording context, mood, task type | research-only unless it clearly beats simpler baselines |
| Public biography | High for event extraction, low as a direct feature source | selection bias, survivorship bias, direct target leakage, overfit to known life events | use for structured timeline extraction, not as an input feature blob |
| Text style | Strongest of the four for demographic/personality inference, but also the highest leakage risk | platform effects, topic effects, age/gender/culture, genre, audience, self-presentation | research-only and heavily ablated |

## What The Literature Suggests

### Appearance
People do form trait impressions from faces, and some studies find above-chance accuracy. But the accuracy is not well calibrated, confidence does not track accuracy, and one recent study suggests the apparent accuracy can be explained in part by self-fulfilling effects rather than a direct face-to-trait mechanism. Machine-learning work also shows that models can learn human appearance bias without that bias being predictive in the wild.

That makes appearance a poor foundation for exact-minute rectification. It can still serve as a weak corroboration layer when the chart family is already narrow, but it should not be asked to carry the model.

### Voice
Voice carries both acoustic and linguistic information. That is useful, but it is also the problem: voices include accent and socio-economic cues, and the trait impressions they trigger are shaped by cultural learning as much as by any stable psychological signal. Recent speech-based personality models report moderate correlations with self-report, yet still note low discriminant validity and uncertainty about real-world criterion validity.

That means voice may contain signal, but the signal is entangled with context, identity, and presentation. For rectification, that makes it too easy to drift from birth-time inference into accent or class inference.

### Public Biography
This is the least glamorous and often the most useful source, but mainly because it helps reconstruct dated events, relocations, career shifts, and family transitions. As a direct feature source, it is dangerous: biographies can encode the very life history the system is trying to infer, and well-documented people are not representative of the population.

So the right use is structured event extraction, not unconstrained biography embedding.

### Text Style
Text is the strongest candidate for useful signal, but also the most dangerous one. Meta-analytic work shows small-to-moderate associations between written language and personality, while large-scale social media studies show that language also tracks gender and age. That means text style is a rich proxy for demographics, platform behavior, and self-presentation. It can help a model learn who the user is, but that is not the same as learning the birth time.

For rectification, text should be treated as a noisy proxy source with strong ablation requirements, not as a core evidence family.

## Where These Signals Might Help

1. As a pre-interview extractor that turns free text into structured life events.
2. As a late-stage corroboration signal after the candidate window is already narrow.
3. As a research-only branch for testing whether any residual signal survives strict controls.
4. As a response-quality check, for example to detect whether the user is supplying elaborated narrative instead of concrete evidence.

## Where They Hurt

1. They can cause the system to infer the user, not the birth time.
2. They can inflate confidence through stereotype matching.
3. They can encode demographic and cultural shortcuts that look like astrological signal.
4. They can make the benchmark less honest by improving only on the subset of cases with rich public footprints.

## Recommendation

Do not include appearance, voice, or free-form text as core features in the main rectification posterior.

If these modalities are tested at all, they should enter through separate ablation tracks with strict controls, and only after the benchmark already proves value on cleaner evidence families.

Public biography is the exception only in a narrow sense: use it as a source of structured event extraction, not as a direct predictive feature.

## Source Anchors

- [Face-Based Judgments: Accuracy, Validity, and a Potential Underlying Mechanism](https://pubmed.ncbi.nlm.nih.gov/34410853/)
- [A set of distinct facial traits learned by machines is not predictive of appearance bias in the wild](https://link.springer.com/article/10.1007/s43681-020-00035-y)
- [Can personality traits be measured analyzing written language? A meta-analytic study on computational methods](https://www.sciencedirect.com/science/article/pii/S0191886921001938)
- [Personality, gender, and age in the language of social media: the open-vocabulary approach](https://pubmed.ncbi.nlm.nih.gov/24086296/)
- [Speech-based personality prediction using deep learning with acoustic and linguistic embeddings](https://www.nature.com/articles/s41598-024-81047-0)
- [Trait impressions from voices: Considering multiple origin stories and the dynamic nature of trait-related cues](https://onlinelibrary.wiley.com/doi/10.1111/bjop.12616)
