// messenger.js — Facebook Send API + typing indicator + lấy tên khách
const GRAPH = "https://graph.facebook.com/v19.0";
const TOKEN = process.env.PAGE_ACCESS_TOKEN;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callSendApi(body) {
  if (!TOKEN) {
    console.warn("[messenger] Thiếu PAGE_ACCESS_TOKEN — bỏ qua gửi tin (chế độ local).");
    return;
  }
  try {
    const res = await fetch(`${GRAPH}/me/messages?access_token=${TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("[messenger] send error:", res.status, t);
    }
  } catch (err) {
    console.error("[messenger] fetch error:", err?.message || err);
  }
}

// Bật/tắt typing indicator
export async function sendTyping(senderId, on = true) {
  await callSendApi({
    recipient: { id: senderId },
    sender_action: on ? "typing_on" : "typing_off",
  });
}

// Đánh dấu đã xem
export async function markSeen(senderId) {
  await callSendApi({
    recipient: { id: senderId },
    sender_action: "mark_seen",
  });
}

// Gửi text
export async function sendMessage(senderId, text) {
  await callSendApi({
    recipient: { id: senderId },
    messaging_type: "RESPONSE",
    message: { text },
  });
}

/**
 * Trả lời "như người thật": mark seen → typing_on → delay ngẫu nhiên → gửi → typing_off
 */
export async function sendHumanReply(senderId, text) {
  await markSeen(senderId);
  await sendTyping(senderId, true);
  await sleep(Math.random() * 1000 + 1000); // 1.0 – 2.0s
  await sendMessage(senderId, text);
  await sendTyping(senderId, false);
}

// Lấy tên khách để báo cáo (nếu quyền cho phép)
export async function getUserName(senderId) {
  if (!TOKEN) return null;
  try {
    const res = await fetch(
      `${GRAPH}/${senderId}?fields=first_name,last_name&access_token=${TOKEN}`
    );
    if (!res.ok) return null;
    const d = await res.json();
    return [d.first_name, d.last_name].filter(Boolean).join(" ") || null;
  } catch {
    return null;
  }
}
