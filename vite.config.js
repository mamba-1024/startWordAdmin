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
      plugins: [
        terser({
          compress: {
            // 压缩选项
            drop_console: true, // 删除 console 语句
            drop_debugger: true, // 删除 debugger 语句
            pure_funcs: ['console.log'], // 删除 console.log 语句
            unused: true, // 删除未使用的函数和变量
            dead_code: true, // 删除不可达的代码
            // reduce_funcs: true, // 尝试将多个函数合并为一个
            // reduce_vars: true, // 尝试将多个变量合并为一个
          },
          mangle: {
            // 混淆选项
            properties: {
              // 混淆对象属性名
              regex: /^_/,
            },
          },
          format: {
            // 输出选项
            comments: false, // 删除注释
          },
          warnings: true, // 是否输出警告信息
        }),
      ],
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
