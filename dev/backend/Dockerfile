# # ビルドステージ as -> AS
# FROM debian:bullseye-slim AS builder

# # 作業ディレクトリを指定
# WORKDIR /opt

# # ryeとパスの設定
# ENV RYE_HOME="/opt/rye"
# ENV PATH="$RYE_HOME/shims:$PATH"

# # 必要パッケージのインストールと証明書の更新
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     ca-certificates \
#     curl \
#     fonts-noto-cjk && \
#     update-ca-certificates

# # ryeのインストール
# SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]
# RUN curl -sSf https://rye.astral.sh/get | RYE_INSTALL_OPTION="--yes" bash && \
#     rye config --set-bool behavior.global-python=false && \
#     rye config --set-bool behavior.use-uv=true

# # Pythonバージョンの確認と依存関係のインストール
# COPY ./.python-version ./pyproject.toml ./requirements* ./README.md ./
# RUN --mount=type=cache,target=/opt/cache \
#     echo "Python version specified in .python-version:" && cat .python-version && \
#     rye pin "$(cat .python-version)" && \
#     rye sync

# # ランタイムステージ
# FROM debian:bullseye-slim
# WORKDIR /app
# COPY --from=builder /opt/rye /opt/rye
# COPY --from=builder /opt/pyproject.toml /app/

# # 環境変数の再設定
# ENV RYE_HOME="/opt/rye"
# ENV PATH="$RYE_HOME/shims:$PATH"
# ENV PYTHONUNBUFFERED=True

# # 日本語フォントのインストール
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends fonts-noto-cjk && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# # アプリケーションファイルのコピー
# COPY . /app

# # ryeでバックエンドを立ち上げる
# CMD ["rye", "run", "python", "/app/app.py"]

FROM python:3.10.15-alpine3.20

# ビルドに必要なパッケージをインストール
RUN apk add --no-cache gcc g++ python3-dev musl-dev linux-headers

# 日本語フォントのインストール
RUN apk add --no-cache font-noto-cjk

RUN pip install uv

WORKDIR /app

COPY . .

RUN uv pip install --no-cache --system -r requirements.lock

