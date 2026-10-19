<script setup lang="ts">
import type { PlanTask } from '#shared/utils/plan'

const props = defineProps<{ task: PlanTask, done: boolean, compact?: boolean }>()
const emit = defineEmits<{ toggle: [done: boolean] }>()
const id = computed(() => `task-${props.task.key.replace(/\./g, '-')}`)
</script>

<template>
  <div class="task" :class="{ done, compact }">
    <input :id="id" type="checkbox" :checked="done" @change="emit('toggle', ($event.target as HTMLInputElement).checked)">
    <label :for="id">
      <span class="t">
        {{ task.title }}
        <span class="min mono">{{ task.minutes }} min</span>
        <span v-if="task.optional" class="opt mono">opcional</span>
      </span>
      <span v-if="!compact" class="d">{{ task.detail }}</span>
    </label>
    <span />
    <ResourceLinks :keys="task.links" />
  </div>
</template>

<style scoped>
.task { display: grid; grid-template-columns: 1.4rem 1fr; gap: 4px 10px; align-items: start; }
.task input { width: 1.2rem; height: 1.2rem; margin: 0.22rem 0 0; accent-color: var(--ink); cursor: pointer; }
.task label { display: grid; gap: 3px; cursor: pointer; min-width: 0; }
.t { font-weight: 700; }
.min { font-weight: 400; font-size: 0.8rem; color: var(--ink-soft); margin-left: 6px; }
.opt { font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); border: 1px solid var(--rule); border-radius: 4px; padding: 0 5px; margin-left: 6px; }
.d { font-size: 0.92rem; color: var(--ink-soft); }
.done .t { text-decoration: line-through; text-decoration-color: var(--ok); text-decoration-thickness: 2px; }
.done input { animation: pop 0.25s ease; }
@keyframes pop { 50% { transform: scale(1.25); } }
</style>
