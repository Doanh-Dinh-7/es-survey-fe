import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.tsx?$/,
    exclude: [],
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['2f63-123-25-96-200.ngrok-free.app']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".ts": "tsx",
      },
    },
  },
}) 