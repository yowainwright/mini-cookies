import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
dts: true,
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
