CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    mail_address VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gemini_api_key VARCHAR(255),
    is_delete BOOLEAN NOT NULL DEFAULT FALSE
);