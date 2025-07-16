@echo off
REM Script para executar migrações no Windows

cd /d "%~dp0"
cd fontes\backend

echo Executando migrações...
python -m migrations.cli run

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Migrações executadas com sucesso!
) else (
    echo.
    echo ✗ Erro ao executar migrações!
    pause
    exit /b 1
)

pause
