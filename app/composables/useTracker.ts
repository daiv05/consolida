import type { CefrLevel } from '#shared/utils/cefr'

export interface Profile {
  id: number
  name: string
  email: string
  startDate: string
  createdAt: string
}

export interface Journal {
  week: number
  mistakes: string[]
  cefr: CefrLevel | null
  notes: string
  updatedAt?: string
}

/**
 * Shared client state for the signed-in learner: profile, completed tasks and weekly journals.
 *
 * @returns Reactive state plus actions to load and mutate it.
 */
export function useTracker() {
  const profile = useState<Profile | null>('tracker:profile', () => null)
  const completed = useState<string[]>('tracker:completed', () => [])
  const journals = useState<Record<number, Journal>>('tracker:journals', () => ({}))
  const loaded = useState<boolean>('tracker:loaded', () => false)
  const today = useState<string>('tracker:today', () => localIsoDate())

  const completedSet = computed(() => new Set(completed.value))
  const stats = computed(() => profile.value ? computeStats(profile.value.startDate, today.value, completedSet.value) : null)

  /**
   * Loads profile, progress and journals from the API.
   *
   * @param {boolean} [force] Reload even when data is already present.
   */
  async function load(force = false): Promise<void> {
    today.value = localIsoDate()
    if (loaded.value && !force) return
    const [me, progress, notes] = await Promise.all([
      $fetch<Profile>('/api/me'),
      $fetch<{ taskKey: string }[]>('/api/progress'),
      $fetch<Journal[]>('/api/journals'),
    ])
    profile.value = me
    completed.value = progress.map(p => p.taskKey)
    journals.value = Object.fromEntries(notes.map(j => [j.week, j]))
    loaded.value = true
  }

  /**
   * Marks a task as done or pending, updating the UI before the server confirms.
   *
   * @param {string} key Task key.
   * @param {boolean} done New state.
   */
  async function setDone(key: string, done: boolean): Promise<void> {
    const previous = completed.value
    completed.value = done ? [...new Set([...previous, key])] : previous.filter(k => k !== key)
    try {
      await $fetch(`/api/progress/${encodeURIComponent(key)}`, { method: 'PUT', body: { done } })
    }
    catch (error) {
      completed.value = previous
      throw error
    }
  }

  /**
   * Saves the weekly journal.
   *
   * @param {Journal} journal Journal content.
   * @returns {Promise<Journal>} Saved journal.
   */
  async function saveJournal(journal: Journal): Promise<Journal> {
    const saved = await $fetch<Journal>(`/api/journals/${journal.week}`, {
      method: 'PUT',
      body: { mistakes: journal.mistakes, cefr: journal.cefr, notes: journal.notes },
    })
    journals.value = { ...journals.value, [saved.week]: saved }
    return saved
  }

  /**
   * Returns the most recent recurring mistakes noted up to a given week.
   *
   * @param {number} week Week to look back from, inclusive.
   * @returns {string[]} Mistakes, empty when none were noted.
   */
  function latestMistakes(week: number): string[] {
    for (let w = week; w >= 1; w--) {
      const list = journals.value[w]?.mistakes.filter(m => m.trim())
      if (list?.length) return list
    }
    return []
  }

  /**
   * Clears all cached learner data, used on sign-out.
   */
  function reset(): void {
    profile.value = null
    completed.value = []
    journals.value = {}
    loaded.value = false
  }

  return { profile, completed, completedSet, journals, loaded, today, stats, load, setDone, saveJournal, latestMistakes, reset }
}
