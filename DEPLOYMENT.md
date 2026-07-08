# Silver Guardian 部署指南

## 架构概览

```
本地                                       Docker
┌──────────────┐                          ┌──────────────────────────┐
│ pnpm dev     │──localhost:5173          │                          │
│ (前端)       │                          │  ┌────────────────────┐  │
└──────────────┘                          │  │ api-dev :5050      │  │
                                          │  │ (后端 API)         │  │
  localhost:5050 ────────────────────────→│  ├────────────────────┤  │
                                          │  │ worker-dev         │  │
                                          │  │ (后台任务)         │  │
                                          │  ├────────────────────┤  │
                                          │  │ postgres :5432     │  │
                                          │  │ redis :6379        │  │
                                          │  │ minio :9000        │  │
                                          │  │ sandbox :8002      │  │
                                          │  └────────────────────┘  │
                                          └──────────────────────────┘
```

- **前端**：本地运行 `pnpm dev`（热重载，改代码即时生效）
- **后端 + 基础设施**：全部在 Docker 中运行（热重载，改代码容器自动更新）

## 快速启动

### 一键启动

```powershell
.\dev.ps1
```

### 分步启动

```powershell
.\dev.ps1 docker     # 启动 Docker（后端 + PostgreSQL/Redis/MinIO/Sandbox）
.\dev.ps1 frontend   # 启动前端
```

### 停止

```powershell
.\dev.ps1 stop
```

## 环境变量

编辑 `.env` 文件：

```env
# 必填
DEEPSEEK_API_KEY=sk-your-key

# 安全
JWT_SECRET_KEY=your-secret

# 品牌
YUXI_BRAND_FILE_PATH=package/yuxi/config/static/info.local.yaml
LITE_MODE=false
```

> PostgreSQL / Redis / MinIO / Sandbox 的连接地址由 `docker-compose.yml` 自动注入 Docker 内部网络名，**不需要在 `.env` 中手动配置**。

前端连接后端通过 `web/.env.local`：

```env
VITE_API_URL=http://localhost:5050
```

## 全 Docker 模式（可选）

如果需要前端也在 Docker 中运行（如演示、部署场景）：

```powershell
docker compose --profile full up -d
```

## 数据卷

所有数据持久化在 Docker volumes 中，停止/重启不丢失：

| 数据 | 路径 |
|------|------|
| PostgreSQL | `docker/volumes/postgresql/` |
| Redis | `docker/volumes/redis/` |
| MinIO | `docker/volumes/milvus/minio/` |
| 应用数据 | `docker/volumes/yuxi/` |

## FAQ

### PostgreSQL 端口为什么是 5433？

容器内 PostgreSQL 跑在 5432，映射到宿主机 5433，避免与本机已安装的 PostgreSQL 冲突。后端在 Docker 内部直接用 `postgres:5432` 通信，不经过宿主机端口映射。

### 后端能本地运行吗？

可以，但不推荐（Windows 有事件循环兼容问题）。如需本地调试后端：

1. 取消 `.env` 中 `POSTGRES_URL` / `REDIS_URL` 等的注释，改为 `localhost` 地址
2. 用 `backend/run_dev.py --reload` 启动（不要直接 `uvicorn`）
3. 停掉 Docker 中的 api 容器：`docker compose stop api worker`
