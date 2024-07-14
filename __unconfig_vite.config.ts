
let __unconfig_data;
let __unconfig_stub = function (data = {}) { __unconfig_data = data };
__unconfig_stub.default = (data = {}) => { __unconfig_data = data };
/// <reference types="vitest" />

import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { transformLazyShow } from 'v-lazy-show'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { viteMockServe } from 'vite-plugin-mock'
import Pages from 'vite-plugin-pages'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// import { ProComponentsResolver } from './lib/resolveComponents'

// https://vitejs.dev/config/
const __unconfig_default =  defineConfig({
  plugins: [
    VueDevTools(),

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

    svgLoader({ defaultImport: 'component' }),

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

    Components({
      dts: false,
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          prefix: 'i',
          enabledCollections: ['crud'],
        }),
      ],
    }),

    Icons({
      compiler: 'vue3',
      autoInstall: true,
      webComponents: {
        iconPrefix: 'i',
      },
      // 自定义 icon 集合
      customCollections: {
        crud: FileSystemIconLoader('core/assets/icons', svg =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        ),
      },
    }),
  ],

  resolve: {
    alias: {
      '~/': `${resolve('./core')}/`,
    },
    extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json'],
  },

  server: {
    port: 5172,
  },

  build: {
    sourcemap: true,
    lib: {
      entry: resolve('core/index.ts'),
      name: 'ProComponents',
      formats: ['es'],
      fileName: format => `pro-components.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'ant-design-vue', '@ant-design/icons-vue'],
    },
  },

  test: {
    environment: 'happy-dom',
  },
})

if (typeof __unconfig_default === "function") __unconfig_default(...[{"command":"serve","mode":"development"}]);export default __unconfig_data;