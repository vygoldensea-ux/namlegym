# 🦊 Foxfit Bot — Chatbot AI cho FB Messenger + báo cáo Telegram

Chatbot AI hybrid cho **Foxfit — Boutique Wellness Club**. Trả lời khách trên **Facebook Messenger**, tiết kiệm credit bằng logic **3 tầng** (chỉ gọi Claude khi câu khó), và **báo cáo tự động về Telegram** (lead nóng realtime + tổng kết cuối ngày 21:00).

## Kiến trúc 3 tầng

| Tầng | Xử lý | Token |
|---|---|---|
| **0** | Chào hỏi, cảm ơn, sticker, tin rỗng → template | 0 |
| **1** | Khớp FAQ trong `brain.json` (confidence ≥ 0.7) → trả thẳng | 0 |
| **2** | Câu khó/lạ → gọi Claude. Có keyword phức tạp → `sonnet`, còn lại → `haiku` | tốn |

Handoff (chuyển khoản, lấy gói...) → trả lời chuyển tư vấn viên + báo Telegram ngay.

## Cấu trúc

```
foxfit-bot/
├── src/
│   ├── index.js        # Express + webhook + orchestration
│   ├── brain.js        # Load brain.json + FAQ matching + tầng 0
│   ├── classifier.js   # Logic 3 tầng + phân loại độ phức tạp
│   ├── claude.js       # Gọi Claude API + build context (RAG)
│   ├── messenger.js    # FB Send API + typing indicator
│   ├── telegram.js     # Báo cáo Telegram
│   └── report.js       # Tracking (Map) + cron 21:00
├── data/brain.json     # Knowledge base Foxfit
├── .env.example
├── package.json
└── README.md
```

---

## Chạy local

```bash
cd foxfit-bot
npm install
cp .env.example .env   # rồi điền các key
npm start
```

Server chạy ở `http://localhost:3000`. Kiểm tra: mở `http://localhost:3000` thấy "🦊 Foxfit bot is running".
Xem thống kê: `http://localhost:3000/stats`. Bắn thử báo cáo Telegram: `http://localhost:3000/report/now`.

> Nếu chưa điền `PAGE_ACCESS_TOKEN` / Telegram, bot vẫn chạy được và **in ra console** thay vì gửi — tiện test logic trước.

---

## 1. Tạo FB App + lấy PAGE_ACCESS_TOKEN

1. Vào https://developers.facebook.com → **My Apps → Create App** → loại **Business**.
2. Trong app, thêm sản phẩm **Messenger**.
3. Ở **Messenger → Settings → Access Tokens**: chọn (hoặc tạo) **Facebook Page** của Foxfit → bấm **Generate Token** → copy vào `PAGE_ACCESS_TOKEN`.
4. **App Secret**: Settings → Basic → **App Secret** → copy vào `APP_SECRET`.
5. `VERIFY_TOKEN`: tự đặt một chuỗi bất kỳ (vd `foxfit_verify_2026`), sẽ dùng ở bước webhook.

## 2. Set Webhook trên Meta Developer

1. Deploy server trước (mục 4) để có URL công khai, vd `https://foxfit-bot.up.railway.app`.
2. Messenger → Settings → **Webhooks → Add Callback URL**:
   - **Callback URL**: `https://<domain>/webhook`
   - **Verify Token**: đúng chuỗi `VERIFY_TOKEN` ở trên.
3. Bấm **Verify and Save** (server phải đang chạy để nhận request verify).
4. **Subscribe** Page vào các field: `messages`, `messaging_postbacks`.

## 3. Lấy Telegram BOT_TOKEN + CHAT_ID

1. Nhắn **@BotFather** trên Telegram → `/newbot` → đặt tên → nhận `TELEGRAM_BOT_TOKEN`.
2. Tạo group (hoặc nhắn thẳng bot) rồi gửi 1 tin bất kỳ cho bot.
3. Lấy CHAT_ID: mở
   `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates`
   → tìm `"chat":{"id": ...}` → copy vào `TELEGRAM_CHAT_ID`.
   (Group thường có id âm, vd `-1001234567890` — copy nguyên dấu trừ.)

## 4. Deploy lên Railway

1. Push code lên GitHub (repo chứa thư mục `foxfit-bot`).
2. Vào https://railway.app → **New Project → Deploy from GitHub repo** → chọn repo.
3. Nếu code nằm trong thư mục con, đặt **Root Directory** = `foxfit-bot`.
4. Tab **Variables** → thêm toàn bộ biến trong `.env.example` (điền giá trị thật).
5. Railway tự chạy `npm install` + `npm start`. Sau khi deploy, vào **Settings → Networking → Generate Domain** để có URL công khai.
6. Dùng URL đó ở **bước 2** để set webhook FB.

> `TZ=Asia/Ho_Chi_Minh` đảm bảo cron 21:00 chạy đúng giờ VN. Cron cũng đã khai báo timezone trong code nên chạy đúng dù server ở múi giờ khác.

## 5. Test webhook bằng curl

Verify (giả lập FB):
```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=foxfit_verify_2026&hub.challenge=12345"
# → in ra: 12345
```

Giả lập một tin nhắn khách (bỏ qua verify chữ ký khi chưa set APP_SECRET):
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"object":"page","entry":[{"messaging":[{"sender":{"id":"USER_TEST"},"message":{"text":"giá bao nhiêu vậy shop"}}]}]}'
# Xem log server: tier 1/faq (0 token)
```

Thử câu phức tạp (gọi Claude — cần ANTHROPIC_API_KEY):
```bash
curl -X POST http://localhost:3000/webhook -H "Content-Type: application/json" \
  -d '{"object":"page","entry":[{"messaging":[{"sender":{"id":"USER_TEST"},"message":{"text":"em muốn giảm 5kg thì nên tập lộ trình sao"}}]}]}'
# Log: tier 2/claude (complex)
```

---

## Ghi chú model

`.env` mặc định `MODEL_SIMPLE=claude-haiku-4-5`, `MODEL_COMPLEX=claude-sonnet-4-6` theo spec. Nếu Anthropic trả lỗi tên model, chỉnh lại thành tên model hợp lệ hiện hành trong tài khoản của bạn (chỉ sửa biến env, không đụng code).

## Việc còn cần điền

Các chỗ `【ĐIỀN】` trong `data/brain.json`: **địa chỉ, giờ mở cửa, hotline, fanpage**. Bot được dặn không bịa — nếu chưa điền, gặp câu hỏi liên quan nó sẽ mời khách để lại SĐT.
