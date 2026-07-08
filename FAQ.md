# 常见问题 (FAQ)

## 部署与启动

### Q: 启动后访问 `localhost:5173` 白屏或报 502？

确保后端 API 已就绪。执行 `docker ps` 确认 `api-dev` 容器状态为 `healthy`，必要时查看日志：

```bash
docker logs api-dev --tail 100
```

API 健康检查有 180 秒的 `start_period`，首次启动需要等待。

### Q: `docker compose up -d` 后前端容器没有启动？

默认开发模式下前端在本地运行（`pnpm dev`），不启动容器。如需全 Docker 模式：

```bash
docker compose --profile full up -d
```

### Q: 如何重置全部数据重新开始？

```bash
make reset
```

该命令会删除 `docker/volumes` 目录并重新初始化。

### Q: `.env` 文件应该怎么配置？

从 `.env.template` 复制一份，按需填入 API Key。必需配置项：

- `SILICONFLOW_API_KEY` — 大模型对话与向量化
- `TAVILY_API_KEY` — 搜索功能（可选）

数据库、Redis、MinIO 等地址在 Docker 模式下由 compose 自动注入。

## 知识库

### Q: 知识库 RAG 检索不生效？

确认以下条件：

1. 已配置 Embedding 模型（如 `BAAI/bge-m3`）
2. 知识库文件已完成解析和入库（状态为绿色）
3. Milvus 服务已启动（`docker compose up -d etcd milvus`）

未配置 Embedding 时，知识内容会嵌入 Agent 系统提示词作为临时方案。

### Q: 上传大文件或批量文件后解析很慢？

文档解析是异步任务，由 worker 处理。可通过任务中心查看进度。MinerU 和 PaddleX 需要按 `all` profile 启动：

```bash
docker compose --profile all up -d mineru-api paddlex
```

### Q: 支持哪些文档格式？

支持 Markdown、纯文本、DOCX、HTML、PDF 等格式。Office 文件中 `.docx` 和 `.pptx` 支持预览。

## 智能体

### Q: 如何创建自定义智能体？

在「智能体管理」页面点击「新建智能体」，配置系统提示词、模型、工具、Skills 和知识库。详细说明见应用内帮助页面（`/help`）。

### Q: 子智能体和主智能体有什么区别？

主智能体是用户直接对话的入口；子智能体由主智能体根据任务自动调度，完成后将结果返回给主智能体。子智能体不能直接被用户调用。

### Q: 如何启用 MCP 工具？

在「扩展管理 → MCP」中添加 MCP 服务器配置，然后在智能体配置中启用对应的 MCP 工具。

## 适老化功能

### Q: 语音输入不工作？

语音输入依赖浏览器的 Web Speech API，目前仅 Chrome 和 Edge 支持。确保浏览器有麦克风权限。

### Q: 语音朗读（TTS）没有声音？

1. 确认浏览器支持 `SpeechSynthesis` API
2. 检查系统音量
3. 部分浏览器需要用户先与页面交互后才能播放音频

### Q: 字号设置不生效？

适老化字号通过 CSS 变量控制。如果修改后不生效，尝试清除浏览器缓存或硬刷新（Ctrl+Shift+R）。

## 开发

### Q: 本地开发如何调试？

推荐使用 `dev.ps1`（Windows）或直接 `docker compose up -d` 启动基础设施和后端，前端本地 `pnpm dev`。后端和前端均支持热重载。

### Q: 如何运行测试？

```bash
make test          # 全部测试
make test-unit     # 单元测试
make test-integration  # 集成测试
```

测试需要在 Docker 容器中运行，确保 `api-dev` 容器已启动。

### Q: 如何提交代码？

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解提交流程和规范。

## 更多问题

- 提交 Issue：<https://github.com/LPK3215/silver-guardian-v2/issues>
- 功能讨论：<https://github.com/LPK3215/silver-guardian-v2/discussions>
