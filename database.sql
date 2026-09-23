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

INSERT INTO posts (title, description)
SELECT 'Bài viết mẫu 1', 'Đây là dữ liệu mẫu để kiểm tra website Express và MySQL.'
WHERE NOT EXISTS (SELECT 1 FROM posts);

INSERT INTO posts (title, description)
SELECT 'Bài viết mẫu 2', 'Bạn có thể đăng nhập để thêm, sửa và xóa bài viết.'
WHERE (SELECT COUNT(*) FROM posts) = 1;
