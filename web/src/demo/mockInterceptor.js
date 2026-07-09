/**
 * Demo 模式 fetch 拦截器
 *
 * 在 main.js 中条件加载，拦截所有 /api 请求并返回 mock 数据。
 * 不修改任何现有业务代码。
 */

import { mockRoutes, addDemoMessage, getDemoHistory, getMockReply } from './mockData'

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

    // 特殊处理 Agent Run SSE events，返回 ReadableStream 避免前端无限重连
    if (method === 'GET' && urlString.includes('/api/agent/runs/') && urlString.includes('/events')) {
      const runIdMatch = urlString.match(/\/api\/agent\/runs\/([^/?]+)/)
      const runId = runIdMatch ? runIdMatch[1] : 'demo-run'
      const encoder = new TextEncoder()
      const sseData =
        `event: end\ndata: ` +
        JSON.stringify({ payload: { status: 'completed' }, run_id: runId }) +
        `\n\n`
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(sseData))
          controller.close()
        }
      })
      return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream' }
      })
    }

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

      // 发送新消息时记录到 demo 动态历史，并生成模拟 AI 回复
      if (method === 'POST' && urlString.includes('/api/agent/runs') && !urlString.includes('/events')) {
        const query = body?.query
        const threadId = body?.thread_id
        if (query && threadId) {
          addDemoMessage(threadId, { type: 'human', content: query })
          addDemoMessage(threadId, { type: 'ai', content: getMockReply(query) })
        }
      }

      const result = match.handler(body, match.params)

      // 历史消息接口返回静态 + 动态消息合并
      const historyMatch = urlString.match(/\/api\/chat\/thread\/([^/]+)\/history$/)
      if (method === 'GET' && historyMatch) {
        const threadId = historyMatch[1]
        return createMockResponse(getDemoHistory(threadId))
      }

      return createMockResponse(result)
    }

    // 未匹配的 API 请求，返回空成功响应
    console.warn(`[Demo Mode] Unmatched API: ${method} ${urlString}`)
    return createMockResponse({ success: true, data: null, message: 'Demo mode: endpoint not mocked' })
  }

  console.log('[Demo Mode] Mock interceptor installed')
}
