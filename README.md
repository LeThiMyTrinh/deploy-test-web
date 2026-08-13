# Deploy Test — Full-stack (Frontend + Backend + PostgreSQL)

Case full-stack tối giản dùng để kiểm thử luồng nhận diện & triển khai nhiều
service từ 1 repository:

```
Frontend (browser) → GET /api/todos → Backend (Node.js API) → SQL → PostgreSQL
                                                              ↓
Frontend hiển thị danh sách  ←────────────── JSON ←──────────┘
```

## Cấu trúc source

```
deploy-test-web/
├── frontend/            # Project 1 — static HTML/CSS/JS thuần
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── server.js        # static file server, không dependency
│   ├── package.json
│   └── Dockerfile
├── backend/              # Project 2 — API server
│   ├── server.js         # Node.js http thuần + pg, đọc PostgreSQL
│   ├── package.json      # dependency duy nhất: pg
│   ├── .env.example
│   └── Dockerfile
├── db/                    # Project 3 — PostgreSQL
│   ├── init.sql           # schema `todos` + dữ liệu mẫu
│   └── Dockerfile         # postgres:16-alpine + init.sql
├── docker-compose.yml      # chạy cả 3 service cùng lúc để test local
└── README.md
```

Frontend và Backend là **2 project Node.js độc lập** (mỗi thư mục có
`package.json`/`Dockerfile` riêng), Backend kết nối PostgreSQL hoàn toàn qua
**biến môi trường** (`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`,
`PGDATABASE`), không hardcode.

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

Yêu cầu: Node.js >= 18, PostgreSQL đang chạy (local hoặc container).

```bash
# 1. Tạo database + import schema/dữ liệu mẫu
psql -h localhost -U postgres -c "CREATE DATABASE tododb;"
psql -h localhost -U postgres -d tododb -f db/init.sql

# 2. Chạy Backend (port 4000)
cd backend
cp .env.example .env   # chỉnh lại nếu thông tin DB khác
npm install
npm start

# 3. Chạy Frontend (port 3000), ở terminal khác
cd frontend
npm start
```

Mở http://localhost:3000. Nếu Backend chạy ở domain/port khác, sửa
`window.API_BASE` trong `frontend/index.html`.

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
**2 project ứng dụng (Frontend, Backend) + 1 PostgreSQL database** từ cùng
một repository hay không.
