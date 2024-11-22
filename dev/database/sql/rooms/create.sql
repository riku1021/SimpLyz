CREATE TABLE rooms (
    room_id VARCHAR(255) PRIMARY KEY,
    csv_id VARCHAR(255) NOT NULL,
    visualization_type VARCHAR(255) NOT NULL,
    vertical VARCHAR(255) NOT NULL,
    horizontal VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    regression BOOLEAN NOT NULL,
    FOREIGN KEY (csv_id) REFERENCES csvs(csv_id)
)