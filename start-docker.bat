@echo off
echo ========================================
echo    Biblioteca Frontend - Docker
echo ========================================
echo.
echo Iniciando ambiente Docker...
echo.

REM Verificar se o Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker não está rodando!
    echo Por favor, inicie o Docker Desktop primeiro.
    echo.
    pause
    exit /b 1
)

echo Docker está rodando! 
echo.
echo Iniciando ambiente de DESENVOLVIMENTO...
echo Frontend: http://localhost:9000
echo Backend: http://localhost:8090 (seu backend separado)
echo.
docker-compose up --build

echo.
pause
