# Design Tokens — Màu, Typography, Spacing, Radius, Elevation, Motion, Z-index

## 1. Cấu trúc 3 tầng (bắt buộc)

```
Tầng 1 — Primitive:  --blue-500, --gray-900     (giá trị thô, KHÔNG dùng trực tiếp trong component)
Tầng 2 — Semantic:   --primary, --destructive   (component CHỈ dùng tầng này)
Tầng 3 — Component:  --btn-primary-bg           (chỉ tạo khi thật sự cần override)
```

## 2. Neutral ramp (xương sống — chiếm ~90% giao diện)

Neutral ngả lạnh (slate) — chuẩn của Linear / Vercel / Stripe.

| Step | Hex | Vai trò |
|------|-----|---------|
| 50 | `#F8FAFC` | page background (light) |
| 100 | `#F1F5F9` | subtle bg, hover row, zebra |
| 200 | `#E2E8F0` | **border mặc định**, divider |
| 300 | `#CBD5E1` | border hover, disabled border |
| 400 | `#94A3B8` | placeholder, icon phụ, disabled text |
| 500 | `#64748B` | **muted text** (contrast 4.6:1 trên nền trắng) |
| 600 | `#475569` | secondary text |
| 700 | `#334155` | body text nhấn |
| 800 | `#1E293B` | surface (dark mode) |
| 900 | `#0F172A` | **heading / body text chính** |
| 950 | `#020617` | page background (dark) |

## 3. Brand & semantic

| Semantic | Light | Dark | Dùng cho |
|----------|-------|------|----------|
| `primary` | `#2563EB` | `#3B82F6` | CTA chính, link, focus ring, tab active |
| `primary-hover` | `#1D4ED8` | `#60A5FA` | hover state |
| `success` | `#16A34A` | `#22C55E` | hoàn tất, đã duyệt, tăng trưởng |
| `warning` | `#D97706` | `#F59E0B` | cảnh báo, chờ xử lý, sắp hết hạn |
| `destructive` | `#DC2626` | `#EF4444` | xoá, lỗi, từ chối |
| `info` | `#0891B2` | `#06B6D4` | thông báo trung tính |

Mỗi màu semantic có 3 biến thể: `-bg` (tint ~10%), `-border` (~20%), `-fg` (text/icon đậm).
Ví dụ badge lỗi: `bg-destructive/10 text-destructive border-destructive/20`.

## 4. Tỷ lệ 60-30-10 (bắt buộc kiểm tra)

- **60%** neutral background/surface
- **30%** text + border neutral
- **10%** brand + semantic — chỉ ở nút chính, link, badge trạng thái, chart

> Màn hình có > 10% diện tích màu brand = FAIL. Đây là lỗi số 1 khiến app "trông nghiệp dư".

## 5. Contrast bắt buộc (WCAG 2.2 AA)

| Đối tượng | Tỷ lệ tối thiểu |
|-----------|-----------------|
| Text thường (< 18.66px regular / < 24px bold) | **4.5:1** |
| Text lớn | 3:1 |
| Icon, border input, ranh giới component | **3:1** |
| Focus indicator vs nền kề | 3:1 |
| Text disabled | miễn trừ, nhưng nên ≥ 3:1 |

## 6. Token CSS — copy thẳng vào `globals.css`

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;        /* slate-900 */
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 221 83% 53%;           /* blue-600 */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;         /* slate-100 */
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;  /* slate-500 */
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --success: 142 71% 45%;
    --warning: 32 95% 44%;
    --info: 192 91% 36%;
    --border: 214 32% 91%;            /* slate-200 */
    --input: 214 32% 91%;
    --ring: 221 83% 53%;
    --radius: 0.5rem;

    --shadow-xs: 0 1px 2px 0 rgb(15 23 42 / 0.04);
    --shadow-sm: 0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.06);
    --shadow-md: 0 4px 12px -2px rgb(15 23 42 / 0.10), 0 2px 6px -2px rgb(15 23 42 / 0.06);
    --shadow-lg: 0 12px 28px -6px rgb(15 23 42 / 0.14), 0 4px 10px -4px rgb(15 23 42 / 0.08);
    --shadow-xl: 0 24px 48px -12px rgb(15 23 42 / 0.20);
  }

  .dark {
    --background: 222 47% 5%;
    --foreground: 210 40% 96%;
    --card: 222 47% 8%;
    --card-foreground: 210 40% 96%;
    --popover: 222 47% 8%;
    --popover-foreground: 210 40% 96%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 96%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 96%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --success: 142 71% 45%;
    --warning: 38 92% 50%;
    --info: 189 94% 43%;
    --border: 217 33% 20%;
    --input: 217 33% 20%;
    --ring: 217 91% 60%;
  }

  * { @apply border-border; }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "cv02","cv03","cv04","cv11";
  }
}
```

**Dark mode không phải đảo màu.** Quy tắc:

- Nền dark dùng `#0F172A`–`#020617`, **không dùng `#000` thuần**
- Surface nổi lên bằng cách **sáng dần**, không bằng shadow
- Giảm saturation màu brand ~10%
- Text chính hạ từ `#FFF` xuống `#E2E8F0` để chống quầng sáng (halation)

---

## 7. Typography

### Font stack

```css
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
             "Helvetica Neue", "Noto Sans", sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

Tối đa **2 font family** toàn app. Số liệu / ID / mã đơn dùng `font-mono` hoặc
`font-variant-numeric: tabular-nums`.

### Thang chữ

| Token | Size | Line-height | Weight | Letter-spacing | Dùng cho |
|-------|------|-------------|--------|----------------|----------|
| `text-xs` | 12px | 16px | 500 | +0.01em | label bảng, caption, badge |
| `text-sm` | 14px | 20px | 400 | 0 | **body mặc định trong app**, input, table cell |
| `text-base` | 16px | 24px | 400 | 0 | **body mặc định web/marketing**, mobile input |
| `text-lg` | 18px | 28px | 500 | 0 | lead-in, card title lớn |
| `text-xl` | 20px | 28px | 600 | −0.01em | section title trong app |
| `text-2xl` | 24px | 32px | 600 | −0.015em | page title (app) |
| `text-3xl` | 30px | 36px | 700 | −0.02em | h2 marketing |
| `text-4xl` | 36px | 40px | 700 | −0.02em | h1 app-lite / h2 lớn |
| `text-5xl` | 48px | 52px | 800 | −0.025em | hero desktop nhỏ |
| `text-6xl` | 60px | 64px | 800 | −0.03em | hero |
| `text-7xl` | 72px | 76px | 800 | −0.03em | hero cực lớn |

**Luật vàng**: chữ càng lớn → line-height càng nhỏ (1.05–1.2), letter-spacing càng âm.
Chữ nhỏ → line-height 1.4–1.6, letter-spacing 0 hoặc dương nhẹ.

### Quy tắc đọc

- Độ dài dòng **45–75 ký tự** (`max-w-prose` / `max-w-[65ch]`) — bắt buộc cho mọi đoạn văn
- Chỉ dùng weight 400 / 500 / 600 / 700 / 800. Không dùng 300 cho body
- `uppercase` chỉ cho label ≤ 3 từ, kèm `tracking-wider`
- Không căn đều (`text-justify`); không căn giữa đoạn > 2 dòng
- Hero responsive: `text-[clamp(2.25rem,5vw,4.5rem)]`

---

## 8. Spacing — thang 4pt

Chỉ dùng các giá trị này:

```
0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128   (px)
Tailwind:  0  0.5  1   2    3    4    5    6    8    10   12   16   20   24   32
```

Ngữ nghĩa cố định:

| Khoảng cách | Giá trị | Class |
|-------------|---------|-------|
| Trong 1 phần tử (icon ↔ text) | 8px | `gap-2` |
| Giữa các field trong 1 nhóm form | 16px | `space-y-4` |
| Giữa các nhóm / card | 24px | `gap-6` |
| Padding trong card / modal | 24px desktop, 16px mobile | `p-4 md:p-6` |
| Padding vùng nội dung chính | 24–32px | `px-6 lg:px-8 py-6` |
| Giữa các section landing | 80–128px | `py-20 lg:py-32` |

---

## 9. Radius

| Token | px | Dùng cho |
|-------|----|----------|
| `sm` | 4 | badge, tag, checkbox |
| `md` | 6 | **input, button, select** (mặc định) |
| `lg` | 8 | card, dropdown, popover |
| `xl` | 12 | modal, panel lớn |
| `2xl` | 16 | hero card, feature block |
| `full` | 9999 | avatar, pill, switch, icon-button tròn |

Luật lồng nhau: `radius_ngoài = radius_trong + padding`.
Card `rounded-lg p-2` chứa ảnh thì ảnh dùng `rounded-md`.

---

## 10. Elevation (6 mức — không tự chế shadow)

| Mức | Token | Dùng cho |
|-----|-------|----------|
| 0 | không shadow, chỉ `border` | card trong app-shell (chuẩn Linear/Stripe) |
| 1 | `shadow-xs` | card có thể hover |
| 2 | `shadow-sm` | dropdown, select menu, tooltip |
| 3 | `shadow-md` | popover, sticky header khi scroll |
| 4 | `shadow-lg` | modal, dialog, drawer |
| 5 | `shadow-xl` | command palette, spotlight |

Trong app nội bộ **ưu tiên border thay vì shadow**. Shadow chỉ để báo "phần tử này nổi trên
layer khác". Dark mode: giảm shadow, tăng độ sáng surface thay thế.

---

## 11. Motion

| Token | Duration | Easing | Dùng cho |
|-------|----------|--------|----------|
| `instant` | 100ms | `linear` | hover màu, opacity |
| `fast` | 150ms | `cubic-bezier(0.2, 0, 0, 1)` | button press, tooltip, checkbox |
| `base` | 200ms | `cubic-bezier(0.2, 0, 0, 1)` | dropdown, accordion, tab |
| `slow` | 300ms | `cubic-bezier(0.05, 0.7, 0.1, 1)` | modal, drawer, page transition |
| `slower` | 500ms | `cubic-bezier(0.05, 0.7, 0.1, 1)` | onboarding, illustration |

Luật:

- Vào (enter) chậm hơn ra (exit) ~1.3×. Vào dùng `ease-out`, ra dùng `ease-in`
- **Chỉ animate `transform` và `opacity`**. Không animate `width/height/top/left`
- Element vào màn: `opacity 0→1` + `translateY(4–8px)→0`. Không scale > 1.05
- Bắt buộc có:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 12. Z-index (thang cố định, không dùng số khác)

| z | Layer |
|---|-------|
| 0 | base |
| 10 | sticky trong nội dung (table header, sticky column) |
| 20 | sticky page header |
| 30 | sidebar / app nav |
| 40 | backdrop / overlay |
| 50 | modal, drawer |
| 60 | dropdown, select, popover (khi mở trong modal) |
| 70 | toast / notification |
| 80 | tooltip |
| 90 | command palette |
| 100 | dev/debug overlay |
