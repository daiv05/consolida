<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
useHead({ title: 'Entrar' })

const route = useRoute()
const { fetch: refreshSession } = useUserSession()
const email = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

/**
 * Signs in and redirects to the requested page or the dashboard.
 */
async function submit() {
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    await refreshSession()
    const next = typeof route.query.next === 'string' && route.query.next.startsWith('/app') ? route.query.next : '/app'
    await navigateTo(next)
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
        <h1>Entrar</h1>
        <p class="muted">Sigue donde lo dejaste.</p>
      </div>
      <p v-if="error" class="alert error" role="alert">{{ error }}</p>
      <div class="field">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password" required>
      </div>
      <button class="btn" type="submit" :disabled="pending">{{ pending ? 'Entrando…' : 'Entrar' }}</button>
      <p class="small muted">¿No tienes cuenta? <NuxtLink to="/register">Créala en un minuto</NuxtLink>.</p>
    </form>
  </main>
</template>

<style scoped>
.auth { display: grid; place-items: center; padding-block: 40px; }
.auth form { width: 100%; max-width: 420px; padding: 28px; box-shadow: var(--shadow); }
.stack-sm { display: grid; gap: 4px; }
</style>
