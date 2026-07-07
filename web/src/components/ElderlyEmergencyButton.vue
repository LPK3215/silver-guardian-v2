<template>
  <div class="elderly-emergency-wrapper">
    <!-- 紧急求助浮动按钮 -->
    <button
      class="elderly-emergency-button"
      @click="showModal = true"
      title="紧急求助"
    >
      <span class="elderly-emergency-icon">SOS</span>
      <span>紧急求助</span>
    </button>

    <!-- 紧急求助弹窗 -->
    <a-modal
      v-model:open="showModal"
      :width="480"
      :footer="null"
      class="elderly-emergency-modal"
    >
      <div style="text-align: center; padding: 16px 0;">
        <h2 style="margin-bottom: 16px; color: #ff4d4f;">紧急求助</h2>
        <p style="font-size: 18px; color: #666; margin-bottom: 20px;">
          如果您遇到紧急情况，请立即拨打以下电话：
        </p>

        <div style="font-size: 36px; font-weight: bold; color: #ff4d4f; letter-spacing: 4px;">120</div>
        <p style="font-size: 16px; color: #999; margin-bottom: 16px;">急救电话</p>

        <div style="font-size: 36px; font-weight: bold; color: #ff4d4f; letter-spacing: 4px;">110</div>
        <p style="font-size: 16px; color: #999; margin-bottom: 16px;">报警电话</p>

        <div v-if="emergencyContact" style="font-size: 28px; font-weight: bold; color: #ff4d4f;">
          {{ emergencyContact }}
        </div>
        <p v-if="emergencyContact" style="font-size: 16px; color: #999; margin-bottom: 24px;">紧急联系人</p>
        <p v-else style="font-size: 14px; color: #ccc; margin-bottom: 24px;">未设置紧急联系人，可在设置中添加</p>

        <div style="display: flex; gap: 12px;">
          <a-button type="primary" danger size="large" style="flex: 1; min-height: 52px;" @click="callNumber('120')">
            拨打120
          </a-button>
          <a-button v-if="emergencyContact" type="primary" size="large" style="flex: 1; min-height: 52px;" @click="callNumber(emergencyContact)">
            联系家人
          </a-button>
          <a-button size="large" style="min-height: 52px;" @click="showModal = false">
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showModal = ref(false)
const emergencyContact = ref('')

// 保存引用以便 onUnmounted 中移除
function handleStorageChange(e) {
  if (e.key === 'elderly_emergency_contact') {
    emergencyContact.value = e.newValue || ''
  }
}

function handleContactUpdated() {
  emergencyContact.value = localStorage.getItem('elderly_emergency_contact') || ''
}

onMounted(() => {
  const contact = localStorage.getItem('elderly_emergency_contact')
  if (contact) {
    emergencyContact.value = contact
  }
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('elderly-contact-updated', handleContactUpdated)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('elderly-contact-updated', handleContactUpdated)
})

function callNumber(number) {
  window.location.href = `tel:${number}`
}
</script>

<style>
/* 样式在 elderly-friendly.css 中定义，这里不需要 scoped */
</style>
