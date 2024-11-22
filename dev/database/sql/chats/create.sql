CREATE TABLE chats (
    chat_id VARCHAR(255) PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    user_chat BOOLEAN NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
)