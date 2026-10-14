# Kiểm tra bản đầu — 14/10/2026

- `npm run build`: thành công, sinh 52 trang với 25 bài và 10 video.
- `npm run check`: thành công; kiểm tra nội dung, cú pháp, 52 trang và 1.766 liên kết trang/tài nguyên nội bộ.
- `scripts/browser-check.mjs`: 14 nhóm kiểm thử thực tế thành công bằng Chromium. Kết quả gốc ở `browser-results.json`.
- Kiểm tra trang chủ và trang bài ở 320, 375, 390, 768, 1024 và 1440px; không có tràn ngang.
- Xem screenshot desktop, mobile tiếng Anh/Việt và trang bài có infographic.
- Video MP4 thực sự phát, thời gian playback tăng, dừng khi đóng modal.
- Bộ đổi đơn vị đã kiểm tra 8 Mbps → 1 MB/s, 300 Mbps → 37,5 MB/s, 1000 Mbps → 125 MB/s.
- Mô phỏng mạng đã kiểm tra đủ bốn tổ hợp bật/tắt hai kết nối.
- Bộ lọc, tìm kiếm/empty state, lưu qua reload, Escape/focus, menu mobile và xóa dữ liệu localStorage hoạt động.
- Đường dẫn dưới `/cluetek-ecosystem/` hoạt động, gồm trang bài và chuyển ngôn ngữ.
- Build với `SITE_URL` mô phỏng xác nhận canonical, URL Open Graph tuyệt đối và sitemap có 52 mục; sau đó build lại bản local.
- Không có lỗi JavaScript hoặc tài nguyên site thất bại trong lần kiểm thử cuối.

Chưa có deploy công khai: chờ người dùng tạo repo GitHub, gửi URL và bật GitHub Pages. Chưa kiểm chứng Safari/Firefox hoặc thiết bị điện thoại vật lý. Video/infographic gốc dùng tiếng Anh; bản Việt của bài và giao diện được biên tập riêng.
