/**
 * 语音朗读 composable - 使用浏览器 SpeechSynthesis API
 * 将文字转为语音播放，适合老年人"听"AI回复
 * 支持 Chrome/Edge/Safari，不支持 Firefox
 */
import { ref, onMounted, onUnmounted } from 'vue'

// 全局单例：同一时间只允许一条消息在朗读
let currentSpeakingId = ref(null)

export function useTTS() {
  const isSpeaking = ref(false)
  const isSupported = ref(false)
  let currentUtterance = null

  onMounted(() => {
    isSupported.value = typeof window !== 'undefined' && 'speechSynthesis' in window
  })

  onUnmounted(() => {
    stop()
  })

  /**
   * 将 Markdown 转为纯文本（去掉格式符号，保留可读内容）
   */
  function markdownToPlainText(md) {
    if (!md || typeof md !== 'string') return ''
    return md
      // 代码块 → 移除
      .replace(/```[\s\S]*?```/g, '（代码块）')
      // 行内代码
      .replace(/`([^`]+)`/g, '$1')
      // 图片
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 链接：[文字](url) → 文字
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 加粗/斜体
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // 标题符号
      .replace(/^#{1,6}\s+/gm, '')
      // 引用块
      .replace(/^>\s+/gm, '')
      // 列表符号
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // 水平线
      .replace(/^---+$/gm, '')
      // 表格管道符
      .replace(/\|/g, ' ')
      // 多余的空行
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  /**
   * 朗读文本
   * @param {string} text - 要朗读的文本（可以是 Markdown）
   * @param {string} messageKey - 消息唯一标识，用于管理单例播放
   */
  function speak(text, messageKey) {
    if (!isSupported.value) return

    // 如果正在朗读这条消息，点击则停止
    if (isSpeaking.value && currentSpeakingId.value === messageKey) {
      stop()
      return
    }

    // 停止其他正在朗读的
    window.speechSynthesis.cancel()

    const plainText = markdownToPlainText(text)
    if (!plainText) return

    const utterance = new SpeechSynthesisUtterance(plainText)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9    // 稍慢，适合老年人
    utterance.pitch = 1
    utterance.volume = 1

    // 尝试选择中文语音
    const voices = window.speechSynthesis.getVoices()
    const zhVoice = voices.find(v => v.lang.startsWith('zh'))
    if (zhVoice) {
      utterance.voice = zhVoice
    }

    utterance.onstart = () => {
      isSpeaking.value = true
      currentSpeakingId.value = messageKey
    }

    utterance.onend = () => {
      isSpeaking.value = false
      currentSpeakingId.value = null
    }

    utterance.onerror = () => {
      isSpeaking.value = false
      currentSpeakingId.value = null
    }

    currentUtterance = utterance
    window.speechSynthesis.speak(utterance)
  }

  /**
   * 停止朗读
   */
  function stop() {
    if (!isSupported.value) return
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    currentSpeakingId.value = null
    currentUtterance = null
  }

  /**
   * 判断指定消息是否正在朗读
   */
  function isSpeakingMessage(messageKey) {
    return isSpeaking.value && currentSpeakingId.value === messageKey
  }

  return {
    isSpeaking,
    isSupported,
    currentSpeakingId,
    speak,
    stop,
    isSpeakingMessage,
  }
}
