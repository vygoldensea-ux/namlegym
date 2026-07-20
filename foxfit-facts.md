# FOXFIT — SỰ THẬT CỐ ĐỊNH (NGUỒN CHUẨN DUY NHẤT)

> **QUY TRÌNH BẮT BUỘC**: mọi thay đổi giá/quà/địa chỉ/giờ/hotline phải sửa file này TRƯỚC,
> rồi đồng bộ vào TẤT CẢ các nơi liệt kê ở cuối file trong CÙNG 1 lần cập nhật.
> Không bao giờ sửa lẻ 1 nơi. (Bài học: 20/07 từng xoá nhầm địa chỉ khỏi prompt comment.)

## Bảng giá khai trương (24/07/2026 – 03/08/2026)

| Gói | Giá gốc | Giảm | Giá sau giảm | Quà tặng DUY NHẤT |
|---|---|---|---|---|
| 1 tháng | 600k | 10% | **540k** | 2 buổi PT 1:1 (không gồm giãn cơ) + khăn giới hạn (top 10 khách đăng ký sớm nhất) |
| 3 tháng | 1.450k | 15% | **1.233k** | 1 buổi PT 1:1 (không gồm giãn cơ) + hướng dẫn sử dụng máy |
| 6 tháng | 2.200k | 20% | **1.760k** | 1 buổi tập miễn phí — KHÔNG PT, KHÔNG hướng dẫn máy |
| 12 tháng | 3.800k | 20% | **3.040k** | 2 tháng tập miễn phí + khăn + sauna miễn phí |
| 18 tháng | 5.500k | giữ nguyên | **5.500k** | 3 tháng tập miễn phí |
| 24 tháng | 6.500k | giữ nguyên | **6.500k** | 4 tháng tập miễn phí |
| 36 tháng | 9.500k | giữ nguyên | **9.500k** | 6 tháng tập miễn phí |

- Quà mỗi gói là RIÊNG BIỆT — cấm trộn/ghép giữa các gói.
- Các gói KHÔNG tăng quà đều theo thời hạn (gói 6 tháng không có PT dù gói 1/3 tháng có) — mọi câu khái quát "gói càng dài tặng càng nhiều / mỗi gói đều có PT" là SAI.

## PT
- PT 1:1 buổi lẻ: **500k/buổi, CÓ giãn cơ** (chỉ buổi trả phí này có giãn cơ; PT tặng kèm gói KHÔNG giãn cơ).
- Gói PT dài hạn (nhiều buổi): KHÔNG báo giá qua chat — mời gặp quản lý. Không nhận PT ngoài.

## Thông tin cơ sở
- **Địa chỉ**: 43 Lê Phụng Hiếu, P. Tam Thắng, TP. Hồ Chí Minh — map: https://maps.app.goo.gl/kpRJWSRDCtZL9iSVA
- **Giờ mở cửa**: 5h30 – 20h30. Chủ Nhật NGHỈ (bảo trì + vệ sinh).
- **Hotline/Zalo**: 058 675 7779
- **Đặc thù**: gym CHUYÊN NỮ (có kickboxing). Không nhận nam.

## NHỮNG NƠI PHẢI ĐỒNG BỘ KHI FILE NÀY THAY ĐỔI

Workflow n8n (hoangvt140399.app.n8n.cloud):

1. `Za97w7TTm58atzFd` "Foxfit AI Chatbot":
   - Node **Chuan bi Claude** — bảng giá + facts trong system prompt.
   - Node **Chuan hoa Reply** — `CANON_PRICES` + `GIFT_MAP` (code guard).
   - Node **Build Cmt AI** — bảng giá + facts trong prompt comment.
   - Node **Extract Cmt** — `GIFT_MAP` (code guard).
2. `2bWS3ugkh3cComfi` "Foxfit Ping Lai Khach":
   - Node **Build Ping AI** — bảng giá trong prompt ping.
3. Ảnh bảng giá / khuyến mãi (attachment_id trong bảng `foxfit_images` Supabase) — nếu số liệu đổi thì thay file ảnh + upload lấy attachment_id mới.

## Attachment ID ảnh hiện hành (bảng foxfit_images)
- banggia: 4965389120354278
- khuyenmai: 1308505501366208
- ngoaithat: 1049179444462826 (+ bộ ảnh tag ngoaithat, gửi tối đa 6 ảnh/lần)
