# 00 — Tổng quan Hệ thống

## 1. Hệ thống này là gì?

**Personal Portfolio & JWT Admin Console** — một trang web giới thiệu năng lực cá nhân của **Nguyễn Tùng Lâm** (UI/UX Designer hướng tới Product Designer), kèm một **bảng quản trị bí mật** cho phép tự cập nhật hồ sơ và dự án mà không cần sửa code.

Hệ thống được xây để phản ánh đúng cách mình làm việc:

- **Lấy người dùng làm trung tâm** — luồng đọc rõ ràng: Giới thiệu → Kỹ năng → Hành trình → Dự án → Liên hệ.
- **Tư duy hệ thống (Design System)** — mọi màu sắc, khoảng cách, bo góc đều là *token*, không hardcode rời rạc.
- **Hiểu cả phần dev** — tự lập trình end-to-end (React + Express + JWT), đúng tinh thần "nắm vững quy trình hand-off Design ↔ FE".
- **Ứng dụng AI** — quy trình tạo thiết kế/nội dung bằng AI nhưng bám sát tài liệu đặc tả (xem [04-ai-design-automation.md](04-ai-design-automation.md)).

## 2. Triết lý làm việc (vì sao có wiki này)

> "Thiết kế đẹp mà không có quy chuẩn thì không nhân bản được. Quy chuẩn mà không áp dụng vào code thì chỉ là tài liệu chết."

Trong công việc thực tế (Học viện Minh Trí Thành, dự án SPACE), mình chịu trách nhiệm **thiết lập quy chuẩn design thống nhất giữa Design và Front-end** và **xây bộ Design Rules để AI tạo thiết kế bám sát SRS**. Wiki này mô phỏng đúng quy trình đó ở quy mô một dự án cá nhân.

## 3. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                         TRÌNH DUYỆT                           │
│  ┌────────────┐   ┌──────────┐   ┌─────────┐                  │
│  │ Portfolio  │   │  Login   │   │  Admin  │   React 19 (Vite)│
│  │  (public)  │   │  (JWT)   │   │ (secure)│                  │
│  └─────┬──────┘   └────┬─────┘   └────┬────┘                  │
│        │  GET /api/settings           │ Bearer <JWT>          │
└────────┼──────────────┼───────────────┼──────────────────────┘
         │              │               │
         ▼              ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│            EXPRESS API  (backend/server.js :5001)            │
│   /api/settings · /api/auth/login · /api/settings/profile    │
│   Middleware: authenticateJWT (HMAC SHA256, bcryptjs)        │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
                  ┌───────────────────┐
                  │  backend/db.json  │  (file storage)
                  │  profile+projects │
                  └───────────────────┘
```

## 4. Công nghệ sử dụng

| Lớp | Công nghệ | Lý do |
| :-- | :-- | :-- |
| Frontend | React 19, Vite 8 | Nhanh, hiện đại, hot-reload tốt |
| Icons | lucide-react | Nhẹ, đồng nhất, dễ tuỳ biến |
| Styling | CSS Variables thuần (design tokens) | Một nguồn sự thật, không phụ thuộc framework |
| Backend | Node.js + Express | Mình đã quen Node trong các dự án thực tế |
| Auth | JWT (jsonwebtoken) + bcryptjs | Stateless, an toàn, chuẩn ngành |
| Lưu trữ | `db.json` (file) | Đủ cho portfolio cá nhân, dễ chỉnh tay |

## 5. Bản đồ tài liệu

Đọc theo thứ tự: [01-srs.md](01-srs.md) → [02-design-rules.md](02-design-rules.md) → [03-dev-rules.md](03-dev-rules.md) → [04-ai-design-automation.md](04-ai-design-automation.md) → [05-design-fe-handoff.md](05-design-fe-handoff.md).
