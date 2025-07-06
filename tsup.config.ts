import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
  dts: {
    entry: ['src/mini-cookies.ts', 'src/state-manager.ts', 'src/types.ts', 'src/utils.ts'],
    resolve: true
  },
  clean: true,
  splitting: true,
  treeshake: true,
  minify: false,
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
