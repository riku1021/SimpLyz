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