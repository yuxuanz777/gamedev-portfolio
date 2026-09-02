import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { textEditorPlugin } from './scripts/text-editor/viteTextEditorPlugin'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    ...(mode === 'editor' ? [textEditorPlugin()] : [])
  ],
  ...(mode === 'editor' ? {
    optimizeDeps: {
      noDiscovery: true,
      include: []
    },
    server: {
      watch: {
        ignored: ['**/node_modules-vue2-backup/**']
      }
    }
  } : {}),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}))
