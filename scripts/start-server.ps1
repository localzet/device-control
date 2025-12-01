# Скрипт запуска сервера управления

Write-Host "=== Android Manage Server ===" -ForegroundColor Cyan

# Проверка Node.js
Write-Host "`n[1/3] Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green

# Проверка зависимостей
Write-Host "`n[2/3] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Dependencies OK" -ForegroundColor Green

# Получение IP адреса
Write-Host "`n[3/3] Getting server IP..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress
if (-not $ipAddress) {
    $ipAddress = "localhost"
}
Write-Host "Server IP: $ipAddress" -ForegroundColor Green
Write-Host "Web interface: http://$ipAddress`:22533" -ForegroundColor Cyan
Write-Host "Socket.IO port: 22222" -ForegroundColor Cyan

# Запуск сервера
Write-Host "`n=== Starting Server ===" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Gray

$env:SERVER_IP = $ipAddress
node index.js

