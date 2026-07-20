# PHƯƠNG ÁN 2 — CACHE CÂU TRẢ LỜI (chốt 50 câu với chủ dự án, 21/07/2026)

Mục tiêu: câu hỏi lặp lại → trả từ kho, 0 token. Ngân sách mục tiêu $5-10/tháng, cảnh báo vượt $15/tháng.

## Kiến trúc luồng
Tin đến → **Tầng 0** (mẫu chào/giá/địa chỉ 0đ như hiện tại) → **CACHE** (mới) → **AI Haiku** (lưới cuối, giữ nguyên).
- Cache trả xong vẫn đi qua TOÀN BỘ guard `Chuan hoa Reply` (chống lặp, luật ảnh 1-lần, xưng hô).
- Log route=`cache` trong chat_history + đếm vào báo cáo sáng (số tin + tiền tiết kiệm).
- Delay giả 3-5s (node Wait, free) cho giống người gõ.
- Cache cũng nhảy vào luồng fallback: AI lỗi mà câu khớp kho → trả từ kho thay vì bắt khách chờ/nhắn lại.
- Bảng cache lỗi → retry cache 1 lần rồi mới sang AI.

## Phạm vi ĐƯỢC cache
- Chỉ dữ kiện cố định: giá, giờ, địa chỉ, quà, chính sách, dịch vụ, câu điều hướng "để SĐT quản lý tư vấn" (PT dài hạn).
- Tin đầu tiên của khách mới: CÓ (nơi lợi nhất khi chạy ads).
- Tin 2+: chỉ khi câu tự đứng được (không có "vậy/còn/thế/đó" tham chiếu ngữ cảnh).
- Câu ngắn 1-2 từ ("giá?", "ở đâu"): CÓ. Câu >12 từ: qua AI.
- Comment Facebook: dùng chung kho với inbox.
- Câu kèm ảnh: CÓ, luật ảnh 1-lần/hội-thoại vẫn kiểm.

## Phạm vi KHÔNG cache (luôn qua AI)
- Câu nhạy cảm (giới tính, khiếu nại, chê đắt, hoàn tiền), so sánh đối thủ, tiếng Anh.
- Câu chứa info cá nhân (SĐT/tên/bệnh/cân nặng). Câu trả lời gốc có tên riêng.
- Câu dính ngày giờ ("nay mở ko", "mai ghé", "chủ nhật").
- Nhiều câu hỏi trong 1 tin.
- Hot lead + khách đã chốt: 100% AI.
- Ping chăm khách: 100% AI (phải đọc lịch sử).
- Sender test (999*, 9tst*, nick Vy): KHÔNG ghi vào kho, KHÔNG học từ đó.

## Cách khớp (KHÔNG lặp lại thảm hoạ keyword)
- So NGUYÊN CÂU sau chuẩn hoá: bỏ dấu, thường hoá, bỏ từ đệm (ạ/ơi/nha/nhé/em/chị/dạ), bỏ emoji, quy đổi teencode theo bảng CỐ ĐỊNH (ko→khong, bn/nhiu→bao nhieu, dc→duoc, sdt→so dien thoai...).
- Khác 1 từ = qua AI. Không fuzzy, không keyword.
- Mỗi bản ghi = 1 câu hỏi gốc + N biến thể câu hỏi (đều exact-match) + 2-3 biến thể câu trả lời để xào khi khách hỏi lại (hết biến thể → AI).
- Gộp biến thể: máy KHÔNG tự quyết — bot đề xuất, CHỦ DUYỆT qua Telegram.

## Vòng đời kho
- Nguồn đáp án: câu bot đã trả sạch (qua guard) + chủ soạn/sửa; khởi động bằng cách đào lịch sử chat thật hiện có ("data xào").
- Câu mới chỉ SỐNG sau khi chủ duyệt qua Telegram. Nhịp duyệt: GOM TUẦN 1 LẦN (không spam).
- Xưng hô lưu {xh}, điền lúc gửi.
- Sống vô hạn; chủ dạy kiến thức mới/đổi giá → XOÁ TOÀN BỘ kho (an toàn tuyệt đối). K (chủ dạy) luôn thắng cache.
- Lệnh Telegram: "tắt cache" (về 100% AI ngay), "xoá cache", "xoá câu X".
- Kho tối đa 200 câu, đầy thì bỏ câu ít dùng nhất.
- Lưu: bảng Supabase `foxfit_answer_cache`.

## Nghiệm thu
- Test suite mở rộng thêm ~6 case cache (khớp đúng / lệch 1 từ phải qua AI / nhạy cảm / ngày giờ / xưng hô / lệnh xoá).
- Golive: bật ngay sau khi test pass. 3 ngày sạch lỗi mới đóng case.
- Báo cáo sáng thêm 1 dòng: số tin cache trả + tiền tiết kiệm.

## TRẠNG THÁI TRIỂN KHAI (21/07 ~03:00)
- ĐÃ CHẠY: bảng `foxfit_answer_cache` (21 câu active, chủ duyệt 21/07), luồng cache trong Za97w7TTm58atzFd: IF Spam → Load Cache → Match Cache → IF Cache Hit → (hit) Cho Cache 4 Giay → Chuan hoa Reply + Tang Hit Cache / (miss) IF Tang 1. Publish 11832ea2. Verify live: exec 973 hit (0 token, route=cache), exec 972 miss đúng luật.
- Chuẩn hoá khớp (PHẢI đồng bộ mọi nơi): bỏ dấu → teencode (ko/k/hong→khong, bn/nhiu→bao nhieu, dc→duoc, sdt→so dien thoai, ntn→nhu the nao, j→gi) → bỏ filler {oi,nha,nhe,a,em,e,c,minh,ban,voi,vay,ha,hen,ne}. CẤM đưa da/chi/do/the/tu vào filler (trùng đá/chỉ/đồ/tủ sau bỏ dấu).
- Công tắc tắt khẩn: chèn row question_norm='__tat_cache__' status=active → toàn bộ cache tắt (bot về 100% AI).
- CÒN THIẾU (làm tiếp): lệnh Telegram "tắt cache/xoá cache/xoá câu X" trong Gop Data Boss + tự xoá cache khi teach; 6 test case cache trong test suite; dòng cache vào báo cáo sáng; thêm biến thể "cho chi tham khao chi phi ben"; HỎI CHỦ GYM: HLV nam hay nữ (facts chưa có, bot đang tự nói "PT nữ").
