# Simplyz

## Dockerコンテナでの起動
~/devで実行（Docker Desktopを起動後）
```sh
docker-compose up --build
```

## パッケージインストール
### フロントエンド
~/dev/frontendで実行
```sh
npm i
```

### バックエンド
~/dev/backendで実行
```sh
rye sync
```

## Webアプリの起動
### フロントエンドの起動
~/dev/frontendで実行
```sh
npm run dev
```

### バックエンドの起動
~/dev/frontendで実行
```sh
rye run start
```

### データベースの起動
~/dev/frontendで実行
```sh
go run .
```

## キーの指定
~/dev/backendに.envファイルを作成して以下を記述
```txt
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
