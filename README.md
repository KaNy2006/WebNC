# WebNC - Lab 9

Project Express cơ bản theo nội dung Lab 9.

## Chức năng

- Trang chủ
- Danh sách bài viết
- Xem chi tiết bài viết
- Tìm kiếm bài viết
- Thêm bài viết
- **Cập nhật bài viết (Lab 9)**

## CSDL

Tạo database và bảng theo đề Lab 9:

```sql
CREATE DATABASE newsdb;

USE newsdb;

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT
);
```

## Chạy project

```bash
npm install
npm start
```

Mở: http://localhost:3000

> Cập nhật mật khẩu MySQL trong `config/db.js` nếu máy dùng mật khẩu khác.
