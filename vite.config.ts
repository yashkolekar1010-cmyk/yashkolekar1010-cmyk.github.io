import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // User site, served from the domain root (yashkolekar1010-cmyk.github.io)
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // No manualChunks on purpose. Naming a vendor chunk for three/r3f makes
    // it a STATIC dependency of the entry, which flattens the React.lazy
    // dynamic import and modulepreloads ~900 kB on first paint. Letting the
    // automatic splitting do its job keeps three.js inside the scene's own
    // dynamic chunk, fetched only when the hero mounts it.
  },
})
