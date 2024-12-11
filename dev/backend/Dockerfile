FROM python:3.10.15-alpine3.20

# ビルドに必要なパッケージをインストール
RUN apk add --no-cache gcc g++ python3-dev musl-dev linux-headers

# 日本語フォントのインストール
RUN apk add --no-cache font-noto-cjk

RUN pip install uv

WORKDIR /app

COPY . .

RUN uv pip install --no-cache --system -r requirements.lock

CMD ["python", "app.py"]
