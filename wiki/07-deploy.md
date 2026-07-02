# 07 — Deploy · Đưa dự án lên Production (Firebase)

> Hướng dẫn đưa code lên GitHub và deploy trang web tĩnh lên **Firebase Hosting**, cấu hình cơ sở dữ liệu trên **Cloud Firestore** và xác thực qua **Firebase Authentication**.

---

## 1. Tổng quan kiến trúc deploy

```
GitHub repo ──▶ Đẩy lên GitHub Fork của bạn (origin)
                  │ 
                  ▼
              Máy cục bộ (Local Machine)
                  ├── Chạy lệnh build: npm run build
                  └── Deploy lên Firebase Hosting: npx firebase-tools deploy
                         │
                         ▼
              Người dùng truy cập URL Firebase Hosting (https://tunglamng.web.app)
              Kết nối trực tiếp đến Cloud Firestore (Database) & Firebase Auth (Xác thực)
```

---

## 2. Bước 1 — Thiết lập trên Firebase Console

Trước khi deploy mã nguồn, bạn cần kích hoạt các dịch vụ sau trên giao diện web của [Firebase Console](https://console.firebase.google.com/):

### 2.1 Kích hoạt Cloud Firestore
1. Truy cập dự án của bạn, chọn **Cloud Firestore** trên thanh điều hướng bên trái.
2. Nhấn **Create database** (Tạo cơ sở dữ liệu), chọn **Production mode** và khu vực đặt máy chủ gần bạn nhất (ví dụ: Singapore - `asia-southeast1`).
3. Đi tới tab **Rules** (Quy tắc), cập nhật quy tắc bảo mật sau và nhấn **Publish**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /settings/main {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

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
Đẩy toàn bộ thư mục `dist` lên Firebase Hosting:
```bash
npx firebase-tools@13.29.0 deploy --only hosting:tunglamng
```
Sau khi hoàn tất, Firebase sẽ cung cấp **Hosting URL** công khai của bạn, ví dụ: **`https://tunglamng.web.app`**.

---

## 5. Chạy cục bộ (Local Development)

Nếu bạn muốn chạy thử nghiệm ứng dụng ở local sau khi clone dự án về:
```bash
cd frontend
npm install
npm run dev
```
*Ứng dụng sẽ chạy cục bộ tại: `http://localhost:5173` và tự động kết nối trực tuyến tới database Cloud Firestore của bạn.*
