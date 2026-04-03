import { computePlanetStrength, getCategoryMeta, scoreWithNatalContext } from "./natalScoring.js";
import { DEFAULT_CITY_SETS, DEFAULT_PROFILE } from "./profile.js";
import { computeLines } from "./lines.js";

// ── Compute astro lines ──
const dt = new Date(DEFAULT_PROFILE.birth.datetime); // 20:45 Krasnoyarsk Summer Time (UTC+8)
const { lines } = computeLines(dt);

// ── Natal data ──
const natalData = DEFAULT_PROFILE.natal;

// ── Compute planet strengths ──
const planetStrengths = {};
console.log("═══════════════════════════════════════════════════════════════════════════════");
console.log("  PLANET STRENGTH TABLE (3-axis modifiers)");
console.log("═══════════════════════════════════════════════════════════════════════════════");
console.log(`${"Planet".padEnd(10)} ${"Sign".padEnd(12)} ${"Dignity".padEnd(14)} ${"Intens".padStart(7)} ${"Harmon".padStart(7)} ${"Growth".padStart(7)}  Key factors`);
console.log("─".repeat(85));

for (const [planet, pd] of Object.entries(natalData.planets)) {
  const ps = computePlanetStrength(planet, natalData);
  planetStrengths[planet] = ps;

  const d = ps._debug;
  const dignityStr = d.dignity.major || (d.dignity.minor.length ? d.dignity.minor.join("+") : "peregrine");
  const factors = [];
  if (d.aspectScores.harmony > 1) factors.push("asp+");
  if (d.aspectScores.harmony < -1) factors.push("asp-");
  if (d.sectScores.harmony > 0.5) factors.push("sect+");
  if (d.sectScores.harmony < -0.5) factors.push("sect-");
  if (pd.retrograde) factors.push("Rx");
  if (pd.house <= 1 || pd.house === 4 || pd.house === 7 || pd.house === 10) factors.push("angular");
  if ([3,6,9,12].includes(pd.house)) factors.push("cadent");

  console.log(
    `${planet.padEnd(10)} ${pd.sign.padEnd(12)} ${dignityStr.padEnd(14)} ${ps.intensity.toFixed(2).padStart(7)} ${ps.harmony.toFixed(2).padStart(7)} ${ps.growth.toFixed(2).padStart(7)}  ${factors.join(", ")}`
  );
}

// ── Score cities ──
const cities = DEFAULT_CITY_SETS.runNatal;

const allScores = cities.map(c => {
  const s = scoreWithNatalContext(c.lat, c.lon, lines, natalData, planetStrengths);
  return { ...c, scores: s.scores, dominant: s.dominantLines };
});

function printCategoryScores(categoryKey, limit = Infinity) {
  const category = getCategoryMeta(categoryKey);
  const title = category?.label ?? categoryKey;

  console.log("\n═══════════════════════════════════════════════════════════════════════════════");
  console.log(`  ${title.toUpperCase()} (sorted by blended score)`);
  console.log("═══════════════════════════════════════════════════════════════════════════════");
  console.log(`${"City".padEnd(16)} ${"Intens".padStart(7)} ${"Harmon".padStart(7)} ${"Growth".padStart(7)} ${"Blend".padStart(7)}  Dominant line`);
  console.log("─".repeat(75));

  allScores
    .filter(city => city.scores[categoryKey]?.blended > 0)
    .sort((a, b) => b.scores[categoryKey].blended - a.scores[categoryKey].blended)
    .slice(0, limit)
    .forEach(city => {
      const score = city.scores[categoryKey];
      const dominant = city.dominant[categoryKey];
      const dominantLabel = dominant ? `${dominant.planet} ${dominant.angle} (${dominant.dist.toFixed(1)}°)` : "";
      console.log(
        `${city.name.padEnd(16)} ${String(score.intensity).padStart(7)} ${String(score.harmony).padStart(7)} ${String(score.growth).padStart(7)} ${String(score.blended).padStart(7)}  ${dominantLabel}`
      );
    });
}

printCategoryScores("Partnership");
printCategoryScores("Love & Romance");
printCategoryScores("Vocation & Career");
printCategoryScores("Growth");
printCategoryScores("Excitement", 15);
