# Phần mềm Chấm công và Tính lương (Payroll & Attendance App)

Ứng dụng web dùng để quản lý danh sách nhân viên, theo dõi quá trình chấm công hàng ngày và tự động tính toán lương bổng vào cuối tháng.

## User Review Required

> [!IMPORTANT]
> Đây là kế hoạch tổng quan cho phiên bản đầu tiên của phần mềm. Xin vui lòng xem qua các tính năng cốt lõi bên dưới và cho tôi biết nếu bạn muốn thêm, bớt hoặc thay đổi bất cứ điều gì trước khi chúng ta bắt đầu lập trình.

## Proposed Changes

Chúng ta sẽ xây dựng một ứng dụng web (Web App) hiện đại tập trung vào các tính năng sau:

1. **Quản lý Nhân viên**:
   - Xem danh sách, thêm mới, chỉnh sửa thông tin và xóa nhân viên.
   - Thông tin cơ bản bao gồm: Mã số, Họ và tên, Chức vụ, Phòng ban, Lương cơ bản (theo ngày hoặc theo tháng).
2. **Hệ thống Chấm công**:
   - Giao diện dạng bảng chéo (Ma trận Nhân viên x Ngày trong tháng).
   - Cho phép chọn trạng thái mỗi ngày: Có mặt (Full-day), Nửa ngày (Half-day), Nghỉ phép có lương, Nghỉ không lương, Tăng ca.
3. **Bảng Tính lương (Payroll)**:
   - Tự động thống kê số ngày công.
   - Công thức tính cơ bản: `(Lương cơ bản / Số ngày chuẩn) * Số ngày thực tế làm việc + Tiền tăng ca - Tiền phạt/Khấu trừ`.
4. **Giao diện & Trải nghiệm (UI/UX)**:
   - Sử dụng thiết kế hiện đại, màu sắc tinh tế, dễ nhìn cho ứng dụng doanh nghiệp.
   - Tương tác mượt mà với hiệu ứng hover và transition nhẹ nhàng.

### Công nghệ sử dụng
- **Frontend Framework**: ReactJS (khởi tạo qua Vite) cho tốc độ phát triển nhanh và hiệu năng cao.
- **Styling**: Vanilla CSS (CSS thuần) nhằm đảm bảo thiết kế độc bản, tối ưu hóa theo yêu cầu.
- **Lưu trữ dữ liệu**: Tạm thời sử dụng `LocalStorage` của trình duyệt để lưu trữ dữ liệu, giúp phần mềm có thể chạy và dùng thử ngay lập tức mà không cần cài đặt máy chủ (Server/Database). 

## Open Questions

> [!WARNING]
> Để làm cho phần mềm sát với nhu cầu của bạn nhất, xin cho tôi biết:
> 1. Quy tắc tính lương: Công ty bạn tính lương theo tháng (cố định rồi trừ ngày nghỉ) hay tính theo ngày làm việc thực tế?
> 2. Có khoản phụ cấp cố định nào (ăn trưa, đi lại) cần cộng vào mỗi tháng không?
> 3. Bạn có muốn thêm chức năng Xuất báo cáo (Excel/PDF) không?

## Verification Plan

### Manual Verification
- Chạy dự án ở môi trường dev local (`npm run dev`).
- Tạo thử 2-3 nhân viên giả định.
- Chấm công giả định trong vòng 1 tuần.
- Kiểm tra màn hình Tính Lương để xác minh độ chính xác của các con số.
