import { defineConfig } from 'tsup'

export default defineConfig([
  // ESM build (.js)
  {
    entry: ['src/mini-cookies.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: '.js'
      }
    }
  },
  // ESM build (.mjs)
  {
    entry: ['src/mini-cookies.ts'],
    format: ['esm'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: '.mjs'
      }
    }
  },
  // CommonJS build (.cjs)
  {
    entry: ['src/mini-cookies.ts'],
    format: ['cjs'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'node14',
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: '.cjs'
      }
    }
  },
  // IIFE build for browsers and CDNs
  {
    entry: ['src/mini-cookies.ts'],
    format: ['iife'],
    globalName: 'miniCookies',
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    footer: {
      js: 'if (typeof miniCookies !== "undefined" && miniCookies.default) { miniCookies = miniCookies.default; }'
    },
    outExtension({ format }) {
      return {
        js: '.umd.js'
      }
    }
  },
  // Bundle file for testing (same as UMD but with .bundle.js extension)
  {
    entry: ['src/mini-cookies.ts'],
    format: ['iife'],
    globalName: 'miniCookies',
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    footer: {
      js: 'if (typeof miniCookies !== "undefined" && miniCookies.default) { miniCookies = miniCookies.default; }'
    },
    outExtension({ format }) {
      return {
        js: '.bundle.js'
      }
    }
  }
])
