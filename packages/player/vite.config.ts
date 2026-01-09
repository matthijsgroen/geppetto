import { defineConfig } from 'vite';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    glsl({
      compress: true,
    }),
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.bench.ts'],
      rollupTypes: true,
    }),
  ],
  // Dev server configuration for demo
  root: 'demo',
  publicDir: '../public',
  server: {
    port: 1234,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GeppettoPlayer',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['delaunator', '@geppetto/types'],
    },
    sourcemap: true,
    outDir: resolve(__dirname, 'dist'),
  },
});
