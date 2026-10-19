<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
  <div class="public">
    <header class="wrap top">
      <NuxtLink to="/" class="brand"><BrandMark /> Consolida</NuxtLink>
      <nav class="row">
        <template v-if="loggedIn">
          <NuxtLink to="/app" class="btn small">Ir a mi plan</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="btn ghost small">Entrar</NuxtLink>
          <NuxtLink to="/register" class="btn small">Crear cuenta</NuxtLink>
        </template>
      </nav>
    </header>
    <slot />
    <footer class="wrap foot small muted">
      <span>Consolida · plan de inglés A2–B1</span>
      <a href="https://github.com/daiv05/consolida" target="_blank" rel="noopener">Código en GitHub</a>
    </footer>
  </div>
</template>

<style scoped>
.public { min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; }
.top { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-block: 18px; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--f-display); font-weight: 800; font-size: 1.25rem; color: var(--ink); text-decoration: none; }
.foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding-block: 28px; border-top: 1px solid var(--rule); margin-top: 48px; }
</style>
