@echo off
start cmd /k "cd ./dev/frontend && npm i && npm start"
start cmd /k "cd ./dev/backend && rye run start"
