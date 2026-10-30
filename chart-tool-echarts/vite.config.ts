import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const siteSrc = fileURLToPath(new URL('../src', import.meta.url));
const pkg = (name: string) =>
  fileURLToPath(new URL(`./node_modules/${name}`, import.meta.url));

// https://vite.dev/config/
// Served from cake.lenovo.com/datavis (GitHub Pages sub-path). Same base for
// build, preview, and dev so asset URLs always match — `vite preview` uses
// command "serve", so a build-only base left preview HTML pointing at
// /datavis/assets while files were served from /assets (blank app).
export default defineConfig({
  base: '/datavis/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Reuse main-site TopNav / SiteThemeProvider / hello pc without cloning.
      '@site': siteSrc,
      // Pin shared libs to *this* app's node_modules. `@site` imports resolve
      // from ../src and otherwise pick up the repo-root copies — a second
      // react-router-dom means MemoryRouter context never reaches TopNav's
      // useLocation (blank #root, "Error" at the router invariant).
      react: pkg('react'),
      'react-dom': pkg('react-dom'),
      'react-router': pkg('react-router'),
      'react-router-dom': pkg('react-router-dom'),
      'styled-components': pkg('styled-components'),
      'lucide-react': pkg('lucide-react'),
    },
    dedupe: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'styled-components',
      'lucide-react',
      // echarts-gl registers against `echarts/lib/echarts`; keep one singleton
      // so globe/scatter3D land on the same instance as `echarts/core`.
      'echarts',
      'zrender',
    ],
  },
  optimizeDeps: {
    include: ['echarts/core', 'echarts/lib/echarts', 'echarts-gl'],
  },
  // Parent `nav.js` reads CRA-style process.env at module load.
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
  server: {
    fs: {
      // Allow importing from ../src (main site) during local dev.
      allow: ['..'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep ECharts in its own chunk so it doesn't bloat the app chunk.
        manualChunks: {
          echarts: ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers'],
          color: ['culori', 'd3-array'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
