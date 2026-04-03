# Astrocartography CLI

Run `node astro.mjs <cmd> '<json>'` from project root. All output is JSON. Default natal data is built in, and datetime-based commands can also resolve a local birth input via `{"birth":{"date":"YYYY-MM-DD","time":"HH:MM","lat":N,"lon":N}}`.

## Commands

- **chart** — Cast chart. `{"datetime":"ISO"}`
- **lines** — Astrocartography lines (MC/IC/AS/DS per planet). `{"datetime":"ISO"}`
- **score** — Score one location. `{"lat":N,"lon":N}` (required)
- **score-cities** — Rank built-in city list. `{"category":"Love & Romance"|"Partnership"|"Partnership & Deep Connection"|"Vocation & Career"|"Friendship & Family"|"Excitement"|"Excitement & Instability"|"Growth"|"Growth & Transformation"}`
- **natal-strength** — Planet strengths (dignity/sect/aspects). No args needed.
- **transits** — Transit hits to natal. `{"natalLongitudes":{"Sun":185.22,...},"start":"ISO","end":"ISO","majorOnly":true}`
- **horary** — Horary chart. `{"datetime":"ISO","lat":N,"lon":N,"querentHouse":1,"quesitedHouse":7}`
- **progressions** — Secondary progressions. `{"birthDate":"ISO","startAge":N,"endAge":N}`
- **solar-return** — Solar return chart. `{"year":2026,"lat":N,"lon":N}`
- **zodiacal-releasing** — ZR periods. `{"sunLon":N,"moonLon":N,"ascLon":N,"years":80,"maxLevel":2}`
- **houses** — Placidus cusps. `{"datetime":"ISO","lat":N,"lon":N}`

## Default natal (2002-09-28T12:45:00Z)

Sun 5.23 Libra, Moon 21.50 Gemini, Mercury 3.63 Libra Rx, Venus 12.95 Scorpio, Mars 19.05 Virgo, Jupiter 11.72 Leo, Saturn 28.93 Gemini, Uranus 25.45 Aquarius Rx, Neptune 8.35 Aquarius Rx, Pluto 15.17 Sagittarius. Night chart.

Ecliptic lons: Sun 185.22, Moon 81.51, Mercury 183.64, Venus 222.93, Mars 169.04, Jupiter 131.71, Saturn 88.93, Uranus 325.44, Neptune 308.33, Pluto 255.20.
