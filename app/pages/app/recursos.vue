<script setup lang="ts">
import { RESOURCE_CATEGORIES, type Resource, type ResourceCategory } from '#shared/utils/resources'

definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Recursos' })

const groups = computed(() => (Object.keys(RESOURCE_CATEGORIES) as ResourceCategory[]).map(category => ({
  category,
  label: RESOURCE_CATEGORIES[category],
  items: (Object.entries(RESOURCES) as [ResourceKey, Resource][]).filter(([key, r]) => r.category === category && !GRAMMAR_ONLY.has(key)),
})))
</script>

<template>
  <div class="stack-lg">
    <header class="stack">
      <h1>Recursos</h1>
      <p class="muted intro">Todos gratuitos, salvo iTalki. El nivel indica dónde empieza a ser cómodo: si entiendes menos del 80 % sin subtítulos, baja un nivel.</p>
    </header>
    <div class="grid">
      <section v-for="g in groups" :key="g.category" class="col">
        <h2 class="h3">{{ g.label }}</h2>
        <div v-for="[key, r] in g.items" :key="key" class="res">
          <a :href="r.url" target="_blank" rel="noopener">{{ r.name }}</a>
          <span class="mono tiny muted">{{ r.level }}</span>
          <p class="small muted">{{ r.description }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.intro { max-width: 64ch; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px; }
.col { display: grid; gap: 4px; align-content: start; }
.h3 { font-size: 1.15rem; padding-bottom: 8px; border-bottom: 2px solid var(--ink); }
.res { display: grid; gap: 2px; padding: 10px 0; border-bottom: 1px solid var(--rule); }
.res a { font-weight: 700; }
.tiny { font-size: 0.72rem; }
</style>
