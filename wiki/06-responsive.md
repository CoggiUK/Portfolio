# 06 — Responsive · Quy tắc từ Design đến Build

> Mục tiêu (NFR-03): **mọi màn hình từ 320px đến 1440px+ đều hiển thị đẹp, không tràn, không thừa khoảng trống.**
> File này quy định responsive xuyên suốt: từ lúc thiết kế trên Figma → đến CSS thực tế trong [`frontend/src/index.css`](../frontend/src/index.css). Mỗi quy tắc đều đã được áp dụng vào code.

---

## 1. Nguyên tắc cốt lõi

1. **Mobile-First** — viết style mặc định cho mobile, dùng `min/max-width` để mở rộng. Ưu tiên chiều đọc dọc.
2. **Fluid trước, breakpoint sau** — ưu tiên `clamp()`, `%`, `fr`, `auto-fit/minmax` để co giãn mượt; chỉ thêm breakpoint khi bố cục thật sự cần *reflow*.
3. **Không thừa khoảng trống** — không ép `min-height: 100vh` cho khối nhiều chữ; lấp khoảng ngang bằng bố cục nhiều cột (vd hero 2 cột) thay vì để trống.
4. **Vùng chạm ≥ 44px** trên thiết bị cảm ứng.
5. **Một nguồn sự thật** — breakpoint là token tư duy chung giữa Figma và code (xem bảng §3).

---

## 2. Kỹ thuật fluid (đã áp dụng)

| Kỹ thuật | Ví dụ trong code | Tác dụng |
| :-- | :-- | :-- |
| `clamp()` cho typography | `.hero-title { font-size: clamp(2.4rem, 5.2vw, 4.2rem) }` | Tiêu đề tự co giãn, không cần media query |
| `grid auto-fit + minmax` | `.skill-grid`, `.metrics-grid` | Thẻ tự dồn hàng theo chiều rộng |
| `fr` cho cột | `.hero { grid-template-columns: 1.3fr 0.9fr }` | Chia tỉ lệ linh hoạt |
| `max-width` nội dung | `--content-max-width: 1200px` | Tránh giãn quá rộng mất thẩm mỹ |

> Quy tắc: nếu một bố cục có thể co giãn bằng fluid, **đừng** viết breakpoint. Breakpoint chỉ dành cho *reflow* (đổi số cột, ẩn/hiện, đổi hướng).

---

## 3. Thang Breakpoint (Responsive Ladder)

Khớp 1-1 với khối *"RESPONSIVE LADDER"* ở cuối [`frontend/src/index.css`](../frontend/src/index.css):

| Breakpoint | Reflow chính | Vì sao |
| :-- | :-- | :-- |
| `> 1024px` | Hero 2 cột, max-width 1200px | Tận dụng màn rộng, không để trống |
| `≤ 1024px` | Root `15px` | Thu nhỏ nhịp chữ |
| `≤ 960px` | **Hero gộp 1 cột**, profile card căn giữa (max 420px) | Tránh 2 cột quá hẹp |
| `≤ 860px` | Journey timeline → 1 cột | Bullet point cần bề ngang |
| `≤ 768px` | `.grid-2/.grid-3` → 1 cột, root `14px` | Card đủ rộng để đọc |
| `≤ 720px` | Ẩn nav links (giữ Console), navbar & section gọn lại | Thanh điều hướng không vỡ |
| `≤ 480px` | Root `13px`; CTA xếp dọc full-width; metrics 2 cột; card padding nhỏ | Tối ưu màn điện thoại |

---

## 4. Quy tắc theo từng khối

- **Navbar:** ≤720px ẩn link, chỉ giữ logo + Console; padding co lại.
- **Hero:** desktop 2 cột (intro + profile card) để **không bị thừa khoảng trống dọc**; ≤960px gộp 1 cột căn giữa; ≤480px nút CTA full-width.
- **Skills / Metrics:** dùng `auto-fit minmax` → tự xuống hàng, không cần breakpoint riêng.
- **Journey:** 2 cột (timeline + sidebar) → 1 cột ở ≤860px.
- **Projects & Contact:** `.grid-2` → 1 cột ở ≤768px.

---

## 5. Checklist Responsive (bắt buộc trước khi báo "xong")

- [ ] Thử ở **320 / 375 / 768 / 1024 / 1440px** — không tràn ngang, không scroll ngang.
- [ ] Không khối nào bị **thừa khoảng trống lớn** (đặc biệt hero).
- [ ] Chữ không quá nhỏ (< 13px) hay quá to làm vỡ dòng.
- [ ] Nút/lootlink đủ vùng chạm ≥ 44px trên mobile.
- [ ] Ảnh/thẻ không vỡ tỉ lệ; grid dồn hàng gọn gàng.
- [ ] Tôn trọng `prefers-reduced-motion` (NFR-04).
- [ ] Breakpoint trong code khớp bảng §3 và Figma.

---

## 6. Liên kết
- Bảng breakpoint tóm tắt: [02-design-rules.md](02-design-rules.md) §7.
- Yêu cầu gốc: [01-srs.md](01-srs.md) NFR-03/04.
- Handoff Figma ↔ FE: [05-design-fe-handoff.md](05-design-fe-handoff.md).
