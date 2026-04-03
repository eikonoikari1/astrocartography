# Corpus Sources And Licensing

## Goal

Identify the open-source and publicly accessible sources that can support a known-time rectification benchmark for historical figures and known people, and separate them by license, provenance strength, event richness, and benchmark role.

## Main Distinction

Do not treat these categories as the same:
- open and reusable
- publicly accessible but license-constrained
- useful for biography or event extraction but not birth-time provenance
- suitable for gold labels

The corpus should use all four, but not confuse them.

## Source Review

| Source | Access method | Licensing / reuse | Provenance quality | Event richness | Biases and limitations | Best benchmark role |
|---|---|---|---|---|---|---|
| [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page) | SPARQL query service, REST API, dumps, linked data | Structured data is CC0; widely reusable | Medium for metadata, low for birth-time provenance | Medium-high for dates, relations, offices, occupations | Crowd-sourced completeness; uneven citation quality; tends to favor notable people with Wikipedia presence | Cohort seed, structured metadata, feature extraction, support layer |
| [Wikipedia / Wikimedia dumps and REST API](https://www.mediawiki.org/wiki/Wikimedia_REST_API) | REST API, Action API, dumps, page history | Text on Wikimedia projects is generally CC BY-SA / GFDL depending on project and page; reuse requires attribution and license compliance | Medium for biography text, low for exact birth-time provenance | High for narrative biographies and life periods | Retrospective prose, community quality variance, language-edition skew, biography drift | Event extraction, life-period extraction, support layer |
| [Pantheon 1.0 / 2.0](https://www.nature.com/articles/sdata201575) | Harvard Dataverse / project site | Article is CC BY 4.0; dataset reuse terms should be checked in the dataverse record before redistribution | Medium for demographic facts, low for birth-time provenance | Medium for occupations, places, dates, popularity metrics | Globally famous people bias, Wikipedia-language bias, selection toward public figures | Famous-person benchmark slice, metadata support, validation slice |
| [CBDB](https://input.cbdb.fas.harvard.edu/cbdbapi/index.html) | Online portal, REST API, standalone database download | API data is CC BY-NC-SA 4.0; project states the database is free for academic use and non-commercial reuse must respect license terms | Medium-high for historical biographical provenance, low for birth-time provenance | High for offices, kinship, posts, addresses, texts | Chinese historical elite bias, documentary bias, mostly no direct birth-time labels | Dense historical figure corpus, event and network extraction, support/challenge slice |
| [Chronicling America / Library of Congress newspapers](https://www.loc.gov/collections/chronicling-america/about-this-collection/rights-and-access/) | LoC API, newspaper page images, OCR text, bulk downloads | Newspapers are believed public domain or without known restrictions, but independent rights review is still required | High for contemporaneous event anchoring, low for birth-time provenance | High for dated events, public notices, death notices, career news | U.S.-centric, newspaper coverage bias, OCR noise, event visibility bias | Contemporaneous event verification, life-event anchoring, support/challenge slice |
| [Astro-Databank](https://www.astro.com/astro-databank/Astro-Databank%3AHandbook_chapter_01) | Public wiki interface; export license for software developers and researchers | Export license is not open-source; text remains copyright-restricted, and reuse depends on permissions and source conditions | High for birth-time provenance when source notes are strong | Medium for biographies and dated events | Celebrity/public-figure bias, collector bias, mixed source quality, rounded or contaminated times | Primary known-time source, gold/challenge routing, provenance audit anchor |

## What The Licenses Mean In Practice

Wikidata is the cleanest truly open source for structured metadata because its structured data is CC0 and the service is explicitly designed for machine access through SPARQL and REST APIs.

Wikipedia and Wikimedia dumps are usable for text extraction, but the text is under CC BY-SA or related Wikimedia license terms, so the corpus should store derived features and citation pointers rather than assuming free redistribution of raw text.

Pantheon is publicly available and useful, but it is a famous-biography slice built from Wikipedia and Freebase-derived material. It is better viewed as a curated benchmark slice than as a broad representative population.

CBDB is openly usable for academic work and has a strong API plus standalone downloads, but the license is non-commercial share-alike. It is a serious source for historical biography and event structure, not for exact birth-time truth.

Chronicling America is one of the best public archive sources for contemporaneous event verification. Its role is to improve event certainty, not to supply birth-time labels.

Astro-Databank is the only source in this set that directly targets birth-time provenance at scale, but it is not open-source. It should be treated as a rights-constrained benchmark source, not as a freely redistributable corpus.

## Likely Role By Data Type

### Structured Metadata
Best sources:
- Wikidata
- Pantheon
- CBDB

### Biography Text
Best sources:
- Wikipedia / Wikimedia
- CBDB
- Pantheon for famous-person slice

### Contemporaneous Event Anchors
Best sources:
- Chronicling America
- other public newspaper or archive collections

### Known-Time Provenance
Best source:
- Astro-Databank

## Biases To Track Explicitly

- public-figure skew
- language-edition skew
- Western celebrity skew
- elite-documentary skew
- Chinese historical elite skew in CBDB
- U.S. newspaper bias in Chronicling America
- collector conventions and rounding artifacts in Astro-Databank
- retrospective narrative smoothing in Wikipedia-derived biographies

## Suitability Summary

### Gold
Only source families with direct birth-time provenance and auditable source notes can support gold labels. In practice, that means Astro-Databank or equivalent documentary records, not generic biography datasets.

### Challenge
Wikidata, Wikipedia, CBDB, Pantheon, and Chronicling America can all support challenge-set evidence, because they can improve event and period extraction even when they cannot certify exact birth time.

### Metadata Only
Use this label for sources that are good for seed lists, demographics, and life-history structure but not for precise time truth.

That category includes Wikidata, Pantheon, and sometimes Wikipedia-derived text if used only as a structured feature source.

## Corpus Design Rule

The benchmark should store:
- raw source pointers
- normalized features
- provenance metadata
- license or reuse class
- audit decision

No downstream model should have to infer rights or provenance from text.

## Best Practical Stack

If the goal is a first real corpus, the best stack is:
1. Wikidata for the person graph and structured facts
2. Wikipedia or Wikimedia dumps for biography text
3. Chronicling America and similar archives for date anchors
4. Pantheon and CBDB for curated historical figure slices
5. Astro-Databank only for known-time provenance labels

That stack gives breadth, depth, and a way to separate signal from label quality.
