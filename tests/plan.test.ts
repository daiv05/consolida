import { describe, expect, it } from 'vitest'
import { ALL_TASKS, PLAN_LENGTH_WEEKS, REQUIRED_TASKS, TASKS_BY_KEY, WEEKS, buildWeekTasks, normaliseStartDate, taskDate } from '../shared/utils/plan'
import { RESOURCES } from '../shared/utils/resources'
import { addDays } from '../shared/utils/dates'

const START = '2026-10-19'

describe('WEEKS', () => {
  it('contains 8 weeks numbered 1 to 8', () => {
    expect(PLAN_LENGTH_WEEKS).toBe(8)
    expect(WEEKS.map(w => w.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('has checkpoints on weeks 4 and 8', () => {
    expect(WEEKS[3]!.checkpoint).toBeTruthy()
    expect(WEEKS[7]!.checkpoint).toBeTruthy()
  })

  it('has no checkpoints elsewhere', () => {
    const others = WEEKS.filter(w => w.number !== 4 && w.number !== 8)
    expect(others.every(w => !w.checkpoint)).toBe(true)
  })
})

describe('tasks', () => {
  it('has unique keys with the expected format', () => {
    const keys = ALL_TASKS.map(t => t.key)
    expect(new Set(keys).size).toBe(keys.length)
    for (const key of keys) expect(key).toMatch(/^w[1-8]\.d[0-6]\.[a-z]+$/)
  })

  it('indexes every task by key', () => {
    expect(TASKS_BY_KEY.size).toBe(ALL_TASKS.length)
    for (const task of ALL_TASKS) expect(TASKS_BY_KEY.get(task.key)).toBe(task)
  })

  it('keeps key consistent with week and day', () => {
    for (const task of ALL_TASKS) expect(task.key.startsWith(`w${task.week}.d${task.day}.`)).toBe(true)
  })

  it('only links to existing resources', () => {
    const known = new Set(Object.keys(RESOURCES))
    for (const task of ALL_TASKS) {
      for (const link of task.links) expect(known.has(link)).toBe(true)
    }
  })

  it('has required tasks on days 0-4 and 6 of every week', () => {
    for (const week of WEEKS) {
      const tasks = buildWeekTasks(week)
      for (const day of [0, 1, 2, 3, 4, 6]) {
        const required = tasks.filter(t => t.day === day && !t.optional)
        expect(required.length, `week ${week.number} day ${day}`).toBeGreaterThan(0)
      }
    }
  })

  it('makes every day 5 task optional and every other task required', () => {
    for (const task of ALL_TASKS) {
      expect(task.optional).toBe(task.day === 5)
    }
    for (const week of WEEKS) {
      expect(buildWeekTasks(week).some(t => t.day === 5)).toBe(true)
    }
  })

  it('adds conversation tasks only on conversation weeks', () => {
    for (const week of WEEKS) {
      const hasTalk = buildWeekTasks(week).some(t => t.key === `w${week.number}.d5.talk`)
      expect(hasTalk).toBe(week.conversation)
    }
  })

  it('exposes required tasks as the non optional subset', () => {
    expect(REQUIRED_TASKS.every(t => !t.optional)).toBe(true)
    expect(REQUIRED_TASKS.length).toBe(ALL_TASKS.filter(t => !t.optional).length)
  })
})

describe('taskDate', () => {
  it('places week 1 day 0 on the start date', () => {
    expect(taskDate(START, { week: 1, day: 0 })).toBe(START)
  })

  it('places week 8 day 6 fifty-five days after the start', () => {
    expect(taskDate(START, { week: 8, day: 6 })).toBe(addDays(START, 55))
    expect(taskDate(START, { week: 8, day: 6 })).toBe('2026-12-13')
  })

  it('places week 2 day 0 seven days after the start', () => {
    expect(taskDate(START, { week: 2, day: 0 })).toBe('2026-10-26')
  })
})

describe('normaliseStartDate', () => {
  it('moves a Wednesday to its Monday', () => {
    expect(normaliseStartDate('2026-10-21')).toBe(START)
  })

  it('keeps a Monday', () => {
    expect(normaliseStartDate(START)).toBe(START)
  })
})
