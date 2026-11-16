@echo off
title Nexus Egy
cd /d "%~dp0"

:: 1. Se o aplicativo oficial Electron estiver configurado localmente
if exist "%~dp0node_modules\electron" (
    start "" npx electron .
    exit
)

:: 2. Se o aplicativo oficial do PC estiver instalado
if exist "%LocalAppData%\Programs\nexus-egy\Nexus Egy.exe" (
    start "" "%LocalAppData%\Programs\nexus-egy\Nexus Egy.exe"
    exit
)

:: 3. Se houver executavel na mesma pasta
if exist "%~dp0Nexus Egy.exe" (
    start "" "%~dp0Nexus Egy.exe"
    exit
)

:: 4. Servidor local Python integrado com suporte completo a emuladores
start "" python serve.py
timeout /t 1 /nobreak >nul
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:8080/ --start-maximized
    exit
)
start http://localhost:8080/
exit
