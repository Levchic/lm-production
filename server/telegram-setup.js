/**
 * Одноразовая настройка Telegram-бота.
 *
 *   1. Напишите боту @note_parse_bot команду /start
 *   2. Выполните:  node server/telegram-setup.js
 *
 * Скрипт спросит у Telegram, кто ему писал, и пропишет ваш chat_id
 * в send.php. Повторять нужно только если смените бота или аккаунт.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");

const SEND_PHP = path.resolve(__dirname, "..", "send.php");

function readConst(source, name) {
  const m = new RegExp("const\\s+" + name + "\\s*=\\s*'([^']*)'").exec(source);
  return m ? m[1] : "";
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(new Error("Ответ Telegram не разобрался")); }
      });
    }).on("error", reject);
  });
}

(async function main() {
  const source = fs.readFileSync(SEND_PHP, "utf8");
  const token = readConst(source, "TELEGRAM_TOKEN");
  if (!token) {
    console.error("В send.php не найден TELEGRAM_TOKEN");
    process.exit(1);
  }

  const me = await get(`https://api.telegram.org/bot${token}/getMe`);
  if (!me.ok) {
    console.error("Токен не принят Telegram. Проверьте TELEGRAM_TOKEN в send.php.");
    process.exit(1);
  }
  console.log("Бот:", "@" + me.result.username);

  const updates = await get(`https://api.telegram.org/bot${token}/getUpdates`);
  const chats = (updates.result || [])
    .map((u) => (u.message || u.channel_post || {}).chat)
    .filter((c) => c && c.type === "private");

  if (!chats.length) {
    console.log("");
    console.log("  Боту ещё никто не писал.");
    console.log("  Откройте @" + me.result.username + " в Telegram, нажмите «Запустить» (/start)");
    console.log("  и запустите эту команду ещё раз.");
    console.log("");
    process.exit(0);
  }

  const chat = chats[chats.length - 1];
  const name = [chat.first_name, chat.last_name].filter(Boolean).join(" ") || chat.username || chat.id;
  const updated = source.replace(
    /const\s+TELEGRAM_CHAT_ID\s*=\s*'[^']*'/,
    "const TELEGRAM_CHAT_ID = '" + chat.id + "'"
  );
  fs.writeFileSync(SEND_PHP, updated, "utf8");

  console.log("Заявки будут приходить сюда:", name, "(chat_id " + chat.id + ")");
  console.log("Готово — chat_id записан в send.php.");
  console.log("Проверить можно так:  node server/telegram-setup.js --test");

  if (process.argv.includes("--test")) {
    const text = encodeURIComponent("✅ Проверка связи с сайтом. Если вы это видите — формы настроены.");
    const res = await get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat.id}&text=${text}`);
    console.log(res.ok ? "Тестовое сообщение отправлено." : "Не удалось отправить тестовое сообщение.");
  }
})().catch((err) => {
  console.error("Ошибка:", err.message);
  process.exit(1);
});
