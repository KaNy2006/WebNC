const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./config/db");

const app = express();
const port = 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function logger(req, res, next) {
  console.log(req.method, req.url);
  next();
}
app.use(logger);

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Trang chủ
app.get("/", (req, res) => {
  res.render("home");
});

// Danh sách bài viết
app.get("/news", async (req, res) => {
  try {
    const [posts] = await db.query("SELECT * FROM posts ORDER BY id DESC");
    res.render("news-list", { posts });
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi lấy danh sách bài viết");
  }
});

// Tìm kiếm - phải đặt trước /news/:id
app.get("/news/search", async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const [posts] = await db.query(
      "SELECT * FROM posts WHERE title LIKE ? OR description LIKE ? ORDER BY id DESC",
      [`%${keyword}%`, `%${keyword}%`]
    );
    res.render("news-list", { posts, keyword });
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi tìm kiếm bài viết");
  }
});

// Middleware yêu cầu đăng nhập
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// Đăng nhập
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const [users] = await db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (users.length === 0) {
      return res.render("login", { error: "Sai username hoặc password" });
    }

    req.session.user = {
      id: users[0].id,
      username: users[0].username,
      fullname: users[0].fullname
    };

    return res.redirect("/news");
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi đăng nhập");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Thêm bài viết
app.get("/news/add", requireLogin, (req, res) => {
  res.render("add-post");
});

app.post("/news/add", requireLogin, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).send("Vui lòng nhập đầy đủ tiêu đề và mô tả");
    }

    await db.query(
      "INSERT INTO posts(title, description) VALUES (?, ?)",
      [title, description]
    );

    res.redirect("/news");
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi thêm bài viết");
  }
});

// Sửa bài viết - đặt trước /news/:id
app.get("/news/:id/edit", requireLogin, async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy bài viết");
    }

    res.render("edit-post", { post: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi mở form sửa");
  }
});

app.post("/news/:id/edit", requireLogin, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;

    await db.query(
      "UPDATE posts SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
    );

    res.redirect("/news");
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi cập nhật bài viết");
  }
});

// Xóa bài viết
app.post("/news/:id/delete", requireLogin, async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM posts WHERE id = ?", [id]);
    res.redirect("/news");
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi xóa bài viết");
  }
});

// Chi tiết bài viết
app.get("/news/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy bài viết");
    }

    res.render("news-detail", { post: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi xem chi tiết bài viết");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
