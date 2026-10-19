# GlowBeauty

GlowBeauty là hệ thống bán mĩ phẩm trực tuyến kèm quản lý cửa hàng. Ứng dụng hỗ trợ toàn bộ quy trình từ xem sản phẩm, đặt hàng, thanh toán và nhận hàng tại cửa hàng đến quản lý vận hành, kho và tài chính.

## Chức năng chính

### Khách hàng

- Đăng ký tài khoản bằng **bất kỳ email nào** (Gmail, Yahoo, Outlook, email công ty…), chỉ cần họ tên, email và mật khẩu.
- Đăng nhập, xem và cập nhật hồ sơ cá nhân, ảnh đại diện.
- Xem sản phẩm theo danh mục: chăm sóc da, trang điểm, chăm sóc tóc, chăm sóc cơ thể, nước hoa, thuần chay.
- Chọn dung tích, tông màu, gói quà và mua combo sản phẩm.
- Thêm vào giỏ, áp dụng mã giảm giá, voucher hoặc điểm thưởng.
- Đặt hàng nhận tại cửa hàng hoặc đóng gói mang về, nhận ngay hoặc hẹn giờ.
- Theo dõi trạng thái đơn theo thời gian thực.
- Quản lý ví GlowBeauty, điểm thưởng, voucher và sản phẩm yêu thích.
- Đánh giá sản phẩm và trao đổi với thu ngân theo từng đơn hàng.

### Thu ngân

- Tiếp nhận, xác nhận hoặc từ chối đơn.
- Theo dõi thanh toán, cập nhật trạng thái và bàn giao đơn bằng mã QR.
- Trao đổi với khách hàng trong phòng chat của đơn hàng.

### Nhân viên kho

- Xem hàng đợi sản phẩm cần đóng gói.
- Nhận xử lý, bắt đầu đóng gói và đánh dấu hoàn tất.
- Theo dõi tồn kho và tình trạng còn hàng.

### Quản trị viên

- Xem dashboard, doanh thu, đơn hàng và báo cáo.
- Quản lý khách hàng, nhân viên, sản phẩm, combo và danh mục.
- Quản lý kho, phiếu nhập, nhà cung cấp, mã giảm giá, voucher và ví.
- Khóa/mở tài khoản, đặt lại mật khẩu và cấu hình cửa hàng.
- Tải ảnh đại diện hoặc ảnh sản phẩm lên kho ảnh.

## Chạy thử

### Đăng ký tài khoản mới

1. Mở trang `/auth/register`.
2. Nhập họ tên và một email bất kỳ, ví dụ `ban@gmail.com`.
3. Nhập mật khẩu tối thiểu 8 ký tự, có chữ hoa, chữ thường và chữ số, ví dụ `Glow@12345`.
4. Nhập lại mật khẩu và gửi biểu mẫu. Tài khoản được tạo kèm ví, điểm thưởng và giỏ hàng.

Mỗi email chỉ đăng ký được một lần.

### Luồng đặt hàng và xử lý đơn

Nên dùng nhiều cửa sổ trình duyệt hoặc cửa sổ ẩn danh để quan sát cập nhật thời gian thực giữa các vai trò.

1. Đăng nhập tài khoản khách hàng, chọn sản phẩm, thêm vào giỏ và đặt hàng.
2. Ở cửa sổ khác, đăng nhập `thungan01@glowbeauty.vn` để nhận đơn.
3. Ở cửa sổ thứ ba, đăng nhập `kho01@glowbeauty.vn` để nhận xử lý và đóng gói.
4. Quay lại cửa sổ thu ngân để hoàn tất đơn; trạng thái tự cập nhật ở cửa sổ khách hàng.
5. Đăng nhập `admin@glowbeauty.vn` để xem dashboard, sản phẩm, kho và báo cáo.

## Tài khoản mẫu

Các tài khoản tạo sẵn dùng chung mật khẩu là giá trị `SEED_DEMO_PASSWORD` (mặc định trong `.env.example`: `Glow@12345`).

| Vai trò | Email | Mã nhân viên |
| --- | --- | --- |
| Quản trị viên | `admin@glowbeauty.vn` | `GB-ADM-001` |
| Thu ngân | `thungan01@glowbeauty.vn` | `GB-TN-001` |
| Thu ngân | `thungan02@glowbeauty.vn` | `GB-TN-002` |
| Nhân viên kho | `kho01@glowbeauty.vn` | `GB-KHO-001` |
| Nhân viên kho | `kho02@glowbeauty.vn` | `GB-KHO-002` |

Dữ liệu mẫu có 50 khách hàng đã có tài khoản, ví dụ `nguyen.thi.minh.anh001@example.com`, 20 sản phẩm, 5 combo và 200 đơn hàng.

## Chạy trên máy

```bash
cp .env.example .env          # sửa DATABASE_URL nếu cần
pnpm install
pnpm db:setup                 # migrate + nạp dữ liệu mẫu
pnpm dev                      # web: http://localhost:3000, API: http://localhost:3001/api
```

Hướng dẫn deploy (Vercel + Render + Neon + Cloudinary) nằm trong [DEPLOY.md](DEPLOY.md).
