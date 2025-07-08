import { defineConfig } from 'tsup'

export default defineConfig({
  // Main build for npm distribution
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
  dts: {
    entry: ['src/mini-cookies.ts', 'src/state-manager.ts', 'src/types.ts', 'src/utils.ts'],
    resolve: true
  },
  clean: true,
  splitting: true,
  treeshake: true,
  minify: true,
  sourcemap: true,
  target: 'esnext',
  outDir: 'dist',
  bundle: false,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js'
    }
  }
})
