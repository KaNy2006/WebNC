const express = require("express")
const path = require("path")
const db = require("./config/db")

const app = express()
const port = 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/news", async (req, res) => {
  try {
    const [posts] = await db.query(
      "SELECT * FROM posts ORDER BY id DESC"
    )
    res.render("news-list", { posts })
  } catch (error) {
    console.log(error)
    res.status(500).send("Lỗi khi lấy danh sách bài viết")
  }
})

app.get("/news/search", async (req, res) => {
  try {
    const keyword = req.query.keyword || ""
    const [posts] = await db.query(
      "SELECT * FROM posts WHERE title LIKE ? OR description LIKE ? ORDER BY id DESC",
      [`%${keyword}%`, `%${keyword}%`]
    )
    res.render("news-list", { posts })
  } catch (error) {
    console.log(error)
    res.status(500).send("Lỗi khi tìm kiếm bài viết")
  }
})

app.get("/news/add", (req, res) => {
  res.render("add-post")
})

app.post("/news/add", async (req, res) => {
  try {
    const { title, description } = req.body

    await db.query(
      "INSERT INTO posts(title, description) VALUES (?, ?)",
      [title, description]
    )

    res.redirect("/news")
  } catch (error) {
    console.log(error)
    res.status(500).send("Lỗi khi thêm bài viết")
  }
})

// Lab 9: mở form sửa bài viết
app.get("/news/:id/edit", async (req, res) => {
  try {
    const id = req.params.id

    const [rows] = await db.query(
      "SELECT * FROM posts WHERE id = ?",
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy bài viết")
    }

    res.render("edit-post", { post: rows[0] })
  } catch (error) {
    console.log(error)
    res.status(500).send("Lỗi khi mở form sửa")
  }
})

// Lab 9: xử lý cập nhật bài viết
app.post("/news/:id/edit", async (req, res) => {
  try {
    const id = req.params.id
    const { title, description } = req.body

    await db.query(
      "UPDATE posts SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
    )

    res.redirect("/news")
  } catch (error) {
    console.log(error)
    res.status(500).send("Lỗi khi cập nhật bài viết")
  }
})

app.get("/news/:id", async (req, res) => {
  try {
    const id = req.params.id

    const [rows] = await db.query(
      "SELECT * FROM posts WHERE id = ?",
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy bài viết")
    }

    res.render("news-detail", { post: rows[0] })
  } catch (error) {
    console.log(error)
    res.status(500).send("Lỗi khi xem chi tiết bài viết")
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
