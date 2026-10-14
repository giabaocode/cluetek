# ClueTek — thiết kế và skill

Ngày xây dựng: 14/10/2026.

## Skill đã tìm và áp dụng

1. [Frontend Design — Anthropic](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md): đọc bản gốc; xây visual riêng từ chủ đề, có một hình ảnh đặc trưng, hệ chữ rõ ràng và review bằng screenshot.
2. [UI/UX Pro Max — NextLevelBuilder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): tải source vào thư mục tạm để đọc skill và chạy truy vấn design system/UX. Commit đọc: `7246805992a42b7bba37d4cac83b01416f0c6c44`. Không cài thay đổi cấu hình toàn máy.
3. [Copywriting — Corey Haines](https://github.com/coreyhaines31/marketingskills/tree/main/skills/copywriting): dùng bản đã có trong workspace. Viết từ nội dung thực, CTA nói rõ thao tác, giữ giới hạn kỹ thuật, bỏ lời hứa tăng trưởng và social sign-off không phù hợp website.
4. Skill Sites có sẵn: áp dụng hướng dẫn presentation-led, local preview, responsive và kiểm chứng. Theo yêu cầu của người dùng, chuẩn bị source/GitHub Pages thay vì đăng ký hosting Sites.

## Kết quả tra UI/UX

Truy vấn đầu `education technology content library` trả về font phù hợp trẻ em, không phù hợp độc giả trưởng thành của ClueTek, nên không dùng. Thu hẹp thành `technology editorial magazine` trả về Swiss Modernism 2.0 và bố cục storytelling. Dùng hệ lưới và thứ bậc nội dung, giữ nhận diện navy/cyan gốc thay vì palette tạp chí chung. Tra riêng `keyboard focus modal` để xác nhận focus hiển thị và không bị che.

Không dùng chuyển động cuộn bắt buộc: câu chuyện và nội dung luôn đọc được ở trạng thái tĩnh.

## Hệ thiết kế đã chốt

| Vai trò | Giá trị |
| --- | --- |
| Nền thương hiệu | `#081426` |
| Nền sâu | `#06101e` |
| Bề mặt nội dung | `#0c1c30` |
| Cyan nhận diện | `#19d9f4` |
| Chữ sáng | `#f3f7ff` |
| Chữ phụ | `#a6b5c8` |
| Heading | Space Grotesk, Manrope fallback |
| Body | Manrope |
| Khổ desktop | Tối đa 1240px |

Hình kính lúp/circuit ở hero được vẽ bằng SVG theo biểu tượng thương hiệu có sẵn. Trình bày như một thiết bị để quan sát bên trong công nghệ. SVG nhẹ, hiển thị sắc nét và không phụ thuộc dịch vụ ảnh bên ngoài. Infographic và video trong bài là tài sản ClueTek đã có.

## Bố cục

```text
Header: logo / khám phá / video / ClueLab / câu chuyện / tìm kiếm / ngôn ngữ
Hero: lời hứa cụ thể + CTA thư viện | kính lúp/circuit tương tác
Ba đặc điểm nội dung
Hệ sinh thái: đọc / xem / thử
Thư viện: bộ lọc + tìm kiếm + bài đọc + lưu bài
Shorts: video thật + nhãn bản xem trước
ClueLab: phép đổi đơn vị | hai kết nối mạng
Câu chuyện: từ câu hỏi Wi-Fi đến cách giải thích công nghệ
Lộ trình: AI và lịch sử, ghi rõ chưa ra mắt
CTA khám phá + footer + cách biên tập/quyền riêng tư
```

Trang bài đọc: tiêu đề lớn, nội dung có nguồn, hình giải thích thật, video nếu có, lưu/chia sẻ và bài cùng chủ đề. Hai ngôn ngữ dùng URL riêng để có thể chia sẻ và index.

## Điều chỉnh sau review trực quan

Thu nhỏ heading tiếng Việt trên màn hình hẹp để tránh một từ bị lẻ dòng. Chuyển các nhãn giao diện tự viết sang hai ngôn ngữ. Kiểm tra cả đường dẫn gốc và đường dẫn dưới repo GitHub Pages. Các infographic/video gốc vẫn có chữ tiếng Anh, được ghi rõ trong phần biên tập.

Không thêm testimonial, số người theo dõi, kết quả thị trường hoặc liên kết mạng xã hội ClueTek chưa có trong nguồn.
