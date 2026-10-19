import { describe, expect, it } from 'vitest'
import { addDays, diffDays, formatShort, isIsoDate, localIsoDate, mondayIndex, startOfWeek } from '../shared/utils/dates'

describe('isIsoDate', () => {
  it('accepts real dates', () => {
    expect(isIsoDate('2026-10-19')).toBe(true)
    expect(isIsoDate('2028-02-29')).toBe(true)
  })

  it('rejects malformed strings', () => {
    expect(isIsoDate('2026-1-19')).toBe(false)
    expect(isIsoDate('19-10-2026')).toBe(false)
    expect(isIsoDate('2026/10/19')).toBe(false)
    expect(isIsoDate('')).toBe(false)
    expect(isIsoDate('2026-10-19T00:00:00Z')).toBe(false)
  })

  it('rejects impossible dates', () => {
    expect(isIsoDate('2026-02-30')).toBe(false)
    expect(isIsoDate('2026-13-01')).toBe(false)
    expect(isIsoDate('2026-04-31')).toBe(false)
    expect(isIsoDate('2027-02-29')).toBe(false)
  })
})

describe('addDays', () => {
  it('adds days within a month', () => {
    expect(addDays('2026-10-19', 3)).toBe('2026-10-22')
  })

  it('crosses month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01')
  })

  it('supports negative values and zero', () => {
    expect(addDays('2026-11-01', -1)).toBe('2026-10-31')
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31')
    expect(addDays('2026-10-19', 0)).toBe('2026-10-19')
  })
})

describe('diffDays', () => {
  it('counts days between dates', () => {
    expect(diffDays('2026-10-19', '2026-10-25')).toBe(6)
    expect(diffDays('2026-10-19', '2026-10-19')).toBe(0)
    expect(diffDays('2026-12-31', '2027-01-02')).toBe(2)
  })

  it('returns negative values when the target is earlier', () => {
    expect(diffDays('2026-10-25', '2026-10-19')).toBe(-6)
  })
})

describe('mondayIndex', () => {
  it('returns 0 for Monday and 6 for Sunday', () => {
    expect(mondayIndex('2026-10-19')).toBe(0)
    expect(mondayIndex('2026-10-25')).toBe(6)
  })

  it('returns intermediate weekdays', () => {
    expect(mondayIndex('2026-10-21')).toBe(2)
    expect(mondayIndex('2026-10-24')).toBe(5)
  })
})

describe('startOfWeek', () => {
  it('keeps a Monday', () => {
    expect(startOfWeek('2026-10-19')).toBe('2026-10-19')
  })

  it('moves any other day back to its Monday', () => {
    expect(startOfWeek('2026-10-21')).toBe('2026-10-19')
    expect(startOfWeek('2026-10-25')).toBe('2026-10-19')
  })

  it('crosses month boundaries', () => {
    expect(startOfWeek('2026-11-01')).toBe('2026-10-26')
  })
})

describe('formatShort', () => {
  it('formats day and Spanish month abbreviation', () => {
    expect(formatShort('2026-10-19')).toBe('19 oct')
    expect(formatShort('2026-01-05')).toBe('5 ene')
    expect(formatShort('2026-12-31')).toBe('31 dic')
  })
})

describe('localIsoDate', () => {
  it('formats a fixed local date with zero padding', () => {
    expect(localIsoDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(localIsoDate(new Date(2026, 9, 19, 0, 1))).toBe('2026-10-19')
  })

  it('defaults to a valid current date', () => {
    expect(isIsoDate(localIsoDate())).toBe(true)
  })
})
