# 银发守护 —— 智慧养老 AI 助手

> 面向养老场景的 AI 对话与知识库问答系统。

## 项目概述

银发守护是一个为老年人及其照护者设计的 AI 智能助手平台，提供健康咨询、政策解读、护理知识和生活陪伴等服务。系统集成 DeepSeek 大模型，并针对老年用户的使用习惯进行了适老化改造。

## 核心功能

### AI 对话

- **4 个养老场景智能体**：银发健康顾问、养老政策助手、护理知识助手、生活陪伴
- **DeepSeek 大模型驱动**：自然语言对话，理解老年人表达习惯
- **快捷问题入口**：无对话时展示常见问题，降低使用门槛

### 知识库

- **4 份养老领域文档**：政策法规、健康管理、护理规范、防诈骗指南
- **RAG 检索增强**（需配置 Embedding API）：从知识库中语义检索相关内容，回答附带来源引用
- **临时方案**：未配置 Embedding 前，知识内容已嵌入 Agent 系统提示词

### 适老化设计

- **大字号高对比度界面**：CSS 变量控制，可切换标准/大字/超大字三档
- **语音输入**：Web Speech API 语音转文字，老人可直接说
- **语音朗读（TTS）**：AI 回复可一键朗读，支持自动朗读模式，Markdown 自动转纯文本
- **紧急求助按钮**：浮动 SOS 按钮，一键拨打 120/110/紧急联系人
- **紧急关键词检测**：7 类急症关键词（心血管、脑血管、跌倒、呼吸、意识、出血、心理危机）自动识别并弹窗提醒

### 自定义技能

- **elderly-assessment**：老年人综合评估（ADL、MMSE、跌倒风险、营养状况、情绪状态）
- **care-plan-generator**：个性化护理计划生成（日常安排、饮食方案、运动方案、用药管理）

### 基础设施

- Docker Compose 一键部署
- PostgreSQL + Redis + Milvus + MinIO 全套服务
- 多租户权限管理
- 品牌定制（名称、Logo、主题色）

## 快速开始

### 1. 环境要求

- Docker Desktop（含 Docker Compose）
- DeepSeek API Key（[获取地址](https://platform.deepseek.com)）
- SiliconFlow API Key（可选，用于知识库向量化，[获取地址](https://siliconflow.cn)，`BAAI/bge-m3` 免费版）

### 2. 配置

编辑 `.env` 文件：

```env
# 必需 - 大模型对话
DEEPSEEK_API_KEY=sk-你的key

# 可选 - 知识库向量化（不配则知识内容嵌入提示词）
SILICONFLOW_API_KEY=sk-你的key

# 数据库（本地开发用 localhost）
POSTGRES_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/yuxi
REDIS_URL=redis://localhost:6379/0
MINIO_URI=http://localhost:9000

# 品牌配置
YUXI_BRAND_FILE_PATH=package/yuxi/config/static/info.local.yaml
LITE_MODE=false
```

### 3. 启动

#### 方式一：本地开发模式（推荐，内存占用 ~2GB）

前端和后端跑在本地，仅 Redis/MinIO/Sandbox 走 Docker：

```powershell
# 一键启动
.\dev.ps1

# 或分步启动
.\dev.ps1 docker       # 启动 Docker 服务
.\dev.ps1 backend     # 启动后端 (localhost:5050)
.\dev.ps1 frontend    # 启动前端 (localhost:5173)
.\dev.ps1 stop        # 停止全部
```

#### 方式二：全 Docker 模式（服务器部署用）

```powershell
docker compose up -d postgres redis minio sandbox-provisioner api worker web
```

需要知识库 RAG 时加上 Milvus：
```powershell
docker compose up -d etcd milvus
```

访问 `http://localhost:5173` 即可使用。

### 4. 首次配置

1. 设置管理员账号密码
2. 系统设置 → 模型配置 → 启用 SiliconFlow → 确认 API Key → 默认模型为 `deepseek-ai/DeepSeek-V4-Flash`
3. （可选）启用 SiliconFlow → 填入 API Key → 添加 `BAAI/bge-m3` 作为 Embedding 模型
4. 智能体管理 → 确认 4 个养老智能体已就绪
5. 开始对话

## 项目结构

```
silver-guardian-yuxi/
├── README.md                              # 本文档
├── .env                                   # 环境变量
├── dev.ps1                                # 本地开发一键启动脚本
├── docker-compose.yml                     # Docker 编排（后端+基础设施，前端本地运行）
├── knowledge_docs/                        # 养老知识文档
│   ├── 老年人权益保障法要点.md
│   ├── 老年慢性病日常管理指南.md
│   ├── 老年人护理操作规范.md
│   └── 老年人防诈骗安全指南.md
├── backend/                               # 后端（FastAPI）
│   ├── run_dev.py                         # 本地启动脚本（解决 Windows 事件循环问题）
│   └── package/yuxi/
│       ├── agents/skills/buildin/
│       │   ├── elderly-assessment/        # 自定义技能：老年评估
│       │   │   └── SKILL.md
│       │   ├── care-plan-generator/       # 自定义技能：护理计划
│       │   │   └── SKILL.md
│       │   └── __init__.py                # 技能注册
│       └── config/static/
│           └── info.local.yaml            # 银发守护品牌配置
└── web/                                   # 前端（Vue 3 + Ant Design Vue）
    └── src/
        ├── components/
        │   ├── AgentMessageComponent.vue  # 消息组件（含 TTS 朗读按钮）
        │   ├── AgentChatComponent.vue     # 对话主组件（含语音输入/快捷问题/紧急检测）
        │   ├── ElderlyEmergencyButton.vue # 紧急求助 SOS 按钮
        │   └── ElderlySettingsModal.vue   # 适老化设置弹窗
        ├── composables/
        │   ├── useTTS.js                  # 语音朗读（SpeechSynthesis API）
        │   └── useVoiceInput.js           # 语音输入（Web Speech API）
        ├── utils/
        │   └── emergencyDetector.js       # 紧急关键词检测
        └── assets/css/
            └── elderly-friendly.css        # 适老化样式（scoped to .agent-page）
```

## 自定义代码清单

以下是对原始代码的改动，均经过稳定性审查：

| 文件 | 类型 | 说明 |
|------|------|------|
| `useTTS.js` | 新增 | 浏览器 TTS，含 Chrome 15s 暂停修复、语音异步加载、单例播放 |
| `useVoiceInput.js` | 新增 | 浏览器 STT，含 onstart 回调、事件监听清理 |
| `emergencyDetector.js` | 新增 | 7 类急症关键词匹配，输入校验 |
| `ElderlyEmergencyButton.vue` | 新增 | SOS 浮动按钮，事件监听在 onUnmounted 中清理 |
| `ElderlySettingsModal.vue` | 新增 | 紧急联系人/字号/自动朗读设置，localStorage 持久化 |
| `elderly-friendly.css` | 新增 | 适老化样式，通过 `.agent-page` scope 限定不影响管理端 |
| `AgentMessageComponent.vue` | 修改 | 添加 TTS 朗读按钮，watch 监听消息完成触发自动朗读 |
| `AgentChatComponent.vue` | 修改 | 集成语音输入、快捷问题、紧急检测、设置入口 |
| `AppLayout.vue` | 修改 | 添加 `.agent-page` class |
| `info.local.yaml` | 新增 | 银发守护品牌配置 |
| `skills/__init__.py` | 修改 | 注册 elderly-assessment 和 care-plan-generator 技能 |
| `elderly-assessment/SKILL.md` | 新增 | 老年评估技能定义 |
| `care-plan-generator/SKILL.md` | 新增 | 护理计划技能定义 |
| `knowledge_docs/*.md` | 新增 | 4 份养老领域知识文档 |

## 待办事项

- [ ] 配置 SiliconFlow API Key 后，重新索引知识库以启用完整 RAG 检索

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Vue 3 + Ant Design Vue + Vite |
| 后端 | FastAPI + Python 3.11+ |
| 框架 | LangGraph + LightRAG |
| 大模型 | DeepSeek-V4-Flash (SiliconFlow) |
| 向量数据库 | Milvus |
| 缓存 | Redis |
| 数据库 | PostgreSQL |
| 对象存储 | MinIO |
| 部署 | Docker Compose |

## 版本历史

| 版本 | 说明 |
|------|------|
| v0.1.0 | 项目初始化，品牌定制，Docker 部署 |
| v0.2.0 | 4 个养老智能体 + 知识库文档 + 子智能体调度 + 自定义 Skills |
| v0.3.0 | 适老化界面 + 紧急求助识别 + 语音输入 + 快捷问题 + 设置页 |
| v0.4.0 | 语音朗读(TTS) + 稳定性加固 |
