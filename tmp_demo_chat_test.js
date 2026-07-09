const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  page.setViewportSize({ width: 1280, height: 900 })

  const url = 'https://lpk3215.github.io/silver-guardian-v2/demo/?v=5035778'
  await page.goto(url, { waitUntil: 'networkidle' })

  // 关闭弹窗
  try {
    await page.getByRole('button', { name: '我已了解，开始体验' }).click({ timeout: 3000 })
  } catch (e) {
    console.log('No modal or already acknowledged')
  }

  // 等待输入框出现
  const input = page.locator('.agent-input textarea, .agent-input input, [placeholder*="问点什么"], textarea').first()
  await input.waitFor({ timeout: 5000 })
  await input.fill('你好')

  // 点击发送按钮
  const sendBtn = page.locator('.send-button, button[type="submit"], .agent-input .send-btn').first()
  await sendBtn.click()

  // 等待 AI 回复
  await page.waitForTimeout(6000)

  // 截图
  await page.screenshot({ path: 'demo-chat-test.png', fullPage: false })
  console.log('Screenshot saved to demo-chat-test.png')

  await browser.close()
})().catch(err => {
  console.error('Test failed:', err.message)
  process.exit(1)
})
