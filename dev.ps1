# ============================================
# 银发守护 - 本地开发一键启动脚本
# ============================================
# 用法：
#   .\dev.ps1          启动全部（Docker服务 + 后端 + 前端）
#   .\dev.ps1 docker   仅启动 Docker 服务
#   .\dev.ps1 backend  仅启动后端
#   .\dev.ps1 frontend 仅启动前端
#   .\dev.ps1 stop     停止所有
# ============================================

param([string]$Action = "all")

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Start-DockerServices {
    Write-Host "`n[1/3] 启动 Docker 服务 (Redis + MinIO + Sandbox)..." -ForegroundColor Cyan
    cd $ProjectRoot
    docker compose -f docker-compose.dev.yml up -d
    Write-Host "Docker 服务已启动" -ForegroundColor Green
}

function Start-Backend {
    Write-Host "`n[2/3] 启动后端 API (localhost:5050)..." -ForegroundColor Cyan
    cd "$ProjectRoot\backend"
    $env:RUNNING_IN_DOCKER = ""
    Start-Process -NoNewWindow -FilePath "python" -ArgumentList "run_dev.py","--reload" -WorkingDirectory "$ProjectRoot\backend"
    Write-Host "后端已启动: http://localhost:5050" -ForegroundColor Green
}

function Start-Frontend {
    Write-Host "`n[3/3] 启动前端 (localhost:5173)..." -ForegroundColor Cyan
    cd "$ProjectRoot\web"
    Start-Process -NoNewWindow -FilePath "pnpm" -ArgumentList "run","dev" -WorkingDirectory "$ProjectRoot\web"
    Write-Host "前端已启动: http://localhost:5173" -ForegroundColor Green
}

function Stop-All {
    Write-Host "`n停止所有服务..." -ForegroundColor Yellow
    # 停 Docker
    cd $ProjectRoot
    docker compose -f docker-compose.dev.yml down 2>$null
    # 停后端
    $be = Get-NetTCPConnection -LocalPort 5050 -ErrorAction SilentlyContinue
    if ($be) { Stop-Process -Id $be.OwningProcess -Force -ErrorAction SilentlyContinue }
    # 停前端
    $fe = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($fe) { Stop-Process -Id $fe.OwningProcess -Force -ErrorAction SilentlyContinue }
    Write-Host "全部已停止" -ForegroundColor Green
}

switch ($Action) {
    "docker"   { Start-DockerServices }
    "backend"  { Start-Backend }
    "frontend" { Start-Frontend }
    "stop"     { Stop-All }
    default {
        Start-DockerServices
        Start-Sleep -Seconds 3
        Start-Backend
        Start-Sleep -Seconds 2
        Start-Frontend
        Write-Host "`n========================================" -ForegroundColor Magenta
        Write-Host "  银发守护已启动" -ForegroundColor Magenta
        Write-Host "  前端: http://localhost:5173" -ForegroundColor White
        Write-Host "  后端: http://localhost:5050" -ForegroundColor White
        Write-Host "========================================`n" -ForegroundColor Magenta
    }
}
