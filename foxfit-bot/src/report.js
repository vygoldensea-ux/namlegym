// report.js — Conversation tracking (in-memory Map) + daily report cron
import cron from "node-cron";
import { notifyHotLead, sendDailyReport } from "./telegram.js";

// key = sender_id
export const conversations = new Map();

// Token dùng trong ngày (reset sau báo cáo)
let dailyTokens = 0;
export function addTokens(n = 0) {
  dailyTokens += n || 0;
}

const HOT_STATES = new Set(["hot_lead", "converted"]);
// Thứ tự ưu tiên trạng thái — không "tụt hạng" khách đã nóng
const RANK = { new: 0, not_interested: 1, interested: 2, hot_lead: 3, converted: 4 };

export function getConversation(senderId, name = null) {
  let c = conversations.get(senderId);
  if (!c) {
    c = {
      sender_id: senderId,
      name: name || null,
      messages: [],
      status: "new",
      last_active: new Date(),
      summary: "",
      notifiedHot: false,
    };
    conversations.set(senderId, c);
  }
  if (name && !c.name) c.name = name;
  return c;
}

export function addMessage(convo, role, content) {
  convo.messages.push({ role, content, timestamp: new Date() });
  if (convo.messages.length > 10) convo.messages = convo.messages.slice(-10);
  convo.last_active = new Date();
}

/**
 * Cập nhật status. Chỉ nâng hạng, không hạ (trừ not_interested rõ ràng).
 * Nếu chuyển sang hot_lead/converted lần đầu → báo Telegram ngay.
 */
export async function updateStatus(convo, hint) {
  if (!hint) return;
  const cur = RANK[convo.status] ?? 0;
  const next = RANK[hint] ?? 0;

  // not_interested chỉ set nếu khách chưa từng quan tâm
  if (hint === "not_interested" && cur >= RANK.interested) return;

  if (next >= cur || hint === "not_interested") {
    convo.status = hint;
  }

  // Tóm tắt nhanh cho báo cáo: câu hỏi gần nhất của khách
  const lastUser = convo.messages.filter((m) => m.role === "user").slice(-1)[0];
  if (lastUser) convo.summary = lastUser.content.slice(0, 60);

  if (HOT_STATES.has(convo.status) && !convo.notifiedHot) {
    convo.notifiedHot = true;
    await notifyHotLead(convo);
  }
}

export function buildStats() {
  const all = [...conversations.values()];
  const count = (s) => all.filter((c) => c.status === s).length;
  return {
    total: all.length,
    hot_leads: count("hot_lead"),
    converted: count("converted"),
    interested: count("interested"),
    not_interested: count("not_interested"),
    tokens: dailyTokens,
    details: all
      .sort((a, b) => (RANK[b.status] ?? 0) - (RANK[a.status] ?? 0))
      .map((c) => ({
        name: c.name || c.sender_id,
        status: c.status,
        summary: c.summary || "—",
      })),
  };
}

// Chạy báo cáo cuối ngày rồi reset bộ đếm token (giữ conversations)
export async function runDailyReport() {
  const stats = buildStats();
  await sendDailyReport(stats);
  dailyTokens = 0;
}

// Cron 21:00 giờ VN mỗi ngày
export function scheduleDailyReport() {
  cron.schedule(
    "0 21 * * *",
    () => {
      console.log("[report] Chạy báo cáo cuối ngày 21:00 VN");
      runDailyReport().catch((e) => console.error("[report] error:", e));
    },
    { timezone: "Asia/Ho_Chi_Minh" }
  );
  console.log("[report] Đã hẹn báo cáo cuối ngày lúc 21:00 (Asia/Ho_Chi_Minh)");
}
