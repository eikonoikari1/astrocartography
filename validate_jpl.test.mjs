/**
 * validate_jpl.test.mjs — Validate chartCaster against JPL Horizons ephemeris
 *
 * Queries NASA's JPL Horizons API for geocentric apparent ecliptic longitudes
 * at the birth datetime, then compares against our astronomy-engine output.
 *
 * Run: node validate_jpl.test.mjs
 *
 * This is the ground-truth test. JPL Horizons uses DE441 (planets) and
 * DE440 (Moon) — the authoritative ephemerides maintained by NASA/JPL.
 */
import { castChart, getEclipticLongitude } from "./chartCaster.js";

const EPOCH = "2002-Sep-28 12:45:00";
const DT = new Date("2002-09-28T12:45:00Z");

// JPL Horizons body IDs
const BODIES = {
  Sun:     "10",
  Moon:    "301",
  Mercury: "199",
  Venus:   "299",
  Mars:    "499",
  Jupiter: "599",
  Saturn:  "699",
  Uranus:  "799",
  Neptune: "899",
  Pluto:   "999",
};

// Tolerances (degrees)
const TOLERANCE = {
  Sun: 0.01, Moon: 0.05, Mercury: 0.05, Venus: 0.05,
  Mars: 0.05, Jupiter: 0.05, Saturn: 0.05,
  Uranus: 0.1, Neptune: 0.1, Pluto: 0.2,
};

const angularDiff = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * Query JPL Horizons for ecliptic longitude of a body.
 */
async function queryHorizons(bodyId, epoch) {
  const params = new URLSearchParams({
    format: "text",
    COMMAND: `'${bodyId}'`,
    EPHEM_TYPE: "OBSERVER",
    CENTER: "'@399'",
    MAKE_EPHEM: "YES",
    TLIST: `'${epoch}'`,
    QUANTITIES: "'31'",
    OBJ_DATA: "NO",
    CSV_FORMAT: "YES",
  });

  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Horizons HTTP ${res.status}`);
  const text = await res.text();

  // Parse: find data between $$SOE and $$EOE markers
  const soe = text.indexOf("$$SOE");
  const eoe = text.indexOf("$$EOE");
  if (soe === -1 || eoe === -1) {
    throw new Error(`No data markers in Horizons response for body ${bodyId}:\n${text.slice(0, 500)}`);
  }

  const dataLine = text.slice(soe + 5, eoe).trim();
  // CSV format has variable columns — find the first parseable number after the date
  const fields = dataLine.split(",").map(s => s.trim());
  // Skip date field (index 0), then find first non-empty numeric field = ObsEcLon
  let ecLon = NaN;
  for (let i = 1; i < fields.length; i++) {
    const v = parseFloat(fields[i]);
    if (!isNaN(v)) { ecLon = v; break; }
  }
  if (isNaN(ecLon)) {
    throw new Error(`Could not parse ecliptic longitude from: ${dataLine}`);
  }
  return ecLon;
}

// ═══ Main ═══
async function main() {
  let pass = 0, fail = 0;
  function assert(label, ok, detail) {
    if (ok) { pass++; console.log(`  PASS  ${label}`); }
    else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
  }

  console.log("Querying JPL Horizons for ground-truth ecliptic longitudes...");
  console.log(`Epoch: ${EPOCH} (UTC)\n`);

  const chart = castChart(DT);

  // Query all bodies from JPL (sequentially to be polite to NASA)
  const jplResults = {};
  for (const [name, id] of Object.entries(BODIES)) {
    try {
      jplResults[name] = await queryHorizons(id, EPOCH);
      // Small delay to avoid hammering the API
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.log(`  SKIP  ${name}: ${err.message}`);
    }
  }

  console.log("\n═══ Ecliptic Longitude Comparison ═══");
  console.log(`${"Body".padEnd(10)} ${"JPL (°)".padStart(10)} ${"Ours (°)".padStart(10)} ${"Diff (°)".padStart(10)} ${"Tol (°)".padStart(8)}  Result`);
  console.log("─".repeat(68));

  for (const [name, jplLon] of Object.entries(jplResults)) {
    const ourLon = chart.eclipticLongitudes[name];
    const diff = angularDiff(jplLon, ourLon);
    const tol = TOLERANCE[name];
    const ok = diff <= tol;

    console.log(
      `${name.padEnd(10)} ${jplLon.toFixed(4).padStart(10)} ${ourLon.toFixed(4).padStart(10)} ${diff.toFixed(4).padStart(10)} ${tol.toFixed(2).padStart(8)}  ${ok ? "✓" : "✗"}`
    );

    assert(`${name} within ${tol}° of JPL Horizons`, ok,
      `JPL=${jplLon.toFixed(4)}° ours=${ourLon.toFixed(4)}° diff=${diff.toFixed(4)}°`);
  }

  // ═══ Additional epoch: J2000.0 (known reference) ═══
  console.log("\n═══ Cross-check at J2000.0 (2000-Jan-01 12:00:00 TT) ═══");
  const j2000 = new Date("2000-01-01T12:00:00Z"); // ~TT for this purpose
  const j2kChart = castChart(j2000);

  // Sun at J2000.0 should be near 280.5° (Capricorn ~10°)
  const j2kSun = j2kChart.eclipticLongitudes.Sun;
  console.log(`  Sun at J2000.0: ${j2kSun.toFixed(4)}°`);
  assert("Sun at J2000.0 near 280.5° (±0.5°)", angularDiff(j2kSun, 280.5) < 0.5,
    `got ${j2kSun.toFixed(4)}°`);

  console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
  if (fail > 0) process.exit(1);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(2);
});
