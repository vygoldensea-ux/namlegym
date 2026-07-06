# Foxfit Chatbot — Gói thiết kế hệ thống

Chatbot AI hybrid cho **Foxfit — Boutique Wellness Club**, tối ưu để **không đốt credit Claude** khi chạy ads (Messenger + Zalo OA). Người vận hành tự vibe-code, không cần dev.

## Nội dung gói

| File | Là gì | Dùng để |
|---|---|---|
| `01_KIEN_TRUC_CHATBOT.md` | Tài liệu kiến trúc hybrid | Hiểu hệ thống, luồng xử lý, cách tiết kiệm credit, tích hợp Messenger/Zalo, roadmap |
| `02_BO_NAO_GYM.md` | Bộ não bản đọc cho người | Nội dung bot: giá, dịch vụ, lộ trình, FAQ, persona, câu mẫu. Sửa ở đây khi đổi giá/ưu đãi |
| `brain.json` | Bộ não bản máy | File bot nạp để tra câu trả lời |
| `03_prototype_chatbot.html` | Demo web chạy thử | Mở bằng trình duyệt, test trải nghiệm + xem % tiết kiệm credit |
| `README.md` | File này | Tổng quan |

## Ý tưởng cốt lõi

Bộ não trả lời trước (miễn phí) → chỉ gọi Claude khi câu khó/lạ (tốn credit). Mục tiêu 70–90% tin nhắn được trả miễn phí.

```
Khách nhắn → Tầng 0 chào hỏi → Tầng 1 tra bộ não (free)
          → Tầng 2 gọi Claude (chỉ khi cần) → Tầng 3 chốt / chuyển người thật
```

## Còn cần Hoàng điền

Các chỗ `【ĐIỀN】` trong `02_BO_NAO_GYM.md` và `brain.json`: địa chỉ, giờ mở cửa, hotline, fanpage. Giá và dịch vụ đã cập nhật theo bảng Foxfit thật.

## Trạng thái

- [x] Giai đoạn 1: Kiến trúc + Bộ não + Prototype (gói này)
- [ ] Giai đoạn 2: Lên Messenger
- [ ] Giai đoạn 3: Thêm Zalo OA
- [ ] Giai đoạn 4: Tối ưu credit + chốt sale
