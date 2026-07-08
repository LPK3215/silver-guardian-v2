#!/usr/bin/env python3
"""生成银发守护系统架构图 SVG。

用途：生成项目 README 中引用的系统架构概览 SVG。
依赖：无（纯字符串拼接生成 SVG）。
运行方式：python docs/scripts/generate_architecture.py
输出路径：docs/architecture.svg
"""

from __future__ import annotations

import textwrap
from pathlib import Path

# ── 调色板 ──────────────────────────────────────────────
C_BG = "#0d1117"          # 画布背景
C_CARD = "#161b22"        # 卡片背景
C_BORDER = "#30363d"      # 卡片边框
C_TEXT = "#e6edf3"        # 主文字
C_TEXT_DIM = "#8b949e"    # 次要文字
C_FRONTEND = "#42b883"    # Vue 绿
C_BACKEND = "#009688"     # FastAPI 青绿
C_WORKER = "#ab47bc"      # Worker 紫
C_DATA = "#2196f3"        # 数据层蓝
C_INFRA = "#ff9800"       # 基础设施橙
C_EXTERNAL = "#607d8b"    # 外部服务灰蓝
C_ARROW = "#58a6ff"       # 箭头蓝


def _card(
    x: int, y: int, w: int, h: int,
    title: str, subtitle: str = "",
    color: str = C_CARD, border: str = C_BORDER,
    title_color: str = C_TEXT,
) -> str:
    """生成一个圆角矩形卡片。"""
    parts = [
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" '
        f'fill="{color}" stroke="{border}" stroke-width="1.5"/>',
        f'<text x="{x + w // 2}" y="{y + 24}" text-anchor="middle" '
        f'font-size="14" font-weight="600" fill="{title_color}">{title}</text>',
    ]
    if subtitle:
        for i, line in enumerate(subtitle.split("\n")):
            parts.append(
                f'<text x="{x + w // 2}" y="{y + 44 + i * 16}" text-anchor="middle" '
                f'font-size="11" fill="{C_TEXT_DIM}">{line}</text>'
            )
    return "\n".join(parts)


def _arrow(x1: int, y1: int, x2: int, y2: int, label: str = "") -> str:
    """生成一条带箭头的连线。"""
    parts = [
        f'<defs><marker id="ah-{x1}{y1}{x2}{y2}" markerWidth="8" markerHeight="8" '
        f'refX="7" refY="4" orient="auto">'
        f'<path d="M0,0 L8,4 L0,8 z" fill="{C_ARROW}"/></marker></defs>',
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
        f'stroke="{C_ARROW}" stroke-width="1.5" stroke-dasharray="4,3" '
        f'marker-end="url(#ah-{x1}{y1}{x2}{y2})"/>',
    ]
    if label:
        mx, my = (x1 + x2) // 2, (y1 + y2) // 2
        parts.append(
            f'<text x="{mx + 4}" y="{my - 4}" font-size="10" fill="{C_TEXT_DIM}">{label}</text>'
        )
    return "\n".join(parts)


def generate_svg() -> str:
    W, H = 880, 680

    layers: list[str] = []

    # ── 背景 ──
    layers.append(f'<rect width="{W}" height="{H}" fill="{C_BG}"/>')

    # ── 标题 ──
    layers.append(
        f'<text x="{W // 2}" y="30" text-anchor="middle" '
        f'font-size="18" font-weight="700" fill="{C_TEXT}">银发守护 — 系统架构</text>'
    )

    # ── 用户层 ──
    layers.append(_card(340, 50, 200, 50, "用户浏览器", "老年人 / 照护者 / 管理员", color=C_CARD, border=C_FRONTEND))

    # ── 前端层 ──
    layers.append(_card(250, 130, 380, 60, "Vue 3 + Ant Design Vue", "对话界面 · 知识库管理 · 适老化 UI · 语音输入/TTS", color="#1a2332", border=C_FRONTEND, title_color=C_FRONTEND))

    # ── 后端 API 层 ──
    layers.append(_card(100, 230, 340, 60, "FastAPI (api-dev :5050)", "路由 · 认证 · 智能体编排 · 知识库 · 评估", color="#0d1f1c", border=C_BACKEND, title_color=C_BACKEND))

    # ── Worker 层 ──
    layers.append(_card(480, 230, 300, 60, "ARQ Worker (worker-dev)", "LangGraph 运行 · 异步任务 · 事件流", color="#1f1620", border=C_WORKER, title_color=C_WORKER))

    # ── Sandbox 层 ──
    layers.append(_card(310, 330, 260, 50, "Sandbox Provisioner", "Docker / K8s 沙盒", color="#1f1910", border=C_INFRA, title_color=C_INFRA))

    # ── 数据层标题 ──
    layers.append(
        f'<text x="440" y="420" text-anchor="middle" '
        f'font-size="13" font-weight="600" fill="{C_DATA}">数据与存储层</text>'
    )

    # ── 数据层卡片 ──
    data_cards = [
        (40, 430, 150, 60, "PostgreSQL", "业务数据\nLangGraph Checkpoint"),
        (210, 430, 130, 60, "Redis", "事件流\n队列 · 缓存"),
        (360, 430, 130, 60, "Milvus", "向量检索\nRAG"),
        (510, 430, 130, 60, "MinIO", "对象存储\n文档文件"),
        (660, 430, 170, 60, "Neo4j", "知识图谱\n实体关系"),
    ]
    for x, y, w, h, title, sub in data_cards:
        layers.append(_card(x, y, w, h, title, sub, color="#0d1622", border=C_DATA, title_color=C_DATA))

    # ── 外部 API 层 ──
    layers.append(
        f'<text x="440" y="540" text-anchor="middle" '
        f'font-size="13" font-weight="600" fill="{C_EXTERNAL}">外部服务</text>'
    )
    layers.append(_card(260, 550, 180, 50, "LLM API", "DeepSeek · SiliconFlow · OpenAI 兼容", color="#10161c", border=C_EXTERNAL, title_color=C_EXTERNAL))
    layers.append(_card(460, 550, 200, 50, "Embedding / OCR", "BAAI/bge-m3 · MinerU · PaddleOCR", color="#10161c", border=C_EXTERNAL, title_color=C_EXTERNAL))

    # ── 箭头连接 ──
    layers.append(_arrow(440, 100, 440, 130, "HTTP / SSE"))
    layers.append(_arrow(440, 190, 270, 230, "/api"))
    layers.append(_arrow(440, 190, 630, 230, "SSE 事件"))
    layers.append(_arrow(440, 260, 440, 330, "工具执行"))
    layers.append(_arrow(270, 290, 115, 430, ""))
    layers.append(_arrow(270, 290, 275, 430, ""))
    layers.append(_arrow(270, 290, 425, 430, ""))
    layers.append(_arrow(270, 290, 575, 430, ""))
    layers.append(_arrow(630, 290, 745, 430, ""))
    layers.append(_arrow(630, 290, 275, 430, ""))
    layers.append(_arrow(350, 360, 350, 550, "LLM 调用"))
    layers.append(_arrow(530, 360, 560, 550, "Embedding"))

    # ── 图例 ──
    legend_y = 625
    legend_items = [
        (C_FRONTEND, "前端"),
        (C_BACKEND, "后端 API"),
        (C_WORKER, "异步 Worker"),
        (C_INFRA, "沙盒"),
        (C_DATA, "数据层"),
        (C_EXTERNAL, "外部服务"),
    ]
    lx = 140
    for color, label in legend_items:
        layers.append(f'<rect x="{lx}" y="{legend_y}" width="12" height="12" rx="2" fill="{color}"/>')
        layers.append(
            f'<text x="{lx + 18}" y="{legend_y + 10}" font-size="11" fill="{C_TEXT_DIM}">{label}</text>'
        )
        lx += 120

    svg = textwrap.dedent(f"""\
        <?xml version="1.0" encoding="UTF-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif">
        {chr(10).join(layers)}
        </svg>""")
    return svg


if __name__ == "__main__":
    output = Path(__file__).resolve().parent.parent / "architecture.svg"
    output.write_text(generate_svg(), encoding="utf-8")
    print(f"Generated: {output}")
