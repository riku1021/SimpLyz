# Ryeのインストール

ここから[install](https://rye.astral.sh/)する

手順

1. rye-x86_64-windows.exe for 64bit Intel Windowsをダウンロード
2. インストール(途中にUVか否か選ぶ箇所あるがそのままEnter)
3. pythonのバージョン指定で3.10を選ぶ(このプロジェクトを3.10で設定したため)
4. cmdでryeと入力してエラーが出なければOK

# 依存関係の同期

```bash
rye sync
```

# その他のコマンド

```bash
rye add [パッケージ名]  # パッケージを追加する
```

```bash
rye remove [パッケージ名]  # パッケージを削除する
```

```bash
rye --version  # バージョンの確認
```

# 参考文献

[話題のRyeについて調べてみた](https://qiita.com/hiseumn/items/5baa2eb44885dffc9bac#:~:text=%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%A7%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8BPython%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%92%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%BE%E3%81%99%E3%80%82%20terminal%20rye,use%20%3CPython%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%3E%20%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%A8%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%20%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%A8%E3%81%9D%E3%81%AE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%97%E3%81%BE%E3%81%99%E3%80%82)