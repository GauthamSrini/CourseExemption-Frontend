import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.xlsx'],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: true,  // This allows access from other devices on the network
    port: 5173,  // You can specify a different port if needed
  },
})
