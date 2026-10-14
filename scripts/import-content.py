"""One-time editorial import. Build/deploy uses the checked-in JSON and assets."""
from pathlib import Path
import csv, json, re, shutil
from PIL import Image

SITE = Path(__file__).resolve().parents[1]
ROOT = SITE.parent
META = [
 ('wifi-vs-internet','networking','wifi','Full Wi-Fi bars. Still offline.','Wi-Fi đầy vạch. Vẫn mất mạng.','A strong signal and internet access are two different things.','Tín hiệu mạnh và truy cập Internet là hai chuyện riêng.'),
 ('sync-vs-backup','safety','shield','Your files are synced. Can you recover them?','Tệp đã đồng bộ. Có khôi phục được không?','A deletion can sync, too. See what recovery really means.','Thao tác xóa cũng có thể đồng bộ. Hãy hiểu khả năng khôi phục.'),
 ('bits-and-bytes','safety','layers','100 Mbps. Why only 12.5 MB/s?','100 Mbps. Vì sao chỉ 12,5 MB/s?','One little letter changes the unit behind your download.','Một chữ cái nhỏ làm thay đổi đơn vị đo tốc độ tải.'),
 ('your-home-network','networking','router','One box. Several different jobs.','Một chiếc hộp. Nhiều chức năng.','Meet the modem, ONT, router and Wi-Fi access point.','Phân biệt modem, ONT, router và điểm truy cập Wi-Fi.'),
 ('wifi-frequency-bands','networking','signal','The next room changes your Wi-Fi.','Sang phòng khác, Wi-Fi cũng khác.','Distance and walls help explain the 2.4 GHz / 5 GHz trade-off.','Khoảng cách và tường giúp giải thích khác biệt 2,4 GHz và 5 GHz.'),
 ('usb-c-capabilities','hardware','chip','Same plug. Different jobs.','Cùng đầu cắm. Khác khả năng.','The USB-C shape doesn’t tell you everything a cable can do.','Hình dạng USB-C chưa nói hết những gì cáp có thể làm.'),
 ('oled-pixels','hardware','chip','Black begins with a pixel switching off.','Màu đen từ một điểm ảnh tắt.','OLED pixels make their own light. That changes the picture.','Điểm ảnh OLED tự phát sáng. Điều đó tạo nên khác biệt.'),
 ('gps-signals','hardware','globe','GPS listens to space.','GPS lắng nghe từ không gian.','Your receiver finds its position from satellite broadcasts.','Thiết bị xác định vị trí từ tín hiệu vệ tinh phát xuống.'),
 ('ssd-garbage-collection','hardware','layers','Your SSD rearranges the shelves.','SSD sắp xếp lại những ngăn dữ liệu.','Inside the moving, erasing and rewriting of flash storage.','Khám phá quá trình di chuyển, xóa và ghi trong bộ nhớ flash.'),
 ('qr-error-correction','hardware','chip','A damaged QR code can survive.','Mã QR bị hỏng vẫn có thể đọc được.','Extra information helps recover some missing data.','Thông tin bổ sung giúp khôi phục một phần dữ liệu thiếu.'),
 ('lidar-ranging','hardware','signal','LiDAR times a round trip.','LiDAR đo thời gian đi và về.','A pulse of light, a reflection and a distance calculation.','Một xung ánh sáng, một phản xạ và phép tính khoảng cách.'),
 ('capacitive-touch','hardware','phone','Glass can sense your finger.','Kính có thể nhận biết ngón tay.','A grid of electrodes detects a small electrical change.','Lưới điện cực phát hiện một thay đổi điện nhỏ.'),
 ('noise-cancellation','hardware','signal','Quiet can come from more sound.','Thêm âm thanh để giảm tiếng ồn.','Microphones and opposing signals help reduce background noise.','Micro và tín hiệu đối nghịch giúp giảm tiếng ồn nền.'),
 ('piezo-inkjet','hardware','chip','A tiny bend launches ink.','Một chuyển động nhỏ đẩy giọt mực.','A piezoelectric element helps eject a droplet in this printer design.','Phần tử áp điện giúp đẩy giọt mực trong thiết kế máy in này.'),
 ('e-ink-displays','hardware','book','This screen remembers its picture.','Màn hình này giữ được hình ảnh.','A bistable display can hold an image between updates.','Màn hình lưỡng ổn định giữ hình giữa các lần cập nhật.'),
 ('recursive-dns','networking','globe','Who finds the website’s address?','Ai tìm địa chỉ của trang web?','DNS turns a familiar name into information your device can use.','DNS chuyển tên quen thuộc thành thông tin thiết bị sử dụng được.'),
 ('tcp-reliability','networking','layers','Your download has a missing piece.','Tệp tải về thiếu một phần.','TCP tracks, acknowledges and retransmits data in an ordered stream.','TCP theo dõi, xác nhận và truyền lại dữ liệu theo thứ tự.'),
 ('udp-datagrams','networking','signal','Why a live call can skip a beat.','Vì sao cuộc gọi bị ngắt một nhịp.','UDP sends datagrams. Reliability can be added above it.','UDP gửi các datagram. Tầng bên trên có thể bổ sung độ tin cậy.'),
 ('https-trust','safety','shield','A secure connection can reach a scam.','Kết nối bảo mật vẫn có thể đến trang lừa đảo.','HTTPS protects a connection. It doesn’t vouch for a business.','HTTPS bảo vệ kết nối. Nó không bảo đảm uy tín doanh nghiệp.'),
 ('http-etag','networking','layers','The server can say: use your copy.','Máy chủ có thể nói: dùng bản bạn có.','An ETag helps a browser check whether a resource has changed.','ETag giúp trình duyệt kiểm tra tài nguyên đã thay đổi chưa.'),
 ('content-delivery-networks','networking','globe','Your video might come from nearby.','Video có thể đến từ máy chủ gần bạn.','A CDN can deliver cached content from a distributed network.','CDN có thể phân phối nội dung đã lưu từ mạng máy chủ phân tán.'),
 ('nat-port-mapping','networking','router','Many devices. One public address.','Nhiều thiết bị. Một địa chỉ công cộng.','Address-and-port mapping keeps different connections apart.','Ánh xạ địa chỉ và cổng giúp phân biệt các kết nối.'),
 ('dhcp-leases','networking','router','Your device borrows an address.','Thiết bị mượn một địa chỉ.','DHCP leases the configuration that helps a device join a network.','DHCP cấp thuê cấu hình giúp thiết bị tham gia mạng.'),
 ('vpn-trust','safety','shield','A VPN changes who carries your traffic.','VPN đổi bên vận chuyển lưu lượng.','An encrypted tunnel changes your network path and trust boundary.','Đường hầm mã hóa thay đổi đường đi và bên bạn cần tin cậy.'),
 ('packet-loss','networking','signal','A fast connection can still drop packets.','Kết nối nhanh vẫn có thể mất gói tin.','Throughput is only one part of a connection’s quality.','Thông lượng chỉ là một phần của chất lượng kết nối.'),
]
VI_BODY = [
 'Ở nhà, Wi-Fi kết nối điện thoại với mạng cục bộ, thường qua router. Truy cập Internet là một phần khác của kết nối.\n\nNếu đường Internet bị ngắt, điện thoại vẫn có thể nhận tín hiệu Wi-Fi mạnh nhưng trang web không tải được. Hãy hình dung hai liên kết: điện thoại đến router và mạng gia đình đến Internet. Một liên kết có thể hoạt động khi liên kết kia bị lỗi.\n\nBạn cũng có thể truy cập Internet qua dữ liệu di động hoặc Ethernet. Đây là một ví dụ, không phải chẩn đoán cho mọi lỗi kết nối.',
 'Đồng bộ giữ các tệp được chọn nhất quán giữa thiết bị hoặc vị trí. Điều đó có thể bao gồm cả thao tác xóa.\n\nVí dụ, xóa tệp trong thư mục OneDrive đã đồng bộ có thể xóa tệp ở cả máy tính và OneDrive. Bạn vẫn có thể khôi phục tệp từ thùng rác nếu tính năng đó còn áp dụng. Sao lưu tạo các bản sao để khôi phục khi có sự cố. Một số dịch vụ kết hợp cả hai.\n\nHãy dùng tệp thử không quan trọng để kiểm tra lịch sử phiên bản, khả năng khôi phục tệp đã xóa và thời hạn khôi phục. Bảo vệ bản sao quan trọng khỏi thay đổi trên tệp đang làm việc.',
 'Mbps là megabit mỗi giây. MB/s là megabyte mỗi giây. Một byte gồm 8 bit nên 100 Mbps tương đương 12,5 MB/s trước chi phí truyền dữ liệu.\n\nCon số nhỏ hơn xuất phát từ đơn vị lớn hơn. Tốc độ tải thực tế có thể thấp hơn do điều kiện Wi-Fi, chi phí giao thức hoặc máy chủ gửi tệp. Hãy kiểm tra đơn vị trước khi so sánh.',
 'Trong mạng gia đình thông thường, modem kết nối dịch vụ cáp hoặc DSL với nhà bạn. Kết nối cáp quang thường dùng thiết bị đầu cuối quang ONT.\n\nRouter chuyển dữ liệu giữa mạng nhà và mạng khác, bao gồm Internet. Điểm truy cập Wi-Fi kết nối thiết bị không dây với mạng cục bộ. Router Wi-Fi kết hợp chức năng router và điểm truy cập. Một số gateway của nhà cung cấp còn có modem hoặc ONT.\n\nXem model và thông số thiết bị để biết chiếc hộp của bạn đảm nhận chức năng nào.',
 '2,4 GHz và 5 GHz là các băng tần Wi-Fi. 5 GHz thường cho tốc độ cao hơn ở gần, nhưng tín hiệu thường giảm nhiều hơn khi qua tường hoặc đi xa. 2,4 GHz thường phủ xa hơn nhưng có thể đông thiết bị dùng chung.\n\nNếu thiết bị cho phép chọn, thử 5 GHz gần router và 2,4 GHz ở xa. So sánh ngay trong phòng bạn sử dụng. Một số router tự chọn băng tần. Tường, nhiễu và khả năng thiết bị vẫn ảnh hưởng kết quả.',
 'USB Type-C mô tả đầu nối. Hình dạng đó không tự xác định tốc độ USB, hỗ trợ Power Delivery hay khả năng truyền video qua Alternate Modes.\n\nHai cáp cùng đầu USB-C có thể hỗ trợ những tác vụ khác nhau. Hãy kiểm tra thông số của cáp và thiết bị để biết tốc độ dữ liệu, công suất sạc và chế độ được hỗ trợ.',
 'Điểm ảnh OLED tự phát sáng thay vì dùng đèn nền chung. Một điểm ảnh có thể tắt để thể hiện màu đen.\n\nCơ chế đó giải thích cách OLED tạo vùng đen bên cạnh vùng sáng. Trải nghiệm thực tế còn phụ thuộc màn hình, nội dung và môi trường xem.',
 'Vệ tinh GPS phát tín hiệu một chiều chứa thông tin vị trí và thời gian. Bộ thu dùng các tín hiệu để tính vị trí và thời gian của mình.\n\nThiết bị không cần gửi vị trí ngược lại vệ tinh để phép định vị GPS này hoạt động. Ứng dụng trên thiết bị vẫn có thể gửi dữ liệu qua một kết nối khác.',
 'Bộ nhớ NAND không ghi đè trực tiếp dữ liệu đã dùng theo cách đơn giản. SSD chuyển những trang dữ liệu còn hợp lệ rồi xóa cả khối để tái sử dụng.\n\nQuá trình này được gọi là garbage collection. TRIM giúp hệ điều hành thông báo dữ liệu nào không còn dùng. Hiệu quả còn phụ thuộc bộ điều khiển và trạng thái ổ đĩa.',
 'Mã QR dùng cơ chế sửa lỗi Reed–Solomon để khôi phục một lượng dữ liệu hỏng nhất định. Có bốn mức sửa lỗi với sự đánh đổi về dung lượng.\n\nKhả năng khôi phục có giới hạn. Tỷ lệ trong tài liệu nói đến codeword, không phải mọi vùng diện tích tùy ý bị che trên hình.',
 'LiDAR xung phát ánh sáng laser và đo thời gian ánh sáng phản xạ trở về. Thời gian đi và về giúp suy ra khoảng cách.\n\nNhiều phép đo tạo dữ liệu về bề mặt. Đây là cách mô tả LiDAR xung, không phải mọi thiết kế LiDAR đều sử dụng cùng một phương pháp.',
 'Cảm ứng điện dung dùng lưới điện cực để đo những thay đổi nhỏ về điện dung khi ngón tay ở gần.\n\nBộ điều khiển xử lý thay đổi giữa các điện cực để xác định vị trí chạm. Kính là bề mặt bạn chạm vào; cơ chế nhận biết nằm trong hệ thống cảm biến bên dưới.',
 'Chống ồn chủ động dùng micro và xử lý tín hiệu để tạo âm thanh đối nghịch với tiếng ồn. Cơ chế đặc biệt hữu ích với tiếng nền tương đối đều.\n\nKhả năng giảm ồn phụ thuộc hệ thống và loại âm thanh. Cách âm vật lý cũng góp phần; ANC không loại bỏ hoàn toàn mọi âm thanh.',
 'Trong công nghệ Micro Piezo của Epson, phần tử áp điện biến dạng khi có tác động điện. Chuyển động nhỏ giúp đẩy giọt mực ra khỏi vòi phun.\n\nĐây là một phương pháp in phun. Các máy in khác có thể dùng cơ chế khác để tạo và đẩy giọt mực.',
 'Màn hình E Ink lưỡng ổn định có thể giữ hình mà không cần cấp điện liên tục cho màn hình giữa các lần cập nhật.\n\nViệc cập nhật hình vẫn cần điện. Đèn chiếu trước và các thành phần khác của thiết bị cũng tiêu thụ điện, nên toàn bộ thiết bị không phải lúc nào cũng không dùng năng lượng.',
 'DNS đệ quy tìm câu trả lời cho tên miền bằng cách hỏi các máy chủ DNS khác hoặc dùng câu trả lời hợp lệ trong bộ nhớ đệm.\n\nThông tin đó giúp thiết bị tìm đến dịch vụ. Phân giải DNS và tải nội dung trang web là các bước riêng biệt.',
 'TCP cung cấp luồng byte theo thứ tự và đáng tin cậy bằng số thứ tự, xác nhận và truyền lại dữ liệu bị thiếu.\n\nNhờ đó ứng dụng có thể nhận các byte theo thứ tự. Kết nối vẫn có thể thất bại khi không thể phục hồi; TCP không bảo đảm mọi lần tải đều thành công.',
 'UDP gửi các datagram độc lập và không tự bảo đảm giao nhận, thứ tự hay truyền lại ở tầng truyền tải.\n\nỨng dụng hoặc giao thức bên trên có thể bổ sung các cơ chế tin cậy. Không nên kết luận mọi ứng dụng dùng UDP đều bỏ qua dữ liệu thiếu theo cùng một cách.',
 'HTTPS thể hiện một kênh kết nối được bảo vệ. Nó không xác nhận doanh nghiệp đáng tin cậy hay nội dung trang vô hại.\n\nMột trang lừa đảo vẫn có thể dùng HTTPS. Kiểm tra địa chỉ và bối cảnh của trang thay vì chỉ dựa vào dấu hiệu bảo mật kết nối.',
 'ETag nhận diện một phiên bản tài nguyên. Trình duyệt có thể gửi yêu cầu điều kiện If-None-Match để hỏi phiên bản đã thay đổi chưa.\n\nKhi phiên bản không đổi, máy chủ có thể trả về 304 mà không gửi lại phần nội dung. Trình duyệt tiếp tục dùng bản đang có nếu điều kiện bộ nhớ đệm phù hợp.',
 'CDN là mạng máy chủ phân tán theo địa lý, có thể lưu và phân phối nội dung gần người dùng. Điều đó giúp giảm nhu cầu lấy mọi nội dung trực tiếp từ máy chủ gốc.\n\nMáy chủ gốc vẫn cần thiết. Nội dung chưa được lưu có thể phải lấy từ máy chủ gốc. Máy chủ được chọn phụ thuộc đường mạng và định tuyến, không chỉ khoảng cách địa lý.',
 'PAT, còn gọi là NAT overload, ánh xạ địa chỉ và cổng của các luồng kết nối để nhiều thiết bị nội bộ dùng chung một địa chỉ IPv4 bên ngoài.\n\nÁnh xạ giúp phân biệt phản hồi thuộc kết nối nào. NAT không tương đương một chính sách tường lửa đầy đủ.',
 'DHCP tự động cấp thuê cấu hình mạng. Với quá trình cấp địa chỉ IPv4 ban đầu, thiết bị thường đi qua các bước Discover, Offer, Request và Acknowledgement.\n\nĐịa chỉ được cấp theo thời hạn thuê. Gia hạn có thể dùng trao đổi khác với lần cấp ban đầu.',
 'VPN mã hóa lưu lượng đến điểm cuối VPN và thay đổi đường mạng. Bạn chuyển một phần niềm tin sang bên vận hành VPN.\n\nVPN không làm bạn ẩn danh trong mọi tình huống hoặc loại bỏ mọi rủi ro. HTTPS có thể tiếp tục bảo vệ kết nối sau điểm cuối VPN.',
 'Mất gói tin nghĩa là một số gói gửi đi không đến đích. Thông lượng, độ trễ, jitter và mất gói đo các khía cạnh khác nhau của chất lượng mạng.\n\nMột kết quả đo tốc độ cao chưa đủ chứng minh cuộc gọi trực tiếp sẽ mượt. Ứng dụng và giao thức xử lý mất gói theo các cách khác nhau.',
]

assets = SITE/'public/assets'
items = []
rendered = json.loads((ROOT/'production/cluetek-100/batches/batch-01-render-status.json').read_text())
rendered = {d['post_id']: d for d in rendered}
for index, meta in enumerate(META, 1):
 slug, category, ico, title, title_vi, desc, desc_vi = meta
 pid = f'CT{index:03}'
 if index <= 5:
  folder = next((ROOT/'posts').glob(f'{pid}*'))
  raw = json.loads((folder/'content.json').read_text())
  body = (folder/'facebook.txt').read_text().strip()
  sources = [{'title':s['title'], 'url':s['url']} for s in raw['sources'] if 'Counting Characters' not in s['title']]
  images = [p for p in folder.glob('cluetek-*.png')]
 else:
  folder = ROOT/f'production/cluetek-100/posts/{pid}'
  raw = {}
  body = (folder/'facebook.txt').read_text().strip()
  st = (folder/'source.md').read_text()
  url = re.search(r'https?://\S+',st).group(0)
  sources = [{'title': url.split('/')[2].removeprefix('www.'), 'url':url}]
  images = []
 # Remove existing social sign-offs; retain actual explanatory paragraphs.
 paras = body.split('\n\n')
 if paras and ('explain next' in paras[-1] or 'your home' in paras[-1].lower() or 'weakest Wi-Fi' in paras[-1]): paras.pop()
 body='\n\n'.join(paras)
 image_paths=[]
 for n,p in enumerate(sorted(images)):
  name=f'{slug}-{n+1}.webp'
  img=Image.open(p).convert('RGB'); img.thumbnail((1300,1500)); img.save(assets/'images'/name,'WEBP',quality=87,method=6)
  image_paths.append('assets/images/'+name)
 reel = rendered.get(pid)
 video = None
 if reel:
  source=ROOT/f"production/cluetek-100/batches/01/{reel['id']}.mp4"
  shutil.copy2(source,assets/'videos'/source.name)
  poster=next(iter(sorted((source.parent).glob(f"{reel['id']}_*.png"))),None)
  if poster:
   img=Image.open(poster).convert('RGB'); img.thumbnail((540,960)); img.save(assets/'images'/f"{reel['id']}.webp",'WEBP',quality=86)
  video={'id':reel['id'],'src':f"assets/videos/{reel['id']}.mp4",'poster':f"assets/images/{reel['id']}.webp",'duration':round(reel['seconds']),'status':reel['status'],'language':'en','narration':'AI'}
 alt=raw.get('alt')
 if not alt and (folder/'alt-text.txt').exists(): alt=(folder/'alt-text.txt').read_text().strip()
 items.append({'id':pid,'slug':slug,'category':category,'icon':ico,'title':{'en':title,'vi':title_vi},'description':{'en':desc,'vi':desc_vi},'body':{'en':body,'vi':VI_BODY[index-1]},'sources':sources,'images':image_paths,'alt':alt or title,'video':video,'origin':str(folder.relative_to(ROOT)),'editorialStatus':'adapted-preview','minutes':max(1,round(len(body.split())/180))})

(SITE/'src/content.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
roadmap=list(csv.DictReader((ROOT/'production/cluetek-100/topic-ledger.tsv').open(),delimiter='\t'))
(SITE/'src/roadmap.json').write_text(json.dumps(roadmap,ensure_ascii=False,indent=2)+'\n')
for src,name in [(ROOT/'brand/cluetek/avatars/cluetek-avatar-with-name-navy-cyan.png','brand-avatar.webp'),(ROOT/'brand/cluetek/covers/cluetek-facebook-cover-navy-cyan-v2.png','brand-cover.webp')]:
 im=Image.open(src).convert('RGB'); im.thumbnail((1400,1400)); im.save(assets/'images'/name,'WEBP',quality=90)
print(f'Imported {len(items)} explanations, {sum(bool(i["video"]) for i in items)} films, and {len(roadmap)} roadmap topics.')
