<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Hoy' })

const tracker = useTracker()
const { profile, stats, today } = tracker
const loadError = ref('')
const toggleError = ref('')

onMounted(async () => {
  try {
    await tracker.load()
  }
  catch (e) {
    loadError.value = apiErrorMessage(e)
  }
})

const week = computed(() => stats.value ? WEEKS[stats.value.position.week - 1]! : null)
const todayTasks = computed(() => {
  if (!stats.value || stats.value.position.phase !== 'active') return []
  const { week: w, day } = stats.value.position
  return ALL_TASKS.filter(t => t.week === w && t.day === day)
})
const overdueTasks = computed(() => {
  if (!profile.value) return []
  return REQUIRED_TASKS.filter(t => !tracker.completedSet.value.has(t.key) && diffDays(taskDate(profile.value!.startDate, t), today.value) > 0)
})
const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
})

/**
 * Toggles a task from the dashboard.
 *
 * @param {string} key Task key.
 * @param {boolean} done New state.
 */
async function toggle(key: string, done: boolean) {
  toggleError.value = ''
  try {
    await tracker.setDone(key, done)
  }
  catch (e) {
    toggleError.value = apiErrorMessage(e)
  }
}
</script>

<template>
  <div class="stack-lg">
    <p v-if="loadError" class="alert error" role="alert">{{ loadError }}</p>
    <p v-else-if="!stats || !profile || !week" class="muted">Cargando tu plan…</p>

    <template v-else>
      <header class="stack">
        <span class="eyebrow">{{ DAY_LONG[mondayIndex(today)] }} {{ formatShort(today) }}</span>
        <h1>{{ greeting }}, {{ profile.name }}</h1>
        <p v-if="stats.position.phase === 'upcoming'" class="muted">Tu plan empieza el lunes {{ formatShort(profile.startDate) }}, dentro de {{ stats.position.daysUntilStart }} {{ stats.position.daysUntilStart === 1 ? 'día' : 'días' }}. Echa un vistazo a la <NuxtLink to="/app/plan">semana 1</NuxtLink> y deja Anki instalado.</p>
        <p v-else-if="stats.position.phase === 'finished'" class="muted">Terminaste las 8 semanas. Compara tus grabaciones de las semanas 4 y 8, y si quieres repetir el ciclo cambia la fecha de inicio en <NuxtLink to="/app/ajustes">Ajustes</NuxtLink>.</p>
        <p v-else class="muted">Semana {{ week.number }} de 8 · <b class="ink">{{ week.focus }}</b> · tema: {{ week.topic }}.</p>
      </header>

      <section class="tiles">
        <div class="tile card">
          <span class="eyebrow">Progreso</span>
          <span class="big mono">{{ stats.percent }}<small>%</small></span>
          <div class="bar"><span :style="{ width: `${stats.percent}%` }" /></div>
          <span class="small muted">{{ stats.done }} de {{ stats.total }} tareas</span>
        </div>
        <div class="tile card">
          <span class="eyebrow">Racha</span>
          <span class="big mono">{{ stats.streak }}</span>
          <span class="small muted">{{ stats.streak === 1 ? 'día seguido' : 'días seguidos' }} con al menos una tarea</span>
        </div>
        <div class="tile card">
          <span class="eyebrow">Esta semana</span>
          <span class="big mono">{{ stats.minutesThisWeek }}<small> / {{ stats.plannedMinutesThisWeek }} min</small></span>
          <div class="bar"><span :style="{ width: `${Math.min(100, stats.plannedMinutesThisWeek ? stats.minutesThisWeek / stats.plannedMinutesThisWeek * 100 : 0)}%` }" /></div>
        </div>
        <div class="tile card" :class="{ warn: stats.overdue > 0 }">
          <span class="eyebrow">Atrasadas</span>
          <span class="big mono">{{ stats.overdue }}</span>
          <span class="small muted">{{ stats.overdue ? 'No las recuperes todas: sigue con hoy.' : 'Vas al día.' }}</span>
        </div>
      </section>

      <section v-if="stats.position.phase === 'active'" class="card stack">
        <div class="row between">
          <h2>Hoy</h2>
          <NuxtLink :to="`/app/plan#semana-${week.number}`" class="small">Ver semana completa</NuxtLink>
        </div>
        <p v-if="toggleError" class="alert error" role="alert">{{ toggleError }}</p>
        <p v-if="!todayTasks.length" class="muted">No hay tareas para hoy.</p>
        <TaskItem v-for="task in todayTasks" :key="task.key" :task="task" :done="tracker.completedSet.value.has(task.key)" @toggle="toggle(task.key, $event)" />
        <p v-if="week.checkpoint && stats.position.day === 6" class="checkpoint small"><b>Checkpoint de hoy.</b> {{ week.checkpoint }}</p>
        <p v-if="stats.position.day >= 4" class="small muted">No olvides el <NuxtLink :to="`/app/plan#semana-${week.number}`">diario de la semana</NuxtLink>: nivel de Write &amp; Improve y tus 3 errores.</p>
      </section>

      <section class="card stack">
        <h2>Las 8 semanas</h2>
        <div class="weeks">
          <NuxtLink v-for="w in stats.weeks" :key="w.week" :to="`/app/plan#semana-${w.week}`" class="wk" :class="{ now: stats.position.phase === 'active' && w.week === stats.position.week }">
            <span class="col"><span :style="{ height: `${w.total ? w.done / w.total * 100 : 0}%` }" /></span>
            <span class="mono small">S{{ w.week }}</span>
            <span class="mono tiny muted">{{ w.done }}/{{ w.total }}</span>
          </NuxtLink>
        </div>
      </section>

      <section v-if="overdueTasks.length" class="card stack">
        <h2>Pendientes de días anteriores</h2>
        <p class="small muted">Marca las que hiciste y no registraste. Las demás, déjalas ir.</p>
        <TaskItem v-for="task in overdueTasks.slice(-6)" :key="task.key" :task="task" compact :done="false" @toggle="toggle(task.key, $event)" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.ink { color: var(--ink); }
.between { justify-content: space-between; }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.tile { display: grid; gap: 8px; align-content: start; }
.tile.warn { border-color: var(--redpen); }
.big { font-family: var(--f-display); font-weight: 800; font-size: 2.4rem; line-height: 1; }
.big small { font-size: 0.95rem; font-weight: 500; color: var(--ink-soft); }
.checkpoint { border: 2px dashed var(--redpen); border-radius: 8px; padding: 10px 14px; }
.checkpoint b { color: var(--redpen); }
.weeks { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 10px; }
.wk { display: grid; justify-items: center; gap: 4px; text-decoration: none; color: var(--ink); padding: 6px 0; border-radius: 8px; }
.wk:hover { background: var(--paper); }
.wk.now { outline: 3px solid var(--marker); }
.col { width: 100%; max-width: 36px; height: 96px; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; display: flex; align-items: flex-end; overflow: hidden; }
.col span { display: block; width: 100%; background: var(--ink); transition: height 0.5s ease; }
.tiny { font-size: 0.7rem; }
</style>
