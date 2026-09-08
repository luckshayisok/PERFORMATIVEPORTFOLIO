import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // bind to every interface so the dev server is reachable from other
  // devices on the LAN (phone testing) without passing --host each time
  server: { host: true },
})
