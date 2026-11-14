@echo off
title Nexus Egy - Universal Gaming System
color 06
echo ========================================================
echo                 NEXUS EGY - INICIALIZANDO
echo ========================================================
echo.
echo Iniciando motor e interface do console...
cd /d "%~dp0"

start /b python "%~dp0serve.py" >nul 2>&1
timeout /t 2 /nobreak >nul

:: Abrir no modo aplicativo exclusivo (tela limpa estilo console)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:8080/ --start-maximized
    exit
)

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=http://localhost:8080/ --start-maximized
    exit
)

if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app=http://localhost:8080/ --start-maximized
    exit
)

:: Caso nao ache Edge ou Chrome nos caminhos comuns, abre no navegador padrao
start http://localhost:8080/
exit
