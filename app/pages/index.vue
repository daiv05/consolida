<script setup lang="ts">
useHead({ title: 'Tu plan de inglés A2–B1', titleTemplate: 'Consolida · %s' })
const { loggedIn } = useUserSession()

const week = [
  { day: 'Lun', what: 'Escuchas y recreas', min: 35 },
  { day: 'Mar', what: 'Anki + serie fácil', min: 20 },
  { day: 'Mié', what: 'Anotas y corriges', min: 30 },
  { day: 'Jue', what: 'Noticia + pronunciación', min: 20 },
  { day: 'Vie', what: 'Escribes y mides', min: 30 },
  { day: 'Sáb', what: 'Libre (opcional)', min: 0 },
  { day: 'Dom', what: 'Revisas la semana', min: 10 },
]
</script>

<template>
  <main class="wrap landing">
    <section class="hero">
      <span class="eyebrow">8 semanas · 1 estructura por semana</span>
      <h1>Consolida tu inglés de <span class="mark">A2 a B1</span> sin perder el hilo</h1>
      <p class="lede muted">Un plan diario de 20–35 minutos que conecta escucha, speaking y escritura alrededor de la misma estructura gramatical. Marca tus tareas, registra tus errores y obtén prompts de IA hechos a tu medida.</p>
      <div class="row">
        <NuxtLink v-if="loggedIn" to="/app" class="btn marker">Ir a mi plan</NuxtLink>
        <template v-else>
          <NuxtLink to="/register" class="btn marker">Empezar gratis</NuxtLink>
          <NuxtLink to="/login" class="btn ghost">Ya tengo cuenta</NuxtLink>
        </template>
      </div>
    </section>

    <section class="week card" aria-label="Así es una semana">
      <div v-for="(d, i) in week" :key="d.day" class="cell" :style="{ animationDelay: `${i * 60}ms` }">
        <span class="mono day">{{ d.day }}</span>
        <span class="what">{{ d.what }}</span>
        <span class="mono min">{{ d.min ? `${d.min} min` : '—' }}</span>
      </div>
    </section>

    <section class="points">
      <div>
        <h3>Todo gira en torno a una estructura</h3>
        <p class="muted">Past simple la semana 1, condicionales la 7. La escuchas el lunes, la detectas el miércoles y la escribes el viernes.</p>
      </div>
      <div>
        <h3>Ves si avanzas</h3>
        <p class="muted">Progreso, racha, minutos, tareas atrasadas y tu nivel CEFR de Write &amp; Improve semana a semana.</p>
      </div>
      <div>
        <h3>La IA trabaja con tus errores</h3>
        <p class="muted">Los 3 errores que anotas el domingo entran solos en el prompt de speaking de la semana siguiente.</p>
      </div>
      <div>
        <h3>Frases listas para Anki</h3>
        <p class="muted">Guarda frases mientras estudias y expórtalas en el formato de importación de Anki.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing { display: grid; gap: 48px; padding-block: 32px 0; }
.hero { display: grid; gap: 18px; max-width: 760px; }
.hero h1 { font-size: clamp(2.2rem, 6vw, 3.6rem); }
.lede { font-size: 1.1rem; max-width: 60ch; }
.week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0; padding: 0; overflow: hidden; }
.cell { display: grid; gap: 6px; padding: 16px 14px; border-left: 1px dashed var(--rule); animation: rise 0.5s ease both; }
.cell:first-child { border-left: 0; }
.day { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); }
.what { font-family: var(--f-display); font-weight: 700; line-height: 1.2; }
.min { font-size: 0.8rem; color: var(--ink-soft); }
.points { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 28px; }
.points div { display: grid; gap: 6px; align-content: start; }
@keyframes rise { from { opacity: 0.2; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (max-width: 760px) {
  .week { grid-template-columns: 1fr; }
  .cell { grid-template-columns: 3rem 1fr auto; align-items: baseline; border-left: 0; border-top: 1px dashed var(--rule); padding: 10px 16px; }
  .cell:first-child { border-top: 0; }
}
</style>
