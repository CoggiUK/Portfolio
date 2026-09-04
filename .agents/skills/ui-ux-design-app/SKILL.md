---
name: ui-ux-design-app
description: >
  Chuẩn UI/UX cấp production theo các app lớn thế giới (Material 3, Apple HIG, Linear,
  Stripe, Shopify Polaris, Atlassian) cho React + TypeScript + Tailwind + shadcn/ui.
  Quy định cứng về design token (màu, typography, spacing, radius, elevation, motion,
  z-index), layout & vị trí đặt phần tử, chuẩn từng component (button, form, table, modal,
  toast, empty/loading/error state), quy tắc data-dense ERP, landing marketing, mobile
  responsive và accessibility WCAG 2.2 AA. Dùng khi cần dựng màn hình mới, thiết kế/dựng
  giao diện, review UI, sửa "giao diện xấu / lệch chuẩn", chuẩn hoá design system, hoặc khi
  AI tự code frontend — kể cả khi người dùng không gọi tên skill.
---

# UI/UX Design App — Chuẩn thiết kế & code giao diện

**Mục tiêu**: mọi màn hình do người hoặc AI tạo ra đều đạt mức "ship được" của một app quốc tế —
nhất quán token, đúng vị trí, đúng hành vi, đủ trạng thái, đạt a11y.

**Nguyên tắc tối cao**: *Không bao giờ chế giá trị tự do.* Mọi màu / khoảng cách / cỡ chữ /
bo góc / bóng đổ / thời lượng animation phải lấy từ bảng token trong `references/tokens.md`.

---

## Quy trình bắt buộc (dành cho AI)

Khi nhận yêu cầu liên quan giao diện, chạy đúng thứ tự:

1. **Phân loại màn** → `app-shell` (ERP/dashboard) | `marketing` (landing) | `auth` | `mobile`.
2. **Đọc reference cần thiết** theo bảng bên dưới — đọc *trước* khi viết dòng code đầu tiên.
3. **Chốt layout** theo `references/layout.md`.
4. **Liệt kê đủ 6 trạng thái** của màn: `loading` → `empty` → `partial` → `ideal` → `error` →
   `no-permission`. Thiếu bất kỳ trạng thái nào = chưa xong.
5. **Code** bằng token + component chuẩn.
6. **Tự chấm** theo `references/checklist.md`. Có mục FAIL thì sửa rồi mới trả kết quả.
7. Trả kèm 1 dòng *Design note*: layout đã chọn + token đã dùng + trạng thái đã cover.

### Bản đồ tài liệu

| File | Nội dung | Đọc khi |
|------|----------|---------|
| `references/tokens.md` | Màu, typography, spacing, radius, elevation, motion, z-index + block CSS copy-paste | **Luôn luôn** |
| `references/layout.md` | Breakpoints, container, app-shell, grid, vị trí phần tử, mobile, landing | **Luôn luôn** |
| `references/components.md` | Button, input/form, table, badge, modal, toast, navigation | Khi dựng UI |
| `references/states-content.md` | 6 trạng thái màn, data-viz, microcopy, thông báo lỗi | Khi màn có dữ liệu |
| `references/a11y.md` | WCAG 2.2 AA: keyboard, focus, contrast, ARIA, reduced-motion | **Luôn luôn** |
| `references/code-standards.md` | Cấu trúc thư mục, `cn()`, `cva`, quy ước Tailwind, mẫu code | Khi viết code |
| `references/checklist.md` | Checklist tự chấm + anti-patterns + prompt contract | **Trước khi trả kết quả** |

---

## Mười luật thiết kế cốt lõi

| # | Luật | Diễn giải thực thi |
|---|------|--------------------|
| 1 | **Hệ thống trước, màn hình sau** | Token → primitive → pattern → screen. Không có "màu riêng cho màn này". |
| 2 | **Khoảng trắng là cấu trúc** | Nhóm liên quan cách 8px; nhóm khác cách ≥ 24px. Gestalt proximity quyết định, không phải đường kẻ. |
| 3 | **Một hành động chính / một màn** | Đúng 1 nút `primary` trong mỗi vùng nội dung. Còn lại `secondary`/`ghost`. |
| 4 | **Thứ bậc bằng size + weight + màu, theo thứ tự đó** | Tối đa 3 cấp chữ trong một khối. |
| 5 | **Vị trí có nghĩa** | Nav trái/trên, hành động chính phải-dưới, filter trên bảng, tổng kết cuối bảng. Không sáng tạo vị trí. |
| 6 | **Trạng thái đầy đủ** | Mọi thứ fetch data đều có loading/empty/error. Mọi thứ click được đều có hover/active/focus/disabled. |
| 7 | **Feedback < 100ms** | Click phản hồi tức thì. Tác vụ > 300ms → skeleton. > 3s → progress + text mô tả. |
| 8 | **Không dùng màu làm tín hiệu duy nhất** | Lỗi = màu + icon + text. Bắt buộc cho a11y. |
| 9 | **Chữ đọc được là ưu tiên số 1** | Body 14–16px, line-height 1.5, dòng 45–75 ký tự, contrast ≥ 4.5:1. |
| 10 | **Nhất quán > sáng tạo** | Nếu 90% app lớn làm theo cách A, làm theo cách A. |

---

## Hard stop — cấm tuyệt đối

Nếu code chứa bất kỳ mục nào dưới đây, dừng lại và sửa ngay:

- Hex/rgb màu viết thẳng trong JSX/CSS (`text-[#2563EB]`, `background: #fff`)
- `px` lẻ ngoài thang 4pt (`p-[13px]`, `gap-[7px]`)
- `z-index` số ngẫu nhiên (`z-[9999]`)
- `!important`
- Inline `style` cho việc mà class làm được
- `div`/`span` có `onClick` thay cho `<button>`
- Text < 12px, hoặc contrast < 4.5:1
- Xoá `focus outline` mà không thay bằng focus ring khác
- `alert()` / `confirm()` / `prompt()` của trình duyệt
- Màu brand chiếm > 10% diện tích màn hình

---

## Tóm tắt token (chi tiết trong `references/tokens.md`)

| Nhóm | Giá trị được phép |
|------|-------------------|
| Spacing | `0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128` px |
| Font size | `12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 60 · 72` px |
| Font weight | `400 · 500 · 600 · 700 · 800` |
| Radius | `sm 4 · md 6 · lg 8 · xl 12 · 2xl 16 · full` |
| Elevation | `border-only · xs · sm · md · lg · xl` (6 mức, không tự chế) |
| Duration | `100 · 150 · 200 · 300 · 500` ms |
| Z-index | `0 · 10 · 20 · 30 · 40 · 50 · 60 · 70 · 80 · 90` |
| Breakpoint | `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` |
| Tỷ lệ màu | 60% neutral bg · 30% text/border · **≤ 10% brand + semantic** |

---

## Số đo layout cốt lõi (chi tiết trong `references/layout.md`)

| Vùng | Kích thước |
|------|-----------|
| Topbar | 56px (mobile) / 64px (desktop) |
| Sidebar mở / thu | 256px / 64px |
| Nav item | height 36–40px, padding-x 12px, icon 16–20px, gap 12px |
| Content padding | 24px (md) / 32px (lg) |
| Table row | compact 36 · **default 44** · comfortable 56 px |
| Button height | sm 32 · **md 36 (app) / 40 (web)** · lg 44 px |
| Input height | 36px (app) / 40px (web) |
| Modal max-width | confirm 440 · form 640 · drawer 480–640 px |
| Touch target mobile | **≥ 44×44px**, cách nhau ≥ 8px |
| Container | app 1440 · marketing 1280 · docs 768 · form 480 · auth 400 px |

---

## Vị trí bất di bất dịch

Đúng như Gmail, Notion, Linear, Jira, Shopify — không sáng tạo lại:

- Logo/brand: **trên cùng bên trái**
- Global search: **giữa topbar** hoặc trái sau logo, hiện phím tắt `⌘K`
- Notification → Avatar/account: **trên cùng bên phải, avatar ngoài cùng**
- CTA chính của trang (`+ Tạo mới`): **phải của page header**, ngang hàng tiêu đề
- Filter/search bảng: **trên bảng, trái** — view/density/export: **trên bảng, phải**
- Bulk action bar: đè lên toolbar hoặc nổi giữa-dưới khi có row được chọn
- Pagination: **dưới bảng** — "Hiển thị 1–20 / 348" trái, control trang phải
- Save/Cancel form dài: **sticky footer** căn phải, `[Huỷ] [Lưu]` — chính bên phải
- Toast: **top-right** desktop, **top-center/bottom** mobile
- Breadcrumb: dưới topbar khi độ sâu ≥ 3 cấp

---

## Sáu trạng thái bắt buộc của mọi màn

| Trạng thái | Yêu cầu tối thiểu |
|-----------|-------------------|
| **Loading** | Skeleton mô phỏng đúng layout thật (không spinner toàn màn), xuất hiện sau 200ms |
| **Empty lần đầu** | Giải thích giá trị + CTA tạo mới |
| **Empty do filter** | Nêu bộ lọc hiện tại + nút "Xoá bộ lọc" |
| **Partial** | Field thiếu hiện `—` màu muted, không để trống hay `null` |
| **Error** | Nguyên nhân + nút "Thử lại". Lỗi mạng ≠ lỗi quyền ≠ lỗi server |
| **No permission** | Nói rõ cần quyền gì, liên hệ ai. Không hiện màn trắng |

Mỗi phần tử tương tác cần đủ 7 trạng thái:
`default · hover · active/pressed · focus-visible · disabled · loading · selected`.

---

## Prompt contract — dán vào yêu cầu để AI code đúng

```
Áp dụng skill ui-ux-design-app. Yêu cầu:
- Loại màn: <app-shell | marketing | auth | mobile>
- Stack: React + TypeScript + Tailwind + shadcn/ui + lucide-react
- Chỉ dùng design token semantic. Không hex thẳng, không px lẻ, không z-index tuỳ tiện.
- Layout & vị trí phần tử theo references/layout.md.
- Cover đủ 6 trạng thái màn và 7 trạng thái phần tử tương tác.
- Đạt WCAG 2.2 AA: keyboard, focus ring, contrast, aria-label.
- Responsive kiểm ở 375 / 768 / 1280 / 1920.
- Kết thúc bằng self-check theo references/checklist.md, liệt kê PASS/FAIL từng mục.
```

---

## Tham chiếu chuẩn quốc tế

| Nguồn | Lấy gì |
|-------|--------|
| Material Design 3 | Thang elevation, motion easing, token 3 tầng, touch target 48dp |
| Apple HIG | Touch target 44pt, safe area, bottom sheet, độ rõ typography |
| Shopify Polaris | Pattern bảng/ERP, empty state, microcopy lỗi |
| Atlassian Design System | Cấu trúc form, thời điểm validate, độ sâu navigation |
| IBM Carbon | Density bảng dữ liệu, palette data-viz |
| Linear / Vercel / Stripe | Neutral-first, border thay shadow, chữ nén, tốc độ cảm nhận |
| WCAG 2.2 AA | Contrast, focus, target size, reduced motion |
| Nielsen Norman Group | 10 heuristics, F/Z-pattern, ngưỡng phản hồi 0.1/1/10s |
