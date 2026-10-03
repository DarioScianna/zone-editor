import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// GitHub Pages serves the app from /zone-editor/, the dev server from the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/zone-editor/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // Stylesheets (e.g. Leaflet's) are irrelevant in jsdom; skip processing them.
    css: false,
  },
}))
