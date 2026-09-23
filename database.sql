CREATE DATABASE IF NOT EXISTS newsdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE newsdb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT
);

INSERT INTO users (username, password, fullname)
SELECT 'admin', '123456', 'Quản trị viên'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE username = 'admin'
);

INSERT INTO posts(title, description)
VALUES
('NodeJS', 'Lập trình backend với Node.js thuần'),
('Web động', 'Server trả về nội dung tương ứng với request'),
('React', 'Lập trình giao diện frontend với React');
