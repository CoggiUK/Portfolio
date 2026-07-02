# 00 — Tổng quan Hệ thống

## 1. Hệ thống này là gì?

**Personal Portfolio & Firebase Admin Console** — một trang web giới thiệu năng lực cá nhân của **Tùng Lâm Nguyễn** (UI/UX Designer hướng tới Product Designer), kèm một **bảng quản trị bí mật** chạy hoàn toàn trên kiến trúc Serverless của Firebase cho phép tự cập nhật hồ sơ và dự án mà không cần sửa code.

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
│  ┌───────────────────┐             ┌─────────────────────┐  │
│  │  Cloud Firestore  │             │Firebase Auth Service│  │
│  │  (settings/main)  │             │(ntlam2211@gmail.com)│  │
│  └───────────────────┘             └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

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

---

## 5. Bản đồ tài liệu

Đọc theo thứ tự: [01-srs.md](01-srs.md) → [02-design-rules.md](02-design-rules.md) → [03-dev-rules.md](03-dev-rules.md) → [04-ai-design-automation.md](04-ai-design-automation.md) → [05-design-fe-handoff.md](05-design-fe-handoff.md).
