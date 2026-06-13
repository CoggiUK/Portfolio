# 📚 Wiki — Portfolio & JWT Admin Console

> Bộ tài liệu chuẩn (single source of truth) cho dự án **Portfolio cá nhân của Nguyễn Tùng Lâm**.
> Đây không chỉ là tài liệu kỹ thuật — nó là minh chứng cho cách mình làm sản phẩm: **đi từ đặc tả (SRS) → quy tắc thiết kế (Design Rules) → quy tắc lập trình (Dev Rules) → bàn giao (Handoff) → tự động hoá bằng AI.**

Đúng với công việc thực tế của mình tại **Học viện Minh Trí Thành** và dự án **SPACE**: mọi thay đổi trên hệ thống đều bắt nguồn từ một tài liệu đặc tả, được chuẩn hoá thành Design System, rồi mới đưa vào code và AI.

---

## 🗂️ Cấu trúc Wiki

| File | Nội dung | Dành cho |
| :--- | :--- | :--- |
| [00-overview.md](00-overview.md) | Tổng quan hệ thống, triết lý làm việc, sơ đồ kiến trúc | Tất cả |
| [01-srs.md](01-srs.md) | **SRS** — Đặc tả yêu cầu phần mềm (Functional & Non-functional) | BA / PM / Dev |
| [02-design-rules.md](02-design-rules.md) | **Design Rules** — Design tokens, type scale, spacing, component, a11y | Designer / FE |
| [03-dev-rules.md](03-dev-rules.md) | **Dev Rules** — Kiến trúc, quy ước code, API, bảo mật JWT | Developer |
| [04-ai-design-automation.md](04-ai-design-automation.md) | **AI Design Automation** — Quy tắc dùng AI bám sát SRS | Designer / AI |
| [05-design-fe-handoff.md](05-design-fe-handoff.md) | **Handoff** — Checklist bàn giao Design ↔ Front-end | Designer / FE |
| [06-responsive.md](06-responsive.md) | **Responsive** — Quy tắc responsive từ design đến build | Designer / FE |

---

## 🔁 Quy trình áp dụng (workflow)

```
        ┌──────────┐     ┌───────────────┐     ┌─────────────┐     ┌──────────┐
        │  01 SRS  │ ──▶ │ 02 Design Rules│ ──▶ │ 03 Dev Rules │ ──▶ │ Sản phẩm │
        └────┬─────┘     └───────┬───────┘     └──────┬──────┘     └────┬─────┘
             │                   │                    │                 │
             │             ┌─────▼──────┐       ┌─────▼──────┐          │
             └────────────▶│ 04 AI Auto │       │ 05 Handoff │◀─────────┘
                           └────────────┘       └────────────┘
```

1. **SRS** mô tả *cái gì* cần làm và *tại sao*.
2. **Design Rules** quy định *trông như thế nào* (token, component, trạng thái).
3. **Dev Rules** quy định *được code như thế nào* (kiến trúc, API, bảo mật).
4. **AI Automation** dùng AI để tạo nhanh nhưng *bám sát SRS + Design Rules*.
5. **Handoff** đảm bảo Design và FE *nói cùng một ngôn ngữ*.

---

## ✅ "Apply rules" — Wiki này đã được áp dụng vào code

Wiki không phải lý thuyết suông. Các quy tắc dưới đây đã được nhúng trực tiếp vào dự án:

- **Design tokens** trong [02-design-rules.md](02-design-rules.md) ↔ biến CSS trong [`frontend/src/index.css`](../frontend/src/index.css) (`--space-*`, `--radius-*`, màu, font).
- **Responsive design→build** trong [06-responsive.md](06-responsive.md) ↔ "responsive ladder" cuối [`frontend/src/index.css`](../frontend/src/index.css).
- **Đặc tả API & bảo mật** trong [01-srs.md](01-srs.md) / [03-dev-rules.md](03-dev-rules.md) ↔ [`backend/server.js`](../backend/server.js).
- **Cấu trúc dữ liệu hồ sơ** (lấy từ CV) trong [01-srs.md](01-srs.md) ↔ [`backend/db.json`](../backend/db.json).
- **Component & state** trong [02-design-rules.md](02-design-rules.md) ↔ [`frontend/src/components/Portfolio.jsx`](../frontend/src/components/Portfolio.jsx).

> Mỗi khi đổi token trong Design Rules, hãy đổi đúng biến trong `frontend/src/index.css`. Một nguồn sự thật — không hardcode trùng lặp.
