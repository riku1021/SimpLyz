CREATE TABLE chats (
    chat_id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_user BOOLEAN NOT NULL,
    post_id INT NOT NULL
)