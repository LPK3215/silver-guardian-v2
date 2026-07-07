/**
 * 语音输入 composable - 使用 Web Speech API
 * 支持 Chrome/Edge/Safari，不支持 Firefox
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useVoiceInput(onResult) {
  const isRecording = ref(false)
  const isSupported = ref(false)
  const interimText = ref('')
  let recognition = null

  onMounted(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      isSupported.value = true
      recognition = new SpeechRecognition()
      recognition.lang = 'zh-CN'
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        let finalText = ''
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalText += transcript
          } else {
            interim += transcript
          }
        }
        interimText.value = interim
        if (finalText && onResult) {
          onResult(finalText)
        }
      }

      recognition.onerror = (event) => {
        console.warn('语音识别错误:', event.error)
        isRecording.value = false
      }

      recognition.onend = () => {
        isRecording.value = false
        interimText.value = ''
      }
    }
  })

  onUnmounted(() => {
    if (recognition) {
      try {
        recognition.stop()
      } catch (e) {
        // ignore
      }
    }
  })

  function toggleRecording() {
    if (!isSupported.value || !recognition) return
    if (isRecording.value) {
      recognition.stop()
      isRecording.value = false
    } else {
      try {
        recognition.start()
        isRecording.value = true
      } catch (e) {
        console.warn('启动语音识别失败:', e)
      }
    }
  }

  function stopRecording() {
    if (recognition && isRecording.value) {
      recognition.stop()
      isRecording.value = false
    }
  }

  return {
    isRecording,
    isSupported,
    interimText,
    toggleRecording,
    stopRecording,
  }
}
