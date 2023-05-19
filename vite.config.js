import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { terser } from 'rollup-plugin-terser';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1', // vite默认值
    port: 5173, // vite默认值
    open: true, // 自动打开浏览器
    proxy: {
      '/backend': {
        target: 'https://hznanf.com',
        changeOrigin: true,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        proxyHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        // rewrite: (path) => path.replace(/^\/backend/, '/backend'),
      },
      '/index': {
        target: 'https://hznanf.com',
        changeOrigin: true,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        proxyHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [terser()],
    },
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // additionalData: `@import "${resolve(
        //   __dirname,
        //   'src/styles/base.less',
        // )}";`,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
});
