import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 3000, // Aumentado para evitar avisos com o chunk maior
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Agrupa todas as dependências externas em um único arquivo 'vendor'
          // Isso evita o erro de inicialização (Circular Dependency)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
