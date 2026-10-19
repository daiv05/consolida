<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useHead({ title: notFound.value ? 'Página no encontrada' : 'Error' })
</script>

<template>
  <main class="wrap error-page">
    <span class="eyebrow mono">Error {{ error.statusCode }}</span>
    <h1>{{ notFound ? 'Esta página no existe' : 'Algo salió mal' }}</h1>
    <p class="muted">{{ notFound ? 'Revisa la dirección o vuelve al inicio.' : (error.statusMessage || 'Vuelve a intentarlo en unos segundos.') }}</p>
    <button class="btn" type="button" @click="clearError({ redirect: '/' })">Volver al inicio</button>
  </main>
</template>

<style scoped>
.error-page { min-height: 70vh; display: grid; align-content: center; justify-items: start; gap: 16px; }
</style>
