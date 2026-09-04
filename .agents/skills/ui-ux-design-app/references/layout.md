# Layout & Vị trí đặt phần tử

## 1. Breakpoints

| Token | min-width | Thiết bị |
|-------|-----------|----------|
| (base) | 0 | mobile portrait |
| `sm` | 640px | mobile landscape |
| `md` | 768px | tablet |
| `lg` | 1024px | laptop — **mốc chuyển app-shell sang sidebar cố định** |
| `xl` | 1280px | desktop |
| `2xl` | 1536px | màn lớn |

Thiết kế **mobile-first**: viết class base cho mobile, thêm `md:` `lg:` để mở rộng.
Kiểm tra bắt buộc ở 4 mốc: **375 · 768 · 1280 · 1920**.

## 2. Container

| Loại | max-width | Padding ngang |
|------|-----------|---------------|
| App content | 1440px (hoặc full-bleed cho bảng) | 24px → 32px (lg) |
| Marketing | 1280px | 16px → 24px → 32px |
| Đoạn văn / docs | 768px (65ch) | 16px |
| Form 1 cột | 480px | 24px |
| Auth card | 400px | 32px |

---

## 3. App shell (ERP / dashboard) — bố cục chuẩn

```
┌────────────────────────────────────────────────────────────────┐
│ Topbar  h=56/64px · logo | breadcrumb | search | notif | avatar│ z-20 sticky
├──────────┬─────────────────────────────────────────────────────┤
│ Sidebar  │  Page header  (title + description + primary action) │
│ w=256px  │  ───────────────────────────────────────────────────│
│ collapsed│  Toolbar (filter · search | view · density · export) │
│ =64px    │  ───────────────────────────────────────────────────│
│ z-30     │  Content (table / cards / form)                     │
│          │  ───────────────────────────────────────────────────│
│          │  Pagination ("1–20 / 348" trái · control phải)      │
└──────────┴─────────────────────────────────────────────────────┘
```

### Số đo bắt buộc

| Vùng | Kích thước |
|------|-----------|
| Topbar | 56px (mobile) / 64px (desktop) |
| Sidebar mở | 240–280px (chuẩn **256px**) |
| Sidebar thu | 64px, chỉ icon + tooltip |
| Nav item | height 36–40px, padding-x 12px, radius `md`, icon 16–20px, gap 12px |
| Page header | padding 24px 32px, title `text-2xl/600` |
| Content padding | 24px (md) / 32px (lg) |
| Drawer chi tiết | 400–560px, trượt từ phải |

### Vị trí bất di bất dịch

Đúng như Gmail, Notion, Linear, Jira, Shopify — **không sáng tạo lại**:

| Phần tử | Vị trí |
|---------|--------|
| Logo / brand | Trên cùng bên trái |
| Global search | Giữa topbar hoặc trái sau logo; hiện phím tắt `⌘K` / `Ctrl+K` trong ô |
| Notification | Trên cùng bên phải, ngay trái avatar |
| Avatar / account menu | Trên cùng bên phải, **ngoài cùng** |
| CTA chính của trang (`+ Tạo mới`) | Phải của page header, ngang hàng tiêu đề |
| Filter / search của bảng | Trên bảng, **trái** |
| View / density / export | Trên bảng, **phải** |
| Bulk action bar | Đè lên toolbar, hoặc nổi giữa-dưới màn khi có row được chọn |
| Pagination | Dưới bảng — tổng số trái, control trang phải |
| Save / Cancel form dài | Sticky footer căn phải: `[Huỷ] [Lưu]` |
| Breadcrumb | Dưới topbar hoặc trong topbar, khi độ sâu ≥ 3 cấp |
| Toast | Top-right (desktop) · top-center hoặc bottom (mobile) |

---

## 4. Grid & sắp xếp

- Dùng 12 cột cho marketing; `auto-fit` grid cho card list:
  `grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]`
- Dashboard KPI: 4 cột (xl) → 2 cột (md) → 1 cột (base)
- Form: **1 cột** cho form ≤ 8 field. 2 cột chỉ khi field **cùng nhóm và ngắn**
  (ngày bắt đầu / ngày kết thúc). **Không bao giờ 3 cột**
- Căn lề: mọi phần tử trong một cột phải chung một trục trái. Không có phần tử "lơ lửng"
- Optical alignment: icon-only button cần padding cân; glyph mũi tên/play bù 1px
- Dùng `gap` thay `margin` khi có thể — tránh margin collapse và margin mồ côi

---

## 5. Mobile / responsive

| Quy tắc | Chi tiết |
|---------|----------|
| Bottom nav | 3–5 item, height 56px + `env(safe-area-inset-bottom)`, icon 24px + label 10–11px |
| Touch target | **≥ 44×44px** (Apple HIG). WCAG 2.2 AA tối thiểu 24×24 nhưng lấy 44 làm chuẩn |
| Khoảng cách target | ≥ 8px giữa 2 vùng chạm |
| Input | `font-size: 16px` để iOS không auto-zoom |
| Hover | **Không dựa vào hover** để lộ chức năng — mobile không có hover |
| Bảng | Chuyển thành card list, hoặc scroll ngang với cột đầu sticky. Không ép 8 cột vào 375px |
| Modal | Chuyển thành **bottom sheet** full-width, `rounded-t-2xl`, có drag handle |
| Vị trí CTA | Đặt ở **nửa dưới màn hình** (vùng ngón cái), không đặt trên cùng |
| Chiều cao | Dùng `100dvh` thay `100vh` (bug thanh địa chỉ mobile) |
| Ảnh | `max-width: 100%`, có `aspect-ratio` để chống CLS |

Bảng dài trên mobile → mỗi row thành card: định danh (bold) → 2–3 field quan trọng →
badge trạng thái → nút hành động.

---

## 6. Landing / marketing

### Thứ tự section chuẩn

Đã được kiểm chứng bởi Stripe, Vercel, Linear, Notion:

1. **Nav** — sticky, trong suốt → có nền khi scroll, h = 64–72px
2. **Hero** — eyebrow → H1 (clamp 40–72px) → subhead 18–20px, max 60ch →
   1 CTA chính + 1 CTA phụ → visual sản phẩm
3. **Social proof** — logo khách hàng (grayscale, opacity 60%) ngay dưới hero
4. **Problem / value props** — 3 cột icon + title + text
5. **Feature deep-dive** — 2–4 block xen kẽ trái/phải (text ↔ ảnh)
6. **Metrics / testimonial**
7. **Pricing** (nếu có) — 3 gói, gói giữa nổi bật bằng border + badge "Phổ biến"
8. **FAQ** — accordion
9. **CTA cuối** — full-width
10. **Footer** — 4–5 cột

### Luật

- Mỗi section: `py-20` (mobile) → `py-32` (desktop)
- Nhịp nền sáng-tối xen kẽ để phân tách section, không dùng đường kẻ
- Tối đa **1 kiểu CTA chính** lặp lại toàn trang
- Ảnh sản phẩm: bo góc `2xl` + `shadow-lg` + border mảnh 1px
- Text hero căn giữa được phép; text body luôn căn trái
- F-pattern cho trang nhiều text, Z-pattern cho hero ít text
- Above-the-fold phải trả lời được: *sản phẩm này là gì, cho ai, làm gì tiếp theo*

---

## 7. Auth layout

- Card `max-w-[400px]`, `p-8`, `rounded-xl`, `shadow-lg`, căn giữa dọc + ngang
- Thứ tự: logo → tiêu đề (`text-2xl/600`) → mô tả 1 dòng → social login → divider "hoặc"
  → form → nút submit full-width `h-11` → link phụ (quên mật khẩu / đăng ký)
- Trên mobile: bỏ card, dùng full-width `px-6`, logo trên cùng
- Không dùng ảnh nền che mất form; nếu split-screen thì form chiếm ≥ 40% chiều ngang
