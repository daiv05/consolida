<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Prompts IA' })

const tracker = useTracker()
const selected = ref(1)
const copied = ref<string | null>(null)
const error = ref('')

onMounted(async () => {
  try {
    await tracker.load()
    selected.value = tracker.stats.value?.position.week ?? 1
  }
  catch (e) {
    error.value = apiErrorMessage(e)
  }
})

const week = computed(() => WEEKS[selected.value - 1]!)
const mistakes = computed(() => tracker.latestMistakes(selected.value - 1).length ? tracker.latestMistakes(selected.value - 1) : tracker.latestMistakes(selected.value))
const prompts = computed(() => buildPrompts(week.value, mistakes.value))

/**
 * Copies a prompt to the clipboard, falling back to selecting its text.
 *
 * @param {string} id Prompt id.
 * @param {string} text Prompt text.
 */
async function copy(id: string, text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = id
    setTimeout(() => { if (copied.value === id) copied.value = null }, 1800)
  }
  catch {
    const el = document.getElementById(`prompt-${id}`)
    if (el) {
      const range = document.createRange()
      range.selectNodeContents(el)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }
}
</script>

<template>
  <div class="stack-lg">
    <header class="stack">
      <h1>Prompts para la IA</h1>
      <p class="muted intro">Se adaptan a la estructura y el tema de la semana. El prompt de speaking incluye los errores que anotaste en tu último diario. Están en inglés a propósito: leerlos también es práctica.</p>
      <div class="row">
        <label for="week" class="eyebrow">Semana</label>
        <select id="week" v-model.number="selected" class="narrow">
          <option v-for="w in WEEKS" :key="w.number" :value="w.number">{{ w.number }} · {{ w.focus }}</option>
        </select>
      </div>
      <p v-if="mistakes.length" class="small">Errores incluidos: <span v-for="(m, i) in mistakes" :key="i" class="chip">{{ m }}</span></p>
      <p v-else class="small muted">Aún no hay errores en tu diario. Anótalos el domingo en el <NuxtLink to="/app/plan">Plan</NuxtLink> y aparecerán aquí.</p>
    </header>
    <p v-if="error" class="alert error" role="alert">{{ error }}</p>
    <article v-for="p in prompts" :key="p.id" class="card stack">
      <div class="row between">
        <h2 class="h3">{{ p.title }}</h2>
        <button class="btn small" :class="{ ok: copied === p.id }" type="button" @click="copy(p.id, p.text)">{{ copied === p.id ? 'Copiado' : 'Copiar' }}</button>
      </div>
      <p class="small muted">{{ p.when }}</p>
      <pre :id="`prompt-${p.id}`" class="mono">{{ p.text }}</pre>
    </article>
  </div>
</template>

<style scoped>
.intro { max-width: 66ch; }
.between { justify-content: space-between; }
.narrow { width: auto; }
.h3 { font-size: 1.15rem; }
.chip { margin: 0 4px 4px 0; display: inline-block; }
pre { margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 0.84rem; line-height: 1.6; background: var(--paper); border-radius: 8px; padding: 14px 16px; }
.btn.ok { background: var(--ok); border-color: var(--ok); }
</style>
