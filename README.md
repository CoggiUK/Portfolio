# Portfolio cá nhân — Tùng Lâm Nguyễn | UI/UX Designer

Trang web Portfolio giới thiệu năng lực của **Tùng Lâm Nguyễn** — *UI/UX Designer hướng tới Product Designer* — tích hợp bảng điều khiển quản trị bảo mật bằng **Firebase Authentication** và **Cloud Firestore** để tự cập nhật hồ sơ & dự án mà không cần sửa code.

Nội dung được lấy trực tiếp từ CV: tư duy thiết kế lấy người dùng làm trung tâm, Design System chặt chẽ, quy trình **Design–FE Handoff** và **ứng dụng AI bám sát tài liệu SRS**.

Giao diện theo phong cách **Deep Obsidian Dark Mode**, hiệu ứng kính mờ (Glassmorphism), mạng lưới hạt Canvas tương tác theo con trỏ, và cơ chế highlight liên kết Dự án – Kỹ năng.

Dự án gồm **3 phần chạy trên cùng một project Firebase**: website portfolio (`frontend/`), ứng dụng di động quản lý cá nhân & điều hành website (`mobile/`), và các Cloud Functions lo push notification + nhắc lịch (`functions/`).

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
6. **Form Liên Hệ Ghi Thẳng Vào Firestore**: Khách để lại lời nhắn trên web → document mới trong collection `leads` → Cloud Function bắn **push notification realtime** về điện thoại.
7. **Ứng Dụng Di Động `Tùng Lâm Workspace`** (thư mục [`mobile/`](mobile/README.md)):
   - **Lịch làm việc** với khung tháng, nhãn màu, nhắc trước nhiều mốc, **đồng bộ hai chiều Google Calendar**.
   - **Thông báo realtime** khi có người để lại thông tin liên hệ trên website, kèm hộp thư quản lý trạng thái lead.
   - **Quản lý cá nhân**: công việc (ưu tiên/deadline), ghi chú có thẻ, thói quen kèm streak & heatmap, thu chi theo danh mục.
   - **Quản trị website ngay trên điện thoại**: sửa hồ sơ, nhóm kỹ năng, thêm/sửa/xoá & sắp xếp dự án — lưu là web đổi ngay.

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
├── firebase.json              # ★ Cấu hình gốc: Hosting + Firestore rules + Functions
├── firestore.rules            # ★ Quy tắc bảo mật Firestore (leads, settings, dữ liệu cá nhân)
│
├── mobile/                    # ── APP DI ĐỘNG (Expo / React Native) ──
│   ├── README.md              # Hướng dẫn cài đặt, cấu hình OAuth & build APK
│   ├── app.json               # Cấu hình Expo, quyền, notification channel
│   ├── eas.json               # Profile build development / preview / production
│   └── src/
│       ├── theme/             # Design token dùng chung với web
│       ├── lib/firebase.js    # Firebase client (Auth lưu phiên bằng AsyncStorage)
│       ├── contexts/          # AuthContext & AppContext (realtime + đồng bộ + thông báo)
│       ├── services/          # db.js · notifications.js · googleCalendar.js
│       ├── components/ui.js   # Bộ UI kit
│       ├── navigation/        # Tab + Stack, xử lý chạm vào thông báo
│       └── screens/           # Trang chủ · Lịch · Cá nhân · Liên hệ · Web · Cài đặt
│
├── functions/                 # ── CLOUD FUNCTIONS (Node 20) ──
│   ├── index.js               # onLeadCreated · eventReminders · dailyDigest · cleanupReminders
│   └── push.js                # Gửi Expo push & dọn token hỏng
│
├── frontend/                  # ── FRONTEND (React + Vite + Firebase) ──
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

### Bước 1: Cài đặt thư viện & khai báo biến môi trường
Mở terminal, vào thư mục `frontend`, cài thư viện và tạo file cấu hình:
```bash
cd frontend
npm install
cp .env.example .env      # rồi mở .env và điền cấu hình Firebase của bạn
```

Giá trị lấy ở **Firebase Console → Project settings → General → Your apps → SDK setup and configuration**.

> [!NOTE]
> Web API key của Firebase **không phải mật khẩu** — nó luôn nằm trong bundle JS mà trình duyệt tải về, ai xem source cũng thấy. Việc bảo vệ dữ liệu là của [`firestore.rules`](firestore.rules) và của phần giới hạn HTTP referrer cho API key trên Google Cloud Console. Để key ngoài mã nguồn chỉ nhằm đổi project không phải sửa code và không kích hoạt cảnh báo secret scanning của GitHub.

### Bước 2: Đồng bộ hóa dữ liệu mặc định lên Cloud Firestore
Nếu đây là lần đầu tiên chạy dự án và bạn đã kích hoạt Cloud Firestore + Authentication (Email/Password) trên Firebase Console:
```bash
ADMIN_EMAIL='ban@example.com' ADMIN_PASSWORD='matkhau-cua-ban' node src/db-init.js
```
*Script này sẽ đăng nhập/tạo tài khoản quản trị và tự động đẩy dữ liệu portfolio từ file local lên Cloud Firestore. Thông tin đăng nhập truyền qua biến môi trường để không bao giờ nằm trong mã nguồn.*

### Bước 3: Chạy ứng dụng ở local
Khởi chạy máy chủ phát triển cục bộ:
```bash
npm run dev
```
*Giao diện sẽ chạy tại địa chỉ: **`http://localhost:5173`***

---

## 🔑 Thông Tin Đăng Nhập Quản Trị Mặc Định

Trang Quản Trị bí mật nằm tại `http://localhost:5173/portal-admin` (bản production: `https://tunglamng.web.app/portal-admin`). Đăng nhập bằng tài khoản **Firebase Authentication** của chính bạn — cũng là tài khoản dùng cho app di động.

> [!IMPORTANT]
> **Không lưu mật khẩu trong repo.** Tài khoản quản trị được tạo bằng biến môi trường ở Bước 2, và đổi mật khẩu ở mục "Đổi mật khẩu" trong Trang Quản Trị, trong **Cài đặt** của app di động, hoặc tại Firebase Console → Authentication → Users.

> [!WARNING]
> Mật khẩu mặc định `adminpassword123` từng nằm trong lịch sử Git công khai của repo này. Nếu tài khoản của bạn vẫn dùng mật khẩu đó, **hãy đổi ngay**.

---

## 📱 Chạy Ứng Dụng Di Động

```bash
cd mobile
npm install
cp .env.example .env    # điền cùng cấu hình Firebase như frontend/.env
npx expo start          # quét QR bằng app Expo Go
```

Xem **[`mobile/README.md`](mobile/README.md)** để biết cách khai báo EAS project ID (bắt buộc để nhận push notification), cấu hình Google OAuth cho đồng bộ Google Calendar, và build file APK cài thẳng vào máy.

Đăng nhập app bằng **đúng tài khoản Firebase Auth của `/portal-admin`**.

---

## 🚀 Đẩy ứng dụng lên Production

Đọc tài liệu chi tiết tại **[`wiki/07-deploy.md`](wiki/07-deploy.md)**. Toàn bộ cấu hình Firebase nằm ở **thư mục gốc** (`firebase.json`, `.firebaserc`, `firestore.rules`).

```bash
npx firebase-tools login

# 1. Website
cd frontend && npm run build && cd ..
npx firebase-tools deploy --only hosting:tunglamng

# 2. Quy tắc bảo mật Firestore (bắt buộc — nếu không form liên hệ sẽ bị chặn)
npx firebase-tools deploy --only firestore:rules

# 3. Cloud Functions (cần nâng project lên gói Blaze)
cd functions && npm install && cd ..
npx firebase-tools deploy --only functions
```

Trang web sẽ được tải lên trực tiếp tại URL: **`https://tunglamng.web.app`**

> [!NOTE]
> Cloud Functions yêu cầu project ở gói **Blaze** (trả theo mức dùng). Nếu chưa bật, website và app vẫn chạy đầy đủ — chỉ mất push notification khi app đã đóng; app vẫn tự nhắc lịch bằng thông báo cục bộ.
