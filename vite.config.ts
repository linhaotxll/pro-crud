import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { transformLazyShow } from 'v-lazy-show'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { viteMockServe } from 'vite-plugin-mock'
import Pages from 'vite-plugin-pages'

// import { ProComponentsResolver } from './lib/resolveComponents'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
      template: {
        compilerOptions: {
          nodeTransforms: [transformLazyShow],
        },
      },
    }),

    vueJsx(),

    Pages({
      dirs: 'src/pages',
    }),

    dts({
      // compilerOptions: {
      //   preserveSymlinks: true,
      // },
      tsconfigPath: './tsconfig.build.json',
    }),

    viteMockServe({
      mockPath: './src/mock',
    }),
  ],

  resolve: {
    alias: {
      '~/': `${resolve('./core')}/`,
    },
    extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json'],
  },

  server: {
    port: 1000,
  },

  build: {
    lib: {
      entry: resolve('core/index.ts'),
      name: 'ProComponents',
      formats: ['es'],
      fileName: format => `pro-components.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
    },
  },
})
