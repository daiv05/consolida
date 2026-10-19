<script setup lang="ts">
import type { PlanWeek } from '#shared/utils/plan'

const props = defineProps<{ week: PlanWeek, open: boolean, current: boolean }>()
const emit = defineEmits<{ toggle: [open: boolean], error: [message: string] }>()
const tracker = useTracker()

const tasks = computed(() => buildWeekTasks(props.week))
const required = computed(() => tasks.value.filter(t => !t.optional))
const doneCount = computed(() => required.value.filter(t => tracker.completedSet.value.has(t.key)).length)
const start = computed(() => taskDate(tracker.profile.value!.startDate, { week: props.week.number, day: 0 }))
const days = computed(() => DAY_LONG.map((name, day) => ({
  day,
  name,
  date: addDays(start.value, day),
  tasks: tasks.value.filter(t => t.day === day),
})))

/**
 * Toggles a task and surfaces failures to the parent.
 *
 * @param {string} key Task key.
 * @param {boolean} done New state.
 */
async function toggle(key: string, done: boolean) {
  try {
    await tracker.setDone(key, done)
  }
  catch (error) {
    emit('error', apiErrorMessage(error))
  }
}
</script>

<template>
  <details :id="`semana-${week.number}`" class="week" :class="{ current }" :open="open" @toggle="emit('toggle', ($event.target as HTMLDetailsElement).open)">
    <summary>
      <span class="num">{{ week.number }}</span>
      <span class="title">
        <span class="focus">{{ week.focus }}</span>
        <span class="dates mono">{{ formatShort(start) }} – {{ formatShort(addDays(start, 6)) }} · {{ week.topic }}</span>
      </span>
      <span class="count mono">{{ doneCount }}/{{ required.length }}</span>
    </summary>
    <div class="body">
      <div class="meta small">
        <span><b>Gramática:</b> <ResourceLinks :keys="week.grammar" /></span>
        <span><b>Segmentos:</b> {{ week.segments }}</span>
      </div>
      <p v-if="week.checkpoint" class="checkpoint small"><b>Checkpoint del domingo.</b> {{ week.checkpoint }}</p>
      <div class="days">
        <div v-for="d in days" :key="d.day" class="day" :class="{ today: d.date === tracker.today.value }">
          <div class="label">
            <span class="dname">{{ d.name }}</span>
            <span class="ddate mono">{{ formatShort(d.date) }}</span>
          </div>
          <div class="tasks">
            <TaskItem v-for="task in d.tasks" :key="task.key" :task="task" :done="tracker.completedSet.value.has(task.key)" @toggle="toggle(task.key, $event)" />
          </div>
        </div>
      </div>
      <JournalForm :week="week.number" />
    </div>
  </details>
</template>

<style scoped>
.week { background: var(--sheet); border: 1px solid var(--rule); border-radius: var(--radius); scroll-margin-top: 120px; }
.week[open] { border-color: var(--ink); }
.week.current { box-shadow: 0 0 0 3px var(--marker); }
summary { list-style: none; cursor: pointer; padding: 16px 20px; display: grid; grid-template-columns: auto 1fr auto; gap: 4px 16px; align-items: center; }
summary::-webkit-details-marker { display: none; }
.num { font-family: var(--f-display); font-weight: 800; font-size: 2rem; line-height: 1; }
.title { display: grid; gap: 2px; min-width: 0; }
.focus { font-family: var(--f-display); font-weight: 700; font-size: 1.1rem; }
.dates { font-size: 0.78rem; color: var(--ink-soft); }
.count { font-size: 0.82rem; color: var(--ink-soft); }
.body { padding: 0 20px 20px; display: grid; gap: 16px; }
.meta { display: flex; flex-wrap: wrap; gap: 8px 20px; color: var(--ink-soft); }
.meta b { color: var(--ink); }
.meta span { display: inline-flex; flex-wrap: wrap; gap: 6px; align-items: baseline; }
.checkpoint { border: 2px dashed var(--redpen); border-radius: 8px; padding: 10px 14px; }
.checkpoint b { color: var(--redpen); }
.days { display: grid; border-top: 1px solid var(--rule); }
.day { display: grid; grid-template-columns: 6.5rem 1fr; gap: 14px; padding: 14px 0; border-bottom: 1px dashed var(--rule); }
.day:last-child { border-bottom: 0; }
.label { display: grid; gap: 2px; align-content: start; }
.dname { font-family: var(--f-display); font-weight: 700; }
.ddate { font-size: 0.75rem; color: var(--ink-soft); }
.today .dname { background: var(--marker); color: var(--marker-ink); border-radius: 4px; padding: 0 6px; justify-self: start; }
.tasks { display: grid; gap: 12px; min-width: 0; }
@media (max-width: 560px) {
  summary { grid-template-columns: auto 1fr; padding: 14px 16px; }
  .count { grid-column: 2; }
  .body { padding: 0 16px 16px; }
  .day { grid-template-columns: 1fr; gap: 8px; }
  .label { grid-auto-flow: column; justify-content: start; gap: 10px; align-items: baseline; }
}
</style>
