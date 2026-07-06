// telegram.js — Gửi báo cáo về Telegram (realtime lead nóng + báo cáo cuối ngày)
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function send(text) {
  if (!TOKEN || !CHAT_ID) {
    console.warn("[telegram] Thiếu TELEGRAM_BOT_TOKEN / CHAT_ID — in ra console thay vì gửi:\n" + text);
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) console.error("[telegram] error:", res.status, await res.text());
  } catch (err) {
    console.error("[telegram] fetch error:", err?.message || err);
  }
}

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function nowVN() {
  return new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

const STATUS_LABEL = {
  hot_lead: "Muốn đăng ký / tập thử",
  converted: "Đang chốt / lấy gói",
  interested: "Đang quan tâm",
  not_interested: "Không phù hợp",
  new: "Mới nhắn",
};

// Báo realtime khi có hot_lead hoặc converted
export async function notifyHotLead(convo) {
  const last = convo.messages.filter((m) => m.role === "user").slice(-1)[0];
  const text =
    `🔥 <b>LEAD NÓNG — Foxfit</b>\n\n` +
    `👤 Khách: ${esc(convo.name || convo.sender_id)}\n` +
    `📊 Trạng thái: ${STATUS_LABEL[convo.status] || convo.status}\n` +
    `💬 Tin nhắn: "${esc(last ? last.content : "")}"\n` +
    `🕐 Lúc: ${nowVN()}\n\n` +
    `→ Gọi lại ngay!`;
  await send(text);
}

// Báo cáo cuối ngày
export async function sendDailyReport(stats) {
  const date = new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const lines = stats.details
    .map((d) => `• ${esc(d.name)} — ${STATUS_LABEL[d.status] || d.status}: ${esc(d.summary)}`)
    .join("\n");

  const text =
    `📊 <b>BÁO CÁO NGÀY — Foxfit</b>\n` +
    `📅 ${date}\n\n` +
    `✅ Tổng hội thoại: ${stats.total}\n` +
    `🔥 Lead nóng: ${stats.hot_leads}\n` +
    `💰 Đã chốt: ${stats.converted}\n` +
    `👀 Quan tâm: ${stats.interested}\n` +
    `❌ Không phù hợp: ${stats.not_interested}\n\n` +
    `📝 <b>CHI TIẾT:</b>\n${lines || "— Chưa có hội thoại —"}\n\n` +
    `💡 Token đã dùng hôm nay: ~${stats.tokens.toLocaleString("vi-VN")}`;

  await send(text);
}

export { send as sendTelegramRaw };
