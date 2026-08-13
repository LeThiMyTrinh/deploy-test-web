# Deploy Test Website

Case full-stack đơn giản (HTML/CSS/JavaScript thuần + Node.js `http` thuần —
không database, không framework, không dependency ngoài) dùng để kiểm thử
luồng:

```
Frontend (script.js) → fetch("/api/hello") → Backend (server.js) → JSON → Frontend hiển thị
```

Đồng thời vẫn dùng được để test luồng deploy:

```
GitHub Source → Framework Detection → Build → Nixpacks → Docker/Containerization → Deploy
```

## Cấu trúc source

```
deploy-test-web/
├── index.html      # Trang chính
├── style.css       # Style
├── script.js       # Gọi API /api/hello và hiển thị kết quả
├── server.js       # Static file server + API endpoint GET /api/hello
├── package.json    # npm scripts: start, build
└── README.md
```

## Cách chạy local

Yêu cầu: Node.js >= 18 (không cần cài thêm package nào).

```bash
npm start
# hoặc
node server.js
```

Mặc định server chạy ở **port 3000**: http://localhost:3000

Có thể đổi port bằng biến môi trường `PORT`:

```bash
PORT=8080 npm start
```

## Build

Đây là site tĩnh nên không có build step thực sự — `npm run build` chỉ in
thông báo xác nhận. Toàn bộ asset (`index.html`, `style.css`, `script.js`)
đã sẵn sàng để serve trực tiếp.

## Chức năng

- Hiển thị tiêu đề **Deploy Test Website** và mô tả ngắn.
- Nhấn nút **Gọi API** → frontend gọi `GET /api/hello` → backend trả JSON
  `{ message, time }` → frontend hiển thị kết quả kèm thời gian server.
