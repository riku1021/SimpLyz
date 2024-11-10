# ビルドステージ
FROM debian:bullseye-slim as builder

# 作業ディレクトリを指定
WORKDIR /opt

# ryeとパスの設定
ENV RYE_HOME="/opt/rye"
ENV PATH="$RYE_HOME/shims:$PATH"

# 必要パッケージのインストールと証明書の更新
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl && \
    update-ca-certificates

# ryeのインストール (SSL検証を無効化)
SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]
RUN curl -sSf https://rye.astral.sh/get | RYE_INSTALL_OPTION="--yes" bash && \
    rye config --set-bool behavior.global-python=false && \
    rye config --set-bool behavior.use-uv=true

# Pythonバージョンの確認と依存関係のインストール
COPY ./.python-version ./pyproject.toml ./requirements* ./README.md ./
RUN echo "Python version specified in .python-version:" && cat .python-version && \
    rye pin "$(cat .python-version)" && \
    rye sync

# ランタイムステージ
FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /opt/rye /opt/rye
COPY --from=builder /opt/pyproject.toml /app/

# 環境変数の再設定とSSL検証無効化の設定
ENV RYE_HOME="/opt/rye"
ENV PATH="$RYE_HOME/shims:$PATH"
ENV PYTHONUNBUFFERED=True
ENV RYE_SSL_NO_VERIFY=true

# アプリケーションファイルのコピー
COPY . /app

# ryeでバックエンドを立ち上げる
CMD ["rye", "run", "python", "/app/app.py"]
