# バージョン管理ツール

Go にはバージョン管理ツールがある。今回は gvm というバージョン管理ツールを用いて Go の環境構築を行う

## バージョン管理ツールのインストール

```bash
sudo apt-get install bison
```

```bash
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
```

.zshrc ファイルの末尾に以下を記述する。

```bash
[[ -s "/home/{name}/.gvm/scripts/gvm" ]] && source "/home/{name}/.gvm/scripts/gvm"
```

{name}にはそれぞれの名前を記載する。

インストールした gvm のバージョンを確認する。

```bash
gvm version
```

出力例

```bash
Go Version Manager v1.0.22 installed at /home/name/.gvm
```

# Go のインストール

gvm を用いて go のインストールを行う。

```bash
gvm install go1.22.8 -B
```

gvm install go{version} -B

以上の様に go の後にバージョンを記載することで特定のバージョンの go をインストールすることができる。また、[-B]はバイナリをインストールする意味になる。[-B]無しでインストールするとエラーになる為、今回はインストールする際に記載しておく。

## go のバージョンの適応

以下のコマンドを実行することでバージョンを適応することができる。

```bash
gvm use go1.22.8 --default
```

バージョンが適応されたか確認する。

```bash
go version
```

出力例

```bash
go version go1.22.8 linux/amd64
```

## package の作成

以下のコマンドからパッケージの一覧を見ることができる。

```bash
gvm pkgset list
```

出力例

```bash
gvm go package sets (go1.22.8)

=>  global
```

package とはその名の通りパッケージなのだが、仮想環境のようなものという認識でよいと思う。

以下のコマンドからパッケージを作成する。

```bash
gvm pkgset create simplyz
```

このコマンドでは simplyz という名前のパッケージを作成した。

以下のコマンドから package の適応を行う。

```bash
gvm pkgset use simplyz
```

package が適応されたか確認する。

```bash
gvm pkgset list
```

出力

```bash
gvm go package sets (go1.22.8)

    global
=>  simplyz
```

矢印が simplyz に向いていたら適応がされた証。

# Go の起動

Go を起動するためにカレントディレクトリを[dev/database]にする。

Go を起動する前にデータベースを起動する。

```bash
brew services start postgresql@14
```

database ディレクトリ内に.env ファイルを作成し、以下を記述する。

```.env
POSTGRES_PASSWORD=admin_password
POSTGRES_USER=admin
POSTGRES_DB=simplyz
```

Go を起動する。

```bash
go run .
```

依存関係のあるパッケージは go.mod や go.sum ファイルに記載されており、[go run .]コマンドを実行することで、足りないパッケージをインストールしてくる。

localhost:8080/を叩くことで、Go が起動しているかどうか確認する。

データの受け取りが確認出来たら成功！
