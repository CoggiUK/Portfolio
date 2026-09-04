# Checklist tự chấm & Anti-patterns

Chạy **trước khi trả kết quả**. Có mục nào FAIL → sửa rồi mới trả.
Báo cáo dạng: `[PASS] Token · [FAIL] A11y: thiếu aria-label ở 2 icon button → đã sửa`.

---

## 1. Checklist

### Token
- [ ] Không có hex/rgb viết thẳng; toàn bộ màu qua token semantic
- [ ] Mọi spacing nằm trong thang 4pt
- [ ] Radius / shadow / duration / z-index lấy từ bảng chuẩn
- [ ] Màu brand + semantic chiếm ≤ 10% diện tích màn
- [ ] Dark mode dùng surface sáng dần, không đảo màu thô

### Typography
- [ ] ≤ 3 cấp chữ trong một khối; ≤ 2 font family toàn app
- [ ] Đoạn văn ≤ 75 ký tự/dòng
- [ ] Không có text < 12px
- [ ] Số liệu dùng `tabular-nums`
- [ ] Không căn đều, không căn giữa đoạn > 2 dòng

### Layout
- [ ] Vị trí logo / search / avatar / CTA chính đúng chuẩn (`layout.md` §3)
- [ ] Mọi phần tử trong một cột chung một trục căn lề
- [ ] Đã kiểm 375 · 768 · 1280 · 1920 — không tràn ngang
- [ ] `100dvh` thay `100vh` nơi cần
- [ ] Form ≤ 2 cột, không bao giờ 3 cột
- [ ] Sidebar/topbar có kích thước đúng bảng số đo

### Component
- [ ] Đúng **1 nút primary** mỗi vùng nội dung
- [ ] Nhãn nút là động từ + danh từ, không "OK"/"Submit"
- [ ] Form: label trên input, helper text hiện sẵn, lỗi kèm icon + cách sửa
- [ ] Bảng: header sticky, số căn phải, actions sticky phải, ≤ 7 cột mặc định
- [ ] Modal: focus trap + `Esc` + trả focus + footer căn phải
- [ ] Toast đúng vị trí, error không tự tắt
- [ ] Nav cấp 1 ≤ 9 mục, chỉ 1 cấp lồng

### Trạng thái
- [ ] Đủ 6 trạng thái màn: loading · empty lần đầu · empty do filter · partial · error · no-permission
- [ ] Đủ 7 trạng thái phần tử: default · hover · active · focus-visible · disabled · loading · selected
- [ ] Loading dùng skeleton đúng layout, không spinner toàn màn
- [ ] Hành động phá huỷ có confirm rõ đối tượng, hoặc undo qua toast
- [ ] Không hiển thị `null` / `undefined` / `NaN` / `Invalid Date`

### A11y
- [ ] Điều hướng hoàn tất luồng chính **chỉ bằng bàn phím**
- [ ] Focus ring rõ ở mọi phần tử, không bị cắt/che
- [ ] Contrast text ≥ 4.5:1, icon/border ≥ 3:1
- [ ] Icon-only button có `aria-label`
- [ ] Không dùng màu làm tín hiệu duy nhất
- [ ] Input có `label` liên kết + `aria-describedby` cho helper/error
- [ ] `prefers-reduced-motion` được tôn trọng
- [ ] `<html lang="vi">`, có skip link
- [ ] Zoom 200% không vỡ layout

### Performance
- [ ] Ảnh có kích thước cố định (không CLS)
- [ ] Chỉ animate `transform` / `opacity`
- [ ] Danh sách > 200 dòng có virtualization
- [ ] Search có debounce + huỷ request cũ

---

## 2. Anti-patterns — thấy là sửa ngay

| ❌ Sai | ✅ Đúng |
|-------|--------|
| Placeholder thay cho label | Label trên input; placeholder là ví dụ định dạng |
| Nhiều nút primary trên một màn | 1 primary, còn lại secondary/ghost |
| Spinner toàn màn khi tải bảng | Skeleton rows đúng số cột |
| "Đã xảy ra lỗi" | Nguyên nhân + cách xử lý + nút thử lại |
| Kẻ ô bảng đầy đủ dọc-ngang | Chỉ đường ngang, dựa vào spacing |
| Nhồi 12 cột vào bảng | ≤ 7 cột + column picker + drawer chi tiết |
| Modal lồng modal | Drawer / trang riêng / wizard nhiều bước |
| Xoá `focus outline` | Thay bằng focus ring có thiết kế |
| Gradient loè loẹt trên app nội bộ | Neutral + 1 màu brand |
| Font < 14px cho body app | 14px app / 16px web & mobile input |
| Icon không nhãn ở nav chính | Icon + text, hoặc tooltip khi thu gọn |
| Tự chế `box-shadow: 0 0 20px black` | Dùng thang elevation 6 mức |
| Center toàn bộ text trong card | Căn trái; chỉ center empty state / hero |
| `alert()` / `confirm()` | Dialog component |
| Form 3 cột | 1 cột, tối đa 2 cho field ngắn cùng nhóm |
| Nút xoá chỉ hiện khi hover row | Luôn hiện, hoặc gom vào menu `⋯` |
| Animation > 400ms cho tương tác thường | 150–300ms |
| `z-index: 9999` | Thang z-index cố định 0–100 |
| Validate ngay khi user đang gõ lần đầu | Validate on blur, re-validate on change |
| Toast cho lỗi validate form | Hiển thị lỗi tại field |
| Disable nút submit khi form chưa hợp lệ | Cho bấm, rồi hiện lỗi cụ thể (user biết vì sao) |
| `<div onClick>` | `<button type="button">` |
| Ảnh không set kích thước | `width`/`height` hoặc `aspect-ratio` |
| Truncate 1 dòng làm mất thông tin quan trọng | Truncate + tooltip/`title` đầy đủ |
| Sidebar 5 cấp lồng nhau | Tối đa 2 cấp, sâu hơn → tab trong trang |
| Màu đỏ/xanh không kèm icon | Màu + icon + text |

---

## 3. Prompt contract — dán vào yêu cầu để AI code đúng

```
Áp dụng skill ui-ux-design-app. Yêu cầu:
- Loại màn: <app-shell | marketing | auth | mobile>
- Stack: React + TypeScript + Tailwind + shadcn/ui + lucide-react
- Chỉ dùng design token semantic (references/tokens.md). Không hex thẳng,
  không px lẻ, không z-index tuỳ tiện, không !important.
- Layout & vị trí phần tử theo references/layout.md.
- Component theo references/components.md.
- Cover đủ 6 trạng thái màn + 7 trạng thái phần tử (references/states-content.md).
- Đạt WCAG 2.2 AA theo references/a11y.md.
- Responsive kiểm ở 375 / 768 / 1280 / 1920.
- Kết thúc bằng self-check theo references/checklist.md, liệt kê PASS/FAIL từng nhóm.
```

---

## 4. Review UI có sẵn — thứ tự soi

Khi được yêu cầu "review giao diện này" hoặc "sao nhìn xấu vậy", soi theo thứ tự tác động giảm dần:

1. **Tỷ lệ màu** — brand có vượt 10% không? Đây là nguyên nhân #1
2. **Spacing** — có giá trị lẻ ngoài thang 4pt? Khoảng cách nhóm có phân tầng không?
3. **Thứ bậc chữ** — có quá nhiều cỡ chữ? Heading có đủ nổi so với body?
4. **Căn lề** — có phần tử lệch trục? Số có căn phải không?
5. **Border vs shadow** — app nội bộ mà đầy shadow → chuyển sang border
6. **Số lượng primary button** — nhiều hơn 1 trong một vùng?
7. **Trạng thái thiếu** — thử tắt mạng, xoá hết dữ liệu, lọc không ra kết quả
8. **Bàn phím** — Tab một vòng, có mất focus ring ở đâu không?
9. **Mobile 375px** — có tràn ngang, có touch target < 44px?
10. **Microcopy** — có "Đã xảy ra lỗi", "OK", "Submit", "Không có dữ liệu" không?

Trả kết quả dạng bảng: `Vấn đề · Mức độ (Blocker/Major/Minor) · Vị trí · Cách sửa cụ thể`.
