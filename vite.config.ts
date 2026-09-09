import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Root deployment (custom domain / <user>.github.io) uses '/'. Set
    // VITE_BASE=/repo-name/ only for a project page served from a sub-path.
    base: env.VITE_BASE || '/',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
  }
})
