import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
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

    AutoImport({
      include: [/\.vue$/, /\.[tj]sx?$/],

      resolvers: [
        // 自动导入组件
        ElementPlusResolver(),

        // ProComponentsResolver(),
      ],

      // imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],

      dirs: ['./lib/**'],

      dts: './src/typings/auto-imports.d.ts',

      vueTemplate: true,

      eslintrc: {
        enabled: true,
        filepath: '.eslintrc-auto-import.json',
      },
    }),

    Components({
      dirs: ['./lib'],
      resolvers: [
        // 自动注册组件
        ElementPlusResolver(),

        // ProComponentsResolver(),
      ],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      extensions: ['vue', 'tsx'],
      dts: './src/typings/components.d.ts',
      importPathTransform: path =>
        path.endsWith('.tsx') ? path.slice(0, -4) : path,
    }),
  ],

  resolve: {
    alias: {
      '~/': `${resolve('./lib')}/`,
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
