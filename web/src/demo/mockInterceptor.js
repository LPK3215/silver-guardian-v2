/**
 * Demo 模式 fetch 拦截器
 *
 * 在 main.js 中条件加载，拦截所有 /api 请求并返回 mock 数据。
 * 不修改任何现有业务代码。
 */

import { mockRoutes } from './mockData'

function matchRoute(method, url) {
  // 去掉 query string
  const path = url.split('?')[0]

  // 先尝试精确匹配 "METHOD /api/xxx"
  const exactKey = `${method} ${path}`
  if (mockRoutes[exactKey]) {
    return { handler: mockRoutes[exactKey], params: {} }
  }

  // 再尝试参数化匹配 "METHOD /api/xxx/:param/yyy"
  const keys = Object.keys(mockRoutes).filter((k) => k.startsWith(`${method} `))
  for (const key of keys) {
    const routePath = key.slice(method.length + 1)
    const routeParts = routePath.split('/')
    const pathParts = path.split('/')

    if (routeParts.length !== pathParts.length) continue

    const params = {}
    let matched = true
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i]
      } else if (routeParts[i] !== pathParts[i]) {
        matched = false
        break
      }
    }

    if (matched) {
      return { handler: mockRoutes[key], params }
    }
  }

  return null
}

function createMockResponse(data) {
  const json = JSON.stringify(data)
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: () => Promise.resolve(JSON.parse(json)),
    text: () => Promise.resolve(json),
    blob: () => Promise.resolve(new Blob([json], { type: 'application/json' }))
  }
}

export function installMockInterceptor() {
  const originalFetch = window.fetch

  window.fetch = async function (url, options = {}) {
    const urlString = typeof url === 'string' ? url : url?.url || ''

    // 只拦截 /api 开头的请求
    if (!urlString.startsWith('/api') && !urlString.includes('/api/')) {
      return originalFetch.call(window, url, options)
    }

    const method = (options.method || 'GET').toUpperCase()
    const match = matchRoute(method, urlString)

    if (match) {
      // 解析请求体
      let body = null
      if (options.body) {
        try {
          if (typeof options.body === 'string') {
            body = JSON.parse(options.body)
          } else if (options.body instanceof FormData) {
            body = {}
          }
        } catch {
          body = {}
        }
      }

      // 模拟网络延迟
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))

      const result = match.handler(body, match.params)
      return createMockResponse(result)
    }

    // 未匹配的 API 请求，返回空成功响应
    console.warn(`[Demo Mode] Unmatched API: ${method} ${urlString}`)
    return createMockResponse({ success: true, data: null, message: 'Demo mode: endpoint not mocked' })
  }

  console.log('[Demo Mode] Mock interceptor installed')
}
