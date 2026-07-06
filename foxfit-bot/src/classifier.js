// classifier.js — Logic 3 tầng + phân loại độ phức tạp cho Claude
import { tier0, matchFAQ, isHandoff, normalize } from "./brain.js";

const CONFIDENCE_THRESHOLD = 0.7;

// Từ khoá "chốt" → hot_lead
const CHOT_KEYWORDS = [
  "dang ky", "dang ki", "de lai sdt", "so dien thoai", "tap thu",
  "tham quan", "cho em xin so", "book", "hen lich", "muon tap", "toi muon tap",
];

// Câu phức tạp → dùng model mạnh (sonnet)
const COMPLEX_KEYWORDS = [
  "lo trinh", "giam can", "tang co", "chan thuong", "so sanh", "nen chon",
  "bao lau", "ket qua", "map", "beo", "gay", "dau lung", "phu hop",
  "giam mo", "tang can", "an uong", "che do", "dinh duong",
];

export function isChot(text) {
  const t = normalize(text);
  return CHOT_KEYWORDS.some((k) => t.includes(k));
}

export function isComplex(text) {
  const t = normalize(text);
  return COMPLEX_KEYWORDS.some((k) => t.includes(k));
}

/**
 * Phân loại 1 tin nhắn.
 * Trả về:
 * {
 *   tier: 0 | 1 | 2,
 *   source: "greeting" | "faq" | "handoff" | "claude",
 *   answer: string | null,   // null nghĩa là cần gọi Claude (tier 2)
 *   intent: string | null,
 *   model: "simple" | "complex" | null,
 *   statusHint: "new" | "interested" | "hot_lead" | "converted",
 *   tokenFree: boolean
 * }
 */
export function classify(text) {
  // Handoff ưu tiên cao nhất (đang chốt / chuyển khoản)
  if (isHandoff(text)) {
    return {
      tier: 1,
      source: "handoff",
      answer: null, // index.js sẽ trả handoffMessage
      intent: "handoff",
      model: null,
      statusHint: "converted",
      tokenFree: true,
    };
  }

  // Tầng 0 — chào hỏi / cảm ơn / rỗng
  const t0 = tier0(text);
  if (t0) {
    return {
      tier: 0,
      source: "greeting",
      answer: t0,
      intent: "greeting",
      model: null,
      statusHint: "new",
      tokenFree: true,
    };
  }

  // "Chốt" → hot_lead (vẫn trả FAQ chot nếu có, nhưng đánh dấu nóng)
  const chot = isChot(text);

  // Tầng 1 — FAQ keyword match
  const faq = matchFAQ(text);
  if (faq && faq.confidence >= CONFIDENCE_THRESHOLD) {
    return {
      tier: 1,
      source: "faq",
      answer: faq.answer,
      intent: faq.intent,
      model: null,
      statusHint: chot || faq.intent === "chot" ? "hot_lead" : "interested",
      tokenFree: true,
    };
  }

  // Tầng 2 — gọi Claude
  return {
    tier: 2,
    source: "claude",
    answer: null,
    intent: faq ? faq.intent : "unknown",
    model: isComplex(text) ? "complex" : "simple",
    statusHint: chot ? "hot_lead" : "interested",
    tokenFree: false,
  };
}
