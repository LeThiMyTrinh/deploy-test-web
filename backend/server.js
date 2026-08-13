const express = require("express");
const { Pool } = require("pg");

const PORT = process.env.PORT || 4000;

// Ưu tiên connection string do platform tự cấp (POSTGRES_URL, kiểu
// Vercel Postgres/Neon) — luôn đúng kể cả khi platform xoay mật khẩu.
// Không có thì fallback về từng biến PG* rời (chạy local/docker-compose).
const pool = process.env.POSTGRES_URL
  ? new Pool({ connectionString: process.env.POSTGRES_URL })
  : new Pool({
      host: process.env.PGHOST || "localhost",
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "tododb",
    });

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, done FROM todos ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tự tạo schema + seed dữ liệu mẫu nếu chưa có — để chạy được ngay trên
// managed PostgreSQL của platform (không chạy db/init.sql), lẫn local.
async function initDb() {
  const maxRetries = 10;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          done BOOLEAN NOT NULL DEFAULT false
        )
      `);
      const { rows } = await pool.query("SELECT COUNT(*) FROM todos");
      if (Number(rows[0].count) === 0) {
        await pool.query(`
          INSERT INTO todos (title, done) VALUES
            ('Học Docker', true),
            ('Deploy backend lên server B', false),
            ('Kết nối PostgreSQL', false)
        `);
      }
      console.log("Database ready (schema + seed checked).");
      return;
    } catch (err) {
      console.log(`DB chưa sẵn sàng (${err.message}) — thử lại ${i}/${maxRetries}...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.error("Không thể khởi tạo database sau nhiều lần thử.");
}

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend API running at http://localhost:${PORT}`);
  });
});
