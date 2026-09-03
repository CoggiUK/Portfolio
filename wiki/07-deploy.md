# 07 — Deploy · Đưa dự án lên Production (Firebase)

> Hướng dẫn đưa code lên GitHub và deploy trang web tĩnh lên **Firebase Hosting**, cấu hình cơ sở dữ liệu trên **Cloud Firestore**, xác thực qua **Firebase Authentication**, triển khai **Cloud Functions** (push notification) và build **app di động**.

> [!IMPORTANT]
> Từ phiên bản có app di động, toàn bộ cấu hình Firebase đã chuyển về **thư mục gốc** của repo: `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`. Mọi lệnh `firebase-tools` chạy ở gốc repo, không còn chạy trong `frontend/`.

---

## 1. Tổng quan kiến trúc deploy

```
GitHub repo ──▶ Đẩy lên GitHub Fork của bạn (origin)
                  │ 
                  ▼
              Máy cục bộ (Local Machine)
                  ├── frontend: npm run build ──▶ Firebase Hosting
                  ├── firestore.rules          ──▶ Firestore Security Rules
                  ├── functions/               ──▶ Cloud Functions (Blaze)
                  └── mobile/: eas build       ──▶ APK / TestFlight
                         │
                         ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │  Cloud Firestore  ·  Firebase Auth  ·  Cloud Functions            │
   └───────┬───────────────────────────────────────────────┬───────────┘
           │                                               │
   Website (tunglamng.web.app)                    App "Tùng Lâm Workspace"
   • Khách gửi form → collection `leads`          • Nhận push realtime khi có lead
   • Đọc nội dung từ `settings/main`              • Lịch ⟷ Google Calendar
                                                  • Sửa `settings/main` → web đổi ngay
```

---

## 2. Bước 1 — Thiết lập trên Firebase Console

Trước khi deploy mã nguồn, bạn cần kích hoạt các dịch vụ sau trên giao diện web của [Firebase Console](https://console.firebase.google.com/):

### 2.1 Kích hoạt Cloud Firestore
1. Truy cập dự án của bạn, chọn **Cloud Firestore** trên thanh điều hướng bên trái.
2. Nhấn **Create database** (Tạo cơ sở dữ liệu), chọn **Production mode** và khu vực đặt máy chủ gần bạn nhất (ví dụ: Singapore - `asia-southeast1`).
3. **Không sửa Rules bằng tay trên Console nữa** — quy tắc đã được viết sẵn tại [`firestore.rules`](../firestore.rules) ở gốc repo và deploy bằng CLI:
   ```bash
   npx firebase-tools deploy --only firestore:rules
   ```
   Bộ quy tắc này quy định:
   | Đường dẫn | Quyền |
   | :--- | :--- |
   | `settings/{docId}` | Ai cũng đọc (website công khai) · chỉ tài khoản đăng nhập được ghi |
   | `leads/{leadId}` | Khách **chỉ được tạo** (có kiểm tra kiểu & độ dài từng trường) · chỉ admin đọc/sửa/xoá |
   | `users/{uid}/**` | Chỉ chính chủ tài khoản đó đọc/ghi — lịch, việc, ghi chú, thói quen, chi tiêu, token thiết bị |
   | Còn lại | Chặn hoàn toàn |

   > ⚠️ Nếu bỏ qua bước này, form liên hệ trên website sẽ bị Firestore từ chối và app không nhận được thông báo nào.

### 2.2 Kích hoạt Authentication Email/Password
1. Chọn mục **Authentication** ở menu bên trái.
2. Nhấn **Get Started**, sau đó sang tab **Sign-in method**.
3. Chọn **Email/Password**, gạt nút **Enable** đầu tiên và nhấn **Save** để lưu.

---

## 3. Bước 2 — Đồng bộ hóa dữ liệu ban đầu lên Database

Do bạn đang dùng cơ sở dữ liệu trực tuyến Cloud Firestore, bạn cần đẩy dữ liệu từ file tĩnh cục bộ lên đám mây và tạo tài khoản quản trị:

1. Mở terminal tại thư mục `frontend` và chạy script:
   ```bash
   node src/db-init.js
   ```
2. Kết quả mong đợi:
   - `Admin user created successfully!` (hoặc `Admin user already exists.`)
   - `Firestore data uploaded successfully!`
3. Tài khoản quản trị mặc định:
   - **Email**: `ntlam2211@gmail.com`
   - **Password**: `adminpassword123` *(Có thể thay đổi mật khẩu sau khi đăng nhập).*

---

## 4. Bước 3 — Deploy ứng dụng lên Firebase Hosting

Với môi trường phát triển sử dụng Node.js 18, bạn nên sử dụng phiên bản `firebase-tools@13` để tránh các lỗi không tương thích.

### 4.1 Đăng nhập Firebase CLI
Chạy lệnh sau để đăng nhập tài khoản chứa dự án Firebase của bạn:
```bash
npx firebase-tools@13.29.0 login
```

### 4.2 Build ứng dụng tĩnh
Chạy lệnh đóng gói mã nguồn của React:
```bash
npm run build
```
*Kết quả build sẽ được xuất ra thư mục `frontend/dist/`.*

### 4.3 Thực hiện Deploy lên Hosting
Chạy tại **gốc repo** (không phải trong `frontend/`):
```bash
npx firebase-tools@13.29.0 deploy --only hosting:tunglamng
```
Sau khi hoàn tất, Firebase sẽ cung cấp **Hosting URL** công khai của bạn, ví dụ: **`https://tunglamng.web.app`**.

---

## 4b. Bước 4 — Deploy Cloud Functions (push notification)

Cloud Functions lo 4 việc, xem mã nguồn tại [`functions/index.js`](../functions/index.js):

| Hàm | Kích hoạt | Việc làm |
| :--- | :--- | :--- |
| `onLeadCreated` | Có document mới trong `leads` | Bắn push **ngay lập tức** về mọi thiết bị đã đăng ký |
| `eventReminders` | Mỗi 5 phút | Nhắc lịch theo từng mốc `reminders` của sự kiện |
| `dailyDigest` | 07:00 hằng ngày (giờ VN) | Tóm tắt lịch, việc đến hạn, lead chưa đọc |
| `cleanupReminders` | 03:00 hằng ngày | Dọn cờ `notified` của sự kiện đã qua |

```bash
# Cần nâng project lên gói Blaze trước (Firebase Console → Upgrade)
cd functions && npm install && cd ..
npx firebase-tools deploy --only functions
```

> [!NOTE]
> Nếu chưa bật Blaze: website và app vẫn chạy đầy đủ. App **vẫn tự nhắc lịch** bằng thông báo cục bộ đặt sẵn trên máy, và **vẫn hiện thông báo lead mới** khi app đang chạy nền — chỉ mất push khi app đã bị tắt hẳn.

---

## 4c. Bước 5 — Build ứng dụng di động

Chi tiết đầy đủ (Google OAuth, EAS project ID) nằm trong [`mobile/README.md`](../mobile/README.md).

```bash
cd mobile
npm install
npx eas login && npx eas init          # ghi extra.eas.projectId vào app.json — bắt buộc để có push
npx expo start                          # thử nhanh bằng Expo Go
npx eas build --profile preview --platform android   # xuất file APK
```

---

## 5. Chạy cục bộ (Local Development)

Nếu bạn muốn chạy thử nghiệm ứng dụng ở local sau khi clone dự án về:
```bash
cd frontend
npm install
npm run dev
```
*Ứng dụng sẽ chạy cục bộ tại: `http://localhost:5173` và tự động kết nối trực tuyến tới database Cloud Firestore của bạn.*
