# Tùng Lâm Workspace — App mobile

Ứng dụng di động (Expo / React Native) vừa là **trung tâm quản lý cá nhân**, vừa là **bảng điều khiển website portfolio**. Dùng chung project Firebase `portfolio-42c34` với web nên không cần backend riêng.

| Tính năng | Mô tả |
|---|---|
| 📅 **Lịch làm việc** | Khung tháng + danh sách theo ngày, nhãn màu, nhắc trước nhiều mốc |
| 🔄 **Đồng bộ Google Calendar** | Hai chiều: đẩy lịch tạo trong app lên Google, kéo lịch từ Google về |
| 🔔 **Nhắc lịch tự động** | Thông báo cục bộ (chạy cả khi offline) + push từ Cloud Functions |
| 💬 **Liên hệ realtime** | Ai gửi form trên web là máy rung ngay, kèm hộp thư quản lý trạng thái |
| ✅ **Công việc** | Todo có ưu tiên, hạn chót, lọc theo trạng thái |
| 📝 **Ghi chú** | Ghi chú nhanh có thẻ, tìm kiếm, ghim |
| 🌱 **Thói quen** | Điểm danh theo tuần, chuỗi streak, heatmap 30 ngày |
| 💰 **Chi tiêu** | Thu/chi theo danh mục, thống kê tháng |
| 🌐 **Quản trị website** | Sửa hồ sơ, kỹ năng, dự án — lưu thẳng vào Firestore, web đổi ngay |

---

## 1. Cài đặt

```bash
cd mobile
npm install
```

## 2. Cấu hình

Sao chép `.env.example` thành `.env` và điền những gì cần. Firebase đã có sẵn giá trị mặc định trỏ tới project `portfolio-42c34`, chỉ điền khi muốn đổi project.

### 2.1 EAS project ID — bắt buộc để nhận push notification

```bash
npx eas login
npx eas init
```

Lệnh này tự ghi `extra.eas.projectId` vào `app.json`. Nếu bỏ qua, app vẫn chạy và vẫn **nhắc lịch cục bộ**, nhưng sẽ không nhận được push khi app đã đóng.

### 2.2 Google OAuth — để đồng bộ Google Calendar

1. Mở [Google Cloud Console](https://console.cloud.google.com/) → chọn project `portfolio-42c34`.
2. **APIs & Services → Library** → bật **Google Calendar API**.
3. **APIs & Services → OAuth consent screen** → chọn External, thêm chính email của bạn vào *Test users*.
4. **Credentials → Create credentials → OAuth client ID**:
   - Loại **Android**: package name `tunglam.workspace`, SHA-1 lấy bằng `npx eas credentials` (hoặc `keytool` với debug keystore khi chạy `expo run:android`).
   - Loại **iOS** (nếu build iOS): bundle ID `tunglam.workspace`.
5. Dán các client ID vào `.env`:

```dotenv
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxx.apps.googleusercontent.com
```

> ⚠️ **OAuth với custom scheme không chạy trong Expo Go.** Muốn thử đồng bộ Google Calendar phải dùng development build (mục 3.2) hoặc bản build EAS. Mọi tính năng còn lại chạy bình thường trong Expo Go.

## 3. Chạy app

### 3.1 Expo Go (nhanh nhất, đủ để thử mọi thứ trừ Google OAuth)

```bash
npx expo start
```

Quét mã QR bằng app **Expo Go** trên điện thoại.

### 3.2 Development build (đầy đủ tính năng)

```bash
npx expo run:android      # cần Android SDK — máy bạn đã có sẵn
# hoặc build trên máy chủ EAS:
npx eas build --profile development --platform android
```

### 3.3 Bản APK cài thẳng vào máy

```bash
npx eas build --profile preview --platform android
```

## 4. Đăng nhập

Dùng đúng tài khoản Firebase Auth của trang `/portal-admin` trên website (mặc định `ntlam2211@gmail.com`). Đổi mật khẩu trong app sẽ đổi luôn cho web và ngược lại.

---

## Cấu trúc mã nguồn

```text
mobile/
├── App.js                       Bọc Provider + navigator
├── app.json                     Cấu hình Expo, quyền, notification channel
├── eas.json                     Profile build development / preview / production
└── src/
    ├── theme/                   Design token lấy từ frontend/src/index.css
    ├── lib/firebase.js          Khởi tạo Firebase (Auth có persistence AsyncStorage)
    ├── contexts/
    │   ├── AuthContext.js       Đăng nhập / đổi mật khẩu
    │   └── AppContext.js        Toàn bộ luồng realtime + đồng bộ + thông báo
    ├── services/
    │   ├── db.js                Lớp Firestore (sơ đồ dữ liệu ghi ở đầu file)
    │   ├── notifications.js     Quyền, push token, đặt lịch nhắc cục bộ
    │   └── googleCalendar.js    OAuth PKCE + REST Google Calendar
    ├── components/ui.js         Bộ UI kit (Card, Btn, Field, Sheet, FAB…)
    ├── navigation/index.js      Tab + Stack, xử lý chạm vào thông báo
    └── screens/                 Từng màn hình
```

## Cách hoạt động của thông báo

Có **hai lớp** chạy song song, cố tình dư thừa để không bao giờ lỡ lịch:

1. **Cục bộ** (`services/notifications.js`) — mỗi lần danh sách sự kiện đổi, app huỷ hết thông báo cũ có `kind = event-reminder` rồi đặt lại toàn bộ. Chạy trên máy nên vẫn nhắc khi mất mạng.
2. **Server** (`../functions/index.js`) — Cloud Function `eventReminders` chạy mỗi 5 phút và `onLeadCreated` chạy tức thì, gửi push qua Expo tới mọi thiết bị đã đăng ký trong `users/{uid}/devices`.
