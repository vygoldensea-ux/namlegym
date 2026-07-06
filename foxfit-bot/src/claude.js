// claude.js — Gọi Anthropic Claude API (Tầng 2) + quản lý context
import Anthropic from "@anthropic-ai/sdk";
import { buildBrainContext } from "./brain.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL_SIMPLE = process.env.MODEL_SIMPLE || "claude-haiku-4-5";
const MODEL_COMPLEX = process.env.MODEL_COMPLEX || "claude-sonnet-4-6";

// Ước tính token thô để báo cáo (1 token ~ 4 ký tự)
export function estimateTokens(str = "") {
  return Math.ceil(str.length / 4);
}

function systemPrompt(brainContext) {
  return `Bạn là trợ lý tư vấn của Foxfit — Boutique Wellness Club.
Xưng "em", gọi khách "anh/chị". Thân thiện, nhiệt tình, tự nhiên như người thật.
KHÔNG xin lỗi vì giá. Nhấn mạnh giá trị: sauna nữ, ngâm đá lạnh, sport rehab, khăn xịn tặng kèm.
Trả lời ngắn gọn 2-4 câu, dễ đọc trên điện thoại.
Luôn kết bằng 1 lời mời hành động (tập thử/để SĐT/tham quan).
Dùng emoji vừa phải: 💪 🦊 🎁 🔥
Nếu không chắc thông tin (giờ, địa chỉ chưa điền), mời khách để lại SĐT để tư vấn viên hỗ trợ, tuyệt đối không bịa.

THÔNG TIN PHÒNG:
${brainContext}`;
}

/**
 * Sinh câu trả lời bằng Claude.
 * @param {string} userMessage
 * @param {Array<{role,content}>} history  - lịch sử gần nhất (tối đa ~10)
 * @param {"simple"|"complex"} modelTier
 * @returns {Promise<{text, model, usage:{input,output,total}}>}
 */
export async function askClaude(userMessage, history = [], modelTier = "simple") {
  const model = modelTier === "complex" ? MODEL_COMPLEX : MODEL_SIMPLE;
  const brainContext = buildBrainContext(userMessage);

  // Chỉ lấy tối đa 6 lượt gần nhất để prompt ngắn, tiết kiệm token
  const trimmed = history.slice(-6).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  const messages = [...trimmed, { role: "user", content: userMessage }];

  try {
    const resp = await client.messages.create({
      model,
      max_tokens: 400,
      system: systemPrompt(brainContext),
      messages,
    });

    const text =
      resp.content?.map((c) => (c.type === "text" ? c.text : "")).join("").trim() ||
      "Dạ anh/chị để lại SĐT em nhờ tư vấn viên hỗ trợ ngay nha 👍";

    const usage = resp.usage || {};
    return {
      text,
      model,
      usage: {
        input: usage.input_tokens || 0,
        output: usage.output_tokens || 0,
        total: (usage.input_tokens || 0) + (usage.output_tokens || 0),
      },
    };
  } catch (err) {
    console.error("[claude] error:", err?.message || err);
    // Fallback an toàn — không làm khách chờ vô hạn
    return {
      text: "Dạ để em nhờ tư vấn viên hỗ trợ anh/chị kỹ hơn nha, mình chờ chút xíu ạ 🙏 Anh/chị có thể để lại SĐT giúp em.",
      model,
      usage: { input: 0, output: 0, total: 0 },
      error: true,
    };
  }
}
