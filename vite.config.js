import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
    base: './',   // works from multiple domains/URLs
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'ec2-18-168-19-150.eu-west-2.compute.amazonaws.com',
      '18.168.19.150',
      'engage-admin.astererp.com',
    ],
  },

})
