import { execFileSync } from "node:child_process";
import { castChart } from "./chartCaster.js";
import { computeHouses } from "./houses.js";
import { computeLines } from "./lines.js";
import { DEFAULT_PROFILE, resolveDateInput, resolveLocalMoment, validateNatalData } from "./profile.js";

let pass = 0;
let fail = 0;

function assert(label, ok, detail = "") {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
    return;
  }
  fail++;
  console.log(`  FAIL  ${label}  ${detail}`);
}

function run(command, options = {}) {
  const stdout = execFileSync("node", ["astro.mjs", command, JSON.stringify(options)], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  return JSON.parse(stdout);
}

const sampleDate = new Date("2025-03-21T12:00:00Z");

console.log("\n═══ Test 1: Chart engine smoke ═══");
{
  const chart = castChart(sampleDate);
  assert("Chart has positions", Boolean(chart.positions));
  assert("Chart exposes Sun longitude", typeof chart.eclipticLongitudes?.Sun === "number");
  assert("Chart exposes GMST", typeof chart.gmst === "number");
  assert("Chart exposes obliquity", typeof chart.obliquity === "number");
}

console.log("\n═══ Test 2: Line and house engine smoke ═══");
{
  const chart = castChart(sampleDate);
  const lineResult = computeLines(sampleDate);
  const houses = computeHouses(chart.gmst, chart.obliquity, 51.5074, -0.1278);
  assert("Line engine returns 40 lines", lineResult.lines.length === 40, `got ${lineResult.lines.length}`);
  assert("House engine returns 12 cusps", houses.cusps.length === 12, `got ${houses.cusps.length}`);
  assert("House engine exposes ASC", typeof houses.asc === "number");
  assert("House engine exposes MC", typeof houses.mc === "number");
}

console.log("\n═══ Test 3: Sample profile and time resolution smoke ═══");
{
  assert("Bundled profile is generic sample data", DEFAULT_PROFILE.id === "sample-london-2001-01-15", DEFAULT_PROFILE.id);
  assert("Bundled natal data validates", validateNatalData(DEFAULT_PROFILE.natal) === DEFAULT_PROFILE.natal);

  const localMoment = resolveLocalMoment({
    date: "2001-01-15",
    time: "12:00",
    lat: 51.5074,
    lon: -0.1278,
  });
  assert("Timezone lookup resolves to Europe/London", localMoment.timezone === "Europe/London", localMoment.timezone);
  assert("Local moment resolves to UTC", localMoment.date.toISOString() === "2001-01-15T12:00:00.000Z", localMoment.date.toISOString());

  const structuredBirth = resolveDateInput({
    birth: {
      date: "2001-01-15",
      time: "12:00",
      lat: 51.5074,
      lon: -0.1278,
    },
  });
  assert("Structured birth input resolves", structuredBirth.toISOString() === "2001-01-15T12:00:00.000Z", structuredBirth.toISOString());
}

console.log("\n═══ Test 4: CLI smoke ═══");
{
  const lineResult = run("lines", { datetime: "2025-03-21T12:00:00Z" });
  assert("Lines CLI returns an array", Array.isArray(lineResult.lines));
  assert("Lines CLI returns 40 lines", lineResult.lines.length === 40, `got ${lineResult.lines.length}`);

  const rectificationResult = run("rectify", {
    birthDate: "2001-01-15",
    lat: 51.5074,
    lon: -0.1278,
    timezone: "Europe/London",
    stepMinutes: 120,
    topN: 2,
    events: [
      { label: "Move", date: "2024-03-20" },
      { label: "Career shift", timestamp: "2025-06-15T12:00:00Z" },
    ],
  });
  assert("Rectify CLI returns candidates", Array.isArray(rectificationResult.topCandidates));
  assert("Rectify CLI honors topN", rectificationResult.topCandidates.length === 2, `got ${rectificationResult.topCandidates.length}`);
  assert("Rectify CLI reports candidate count", rectificationResult.candidateCount > 0, `got ${rectificationResult.candidateCount}`);
}

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
