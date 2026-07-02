# 01 — SRS · Đặc tả Yêu cầu Phần mềm

> Software Requirements Specification cho **Portfolio & Firebase Admin Console**.
> Đây là *nguồn sự thật* về *cái gì* hệ thống phải làm. Mọi Design Rules, Dev Rules và prompt AI đều phải truy vết được về một mục trong tài liệu này.

---

## 1. Giới thiệu

### 1.1 Mục đích
Cung cấp một trang portfolio cá nhân chuyên nghiệp cho **Tùng Lâm Nguyễn**, đồng thời cho phép chủ sở hữu tự cập nhật nội dung (hồ sơ, dự án) qua một bảng quản trị bảo mật trực tiếp trên nền tảng Firebase mà không cần can thiệp mã nguồn.

### 1.2 Phạm vi
- **Trong phạm vi:** trang public giới thiệu bản thân; xác thực admin bằng Firebase Authentication; CRUD hồ sơ & dự án lưu tại Cloud Firestore; đổi mật khẩu trực tiếp qua Auth SDK; responsive; hiệu ứng nền; deploy Firebase Hosting.
- **Ngoài phạm vi:** đa người dùng, gửi email thật từ form liên hệ, CMS phức tạp, cơ sở dữ liệu quan hệ.

### 1.3 Đối tượng & quyền
| Vai trò | Quyền |
| :-- | :-- |
| **Khách (Visitor)** | Xem portfolio công khai, gửi form liên hệ (mô phỏng) |
| **Admin (chủ sở hữu)** | Toàn quyền: đăng nhập, sửa hồ sơ/dự án, đổi mật khẩu quản trị |

---

## 2. Mô tả tổng thể

Single-Page Application (React) + Cloud Firestore + Firebase Authentication. Deploy trên Firebase Hosting. Trang admin truy cập qua đường dẫn bí mật `/portal-admin` hoặc nháy đúp Avatar/chữ Console.

---

## 3. Mô hình dữ liệu (Data Model)

Lưu trữ trực tuyến trong Cloud Firestore thuộc Collection `settings`, Document `main`.

### 3.1 `profile`
| Trường | Kiểu | Bắt buộc | Mô tả |
| :-- | :-- | :-- | :-- |
| `name` | string | ✅ | Họ tên — *Tùng Lâm Nguyễn* |
| `title` | string | ✅ | Chức danh — *UI/UX Designer · hướng tới Product Designer* |
| `bio` | string | ✅ | Giới thiệu ngắn (mục tiêu nghề nghiệp) |
| `avatar` | string (data URL) | – | Ảnh đại diện base64 — tải lên & nén ở Admin |
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
Quản lý bảo mật thông qua dịch vụ **Firebase Authentication** đối với tài khoản `ntlam2211@gmail.com` (mật khẩu mặc định khởi tạo: `adminpassword123`).

---

## 4. Yêu cầu Chức năng (Functional Requirements)

| ID | Yêu cầu | Tiêu chí chấp nhận |
| :-- | :-- | :-- |
| **FR-01** | Hiển thị Hero (tên, chức danh, bio, avatar monogram, quick facts) | Dữ liệu lấy từ Firestore `settings/main`; avatar sinh từ chữ cái đầu của tên nếu không có ảnh |
| **FR-02** | Hiển thị Kỹ năng theo nhóm | Render từ `profile.skillGroups` |
| **FR-03** | Highlight liên kết Kỹ năng ↔ Dự án | Hover chip kỹ năng → dự án chứa `tech` đó nổi bật, dự án khác mờ đi |
| **FR-04** | Hiển thị Hành trình (kinh nghiệm, hoạt động, học vấn, sở thích) | Render từ `experience`, `activities`, `education`, `interests` |
| **FR-05** | Hiển thị danh sách Dự án | Mỗi card có role, period, metrics, details, tech, links |
| **FR-06** | Form liên hệ | Validate name/email/message; hiển thị trạng thái gửi thành công |
| **FR-07** | Truy cập Admin bí mật | Qua `/portal-admin` hoặc nháy đúp Avatar/Console |
| **FR-08** | Đăng nhập Firebase | Kiểm tra tài khoản admin thông qua `signInWithEmailAndPassword` |
| **FR-09** | Duy trì trạng thái đăng nhập | Dùng `onAuthStateChanged` của Firebase để quản lý phiên và bảo vệ route Admin |
| **FR-10** | Sửa hồ sơ cá nhân | Lưu trực tiếp vào Firestore `settings/main` document (trường `profile`) |
| **FR-10b** | Tải & cập nhật ảnh đại diện | Admin chọn ảnh → tự cắt vuông + nén 320px → base64 vào `profile.avatar`; hiển thị ở Hero |
| **FR-11** | CRUD dự án | Cập nhật trực tiếp vào Firestore `settings/main` document (trường `projects`) |
| **FR-12** | Đổi mật khẩu | Tái xác thực admin bằng mật khẩu hiện tại, sau đó cập nhật qua `updatePassword` |
| **FR-13** | Xem trạng thái phiên đăng nhập | Hiển thị email quản trị viên đang hoạt động trong bảng điều khiển Admin |

---

## 5. Yêu cầu Phi chức năng (Non-Functional Requirements)

| ID | Loại | Yêu cầu |
| :-- | :-- | :-- |
| **NFR-01** | Bảo mật | Quyền ghi vào Firestore `settings/main` bắt buộc phải có Auth (`request.auth != null`), cấu hình qua Quy tắc bảo mật (Security Rules) |
| **NFR-02** | Hiệu năng | Canvas nền dùng `requestAnimationFrame`; spotlight qua CSS var `--mouse-x/y` để tránh re-render React |
| **NFR-03** | Responsive | Hỗ trợ 320px → 1440px+; breakpoints 480 / 720 / 860 / 1024px |
| **NFR-04** | Accessibility | Tôn trọng `prefers-reduced-motion`; contrast đạt WCAG AA cho text |
| **NFR-05** | Maintainability | Mọi giá trị thị giác là token (xem [02-design-rules.md](02-design-rules.md)); một nguồn sự thật |
| **NFR-06** | Tương thích phiên | Trạng thái xác thực tự động được đồng bộ và duy trì an toàn bởi Firebase Client SDK |
