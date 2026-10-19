<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
useHead({ title: 'Crear cuenta' })

const { fetch: refreshSession } = useUserSession()
const today = localIsoDate()
const nextMonday = mondayIndex(today) === 0 ? today : addDays(startOfWeek(today), 7)

const name = ref('')
const email = ref('')
const password = ref('')
const startDate = ref(nextMonday)
const error = ref('')
const pending = ref(false)
const startMonday = computed(() => startDate.value && isIsoDate(startDate.value) ? startOfWeek(startDate.value) : '')

/**
 * Creates the account, starts the session and opens the dashboard.
 */
async function submit() {
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: { name: name.value, email: email.value, password: password.value, startDate: startDate.value } })
    await refreshSession()
    await navigateTo('/app')
  }
  catch (e) {
    error.value = apiErrorMessage(e)
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="wrap auth">
    <form class="card stack" @submit.prevent="submit">
      <div class="stack-sm">
        <h1>Crear cuenta</h1>
        <p class="muted">Tu progreso queda guardado y lo ves desde cualquier dispositivo.</p>
      </div>
      <p v-if="error" class="alert error" role="alert">{{ error }}</p>
      <div class="field">
        <label for="name">Nombre</label>
        <input id="name" v-model="name" type="text" autocomplete="given-name" maxlength="80" required>
      </div>
      <div class="field">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" autocomplete="new-password" minlength="8" required>
        <span class="hint">Mínimo 8 caracteres.</span>
      </div>
      <div class="field">
        <label for="start">¿Cuándo empiezas?</label>
        <input id="start" v-model="startDate" type="date" required>
        <span v-if="startMonday" class="hint">El plan va de lunes a domingo: empezará el lunes {{ formatShort(startMonday) }}.</span>
      </div>
      <button class="btn" type="submit" :disabled="pending">{{ pending ? 'Creando…' : 'Crear cuenta' }}</button>
      <p class="small muted">¿Ya tienes cuenta? <NuxtLink to="/login">Entra</NuxtLink>.</p>
    </form>
  </main>
</template>

<style scoped>
.auth { display: grid; place-items: center; padding-block: 40px; }
.auth form { width: 100%; max-width: 440px; padding: 28px; box-shadow: var(--shadow); }
.stack-sm { display: grid; gap: 4px; }
</style>
