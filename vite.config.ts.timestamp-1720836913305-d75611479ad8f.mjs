// vite.config.ts
import { resolve } from "path";
import vue from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@4.5.3_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@4.5.3_vue@3.4.21/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { FileSystemIconLoader } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-icons@0.15.3_@vue+compiler-sfc@3.4.21/node_modules/unplugin-icons/dist/loaders.mjs";
import IconsResolver from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-icons@0.15.3_@vue+compiler-sfc@3.4.21/node_modules/unplugin-icons/dist/resolver.mjs";
import Icons from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-icons@0.15.3_@vue+compiler-sfc@3.4.21/node_modules/unplugin-icons/dist/vite.mjs";
import Components from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/unplugin-vue-components@0.22.12_vue@3.4.21/node_modules/unplugin-vue-components/dist/vite.mjs";
import { transformLazyShow } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/v-lazy-show@0.2.4_@vue+compiler-core@3.4.21/node_modules/v-lazy-show/dist/index.mjs";
import { defineConfig } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite@4.5.3_@types+node@20.12.3_sass@1.72.0/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-plugin-dts@3.8.1_@types+node@20.12.3_typescript@5.4.3_vite@4.5.3/node_modules/vite-plugin-dts/dist/index.mjs";
import { viteMockServe } from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-plugin-mock@2.9.8_mockjs@1.1.0_vite@4.5.3/node_modules/vite-plugin-mock/dist/index.js";
import Pages from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-plugin-pages@0.31.0_@vue+compiler-sfc@3.4.21_vite@4.5.3/node_modules/vite-plugin-pages/dist/index.mjs";
import VueDevTools from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-plugin-vue-devtools@7.0.25_vite@4.5.3_vue@3.4.21/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import svgLoader from "file:///Users/linhao/code/@linh-txl/pro-crud/node_modules/.pnpm/vite-svg-loader@4.0.0/node_modules/vite-svg-loader/index.js";
var vite_config_default = defineConfig({
  plugins: [
    VueDevTools(),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGluaGFvL2NvZGUvQGxpbmgtdHhsL3Byby1jcnVkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGluaGFvL2NvZGUvQGxpbmgtdHhsL3Byby1jcnVkL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9saW5oYW8vY29kZS9AbGluaC10eGwvcHJvLWNydWQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IEZpbGVTeXN0ZW1JY29uTG9hZGVyIH0gZnJvbSAndW5wbHVnaW4taWNvbnMvbG9hZGVycydcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgdHJhbnNmb3JtTGF6eVNob3cgfSBmcm9tICd2LWxhenktc2hvdydcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJ1xuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJ1xuXG4vLyBpbXBvcnQgeyBQcm9Db21wb25lbnRzUmVzb2x2ZXIgfSBmcm9tICcuL2xpYi9yZXNvbHZlQ29tcG9uZW50cydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBWdWVEZXZUb29scygpLFxuXG4gICAgdnVlKHtcbiAgICAgIHNjcmlwdDoge1xuICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZToge1xuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICBub2RlVHJhbnNmb3JtczogW3RyYW5zZm9ybUxhenlTaG93XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICB2dWVKc3goKSxcblxuICAgIHN2Z0xvYWRlcih7IGRlZmF1bHRJbXBvcnQ6ICdjb21wb25lbnQnIH0pLFxuXG4gICAgUGFnZXMoe1xuICAgICAgZGlyczogJ3NyYy9wYWdlcycsXG4gICAgfSksXG5cbiAgICBkdHMoe1xuICAgICAgLy8gY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAvLyAgIHByZXNlcnZlU3ltbGlua3M6IHRydWUsXG4gICAgICAvLyB9LFxuICAgICAgdHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5idWlsZC5qc29uJyxcbiAgICB9KSxcblxuICAgIHZpdGVNb2NrU2VydmUoe1xuICAgICAgbW9ja1BhdGg6ICcuL3NyYy9tb2NrJyxcbiAgICB9KSxcblxuICAgIENvbXBvbmVudHMoe1xuICAgICAgZHRzOiBmYWxzZSxcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcbiAgICAgICAgSWNvbnNSZXNvbHZlcih7XG4gICAgICAgICAgcHJlZml4OiAnaScsXG4gICAgICAgICAgZW5hYmxlZENvbGxlY3Rpb25zOiBbJ2NydWQnXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pLFxuXG4gICAgSWNvbnMoe1xuICAgICAgY29tcGlsZXI6ICd2dWUzJyxcbiAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxuICAgICAgd2ViQ29tcG9uZW50czoge1xuICAgICAgICBpY29uUHJlZml4OiAnaScsXG4gICAgICB9LFxuICAgICAgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5IGljb24gXHU5NkM2XHU1NDA4XG4gICAgICBjdXN0b21Db2xsZWN0aW9uczoge1xuICAgICAgICBjcnVkOiBGaWxlU3lzdGVtSWNvbkxvYWRlcignY29yZS9hc3NldHMvaWNvbnMnLCBzdmcgPT5cbiAgICAgICAgICBzdmcucmVwbGFjZSgvXjxzdmcgLywgJzxzdmcgZmlsbD1cImN1cnJlbnRDb2xvclwiICcpXG4gICAgICAgICksXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34vJzogYCR7cmVzb2x2ZSgnLi9jb3JlJyl9L2AsXG4gICAgfSxcbiAgICBleHRlbnNpb25zOiBbJy50cycsICcudHN4JywgJy52dWUnLCAnLmpzJywgJy5qc3gnLCAnLmpzb24nXSxcbiAgfSxcblxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTcyLFxuICB9LFxuXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHJlc29sdmUoJ2NvcmUvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdQcm9Db21wb25lbnRzJyxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgIGZpbGVOYW1lOiBmb3JtYXQgPT4gYHByby1jb21wb25lbnRzLiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyd2dWUnLCAnYW50LWRlc2lnbi12dWUnLCAnQGFudC1kZXNpZ24vaWNvbnMtdnVlJ10sXG4gICAgfSxcbiAgfSxcblxuICB0ZXN0OiB7XG4gICAgZW52aXJvbm1lbnQ6ICdoYXBweS1kb20nLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLGVBQWU7QUFFeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyx5QkFBeUI7QUFDbEMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGVBQWU7QUFLdEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBRVosSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLGlCQUFpQjtBQUFBLFVBQ2YsZ0JBQWdCLENBQUMsaUJBQWlCO0FBQUEsUUFDcEM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFFRCxPQUFPO0FBQUEsSUFFUCxVQUFVLEVBQUUsZUFBZSxZQUFZLENBQUM7QUFBQSxJQUV4QyxNQUFNO0FBQUEsTUFDSixNQUFNO0FBQUEsSUFDUixDQUFDO0FBQUEsSUFFRCxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJRixjQUFjO0FBQUEsSUFDaEIsQ0FBQztBQUFBLElBRUQsY0FBYztBQUFBLE1BQ1osVUFBVTtBQUFBLElBQ1osQ0FBQztBQUFBLElBRUQsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLE1BQ0wsV0FBVztBQUFBO0FBQUEsUUFFVCxjQUFjO0FBQUEsVUFDWixRQUFRO0FBQUEsVUFDUixvQkFBb0IsQ0FBQyxNQUFNO0FBQUEsUUFDN0IsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUVELE1BQU07QUFBQSxNQUNKLFVBQVU7QUFBQSxNQUNWLGFBQWE7QUFBQSxNQUNiLGVBQWU7QUFBQSxRQUNiLFlBQVk7QUFBQSxNQUNkO0FBQUE7QUFBQSxNQUVBLG1CQUFtQjtBQUFBLFFBQ2pCLE1BQU07QUFBQSxVQUFxQjtBQUFBLFVBQXFCLFNBQzlDLElBQUksUUFBUSxVQUFVLDJCQUEyQjtBQUFBLFFBQ25EO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE1BQU0sR0FBRyxRQUFRLFFBQVEsQ0FBQztBQUFBLElBQzVCO0FBQUEsSUFDQSxZQUFZLENBQUMsT0FBTyxRQUFRLFFBQVEsT0FBTyxRQUFRLE9BQU87QUFBQSxFQUM1RDtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxlQUFlO0FBQUEsTUFDOUIsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNkLFVBQVUsWUFBVSxrQkFBa0IsTUFBTTtBQUFBLElBQzlDO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsT0FBTyxrQkFBa0IsdUJBQXVCO0FBQUEsSUFDN0Q7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFNO0FBQUEsSUFDSixhQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
