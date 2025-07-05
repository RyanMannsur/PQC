@echo off
echo ========================================
echo    PQC - Setup Automatico com Docker
echo ========================================
echo.

echo [1/4] Parando containers existentes...
docker-compose down -q

echo [2/4] Construindo e iniciando containers...
docker-compose up --build -d

echo [3/4] Aguardando inicializacao...
timeout /t 10 /nobreak >nul

echo [4/4] Verificando status...
docker-compose ps

echo.
echo ========================================
echo           SETUP CONCLUIDO!
echo ========================================
echo.
echo   Frontend: http://localhost:3001
echo   Backend:  http://localhost:8088
echo   Banco:    localhost:5432
echo.
echo Para ver logs:         docker-compose logs -f
echo Para parar:           docker-compose down
echo Para reset completo:  docker-compose down -v
echo.

:: Tentar abrir o navegador automaticamente
start http://localhost:3001 2>nul

echo Pressione qualquer tecla para ver os logs...
pause >nul

echo.
echo === LOGS DO SISTEMA ===
docker-compose logs --tail=20
