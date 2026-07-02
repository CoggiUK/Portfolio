# Portfolio cá nhân — Tùng Lâm Nguyễn | UI/UX Designer

Trang web Portfolio giới thiệu năng lực của **Tùng Lâm Nguyễn** — *UI/UX Designer hướng tới Product Designer* — tích hợp bảng điều khiển quản trị bảo mật bằng **Firebase Authentication** và **Cloud Firestore** để tự cập nhật hồ sơ & dự án mà không cần sửa code.

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
   - Xác thực đăng nhập bằng **Firebase Auth (Email/Password)**.
   - Dữ liệu cấu hình và dự án được tải trực tuyến thời gian thực từ **Cloud Firestore** (`settings/main`).
   - Quản lý Hồ sơ cá nhân, chỉnh sửa các liên kết dự án (Figma, GitHub, Live Demo), và cập nhật chỉ số đo lường hiệu suất (Performance Metrics).
5. **Hỗ Trợ Mọi Màn Hình (Fully Responsive)**: Giao diện tương thích hoàn hảo từ màn hình di động (320px), máy tính bảng (768px), laptop (1024px) đến màn hình máy tính lớn (1440px+).

---

## 🛠️ Cấu Trúc Thư Mục

> **Ứng dụng đã được chuyển đổi hoàn toàn sang kiến trúc Serverless (Không máy chủ)** sử dụng Firebase. Thư mục `backend/` chứa mã nguồn cũ chạy REST API đã lỗi thời (chỉ dùng để tham khảo).

```text
├── README.md                  # Tài liệu hướng dẫn sử dụng nhanh
├── wiki/                      # ★ Bộ quy chuẩn: SRS · Design · Dev · AI · Handoff · Responsive · Deploy
│   ├── README.md              # Mục lục & quy trình áp dụng
│   ├── 00-overview.md         # Tổng quan hệ thống & triết lý Firebase
│   ├── 01-srs.md              # Đặc tả yêu cầu phần mềm (FR/NFR, data model)
│   ├── 02-design-rules.md     # Design tokens, type/spacing scale, component, a11y
│   ├── 03-dev-rules.md        # Kiến trúc, quy ước code Firebase
│   ├── 04-ai-design-automation.md  # Quy tắc dùng AI bám sát SRS
│   ├── 05-design-fe-handoff.md     # Checklist bàn giao Design ↔ FE
│   ├── 06-responsive.md       # Quy tắc responsive từ design đến build
│   └── 07-deploy.md           # Hướng dẫn deploy lên Firebase Hosting + Firestore
│
├── frontend/                  # ── FRONTEND (React + Vite + Firebase) ──
│   ├── firebase.json          # Cấu hình Firebase Hosting
│   ├── .firebaserc            # Project target mapping của Firebase
│   ├── index.html             # Cấu hình SEO & Google Fonts
│   ├── vite.config.js         # Vite configuration (Vite v5 tương thích Node 18)
│   ├── package.json           # Thư viện Frontend & Firebase Client SDK
│   └── src/
│       ├── firebase.js        # Khởi tạo Firebase App, Auth & Firestore
│       ├── db-init.js         # Script đồng bộ dữ liệu cục bộ từ db.json lên Cloud Firestore
│       ├── App.jsx            # Điều hướng & Trình theo dõi trạng thái Auth
│       ├── index.css          # Design tokens, Glassmorphism, Responsive ladder
│       ├── main.jsx           # Điểm khởi chạy React client
│       └── components/
│           ├── BackgroundEffect.jsx  # Hiệu ứng Canvas hạt & Spotlight
│           ├── Portfolio.jsx         # Giao diện Portfolio công khai
│           ├── Login.jsx             # Giao diện xác thực Admin qua Firebase Auth
│           └── Admin.jsx             # Bảng quản trị cập nhật dữ liệu trực tiếp lên Firestore
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy local

Dự án yêu cầu cài đặt sẵn **Node.js** (v18+) và **npm**.

### Bước 1: Cài đặt thư viện Frontend
Mở terminal, vào thư mục `frontend` và cài đặt các thư viện:
```bash
cd frontend
npm install
```

### Bước 2: Đồng bộ hóa dữ liệu mặc định lên Cloud Firestore
Nếu đây là lần đầu tiên chạy dự án và bạn đã kích hoạt Cloud Firestore + Authentication (Email/Password) trên Firebase Console:
```bash
node src/db-init.js
```
*Script này sẽ đăng nhập/tạo tài khoản quản trị và tự động đẩy dữ liệu portfolio từ file local lên Cloud Firestore.*

### Bước 3: Chạy ứng dụng ở local
Khởi chạy máy chủ phát triển cục bộ:
```bash
npm run dev
```
*Giao diện sẽ chạy tại địa chỉ: **`http://localhost:5173`***

---

## 🔑 Thông Tin Đăng Nhập Quản Trị Mặc Định

Để truy cập Trang Quản Trị bí mật tại địa chỉ: `http://localhost:5173/portal-admin`:
- **Email đăng nhập**: `ntlam2211@gmail.com`
- **Mật khẩu**: `adminpassword123`

> [!IMPORTANT]
> Bạn có thể thay đổi mật khẩu của tài khoản quản trị trực tiếp ngay trong mục "Đổi mật khẩu" tại Trang Quản Trị Admin hoặc thông qua bảng điều khiển Firebase Console.

---

## 🚀 Đẩy ứng dụng lên Production (Firebase Hosting)

Đọc tài liệu chi tiết tại **[`wiki/07-deploy.md`](wiki/07-deploy.md)** hoặc chạy nhanh 3 lệnh sau trong thư mục `frontend`:
```bash
npx firebase-tools login
npm run build
npx firebase-tools deploy --only hosting:tunglamng
```
Trang web sẽ được tải lên trực tiếp tại URL: **`https://tunglamng.web.app`**
