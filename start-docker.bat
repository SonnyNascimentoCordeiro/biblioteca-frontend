@echo off
echo ========================================
echo    Biblioteca Frontend - Docker
echo ========================================
echo.

:menu
echo Escolha uma opcao:
echo 1. Desenvolvimento (porta 9000)
echo 2. Producao (porta 80)
echo 3. Parar todos os servicos
echo 4. Limpar tudo
echo 5. Ver logs
echo 6. Sair
echo.
set /p choice="Digite sua escolha (1-6): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto clean
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto exit
goto menu

:dev
echo.
echo Iniciando ambiente de DESENVOLVIMENTO...
echo Acesse: http://localhost:9000
echo.
npm run docker:dev
goto menu

:prod
echo.
echo Iniciando ambiente de PRODUCAO...
echo Acesse: http://localhost:80
echo.
npm run docker:prod
goto menu

:stop
echo.
echo Parando todos os servicos...
npm run docker:stop
echo.
pause
goto menu

:clean
echo.
echo Limpando tudo...
npm run docker:clean
echo.
pause
goto menu

:logs
echo.
echo Mostrando logs (Ctrl+C para sair)...
npm run docker:logs
goto menu

:exit
echo.
echo Saindo...
exit
