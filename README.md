# Deploy Test Website

Website tĩnh đơn giản (HTML/CSS/JavaScript thuần — không database, không
framework phức tạp) dùng để kiểm thử luồng:

```
GitHub Source → Framework Detection → Build → Nixpacks → Docker/Containerization → Deploy
```

## Cấu trúc source

```
deploy-test-web/
├── index.html      # Trang chính
├── style.css       # Style
├── script.js       # Xử lý sự kiện click button
├── server.js       # Static file server thuần Node.js (không dependency ngoài)
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
- Nhấn nút **Deploy** → hiển thị **"Deploy thành công!"**.
