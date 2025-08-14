@echo off
echo ========================================
echo    Teste do Ambiente Docker
echo ========================================
echo.

REM Verificar se o Docker está rodando
echo Verificando Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Docker não está rodando!
    echo Por favor, inicie o Docker Desktop primeiro.
    echo.
    pause
    exit /b 1
)
echo ✅ Docker está rodando!

REM Verificar se o docker-compose está disponível
echo.
echo Verificando Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERRO: Docker Compose não está disponível!
    echo Por favor, instale o Docker Compose.
    echo.
    pause
    exit /b 1
)
echo ✅ Docker Compose está disponível!

REM Verificar se os arquivos necessários existem
echo.
echo Verificando arquivos necessários...
if not exist "docker-compose.yml" (
    echo ❌ ERRO: docker-compose.yml não encontrado!
    pause
    exit /b 1
)
echo ✅ docker-compose.yml encontrado!

if not exist "Dockerfile" (
    echo ❌ ERRO: Dockerfile não encontrado!
    pause
    exit /b 1
)
echo ✅ Dockerfile encontrado!

if not exist "docker.env" (
    echo ❌ ERRO: docker.env não encontrado!
    pause
    exit /b 1
)
echo ✅ docker.env encontrado!

REM Verificar se as portas estão livres
echo.
echo Verificando portas...
netstat -an | findstr ":9000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 9000 está em uso
) else (
    echo ✅ Porta 9000 está livre
)

netstat -an | findstr ":8090" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Porta 8090 está em uso
) else (
    echo ✅ Porta 8090 está livre
)

echo.
echo ========================================
echo    ✅ Ambiente Docker OK!
echo ========================================
echo.
echo Agora você pode executar:
echo   start-docker.bat
echo.
echo Ou usar o comando:
echo   docker-compose up --build
echo.
pause
