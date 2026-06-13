# 04 — AI Design Automation · Ứng dụng AI bám sát SRS

> Đây là phần "đặc sản" trong cách mình làm việc tại dự án **SPACE**: *xây bộ quy tắc thiết kế (Design Rules / Prompt Guidelines) chuyên biệt để AI tạo ra bản thiết kế chuẩn xác, bám sát nghiêm ngặt tài liệu SRS.*
> File này biến điều đó thành quy trình lặp lại được, với các công cụ mình dùng thật: **Gemini, Claude, Stitch, Antigravity**.

---

## 1. Nguyên tắc cốt lõi

> **AI là người thực thi nhanh, không phải người quyết định.** Mọi output của AI phải truy vết được về một mục SRS và tuân thủ Design Rules. Nếu AI tạo ra thứ không có trong đặc tả → loại bỏ, không "đẹp thì giữ".

Ba ràng buộc bắt buộc trong mọi prompt:
1. **Bám SRS** — trích mã FR/NFR ([01-srs.md](01-srs.md)) làm yêu cầu.
2. **Bám Design Rules** — chỉ dùng token màu/spacing/typography đã định nghĩa ([02-design-rules.md](02-design-rules.md)).
3. **Bám Dev Rules** — output code phải khớp cấu trúc & quy ước ([03-dev-rules.md](03-dev-rules.md)).

---

## 2. Quy trình 5 bước (SRS → AI → Sản phẩm)

```
1. TRÍCH SRS        → Chọn FR/NFR cần làm, viết lại thành "yêu cầu đầu vào".
2. NẠP RULES        → Dán Design tokens + component specs vào ngữ cảnh AI.
3. SINH (Generate)  → Stitch/Gemini dựng layout; Claude viết code/nội dung.
4. ĐỐI CHIẾU        → Checklist tuân thủ: token? spacing 4pt? state đủ? a11y?
5. TINH CHỈNH       → Sửa sai lệch, cập nhật lại Rules nếu phát hiện thiếu sót.
```

Bước 4–5 lặp cho đến khi đạt **Definition of Done** (file 03, mục 9).

---

## 3. Phân vai công cụ AI

| Công cụ | Vai trò chính | Khi dùng |
| :-- | :-- | :-- |
| **Stitch** | Dựng layout/UI nhanh từ mô tả | Phác bố cục, biến thể màn hình |
| **Gemini** | Phân tích, brainstorm, dữ liệu | Nghiên cứu UX, phân tích số liệu |
| **Claude** | Viết code, refactor, nội dung dài, tài liệu | Sinh component, viết SRS/wiki |
| **Antigravity** | Hỗ trợ workflow/tự động hoá | Nối các bước, thao tác lặp |

---

## 4. Mẫu Prompt chuẩn (Prompt Template)

Dán nguyên khối này, điền phần `[...]`:

```text
# VAI TRÒ
Bạn là UI engineer tuân thủ Design System của dự án Portfolio (Nguyễn Tùng Lâm).

# YÊU CẦU (từ SRS)
- [FR-xx]: [mô tả yêu cầu]
- Ràng buộc phi chức năng: [NFR-xx, vd responsive 320–1440px, reduced-motion]

# RÀNG BUỘC THIẾT KẾ (bắt buộc, không phá vỡ)
- Màu: chỉ dùng --primary-color #00ff88, --secondary-color #8b5cf6,
  --cyan-accent #00f0ff, --text-main/sub/muted. KHÔNG tạo hex mới.
- Spacing: chỉ bội số 4px qua token --space-1..9.
- Typography: heading = Outfit, body = Plus Jakarta Sans.
- Component: tái dùng .glass-card / .btn-neon / .badge / .skill-chip.
- Trạng thái: đủ default/hover/active/disabled. Tôn trọng prefers-reduced-motion.

# RÀNG BUỘC CODE
- React 19 + CSS variables (không thêm thư viện UI).
- Khớp cấu trúc frontend/src/components, đặt tên kebab-case cho class.

# ĐẦU RA
[component/đoạn code/nội dung] + giải thích ngắn cách nó ánh xạ tới FR-xx.

# CẤM
Không bịa số liệu, không thêm tính năng ngoài SRS, không hardcode màu/spacing lạ.
```

---

## 5. Guardrails — Cấm tuyệt đối

- ❌ Không để AI **bịa metric/nội dung** không có thật (vd số liệu dự án).
- ❌ Không nhận output thêm **tính năng ngoài SRS**.
- ❌ Không nhận **màu/spacing/font** ngoài token.
- ❌ Không commit thẳng code AI sinh ra mà **chưa qua bước 4 (đối chiếu)**.

---

## 6. Checklist nghiệm thu output AI

- [ ] Mỗi phần output truy vết được về một FR/NFR.
- [ ] Chỉ dùng token màu/spacing/typography hợp lệ.
- [ ] Component tái sử dụng đúng class hệ thống.
- [ ] Có đủ trạng thái tương tác + responsive.
- [ ] Nội dung trung thực, không bịa.
- [ ] Nếu phát hiện Rules còn thiếu → đã cập nhật lại file 02/03.

> Vòng lặp "AI sinh → người đối chiếu → cập nhật rules" chính là cách Design System tự lớn lên mà vẫn nhất quán.
