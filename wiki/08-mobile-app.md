# 08 — Mobile App · Tùng Lâm Workspace

> Đặc tả ứng dụng di động (Expo / React Native) đóng hai vai: **trung tâm quản lý cá nhân** và **bảng điều khiển website portfolio**. App dùng chung project Firebase `portfolio-42c34` với website — không có backend riêng.

---

## 1. Vì sao làm app riêng thay vì responsive web

| Nhu cầu | Web responsive | App native |
| :--- | :--- | :--- |
| Nhận thông báo khi có người để lại liên hệ | ❌ Phải mở trình duyệt | ✅ Push + rung ngay |
| Nhắc trước giờ họp khi máy đang khoá | ❌ | ✅ Thông báo cục bộ (chạy cả khi offline) |
| Đăng nhập một lần, dùng mãi | ⚠️ Phụ thuộc cookie | ✅ Phiên lưu trong AsyncStorage |
| Đồng bộ Google Calendar | ⚠️ Vướng popup blocker | ✅ OAuth native |

Ba nhu cầu đầu đều là *thông báo đúng lúc* — thứ trình duyệt trên di động làm rất tệ. Đó là lý do duy nhất đủ mạnh để mở thêm một nền tảng.

---

## 2. Sơ đồ dữ liệu Firestore

Sơ đồ này là **nguồn sự thật chung** cho cả 3 thành phần; bản sao được ghi ở đầu file [`mobile/src/services/db.js`](../mobile/src/services/db.js).

```text
settings/main                    Nội dung website — web đọc, app & /portal-admin ghi
  ├── profile                    Hồ sơ, học vấn, kinh nghiệm, nhóm kỹ năng
  └── projects[]                 Danh sách dự án (title, tech[], metrics{}, details[], links{})

leads/{leadId}                   Khách để lại liên hệ trên website
  { name, email, phone, message, source, page, userAgent,
    status: 'new'|'contacted'|'won'|'archived', read: bool, createdAt }

users/{uid}/
  ├── events/{id}                Lịch làm việc  ⟷ Google Calendar
  │     { title, description, location, allDay, start, end, color,
  │       reminders: [phút], googleEventId, googleCalendarId, source, notified[] }
  ├── tasks/{id}                 { title, notes, priority, due, done, doneAt, leadId }
  ├── notes/{id}                 { title, content, tags[], pinned }
  ├── habits/{id}                { name, color, target, history: { 'YYYY-MM-DD': true } }
  ├── transactions/{id}          { type: 'income'|'expense', amount, category, note, date }
  ├── devices/{expoPushToken}    { token, platform, deviceName } — Cloud Functions đọc
  └── meta/prefs                 { autoSyncGoogle, googleCalendarId, habitReminder… }
```

**Nguyên tắc:** dữ liệu công khai (`settings`) tách hẳn khỏi dữ liệu cá nhân (`users/{uid}`). Không bao giờ nhét lịch cá nhân vào `settings/main` chỉ vì tiện.

---

## 3. Kiến trúc trong app

```
App.js
 └── AuthProvider              onAuthStateChanged → user | null
      └── AppProvider          MỘT nơi giữ toàn bộ state realtime
           ├── 8 × onSnapshot  events · tasks · notes · habits · transactions · leads · site · prefs
           ├── Push token      xin quyền → getExpoPushTokenAsync → ghi vào users/{uid}/devices
           ├── Nhắc lịch       events đổi → đặt lại toàn bộ thông báo cục bộ
           ├── Lead mới        so mốc thời gian → bắn thông báo ngay khi app đang chạy
           └── Google Calendar saveEvent/deleteEvent tự đẩy thay đổi lên Google
                └── RootNavigator → Tab (Trang chủ · Lịch · Cá nhân · Liên hệ · Web)
```

Mọi màn hình đọc state qua `useApp()`. Không màn hình nào tự mở `onSnapshot` riêng — tránh cảnh 5 listener cùng nghe một collection.

---

## 4. Hai lớp thông báo (cố tình dư thừa)

| Lớp | Nguồn | Chạy khi | Điểm yếu được lớp kia bù |
| :--- | :--- | :--- | :--- |
| **Cục bộ** | [`mobile/src/services/notifications.js`](../mobile/src/services/notifications.js) | Mất mạng, chưa bật Blaze | Mất khi khởi động lại máy / OS dọn alarm |
| **Server** | [`functions/index.js`](../functions/index.js) | App đã tắt hẳn, lịch tạo từ máy khác | Cần mạng và gói Blaze |

Cơ chế lớp cục bộ: mỗi khi danh sách sự kiện đổi, app **huỷ sạch** mọi thông báo có `data.kind === 'event-reminder'` rồi **đặt lại từ đầu**. Cách này khiến sửa/xoá lịch luôn phản ánh đúng mà không phải theo dõi từng notification id — đánh đổi bằng một chút chi phí tính toán, rất đáng.

Lớp server chống gửi trùng bằng mảng `notified[]` trên chính document sự kiện: mốc nào đã bắn thì ghi lại, hàm `cleanupReminders` dọn hằng đêm.

---

## 5. Đồng bộ Google Calendar

- **Luồng xác thực**: Authorization Code + PKCE, `access_type=offline` để lấy `refresh_token`. Không dùng client secret (app cài đặt trên máy không giữ được bí mật). Token nằm trong `expo-secure-store`, tự làm mới khi còn dưới 60 giây.
- **Đẩy lên**: mỗi sự kiện mang `extendedProperties.private.tlwEventId` — dấu vân tay để lần kéo về sau không tạo bản sao.
- **Kéo về**: sự kiện Google nào chưa có `tlwEventId` và chưa từng thấy `googleEventId` thì tạo bản sao local với `source: 'google'`.
- **Sự kiện bị xoá bên Google**: `pushEvent` bắt lỗi 404 và tạo lại thay vì báo lỗi cho người dùng.

> Google OAuth với custom scheme **không chạy trong Expo Go** — cần development build hoặc bản EAS. Mọi tính năng khác chạy bình thường trong Expo Go.

---

## 6. Design tokens

[`mobile/src/theme/index.js`](../mobile/src/theme/index.js) chép đúng thang giá trị của [`frontend/src/index.css`](../frontend/src/index.css) — cùng bảng màu Deep Obsidian, cùng thang 4pt, cùng thang bo góc. Xem [02-design-rules.md](02-design-rules.md).

Đổi token thì đổi **cả hai nơi**. React Native không đọc được biến CSS nên đây là chỗ duy nhất trong dự án chấp nhận trùng lặp có chủ đích.

---

## 7. Checklist trước khi phát hành

- [ ] `npx eas init` đã ghi `extra.eas.projectId` vào `app.json`
- [ ] Google OAuth client ID đã điền trong `mobile/.env`
- [ ] `firestore.rules` đã deploy (form liên hệ hoạt động trên web thật)
- [ ] Cloud Functions đã deploy và `firebase functions:log` thấy `onLeadCreated` chạy
- [ ] Gửi thử form trên website → điện thoại rung trong vài giây
- [ ] Tạo lịch trong app → kiểm tra sự kiện xuất hiện trên Google Calendar
- [ ] Đặt lịch cách 2 phút → tắt app hẳn → xác nhận vẫn nhận được nhắc
