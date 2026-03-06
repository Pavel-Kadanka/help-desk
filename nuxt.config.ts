import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    rollupConfig: {
      external: ['@prisma/client', '.prisma/client'],
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    public: {
      maturitaDate: '2026-05-26',
    },
  },

  app: {
    head: {
      title: 'Maturitní Helpdesk',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Studijní materiály a příprava na maturitu' },
      ],
      htmlAttrs: { lang: 'cs' },
    },
  },
})
