# ClueTek ecosystem

Website cho ClueTek, dựa trên nội dung thật trong workspace `Content Creator 2`. Giữ màu navy/cyan/white, biểu tượng kính lúp và định vị **Everyday tech, explained simply.**

## Đã có trong bản đầu

- Trang chủ tiếng Anh và tiếng Việt.
- 25 bài giải thích, mỗi bài có trang riêng ở cả hai ngôn ngữ; tổng cộng 52 trang.
- 10 video MP4 thật có trình phát; giữ trạng thái bản xem trước biên tập và giọng AI tiếng Anh.
- Infographic ClueTek có sẵn, tối ưu WebP; nguồn tham khảo trong từng bài.
- Tìm kiếm, lọc theo chủ đề, lưu bài trong trình duyệt và chuyển ngôn ngữ.
- ClueLab: đổi Mbps sang MB/s và thử bốn trạng thái của hai kết nối mạng.
- Responsive, điều hướng bàn phím, modal bằng `dialog`, hỗ trợ reduced motion.
- Workflow GitHub Actions để kiểm tra và deploy GitHub Pages.

Các tên **ClueTek Learn**, **ClueTek Shorts**, **ClueLab** là cách tổ chức nội dung cho website này. Lộ trình 100 chủ đề được giữ trong source; bài chưa có nội dung không được hiển thị như bài hoàn thành.

## Chạy tại máy

Cần Node.js 20 trở lên. Dự án không có dependency npm và không cần `npm install`.

```sh
npm run dev
```

Mở địa chỉ `http://127.0.0.1:4173`. Lệnh dev build website, mở server và theo dõi thay đổi trong `src/`. Nếu đã có server trên cổng này, chọn cổng khác:

```sh
PORT=4174 npm run dev
```

Build và kiểm tra:

```sh
npm run build
npm run check
```

Thư mục `dist/` chứa bản deploy. Có thể đưa lên GitHub Pages, Cloudflare Pages, Netlify hoặc hosting tĩnh. Build command: `npm run build`. Output: `dist`.

## GitHub và deploy

Repo source: <https://github.com/giabaocode/cluetek>.

Địa chỉ GitHub Pages: <https://giabaocode.github.io/cluetek/>. Git đã nối `origin` với repo này, nhánh `main`. Pages được cấu hình dùng GitHub Actions và HTTPS.

Để cập nhật website, sửa source rồi chạy:

```sh
npm run build
npm run check
git add .
git commit -m "Update ClueTek website"
git push origin main
```

Mỗi lần push lên `main`, workflow `Build and deploy ClueTek` tự build, kiểm tra nội dung/liên kết và deploy. Xem tiến trình tại <https://github.com/giabaocode/cluetek/actions>.

Workflow lấy `SITE_URL` từ `actions/configure-pages` để tạo canonical URL, Open Graph URL và sitemap đúng với repo hoặc tên miền riêng. Khi build local, không tạo URL tên miền giả.

Nếu cần chạy lại thủ công, mở **Actions → Build and deploy ClueTek → Run workflow**. Cấu hình nguồn trong **Settings → Pages → Source** là **GitHub Actions**.

[Tài liệu GitHub Pages gốc](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Chỉnh sửa

| Tệp | Nội dung |
| --- | --- |
| `src/content.json` | 25 bài: tiêu đề, nội dung, bản dịch, hình, video, nguồn |
| `src/i18n.mjs` | Nội dung giao diện Anh/Việt |
| `src/templates.mjs` | Trang chủ, trang bài đọc, header/footer/modal |
| `src/art.mjs` | Minh họa SVG/CSS của website |
| `src/styles.css` | Màu, font, bố cục và responsive |
| `src/app.js` | Tìm kiếm, lưu bài, video và tương tác |
| `src/roadmap.json` | 100 chủ đề từ kế hoạch nội dung gốc |
| `public/assets/` | Font tự host, hình WebP, video MP4 |
| `scripts/build.mjs` | Sinh website tĩnh cho hai ngôn ngữ |
| `.github/workflows/deploy.yml` | Kiểm tra và deploy GitHub Pages |

`scripts/import-content.py` ghi lại lần nhập từ workspace gốc, cần Pillow nếu chạy lại. **Không cần chạy script này để build hoặc deploy.** Chỉnh trực tiếp `src/content.json` cho các lần cập nhật website; chạy lại import sẽ ghi lại những bài đã nhập.

## Kiểm thử trình duyệt

`npm run check` kiểm tra nội dung, cú pháp JavaScript, số trang và liên kết tài nguyên nội bộ. `scripts/browser-check.mjs` là kiểm thử tùy chọn bằng Playwright cho tìm kiếm, bộ lọc, lưu bài, hai ngôn ngữ, video, ClueLab và responsive. Playwright không phải dependency chạy website.

Nếu máy bạn có Playwright:

```sh
PLAYWRIGHT_MODULE_PATH=/absolute/path/to/playwright node scripts/browser-check.mjs
```

Phải chạy preview trước. Có thể đặt `PREVIEW_URL` nếu dùng cổng khác. Kết quả được ghi vào `docs/qa/browser-results.json`; screenshot QA được Git bỏ qua.

## Nội dung và quyền riêng tư

Các bài được biên tập từ bộ nội dung hiện có, giữ điều kiện và giới hạn kỹ thuật. Đây không phải xác nhận rằng nội dung đã được đăng trên Facebook/X. Hình và voice-over tiếng Anh có sử dụng AI. Bản dịch Việt do trợ lý biên tập.

Website không có backend, đăng ký email, analytics hay cookie quảng cáo. Bài đã lưu và lựa chọn ngôn ngữ dùng localStorage; không đồng bộ sang tài khoản khác. Các nguồn bên ngoài có chính sách riêng.

Font Space Grotesk và Manrope được tự host theo SIL Open Font License, kèm giấy phép trong `public/assets/fonts/`.

Xem [ghi chú nguồn](docs/content-notes.md), [quyết định thiết kế và skill](docs/design.md), [inventory workspace](docs/source-inventory.json).
