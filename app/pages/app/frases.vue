<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Frases' })

interface Phrase { id: number, week: number, text: string, meaning: string, source: string, createdAt: string }

const tracker = useTracker()
const phrases = ref<Phrase[]>([])
const loading = ref(true)
const error = ref('')
const filter = ref<number | 0>(0)
const form = reactive({ week: 1, text: '', meaning: '', source: '' })
const saving = ref(false)
const editing = ref<number | null>(null)
const draft = reactive({ week: 1, text: '', meaning: '', source: '' })
const confirmDelete = ref<number | null>(null)

onMounted(async () => {
  try {
    await tracker.load()
    form.week = tracker.stats.value?.position.week ?? 1
    phrases.value = await $fetch<Phrase[]>('/api/phrases')
  }
  catch (e) {
    error.value = apiErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})

const visible = computed(() => filter.value ? phrases.value.filter(p => p.week === filter.value) : phrases.value)

/**
 * Adds a new phrase to the top of the list.
 */
async function add() {
  saving.value = true
  error.value = ''
  try {
    const created = await $fetch<Phrase>('/api/phrases', { method: 'POST', body: { ...form } })
    phrases.value = [created, ...phrases.value]
    form.text = ''
    form.meaning = ''
    form.source = ''
    document.getElementById('phrase-text')?.focus()
  }
  catch (e) {
    error.value = apiErrorMessage(e)
  }
  finally {
    saving.value = false
  }
}

/**
 * Opens the inline editor for a phrase.
 *
 * @param {Phrase} phrase Phrase to edit.
 */
function startEdit(phrase: Phrase) {
  editing.value = phrase.id
  Object.assign(draft, { week: phrase.week, text: phrase.text, meaning: phrase.meaning, source: phrase.source })
}

/**
 * Saves the inline edit.
 *
 * @param {number} id Phrase id.
 */
async function saveEdit(id: number) {
  error.value = ''
  try {
    const updated = await $fetch<Phrase>(`/api/phrases/${id}`, { method: 'PATCH', body: { ...draft } })
    phrases.value = phrases.value.map(p => p.id === id ? updated : p)
    editing.value = null
  }
  catch (e) {
    error.value = apiErrorMessage(e)
  }
}

/**
 * Deletes a phrase after the inline confirmation.
 *
 * @param {number} id Phrase id.
 */
async function remove(id: number) {
  error.value = ''
  try {
    await $fetch(`/api/phrases/${id}`, { method: 'DELETE' })
    phrases.value = phrases.value.filter(p => p.id !== id)
    confirmDelete.value = null
  }
  catch (e) {
    error.value = apiErrorMessage(e)
  }
}
</script>

<template>
  <div class="stack-lg">
    <header class="stack">
      <h1>Frases para Anki</h1>
      <p class="muted intro">Guarda 5 frases completas por semana, sacadas de tus audios y correcciones. Luego expórtalas: en Anki, Archivo → Importar.</p>
    </header>

    <form class="card stack" @submit.prevent="add">
      <h2>Nueva frase</h2>
      <div class="grid">
        <div class="field wide">
          <label for="phrase-text">Frase en inglés</label>
          <input id="phrase-text" v-model="form.text" type="text" maxlength="300" placeholder="I was walking home when it started to rain." required>
        </div>
        <div class="field">
          <label for="phrase-week">Semana</label>
          <select id="phrase-week" v-model.number="form.week">
            <option v-for="w in WEEKS" :key="w.number" :value="w.number">{{ w.number }} · {{ w.focus }}</option>
          </select>
        </div>
        <div class="field">
          <label for="phrase-meaning">Significado o nota</label>
          <input id="phrase-meaning" v-model="form.meaning" type="text" maxlength="300" placeholder="Iba caminando a casa cuando empezó a llover.">
        </div>
        <div class="field">
          <label for="phrase-source">Fuente</label>
          <input id="phrase-source" v-model="form.source" type="text" maxlength="200" placeholder="Easy Stories, episodio 12">
        </div>
      </div>
      <div class="row">
        <button class="btn" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : 'Guardar frase' }}</button>
      </div>
    </form>

    <p v-if="error" class="alert error" role="alert">{{ error }}</p>

    <section class="stack">
      <div class="row between">
        <div class="row">
          <label for="filter" class="eyebrow">Mostrar</label>
          <select id="filter" v-model.number="filter" class="narrow">
            <option :value="0">Todas las semanas</option>
            <option v-for="w in WEEKS" :key="w.number" :value="w.number">Semana {{ w.number }}</option>
          </select>
          <span class="mono small muted">{{ visible.length }} {{ visible.length === 1 ? 'frase' : 'frases' }}</span>
        </div>
        <a v-if="phrases.length" class="btn ghost small" href="/api/phrases/anki" download>Exportar para Anki</a>
      </div>

      <p v-if="loading" class="muted">Cargando…</p>
      <p v-else-if="!visible.length" class="card muted">Todavía no hay frases {{ filter ? `en la semana ${filter}` : '' }}. Guarda la primera arriba.</p>
      <ul v-else class="list">
        <li v-for="p in visible" :key="p.id" class="card item">
          <template v-if="editing === p.id">
            <form class="stack" @submit.prevent="saveEdit(p.id)">
              <input v-model="draft.text" type="text" maxlength="300" aria-label="Frase" required>
              <input v-model="draft.meaning" type="text" maxlength="300" aria-label="Significado">
              <input v-model="draft.source" type="text" maxlength="200" aria-label="Fuente">
              <select v-model.number="draft.week" aria-label="Semana">
                <option v-for="w in WEEKS" :key="w.number" :value="w.number">Semana {{ w.number }}</option>
              </select>
              <div class="row">
                <button class="btn small" type="submit">Guardar</button>
                <button class="btn ghost small" type="button" @click="editing = null">Cancelar</button>
              </div>
            </form>
          </template>
          <template v-else>
            <div class="content">
              <p class="text">{{ p.text }}</p>
              <p v-if="p.meaning" class="small muted">{{ p.meaning }}</p>
              <p class="mono tiny muted">Semana {{ p.week }}<span v-if="p.source"> · {{ p.source }}</span></p>
            </div>
            <div class="actions">
              <template v-if="confirmDelete === p.id">
                <span class="small">¿Borrar?</span>
                <button class="btn danger small" type="button" @click="remove(p.id)">Sí, borrar</button>
                <button class="btn ghost small" type="button" @click="confirmDelete = null">No</button>
              </template>
              <template v-else>
                <button class="btn ghost small" type="button" @click="startEdit(p)">Editar</button>
                <button class="btn ghost small" type="button" @click="confirmDelete = p.id">Borrar</button>
              </template>
            </div>
          </template>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.intro { max-width: 64ch; }
.between { justify-content: space-between; }
.grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 14px; }
.narrow { width: auto; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.item { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; padding: 14px 18px; }
.content { display: grid; gap: 2px; min-width: 0; flex: 1 1 280px; }
.text { font-weight: 700; font-size: 1.05rem; }
.tiny { font-size: 0.75rem; }
.actions { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.item form { flex: 1 1 100%; }
@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
</style>
