<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
useHead({ title: 'Ajustes' })

const tracker = useTracker()
const { fetch: refreshSession, clear } = useUserSession()

const name = ref('')
const startDate = ref('')
const profileMsg = ref<{ kind: 'ok' | 'error', text: string } | null>(null)
const savingProfile = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const passwordMsg = ref<{ kind: 'ok' | 'error', text: string } | null>(null)
const savingPassword = ref(false)

const deletePassword = ref('')
const deleteArmed = ref(false)
const deleteMsg = ref('')
const deleting = ref(false)

onMounted(async () => {
  try {
    await tracker.load()
    name.value = tracker.profile.value?.name ?? ''
    startDate.value = tracker.profile.value?.startDate ?? ''
  }
  catch (e) {
    profileMsg.value = { kind: 'error', text: apiErrorMessage(e) }
  }
})

const startMonday = computed(() => isIsoDate(startDate.value) ? startOfWeek(startDate.value) : '')

/**
 * Saves name and start date.
 */
async function saveProfile() {
  savingProfile.value = true
  profileMsg.value = null
  try {
    tracker.profile.value = await $fetch<Profile>('/api/me', { method: 'PATCH', body: { name: name.value, startDate: startDate.value } })
    startDate.value = tracker.profile.value.startDate
    await refreshSession()
    profileMsg.value = { kind: 'ok', text: 'Cambios guardados.' }
  }
  catch (e) {
    profileMsg.value = { kind: 'error', text: apiErrorMessage(e) }
  }
  finally {
    savingProfile.value = false
  }
}

/**
 * Changes the password.
 */
async function savePassword() {
  savingPassword.value = true
  passwordMsg.value = null
  try {
    await $fetch('/api/me/password', { method: 'POST', body: { currentPassword: currentPassword.value, newPassword: newPassword.value } })
    currentPassword.value = ''
    newPassword.value = ''
    passwordMsg.value = { kind: 'ok', text: 'Contraseña actualizada.' }
  }
  catch (e) {
    passwordMsg.value = { kind: 'error', text: apiErrorMessage(e) }
  }
  finally {
    savingPassword.value = false
  }
}

/**
 * Deletes the account after the inline confirmation.
 */
async function deleteAccount() {
  if (!deleteArmed.value) {
    deleteArmed.value = true
    return
  }
  deleting.value = true
  deleteMsg.value = ''
  try {
    await $fetch('/api/me', { method: 'DELETE', body: { password: deletePassword.value } })
    await clear()
    tracker.reset()
    await navigateTo('/')
  }
  catch (e) {
    deleteMsg.value = apiErrorMessage(e)
    deleteArmed.value = false
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="stack-lg narrow">
    <h1>Ajustes</h1>

    <form class="card stack" @submit.prevent="saveProfile">
      <h2>Perfil y calendario</h2>
      <div class="field">
        <label for="name">Nombre</label>
        <input id="name" v-model="name" type="text" maxlength="80" required>
      </div>
      <div class="field">
        <label for="start">Inicio del plan</label>
        <input id="start" v-model="startDate" type="date" required>
        <span class="hint">Se ajusta al lunes de esa semana<span v-if="startMonday"> ({{ formatShort(startMonday) }})</span>. Tus tareas marcadas se conservan.</span>
      </div>
      <p class="small muted">Correo: {{ tracker.profile.value?.email }}</p>
      <div class="row">
        <button class="btn" type="submit" :disabled="savingProfile">{{ savingProfile ? 'Guardando…' : 'Guardar' }}</button>
        <span v-if="profileMsg" role="status" class="small" :class="profileMsg.kind">{{ profileMsg.text }}</span>
      </div>
    </form>

    <form class="card stack" @submit.prevent="savePassword">
      <h2>Contraseña</h2>
      <div class="field">
        <label for="current">Contraseña actual</label>
        <input id="current" v-model="currentPassword" type="password" autocomplete="current-password" required>
      </div>
      <div class="field">
        <label for="new">Nueva contraseña</label>
        <input id="new" v-model="newPassword" type="password" autocomplete="new-password" minlength="8" required>
      </div>
      <div class="row">
        <button class="btn" type="submit" :disabled="savingPassword">{{ savingPassword ? 'Guardando…' : 'Cambiar contraseña' }}</button>
        <span v-if="passwordMsg" role="status" class="small" :class="passwordMsg.kind">{{ passwordMsg.text }}</span>
      </div>
    </form>

    <section class="card stack">
      <h2>Tus datos</h2>
      <p class="small muted">Descarga todo tu progreso, diarios y frases en un archivo JSON.</p>
      <div class="row">
        <a class="btn ghost" href="/api/me/export" download>Descargar mis datos</a>
      </div>
    </section>

    <form class="card stack danger-zone" @submit.prevent="deleteAccount">
      <h2>Borrar cuenta</h2>
      <p class="small muted">Se borran tu cuenta, tu progreso, tus diarios y tus frases. No se puede deshacer.</p>
      <div class="field">
        <label for="del-pass">Tu contraseña</label>
        <input id="del-pass" v-model="deletePassword" type="password" autocomplete="current-password" required>
      </div>
      <p v-if="deleteMsg" class="alert error" role="alert">{{ deleteMsg }}</p>
      <div class="row">
        <button class="btn danger" type="submit" :disabled="deleting">{{ deleteArmed ? 'Pulsa otra vez para borrar definitivamente' : 'Borrar mi cuenta' }}</button>
        <button v-if="deleteArmed" class="btn ghost" type="button" @click="deleteArmed = false">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.narrow { max-width: 640px; }
.ok { color: var(--ok); }
.error { color: var(--redpen); }
.danger-zone { border-color: var(--redpen); }
</style>
