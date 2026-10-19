export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['nuxt-auth-utils'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  typescript: { strict: true },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Consolida',
      meta: [
        { name: 'description', content: 'Lleva el seguimiento de tu plan de consolidación de inglés A2–B1: 8 semanas, diario, frases y prompts de IA.' },
        { name: 'theme-color', content: '#14213D' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    dbPath: './data/consolida.db',
    migrationsDir: './server/database/migrations',
    registrationOpen: true,
    session: {
      name: 'consolida-session',
      maxAge: 60 * 60 * 24 * 30,
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'DENY',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
    '/app/**': { ssr: false },
  },

  nitro: {
    externals: { external: ['better-sqlite3'] },
  },
})
