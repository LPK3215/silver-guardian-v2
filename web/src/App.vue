<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useAgentStore } from '@/stores/agent'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { onMounted } from 'vue'
import DemoNotice from '@/demo/DemoNotice.vue'

const agentStore = useAgentStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

onMounted(async () => {
  if (userStore.isLoggedIn) {
    await agentStore.initialize()
  }
})
</script>

<template>
  <a-config-provider :theme="themeStore.currentTheme" :locale="zhCN">
    <router-view />
    <!-- Demo 模式提示弹窗 -->
    <DemoNotice v-if="isDemoMode" />
  </a-config-provider>
</template>
