"""后端本地启动脚本 — 解决 Windows ProactorEventLoop 兼容问题"""
import asyncio
import sys
import os

# 必须在 uvicorn 创建事件循环之前设置
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import uvicorn

if __name__ == "__main__":
    # 先跑一次不 reload 确认基本逻辑 OK
    reload_mode = "--reload" in sys.argv
    uvicorn.run(
        "server.main:app",
        host="127.0.0.1",
        port=5050,
        reload=reload_mode,
        reload_dirs=["server", "package"] if reload_mode else None,
        loop="asyncio",  # 强制 SelectorEventLoop
    )
