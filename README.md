# Deploy Test — Full-stack (Frontend + Backend + PostgreSQL)

Case full-stack tối giản dùng để kiểm thử luồng nhận diện & triển khai nhiều
service từ 1 repository:

```
Frontend (Vite) → GET /api/todos → Backend (Express) → SQL → PostgreSQL
                                                       ↓
Frontend hiển thị danh sách  ←──────── JSON ←──────────┘
```

## Cấu trúc source

```
deploy-test-web/
├── frontend/            # Project 1 — Vite (framework signature: vite)
│   ├── index.html
│   ├── src/
│   │   ├── main.js       # gọi API, render danh sách
│   │   └── style.css
│   ├── serve.js          # static server phục vụ dist/ khi chạy production
│   ├── vite.config.js
│   ├── package.json      # devDependency duy nhất: vite
│   ├── .env.example
│   └── Dockerfile         # multi-stage: build (vite) → serve (node thuần)
├── backend/               # Project 2 — Express (framework signature: express)
│   ├── server.js          # Express + pg, đọc PostgreSQL
│   ├── package.json       # dependencies: express, pg
│   ├── .env.example
│   └── Dockerfile
├── db/                     # Project 3 — PostgreSQL
│   ├── init.sql            # schema `todos` + dữ liệu mẫu
│   └── Dockerfile          # postgres:16-alpine + init.sql
├── docker-compose.yml       # chạy cả 3 service cùng lúc để test local
└── README.md
```

Frontend và Backend là **2 project Node.js độc lập** — mỗi thư mục có
`package.json`/`Dockerfile` riêng, dùng đúng framework mà hệ thống deploy
nhận diện (`vite` cho frontend, `express` cho backend). Backend kết nối
PostgreSQL hoàn toàn qua **biến môi trường** (`PGHOST`, `PGPORT`, `PGUSER`,
`PGPASSWORD`, `PGDATABASE`), không hardcode.

Backend **tự tạo bảng `todos` + seed dữ liệu mẫu lúc khởi động** (idempotent
— chạy lại không nhân đôi dữ liệu), nên hoạt động được cả khi trỏ vào
managed PostgreSQL do platform deploy tự cấp (không chạy `db/init.sql` của
repo này) lẫn Postgres chạy từ `db/Dockerfile` ở local. `db/` vẫn giữ để
platform nhận diện đủ 3 phần và để chạy local qua docker-compose.

## Chạy local — cách nhanh nhất (docker compose)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/todos
- PostgreSQL: localhost:5432 (user/pass: `postgres`/`postgres`, db: `tododb`)

Mở http://localhost:3000, bấm **Tải lại** để frontend gọi backend, backend
query PostgreSQL và trả về danh sách Todo mẫu.

## Chạy local — thủ công (không Docker)

Yêu cầu: Node.js >= 18, PostgreSQL đang chạy (local hoặc container) và đã
tạo sẵn database rỗng (bảng/dữ liệu mẫu backend tự tạo lúc start).

```bash
# 1. Tạo database rỗng
psql -h localhost -U postgres -c "CREATE DATABASE tododb;"

# 2. Chạy Backend (port 4000) — tự tạo bảng + seed dữ liệu mẫu lúc khởi động
cd backend
cp .env.example .env   # chỉnh lại nếu thông tin DB khác
npm install
npm start

# 3. Chạy Frontend (Vite dev server, port 3000), ở terminal khác
cd frontend
cp .env.example .env   # VITE_API_BASE — trỏ về URL Backend
npm install
npm run dev
```

Mở http://localhost:3000. Nếu Backend deploy ở domain/port khác, đổi
`VITE_API_BASE` trong `frontend/.env` rồi build lại (`npm run build`) — biến
môi trường Vite được nhúng vào bundle lúc build, không đọc runtime.

## Deploy lên platform (managed PostgreSQL)

Khi deploy qua platform, database thường là managed add-on riêng (không
phải container build từ `db/Dockerfile`). Lấy thông tin kết nối từ panel
quản lý database của platform rồi cấu hình vào biến môi trường của service
**backend**:

| Biến môi trường backend | Lấy từ panel database |
|---|---|
| `PGHOST` | Host nội bộ |
| `PGPORT` | Port nội bộ |
| `PGDATABASE` | Database name |
| `PGUSER` | Username |
| `PGPASSWORD` | Password (bấm "Xoay mật khẩu" nếu không còn lưu giá trị gốc) |

Không cần chạy `db/init.sql` thủ công — backend tự tạo bảng + seed khi
khởi động (xem log container backend: `Database ready (schema + seed
checked).`).

## Database

Bảng `todos` (`db/init.sql`):

| id | title                          | done |
|----|--------------------------------|------|
| 1  | Học Docker                     | true |
| 2  | Deploy backend lên server B    | false|
| 3  | Kết nối PostgreSQL             | false|

## API

- `GET /api/todos` → `[{ "id": 1, "title": "...", "done": true }, ...]`

## Mục đích

Repo này dùng để test hệ thống deploy có nhận diện đúng và triển khai được
**2 project ứng dụng (Frontend Vite, Backend Express) + 1 PostgreSQL
database** từ cùng một repository hay không.
