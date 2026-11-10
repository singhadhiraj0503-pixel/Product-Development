export async function sendTelegramApproval(input: { chatId: string; deckId: string; title: string; slideCount: number }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: input.chatId,
      text: `Carousel ready for review: ${input.title}\nSlides: ${input.slideCount}\nDeck ID: ${input.deckId}`,
      reply_markup: { inline_keyboard: [[
        { text: "Approve", callback_data: `ce:approve:${input.deckId}` },
        { text: "Reject", callback_data: `ce:reject:${input.deckId}` },
      ]] },
    }),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.description || "Telegram message failed.");
  return result.result;
}

export async function answerTelegramCallback(callbackQueryId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}
