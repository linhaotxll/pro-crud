// vite.config.ts
import { resolve } from "path";
import vue from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/@vitejs+plugin-vue@5.0.3_vite@4.5.2_vue@3.4.15/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@4.5.2_vue@3.4.15/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { FileSystemIconLoader } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-icons@0.15.3_@vue+compiler-sfc@3.4.15/node_modules/unplugin-icons/dist/loaders.mjs";
import IconsResolver from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-icons@0.15.3_@vue+compiler-sfc@3.4.15/node_modules/unplugin-icons/dist/resolver.mjs";
import Icons from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-icons@0.15.3_@vue+compiler-sfc@3.4.15/node_modules/unplugin-icons/dist/vite.mjs";
import Components from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-vue-components@0.22.12_vue@3.4.15/node_modules/unplugin-vue-components/dist/vite.mjs";
import { transformLazyShow } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/v-lazy-show@0.2.4_@vue+compiler-core@3.4.15/node_modules/v-lazy-show/dist/index.mjs";
import { defineConfig } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite@4.5.2_@types+node@18.19.11_sass@1.70.0/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-plugin-dts@3.7.2_@types+node@18.19.11_typescript@5.3.3_vite@4.5.2/node_modules/vite-plugin-dts/dist/index.mjs";
import { viteMockServe } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-plugin-mock@2.9.8_mockjs@1.1.0_vite@4.5.2/node_modules/vite-plugin-mock/dist/index.js";
import Pages from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-plugin-pages@0.31.0_@vue+compiler-sfc@3.4.15_vite@4.5.2/node_modules/vite-plugin-pages/dist/index.mjs";
import svgLoader from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-svg-loader@4.0.0/node_modules/vite-svg-loader/index.js";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      },
      template: {
        compilerOptions: {
          nodeTransforms: [transformLazyShow]
        }
      }
    }),
    vueJsx(),
    svgLoader({ defaultImport: "component" }),
    Pages({
      dirs: "src/pages"
    }),
    dts({
      // compilerOptions: {
      //   preserveSymlinks: true,
      // },
      tsconfigPath: "./tsconfig.build.json"
    }),
    viteMockServe({
      mockPath: "./src/mock"
    }),
    Components({
      dts: false,
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          prefix: "i",
          enabledCollections: ["crud"]
        })
      ]
    }),
    Icons({
      compiler: "vue3",
      autoInstall: true,
      webComponents: {
        iconPrefix: "i"
      },
      // 自定义 icon 集合
      customCollections: {
        crud: FileSystemIconLoader(
          "core/assets/icons",
          (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" ')
        )
      }
    })
  ],
  resolve: {
    alias: {
      "~/": `${resolve("./core")}/`
    },
    extensions: [".ts", ".tsx", ".vue", ".js", ".jsx", ".json"]
  },
  server: {
    port: 5172
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve("core/index.ts"),
      name: "ProComponents",
      formats: ["es"],
      fileName: (format) => `pro-components.${format}.js`
    },
    rollupOptions: {
      external: ["vue", "ant-design-vue", "@ant-design/icons-vue"]
    }
  },
  test: {
    environment: "happy-dom"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGluaGFvL2NvZGUvQGxpbmgtdHhsL3Byby1jcnVkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGluaGFvL2NvZGUvQGxpbmgtdHhsL3Byby1jcnVkL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9saW5oYW8vY29kZS9AbGluaC10eGwvcHJvLWNydWQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IEZpbGVTeXN0ZW1JY29uTG9hZGVyIH0gZnJvbSAndW5wbHVnaW4taWNvbnMvbG9hZGVycydcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgdHJhbnNmb3JtTGF6eVNob3cgfSBmcm9tICd2LWxhenktc2hvdydcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJ1xuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXG5cbi8vIGltcG9ydCB7IFByb0NvbXBvbmVudHNSZXNvbHZlciB9IGZyb20gJy4vbGliL3Jlc29sdmVDb21wb25lbnRzJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSh7XG4gICAgICBzY3JpcHQ6IHtcbiAgICAgICAgZGVmaW5lTW9kZWw6IHRydWUsXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgbm9kZVRyYW5zZm9ybXM6IFt0cmFuc2Zvcm1MYXp5U2hvd10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgdnVlSnN4KCksXG5cbiAgICBzdmdMb2FkZXIoeyBkZWZhdWx0SW1wb3J0OiAnY29tcG9uZW50JyB9KSxcblxuICAgIFBhZ2VzKHtcbiAgICAgIGRpcnM6ICdzcmMvcGFnZXMnLFxuICAgIH0pLFxuXG4gICAgZHRzKHtcbiAgICAgIC8vIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgLy8gICBwcmVzZXJ2ZVN5bWxpbmtzOiB0cnVlLFxuICAgICAgLy8gfSxcbiAgICAgIHRzY29uZmlnUGF0aDogJy4vdHNjb25maWcuYnVpbGQuanNvbicsXG4gICAgfSksXG5cbiAgICB2aXRlTW9ja1NlcnZlKHtcbiAgICAgIG1vY2tQYXRoOiAnLi9zcmMvbW9jaycsXG4gICAgfSksXG5cbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGR0czogZmFsc2UsXG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIHByZWZpeDogJ2knLFxuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydjcnVkJ10sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KSxcblxuICAgIEljb25zKHtcbiAgICAgIGNvbXBpbGVyOiAndnVlMycsXG4gICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcbiAgICAgIHdlYkNvbXBvbmVudHM6IHtcbiAgICAgICAgaWNvblByZWZpeDogJ2knLFxuICAgICAgfSxcbiAgICAgIC8vIFx1ODFFQVx1NUI5QVx1NEU0OSBpY29uIFx1OTZDNlx1NTQwOFxuICAgICAgY3VzdG9tQ29sbGVjdGlvbnM6IHtcbiAgICAgICAgY3J1ZDogRmlsZVN5c3RlbUljb25Mb2FkZXIoJ2NvcmUvYXNzZXRzL2ljb25zJywgc3ZnID0+XG4gICAgICAgICAgc3ZnLnJlcGxhY2UoL148c3ZnIC8sICc8c3ZnIGZpbGw9XCJjdXJyZW50Q29sb3JcIiAnKVxuICAgICAgICApLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcblxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+Lyc6IGAke3Jlc29sdmUoJy4vY29yZScpfS9gLFxuICAgIH0sXG4gICAgZXh0ZW5zaW9uczogWycudHMnLCAnLnRzeCcsICcudnVlJywgJy5qcycsICcuanN4JywgJy5qc29uJ10sXG4gIH0sXG5cbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MixcbiAgfSxcblxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKCdjb3JlL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnUHJvQ29tcG9uZW50cycsXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgICBmaWxlTmFtZTogZm9ybWF0ID0+IGBwcm8tY29tcG9uZW50cy4ke2Zvcm1hdH0uanNgLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsndnVlJywgJ2FudC1kZXNpZ24tdnVlJywgJ0BhbnQtZGVzaWduL2ljb25zLXZ1ZSddLFxuICAgIH0sXG4gIH0sXG5cbiAgdGVzdDoge1xuICAgIGVudmlyb25tZW50OiAnaGFwcHktZG9tJyxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUyxlQUFlO0FBRXhCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMseUJBQXlCO0FBQ2xDLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxlQUFlO0FBS3RCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFFBQVE7QUFBQSxRQUNOLGFBQWE7QUFBQSxNQUNmO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixpQkFBaUI7QUFBQSxVQUNmLGdCQUFnQixDQUFDLGlCQUFpQjtBQUFBLFFBQ3BDO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBRUQsT0FBTztBQUFBLElBRVAsVUFBVSxFQUFFLGVBQWUsWUFBWSxDQUFDO0FBQUEsSUFFeEMsTUFBTTtBQUFBLE1BQ0osTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUFBLElBRUQsSUFBSTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSUYsY0FBYztBQUFBLElBQ2hCLENBQUM7QUFBQSxJQUVELGNBQWM7QUFBQSxNQUNaLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUVELFdBQVc7QUFBQSxNQUNULEtBQUs7QUFBQSxNQUNMLFdBQVc7QUFBQTtBQUFBLFFBRVQsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFVBQ1Isb0JBQW9CLENBQUMsTUFBTTtBQUFBLFFBQzdCLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFFRCxNQUFNO0FBQUEsTUFDSixVQUFVO0FBQUEsTUFDVixhQUFhO0FBQUEsTUFDYixlQUFlO0FBQUEsUUFDYixZQUFZO0FBQUEsTUFDZDtBQUFBO0FBQUEsTUFFQSxtQkFBbUI7QUFBQSxRQUNqQixNQUFNO0FBQUEsVUFBcUI7QUFBQSxVQUFxQixTQUM5QyxJQUFJLFFBQVEsVUFBVSwyQkFBMkI7QUFBQSxRQUNuRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxNQUFNLEdBQUcsUUFBUSxRQUFRLENBQUM7QUFBQSxJQUM1QjtBQUFBLElBQ0EsWUFBWSxDQUFDLE9BQU8sUUFBUSxRQUFRLE9BQU8sUUFBUSxPQUFPO0FBQUEsRUFDNUQ7QUFBQSxFQUVBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsZUFBZTtBQUFBLE1BQzlCLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxVQUFVLFlBQVUsa0JBQWtCLE1BQU07QUFBQSxJQUM5QztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLE9BQU8sa0JBQWtCLHVCQUF1QjtBQUFBLElBQzdEO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
