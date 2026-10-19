<script setup lang="ts">
const props = defineProps<{ week: number }>()
const tracker = useTracker()

const current = computed(() => tracker.journals.value[props.week])
const mistakes = ref<string[]>(['', '', ''])
const cefr = ref<CefrLevel | ''>('')
const notes = ref('')
const status = ref<{ kind: 'ok' | 'error', text: string } | null>(null)
const saving = ref(false)

watch(current, (journal) => {
  mistakes.value = [0, 1, 2].map(i => journal?.mistakes[i] ?? '')
  cefr.value = journal?.cefr ?? ''
  notes.value = journal?.notes ?? ''
}, { immediate: true })

/**
 * Persists the journal and reports the result inline.
 */
async function save() {
  saving.value = true
  status.value = null
  try {
    await tracker.saveJournal({ week: props.week, mistakes: mistakes.value.map(m => m.trim()).filter(Boolean), cefr: cefr.value || null, notes: notes.value })
    status.value = { kind: 'ok', text: 'Diario guardado.' }
  }
  catch (error) {
    status.value = { kind: 'error', text: apiErrorMessage(error) }
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="journal" @submit.prevent="save">
    <div class="head">
      <h3>Diario de la semana {{ week }}</h3>
      <span class="small muted">Lo rellenas el viernes (nivel) y el domingo (errores).</span>
    </div>
    <fieldset class="field">
      <legend>Tus 3 errores más repetidos</legend>
      <span class="hint">Se insertan en el prompt de speaking de la semana siguiente.</span>
      <input v-for="i in 3" :id="`j${week}-m${i}`" :key="i" v-model="mistakes[i - 1]" type="text" maxlength="200" :placeholder="['Ej.: “I have went” en vez de “I have gone”', 'Ej.: olvido la -s en he/she/it', 'Ej.: “in Monday” en vez de “on Monday”'][i - 1]" :aria-label="`Error ${i}`">
    </fieldset>
    <div class="grid2">
      <div class="field">
        <label :for="`j${week}-cefr`">Nivel en Write &amp; Improve</label>
        <select :id="`j${week}-cefr`" v-model="cefr">
          <option value="">Sin registrar</option>
          <option v-for="level in CEFR_LEVELS" :key="level" :value="level">{{ level }}</option>
        </select>
      </div>
      <div class="field">
        <label :for="`j${week}-notes`">Notas</label>
        <textarea :id="`j${week}-notes`" v-model="notes" maxlength="4000" placeholder="Qué funcionó, qué audio te gustó, qué te costó…" />
      </div>
    </div>
    <div class="row">
      <button class="btn small" type="submit" :disabled="saving">{{ saving ? 'Guardando…' : 'Guardar diario' }}</button>
      <span v-if="status" role="status" class="small" :class="status.kind === 'ok' ? 'ok' : 'err'">{{ status.text }}</span>
    </div>
  </form>
</template>

<style scoped>
.journal { display: grid; gap: 14px; border-top: 2px dashed var(--rule); padding-top: 18px; }
.head { display: grid; gap: 2px; }
fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 8px; }
legend { font-weight: 700; font-size: 0.92rem; padding: 0; margin-bottom: 2px; }
.grid2 { display: grid; grid-template-columns: minmax(0, 200px) minmax(0, 1fr); gap: 14px; }
.ok { color: var(--ok); }
.err { color: var(--redpen); }
@media (max-width: 560px) { .grid2 { grid-template-columns: 1fr; } }
</style>
