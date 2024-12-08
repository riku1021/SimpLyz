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

-- roomsテーブルの作成
CREATE TABLE rooms (
    room_id VARCHAR(255) PRIMARY KEY,
    csv_id VARCHAR(255) NOT NULL,
    visualization_type VARCHAR(255) NOT NULL,
    vertical VARCHAR(255) NOT NULL,
    horizontal VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    regression VARCHAR(255) NOT NULL,
    dimension VARCHAR(255) NOT NULL,
    FOREIGN KEY (csv_id) REFERENCES csvs(csv_id)
);

-- chatsテーブルの作成
CREATE TABLE chats (
    chat_id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    message VARCHAR(10000) NOT NULL,
    user_chat BOOLEAN NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- テストユーザーの挿入
INSERT INTO users (user_id, mail_address, password)
VALUES ('rootId', 'root@root.com', 'root');