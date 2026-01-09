import { defineConfig } from 'vite';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => ({
  plugins: [
    glsl({
      minify: true,
    }),
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.bench.ts', 'demo/**/*'],
      rollupTypes: true,
      outDir: 'dist',
    }),
  ],
  // Dev server configuration for demo
  root: mode === 'development' ? 'demo' : undefined,
  publicDir: mode === 'development' ? '../public' : undefined,
  server: {
    port: 1234,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GeppettoPlayer',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['delaunator', '@geppetto/types', 'zod'],
      output: {
        globals: {
          delaunator: 'Delaunator',
          '@geppetto/types': 'GeppettoTypes',
          zod: 'z',
        },
      },
    },
    sourcemap: true,
  },
}));
