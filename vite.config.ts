import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { transformLazyShow } from 'v-lazy-show'
import { defineConfig } from 'vite'
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
  ],

  resolve: {
    alias: {
      '~/': `${resolve('./core')}/`,
    },
  },

  build: {
    lib: {
      entry: resolve('./lib/index.ts'),
      name: 'ProComponents',
      fileName: 'pro-components',
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
    },
  },
})
