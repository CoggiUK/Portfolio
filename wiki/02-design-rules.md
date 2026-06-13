# 02 — Design Rules · Quy tắc Thiết kế

> Đây là **Design System** của dự án. Mọi quy tắc dưới đây được nhúng thành *token* trong [`frontend/src/index.css`](../frontend/src/index.css). **Không hardcode** giá trị thị giác rời rạc trong JSX — luôn tham chiếu token.

Phong cách chủ đạo: **Deep Obsidian Dark + Glassmorphism + Neon accent** — tối giản, tập trung nội dung, có chiều sâu.

---

## 1. Màu sắc (Color Tokens)

| Token CSS | Giá trị | Dùng cho |
| :-- | :-- | :-- |
| `--bg-dark` | `#07070a` | Nền tổng |
| `--bg-card` | `rgba(15,15,25,0.45)` | Nền thẻ kính |
| `--primary-color` | `#00ff88` | Điểm nhấn chính (Emerald) — CTA, active |
| `--secondary-color` | `#8b5cf6` | Điểm nhấn phụ (Violet) — eyebrow, role |
| `--cyan-accent` | `#00f0ff` | Nhấn thứ ba — metric, thời gian |
| `--text-main` | `#f3f4f6` | Tiêu đề & nội dung chính |
| `--text-sub` | `#9ca3af` | Nội dung phụ |
| `--text-muted` | `#6b7280` | Chú thích, footer |
| `--border-color` | `rgba(255,255,255,0.08)` | Viền mặc định |

**Quy tắc màu:**
1. Chỉ **một** màu primary trên mỗi màn hình giữ vai trò "lời kêu gọi hành động" rõ ràng.
2. Primary (Emerald) = hành động/active. Secondary (Violet) = phân loại/nhãn. Cyan = dữ liệu/số liệu.
3. Text trên nền tối phải đạt contrast tối thiểu **AA** (≥ 4.5:1 cho body).
4. Không tạo màu mới ngoài bảng token. Cần sắc thái → dùng `rgba()` của màu token sẵn có.

---

## 2. Typography

| Token | Font | Dùng cho |
| :-- | :-- | :-- |
| `--font-display` | `Outfit` | Tiêu đề h1–h6, logo, nút |
| `--font-sans` | `Plus Jakarta Sans` | Body, form, đoạn văn |

**Type scale (fluid, dùng `clamp()`):**

| Cấp | Khai báo | Class |
| :-- | :-- | :-- |
| Hero title | `clamp(2.6rem, 6vw, 4.8rem)` | `.hero-title` |
| Hero subtitle | `clamp(1.2rem, 2.4vw, 1.9rem)` | `.hero-subtitle` |
| Section title | `clamp(2rem, 3.4vw, 2.7rem)` | `.section-head h2` |
| Card title | `1.2 – 1.45rem` | `.timeline-head h3`, `.project-head h3` |
| Body | `0.92 – 1.08rem` | mặc định |
| Caption | `0.78 – 0.85rem` | `.contact-label`, `.project-period` |

**Quy tắc:** heading luôn `font-weight: 700`, `letter-spacing: -0.02em`, `line-height: 1.1`. Body `line-height: 1.6–1.75`.

---

## 3. Spacing — Lưới 4pt

Mọi khoảng cách là bội số của 4px, khai báo bằng token `--space-*`:

| Token | px | Dùng |
| :-- | :-- | :-- |
| `--space-1` | 4 | Khe nhỏ nhất |
| `--space-2` | 8 | Gap chip |
| `--space-3` | 12 | Gap nội bộ |
| `--space-4` | 16 | Padding chuẩn |
| `--space-5` | 24 | Padding card / gap grid |
| `--space-6` | 32 | Padding card lớn |
| `--space-7` | 48 | Khoảng giữa block |
| `--space-8` | 64 | Section nhỏ |
| `--space-9` | 96 | Section chuẩn (`--section-pad-y`) |

**Quy tắc:** không dùng số lẻ (vd 15px, 22px) cho layout mới. Bám lưới 4pt để FE và Figma khớp nhau khi handoff.

---

## 4. Bo góc & Đổ bóng (Radius & Elevation)

| Token | Giá trị | Dùng |
| :-- | :-- | :-- |
| `--radius-sm` | 10px | Input, chip nhỏ |
| `--radius-md` | 16px | Card |
| `--radius-lg` | 24px | Khối lớn |
| `--radius-pill` | 999px | Nút, navbar, chip pill |

Đổ bóng card: `0 8px 32px rgba(0,0,0,0.37)`; hover thêm glow nhẹ theo màu primary. Glassmorphism: `backdrop-filter: blur(var(--glass-blur))` (16px).

---

## 5. Component Specs

| Component | Class | Quy tắc |
| :-- | :-- | :-- |
| **Glass Card** | `.glass-card` | Nền kính, viền 1px, radius md, hover nâng `-4px` + glow |
| **Nút chính** | `.btn-neon` | Viền + chữ primary; hover đổ nền primary, chữ tối |
| **Nút phụ** | `.btn-secondary` | Trung tính; dùng cho hành động thứ cấp |
| **Nút nhỏ** | `.btn-sm` | Biến thể padding gọn cho navbar/links |
| **Badge** | `.badge` `.badge.primary` `.badge.purple` | Nhãn trạng thái/phân loại |
| **Skill chip** | `.skill-chip` / `.is-active` | Hover → active state (nền primary) |
| **Eyebrow** | `.eyebrow` | Nhãn nhỏ in hoa trên tiêu đề section (màu violet) |
| **Timeline item** | `.timeline-item` | Icon tròn + tiêu đề + period badge + bullet points |

**Trạng thái (states) bắt buộc định nghĩa cho mọi phần tử tương tác:** `default → hover → active/focus → disabled`. Project card thêm `is-highlighted` và `is-dimmed` cho cơ chế highlight kỹ năng (FR-03).

---

## 6. Chuyển động (Motion)

- Easing chuẩn: `cubic-bezier(0.16, 1, 0.3, 1)` qua token `--transition-smooth` (0.4s).
- Hiệu ứng nền (`aurora`, canvas particles, float) chỉ mang tính trang trí — **không** chặn nội dung.
- **Bắt buộc:** tôn trọng `@media (prefers-reduced-motion: reduce)` — tắt animation, đưa transition về 0 (NFR-04).

---

## 7. Responsive (Breakpoints)

| Breakpoint | Hành vi |
| :-- | :-- |
| `> 1024px` | Bố cục đầy đủ, max-width 1200px; hero 2 cột |
| `≤ 1024px` | Giảm `font-size` root xuống 15px |
| `≤ 960px` | Hero gộp 1 cột, profile card căn giữa |
| `≤ 860px` | Journey grid về 1 cột |
| `≤ 768px` | Grid 2/3 cột → 1 cột, root 14px |
| `≤ 720px` | Ẩn nav links (giữ Console), section padding gọn |
| `≤ 480px` | Root 13px; CTA xếp dọc full-width; metrics 2 cột |

Tiếp cận **Mobile-First**; ưu tiên chiều đọc dọc và vùng chạm ≥ 44px.
Chi tiết quy trình & checklist responsive: xem [06-responsive.md](06-responsive.md).

---

## 8. Checklist tuân thủ (trước khi merge UI)

- [ ] Mọi màu đều từ bảng token, không có hex lạ.
- [ ] Mọi spacing là bội số 4 (token `--space-*`).
- [ ] Heading dùng `--font-display`, body dùng `--font-sans`.
- [ ] Phần tử tương tác có đủ 4 trạng thái.
- [ ] Contrast text đạt AA.
- [ ] Hoạt động đúng ở 320px và 1440px.
- [ ] Tôn trọng `prefers-reduced-motion`.
