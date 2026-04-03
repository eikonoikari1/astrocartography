import { parseIsoDate } from "../../profile.js";

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function coerceDate(value, label) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return parseIsoDate(value, label, { allowDateOnly: true });
  }
  return parseIsoDate(value, label);
}

function toMidpoint(start, end) {
  return new Date((start.getTime() + end.getTime()) / 2);
}

export function normalizeRectificationEvents(events) {
  assert(Array.isArray(events) && events.length > 0, "events must be a non-empty array");

  return events.map((event, index) => {
    assert(event && typeof event === "object" && !Array.isArray(event), `events[${index}] must be an object`);
    const label = typeof event.label === "string" && event.label.trim().length > 0
      ? event.label.trim()
      : `event-${index + 1}`;

    let kind;
    let start;
    let end;
    let representativeDate;

    if (event.timestamp != null) {
      kind = "timestamp";
      start = coerceDate(event.timestamp, `events[${index}].timestamp`);
      end = start;
      representativeDate = start;
    } else if (event.date != null) {
      kind = "date";
      start = coerceDate(event.date, `events[${index}].date`);
      end = new Date(start.getTime() + 86400000);
      representativeDate = new Date(start.getTime() + 43200000);
    } else {
      assert(event.start != null && event.end != null, `events[${index}] must provide timestamp, date, or start/end`);
      kind = "window";
      start = coerceDate(event.start, `events[${index}].start`);
      end = coerceDate(event.end, `events[${index}].end`);
      representativeDate = toMidpoint(start, end);
    }

    assert(end.getTime() >= start.getTime(), `events[${index}] must have end >= start`);

    const durationDays = Math.max((end.getTime() - start.getTime()) / 86400000, 0);
    const reliability = typeof event.reliability === "number" && Number.isFinite(event.reliability)
      ? Math.max(0, Math.min(1, event.reliability))
      : 1;

    return {
      id: event.id ?? `event-${index + 1}`,
      label,
      kind,
      start,
      end,
      representativeDate,
      durationDays,
      reliability,
      notes: typeof event.notes === "string" ? event.notes : undefined,
    };
  });
}
