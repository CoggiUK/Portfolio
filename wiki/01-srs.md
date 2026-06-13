# 01 — SRS · Đặc tả Yêu cầu Phần mềm

> Software Requirements Specification cho **Portfolio & JWT Admin Console**.
> Đây là *nguồn sự thật* về *cái gì* hệ thống phải làm. Mọi Design Rules, Dev Rules và prompt AI đều phải truy vết được về một mục trong tài liệu này.

---

## 1. Giới thiệu

### 1.1 Mục đích
Cung cấp một trang portfolio cá nhân chuyên nghiệp cho **Nguyễn Tùng Lâm**, đồng thời cho phép chủ sở hữu tự cập nhật nội dung (hồ sơ, dự án) qua một bảng quản trị bảo mật mà không cần can thiệp mã nguồn.

### 1.2 Phạm vi
- **Trong phạm vi:** trang public giới thiệu bản thân; xác thực admin bằng JWT; CRUD hồ sơ & dự án; đổi mật khẩu; responsive; hiệu ứng nền.
- **Ngoài phạm vi:** đa người dùng, gửi email thật từ form liên hệ, CMS phức tạp, cơ sở dữ liệu quan hệ.

### 1.3 Đối tượng & quyền
| Vai trò | Quyền |
| :-- | :-- |
| **Khách (Visitor)** | Xem portfolio công khai, gửi form liên hệ (mô phỏng) |
| **Admin (chủ sở hữu)** | Toàn quyền: đăng nhập, sửa hồ sơ/dự án, đổi mật khẩu |

---

## 2. Mô tả tổng thể

Single-Page Application (React) + REST API (Express) + lưu trữ file (`db.json`). Xác thực **stateless** bằng JWT lưu ở LocalStorage. Trang admin truy cập qua đường dẫn bí mật `/portal-admin` hoặc nháy đúp Avatar.

---

## 3. Mô hình dữ liệu (Data Model)

Lấy trực tiếp từ CV của chủ sở hữu — khớp với [`backend/db.json`](../backend/db.json).

### 3.1 `profile`
| Trường | Kiểu | Bắt buộc | Mô tả |
| :-- | :-- | :-- | :-- |
| `name` | string | ✅ | Họ tên — *Nguyễn Tùng Lâm* |
| `title` | string | ✅ | Chức danh — *UI/UX Designer · hướng tới Product Designer* |
| `bio` | string | ✅ | Giới thiệu ngắn (mục tiêu nghề nghiệp) |
| `email` | string | ✅ | `ntlam2211@gmail.com` |
| `phone` | string | – | `0974 149 916` |
| `location` | string | – | `Bồ Đề, Hà Nội` |
| `company` | string | – | `Học viện Minh Trí Thành` |
| `facebook` | string (url) | – | Link Facebook |
| `education` | object | – | `{ school, major, period, gpa }` |
| `experience` | object[] | – | `{ role, company, period, points[] }` |
| `activities` | object[] | – | `{ role, org, period, points[] }` |
| `skillGroups` | object[] | – | `{ label, items[] }` — kỹ năng theo nhóm |
| `interests` | string[] | – | Sở thích |

### 3.2 `projects[]`
| Trường | Kiểu | Mô tả |
| :-- | :-- | :-- |
| `id` | string | Định danh duy nhất |
| `title`, `subtitle` | string | Tên & mô tả ngắn |
| `role` | string | Vai trò trong dự án |
| `period` | string | Thời gian (vd `07/2025 - Hiện tại`) |
| `tech` | string[] | Công nghệ/công cụ — dùng cho highlight kỹ năng |
| `metrics` | object | Chỉ số tác động (tuỳ chọn) |
| `details` | string[] | Mô tả triển khai |
| `links` | object | `{ live, github, figma }` (ẩn nếu rỗng) |

### 3.3 `credentials`
`{ username, password }` — `password` luôn được hash bằng bcrypt khi server khởi động (không bao giờ lưu plain-text).

---

## 4. Yêu cầu Chức năng (Functional Requirements)

| ID | Yêu cầu | Tiêu chí chấp nhận |
| :-- | :-- | :-- |
| **FR-01** | Hiển thị Hero (tên, chức danh, bio, avatar monogram, quick facts) | Dữ liệu lấy từ `profile`; avatar sinh từ chữ cái đầu của tên |
| **FR-02** | Hiển thị Kỹ năng theo nhóm | Render từ `profile.skillGroups`; fallback gộp từ `projects[].tech` |
| **FR-03** | Highlight liên kết Kỹ năng ↔ Dự án | Hover chip kỹ năng → dự án chứa `tech` đó nổi bật, dự án khác mờ đi |
| **FR-04** | Hiển thị Hành trình (kinh nghiệm, hoạt động, học vấn, sở thích) | Render từ `experience`, `activities`, `education`, `interests` |
| **FR-05** | Hiển thị danh sách Dự án | Mỗi card có role, period, metrics, details, tech, links |
| **FR-06** | Form liên hệ | Validate name/email/message; hiển thị trạng thái gửi thành công |
| **FR-07** | Truy cập Admin bí mật | Qua `/portal-admin` hoặc nháy đúp Avatar/Console |
| **FR-08** | Đăng nhập JWT | Sai → 401; đúng → trả token + `expiresAt` (2h) |
| **FR-09** | Tự đăng xuất khi hết hạn | FE kiểm tra `expiresAt`, hết hạn → về Login |
| **FR-10** | Sửa hồ sơ cá nhân | POST `/api/settings/profile`, yêu cầu JWT, merge & lưu |
| **FR-11** | CRUD dự án | POST `/api/settings/projects`, yêu cầu JWT |
| **FR-12** | Đổi mật khẩu | Kiểm tra mật khẩu cũ, hash mật khẩu mới bằng bcrypt |
| **FR-13** | Xem payload/header JWT đã giải mã | Hiển thị log token đang hoạt động trong Admin |

---

## 5. Yêu cầu Phi chức năng (Non-Functional Requirements)

| ID | Loại | Yêu cầu |
| :-- | :-- | :-- |
| **NFR-01** | Bảo mật | Mật khẩu hash bcrypt (saltRounds=10); JWT ký HMAC SHA256; route admin chặn nếu không có token hợp lệ |
| **NFR-02** | Hiệu năng | Canvas nền dùng `requestAnimationFrame`; spotlight qua CSS var `--mouse-x/y` để tránh re-render React |
| **NFR-03** | Responsive | Hỗ trợ 320px → 1440px+; breakpoints 480 / 720 / 860 / 1024px |
| **NFR-04** | Accessibility | Tôn trọng `prefers-reduced-motion`; contrast đạt WCAG AA cho text |
| **NFR-05** | Maintainability | Mọi giá trị thị giác là token (xem [02-design-rules.md](02-design-rules.md)); một nguồn sự thật |
| **NFR-06** | Tương thích | JWT hết hạn sau 2h; FE đồng bộ kiểm tra theo giây |

---

## 6. Đặc tả API (tóm tắt — chi tiết ở [03-dev-rules.md](03-dev-rules.md))

| Method | Đường dẫn | Quyền | Body |
| :-- | :-- | :-- | :-- |
| GET | `/api/settings` | Công khai | – |
| POST | `/api/auth/login` | Công khai | `{ username, password }` |
| GET | `/api/auth/verify` | JWT | – |
| POST | `/api/settings/profile` | JWT | object `profile` |
| POST | `/api/settings/projects` | JWT | array `projects` |
| POST | `/api/settings/change-password` | JWT | `{ currentPassword, newPassword }` |

---

## 7. Truy vết (Traceability)
Mỗi FR/NFR ở trên phải ánh xạ tới: (1) một quy tắc trong Design/Dev Rules, và (2) một đoạn code thực tế. Khi viết prompt cho AI (file 04), luôn trích dẫn mã FR/NFR để AI không "chế" ngoài đặc tả.
