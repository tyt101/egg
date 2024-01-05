import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// 按需引入
import { createStyleImportPlugin  } from 'vite-plugin-style-import'
import { fileURLToPath } from 'url'
// https://vitejs.dev/config/
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default defineConfig({
  plugins: [react(), 
    // 配置按需导入模块
    createStyleImportPlugin({
    libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/css`;
          }
        }
      ],
    })
  ],
  // 配置预处理器less
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  // 测试环境跨域配置
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:2345',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/,'')
      }
    }
  },
  // 配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'utils': path.resolve(__dirname, 'src/utils')
    }
  }
})
