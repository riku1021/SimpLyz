CREATE TABLE box_room (
    room_id VARCHAR(255) PRIMARY KEY,
    csv_id VARCHAR(255) NOT NULL,
    vertical VARCHAR(255) NOT NULL,
    horizontal VARCHAR(255) NOT NULL,
    FOREIGN KEY (csv_id) REFERENCES csvs(csv_id)
)