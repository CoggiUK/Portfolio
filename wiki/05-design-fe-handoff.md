# 05 — Design ↔ Front-end Handoff

> Bộ quy chuẩn bàn giao giữa Design và Front-end — đúng việc mình làm thật: *"Xây bộ UI Guidelines thống nhất giữa Design và FE, giúp chuyển giao mượt mà, chính xác và tiết kiệm thời gian lập trình."*

Mục tiêu: Designer và Developer **nói cùng một ngôn ngữ** (cùng token, cùng tên component, cùng trạng thái) để không mất thời gian "dịch" qua lại.

---

## 1. Ngôn ngữ chung (Single Source of Truth)

| Trong Figma | Trong Code | Ghi chú |
| :-- | :-- | :-- |
| Color Style `Primary/Emerald` | `--primary-color` | Cùng một hex |
| Spacing token `space-4` | `--space-4` (16px) | Lưới 4pt |
| Text style `Heading/Display` | `--font-display` (Outfit) | Cùng tên cấp |
| Component `Glass Card` | `.glass-card` | Cùng tên, cùng state |
| Variant `Button/Neon` | `.btn-neon` | Map 1-1 |

> Quy tắc vàng: **tên trong Figma = tên class trong code**. Đổi một bên thì cập nhật wiki + bên còn lại.

---

## 2. Checklist Designer trước khi bàn giao

- [ ] Mọi màu là **Color Style** (không màu rời).
- [ ] Mọi khoảng cách dùng **Auto Layout** theo lưới 4pt.
- [ ] Component đã chuyển thành **Component/Variant** (không copy thủ công).
- [ ] Đã thiết kế đủ **trạng thái**: default / hover / active / disabled / empty / error.
- [ ] Đã có **responsive**: bản mobile (≤480), tablet (≤768), desktop.
- [ ] Đặt tên layer/frame rõ ràng, khớp tên component trong code.
- [ ] Ghi chú tương tác (animation, easing) tham chiếu `--transition-smooth`.

---

## 3. Checklist Developer khi nhận

- [ ] Mọi giá trị thị giác map về token CSS — không "ước lượng" pixel.
- [ ] Tái dùng class hệ thống thay vì viết style mới trùng lặp.
- [ ] Đủ trạng thái tương tác như bản thiết kế.
- [ ] Khớp breakpoint trong [02-design-rules.md](02-design-rules.md) §7.
- [ ] Kiểm tra `prefers-reduced-motion`.
- [ ] Chạy `npm run build` + thử 320px và 1440px trước khi báo xong.

---

## 4. Quy trình khi có sai lệch (design drift)

```
Phát hiện lệch giữa Figma và code
        │
        ▼
Lệch do CODE sai token? ── Có ──▶ FE sửa code theo token chuẩn
        │ Không
        ▼
Lệch do THIẾU token/quy tắc? ── Có ──▶ Cập nhật Design Rules (file 02) + Figma + code
        │ Không
        ▼
Lệch do YÊU CẦU đổi? ──────────▶ Cập nhật SRS (file 01) trước, rồi mới sửa design & code
```

Không bao giờ sửa "lặng lẽ" một bên — mọi thay đổi đi qua wiki để giữ một nguồn sự thật.

---

## 5. Bàn giao kèm gì?

1. Link Figma (frame + component library).
2. Tham chiếu mục SRS (FR/NFR) cho từng màn hình.
3. Danh sách token mới (nếu có) đã thêm vào file 02 + `frontend/src/index.css`.
4. Ghi chú edge case: trạng thái rỗng, lỗi, dữ liệu dài/tràn.

> Handoff tốt = Developer không phải hỏi lại, và sản phẩm cuối khớp Figma > 95%.
