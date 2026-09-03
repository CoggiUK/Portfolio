# 00 — Tổng quan Hệ thống

## 1. Hệ thống này là gì?

**Personal Portfolio & Firebase Admin Console** — một trang web giới thiệu năng lực cá nhân của **Tùng Lâm Nguyễn** (UI/UX Designer hướng tới Product Designer), kèm một **bảng quản trị bí mật** chạy hoàn toàn trên kiến trúc Serverless của Firebase cho phép tự cập nhật hồ sơ và dự án mà không cần sửa code.

Từ phiên bản 2, hệ thống mở rộng thành **ba thành phần chạy trên cùng một project Firebase**:

| Thành phần | Thư mục | Vai trò |
| :--- | :--- | :--- |
| Website portfolio | `frontend/` | Trang công khai + `/portal-admin` |
| App di động *Tùng Lâm Workspace* | `mobile/` | Quản lý cá nhân, nhận thông báo, điều hành website từ điện thoại |
| Cloud Functions | `functions/` | Push notification lead mới, nhắc lịch, tóm tắt ngày |

Chi tiết kiến trúc app xem [08-mobile-app.md](08-mobile-app.md).

Hệ thống được xây để phản ánh đúng cách mình làm việc:

- **Lấy người dùng làm trung tâm** — luồng đọc rõ ràng: Giới thiệu → Kỹ năng → Hành trình → Dự án → Liên hệ.
- **Tư duy hệ thống (Design System)** — mọi màu sắc, khoảng cách, bo góc đều là *token*, không hardcode rời rạc.
- **Hiểu cả phần dev** — tự lập trình end-to-end (React + Firebase), đúng tinh thần "nắm vững quy trình hand-off Design ↔ FE".
- **Ứng dụng AI** — quy trình tạo thiết kế/nội dung bằng AI nhưng bám sát tài liệu đặc tả (xem [04-ai-design-automation.md](04-ai-design-automation.md)).

---

## 2. Triết lý làm việc (vì sao có wiki này)

> "Thiết kế đẹp mà không có quy chuẩn thì không nhân bản được. Quy chuẩn mà không áp dụng vào code thì chỉ là tài liệu chết."

Trong công việc thực tế (Học viện Minh Trí Thành, dự án SPACE), mình chịu trách nhiệm **thiết lập quy chuẩn design thống nhất giữa Design và Front-end** và **xây bộ Design Rules để AI tạo thiết kế bám sát SRS**. Wiki này mô phỏng đúng quy trình đó ở quy mô một dự án cá nhân.

---

## 3. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                         TRÌNH DUYỆT                           │
│  ┌────────────┐   ┌──────────┐   ┌─────────┐                  │
│  │ Portfolio  │   │  Login   │   │  Admin  │   React 19 (Vite)│
│  │  (public)  │   │ (FB Auth)│   │(Firestore)                 │
│  └─────┬──────┘   └────┬─────┘   └────┬────┘                  │
│        │               │              │                       │
└────────┼───────────────┼──────────────┼──────────────────────┘
         │               │              │
         │ Đọc           │ Xác thực     │ Đọc / Ghi trực tiếp
         │ settings/main │ (Email/Pass) │ settings/main
         ▼               ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                     FIREBASE SERVICES                       │
│  ┌───────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Cloud Firestore  │  │ Firebase Auth│  │Cloud Functions│ │
│  │  settings/main    │  │ntlam2211@…   │  │ onLeadCreated │ │
│  │  leads/           │  └──────────────┘  │ eventReminders│ │
│  │  users/{uid}/…    │                    │ dailyDigest   │ │
│  └─────────┬─────────┘                    └───────┬───────┘  │
└────────────┼────────────────────────────────────┼───────────┘
             │                                    │ Expo Push
             │ onSnapshot (realtime)              ▼
┌────────────┴──────────────────────────────────────────────┐
│           APP DI ĐỘNG — "Tùng Lâm Workspace" (Expo)       │
│  Trang chủ · Lịch ⟷ Google Calendar · Cá nhân · Liên hệ · Web │
└───────────────────────────────────────────────────────────┘
```

Khách gửi form trên website → document mới trong `leads` → Cloud Function bắn push → điện thoại rung trong vài giây. Chiều ngược lại, app ghi vào `settings/main` thì website đổi ngay ở lần tải kế tiếp.

---

## 4. Công nghệ sử dụng

| Lớp | Công nghệ | Lý do |
| :-- | :-- | :-- |
| Frontend | React 19, Vite 5 | Nhanh, hiện đại, tương thích Node 18 |
| Icons | lucide-react | Nhẹ, đồng nhất, dễ tuỳ biến |
| Styling | CSS Variables thuần (design tokens) | Một nguồn sự thật, không phụ thuộc framework |
| Backend/DB | Cloud Firestore | Serverless NoSQL, phản hồi nhanh, bảo mật phân quyền tốt |
| Auth | Firebase Authentication | Bảo mật chuẩn công nghiệp, tự động quản lý phiên |
| Hosting | Firebase Hosting | Tốc độ CDN toàn cầu cực nhanh, tích hợp chứng chỉ SSL miễn phí |
| Mobile | Expo SDK 57 / React Native | Dùng chung ngôn ngữ và Firebase SDK với web, có push & OAuth native |
| Điều hướng | React Navigation 7 | Chuẩn de-facto của React Native, tab + stack gọn nhẹ |
| Thông báo | expo-notifications + Cloud Functions | Hai lớp cục bộ và server bù cho nhau, không bao giờ lỡ lịch |
| Lịch ngoài | Google Calendar API (OAuth PKCE) | Đồng bộ hai chiều mà không cần lưu client secret trên máy |

---

## 5. Bản đồ tài liệu

Đọc theo thứ tự: [01-srs.md](01-srs.md) → [02-design-rules.md](02-design-rules.md) → [03-dev-rules.md](03-dev-rules.md) → [04-ai-design-automation.md](04-ai-design-automation.md) → [05-design-fe-handoff.md](05-design-fe-handoff.md).

Làm việc với app di động: [08-mobile-app.md](08-mobile-app.md) → [07-deploy.md](07-deploy.md) → [`mobile/README.md`](../mobile/README.md).
