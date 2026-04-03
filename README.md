# Astrocartography

A JS astrocartography and astrology research engine with a JSON CLI for charts, lines, location scoring, transits, horary, progressions, returns, profections, zodiacal releasing, and rectification experiments.

## Agentic-First Install

Clone the repo and let your coding agent set it up from the project root:

```bash
git clone https://github.com/eikonoikari1/astrocartography.git
cd astrocartography
npm install
```

Then give the agent a short task such as:

```text
Read HANDOFF.md and astro.mjs, run npm test, then show me how to use the CLI for charts, lines, and rectification.
```

That gives the agent the shortest path to the real entrypoints and the working command surface.

## Manual Use

Start with the CLI:

```bash
node astro.mjs <command> '<options-json>'
```

Useful examples:

```bash
node astro.mjs chart '{"datetime":"2026-04-03T12:00:00Z"}'
node astro.mjs lines '{"datetime":"2026-04-03T12:00:00Z"}'
node astro.mjs rectify '{"birth":{"date":"2002-09-28","time":"20:45","lat":56.01,"lon":92.87},"events":[]}'
```

## Dev

```bash
npm test
npm run build
npm run dev
```

Main entrypoints:

- `astro.mjs` for the JSON CLI
- `HANDOFF.md` for the quickest architecture overview
- `rectification/` for the rectification subsystem and research notes
