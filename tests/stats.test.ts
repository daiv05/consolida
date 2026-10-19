import { describe, expect, it } from 'vitest'
import { ALL_TASKS, REQUIRED_TASKS } from '../shared/utils/plan'
import { computeStats, computeStreak, planPosition } from '../shared/utils/stats'

const START = '2026-10-19'

const requiredKeys = (week: number, days: number[]): Set<string> =>
  new Set(REQUIRED_TASKS.filter(t => t.week === week && days.includes(t.day)).map(t => t.key))

const plannedMinutes = (week: number): number =>
  ALL_TASKS.filter(t => t.week === week && !t.optional).reduce((sum, t) => sum + t.minutes, 0)

describe('planPosition', () => {
  it('reports upcoming before the start date', () => {
    expect(planPosition(START, '2026-10-16')).toEqual({ phase: 'upcoming', week: 1, day: 0, daysUntilStart: 3 })
  })

  it('reports the first day as active', () => {
    expect(planPosition(START, START)).toEqual({ phase: 'active', week: 1, day: 0, daysUntilStart: 0 })
  })

  it('reports the correct week and day while active', () => {
    expect(planPosition(START, '2026-10-25')).toMatchObject({ phase: 'active', week: 1, day: 6 })
    expect(planPosition(START, '2026-10-26')).toMatchObject({ phase: 'active', week: 2, day: 0 })
    expect(planPosition(START, '2026-11-11')).toMatchObject({ phase: 'active', week: 4, day: 2 })
    expect(planPosition(START, '2026-12-13')).toMatchObject({ phase: 'active', week: 8, day: 6 })
  })

  it('reports finished after the last day', () => {
    expect(planPosition(START, '2026-12-14')).toEqual({ phase: 'finished', week: 8, day: 6, daysUntilStart: 0 })
    expect(planPosition(START, '2027-03-01').phase).toBe('finished')
  })
})

describe('computeStreak', () => {
  it('is 0 with no completions', () => {
    expect(computeStreak(START, '2026-10-22', new Set())).toBe(0)
  })

  it('is 0 before the plan starts', () => {
    expect(computeStreak(START, '2026-10-10', requiredKeys(1, [0, 1]))).toBe(0)
  })

  it('counts consecutive scheduled days', () => {
    expect(computeStreak(START, '2026-10-21', requiredKeys(1, [0, 1, 2]))).toBe(3)
  })

  it('counts a day with a single completed required task', () => {
    const one = new Set([REQUIRED_TASKS.find(t => t.week === 1 && t.day === 0)!.key])
    expect(computeStreak(START, START, one)).toBe(1)
  })

  it('does not break on Saturday, which has only optional tasks', () => {
    expect(computeStreak(START, '2026-10-25', requiredKeys(1, [0, 1, 2, 3, 4, 6]))).toBe(6)
    expect(computeStreak(START, '2026-10-24', requiredKeys(1, [0, 1, 2, 3, 4]))).toBe(5)
  })

  it('does not break when today has no completions yet', () => {
    expect(computeStreak(START, '2026-10-22', requiredKeys(1, [0, 1, 2]))).toBe(3)
  })

  it('breaks when yesterday has no completions', () => {
    expect(computeStreak(START, '2026-10-22', requiredKeys(1, [0, 1, 3]))).toBe(1)
    expect(computeStreak(START, '2026-10-22', requiredKeys(1, [0, 1]))).toBe(0)
  })

  it('stops at the first missed day', () => {
    expect(computeStreak(START, '2026-10-23', requiredKeys(1, [0, 2, 3]))).toBe(2)
  })

  it('ignores completed optional tasks', () => {
    const optional = new Set(ALL_TASKS.filter(t => t.optional && t.week === 1).map(t => t.key))
    expect(computeStreak(START, '2026-10-24', optional)).toBe(0)
  })

  it('clamps completions after the plan end to the last day', () => {
    const all = new Set(REQUIRED_TASKS.map(t => t.key))
    expect(computeStreak(START, '2027-02-01', all)).toBe(48)
    expect(computeStreak(START, '2027-02-01', requiredKeys(8, [4, 6]))).toBe(2)
  })

  it('breaks after the plan end when the last day was missed', () => {
    expect(computeStreak(START, '2027-02-01', requiredKeys(8, [4]))).toBe(0)
  })
})

describe('computeStats', () => {
  it('uses the required task count as total', () => {
    const stats = computeStats(START, START, new Set())
    expect(stats.total).toBe(REQUIRED_TASKS.length)
    expect(stats.done).toBe(0)
    expect(stats.percent).toBe(0)
  })

  it('rounds the percentage', () => {
    const keys = REQUIRED_TASKS.slice(0, 7).map(t => t.key)
    const stats = computeStats(START, START, new Set(keys))
    expect(stats.done).toBe(7)
    expect(stats.percent).toBe(Math.round((7 / REQUIRED_TASKS.length) * 100))
    const all = computeStats(START, START, new Set(REQUIRED_TASKS.map(t => t.key)))
    expect(all.percent).toBe(100)
  })

  it('counts overdue only for past uncompleted required tasks', () => {
    const past = REQUIRED_TASKS.filter(t => t.week === 1 && t.day <= 1)
    const stats = computeStats(START, '2026-10-21', new Set())
    expect(stats.overdue).toBe(past.length)
  })

  it('excludes completed tasks from overdue', () => {
    const doneKey = REQUIRED_TASKS.find(t => t.week === 1 && t.day === 0)!.key
    const past = REQUIRED_TASKS.filter(t => t.week === 1 && t.day <= 1)
    const stats = computeStats(START, '2026-10-21', new Set([doneKey]))
    expect(stats.overdue).toBe(past.length - 1)
  })

  it('has no overdue before the start', () => {
    expect(computeStats(START, '2026-10-10', new Set()).overdue).toBe(0)
  })

  it('reports per-week done and total', () => {
    const completed = requiredKeys(1, [0, 1])
    const stats = computeStats(START, '2026-10-21', completed)
    expect(stats.weeks).toHaveLength(8)
    expect(stats.weeks.map(w => w.week)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(stats.weeks[0]).toEqual({ week: 1, done: completed.size, total: REQUIRED_TASKS.filter(t => t.week === 1).length })
    expect(stats.weeks[1]!.done).toBe(0)
    expect(stats.weeks.reduce((sum, w) => sum + w.total, 0)).toBe(stats.total)
  })

  it('sums minutes of completed tasks of the current week including optional', () => {
    const week1 = ALL_TASKS.filter(t => t.week === 1)
    const required = week1.find(t => !t.optional)!
    const optional = week1.find(t => t.optional)!
    const other = ALL_TASKS.find(t => t.week === 2)!
    const stats = computeStats(START, '2026-10-21', new Set([required.key, optional.key, other.key]))
    expect(stats.minutesThisWeek).toBe(required.minutes + optional.minutes)
  })

  it('sums only required minutes as planned for the current week', () => {
    expect(computeStats(START, '2026-10-21', new Set()).plannedMinutesThisWeek).toBe(plannedMinutes(1))
  })

  it('follows the current week for minutes', () => {
    const task = ALL_TASKS.find(t => t.week === 3 && !t.optional)!
    const stats = computeStats(START, '2026-11-02', new Set([task.key]))
    expect(stats.position.week).toBe(3)
    expect(stats.minutesThisWeek).toBe(task.minutes)
    expect(stats.plannedMinutesThisWeek).toBe(plannedMinutes(3))
  })

  it('includes position and streak', () => {
    const stats = computeStats(START, '2026-10-20', requiredKeys(1, [0, 1]))
    expect(stats.position).toMatchObject({ phase: 'active', week: 1, day: 1 })
    expect(stats.streak).toBe(2)
  })
})
