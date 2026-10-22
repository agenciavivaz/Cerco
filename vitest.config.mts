import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const alias = { '@': fileURLToPath(new URL('./', import.meta.url)) }

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          include: ['lib/**/*.test.ts'],
          environment: 'node',
          env: { NEXT_PUBLIC_APP_NAME: 'Cerco Teste', NEXT_PUBLIC_METHOD_NAME: 'Método Teste' },
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'rls',
          include: ['tests/rls/**/*.test.ts'],
          environment: 'node',
          testTimeout: 30_000,
          hookTimeout: 60_000,
          fileParallelism: false,
        },
      },
    ],
  },
})
