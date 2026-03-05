import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      allowedHosts: ['*'],
      proxy: {
        '/socket.io': {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  }
})
