import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'node:path'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server:{
    host: '0.0.0.0',
    port:3000,
    open:true,
  },
  resolve:{
    alias:[{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
})
