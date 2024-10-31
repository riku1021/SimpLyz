# dev.ps1
# frontendのコマンドを実行
cd "$PSScriptRoot/dev/frontend"
npm install
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"

# backendのコマンドを実行
cd "$PSScriptRoot/dev/backend"
Start-Process -NoNewWindow -FilePath "rye" -ArgumentList "run start"
