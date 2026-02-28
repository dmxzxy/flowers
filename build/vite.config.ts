import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configEditorPlugin } from './plugins/configEditorPlugin'

export default defineConfig({
  plugins: [react(), configEditorPlugin()],
  base: './',
  server: {
    port: 3000,
    host: true
  }
})
