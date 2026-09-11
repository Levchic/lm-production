/**
 * Обложка из ролика по ссылке.
 *
 * У YouTube и Rutube кадр-заставка лежит по предсказуемому адресу, поэтому
 * его можно забрать без ключей и сторонних библиотек: админка присылает
 * ссылку на ролик, сервер скачивает картинку и отдаёт её дальше — в
 * assets/media её кладёт server/media.js, там же она ужимается и получает
 * имя, как у обычной загрузки.
 *
 * VK не поддерживается: публичного адреса заставки у него нет, нужен ключ
 * приложения. Для таких роликов остаётся ручная загрузка файла.
 */
"use strict";

const https = require("https");

const TIMEOUT_MS = 12000;
const MAX_BYTES = 8 * 1024 * 1024;

/** Скачивание с переходами по редиректам. Возвращает {status, buffer}. */
function get(url, redirectsLeft) {
  const left = redirectsLeft === undefined ? 4 : redirectsLeft;
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (admin cover fetch)" } }, (res) => {
      const status = res.statusCode || 0;
      const location = res.headers.location;
      if (status >= 300 && status < 400 && location) {
        res.resume();
        if (!left) { reject(new Error("Слишком много переадресаций")); return; }
        resolve(get(new URL(location, url).toString(), left - 1));
        return;
      }
      const chunks = [];
      let size = 0;
      res.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_BYTES) { req.destroy(); reject(new Error("Картинка слишком большая")); return; }
        chunks.push(chunk);
      });
      res.on("end", () => resolve({ status, buffer: Buffer.concat(chunks) }));
    });
    req.setTimeout(TIMEOUT_MS, () => { req.destroy(); reject(new Error("Сервис не ответил вовремя")); });
    req.on("error", (err) => reject(new Error("Не удалось скачать обложку: " + err.message)));
  });
}

/* Разбор ссылок — те же выражения, что в js/common.js (embedURL):
   ссылка из адресной строки, короткая, shorts и уже готовая embed. */
function youtubeId(url) {
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/i);
  return m ? m[1] : "";
}

function rutubeId(url) {
  const m = String(url).match(/rutube\.ru\/(?:video|play\/embed)\/([\w-]+)/i);
  return m ? m[1] : "";
}

/** Кадр с YouTube: сначала самый крупный, дальше — что есть. */
async function fromYouTube(id) {
  // maxres есть не у всех роликов (зависит от того, в каком качестве его
  // залили), поэтому спускаемся по размерам, пока не ответят картинкой.
  const sizes = ["maxresdefault", "sddefault", "hqdefault"];
  for (const size of sizes) {
    const res = await get("https://img.youtube.com/vi/" + id + "/" + size + ".jpg");
    // На отсутствующий размер YouTube отвечает 404, но иногда отдаёт
    // серую заглушку 120×90 — её видно по размеру файла.
    if (res.status === 200 && res.buffer.length > 3000) {
      return { buffer: res.buffer, name: "youtube-" + id + "-" + size + ".jpg" };
    }
  }
  throw new Error("У этого ролика на YouTube нет доступной обложки");
}

/** Кадр с Rutube: адрес заставки лежит в открытом описании ролика. */
async function fromRutube(id) {
  const meta = await get("https://rutube.ru/api/video/" + id + "/");
  if (meta.status !== 200) throw new Error("Rutube не отдал описание ролика");
  let data;
  try { data = JSON.parse(meta.buffer.toString("utf8")); }
  catch (e) { throw new Error("Rutube ответил непонятным описанием ролика"); }
  const src = data && (data.thumbnail_url || data.picture_url);
  if (!src) throw new Error("У этого ролика на Rutube нет обложки");
  const img = await get(src);
  if (img.status !== 200 || img.buffer.length < 3000) throw new Error("Rutube не отдал картинку обложки");
  return { buffer: img.buffer, name: "rutube-" + id + ".jpg" };
}

/**
 * Достаёт обложку по ссылке на ролик.
 * @returns {Promise<{buffer: Buffer, name: string}>}
 */
async function fetchCover(url) {
  const link = String(url || "").trim();
  if (!link) throw new Error("Сначала вставьте ссылку на ролик");

  const yt = youtubeId(link);
  if (yt) return fromYouTube(yt);

  const rt = rutubeId(link);
  if (rt) return fromRutube(rt);

  if (/vk(?:video)?\.(?:com|ru)|video_ext\.php/i.test(link)) {
    throw new Error("У VK обложку по ссылке не забрать — сохраните кадр вручную и загрузите файлом");
  }
  throw new Error("Обложку умею забирать с YouTube и Rutube");
}

module.exports = { fetchCover, youtubeId, rutubeId };
