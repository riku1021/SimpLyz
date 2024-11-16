-- データベースの作成
-- CREATE DATABASE simplyz;

-- データベースに入る
\c simplyz

-- adimnユーザーの作成
-- CREATE ROLE admin WITH
--     LOGIN
--     SUPERUSER
--     CREATEDB
--     CREATEROLE
--     INHERIT
--     PASSWORD 'admin_password';

-- usersテーブルの作成
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    mail_address VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gemini_api_key VARCHAR(255),
    is_delete BOOLEAN NOT NULL DEFAULT FALSE
);

-- csvsテーブルの作成
CREATE TABLE csvs (
    csv_id VARCHAR(255) PRIMARY KEY,
    csv_file BYTEA NOT NULL,
    json_file BYTEA NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    data_size INT NOT NULL,
    data_columns INT NOT NULL,
    data_rows INT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- テストユーザーの挿入
INSERT INTO users (user_id, mail_address, password)
VALUES ('rootId', 'root@root.com', 'root');