# frontendのコマンドを実行
Set-Location "$PSScriptRoot/dev/frontend"
npm install
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev"

# backendのコマンドを新しいウィンドウで実行
Set-Location "$PSScriptRoot/dev/backend"
rye sync
Start-Process -FilePath "rye" -ArgumentList "run start"
