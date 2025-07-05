@echo off
echo === PQC Docker Setup ===
echo.

echo Parando containers existentes...
docker-compose down

echo.
echo Removendo volumes do banco (para limpar dados antigos)...
docker volume rm pqc_pgdata 2>nul

echo.
echo Construindo e iniciando containers...
docker-compose up --build -d

echo.
echo Aguardando inicialização...
timeout /t 10 /nobreak >nul

echo.
echo Status dos containers:
docker-compose ps

echo.
echo === Logs do Backend ===
docker-compose logs backend

echo.
echo === Logs do Database ===
docker-compose logs database

echo.
echo Para acompanhar os logs em tempo real:
echo docker-compose logs -f

echo.
echo Para parar os containers:
echo docker-compose down

pause
