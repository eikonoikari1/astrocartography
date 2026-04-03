# Interview Engine Spec

## Purpose
Define the runtime engine for rectification interviews so the system can ask discriminative questions, update the posterior, and stop when additional questioning is not worth the cost.

This spec turns the research layer into an executable interaction model. It assumes the core posterior engine, data schema, and benchmark protocol already exist.

## Engine Responsibilities
The interview engine owns four things:
- selecting the next prompt
- rendering the prompt in the correct format
- ingesting the user response into structured evidence
- deciding whether to continue, refine, or stop

It does not own chart math, timezone conversion, posterior calibration, or final scoring.

## Operating State
Each interview session should track:
- session id
- user id or case id
- triage label: `high`, `medium`, `low`
- current candidate bins
- posterior mass and entropy
- evidence history
- question family history
- format history
- abstention state
- stop reason, if any

## Interview Stages

### Stage 0: Intake
Purpose: establish the minimum context needed to start.

Inputs:
- birth location
- birth date
- source quality summary
- known event windows, if any
- explicit uncertainty about dates or labels

Rules:
- do not ask the user to restate information already captured elsewhere
- do not reveal the current candidate time in plain language
- if source quality is low, start with coarse life-structure questions only

### Stage 1: Coarse Pruning
Purpose: reduce a 24-hour search space to a smaller set of plausible regions.

Preferred prompt types:
- absolute life-structure items
- forced-choice items
- contradiction probes when an answer is overly smooth

Allowed question families:
- career axis
- relationship axis
- family duty
- mobility
- crisis pattern
- identity pressure

Rules:
- ask the highest-ranked families first
- keep prompts neutral and non-leading
- do not use pairwise chart narratives until the posterior is already narrowed

### Stage 2: Discriminative Refinement
Purpose: separate nearby candidate regions that remain plausible after coarse pruning.

Preferred prompt types:
- pairwise chart comparisons
- contradiction probes
- targeted absolute items only when they discriminate a specific boundary

Rules:
- use pairwise prompts only when two candidate regions are genuinely close in posterior mass
- generate candidate narratives from a fixed template
- keep the same domain coverage and temperature on both sides
- avoid turning the prompt into a persuasive explanation of the preferred answer

### Stage 3: Timing Confirmation
Purpose: use event windows and timing-sensitive evidence to confirm or reject the narrowed posterior.

Preferred prompt types:
- dated event validation
- fuzzy event windows
- focused follow-ups about a single event family

Rules:
- treat fuzzy event dates as interval-censored evidence
- ask for date precision only when the current posterior can use it
- do not ask timing questions before the chart family is narrow enough to benefit from them

### Stage 4: Stop Or Refine
Purpose: decide whether another question is worthwhile.

Possible outcomes:
- continue with a new question
- switch to a finer bin resolution
- abstain and report a wider interval
- stop because the case is already stable enough

## Prompt Format Rules

### Absolute Items
Use when the distinction is broad and the answer space is simple.

Requirements:
- one question per prompt
- neutral wording
- no loaded adjectives
- no hidden assumption that one answer is desirable

### Forced-Choice Items
Use when two life-shapes are both plausible and the engine needs discrimination rather than description.

Requirements:
- two balanced alternatives
- comparable specificity
- explicit `not sure` escape hatch
- no asymmetry in tone or specificity

### Pairwise Narrative Prompts
Use only when the posterior is already narrowed and the engine needs a sharper split.

Requirements:
- symmetric narrative generation
- same sentence count or close equivalent
- same domains covered
- same uncertainty temperature
- no chart placements, aspects, or other direct technical clues in the text

### Contradiction Probes
Use when the current answer set is too smooth.

Requirements:
- ask what does not fit
- ask where the current description breaks down
- avoid gotcha framing
- treat disagreement as useful signal, not user error

## Staging Rules For Families
The question families should be staged as follows:

### Core Families
These are asked first because they are highest-value across the board:
- career axis
- relationship axis
- family duty
- mobility

### Secondary Families
These are asked after core pruning:
- crisis pattern
- identity pressure
- work style
- emotional posture

### Corroborative Families
These are used late or only when the case is already narrow:
- body / style
- public biography

### Research-Only Families
These do not drive the core posterior until they survive strict ablation:
- optional text cues
- voice cues
- image cues

## Response Ingestion
Every response should be normalized into structured evidence:
- raw answer text
- family id
- prompt type
- response confidence
- contradiction flag
- response latency
- whether the answer was forced-choice, absolute, or pairwise
- whether the answer was uncertain or partial

Rules:
- do not store free text alone
- attach the response to a family and a chart distinction
- preserve the original wording for auditability

## Stop Conditions
Stop or widen the interval when any of the following holds:
- posterior entropy does not drop meaningfully after the last few turns
- the remaining candidate set is stable under additional prompt families
- the user begins repeating the same information in different words
- the case is low-separability and the engine is only adding false confidence
- the evidence set is strong enough for a calibrated interval already

## Logging Requirements
Each session should log:
- prompt id
- family id
- prompt type
- candidate set before and after the prompt
- posterior entropy before and after the prompt
- response confidence
- contradiction outcome
- whether the prompt was selected or randomly chosen for control evaluation

This is required for benchmark replay and ablation.

## Failure Modes
- asking generic personality questions too early
- using pairwise narratives before the posterior is narrow
- letting narrative polish leak the preferred answer
- treating agreement as discrimination
- continuing after the posterior has stopped moving

## Acceptance Criteria
The engine is acceptable if it can:
- use the same family ranking across cases
- update the posterior after each prompt
- stop cleanly when evidence is insufficient
- support both coarse pruning and fine refinement
- produce auditable logs for every decision

