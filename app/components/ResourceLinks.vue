<script setup lang="ts">
import type { ResourceKey } from '#shared/utils/resources'

defineProps<{ keys: ResourceKey[] }>()
</script>

<template>
  <span v-if="keys.length" class="links">
    <a v-for="key in keys" :key="key" :href="RESOURCES[key].url" target="_blank" rel="noopener">{{ RESOURCES[key].name }}</a>
  </span>
</template>

<style scoped>
.links { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 0.88rem; }
</style>
