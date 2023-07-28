import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { transformLazyShow } from 'v-lazy-show'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
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
      compilerOptions: {
        preserveSymlinks: false,
      },
      tsconfigPath: './tsconfig.json',
    }),
  ],

  resolve: {
    alias: {
      '~/': `${resolve('./core')}/`,
    },
    extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json'],
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
