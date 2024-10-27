@echo off
start cmd /k "cd ./dev/frontend && npm i && npm start"
start cmd /k "cd ./dev/backend && .venv\Scripts\activate && python app.py"
