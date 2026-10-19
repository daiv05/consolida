import { addDays, diffDays } from './dates'
import { ALL_TASKS, PLAN_LENGTH_WEEKS, REQUIRED_TASKS, taskDate, type PlanTask } from './plan'

export type PlanPhase = 'upcoming' | 'active' | 'finished'

export interface PlanPosition {
  phase: PlanPhase
  week: number
  day: number
  daysUntilStart: number
}

export interface WeekProgress {
  week: number
  done: number
  total: number
}

export interface PlanStats {
  position: PlanPosition
  done: number
  total: number
  percent: number
  streak: number
  overdue: number
  weeks: WeekProgress[]
  minutesThisWeek: number
  plannedMinutesThisWeek: number
}

/**
 * Locates a date within the plan calendar.
 *
 * @param {string} startDate Monday the plan starts, YYYY-MM-DD.
 * @param {string} today Reference date, YYYY-MM-DD.
 * @returns {PlanPosition} Phase plus the 1-based week and 0-based weekday, clamped to the plan.
 */
export function planPosition(startDate: string, today: string): PlanPosition {
  const offset = diffDays(startDate, today)
  if (offset < 0) return { phase: 'upcoming', week: 1, day: 0, daysUntilStart: -offset }
  if (offset >= PLAN_LENGTH_WEEKS * 7) return { phase: 'finished', week: PLAN_LENGTH_WEEKS, day: 6, daysUntilStart: 0 }
  return { phase: 'active', week: Math.floor(offset / 7) + 1, day: offset % 7, daysUntilStart: 0 }
}

/**
 * Counts consecutive scheduled days, ending today or yesterday, on which at least one required task was completed.
 * Days with no required tasks are skipped, and today does not break the streak until it is over.
 *
 * @param {string} startDate Monday the plan starts, YYYY-MM-DD.
 * @param {string} today Reference date, YYYY-MM-DD.
 * @param {ReadonlySet<string>} completed Keys of completed tasks.
 * @returns {number} Length of the current streak in days.
 */
export function computeStreak(startDate: string, today: string, completed: ReadonlySet<string>): number {
  const byDate = new Map<string, PlanTask[]>()
  for (const task of REQUIRED_TASKS) {
    const date = taskDate(startDate, task)
    const list = byDate.get(date)
    if (list) list.push(task)
    else byDate.set(date, [task])
  }

  let streak = 0
  let cursor = today
  const last = addDays(startDate, PLAN_LENGTH_WEEKS * 7 - 1)
  if (diffDays(last, cursor) > 0) cursor = last

  while (diffDays(startDate, cursor) >= 0) {
    const tasks = byDate.get(cursor)
    if (tasks) {
      const hit = tasks.some(task => completed.has(task.key))
      if (hit) streak++
      else if (cursor !== today) break
    }
    cursor = addDays(cursor, -1)
  }
  return streak
}

/**
 * Computes every progress figure shown on the dashboard.
 *
 * @param {string} startDate Monday the plan starts, YYYY-MM-DD.
 * @param {string} today Reference date, YYYY-MM-DD.
 * @param {ReadonlySet<string>} completed Keys of completed tasks.
 * @returns {PlanStats} Aggregated progress.
 */
export function computeStats(startDate: string, today: string, completed: ReadonlySet<string>): PlanStats {
  const position = planPosition(startDate, today)
  const weeks: WeekProgress[] = Array.from({ length: PLAN_LENGTH_WEEKS }, (_, i) => ({ week: i + 1, done: 0, total: 0 }))

  let done = 0
  let overdue = 0
  for (const task of REQUIRED_TASKS) {
    const bucket = weeks[task.week - 1]!
    bucket.total++
    if (completed.has(task.key)) {
      bucket.done++
      done++
    }
    else if (diffDays(taskDate(startDate, task), today) > 0) {
      overdue++
    }
  }

  let minutesThisWeek = 0
  let plannedMinutesThisWeek = 0
  for (const task of ALL_TASKS) {
    if (task.week !== position.week) continue
    if (!task.optional) plannedMinutesThisWeek += task.minutes
    if (completed.has(task.key)) minutesThisWeek += task.minutes
  }

  const total = REQUIRED_TASKS.length
  return {
    position,
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
    streak: computeStreak(startDate, today, completed),
    overdue,
    weeks,
    minutesThisWeek,
    plannedMinutesThisWeek,
  }
}
