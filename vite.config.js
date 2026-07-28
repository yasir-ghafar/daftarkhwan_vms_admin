import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
<<<<<<< HEAD
    base: '/',    // absolute paths so nested routes still load /assets/* correctly
=======
    base: '/',   // works from multiple domains/URLs
>>>>>>> 72fe458fb3f5e849809e17dae0b9e43124442cee
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'ec2-18-168-19-150.eu-west-2.compute.amazonaws.com',
      '18.168.19.150',
      'engage-admin.astererp.com',
    ],
  },

})
