// brain.js — Load knowledge base + FAQ keyword matching (Tầng 1, 0 token)
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRAIN_PATH = join(__dirname, "..", "data", "brain.json");

export const brain = JSON.parse(readFileSync(BRAIN_PATH, "utf-8"));

// Chuẩn hoá tiếng Việt: bỏ dấu để so khớp rộng hơn
export function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // bỏ dấu
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function stripAccentsKeyword(k) {
  return normalize(k);
}

/**
 * So khớp FAQ theo keyword.
 * Trả { answer, intent, confidence } hoặc null nếu không đủ tự tin.
 * confidence = (tổng độ dài keyword khớp) / (độ dài keyword dài nhất của intent tốt nhất, min 1)
 * Ngưỡng gợi ý: >= 0.7 để trả thẳng.
 */
export function matchFAQ(text) {
  const t = normalize(text);
  if (!t) return null;

  let best = null;
  let bestScore = 0;
  let bestHitCount = 0;

  for (const f of brain.faq) {
    let score = 0;
    let hits = 0;
    for (const kw of f.keywords) {
      const nk = stripAccentsKeyword(kw);
      if (nk && t.includes(nk)) {
        score += nk.length;
        hits += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestHitCount = hits;
      best = f;
    }
  }

  if (!best || bestScore === 0) return null;

  // confidence: có keyword dài (>=4 ký tự) hoặc khớp >=2 keyword => tự tin cao
  const strongKeyword = bestScore >= 4;
  const multiKeyword = bestHitCount >= 2;
  const confidence = strongKeyword || multiKeyword ? Math.min(1, 0.7 + bestScore / 40) : 0.5;

  return {
    answer: best.answer,
    intent: best.intent,
    confidence,
    matchedKeywords: bestHitCount,
  };
}

// Ghép "bộ não liên quan" để đưa vào Claude (Tầng 2) — chỉ gửi phần cần, tiết kiệm token
export function buildBrainContext(text, maxItems = 5) {
  const t = normalize(text);
  const g = brain.gym;

  const facts = [
    `Tên: ${g.name} (${g.slogan}). Định vị: ${g.positioning}.`,
    `Địa chỉ: ${g.address}. Giờ mở cửa: ${g.hours}. Hotline: ${g.hotline}.`,
    `Điểm mạnh: ${g.highlights.join(", ")}.`,
    `Bảng giá: ` +
      brain.pricing
        .map(
          (p) =>
            `${p.goi} ${p.gia.toLocaleString("vi-VN")}đ${p.tang_them ? ` (tặng ${p.tang_them})` : ""}`
        )
        .join("; ") +
      `.`,
    `Quà đăng ký: ${brain.qua_dang_ky}.`,
    `Dịch vụ đặc biệt: ` +
      brain.services.map((s) => `${s.ten} — ${s.mo_ta}`).join("; ") +
      `.`,
    `Khu tập: ${brain.khu_tap.join(", ")}.`,
  ];

  // Thêm các FAQ liên quan nhất tới câu hỏi
  const relatedFaq = brain.faq
    .map((f) => {
      let score = 0;
      for (const kw of f.keywords) if (t.includes(normalize(kw))) score += kw.length;
      return { f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((x) => `Hỏi (${x.f.intent}) → ${x.f.answer}`);

  return [...facts, ...(relatedFaq.length ? ["Câu mẫu liên quan:", ...relatedFaq] : [])].join("\n");
}

// Tầng 0 — chào hỏi / cảm ơn / rỗng (0 token)
const GREETING = ["hi", "hello", "helo", "xin chao", "chao", "alo", "hey", "hallo"];
const THANKS = ["cam on", "thanks", "thank you", "thank", "cam nghia", "tks", "ty"];

export function tier0(text) {
  const raw = (text || "").trim();
  const t = normalize(raw);

  // Tin rỗng hoặc chỉ 1 emoji/ký tự
  const noWord = raw.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]/gu, "").length === 0;
  if (raw.length === 0 || (noWord && raw.length <= 4)) {
    return "Dạ anh/chị cần em hỗ trợ gì ạ? 💪";
  }

  // Thumbs up / like
  if (raw === "👍" || t === "like" || t === "ok" || t === "oke") {
    return "Dạ em đây ạ! Anh/chị cần tư vấn gì không? 💪";
  }

  const words = t.split(" ");
  if (GREETING.some((g) => words.includes(g) || t === g)) {
    return "Foxfit xin chào anh/chị 🦊 Em là trợ lý của Foxfit — Boutique Wellness Club. Anh/chị muốn hỏi về giá gói, dịch vụ (sauna, ngâm đá lạnh, sport rehab) hay xếp buổi tập thử ạ?";
  }
  if (THANKS.some((g) => t.includes(g))) {
    return "Dạ không có chi ạ 😊 Anh/chị cần thêm gì cứ nhắn em nha!";
  }
  return null;
}

// Kiểm tra handoff (chuyển người thật)
export function isHandoff(text) {
  const t = normalize(text);
  return (brain.handoff_triggers || []).some((h) => t.includes(normalize(h)));
}

export const handoffMessage =
  brain.handoff_message ||
  "Dạ để em chuyển anh/chị qua tư vấn viên hỗ trợ kỹ hơn nha, mình chờ chút xíu ạ 🙏";
