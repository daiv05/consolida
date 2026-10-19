<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Plan' })

const tracker = useTracker()
const route = useRoute()
const loadError = ref('')
const toggleError = ref('')
const openWeeks = ref<Set<number>>(new Set())

onMounted(async () => {
  try {
    await tracker.load()
  }
  catch (e) {
    loadError.value = apiErrorMessage(e)
    return
  }
  const fromHash = Number(/^#semana-(\d)$/.exec(route.hash)?.[1])
  const target = fromHash || tracker.stats.value?.position.week || 1
  openWeeks.value = new Set([target])
  await nextTick()
  if (fromHash) document.getElementById(`semana-${fromHash}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

/**
 * Keeps the set of open weeks in sync with the details elements.
 *
 * @param {number} week Week number.
 * @param {boolean} open Whether it is now open.
 */
function onToggle(week: number, open: boolean) {
  const next = new Set(openWeeks.value)
  if (open) next.add(week)
  else next.delete(week)
  openWeeks.value = next
}
</script>

<template>
  <div class="stack-lg">
    <header class="stack">
      <h1>Plan de 8 semanas</h1>
      <p class="muted intro">Cada semana gira en torno a una estructura. Si pierdes un día no lo recuperes: sigue con el siguiente.</p>
      <div v-if="tracker.stats.value" class="row">
        <div class="bar grow"><span :style="{ width: `${tracker.stats.value.percent}%` }" /></div>
        <span class="mono small">{{ tracker.stats.value.done }} de {{ tracker.stats.value.total }} tareas</span>
      </div>
    </header>
    <p v-if="loadError" class="alert error" role="alert">{{ loadError }}</p>
    <p v-if="toggleError" class="alert error" role="alert">{{ toggleError }}</p>
    <p v-if="!tracker.profile.value && !loadError" class="muted">Cargando…</p>
    <div v-else-if="tracker.profile.value" class="weeks">
      <WeekPanel
        v-for="week in WEEKS"
        :key="week.number"
        :week="week"
        :open="openWeeks.has(week.number)"
        :current="tracker.stats.value?.position.phase === 'active' && tracker.stats.value?.position.week === week.number"
        @toggle="onToggle(week.number, $event)"
        @error="toggleError = $event"
      />
    </div>
  </div>
</template>

<style scoped>
.intro { max-width: 64ch; }
.grow { flex: 1 1 220px; }
.weeks { display: grid; gap: 12px; }
</style>
