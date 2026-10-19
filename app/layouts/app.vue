<script setup lang="ts">
const route = useRoute()
const signOut = useSignOut()
const { user } = useUserSession()
const signingOut = ref(false)

const links = [
  { to: '/app', label: 'Hoy' },
  { to: '/app/plan', label: 'Plan' },
  { to: '/app/frases', label: 'Frases' },
  { to: '/app/prompts', label: 'Prompts IA' },
  { to: '/app/recursos', label: 'Recursos' },
  { to: '/app/ajustes', label: 'Ajustes' },
]

/**
 * Signs out while preventing double clicks.
 */
async function onSignOut() {
  signingOut.value = true
  try {
    await signOut()
  }
  finally {
    signingOut.value = false
  }
}
</script>

<template>
  <div class="shell">
    <header class="bar-top">
      <div class="wrap inner">
        <NuxtLink to="/app" class="brand"><BrandMark /> Consolida</NuxtLink>
        <div class="row user">
          <span class="small muted name">{{ user?.name }}</span>
          <button class="btn ghost small" type="button" :disabled="signingOut" @click="onSignOut">Salir</button>
        </div>
      </div>
      <nav class="wrap tabs" aria-label="Secciones">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="tab"
          :class="{ active: link.to === '/app' ? route.path === '/app' : route.path.startsWith(link.to) }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </header>
    <main class="wrap main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; }
.bar-top { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--paper) 92%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--rule); }
.inner { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-block: 12px 4px; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--f-display); font-weight: 800; font-size: 1.15rem; color: var(--ink); text-decoration: none; }
.user { gap: 10px; }
.name { max-width: 16ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tabs { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; padding-block: 6px 8px; }
.tab { font-family: var(--f-mono); font-size: 0.82rem; white-space: nowrap; text-decoration: none; color: var(--ink-soft); padding: 6px 12px; border-radius: 6px; transition: background-color 0.15s ease, color 0.15s ease; }
.tab:hover { background: var(--sheet); color: var(--ink); }
.tab.active { background: var(--marker); color: var(--marker-ink); font-weight: 600; }
.main { padding-block: 28px 64px; }
@media (max-width: 480px) { .name { display: none; } }
</style>
