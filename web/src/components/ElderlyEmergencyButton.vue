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
      :title="null"
    >
      <div style="text-align: center; padding: 8px 0;">
        <h2 style="margin-bottom: 16px;">紧急求助</h2>
        <p style="font-size: 18px; color: #666; margin-bottom: 20px;">
          如果您遇到紧急情况，请立即拨打以下电话：
        </p>

        <div class="elderly-emergency-phone">120</div>
        <p style="font-size: 16px; color: #999; margin-bottom: 16px;">急救电话</p>

        <div class="elderly-emergency-phone">110</div>
        <p style="font-size: 16px; color: #999; margin-bottom: 16px;">报警电话</p>

        <div class="elderly-emergency-phone" style="font-size: 24px;">
          {{ emergencyContact || '未设置联系人' }}
        </div>
        <p style="font-size: 16px; color: #999; margin-bottom: 24px;">
          {{ emergencyContact ? '紧急联系人' : '请在设置中添加紧急联系人电话' }}
        </p>

        <div class="elderly-emergency-actions">
          <a-button
            type="primary"
            danger
            size="large"
            @click="callEmergency('120')"
          >
            拨打120
          </a-button>
          <a-button
            v-if="emergencyContact"
            type="primary"
            size="large"
            @click="callEmergency(emergencyContact)"
          >
            联系家人
          </a-button>
          <a-button size="large" @click="showModal = false">
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showModal = ref(false)
const emergencyContact = ref('')

onMounted(() => {
  // 从 localStorage 读取紧急联系人
  const contact = localStorage.getItem('elderly_emergency_contact')
  if (contact) {
    emergencyContact.value = contact
  }
})

function callEmergency(number) {
  window.location.href = `tel:${number}`
}
</script>

<style scoped>
@import '../assets/css/elderly-friendly.css';
</style>
