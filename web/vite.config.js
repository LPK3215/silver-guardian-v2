import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  const isDemo = mode === 'demo'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // Demo 模式部署到 GitHub Pages 的 /silver-guardian-v2/demo/ 路径下
    base: isDemo ? '/silver-guardian-v2/demo/' : '/',
    // Demo 模式输出到 docs/demo 目录（匹配 base 路径 /demo/）
    build: isDemo ? {
      outDir: '../docs/demo',
      emptyOutDir: true
    } : undefined,
    server: {
      proxy: {
        '^/api': {
          target: env.VITE_API_URL || 'http://api:5050',
          changeOrigin: true
        }
      },
      watch: {
        usePolling: true,
        ignored: ['**/node_modules/**', '**/dist/**'],
      },
      host: '0.0.0.0',
    }
  }
})
