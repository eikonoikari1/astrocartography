import { DEFAULT_PROFILE, DEFAULT_CITY_SETS, resolveDateInput, resolveLocalMoment, validateCityList, validateNatalData } from "./profile.js";

let pass = 0, fail = 0;
function assert(label, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${label}`); }
  else    { fail++; console.log(`  FAIL  ${label}  ${detail || ""}`); }
}

console.log("\n═══ Test 1: Default profile is internally consistent ═══");
assert("Default datetime exists", DEFAULT_PROFILE.birth.datetime === "2002-09-28T12:44:00Z");
assert("Default natal validates", validateNatalData(DEFAULT_PROFILE.natal) === DEFAULT_PROFILE.natal);

console.log("\n═══ Test 2: Resolve ISO datetime input ═══");
const isoDate = resolveDateInput({ datetime: "2002-09-28T12:45:00Z" });
assert("ISO datetime resolves correctly", isoDate.toISOString() === "2002-09-28T12:45:00.000Z", isoDate.toISOString());

console.log("\n═══ Test 3: Reject offset-less datetime input ═══");
let offsetlessError;
try {
  resolveDateInput({ datetime: "2002-09-28T12:45:00" });
} catch (err) {
  offsetlessError = err;
}
assert("Offset-less datetime throws", offsetlessError instanceof TypeError, offsetlessError?.message);

let dateOnlyMomentError;
try {
  resolveDateInput({ datetime: "2002-09-28Z" });
} catch (err) {
  dateOnlyMomentError = err;
}
assert("Date-only birth moment throws", dateOnlyMomentError instanceof TypeError, dateOnlyMomentError?.message);

console.log("\n═══ Test 4: Resolve local birth input via tz-lookup ═══");
const localMoment = resolveLocalMoment({
  date: "2002-09-28",
  time: "20:44",
  lat: 56.01,
  lon: 92.867,
  confidence: "exact",
});
assert("Resolved timezone from coordinates", localMoment.timezone === "Asia/Krasnoyarsk", localMoment.timezone);
assert("Local birth resolves to expected UTC", localMoment.date.toISOString() === "2002-09-28T12:44:00.000Z", localMoment.date.toISOString());

console.log("\n═══ Test 5: Reject conflicting timezone and coordinates ═══");
let timezoneConflictError;
try {
  resolveLocalMoment({
    date: "2002-09-28",
    time: "20:44",
    lat: 56.01,
    lon: 92.867,
    timezone: "America/New_York",
  });
} catch (err) {
  timezoneConflictError = err;
}
assert("Timezone conflict throws", timezoneConflictError instanceof TypeError, timezoneConflictError?.message);

let partialCoordinatesError;
try {
  resolveLocalMoment({
    date: "2002-09-28",
    time: "20:44",
    lat: 56.01,
    timezone: "Asia/Krasnoyarsk",
  });
} catch (err) {
  partialCoordinatesError = err;
}
assert("Partial coordinates throw", partialCoordinatesError instanceof TypeError, partialCoordinatesError?.message);

console.log("\n═══ Test 6: Resolve date input from structured birth object ═══");
const birthDate = resolveDateInput({
  birth: {
    date: "2002-09-28",
    time: "20:44",
    lat: 56.01,
    lon: 92.867,
  },
});
assert("Structured birth resolves to expected UTC", birthDate.toISOString() === "2002-09-28T12:44:00.000Z", birthDate.toISOString());

console.log("\n═══ Test 7: Validate city sets ═══");
assert("CLI city set validates", validateCityList(DEFAULT_CITY_SETS.cli) === DEFAULT_CITY_SETS.cli);
assert("Runner city set validates", validateCityList(DEFAULT_CITY_SETS.runNatal) === DEFAULT_CITY_SETS.runNatal);
let cityError;
try {
  validateCityList([{ name: "Bad", lat: 999, lon: 0 }]);
} catch (err) {
  cityError = err;
}
assert("Invalid city coordinates throw", cityError instanceof TypeError, cityError?.message);

console.log("\n═══ Test 8: Validation rejects malformed natal data ═══");
let natalError;
try {
  validateNatalData({ planets: {}, aspects: [], dayChart: false });
} catch (err) {
  natalError = err;
}
assert("Malformed natal data throws", natalError instanceof TypeError, natalError?.message);

let aspectError;
try {
  validateNatalData({
    planets: DEFAULT_PROFILE.natal.planets,
    aspects: [{ p1: "NotAPlanet", p2: "Moon", type: "conj", orb: 1 }],
    dayChart: false,
  });
} catch (err) {
  aspectError = err;
}
assert("Invalid natal aspect throws", aspectError instanceof TypeError, aspectError?.message);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══`);
if (fail > 0) process.exit(1);
