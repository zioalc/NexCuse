/**
 * Local calendar helpers — "today" comes from the device via `new Date()`, not the server.
 */

export function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** YYYY-MM-DD in local timezone */
export function toISODate(d) {
  const x = startOfDay(d)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, "0")
  const day = String(x.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function parseISODateLocal(iso) {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return startOfDay(new Date())
  return new Date(y, m - 1, d)
}

export function startOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addMonths(d, delta) {
  const x = new Date(d.getFullYear(), d.getMonth() + delta, 1)
  x.setHours(0, 0, 0, 0)
  return x
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

/** 0 = Sunday … 6 = Saturday */
export function firstWeekdayOfMonth(year, monthIndex) {
  return new Date(year, monthIndex, 1).getDay()
}

export function formatMonthYear(d) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" })
}
