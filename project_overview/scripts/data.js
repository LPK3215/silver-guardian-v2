/* ═══════════════════════════════════════════════
   Data — 项目全量数据（唯一数据源）
   ═══════════════════════════════════════════════ */

const PROJECT_DATA = {
  meta: {
    name: "银发守护",
    fullName: "银发守护 —— 智慧养老 AI 助手",
    tagline: "用 AI 守护每一位长者的晚年生活",
    version: "0.7.1.beta1",
    license: "MIT",
  },

  stats: [
    { value: "6", label: "内置技能" },
    { value: "18", label: "API 路由模块" },
    { value: "13", label: "前端页面" },
    { value: "68", label: "Vue 组件" },
    { value: "4", label: "养老智能体" },
    { value: "3", label: "测试层级" },
    { value: "7+", label: "基础设施服务" },
    { value: "12", label: "组合式逻辑" }
  ],

  features: {
    chat: {
      title: "AI 对话",
      icon: "💬",
      color: "#42b883",
      items: [
        "4 个养老场景智能体：银发健康顾问、养老政策助手、护理知识助手、生活陪伴",
        "多模型支持：DeepSeek、SiliconFlow、OpenAI 兼容 API、Anthropic",
        "子智能体调度：主智能体自动委派子智能体完成专项任务",
        "快捷问题入口：无对话时展示常见问题，降低使用门槛",
        "历史对话搜索：命令面板式搜索，方向键选择与快速跳转",
        "代码块复制、图片全屏预览、HTML 可视化预览"
      ]
    },
    knowledge: {
      title: "知识库",
      icon: "📚",
      color: "#2196f3",
      items: [
        "4 份养老领域文档：政策法规、健康管理、护理规范、防诈骗指南",
        "RAG 检索增强：语义检索 + BM25 混合检索，回答附带来源引用",
        "知识图谱：基于 Neo4j 构建实体关系图谱，可视化浏览",
        "思维导图：自动生成知识库文件结构思维导图，支持增量更新",
        "多格式解析：Markdown / DOCX / PDF / HTML + MinerU / PaddleOCR / RapidOCR",
        "大规模文件管理：目录懒加载、服务端分页、批量解析/入库"
      ]
    },
    elderly: {
      title: "适老化设计",
      icon: "👴",
      color: "#f59e0b",
      items: [
        "大字号高对比度界面：标准 / 大字 / 超大字三档切换",
        "多色主题：琥珀（默认）、海蓝、翠绿、青碧四套色系",
        "语音输入：Web Speech API 语音转文字，老人可以直接说",
        "语音朗读（TTS）：AI 回复一键朗读，自动朗读模式，Markdown 转纯文本",
        "紧急求助按钮：浮动 SOS，一键拨打 120/110/紧急联系人",
        "紧急关键词检测：7 类急症关键词自动识别并弹窗提醒"
      ]
    },
    platform: {
      title: "平台能力",
      icon: "⚙️",
      color: "#a855f7",
      items: [
        "CLI 工具：yuxi 命令行支持远程连接、浏览器/API Key 登录、知识库批量上传",
        "多租户权限：superadmin / admin / 普通用户三级角色，部门隔离",
        "MCP 集成：Model Context Protocol 工具扩展",
        "品牌定制：名称、Logo、主题色、登录背景可配置",
        "任务中心：后台作业实体化，只读进度面板",
        "Agent 评估：RAG 评估与基准测试",
        "安全加固：CORS 配置、API Key 绑定用户、JWT 行锁"
      ]
    }
  },

  skills: [
    { name: "elderly-assessment", desc: "老年人综合评估（ADL、MMSE、跌倒风险、营养状况、情绪状态）", version: "2026.07.08", custom: true },
    { name: "care-plan-generator", desc: "个性化护理计划生成（日常安排、饮食方案、运动方案、用药管理）", version: "2026.07.08", custom: true },
    { name: "deep-research", desc: "深度研究编排：澄清范围、拆解规划、并行调度、对抗式核验、综合报告", version: "2026.06.05", custom: false },
    { name: "knowledge-base", desc: "知识库检索、文档定位、思维导图查看", version: "2026.06.24", custom: false },
    { name: "image-gen", desc: "Agent 沙盒图片生成，支持 Qwen-Image", version: "2026.06.02", custom: false },
    { name: "mysql-reporter", desc: "MySQL 查询报表和可视化图表", version: "2026.06.05", custom: false }
  ],

  techStack: [
    { layer: "前端框架", tech: "Vue 3 + Ant Design Vue + Vite + Pinia", version: "Vue 3.5+ / Vite 8+" },
    { layer: "后端框架", tech: "FastAPI + uv", version: "Python 3.12+" },
    { layer: "智能体框架", tech: "LangGraph v1 + DeepAgents", version: "LangGraph 1.0+" },
    { layer: "大模型", tech: "DeepSeek-V4-Flash · OpenAI 兼容 · Anthropic", version: "SiliconFlow 托管" },
    { layer: "向量数据库", tech: "Milvus", version: "v2.5.6" },
    { layer: "图数据库", tech: "Neo4j", version: "5.26" },
    { layer: "缓存", tech: "Redis", version: "7-alpine" },
    { layer: "关系数据库", tech: "PostgreSQL", version: "16" },
    { layer: "对象存储", tech: "MinIO", version: "RELEASE.2023-03" },
    { layer: "异步任务", tech: "ARQ", version: "0.26+" },
    { layer: "文档解析", tech: "MinerU · PaddleOCR · RapidOCR", version: "按需启用" },
    { layer: "部署", tech: "Docker Compose", version: "—" }
  ],

  structure: `silver-guardian-yuxi/
├── README.md                              本文档
├── LICENSE                                MIT 许可证
├── CONTRIBUTING.md                        贡献指南
├── FAQ.md                                 常见问题
├── SECURITY.md                            安全策略
├── ARCHITECTURE.md                        架构代码地图
├── DEPLOYMENT.md                          部署指南
├── Makefile                               构建/测试/格式化命令
├── dev.ps1                                本地开发一键启动脚本
├── docker-compose.yml                     Docker 编排
├── .env.template                          环境变量模板
├── knowledge_docs/                        养老知识文档（4 份）
├── docs/                                  VitePress 文档站
│   ├── architecture.svg                   系统架构图
│   ├── scripts/generate_architecture.py   架构图生成脚本
│   ├── intro/                             快速入门
│   ├── agents/                            智能体文档
│   ├── advanced/                          高级配置
│   └── develop-guides/                    开发规范
├── backend/                               后端
│   ├── server/                            FastAPI HTTP 适配层
│   │   ├── routers/                       18 个领域路由
│   │   ├── utils/                         认证/生命周期/日志
│   │   └── worker_main.py                 Worker 入口
│   ├── package/yuxi/                      核心业务包
│   │   ├── agents/                        LangGraph 智能体
│   │   ├── services/                      21 个服务模块
│   │   ├── repositories/                  数据库访问层
│   │   ├── knowledge/                     知识库与图谱
│   │   ├── models/                        LLM 模型适配
│   │   ├── storage/                       PG / MinIO / Redis
│   │   └── config/                        配置与品牌信息
│   └── test/                              unit / integration / e2e
└── web/                                   前端
    └── src/
        ├── views/                         13 个页面
        ├── components/                    68 个组件
        ├── composables/                   12 个组合式逻辑
        ├── apis/                          20 个接口封装
        ├── stores/                        Pinia 状态管理
        └── assets/css/                    全局样式`,

  versions: [
    { version: "v0.7.1", desc: "CLI 工具、知识库大规模优化、多色主题、安全加固", current: true },
    { version: "v0.4.0", desc: "语音朗读(TTS) + 稳定性加固" },
    { version: "v0.3.0", desc: "适老化界面 + 紧急求助 + 语音输入 + 快捷问题" },
    { version: "v0.2.0", desc: "4 个养老智能体 + 知识库 + 子智能体 + Skills" },
    { version: "v0.1.0", desc: "项目初始化，品牌定制，Docker 部署" }
  ],

  commands: [
    { cmd: "make up", desc: "Docker 启动（后端 + 基础设施）" },
    { cmd: "make format", desc: "格式化后端 + 前端代码" },
    { cmd: "make lint", desc: "静态检查（不修复）" },
    { cmd: "make test", desc: "运行全部测试" },
    { cmd: "make test-unit", desc: "运行单元测试" },
    { cmd: "make test-integration", desc: "运行集成测试" },
    { cmd: "make test-e2e", desc: "运行端到端测试" },
    { cmd: "make seed", desc: "初始化种子用户" },
    { cmd: "make reset", desc: "重置全部数据并重新初始化" },
    { cmd: "make down", desc: "停止全部容器" }
  ]
};
