# Nodeの公式イメージを利用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# Viteアプリをビルド
RUN npm run build

# Viteのサーバーを開始
CMD ["npm", "run", "dev"]
