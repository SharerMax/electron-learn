import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import pkg from '../../package.json'

console.log(JSON.stringify(process.env))
export default defineConfig({
  root: __dirname,
  build: {
    outDir: '../../dist/main',
    emptyOutDir: true,
    minify: process.env./* from mode option */NODE_ENV === 'production',
    sourcemap: true,
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => '[name].cjs',
    },
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
  },
})
