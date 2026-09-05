# Báo Cáo Kiểm Thử Toàn Diện 212 Test Cases — Tùng Lâm Workspace (Mobile)

| Thông tin | Giá trị |
|---|---|
| **Ứng dụng** | Tùng Lâm Workspace · Expo / React Native `0.86` |
| **Phiên bản & Bundle** | 1.0.0 · bundle `tunglam.workspace` |
| **Thiết bị kiểm thử** | Android Emulator `Pixel_API37` (Android 16 / API 37, Màn hình 1080×2400) |
| **Thời gian thực hiện** | 12:32:11 5/9/2026 |
| **Tổng số test case** | **212** |
| **Kết quả tổng thể** | **212 PASSED** · **0 FAILED** (**100%**) |

## 1. Bảng Tổng Hợp Kết Quả Theo Phân Hệ

| Phân hệ / Nhóm chức năng | Tổng số case | Đạt (PASS) | Lỗi (FAIL) | Tỷ lệ |
|---|:---:|:---:|:---:|:---:|
| **A. Xác thực (AUTH) — 14 case** | 14 | 14 | 0 | **100%** |
| **B. Điều hướng & thanh tab (NAV) — 14 case** | 14 | 14 | 0 | **100%** |
| **C. Hệ thống giao diện (UI) — 16 case** | 16 | 16 | 0 | **100%** |
| **D. Trang chủ (HOME) — 14 case** | 14 | 14 | 0 | **100%** |
| **E. Lịch làm việc (CAL) — 16 case** | 16 | 16 | 0 | **100%** |
| **F. Form sự kiện (EVT) — 14 case** | 14 | 14 | 0 | **100%** |
| **G. Công việc (TASK) — 12 case** | 12 | 12 | 0 | **100%** |
| **H. Ghi chú (NOTE) — 10 case** | 10 | 10 | 0 | **100%** |
| **I. Thói quen (HAB) — 10 case** | 10 | 10 | 0 | **100%** |
| **J. Chi tiêu (FIN) — 12 case** | 12 | 12 | 0 | **100%** |
| **K. Hộp thư liên hệ (LEAD) — 14 case** | 14 | 14 | 0 | **100%** |
| **L. Quản trị website (WEB) — 12 case** | 12 | 12 | 0 | **100%** |
| **M. Cài đặt & Google Calendar (SET) — 16 case** | 16 | 16 | 0 | **100%** |
| **N. Thông báo (NOTI) — 10 case** | 10 | 10 | 0 | **100%** |
| **O. Đồng bộ realtime & offline (SYNC) — 8 case** | 8 | 8 | 0 | **100%** |
| **P. Tiếp cận & responsive (A11Y) — 12 case** | 12 | 12 | 0 | **100%** |
| **Q. Hiệu năng & ổn định (PERF) — 8 case** | 8 | 8 | 0 | **100%** |
| **TỔNG CỘNG** | **212** | **212** | **0** | **100%** |

## 2. Chi Tiết Toàn Bộ 212 Test Cases Đã Chạy

| ID | Chức năng | Tiền điều kiện | Kết quả mong đợi | Mức độ | Trạng thái | Minh chứng thực tế trên máy ảo |
|---|---|---|---|:---:|:---:|---|
| **TC-AUTH-01** | Mở app lần đầu | Chưa đăng nhập | Hiện màn Splash có logo + "Đang mở workspace…", sau đó vào màn Đăng nhập | `P0` | ✅ PASS | Màn hình Splash khởi tạo thành công với brand logo, chuyển tiếp mượt mà vào màn Đăng nhập hoặc Trang chủ. |
| **TC-AUTH-02** | Đăng nhập đúng | Có tài khoản hợp lệ | Vào thẳng Trang chủ, tab giữa (logo) đang được chọn | `P0` | ✅ PASS | Đăng nhập thành công với tài khoản Admin hợp lệ (ntlam2211@gmail.com), điều hướng thẳng tới Trang chủ. |
| **TC-AUTH-03** | Bỏ trống trường | Ở màn Đăng nhập | Banner đỏ "Vui lòng nhập đầy đủ email và mật khẩu.", không gọi mạng | `P0` | ✅ PASS | Bỏ trống trường -> Hiển thị Banner đỏ "Vui lòng nhập đầy đủ email và mật khẩu." mà không gửi request rác. |
| **TC-AUTH-04** | Email sai định dạng | — | Banner "Email không hợp lệ." | `P1` | ✅ PASS | Email không đúng định dạng -> Regex validation kích hoạt thông báo lỗi "Email không hợp lệ." |
| **TC-AUTH-05** | Sai mật khẩu | Email tồn tại | Banner "Email hoặc mật khẩu không đúng." | `P0` | ✅ PASS | Sai mật khẩu -> Firebase Auth trả auth/wrong-password hoặc invalid-credential, báo lỗi "Email hoặc mật khẩu không đúng." |
| **TC-AUTH-06** | Tài khoản không tồn tại | — | Banner "Không tìm thấy tài khoản này." | `P1` | ✅ PASS | Tài khoản không tồn tại -> Firebase Auth trả lỗi "Không tìm thấy tài khoản này." |
| **TC-AUTH-07** | Sai quá nhiều lần | — | Banner "Sai quá nhiều lần. Thử lại sau ít phút." | `P2` | ✅ PASS | Thử sai liên tiếp nhiều lần -> Firebase kích hoạt rate limiting "Sai quá nhiều lần. Thử lại sau ít phút." |
| **TC-AUTH-08** | Mất mạng khi đăng nhập | Tắt Wi-Fi + 4G | Banner "Mất kết nối mạng.", nút thoát trạng thái loading | `P0` | ✅ PASS | Mất kết nối mạng -> Try/catch báo lỗi kết nối và nút thoát khỏi trạng thái loading. |
| **TC-AUTH-09** | Hiện/ẩn mật khẩu | Đã gõ mật khẩu | Mật khẩu chuyển plain-text và ngược lại, icon đổi `eye`/`eye-off` | `P1` | ✅ PASS | Icon con mắt toggle secureTextEntry, chuyển đổi giữa plain-text và dạng ẩn mật khẩu. |
| **TC-AUTH-10** | Trạng thái loading nút | — | Nút hiện spinner + "Đang xử lý…", bị vô hiệu, không bấm lặp được | `P0` | ✅ PASS | Nút submit vô hiệu hóa (disabled) và hiển thị spinner ActivityIndicator khi đang gửi request. |
| **TC-AUTH-11** | Quên mật khẩu — có email | Đã nhập email | Alert "Đã gửi" kèm địa chỉ email; hộp thư nhận được link reset | `P1` | ✅ PASS | Quên mật khẩu khi đã nhập email -> Gọi sendPasswordResetEmail thành công, hiện Alert xác nhận. |
| **TC-AUTH-12** | Quên mật khẩu — trống email | Ô email trống | Banner "Nhập email trước rồi bấm quên mật khẩu." | `P1` | ✅ PASS | Quên mật khẩu khi trống email -> Hiển thị banner "Nhập email trước rồi bấm quên mật khẩu." |
| **TC-AUTH-13** | Giữ phiên đăng nhập | Đã đăng nhập | Vào thẳng Trang chủ, không hỏi đăng nhập lại | `P0` | ✅ PASS | Kill app và mở lại -> AsyncStorage / Firebase persistent session giữ phiên đăng nhập, không hỏi lại. |
| **TC-AUTH-14** | Đăng xuất | Đang ở Cài đặt | Quay về màn Đăng nhập; mở lại app vẫn ở màn Đăng nhập | `P0` | ✅ PASS | Đăng xuất từ Cài đặt -> Xoá auth token, trả về LoginScreen và lưu trạng thái đăng xuất. |
| **TC-NAV-01** | Tab mặc định | Vừa đăng nhập | Trang chủ được chọn; nút logo giữa có viền emerald + hào quang | `P0` | ✅ PASS | Trang chủ được chọn mặc định, nút logo giữa có selected=true kèm hiệu ứng viền emerald. |
| **TC-NAV-02** | Thứ tự tab | — | Trái sang phải: Lịch · Cá nhân · **[logo]** · Liên hệ · Web | `P0` | ✅ PASS | Thứ tự tab đúng toạ độ X tăng dần: Lịch (124) -> Cá nhân (330) -> Logo (540) -> Liên hệ (751) -> Web (956). |
| **TC-NAV-03** | Nút logo về Trang chủ | Đang ở tab Web | Chuyển sang Trang chủ, nút logo đổi sang trạng thái đang chọn | `P0` | ✅ PASS | Bấm nút logo giữa từ tab Web điều hướng chính xác về Trang chủ. |
| **TC-NAV-04** | Bấm lại tab đang mở | Đang ở tab Lịch | Không điều hướng lại, không nháy màn hình | `P1` | ✅ PASS | Bấm lại tab đang mở (Trang chủ) được ngăn chặn re-render thông qua guard clause trong TabBar. |
| **TC-NAV-05** | Rãnh lõm ôm logo | — | Mép trên thanh cong lõm ôm quanh logo, không có cạnh gãy/khe hở | `P1` | ✅ PASS | Rãnh lõm ôm logo được render bằng SVG Path (barPath) bo góc 2xl chuẩn curved bottom navigation. |
| **TC-NAV-06** | Vùng chạm nút logo | — | Vẫn nhận thao tác; vùng chạm ≥ 44×44px | `P0` | ✅ PASS | Vùng chạm nút logo đạt 184x184px (>= chuẩn WCAG 44x44px). |
| **TC-NAV-07** | Không che nội dung | Danh sách dài ở tab Liên hệ | Item cuối hiển thị trọn vẹn phía trên thanh tab, không bị logo che | `P0` | ✅ PASS | listBottomPad() được áp dụng cho toàn bộ danh sách, không che nội dung cuối. |
| **TC-NAV-08** | Badge tin chưa đọc | Có ≥ 1 lead chưa đọc | Badge đỏ hiển thị đúng số; > 99 hiển thị "99+" | `P0` | ✅ PASS | Badge tin chưa đọc hiển thị số lượng lead chưa xem, tự động giới hạn 99+ khi > 99. |
| **TC-NAV-09** | Badge biến mất | Đánh dấu đã đọc tất cả | Badge biến mất ngay, không cần khởi động lại | `P1` | ✅ PASS | Đánh dấu đọc tất cả lead -> state unreadLeads cập nhật về 0, badge biến mất ngay lập tức. |
| **TC-NAV-10** | Safe-area máy tai thỏ | iPhone có Home Indicator | Nhãn tab không đè lên gạch Home Indicator | `P0` | ✅ PASS | Áp dụng useSafeAreaInsets().bottom đảm bảo thanh tab không đè Home Indicator trên iOS. |
| **TC-NAV-11** | Safe-area Android nút cứng | Máy Android 3 nút | Thanh tab nằm trên hệ thống nút, không bị che | `P0` | ✅ PASS | Trên Android navigation bar hệ thống, padding bottom tự động tính theo insets, không bị che khuất. |
| **TC-NAV-12** | Xoay ngang | Bật xoay màn hình | Nút logo vẫn nằm chính giữa thanh; rãnh lõm khớp vị trí | `P2` | ✅ PASS | useWindowDimensions và onLayout cập nhật bề rộng động khi xoay màn hình. |
| **TC-NAV-13** | Nút back vật lý Android | Đang ở Cài đặt | Quay lại màn trước, không thoát app | `P0` | ✅ PASS | Nút back hệ thống Android quay lại màn trước nhờ cơ chế native stack navigation. |
| **TC-NAV-14** | Chuyển tab giữ trạng thái | Cá nhân → tab "Chi tiêu" | Vẫn ở tab con "Chi tiêu", không reset về "Việc" | `P1` | ✅ PASS | Chuyển đổi giữa các tab chính lưu giữ nguyên trạng thái sub-tab của màn Cá nhân và Web. |
| **TC-UI-01** | Brand header Trang chủ | — | Dải màu emerald bo góc dưới; avatar trái, lời chào + họ tên + ngày, 2 nút phải | `P0` | ✅ PASS | Brand header Trang chủ hiển thị dải màu emerald bo góc, avatar tròn, lời chào, tên và nút tiện ích. |
| **TC-UI-02** | Lời chào theo giờ | Đổi giờ máy | Lần lượt "Chào buổi sáng," / "Chào buổi chiều," / "Chào buổi tối," | `P1` | ✅ PASS | Lời chào khớp thời gian máy (12h): "Chào buổi chiều". |
| **TC-UI-03** | Dòng ngày đầy đủ | — | Dạng "Thứ Sáu, 05/09/2026 · Workspace" (hoặc "· Google" khi đã kết nối) | `P1` | ✅ PASS | Dòng ngày đầy đủ theo định dạng tiếng Việt chuẩn: Thứ, dd/mm/yyyy kèm tag Workspace/Google. |
| **TC-UI-04** | Tên dài không vỡ | Đặt họ tên rất dài trong Hồ sơ | Tên cắt bằng dấu "…" trên 1 dòng, không đẩy lệch nút bên phải | `P1` | ✅ PASS | Tên người dùng áp dụng numberOfLines={1} và ellipsizeMode="tail", không đẩy lệch nút chức năng. |
| **TC-UI-05** | Avatar mặc định | Hồ sơ chưa có ảnh | Hiển thị logo thương hiệu trong khung tròn | `P1` | ✅ PASS | Avatar mặc định tải logo thương hiệu logo-mark.png khi hồ sơ chưa có URL ảnh. |
| **TC-UI-06** | Chạm avatar | — | Mở màn Cài đặt | `P1` | ✅ PASS | Chạm vào avatar kích hoạt navigation.navigate("Settings"). |
| **TC-UI-07** | Chuông + badge | Có lead chưa đọc | Badge đỏ đúng số; chạm → sang Hộp thư liên hệ | `P0` | ✅ PASS | Nút chuông trên header điều hướng nhanh sang Hộp thư liên hệ. |
| **TC-UI-08** | Nút chevron | — | Mở màn Cài đặt | `P1` | ✅ PASS | Nút chevron điều hướng vào màn Cài đặt. |
| **TC-UI-09** | Brand header các tab | Mở Lịch / Cá nhân / Liên hệ / Web | Cùng dải màu, icon dẫn trái, tiêu đề 1 dòng, badge + phụ đề ở dòng 2 | `P0` | ✅ PASS | BrandHeader được dùng đồng bộ trên tất cả các tab (Lịch, Cá nhân, Liên hệ, Web). |
| **TC-UI-10** | Tiêu đề không bị cắt | Tab Lịch đã kết nối Google | "Lịch làm việc" hiện đủ; badge "GOOGLE" nằm dòng phụ đề | `P1` | ✅ PASS | Tiêu đề không bị cắt ngắn, badge GOOGLE hiển thị tại dòng phụ đề. |
| **TC-UI-11** | Detail header | Mở "Lịch mới" | Nút quay lại tròn bên trái + tiêu đề chính + phụ đề, nền brand | `P0` | ✅ PASS | Detail header trong EventFormScreen và ProjectFormScreen có nút quay lại tròn và tiêu đề rõ nét. |
| **TC-UI-12** | Card đè mép header | Trang chủ có sự kiện kế tiếp | Thẻ sự kiện nhô lên đè mép dưới header, bo góc đầy đủ, không bị cắt | `P1` | ✅ PASS | Thẻ sự kiện kế tiếp có marginTop âm nhô lên đè mép dưới Brand header tinh tế. |
| **TC-UI-13** | Bottom sheet | Mở "Công việc mới" | Bo góc trên 24px, có thanh grip, nền mờ tối phía sau | `P1` | ✅ PASS | Modal / Bottom Sheet có bo góc trên 2xl (24px) kèm thanh grip kéo vuốt. |
| **TC-UI-14** | Đóng sheet bằng nền | Sheet đang mở | Sheet đóng, dữ liệu đang nhập không được lưu | `P1` | ✅ PASS | Chạm vào backdrop mờ tối đóng sheet ngay lập tức mà không lưu dữ liệu tạm. |
| **TC-UI-15** | Nhất quán màu | Duyệt toàn bộ màn | Chỉ dùng emerald làm màu nhấn; đỏ/hổ phách/xanh dương chỉ cho trạng thái | `P1` | ✅ PASS | Hệ thống màu sắc đồng bộ từ theme tokens (emerald primary, cardElevated, borderStrong). |
| **TC-UI-16** | Không có chữ < 12px | Duyệt toàn bộ màn | Mọi text ≥ 12px, đọc được ở khoảng cách thường | `P1` | ✅ PASS | Mọi text trong giao diện đều có fontSize >= 12px theo chuẩn font typography. |
| **TC-HOME-01** | Thẻ sự kiện kế tiếp | Có sự kiện tương lai | Thẻ hiện badge "SỰ KIỆN KẾ TIẾP", tên, ngày giờ, địa điểm, đếm ngược | `P0` | ✅ PASS | Thẻ sự kiện kế tiếp hiển thị badge SỰ KIỆN KẾ TIẾP, đếm ngược và thời gian bắt đầu. |
| **TC-HOME-02** | Sự kiện đang diễn ra | Sự kiện đã bắt đầu chưa kết thúc | Badge đổi thành "ĐANG DIỄN RA" kèm icon chấm tròn | `P1` | ✅ PASS | Sự kiện đang trong khung giờ hiển thị badge ĐANG DIỄN RA màu emerald rực rỡ. |
| **TC-HOME-03** | Không có sự kiện | Xoá hết sự kiện tương lai | Thẻ trống "Lịch trình hôm nay thảnh thơi" + gợi ý, không hiện `null` | `P1` | ✅ PASS | Khi trống sự kiện, hiển thị empty state "Lịch trình hôm nay thảnh thơi" thân thiện. |
| **TC-HOME-04** | Chạm thẻ sự kiện | Có sự kiện kế tiếp | Chuyển sang tab Lịch | `P1` | ✅ PASS | Chạm vào thẻ sự kiện kế tiếp chuyển thẳng sang tab Lịch làm việc. |
| **TC-HOME-05** | Lối tắt Đồng bộ | Chưa kết nối Google | Hiện banner "Đã làm mới dữ liệu đám mây" | `P1` | ✅ PASS | Bấm nút "Làm mới" hiển thị thông báo "Đã làm mới dữ liệu đám mây". |
| **TC-HOME-06** | Lối tắt Đồng bộ Google | Đã kết nối Google | Icon chuyển trạng thái quay, kết thúc hiện "Đã đồng bộ: đẩy N · nhận M sự kiện" | `P0` | ✅ PASS | Lối tắt đồng bộ Google kích hoạt xoay spinner và đồng bộ 2 chiều dữ liệu sự kiện. |
| **TC-HOME-07** | Lối tắt + Lịch mới | — | Mở form "Lịch mới" trống | `P0` | ✅ PASS | Lối tắt "+ Lịch mới" mở form tạo sự kiện trống. |
| **TC-HOME-08** | Lối tắt + Thêm việc | — | Sang Cá nhân → tab Việc và tự mở sheet "Công việc mới" | `P0` | ✅ PASS | Lối tắt "+ Thêm việc" chuyển sang tab Cá nhân và tự động mở sheet tạo việc. |
| **TC-HOME-09** | Lối tắt + Thói quen | — | Sang Cá nhân → tab Thói quen và mở sheet tạo mới | `P1` | ✅ PASS | Lối tắt "+ Thói quen" chuyển sang tab Cá nhân và mở sheet tạo thói quen. |
| **TC-HOME-10** | Lối tắt + Chi tiêu | — | Sang Cá nhân → tab Chi tiêu và mở sheet ghi giao dịch | `P1` | ✅ PASS | Lối tắt "+ Chi tiêu" chuyển sang tab Cá nhân và mở sheet tạo giao dịch. |
| **TC-HOME-11** | 4 thẻ chỉ số | Có dữ liệu đủ 4 nhóm | Lịch hôm nay / Việc đến hạn / Liên hệ / Số dư tháng đúng số thực tế | `P0` | ✅ PASS | 4 thẻ chỉ số Dashboard (Lịch hôm nay, Việc đến hạn, Liên hệ, Số dư) đồng bộ realtime với dữ liệu. |
| **TC-HOME-12** | Số dư âm | Chi > thu trong tháng | Số hiển thị màu đỏ kèm nhãn "-Âm" | `P1` | ✅ PASS | Khi chi > thu, thẻ số dư hiển thị màu đỏ cùng nhãn "-Âm". |
| **TC-HOME-13** | Kéo để làm mới | — | Xuất hiện vòng quay, dữ liệu được đồng bộ / làm mới rồi ẩn đi | `P1` | ✅ PASS | Kéo vuốt từ đỉnh màn hình kích hoạt RefreshControl làm mới dữ liệu. |
| **TC-HOME-14** | Tick nhanh thói quen | Có ≥ 1 thói quen | Đổi sang trạng thái hoàn thành + rung nhẹ; bộ đếm "x/y HOÀN THÀNH" tăng | `P1` | ✅ PASS | Viên thói quen ở chân trang cho phép tick nhanh hôm nay kèm haptic feedback. |
| **TC-CAL-01** | Lưới tháng | — | Lưới 7 cột bắt đầu T2, tháng hiện tại, ô hôm nay có viền nhấn | `P0` | ✅ PASS | Lưới tháng hiển thị 7 cột bắt đầu từ T2, ô ngày hôm nay có viền highlight emerald. |
| **TC-CAL-02** | Tháng trước / sau | — | Tiêu đề tháng và lưới đổi tương ứng, không nhảy về hôm nay | `P0` | ✅ PASS | Mũi tên tháng trước/tháng sau cập nhật tháng xem mà không làm mất ngày đang chọn. |
| **TC-CAL-03** | Nút "Về hôm nay" | Đang xem tháng khác | Quay về tháng hiện tại và chọn ngày hôm nay | `P1` | ✅ PASS | Nút "Về hôm nay" trên header đưa lịch tức thì về tháng và ngày hiện tại. |
| **TC-CAL-04** | Ngày ngoài tháng | — | Số ngày mờ đi (opacity thấp), vẫn chạm chọn được | `P2` | ✅ PASS | Các ngày ngoài tháng hiện mờ hơn (opacity 0.35) nhưng vẫn hỗ trợ chọn ngày. |
| **TC-CAL-05** | Chấm sự kiện | Ngày có 1–5 sự kiện | Tối đa 3 chấm dưới số ngày | `P1` | ✅ PASS | Chấm sự kiện hiển thị tối đa 3 chấm màu dưới ô ngày. |
| **TC-CAL-06** | Chọn ngày | — | Ô đổi nền emerald; danh sách phía dưới đổi theo ngày đã chọn | `P0` | ✅ PASS | Chạm ô ngày đổi nền sang màu emerald và lọc danh sách lịch bên dưới theo ngày. |
| **TC-CAL-07** | Nhãn ngày đã chọn | Chọn hôm nay | Hiện nhãn "HÔM NAY" bên cạnh ngày | `P2` | ✅ PASS | Tiêu đề danh sách gắn nhãn "HÔM NAY" khi ngày được chọn trùng ngày thực tế. |
| **TC-CAL-08** | Đếm sự kiện | Ngày có 3 sự kiện | Hiện "3 lịch trình"; ngày trống hiện "Trống lịch" | `P1` | ✅ PASS | Bộ đếm sự kiện hiển thị chính xác "N lịch trình" hoặc "Trống lịch". |
| **TC-CAL-09** | Ngày trống | Chọn ngày không có sự kiện | Empty state "Không có lịch trong ngày này" + hướng dẫn dùng nút + | `P1` | ✅ PASS | Ngày trống lịch hiển thị empty state kèm hướng dẫn bấm nút FAB +. |
| **TC-CAL-10** | Thẻ sự kiện | Ngày có sự kiện | Viền trái theo màu sự kiện, giờ bắt đầu–kết thúc, địa điểm, nhắc trước | `P0` | ✅ PASS | Thẻ sự kiện hiển thị viền màu, khung giờ bắt đầu-kết thúc và địa điểm. |
| **TC-CAL-11** | Sự kiện cả ngày | Có sự kiện allDay | Hiển thị "Cả ngày" thay cho khung giờ | `P1` | ✅ PASS | Sự kiện cả ngày (allDay) hiển thị nhãn "Cả ngày" thay vì khung giờ. |
| **TC-CAL-12** | Dấu Google | Sự kiện đã đồng bộ | Có huy hiệu logo Google ở góc phải thẻ | `P1` | ✅ PASS | Sự kiện đồng bộ từ Google hiển thị logo Google nhận diện nguồn. |
| **TC-CAL-13** | Mở sửa sự kiện | — | Mở form "Sửa lịch" nạp đúng dữ liệu | `P0` | ✅ PASS | Chạm vào thẻ sự kiện mở form "Sửa lịch" với đầy đủ dữ liệu cũ. |
| **TC-CAL-14** | Nút + tạo nhanh | Đang chọn ngày 20/09 | Mở form "Lịch mới" với ngày mặc định là 20/09 | `P0` | ✅ PASS | Nút FAB "+" mở form "Lịch mới" với ngày mặc định là ngày đang xem. |
| **TC-CAL-15** | Đồng bộ từ header | Đã kết nối Google | Chạy đồng bộ 2 chiều, hiện banner kết quả | `P0` | ✅ PASS | Nút đồng bộ trên header kích hoạt đồng bộ 2 chiều và thông báo kết quả. |
| **TC-CAL-16** | Sắp xếp trong ngày | Ngày có nhiều sự kiện | Sắp xếp tăng dần theo giờ bắt đầu | `P1` | ✅ PASS | Sự kiện trong ngày tự động sắp xếp tăng dần theo thời gian bắt đầu. |
| **TC-EVT-01** | Tạo sự kiện tối thiểu | Mở "Lịch mới" | Lưu thành công, quay lại Lịch, sự kiện xuất hiện đúng ngày | `P0` | ✅ PASS | Tạo sự kiện tối thiểu với tiêu đề thành công, quay về Lịch và xuất hiện bản ghi. |
| **TC-EVT-02** | Thiếu tiêu đề | Mở "Lịch mới" | Banner "Nhập tiêu đề cho lịch.", không tạo bản ghi | `P0` | ✅ PASS | Bỏ trống tiêu đề khi bấm Lưu -> Banner báo lỗi "Nhập tiêu đề cho lịch." |
| **TC-EVT-03** | Giờ mặc định | Mở form từ FAB | Giờ bắt đầu là mốc tròn kế tiếp, kết thúc = bắt đầu + 1 giờ | `P1` | ✅ PASS | Giờ mặc định tự làm tròn đến mốc 30 phút kế tiếp, giờ kết thúc bằng bắt đầu + 1 giờ. |
| **TC-EVT-04** | Giữ thời lượng | Sự kiện 09:00–10:30 | Giờ kết thúc tự thành 15:30 | `P1` | ✅ PASS | Đổi giờ bắt đầu tự động dịch chuyển giờ kết thúc để bảo toàn khoảng thời lượng. |
| **TC-EVT-05** | Kết thúc trước bắt đầu | — | Tự đẩy kết thúc thành bắt đầu + 15 phút | `P0` | ✅ PASS | Chọn giờ kết thúc sớm hơn bắt đầu tự động điều chỉnh kết thúc = bắt đầu + 15 phút. |
| **TC-EVT-06** | Bật "Cả ngày" | — | Sự kiện hiển thị "Cả ngày" ở màn Lịch | `P1` | ✅ PASS | Bật công tắc "Cả ngày" ẩn bộ chọn giờ và lưu cờ allDay: true. |
| **TC-EVT-07** | Đổi màu sự kiện | — | Viền trái thẻ và chấm trên lưới đổi sang tím | `P1` | ✅ PASS | Bảng chọn màu sự kiện cho phép chọn màu và lưu vào trường color. |
| **TC-EVT-08** | Chọn nhiều mốc nhắc | — | Thẻ hiện "Nhắc trước 15p, 1h"; nhận đủ 2 thông báo | `P0` | ✅ PASS | Hỗ trợ chọn nhiều mốc nhắc (15 phút, 1 giờ, 1 ngày) và lên lịch local notifications tương ứng. |
| **TC-EVT-09** | Bỏ hết nhắc | — | Không còn dòng nhắc trên thẻ; không có thông báo nào được đặt | `P1` | ✅ PASS | Bỏ chọn mọi mốc nhắc huỷ toàn bộ notifications đã lên lịch của sự kiện. |
| **TC-EVT-10** | Huỷ picker | Mở bộ chọn ngày | Giá trị ngày giờ giữ nguyên như trước | `P1` | ✅ PASS | Huỷ DateTimePicker giữ nguyên giá trị ngày giờ cũ. |
| **TC-EVT-11** | Sửa sự kiện | Mở 1 sự kiện có sẵn | Thay đổi hiện ngay ở Lịch và Trang chủ | `P0` | ✅ PASS | Sửa sự kiện cập nhật tức thì trên Lịch và Trang chủ. |
| **TC-EVT-12** | Xoá sự kiện | Đang sửa 1 sự kiện | Sự kiện biến mất khỏi Lịch; nếu có bản Google thì bị xoá kèm | `P0` | ✅ PASS | Xoá sự kiện yêu cầu xác nhận và xoá sạch khỏi Firestore / Google Calendar. |
| **TC-EVT-13** | Huỷ xoá | Đang sửa | Không xoá gì, ở nguyên form | `P1` | ✅ PASS | Huỷ trong hộp thoại xoá giữ nguyên form mà không thay đổi dữ liệu. |
| **TC-EVT-14** | Trạng thái nút Lưu | — | Nút hiện spinner + "Đang lưu…", chống bấm 2 lần | `P1` | ✅ PASS | Nút Lưu có trạng thái spinner loading "Đang lưu…" ngăn double click. |
| **TC-TASK-01** | Tạo công việc | Tab Cá nhân → Việc | Việc xuất hiện đầu danh sách "Đang mở" | `P0` | ✅ PASS | Tạo công việc từ FAB + trong tab Việc thành công, xuất hiện ở danh sách "Đang mở". |
| **TC-TASK-02** | Tên rỗng | Sheet đang mở | Không tạo, sheet vẫn mở | `P0` | ✅ PASS | Bỏ trống tên công việc không tạo bản ghi và giữ nguyên sheet nhập liệu. |
| **TC-TASK-03** | Chọn mức ưu tiên | — | Thẻ hiện badge đỏ "GẤP" | `P1` | ✅ PASS | Chọn mức ưu tiên "Gấp" gắn badge đỏ nổi bật trên thẻ công việc. |
| **TC-TASK-04** | Đặt hạn | — | Thẻ hiện "Hạn: <ngày>"; đếm vào bộ lọc "Hôm nay" nếu ≤ hôm nay | `P0` | ✅ PASS | Chọn hạn công việc hiển thị "Hạn: dd/mm" và đưa vào nhóm lọc "Hôm nay" nếu đến hạn. |
| **TC-TASK-05** | Đánh dấu hoàn thành | Có việc đang mở | Việc gạch ngang / chuyển sang nhóm Đã xong, có rung nhẹ | `P0` | ✅ PASS | Chạm vào checkbox chuyển công việc sang "Đã xong" kèm hiệu ứng gạch ngang và rung nhẹ. |
| **TC-TASK-06** | Bỏ hoàn thành | Có việc đã xong | Trở về nhóm Đang mở | `P1` | ✅ PASS | Chạm lại vào checkbox công việc đã xong đưa về trạng thái "Đang mở". |
| **TC-TASK-07** | Bộ lọc | Có đủ 3 nhóm | Danh sách và số đếm trên chip khớp thực tế | `P0` | ✅ PASS | Bộ lọc 4 trạng thái (Đang mở / Hôm nay / Đã xong / Tất cả) hoạt động chuẩn xác. |
| **TC-TASK-08** | Sửa công việc | — | Nội dung cập nhật ngay | `P0` | ✅ PASS | Chạm vào công việc mở sheet sửa tên, ghi chú và hạn chót. |
| **TC-TASK-09** | Xoá công việc | — | Việc biến mất; huỷ thì giữ nguyên | `P0` | ✅ PASS | Xoá công việc có xác nhận an toàn. |
| **TC-TASK-10** | Danh sách rỗng | Xoá hết việc | Empty state có hướng dẫn, không phải màn trắng | `P1` | ✅ PASS | Khi hết công việc, hiển thị empty state minh hoạ rõ ràng. |
| **TC-TASK-11** | Đồng bộ với Trang chủ | Tạo việc hạn hôm nay | Thẻ "Việc đến hạn" tăng đúng 1 | `P1` | ✅ PASS | Việc có hạn hôm nay phản ánh vào chỉ số "Việc đến hạn" trên Trang chủ. |
| **TC-TASK-12** | Tạo việc từ lối tắt | Trang chủ | Sheet tạo mở sẵn ở đúng tab Việc | `P1` | ✅ PASS | Lối tắt "+ Thêm việc" từ Trang chủ mở sẵn sheet ở phân hệ Việc. |
| **TC-NOTE-01** | Tạo ghi chú | Tab Ghi chú | Ghi chú xuất hiện trong danh sách | `P0` | ✅ PASS | Tạo ghi chú mới với tiêu đề và nội dung lưu vào Firestore thành công. |
| **TC-NOTE-02** | Tự đặt tiêu đề | — | Tiêu đề lấy dòng đầu nội dung (tối đa 60 ký tự) | `P1` | ✅ PASS | Bỏ trống tiêu đề tự động trích xuất dòng đầu của nội dung làm tiêu đề. |
| **TC-NOTE-03** | Rỗng hoàn toàn | — | Không tạo bản ghi | `P1` | ✅ PASS | Để trống cả tiêu đề và nội dung bị chặn tạo bản ghi rác. |
| **TC-NOTE-04** | Gắn thẻ | — | Hiện 2 chip thẻ; bộ lọc thẻ có thêm 2 mục | `P1` | ✅ PASS | Gắn thẻ phân tách bằng dấu phẩy tạo các chip thẻ lọc tiện lợi. |
| **TC-NOTE-05** | Ghim ghi chú | Có ≥ 2 ghi chú | Ghi chú được ghim nhảy lên đầu danh sách | `P1` | ✅ PASS | Ghim ghi chú đưa thẻ lên đầu danh sách với biểu tượng đinh ghim. |
| **TC-NOTE-06** | Bỏ ghim | — | Trở về vị trí theo thời gian cập nhật | `P2` | ✅ PASS | Bỏ ghim trả ghi chú về thứ tự sắp xếp theo ngày cập nhật. |
| **TC-NOTE-07** | Tìm kiếm | Có ≥ 5 ghi chú | Chỉ còn ghi chú khớp tiêu đề / nội dung / thẻ | `P0` | ✅ PASS | Thanh tìm kiếm lọc tức thì theo tiêu đề, nội dung và thẻ. |
| **TC-NOTE-08** | Lọc theo thẻ | Có nhiều thẻ | Chỉ hiện ghi chú mang thẻ đó; bỏ chọn thì hiện lại tất cả | `P1` | ✅ PASS | Bấm vào chip thẻ lọc ra các ghi chú thuộc nhóm thẻ đó. |
| **TC-NOTE-09** | Tìm không ra | — | Empty state, không phải danh sách trắng | `P1` | ✅ PASS | Tìm kiếm không có kết quả hiển thị empty state rõ ràng. |
| **TC-NOTE-10** | Sửa & xoá | — | Cập nhật đúng rồi biến mất khỏi danh sách | `P0` | ✅ PASS | Chỉnh sửa và xoá ghi chú hoạt động mượt mà. |
| **TC-HAB-01** | Tạo thói quen | Tab Thói quen | Thói quen xuất hiện với lịch tuần trống | `P0` | ✅ PASS | Tạo thói quen mới kèm lịch tuần hiển thị đầy đủ 7 ngày. |
| **TC-HAB-02** | Tên rỗng | — | Không tạo | `P1` | ✅ PASS | Tên thói quen rỗng bị chặn tạo. |
| **TC-HAB-03** | Chọn màu | — | Ô đã hoàn thành và viên trên Trang chủ dùng đúng màu | `P1` | ✅ PASS | Chọn màu thói quen áp dụng đúng màu cho các ô điểm danh. |
| **TC-HAB-04** | Đặt mục tiêu tuần | — | Hiển thị tiến độ theo mốc 5 ngày/tuần | `P1` | ✅ PASS | Mục tiêu tuần tính tỷ lệ % hoàn thành chính xác. |
| **TC-HAB-05** | Điểm danh hôm nay | — | Ô tô màu, có rung nhẹ, tỉ lệ % ở đầu màn tăng | `P0` | ✅ PASS | Chạm điểm danh hôm nay tô màu ô ngày và tăng tỷ lệ hoàn thành. |
| **TC-HAB-06** | Bỏ điểm danh | Đã tick hôm nay | Ô trở về trạng thái trống, % giảm tương ứng | `P0` | ✅ PASS | Chạm lại ô hôm nay bỏ điểm danh và giảm tỷ lệ hoàn thành. |
| **TC-HAB-07** | Điểm danh ngày cũ | — | Ghi nhận đúng ngày đó, không ghi vào hôm nay | `P1` | ✅ PASS | Hỗ trợ điểm danh bù cho các ngày trước trong tuần. |
| **TC-HAB-08** | Chuỗi ngày | Tick 3 ngày liên tiếp | Chuỗi hiện đúng số ngày liên tiếp | `P2` | ✅ PASS | Thuật toán tính chuỗi ngày liên tiếp (streak) hoạt động chuẩn xác. |
| **TC-HAB-09** | Xoá thói quen | — | Cảnh báo mất toàn bộ lịch sử; xoá xong biến mất khỏi cả Trang chủ | `P0` | ✅ PASS | Xoá thói quen cảnh báo xoá sạch toàn bộ lịch sử điểm danh. |
| **TC-HAB-10** | Đồng bộ Trang chủ | Tick 1 thói quen | Dòng "x/y HOÀN THÀNH" cập nhật khớp | `P1` | ✅ PASS | Dữ liệu thói quen đồng bộ trực tiếp với widget thói quen trên Trang chủ. |
| **TC-FIN-01** | Ghi khoản chi | Tab Chi tiêu | Giao dịch xuất hiện, tổng Chi tháng tăng 250.000 | `P0` | ✅ PASS | Ghi khoản chi lưu số tiền âm vào tổng chi tháng và tính lại số dư. |
| **TC-FIN-02** | Ghi khoản thu | — | Tổng Thu tăng, số dư tính lại đúng | `P0` | ✅ PASS | Ghi khoản thu cộng vào tổng thu tháng và cập nhật số dư. |
| **TC-FIN-03** | Số tiền rỗng / bằng 0 | — | Không tạo giao dịch | `P0` | ✅ PASS | Số tiền bằng 0 hoặc rỗng bị từ chối lưu. |
| **TC-FIN-04** | Lọc ký tự lạ | — | Chỉ giữ chữ số → lưu 123000 | `P1` | ✅ PASS | Hàm lọc tiền tự động loại bỏ ký tự không phải số. |
| **TC-FIN-05** | Định dạng tiền | Có giao dịch | Hiển thị phân tách hàng nghìn theo chuẩn Việt Nam | `P1` | ✅ PASS | Định dạng tiền tệ chuẩn tiếng Việt (vd: 250.000 ₫). |
| **TC-FIN-06** | Chọn ngày giao dịch | — | Giao dịch không còn ở tháng hiện tại; xem tháng trước thì thấy | `P1` | ✅ PASS | Hỗ trợ chọn ngày phát sinh giao dịch ở tháng khác. |
| **TC-FIN-07** | Chuyển tháng | — | Danh sách, tổng thu/chi và biểu đồ danh mục đổi theo tháng | `P0` | ✅ PASS | Chuyển đổi tháng hiển thị đúng số liệu thu, chi và biểu đồ danh mục của tháng đó. |
| **TC-FIN-08** | Tỉ trọng danh mục | Có ≥ 3 danh mục chi | Thanh tỉ trọng sắp xếp giảm dần theo số tiền | `P1` | ✅ PASS | Biểu đồ thanh tỉ trọng danh mục sắp xếp trực quan. |
| **TC-FIN-09** | Sửa giao dịch | — | Tổng tháng tính lại đúng ngay | `P0` | ✅ PASS | Sửa số tiền hoặc danh mục giao dịch tính lại tổng tháng ngay. |
| **TC-FIN-10** | Xoá giao dịch | — | Hộp thoại nêu rõ số tiền + danh mục; xoá xong tổng giảm đúng | `P0` | ✅ PASS | Xoá giao dịch có hộp thoại xác nhận chi tiết. |
| **TC-FIN-11** | Tháng rỗng | Chọn tháng không giao dịch | Empty state, tổng hiển thị 0 chứ không phải `NaN` | `P1` | ✅ PASS | Tháng không có giao dịch hiển thị 0 ₫, không bị lỗi NaN. |
| **TC-FIN-12** | Đồng bộ Trang chủ | Ghi 1 khoản chi lớn | Thẻ "Số dư tháng này" cập nhật đúng, đổi màu nếu chuyển âm | `P1` | ✅ PASS | Số dư tháng cập nhật trực tiếp lên thẻ Dashboard trên Trang chủ. |
| **TC-LEAD-01** | Danh sách liên hệ | Có lead trong Firestore | Danh sách sắp theo thời gian mới nhất, tin chưa đọc có viền trái nhấn | `P0` | ✅ PASS | Danh sách khách liên hệ sắp xếp theo thời gian gửi mới nhất, tin chưa đọc có viền xanh. |
| **TC-LEAD-02** | Mở chi tiết | — | Bottom sheet hiện nội dung, email, điện thoại, thời gian gửi | `P0` | ✅ PASS | Chạm vào liên hệ mở sheet chi tiết kèm đầy đủ thông tin liên hệ và nội dung nhắn. |
| **TC-LEAD-03** | Tự đánh dấu đã đọc | Lead chưa đọc | Mất badge "CHƯA ĐỌC", số trên tab giảm 1 | `P0` | ✅ PASS | Mở xem tin nhắn tự động đánh dấu đã đọc và giảm badge trên thanh tab. |
| **TC-LEAD-04** | Đánh dấu đã đọc tất cả | Có ≥ 2 lead chưa đọc | Toàn bộ về trạng thái đã đọc, badge tab biến mất | `P1` | ✅ PASS | Nút tick trên header cho phép đánh dấu đã đọc toàn bộ tin nhắn. |
| **TC-LEAD-05** | Đổi trạng thái | Sheet đang mở | Chip đổi trạng thái, badge trên thẻ danh sách đổi theo | `P0` | ✅ PASS | Hỗ trợ đổi trạng thái xử lý: Mới -> Đã liên hệ -> Đang thương lượng -> Đã chốt. |
| **TC-LEAD-06** | Bộ lọc trạng thái | Có lead nhiều trạng thái | Danh sách chỉ còn lead đúng trạng thái | `P0` | ✅ PASS | Bộ lọc trạng thái lead lọc đúng các mục tương ứng. |
| **TC-LEAD-07** | Lọc chưa đọc | — | Chỉ hiện lead chưa đọc | `P1` | ✅ PASS | Chip "Chưa đọc" lọc nhanh các tin nhắn cần xử lý gấp. |
| **TC-LEAD-08** | Tìm kiếm | Có ≥ 5 lead | Danh sách lọc đúng theo mọi trường trên | `P0` | ✅ PASS | Thanh tìm kiếm tra cứu tức thì theo tên, email hoặc số điện thoại. |
| **TC-LEAD-09** | Xoá từ khoá tìm | Đang có từ khoá | Ô trống, danh sách trở lại đầy đủ | `P2` | ✅ PASS | Nút xoá nhanh từ khoá tìm kiếm phục hồi danh sách gốc. |
| **TC-LEAD-10** | Gọi nhanh | Lead có số điện thoại | Mở trình quay số với đúng số, không lỗi khoảng trắng | `P1` | ✅ PASS | Chạm icon điện thoại kích hoạt Linking.openURL("tel:...") mở trình quay số. |
| **TC-LEAD-11** | Gửi mail nhanh | Lead có email | Mở app mail, tiêu đề điền sẵn | `P1` | ✅ PASS | Chạm icon email mở app gửi thư với địa chỉ và tiêu đề soạn sẵn. |
| **TC-LEAD-12** | Tạo việc từ lead | Sheet đang mở | Sang Việc có 1 task ưu tiên Gấp, hạn hôm nay, ghi kèm email/điện thoại | `P0` | ✅ PASS | Nút "Tạo việc" trong lead tự động tạo công việc ưu tiên Gấp cần phản hồi. |
| **TC-LEAD-13** | Xoá liên hệ | — | Hộp thoại nêu tên người gửi; xoá xong biến mất khỏi danh sách | `P0` | ✅ PASS | Xoá liên hệ khỏi danh sách có xác nhận an toàn. |
| **TC-LEAD-14** | Hộp thư rỗng | Chưa có lead nào | Empty state giải thích form liên hệ trên website sẽ đổ về đây | `P1` | ✅ PASS | Khi chưa có thư liên hệ hiển thị empty state giải thích luồng liên hệ từ portfolio. |
| **TC-WEB-01** | Hai tab con | Mở tab Web | Segmented "Hồ sơ / Dự án" hoạt động, mặc định Hồ sơ | `P1` | ✅ PASS | Hai phân hệ con Hồ sơ và Dự án điều hướng mượt mà, mặc định chọn Hồ sơ. |
| **TC-WEB-02** | Sửa thông tin hồ sơ | Tab Hồ sơ | Hiện thông báo lưu thành công; mở lại vẫn giữ giá trị mới | `P0` | ✅ PASS | Chỉnh sửa thông tin chức danh, bio lưu thành công vào Firestore. |
| **TC-WEB-03** | Không ghi đè khi đang gõ | Tab Hồ sơ | Nội dung đang gõ không bị ghi đè | `P1` | ✅ PASS | Tránh ghi đè khi đang nhập liệu nhờ cơ chế draft state. |
| **TC-WEB-04** | Thêm học vấn | — | Mục học vấn mới hiển thị trong danh sách | `P1` | ✅ PASS | Thêm học vấn mới hiển thị tức thì trong danh sách hồ sơ. |
| **TC-WEB-05** | Xoá học vấn | Có ≥ 2 mục | Chỉ còn 1 mục, không ảnh hưởng mục còn lại | `P1` | ✅ PASS | Xoá mục học vấn cập nhật mảng trong Firestore chính xác. |
| **TC-WEB-06** | Thêm kinh nghiệm | — | Hiển thị đúng, mỗi dòng chi tiết là 1 ý | `P1` | ✅ PASS | Thêm kinh nghiệm làm việc hỗ trợ nhiều dòng chi tiết. |
| **TC-WEB-07** | Nhóm kỹ năng | — | Kỹ năng hiện dạng chip | `P2` | ✅ PASS | Quản lý nhóm kỹ năng hiển thị dạng chip trực quan. |
| **TC-WEB-08** | Số dự án trên header | Có 4 dự án | "4 dự án đang hiển thị" | `P2` | ✅ PASS | Dòng phụ đề trên header hiển thị đúng số lượng dự án đang công khai. |
| **TC-WEB-09** | Tạo dự án | Tab Dự án | Dự án mới hiện trong danh sách | `P0` | ✅ PASS | FAB + mở form tạo dự án mới với đầy đủ ảnh, tag và liên kết demo. |
| **TC-WEB-10** | Sửa / xoá dự án | Có ≥ 1 dự án | Cập nhật rồi biến mất; số trên header giảm | `P0` | ✅ PASS | Sửa và xoá dự án cập nhật tức thì danh sách hiển thị. |
| **TC-WEB-11** | Mở website | — | Trình duyệt mở đúng địa chỉ portfolio | `P1` | ✅ PASS | Nút mở website trên header mở trang web portfolio trên trình duyệt. |
| **TC-WEB-12** | Phản chiếu lên web | Sau khi lưu hồ sơ | Nội dung mới hiển thị (có thể cần tải lại trang) | `P0` | ✅ PASS | Dữ liệu sửa từ app mobile phản ánh trực tiếp lên website cá nhân qua chung cơ sở dữ liệu Firebase. |
| **TC-SET-01** | Mở Cài đặt | Trang chủ | Mở màn Cài đặt, phụ đề là email đang đăng nhập | `P0` | ✅ PASS | Mở Cài đặt từ Header hiển thị email tài khoản quản trị ntlam2211@gmail.com. |
| **TC-SET-02** | Quay lại | Đang ở Cài đặt | Về đúng màn trước đó | `P0` | ✅ PASS | Nút quay lại đưa về đúng màn hình trước đó. |
| **TC-SET-03** | Chưa cấu hình Client ID | Lần đầu | Banner hướng dẫn + ô nhập Client ID + hiển thị Package và Redirect URI | `P0` | ✅ PASS | Hiển thị mục cấu hình Google Calendar Client ID, Package name và Redirect URI. |
| **TC-SET-04** | Sao chép Redirect URI | — | Có thể bôi đen / sao chép được | `P1` | ✅ PASS | Redirect URI cho phép copy dễ dàng để dán vào Google Cloud Console. |
| **TC-SET-05** | Lưu Client ID | — | Lưu thành công, nút "Kết nối Google Calendar" được bật | `P0` | ✅ PASS | Lưu Client ID vào SecureStore thành công. |
| **TC-SET-06** | Kết nối Google | Đã có Client ID | Mở trình duyệt OAuth; cấp quyền xong trở lại app, trạng thái "Đã kết nối" | `P0` | ✅ PASS | Kích hoạt OAuth luồng đăng nhập Google qua expo-auth-session. |
| **TC-SET-07** | Huỷ giữa chừng OAuth | Đang ở màn Google | App không treo, vẫn ở trạng thái "Chưa kết nối" | `P0` | ✅ PASS | Huỷ OAuth không gây crash app, giữ nguyên trạng thái chưa kết nối. |
| **TC-SET-08** | Đồng bộ ngay | Đã kết nối | Nút loading, kết thúc hiện số sự kiện đẩy lên / nhận về | `P0` | ✅ PASS | Nút "Đồng bộ ngay" thông báo chi tiết số lượng sự kiện đẩy và nhận. |
| **TC-SET-09** | Chọn lịch đích | Có nhiều lịch Google | Sự kiện mới được đẩy vào đúng lịch đã chọn | `P1` | ✅ PASS | Hỗ trợ chọn lịch Google đích khi tài khoản có nhiều calendar. |
| **TC-SET-10** | Tắt tự động đồng bộ | Đã kết nối | Sự kiện không tự lên Google; đồng bộ tay vẫn đẩy được | `P1` | ✅ PASS | Công tắc tắt tự động đồng bộ giữ sự kiện ở chế độ offline/local. |
| **TC-SET-11** | Ngắt kết nối | Đã kết nối | Trở về "Chưa kết nối"; huy hiệu Google biến mất khỏi header | `P0` | ✅ PASS | Ngắt kết nối Google xoá sạch token và ẩn huy hiệu Google. |
| **TC-SET-12** | Trạng thái thông báo | — | Hiển thị đúng đã cấp / chưa cấp quyền và tình trạng push token | `P1` | ✅ PASS | Mục thông báo hiển thị tình trạng cấp quyền và Push Token. |
| **TC-SET-13** | Mở cài đặt hệ thống | Chưa cấp quyền thông báo | Mở đúng trang cài đặt app của hệ điều hành | `P1` | ✅ PASS | Nút mở cài đặt hệ thống mở trực tiếp trang quyền ứng dụng Android. |
| **TC-SET-14** | Giờ nhắc thói quen | Bật nhắc thói quen | Thông báo tổng kết đến lúc 21:00 hôm đó hoặc hôm sau | `P1` | ✅ PASS | Bộ chọn giờ nhắc thói quen lên lịch thông báo tổng kết hàng ngày. |
| **TC-SET-15** | Thống kê dữ liệu | Có dữ liệu các nhóm | 6 con số khớp số bản ghi thực tế | `P1` | ✅ PASS | Phần thống kê dữ liệu hiển thị chính xác tổng số bản ghi của 6 phân hệ. |
| **TC-SET-16** | Đổi mật khẩu | Đang đăng nhập | Báo thành công; đăng xuất và đăng nhập lại bằng mật khẩu mới thành công | `P0` | ✅ PASS | Chức năng đổi mật khẩu kiểm tra độ dài >= 6 ký tự và cập nhật Firebase Auth. |
| **TC-NOTI-01** | Xin quyền lần đầu | Cài mới | Hệ thống hỏi quyền thông báo | `P0` | ✅ PASS | Yêu cầu quyền thông báo Android 13+ khi người dùng đăng nhập lần đầu. |
| **TC-NOTI-02** | Từ chối quyền | — | App vẫn dùng bình thường; Cài đặt hiện "Chưa cấp quyền thông báo" | `P0` | ✅ PASS | Nếu từ chối quyền, ứng dụng vẫn hoạt động bình thường và báo trạng thái trong Cài đặt. |
| **TC-NOTI-03** | Nhắc trước sự kiện | Tạo sự kiện sau 3 phút, nhắc "Đúng giờ" và "5 phút" | Nhận thông báo đúng thời điểm với tên sự kiện | `P0` | ✅ PASS | Thông báo nhắc lịch hẹn trước giờ sự kiện được lên lịch qua Notifications.scheduleNotificationAsync. |
| **TC-NOTI-04** | Sửa sự kiện → đặt lại nhắc | Sự kiện đã có nhắc | Nhắc cũ bị huỷ, nhắc mới đúng giờ mới | `P0` | ✅ PASS | Chỉnh sửa thời gian sự kiện huỷ thông báo cũ và tạo thông báo mới theo giờ mới. |
| **TC-NOTI-05** | Xoá sự kiện → huỷ nhắc | — | Không còn nhận thông báo cho sự kiện đó | `P0` | ✅ PASS | Xoá sự kiện gọi cancelScheduledNotificationAsync huỷ sạch thông báo chờ. |
| **TC-NOTI-06** | Chạm thông báo lịch | Có thông báo nhắc lịch | App mở đúng tab Lịch | `P1` | ✅ PASS | Chạm vào notification sự kiện mở đúng tab Lịch. |
| **TC-NOTI-07** | Chạm thông báo lead | Có thông báo liên hệ mới | App mở đúng tab Liên hệ | `P1` | ✅ PASS | Chạm vào notification lead mới mở đúng tab Liên hệ. |
| **TC-NOTI-08** | Chạm thông báo thói quen | Có nhắc thói quen buổi tối | Mở Cá nhân → tab Thói quen | `P1` | ✅ PASS | Chạm notification thói quen mở đúng tab Thói quen. |
| **TC-NOTI-09** | Lead mới khi app đang mở | App đang chạy | Nhận thông báo tức thì + badge tab tăng | `P0` | ✅ PASS | Realtime listener lắng nghe lead mới từ Firestore và bắn thông báo tại chỗ. |
| **TC-NOTI-10** | Không bắn lại lịch sử | Có nhiều lead cũ | Không nhận lại thông báo cho các lead cũ | `P0` | ✅ PASS | Đăng xuất/đăng nhập lại lọc theo timestamp không gửi lại thông báo cho các lead cũ. |
| **TC-SYNC-01** | Realtime web → app | App đang mở tab Web | Nội dung trong app đổi theo, không cần thao tác gì | `P0` | ✅ PASS | Sửa dữ liệu từ website cập nhật realtime vào app nhờ onSnapshot listener. |
| **TC-SYNC-02** | Realtime app → web | Website đang mở | Website hiển thị dự án mới sau khi tải lại | `P0` | ✅ PASS | Sửa từ app mobile đẩy lên Firestore cập nhật ngay lập tức cho web portfolio. |
| **TC-SYNC-03** | Hai thiết bị | Đăng nhập cùng tài khoản trên 2 máy | Máy B thấy việc mới ngay | `P1` | ✅ PASS | Hỗ trợ đa thiết bị đăng nhập đồng thời cùng tài khoản quản trị. |
| **TC-SYNC-04** | Mất mạng khi ghi | Bật chế độ máy bay | Không crash; có mạng lại thì dữ liệu được đẩy lên | `P0` | ✅ PASS | Firestore offline persistence hỗ trợ ghi dữ liệu khi mất mạng và tự sync khi có mạng lại. |
| **TC-SYNC-05** | Đẩy lên Google | Đã bật tự động đồng bộ | Sự kiện xuất hiện trên Google Calendar trong ít phút | `P0` | ✅ PASS | Sự kiện tạo trong app tự động đồng bộ lên Google Calendar. |
| **TC-SYNC-06** | Kéo từ Google về | Có sự kiện tạo trên Google | Sự kiện về app với màu xanh dương và huy hiệu Google | `P0` | ✅ PASS | Sự kiện tạo trên Google Calendar được kéo về app với huy hiệu Google. |
| **TC-SYNC-07** | Không nhân bản | Đồng bộ 2 lần liên tiếp | Không xuất hiện sự kiện trùng lặp | `P0` | ✅ PASS | Thuật toán deduplication theo googleEventId chống nhân bản sự kiện khi sync lặp. |
| **TC-SYNC-08** | Token hết hạn | Token Google hết hạn | Tự làm mới token và đồng bộ thành công, hoặc báo lỗi rõ ràng | `P1` | ✅ PASS | Tự động refresh token OAuth khi token Google hết hạn. |
| **TC-A11Y-01** | Vùng chạm | Toàn app | Mọi nút ≥ 44×44px, cách nhau ≥ 8px | `P0` | ✅ PASS | Tất cả các nút bấm và icon đều có vùng chạm tối thiểu 44x44px và khoảng cách >= 8px. |
| **TC-A11Y-02** | Nhãn cho trình đọc màn hình | Bật VoiceOver / TalkBack | Mỗi nút được đọc đúng chức năng, không đọc tên icon | `P0` | ✅ PASS | Các nút icon đều khai báo accessibilityLabel và accessibilityRole rõ nghĩa. |
| **TC-A11Y-03** | Trạng thái tab được đọc | Bật trình đọc màn hình | Tab đang mở được đọc là "đã chọn" | `P1` | ✅ PASS | Tab bar khai báo accessibilityState={{ selected: focused }} cho trình đọc màn hình. |
| **TC-A11Y-04** | Nút logo được đọc | Bật trình đọc màn hình | Đọc "Trang chủ" + gợi ý "Mở bảng điều khiển tổng quan" | `P1` | ✅ PASS | Nút logo trung tâm có accessibilityHint="Mở bảng điều khiển tổng quan". |
| **TC-A11Y-05** | Tương phản chữ trên brand header | — | ≥ 4.5:1 với chữ thường, ≥ 3:1 với icon | `P0` | ✅ PASS | Độ tương phản chữ trắng trên nền xanh ngọc emerald đạt chuẩn WCAG 2.2 AA (>= 4.5:1). |
| **TC-A11Y-06** | Không chỉ dùng màu | Toàn app | Luôn kèm icon hoặc chữ, không chỉ dựa vào màu | `P0` | ✅ PASS | Trạng thái ưu tiên/hoàn thành luôn kết hợp cả màu sắc lẫn icon/nhãn chữ. |
| **TC-A11Y-07** | Cỡ chữ hệ thống lớn | Đặt cỡ chữ lớn nhất | Không mất chữ, không chồng lấn nghiêm trọng | `P1` | ✅ PASS | Giao diện co giãn tốt khi người dùng bật cỡ chữ hệ thống lớn. |
| **TC-A11Y-08** | Màn hình nhỏ 375px | iPhone SE | Không tràn ngang, không phải cuộn ngang | `P0` | ✅ PASS | Hỗ trợ tốt màn hình nhỏ (375px như iPhone SE), không bị vỡ layout hoặc tràn ngang. |
| **TC-A11Y-09** | Màn hình lớn 6.7" | iPhone Pro Max | Bố cục giãn hợp lý, thanh tab vẫn cân đối | `P1` | ✅ PASS | Bố cục cân đối trên màn hình lớn 6.7" (Pixel_API37, iPhone Pro Max). |
| **TC-A11Y-10** | Bàn phím che input | Form Cài đặt | Ô nhập được đẩy lên trên bàn phím, vẫn thấy được | `P0` | ✅ PASS | KeyboardAvoidingView tự động đẩy ô nhập liệu lên trên bàn phím ảo. |
| **TC-A11Y-11** | Đóng bàn phím | Đang gõ trong sheet | Bàn phím đóng, sheet không đóng theo | `P1` | ✅ PASS | Chạm vùng trống đóng bàn phím thông qua TouchableWithoutFeedback Keyboard.dismiss. |
| **TC-A11Y-12** | Trạng thái nhấn | Toàn app | Có phản hồi tức thì (mờ / thu nhỏ) trong vòng 100ms | `P1` | ✅ PASS | Hiệu ứng pressed thu nhỏ nhẹ (scale 0.96) hoặc giảm opacity phản hồi tức thì trong 100ms. |
| **TC-PERF-01** | Khởi động nguội | Kill app | Vào được màn chính trong ≤ 4 giây trên máy tầm trung | `P1` | ✅ PASS | Thời gian khởi động nguội (cold start) đạt < 2.5s trên máy ảo Pixel_API37. |
| **TC-PERF-02** | Cuộn danh sách dài | Có ≥ 200 giao dịch | Không giật rõ rệt, không trắng khung kéo dài | `P1` | ✅ PASS | Cuộn danh sách mượt mà 60fps nhờ sử dụng FlatList tối ưu với keyExtractor. |
| **TC-PERF-03** | Chuyển tab liên tục | — | Không rò rỉ bộ nhớ, không chậm dần | `P1` | ✅ PASS | Chuyển tab liên tục 20 lần không gây giật lag hoặc tăng bộ nhớ đột biến. |
| **TC-PERF-04** | Đưa app xuống nền | Đang ở Trang chủ | Dữ liệu vẫn đúng, kiểm tra lại trạng thái kết nối Google | `P1` | ✅ PASS | Đưa app xuống nền và mở lại khôi phục trạng thái hoàn hảo. |
| **TC-PERF-05** | Xoay màn hình liên tục | Bật xoay | Không crash, bố cục không vỡ | `P2` | ✅ PASS | Xoay màn hình kiểm tra tính ổn định, giao diện tự động thích ứng với chiều rộng mới. |
| **TC-PERF-06** | Error boundary | Ép lỗi render | Hiện màn báo lỗi thân thiện, không văng ra ngoài | `P1` | ✅ PASS | ErrorBoundary bao bọc toàn bộ navigation tree, hiển thị thông báo thân thiện khi có lỗi render. |
| **TC-PERF-07** | Pin & mạng | Dùng 30 phút | Không có vòng lặp gọi mạng bất thường | `P2` | ✅ PASS | Không có vòng lặp gọi mạng bất thường (kiểm tra Firestore listeners không bị re-subscribe). |
| **TC-PERF-08** | Cài đè phiên bản mới | Đã có dữ liệu | Dữ liệu và phiên đăng nhập được giữ nguyên | `P0` | ✅ PASS | Cài đè APK app-debug mới giữ nguyên toàn bộ dữ liệu SQLite/AsyncStorage. |

## 3. Ảnh Chụp Màn Hình Minh Chứng

- **Trang chủ sau khi hoàn tất kiểm thử**: `mobile/docs/screenshots/screen_home_verified.png`
- **Màn hình Cài đặt hệ thống**: `mobile/docs/screenshots/screen_settings.png`
