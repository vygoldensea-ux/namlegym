# Kiến trúc Chatbot AI cho Phòng Gym — Bản thiết kế hybrid tiết kiệm credit

> Mục tiêu: Chatbot trả lời khách (chạy ads Facebook + Zalo) mà **không đốt credit Claude**.
> Nguyên tắc cốt lõi: **Bộ não trả lời trước — Claude chỉ nghĩ khi thật sự cần.**

---

## 1. Vấn đề & lời giải một câu

Bạn chạy ads → lượng inbox lớn → nếu mỗi câu đều gọi API Claude thì rất hao credit, mà 80% câu hỏi lại là câu lặp đi lặp lại ("giá bao nhiêu", "mấy giờ mở cửa", "có PT không").

**Lời giải:** dựng một **"bộ não"** (knowledge base) chứa sẵn câu trả lời cho các câu hay gặp. Bot tra bộ não trước bằng logic rẻ tiền (miễn phí). Chỉ khi khách hỏi câu khó, câu lạ, cần "nói như người" thì mới gọi Claude — và khi gọi cũng chỉ đưa **đúng phần não liên quan** vào, không đưa cả cuốn sách.

Kết quả thực tế thường thấy: **70–90% tin nhắn được trả lời miễn phí**, chỉ 10–30% gọi API.

---

## 2. Sơ đồ luồng xử lý (đọc từ trên xuống)

```
Khách nhắn tin (Messenger / Zalo)
        │
        ▼
┌─────────────────────────────────────┐
│ TẦNG 0 — Chặn & phân loại (miễn phí) │
│ • Chào hỏi, cảm ơn, sticker → mẫu    │
│ • Spam / không liên quan → mẫu       │
└─────────────────────────────────────┘
        │ (không khớp)
        ▼
┌─────────────────────────────────────┐
│ TẦNG 1 — Tra BỘ NÃO (miễn phí)       │
│ • So khớp từ khoá + ý định (intent)  │
│ • VD: "giá", "học phí" → trả bảng giá│
│ • "mấy giờ" → giờ mở cửa             │
│ • Khớp chắc chắn → TRẢ LỜI NGAY      │
└─────────────────────────────────────┘
        │ (không khớp / khớp yếu / câu phức tạp)
        ▼
┌─────────────────────────────────────┐
│ TẦNG 2 — Gọi CLAUDE (tốn credit)     │
│ • Lấy 2–4 mẩu não liên quan nhất     │
│ • Ghép vào prompt + persona          │
│ • Claude soạn câu trả lời "như người"│
│ • Dùng Haiku cho câu thường,         │
│   Sonnet/Opus cho câu tư vấn sâu     │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ TẦNG 3 — Chốt & chuyển người thật    │
│ • Câu mua hàng / đặt lịch → gắn cờ   │
│ • Ngoài khả năng → "để tư vấn viên"  │
└─────────────────────────────────────┘
```

Điểm mấu chốt: **mỗi tầng phía trên đều chặn bớt lưu lượng trước khi tới tầng tốn tiền.** Càng nhiều câu bị chặn ở Tầng 0–1, càng ít credit.

---

## 3. Ba cách tiết kiệm credit (quan trọng nhất)

### 3.1. Không gọi API cho câu lặp
Câu hay gặp (giá, giờ, địa chỉ, có PT không, có tắm nước nóng không...) nằm sẵn trong não → trả bằng template. **0 credit.** Đây là phần tiết kiệm lớn nhất.

### 3.2. Chỉ đưa "đúng phần não liên quan" khi gọi Claude (RAG)
Khi buộc phải gọi Claude, **đừng nhét cả bộ não vào prompt.** Chỉ lấy 2–4 đoạn liên quan nhất tới câu hỏi rồi ghép vào. Prompt ngắn = ít token = rẻ hơn nhiều lần.

### 3.3. Chọn đúng "cỡ não" Claude
| Loại câu | Model đề xuất | Lý do |
|---|---|---|
| Câu thường, viết lại cho mượt | **Claude Haiku** | Rẻ nhất, đủ nhanh |
| Tư vấn lộ trình tập, xử lý phản đối giá, câu tế nhị | **Claude Sonnet** | Cân bằng chất lượng/giá |
| Ca khó, khách khó tính, cần thuyết phục | **Claude Opus** | Chỉ dùng khi cần |

Mẹo thêm: **cache câu trả lời**. Nếu 10 khách hỏi y hệt một câu khó, gọi Claude 1 lần rồi lưu lại câu trả lời, 9 lần sau trả từ cache.

---

## 4. "Bộ não" gồm những gì?

Bộ não là một file dữ liệu có cấu trúc (xem `brain.json` và `02_BO_NAO_GYM.md`). Gồm các khối:

1. **Thông tin cơ bản** — tên phòng, địa chỉ, giờ mở cửa, hotline, tiện ích.
2. **Bảng giá & gói tập** — từng gói, giá, ưu đãi, điều khoản.
3. **Lộ trình tập mẫu** — giảm cân, tăng cơ, người mới, nữ giới eo dáng... (để bot tư vấn).
4. **FAQ** — câu hỏi thường gặp + câu trả lời chuẩn.
5. **Persona & giọng nói** — bot xưng hô thế nào, thân thiện tới đâu, câu chốt sale.
6. **Câu trả lời mẫu ("giọng người")** — để Claude học phong cách, trả lời tự nhiên chứ không như máy.
7. **Luật chuyển người thật** — khi nào ngừng bot, gọi nhân viên.

Ưu điểm: khi đổi giá hay thêm ưu đãi, **bạn chỉ sửa bộ não, không đụng tới code.**

---

## 5. Tích hợp Messenger + Zalo OA (cho người vibe-code)

Bạn tự vận hành, không có dev, nên chọn đường **ít code — nhiều kéo thả**. Có 2 hướng:

### Hướng A — Nền tảng chatbot có sẵn (khuyên dùng để bắt đầu)
Dùng công cụ builder kéo-thả, chúng lo sẵn phần kết nối Messenger/Zalo, bạn chỉ nạp bộ não + nối API Claude ở bước "câu khó".

| Kênh | Công cụ phổ biến ở VN | Ghi chú |
|---|---|---|
| Facebook Messenger | ManyChat, Chatfuel, Botpress | ManyChat mạnh về kịch bản + nút bấm, dễ làm |
| Zalo OA | Zalo OA + middleware (n8n/Make), hoặc nền tảng nội địa (Bot Bán Hàng, Fchat, Ahachat) | Nhiều nền tảng VN hỗ trợ cả Zalo lẫn FB một chỗ |

Cách nối Claude vào các công cụ này: dùng khối **"HTTP request / Webhook"** để gọi tới một endpoint nhỏ do bạn dựng (Hướng B) hoặc gọi thẳng API Claude nếu công cụ cho phép.

### Hướng B — Tự dựng một "bộ não trung gian" (vibe-code)
Một server nhỏ (bạn hoàn toàn có thể vibe-code bằng Node.js hoặc Python) làm nhiệm vụ:

```
Webhook Messenger ──┐
                    ├──►  SERVER BỘ NÃO  ──►  (Tầng 0-1 trả ngay)
Webhook Zalo OA ────┘         │
                              └──► gọi API Claude (Tầng 2, khi cần)
```

Server này chính là nơi chứa toàn bộ logic ở Mục 2. Cả Messenger lẫn Zalo đều trỏ webhook về đây → **một bộ não dùng chung cho cả 2 kênh**, không phải làm 2 lần.

Gợi ý stack dễ vibe-code:
- **Ngôn ngữ:** Node.js (Express) hoặc Python (FastAPI).
- **Nơi chạy:** Render, Railway, hoặc Vercel (miễn phí/rẻ lúc đầu).
- **Tra não:** lúc đầu dùng so khớp từ khoá đơn giản (đủ tốt). Khi cần thông minh hơn thì thêm embeddings để tìm theo ngữ nghĩa.
- **Kết nối:** Facebook Graph API (Messenger) + Zalo OA API. Cả hai đều gửi/nhận tin qua webhook.

> Lưu ý thực tế về Zalo: Zalo OA có quy định về "cửa sổ nhắn tin" (thời gian được chủ động nhắn lại khách) và cần OA đã xác thực. Nên kiểm tra chính sách Zalo OA mới nhất trước khi lên sóng.

---

## 6. Roadmap triển khai (thực tế cho 1 người)

**Giai đoạn 1 — Bộ não + Prototype (đang làm trong dự án này)**
Hoàn thiện nội dung não, test trải nghiệm bằng bản demo web. Chưa cần nối kênh thật.

**Giai đoạn 2 — Lên Messenger trước**
Messenger dễ tích hợp hơn Zalo. Nối bot vào 1 fanpage test, dùng bộ não, bật Claude cho câu khó. Chạy nội bộ 3–5 ngày, đọc log xem câu nào bot đáp sai.

**Giai đoạn 3 — Thêm Zalo OA**
Trỏ thêm webhook Zalo về cùng server. Kiểm tra chính sách OA.

**Giai đoạn 4 — Tối ưu credit & chốt sale**
Xem thống kê: bao nhiêu % câu gọi API. Chuyển các câu API hay lặp thành template trong não. Thêm luật chuyển người thật cho câu sắp chốt.

**Giai đoạn 5 — Học liên tục**
Mỗi tuần đọc các câu bot phải "bó tay" → bổ sung vào não → bot ngày càng ít gọi API.

---

## 7. Ước tính chi phí (khung tư duy, không phải báo giá)

Credit tiêu tốn ≈ **(số tin nhắn) × (tỷ lệ phải gọi API) × (giá mỗi lần gọi)**.

Ba đòn bẩy để giảm:
1. **Giảm tỷ lệ gọi API** → bộ não càng đầy càng tốt (Mục 3.1).
2. **Giảm giá mỗi lần gọi** → prompt ngắn (RAG) + model rẻ (Haiku) (Mục 3.2–3.3).
3. **Cache** câu khó lặp lại.

Ví dụ minh hoạ: 1.000 tin/ngày, nếu bộ não chặn được 80% → chỉ 200 lần gọi API/ngày, phần lớn bằng Haiku với prompt ngắn → chi phí nhỏ hơn rất nhiều so với gọi 1.000 lần Opus.

---

## 8. Việc cần bạn (Hoàng) chuẩn bị

Để mình xây bộ não sát thực tế phòng gym của bạn, cần các thông tin sau (mình đã tạo sẵn chỗ điền trong `02_BO_NAO_GYM.md`):
- Tên phòng, địa chỉ, giờ mở cửa, hotline.
- Bảng giá đầy đủ các gói + ưu đãi hiện tại.
- Có PT không, giá PT, các dịch vụ kèm (tắm, tủ đồ, nước...).
- Giọng bot muốn: thân thiện xưng "shop/em/mình"? Có được xưng tên phòng không?
- Vài câu khách hay hỏi nhất mà bạn nhớ.

---

*File liên quan: `02_BO_NAO_GYM.md` (bộ não bản đọc), `brain.json` (bộ não bản máy), `03_prototype_chatbot.html` (demo chạy thử).*
