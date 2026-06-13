# Portfolio cá nhân — Nguyễn Tùng Lâm | UI/UX Designer

Trang web Portfolio giới thiệu năng lực của **Nguyễn Tùng Lâm** — *UI/UX Designer hướng tới Product Designer* — tích hợp bảng điều khiển quản trị bí mật bảo mật bằng **JSON Web Token (JWT)** để tự cập nhật hồ sơ & dự án mà không cần sửa code.

Nội dung được lấy trực tiếp từ CV: tư duy thiết kế lấy người dùng làm trung tâm, Design System chặt chẽ, quy trình **Design–FE Handoff** và **ứng dụng AI bám sát tài liệu SRS**.

Giao diện theo phong cách **Deep Obsidian Dark Mode**, hiệu ứng kính mờ (Glassmorphism), mạng lưới hạt Canvas tương tác theo con trỏ, và cơ chế highlight liên kết Dự án – Kỹ năng.

> 📚 Toàn bộ quy chuẩn (SRS · Design · Dev · AI · Handoff) nằm trong thư mục **[`wiki/`](wiki/README.md)** — và đã được áp dụng trực tiếp vào mã nguồn của dự án này.

---

## 🚀 Tính Năng Chính

1. **Hiệu Ứng Con Trỏ Spotlight & Mạng Hạt Tương Tác**: Bản vẽ Canvas mạng lưới hạt kết nối thông minh chạy nền kết hợp hiệu ứng rọi sáng (spotlight) theo vị trí chuột.
2. **Kỹ Năng Đúc Kết Từ Dự Án (Dynamic Skills)**: Danh mục kỹ năng được tính toán tự động dựa trên các công nghệ sử dụng trong các dự án. Di chuột qua thẻ kỹ năng sẽ tự động làm nổi bật các dự án liên quan.
3. **3 Dự Án Được Cấu Hình Đầy Đủ**:
   - *AI-driven Analytics & Campaign Optimization Dashboard*
   - *Social Lead Automation & AI CRM Dashboard*
   - *SPACE - Internal CRM & Quản trị Vận hành*
4. **Bảng Điều Khiển Quản Trị Bí Mật (`/portal-admin`)**:
   - Truy cập thông qua nhấp đúp vào Avatar chân dung ở Footer hoặc nút bấm "Console" trên thanh Menu.
   - Bảo mật đăng nhập JWT xác thực chữ ký HMAC SHA256 mã hóa mật khẩu bằng `bcryptjs`.
   - Quản lý Hồ sơ cá nhân, chỉnh sửa các liên kết dự án (Figma, GitHub, Live Demo), và cập nhật chỉ số đo lường hiệu suất (Performance Metrics).
   - Xem logs kiểm tra payload và header đã giải mã trực tiếp của token JWT đang kích hoạt.
5. **Hỗ Trợ Mọi Màn Hình (Fully Responsive)**: Giao diện tương thích hoàn hảo từ màn hình di động (320px), máy tính bảng (768px), laptop (1024px) đến màn hình máy tính lớn (1440px+).

---

## 🛠️ Cấu Trúc Thư Mục

> **Frontend và Backend được tách thành 2 thư mục độc lập**, mỗi bên có `package.json` riêng. `wiki/` là tài liệu dùng chung ở gốc.

```text
├── README.md                  # Tài liệu hướng dẫn sử dụng nhanh
├── wiki/                      # ★ Bộ quy chuẩn: SRS · Design · Dev · AI · Handoff · Responsive
│   ├── README.md              # Mục lục & quy trình áp dụng
│   ├── 00-overview.md         # Tổng quan hệ thống & triết lý
│   ├── 01-srs.md              # Đặc tả yêu cầu phần mềm (FR/NFR, data model, API)
│   ├── 02-design-rules.md     # Design tokens, type/spacing scale, component, a11y
│   ├── 03-dev-rules.md        # Kiến trúc, quy ước code, API, bảo mật JWT
│   ├── 04-ai-design-automation.md  # Quy tắc dùng AI bám sát SRS
│   ├── 05-design-fe-handoff.md     # Checklist bàn giao Design ↔ FE
│   └── 06-responsive.md       # Quy tắc responsive từ design đến build
│
├── frontend/                  # ── FRONTEND (React + Vite) ──
│   ├── index.html             # Cấu hình SEO & Google Fonts
│   ├── vite.config.js         # Vite & Proxy /api → backend
│   ├── package.json           # Thư viện Frontend
│   └── src/
│       ├── App.jsx            # Điều hướng & bộ nhớ JWT
│       ├── index.css          # Design tokens, Glassmorphism, Responsive ladder
│       ├── main.jsx           # Điểm khởi chạy React client
│       └── components/
│           ├── BackgroundEffect.jsx  # Hiệu ứng Canvas hạt & Spotlight
│           ├── Portfolio.jsx         # Giao diện Portfolio công khai
│           ├── Login.jsx             # Giao diện xác thực JWT
│           └── Admin.jsx             # Bảng quản trị & Logs JWT
│
└── backend/                   # ── BACKEND (Node + Express) ──
    ├── package.json           # Thư viện Node/Express
    ├── server.js              # REST API & Middleware xác thực JWT
    └── db.json                # CSDL tệp JSON (Hồ sơ & 3 Dự án)
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Dự Án

Dự án yêu cầu cài đặt sẵn **Node.js** (Khuyên dùng v18+) và **npm**.

### Bước 1: Khởi chạy Máy chủ API (Backend)
Mở terminal, vào thư mục `backend` và chạy:
```bash
cd backend
npm install
npm start
```
*Máy chủ API sẽ khởi chạy tại cổng: **`http://localhost:5001`***

### Bước 2: Khởi chạy Ứng dụng Client (Frontend)
Mở một terminal **mới**, vào thư mục `frontend` và chạy:
```bash
cd frontend
npm install
npm run dev
```
*Ứng dụng Client sẽ chạy tại cổng mặc định: **`http://localhost:5173`***

Mở trình duyệt truy cập: `http://localhost:5173` để trải nghiệm trang web.

---

## 🔑 Thông Tin Đăng Nhập Mặc Định

Để truy cập Trang Quản Trị bí mật tại địa chỉ: `http://localhost:5173/portal-admin`, vui lòng dùng thông tin sau:
- **Tài Khoản (Username)**: `designer_admin`
- **Mật Khẩu (Password)**: `creative_jwt_2026`

> [!IMPORTANT]
> Mật khẩu lưu trữ trên tệp tin `db.json` được tự động chuyển đổi thành dạng băm Bcrypt bảo mật cao ngay trong lần đầu máy chủ backend khởi chạy. Bạn có thể đổi mật khẩu mới trong mục "Đổi mật khẩu" tại Trang Quản Trị.

---

## 📝 Quy Chuẩn Thiết Kế & Khả Năng Tương Thích
- **Màu sắc chính**: Nền bóng tối vũ trụ (#07070a), Điểm nhấn phát sáng Lục bảo (#00ff88) và Tím neon (#8b5cf6).
- **Phông chữ**: Hỗ trợ font `Plus Jakarta Sans` cho nội dung văn bản và `Outfit` cho tiêu đề lớn.
- **Tiêu chuẩn chuyển động**: Tất cả các hiệu ứng trượt và thay đổi trạng thái đều bị vô hiệu hóa tự động nếu người dùng bật chế độ giảm chuyển động trong tùy chỉnh hệ thống thiết bị (`prefers-reduced-motion: reduce`).
