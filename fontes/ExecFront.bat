@echo off
cd backend
start python app.py

cd ../front-end
npm start

timeout /t 2 > nul
start chrome http://localhost:5173/Login