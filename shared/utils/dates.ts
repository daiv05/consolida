const DAY_MS = 86_400_000

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const DAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const
export const DAY_LONG = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const

/**
 * Checks that a string is a real calendar date in YYYY-MM-DD format.
 *
 * @param {string} value Candidate date.
 * @returns {boolean} True when the date exists.
 */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  return toIsoDate(fromIsoDate(value)) === value
}

/**
 * Parses a YYYY-MM-DD string into a UTC midnight timestamp.
 *
 * @param {string} value Date in YYYY-MM-DD format.
 * @returns {number} Milliseconds since epoch at UTC midnight.
 */
export function fromIsoDate(value: string): number {
  const [y, m, d] = value.split('-').map(Number) as [number, number, number]
  return Date.UTC(y, m - 1, d)
}

/**
 * Formats a UTC timestamp as YYYY-MM-DD.
 *
 * @param {number} ms Milliseconds since epoch.
 * @returns {string} Date in YYYY-MM-DD format.
 */
export function toIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

/**
 * Adds whole days to an ISO date.
 *
 * @param {string} iso Base date in YYYY-MM-DD format.
 * @param {number} days Days to add, may be negative.
 * @returns {string} Resulting date in YYYY-MM-DD format.
 */
export function addDays(iso: string, days: number): string {
  return toIsoDate(fromIsoDate(iso) + days * DAY_MS)
}

/**
 * Counts whole days from one ISO date to another.
 *
 * @param {string} from Start date.
 * @param {string} to End date.
 * @returns {number} Day difference, negative when `to` is earlier.
 */
export function diffDays(from: string, to: string): number {
  return Math.round((fromIsoDate(to) - fromIsoDate(from)) / DAY_MS)
}

/**
 * Returns the weekday index with Monday as 0 and Sunday as 6.
 *
 * @param {string} iso Date in YYYY-MM-DD format.
 * @returns {number} Weekday index from 0 to 6.
 */
export function mondayIndex(iso: string): number {
  return (new Date(fromIsoDate(iso)).getUTCDay() + 6) % 7
}

/**
 * Moves a date back to the Monday of its week.
 *
 * @param {string} iso Date in YYYY-MM-DD format.
 * @returns {string} The Monday on or before the date.
 */
export function startOfWeek(iso: string): string {
  return addDays(iso, -mondayIndex(iso))
}

/**
 * Returns the local calendar date of a Date object as YYYY-MM-DD.
 *
 * @param {Date} [date] Moment to convert, defaults to now.
 * @returns {string} Local date in YYYY-MM-DD format.
 */
export function localIsoDate(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Formats an ISO date as a short Spanish label such as "19 oct".
 *
 * @param {string} iso Date in YYYY-MM-DD format.
 * @returns {string} Short label.
 */
export function formatShort(iso: string): string {
  const d = new Date(fromIsoDate(iso))
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}
