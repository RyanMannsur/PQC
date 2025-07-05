@echo off
echo === Migracao do Create React App para Vite ===
echo.

cd c:\projetos\PQC\fontes\front-end

echo Removendo node_modules e package-lock.json antigos...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Instalando novas dependencias do Vite...
npm install

echo.
echo Testando se tudo funcionou...
echo Para iniciar o projeto agora use: npm run dev
echo Para fazer build use: npm run build

echo.
echo === Migracao Concluida ===
pause
