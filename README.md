# Astrocartography

A JavaScript astrocartography CLI for charts, lines, location scoring, transits, horary, progressions, returns, profections, zodiacal releasing, and rectification.

## Agentic-First Install

Clone the repo and let your coding agent set it up from the project root:

```bash
git clone https://github.com/eikonoikari1/astrocartography.git
cd astrocartography
npm install
```

Then give the agent a short task such as:

```text
Read README.md and astro.mjs, run npm test, then show me how to use the CLI for charts, lines, and rectification.
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
node astro.mjs rectify '{"birthDate":"2001-01-15","lat":51.5074,"lon":-0.1278,"timezone":"Europe/London","events":[{"label":"Move","date":"2024-03-20"}]}'
```

## Dev

```bash
npm test
```

Main entrypoints:

- `astro.mjs` for the JSON CLI
- `profile.js` for the bundled sample profile and input validation
- `rectification/` for the rectification runtime
