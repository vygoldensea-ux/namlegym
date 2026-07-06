// index.js — Express server + FB Messenger webhook + orchestration 3 tầng
import express from "express";
import crypto from "crypto";

import { classify } from "./classifier.js";
import { handoffMessage } from "./brain.js";
import { askClaude } from "./claude.js";
import { sendHumanReply, getUserName } from "./messenger.js";
import {
  getConversation,
  addMessage,
  updateStatus,
  addTokens,
  scheduleDailyReport,
  runDailyReport,
  buildStats,
} from "./report.js";

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "foxfit_verify_2026";
const APP_SECRET = process.env.APP_SECRET;

// Giữ raw body để verify chữ ký X-Hub-Signature-256
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

function verifySignature(req) {
  if (!APP_SECRET) return true; // bỏ qua nếu chưa cấu hình (local/dev)
  const sig = req.get("x-hub-signature-256");
  if (!sig || !req.rawBody) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", APP_SECRET).update(req.rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ---- Health check ----
app.get("/", (_req, res) => res.send("🦊 Foxfit bot is running"));

// ---- Webhook verify (GET) ----
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[webhook] verified ✅");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ---- Nhận tin nhắn (POST) ----
app.post("/webhook", (req, res) => {
  if (!verifySignature(req)) {
    console.warn("[webhook] chữ ký không hợp lệ");
    return res.sendStatus(403);
  }
  const body = req.body;
  if (body.object !== "page") return res.sendStatus(404);

  // Trả 200 ngay để FB không retry; xử lý bất đồng bộ
  res.status(200).send("EVENT_RECEIVED");

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      const senderId = event.sender?.id;
      if (!senderId) continue;

      // Text
      if (event.message?.text) {
        handleMessage(senderId, event.message.text).catch((e) =>
          console.error("[handleMessage] error:", e)
        );
      }
      // Sticker / attachment (không có text)
      else if (event.message?.attachments) {
        handleMessage(senderId, "👍").catch((e) => console.error(e));
      }
    }
  }
});

// ---- Orchestration 3 tầng ----
export async function handleMessage(senderId, text) {
  const name = (await getUserName(senderId)) || null;
  const convo = getConversation(senderId, name);
  addMessage(convo, "user", text);

  const result = classify(text);
  let reply;

  if (result.source === "handoff") {
    reply = handoffMessage;
  } else if (result.tokenFree && result.answer) {
    // Tầng 0 hoặc Tầng 1 — 0 token
    reply = result.answer;
  } else {
    // Tầng 2 — gọi Claude
    const history = convo.messages.slice(0, -1); // trừ tin vừa thêm
    const out = await askClaude(text, history, result.model);
    reply = out.text;
    addTokens(out.usage.total);
  }

  addMessage(convo, "assistant", reply);
  await updateStatus(convo, result.statusHint);

  console.log(
    `[msg] ${name || senderId} | tier ${result.tier}/${result.source}` +
      `${result.model ? " (" + result.model + ")" : ""} | status=${convo.status}`
  );

  await sendHumanReply(senderId, reply);
}

// ---- Endpoint tiện ích để test báo cáo thủ công ----
app.get("/report/now", async (_req, res) => {
  await runDailyReport();
  res.json({ ok: true, message: "Đã gửi báo cáo test về Telegram" });
});
app.get("/stats", (_req, res) => res.json(buildStats()));

// ---- Khởi động ----
app.listen(PORT, () => {
  console.log(`🦊 Foxfit bot chạy tại cổng ${PORT}`);
  scheduleDailyReport();
});
