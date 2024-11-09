# PostgreSQL とは

PostgreSQL とは、オープンソースソフトウェアの RDBMS(リレーショナルデータベース管理システム)である。

# インストール

brew を用いて postgresql をインストールする。postgresql@{version}でバージョンを指定してインストールすることができる。今回はバージョン 14 の PostgreSQL をインストールする。

```zsh
brew install postgresql@14
```

## バージョン確認

バージョンを確認するコマンドを実行して、PostgreSQL が入っているか確認する。

```zsh
psql --version
```

出力例

```zsh
psql (PostgreSQL) 14.13 (Homebrew)
```

# PostgreSQL の起動

brew を用いて PostgreSQL を起動する。

```zsh
brew services start postgresql@14
```

## 起動状況の確認

PostgreSQL が起動されているかどうか確認する。

```zsh
brew services list
```

出力例

```zsh
Name          Status  User     File
postgresql@14 started user ~/.config/systemd/user/homebrew.postgresql@14.service
unbound       none
```

# 初期設定

brew を用いて PostgreSQL の起動後、初期設定を行う。

また、sql 文を実行するため、カレントディレクトリを[dev/database/sql]としておく。

## データベースの確認

存在しているデータベースの一覧を表示する。

```zsh
psql -l
```

出力例

```zsh
   Name    |  Owner   | Encoding | Collate | Ctype |   Access privileges
-----------+----------+----------+---------+-------+-----------------------
 postgres  | name     | UTF8     | C       | C     |
 template0 | name     | UTF8     | C       | C     | =c/name          +
           |          |          |         |       | name=CTc/name
 template1 | name     | UTF8     | C       | C     | =c/name          +
           |          |          |         |       | name=CTc/name
```

## データベースに入る

sql 文を実行するためにデータベース内に入る。

初期からあるデータベースの postgres に入る。

```zsh
psql "postgresql://{Owner}@localhost/postgres"
```

{Owner}分部はデータベース一覧で出力された Owner 分部のものを記載する。

例では以下のようになる。

```zsh
psql "postgresql://name@localhost/postgres"
```

このコマンドは name ユーザーで postgres データベースに入ることを意味する。

## 管理者を作成する

管理者の名前、パスワードを明記するために管理者を一から作成する。

postgres データベース内に入ったまま以下のコマンドを実行する。

```posgresql
\i admin/create.sql
```

出力

```zsh
CREATE ROLE
```

実行した sql 文はデータベースの管理者を作成するもので、ユーザ名とパスワードは以下の通りである。

ユーザ名：admin

パスワード：admin_password

作成した管理者でデータベース内に入れるか確認するために、一度 posgres データベースを出る。

```postgresql
\q
```

以下のコマンドから admin ユーザーで postgres データベース内に入る。

```zsh
psql "postgresql://admin@localhost/postgres"
```

## データベースの作成

posgers データベース内で以下のコマンドを実行する

```postgresql
create database simplyz
```

このコマンドは simplyz データベースを作成するものである。

データベースが作成されたか確認するためにデータベースを出て、データベース一覧確認コマンドを実行する。

```postgresql
\q
```

```zsh
psql -l
```

出力

```zsh
   Name    |   Owner    | Encoding | Collate | Ctype |   Access privileges
-----------+------------+----------+---------+-------+-----------------------
 simplyz   | admin      | UTF8     | C       | C     |
```

データベースが作成されれば、出力結果が以上のようになる。

以下のコマンドで、admin ユーザから simplyz データベース内に入る。

```zsh
psql "postgresql://admin@localhost/simplyz"
```

## テーブルの作成

simplyz データベース内に users テーブルと csvs テーブルの二つのテーブルを作成する。

### users テーブル

simplyz データベース内から以下のコマンドを実行する。

```postgresql
\i users/create.sql
```

テーブルが作成されたか確認するために以下のコマンドを実行する。

```postgresql
\dt
```

出力例

```postgresql
 Schema |   Name    | Type  | Owner
--------+-----------+-------+-------
 public | users     | table | admin
```

このコマンドはデータベース内のテーブルの一覧を確認するコマンドである。

テーブルの作成が確認されたら、デバッグ用のダミーデータをテーブル内に保存する。

```postgresql
\i users/data.sql
```

ダミーデータが追加されたか確認するために以下のコマンドを実行する。

```postgresql
SELECT * FROM users
```

出力

```postgresql
 user_id |  mail_address  |  password   | gemini_api_key | is_delete
 --------+----------------+-------------+----------------+-----------
 rootId  | root@root.com  | root        | rootpass       | f
```

### csvs テーブル

simplyz データベース内から以下のコマンドを実行する。

```postgresql
\i csvs/create.sql
```

テーブルが作成されたか確認するために以下のコマンドを実行する。

```postgresql
\dt
```

出力例

```postgresql
 Schema |   Name    | Type  | Owner
--------+-----------+-------+-------
 public | csvs      | table | admin
 public | users     | table | admin
```

データベースの初期せっては終了！

# DB の各種コマンド

### データベースに入る

```bash
psql 入りたいデータベース名
```

### .sql ファイルの実行

```bash
\i example.sql
```

### テーブル一覧表示

```bash
\dt
```

### 任意のテーブルを確認する方法

```bash
\d 確認したいテーブル名
```

### テーブル内のデータを確認

```bash
SELECT * FROM テーブル名;
```

### テーブルの削除

```bash
DROP TABLE テーブル名;
```

### データベースの切り替え

```bash
\c 切り替えたいデータベース名
```

### データベースの削除

```bash
drop database 削除したいデータベース名
```

### データベースから出る

```bash
\q
```

# 補足

- PostgreSQL がどこにインストールされたか確認する方法

```zsh
which psql
```

出力例

```zsh
/home/linuxbrew/.linuxbrew/bin/psql
```
