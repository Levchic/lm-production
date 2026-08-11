/**
 * Отправка заявок и отзывов в Telegram — версия для локального сервера.
 *
 * На хостинге ту же работу делает send.php (PHP есть на любом виртуальном
 * хостинге, Node — нет). Настройки не дублируются: и токен, и chat_id
 * берутся из send.php, он остаётся единственным местом с секретом.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");

const SEND_PHP = path.resolve(__dirname, "..", "send.php");

function config() {
  let source = "";
  try { source = fs.readFileSync(SEND_PHP, "utf8"); } catch (e) { return { token: "", chatId: "" }; }
  const read = (name) => {
    const m = new RegExp("const\\s+" + name + "\\s*=\\s*'([^']*)'").exec(source);
    return m ? m[1] : "";
  };
  return { token: read("TELEGRAM_TOKEN"), chatId: read("TELEGRAM_CHAT_ID") };
}

function clean(value, max) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);
}

function escapeHTML(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Собирает текст сообщения; возвращает null, если данных не хватает. */
function buildMessage(data) {
  const lines = [];
  if (data.type === "review") {
    const name = clean(data.name, 80);
    const text = clean(data.text, 1500);
    if (!name || !text || data.consent !== true) return null;
    const rating = Math.max(0, Math.min(5, Math.round(Number(data.rating) || 0)));
    lines.push("🌟 <b>Новый отзыв с сайта</b>", "", "<b>Имя:</b> " + escapeHTML(name));
    const role = clean(data.role, 120);
    if (role) lines.push("<b>Кем работает:</b> " + escapeHTML(role));
    if (rating) lines.push("<b>Оценка:</b> " + "★".repeat(rating) + "☆".repeat(5 - rating));
    const profile = clean(data.profileUrl, 200);
    if (/^https:\/\/(vk\.com|vk\.ru|m\.vk\.ru|t\.me|telegram\.me)\/[\w./-]+$/i.test(profile)) {
      lines.push("<b>Профиль:</b> " + escapeHTML(profile));
    }
    lines.push("", escapeHTML(text), "", "<i>Чтобы отзыв появился на сайте, добавьте его в админке: раздел «Отзывы».</i>");
  } else {
    const name = clean(data.name, 80);
    const contact = clean(data.contact, 120);
    const message = clean(data.message, 3000);
    if (!name || !contact || !message || data.consent !== true) return null;
    lines.push("📩 <b>Заявка с сайта</b>", "", "<b>Имя:</b> " + escapeHTML(name),
      "<b>Контакт:</b> " + escapeHTML(contact));
    const service = clean(data.service, 120);
    if (service) lines.push("<b>Услуга:</b> " + escapeHTML(service));
    lines.push("", escapeHTML(message));
  }
  if (data.lang === "en") lines.push("\n<i>(отправлено из английской версии сайта)</i>");
  return lines.join("\n");
}

function post(url, body) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(body, "utf8");
    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": payload.length }
    }, (res) => {
      let out = "";
      res.on("data", (chunk) => { out += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(out)); } catch (e) { reject(new Error("Ответ Telegram не разобрался")); }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/** Отправляет заявку или отзыв. Бросает ошибку с понятным текстом. */
async function send(data) {
  if (clean(data.website, 100)) return { ok: true };  // ловушка для ботов

  const text = buildMessage(data);
  if (!text) throw new Error("Заполните обязательные поля и отметьте согласие");

  const { token, chatId } = config();
  if (!token) throw new Error("В send.php не задан TELEGRAM_TOKEN");
  if (!chatId) throw new Error("Форма ещё не настроена: запустите node server/telegram-setup.js");

  const body = new URLSearchParams({
    chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: "true"
  }).toString();
  const result = await post("https://api.telegram.org/bot" + token + "/sendMessage", body);
  if (!result || !result.ok) throw new Error("Telegram не принял сообщение");
  return { ok: true };
}

module.exports = { send, config };
