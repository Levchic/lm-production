/**
 * Локальный сервер: отдаёт сам сайт и обслуживает админку.
 * Никаких внешних зависимостей — только стандартная библиотека Node.
 *
 *   npm start                      → http://localhost:4000  (сайт)
 *                                    http://localhost:4000/admin.html (админка)
 *
 * Переменные окружения:
 *   PORT           — порт (по умолчанию 4000)
 *   ADMIN_PASSWORD — пароль в админку (по умолчанию "admin")
 *   BIND_HOST      — по умолчанию 127.0.0.1, т.е. только этот компьютер.
 *                    BIND_HOST=0.0.0.0 открывает доступ по локальной сети —
 *                    тогда в админку можно зайти с телефона по адресу мака.
 *                    Для онлайн-версии достаточно поднять этот же файл на
 *                    хостинге с Node с тем же BIND_HOST=0.0.0.0 и своим паролем.
 *                    (Не HOST — эта переменная в zsh уже занята под имя
 *                    компьютера, см. комментарий у константы ниже.)
 */
"use strict";

const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const store = require("./content-store");
const pricing = require("./pricing-store");
const media = require("./media");
const videoCover = require("./video-cover");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 4000);
// Именно BIND_HOST, а не HOST: zsh заводит собственную переменную HOST с
// именем компьютера, и сервер вместо локальной сети молча слушал бы только
// сам мак — с телефона такой адрес не открывается.
const HOST = process.env.BIND_HOST || "127.0.0.1";
const PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_SECRET = crypto.randomBytes(32);
const MAX_UPLOAD = 800 * 1024 * 1024;

/* Ограничение попыток входа. Пароль — единственный барьер перед админкой,
   а с HOST=0.0.0.0 сервер виден всей локальной сети, поэтому без тормозов
   пароль подбирается перебором за минуты. */
const LOGIN_FAILS_PER_IP = 5;      // после скольких промахов запираем один адрес
const LOGIN_FAILS_TOTAL = 20;      // и сколько промахов терпим суммарно
const LOGIN_LOCK_MS = 60 * 1000;   // первая пауза; дальше удваивается
const LOGIN_LOCK_MAX_MS = 60 * 60 * 1000;
const LOGIN_FORGET_MS = 24 * 60 * 60 * 1000; // столько помним старые промахи
const LOGIN_MAX_KEYS = 1000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".m4a": "audio/mp4", ".ogg": "audio/ogg",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf"
};

/* ---------------------------------------------------------------- helpers */

function sendJSON(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function token() {
  return crypto.createHmac("sha256", SESSION_SECRET).update("admin-session").digest("hex");
}
function authorized(req) {
  const header = req.headers.authorization || "";
  const given = header.replace(/^Bearer\s+/i, "");
  const expected = token();
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

/* ------------------------------------------------------- защита входа */

/** Пустая «корзинка» промахов: одна на адрес плюс одна общая. */
function newBucket() { return { fails: 0, lockedUntil: 0, last: 0 }; }

const loginByIP = new Map();
const loginTotal = newBucket();

/**
 * Ключ для счётчика промахов. За туннелем все соединения приходят с
 * 127.0.0.1, а настоящий адрес приезжает в X-Forwarded-For — но клиент может
 * его подделать, поэтому это только ключ корзинки, не удостоверение личности.
 * Подмена адреса помогает обойти лишь персональный счётчик; общий работает
 * в любом случае.
 */
function clientKey(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "unknown";
}

/** Сколько ещё миллисекунд эта корзинка заперта. */
function bucketLock(bucket, now) {
  return bucket && bucket.lockedUntil > now ? bucket.lockedUntil - now : 0;
}

function noteFail(bucket, threshold, now) {
  // давние промахи не копим: один опечатанный вход в месяц не должен
  // складываться с сегодняшним
  if (bucket.last && now - bucket.last > LOGIN_FORGET_MS) bucket.fails = 0;
  bucket.last = now;
  bucket.fails += 1;
  if (bucket.fails >= threshold) {
    const over = bucket.fails - threshold;
    bucket.lockedUntil = now + Math.min(LOGIN_LOCK_MS * Math.pow(2, over), LOGIN_LOCK_MAX_MS);
  }
}

/** 0, если входить можно; иначе — сколько ждать. */
function loginLockedFor(req) {
  const now = Date.now();
  return Math.max(bucketLock(loginTotal, now), bucketLock(loginByIP.get(clientKey(req)), now));
}

function loginFailed(req) {
  const now = Date.now();
  const key = clientKey(req);
  // карта не должна расти бесконечно — при переполнении выметаем отсиженное
  if (loginByIP.size > LOGIN_MAX_KEYS) {
    for (const [k, v] of loginByIP) if (v.lockedUntil < now) loginByIP.delete(k);
  }
  const bucket = loginByIP.get(key) || newBucket();
  noteFail(bucket, LOGIN_FAILS_PER_IP, now);
  loginByIP.set(key, bucket);
  noteFail(loginTotal, LOGIN_FAILS_TOTAL, now);
}

function loginSucceeded(req) {
  loginByIP.delete(clientKey(req));
  loginTotal.fails = 0;
  loginTotal.lockedUntil = 0;
}

/**
 * Сравнение паролей по хешам, а не по самим строкам: буферы всегда одной
 * длины (иначе timingSafeEqual бросает исключение), и длина настоящего
 * пароля не утекает через разницу в поведении сервера.
 */
function passwordMatches(given) {
  if (typeof given !== "string") return false;
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("Файл слишком большой"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/**
 * Минимальный разбор multipart/form-data — чтобы не тащить зависимость ради
 * одной формы загрузки. Возвращает { fields, files }.
 */
function parseMultipart(buffer, contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  if (!match) throw new Error("Не найден boundary");
  const boundary = Buffer.from("--" + (match[1] || match[2]).trim());

  const fields = {};
  const files = [];
  let pos = buffer.indexOf(boundary);
  if (pos === -1) throw new Error("Тело запроса не разобрано");
  pos += boundary.length;

  while (pos < buffer.length) {
    if (buffer[pos] === 0x2d && buffer[pos + 1] === 0x2d) break; // "--" — конец
    pos += 2; // CRLF после boundary
    const headerEnd = buffer.indexOf("\r\n\r\n", pos, "utf8");
    if (headerEnd === -1) break;
    const headers = buffer.slice(pos, headerEnd).toString("utf8");
    const bodyStart = headerEnd + 4;
    const next = buffer.indexOf(boundary, bodyStart);
    if (next === -1) break;
    const body = buffer.slice(bodyStart, next - 2); // минус CRLF перед boundary

    const nameMatch = /name="([^"]*)"/i.exec(headers);
    const fileMatch = /filename="([^"]*)"/i.exec(headers);
    const name = nameMatch ? nameMatch[1] : "";
    if (fileMatch && fileMatch[1]) {
      files.push({ field: name, filename: fileMatch[1], data: body });
    } else {
      fields[name] = body.toString("utf8");
    }
    pos = next + boundary.length;
  }
  return { fields, files };
}

/* ------------------------------------------------------------ статика */

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";
  const abs = path.resolve(ROOT, "." + rel);
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  fs.stat(abs, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Не найдено: " + rel);
      return;
    }
    const ext = path.extname(abs).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const range = req.headers.range;

    // Range нужен, чтобы видео можно было перематывать
    if (range && (type.startsWith("video/") || type.startsWith("audio/"))) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      const start = m && m[1] ? parseInt(m[1], 10) : 0;
      const end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (start >= stat.size) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` }).end();
        return;
      }
      res.writeHead(206, {
        "Content-Type": type,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1
      });
      fs.createReadStream(abs, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": stat.size,
      "Accept-Ranges": "bytes",
      "Cache-Control": ext === ".html" || ext === ".js" || ext === ".css" ? "no-cache" : "public, max-age=3600"
    });
    fs.createReadStream(abs).pipe(res);
  });
}

/* ---------------------------------------------------------------- API */

async function handleAPI(req, res, url) {
  const route = url.pathname;

  if (route === "/api/login" && req.method === "POST") {
    const waitMs = loginLockedFor(req);
    if (waitMs > 0) {
      const seconds = Math.ceil(waitMs / 1000);
      res.setHeader("Retry-After", String(seconds));
      sendJSON(res, 429, {
        error: "Слишком много попыток входа. Повторите через " +
          (seconds > 90 ? Math.ceil(seconds / 60) + " мин." : seconds + " сек.")
      });
      return;
    }
    const body = JSON.parse((await readBody(req, 1024 * 64)).toString("utf8") || "{}");
    if (!passwordMatches(body.password)) {
      loginFailed(req);
      sendJSON(res, 401, { error: "Неверный пароль" });
      return;
    }
    loginSucceeded(req);
    sendJSON(res, 200, { token: token() });
    return;
  }

  if (route === "/api/status" && req.method === "GET") {
    sendJSON(res, 200, { ok: true, ffmpeg: media.HAS_FFMPEG, sips: media.HAS_SIPS });
    return;
  }

  if (!authorized(req)) { sendJSON(res, 401, { error: "Нужна авторизация" }); return; }

  if (route === "/api/content" && req.method === "GET") {
    sendJSON(res, 200, { content: store.read() });
    return;
  }

  if (route === "/api/content" && req.method === "PUT") {
    const body = JSON.parse((await readBody(req, 32 * 1024 * 1024)).toString("utf8"));
    store.write(body.content);
    // папки проектов и новостей приводим в соответствие с сохранённым контентом
    const folders = media.syncFolders(body.content);
    sendJSON(res, 200, { ok: true, savedAt: new Date().toISOString(), folders });
    return;
  }

  /* Прайс калькулятора. Сам js/pricing-config.js админка не трогает —
     она правит только накладку с отличиями, см. server/pricing-store.js.
     Исходный прайс админке отдавать не нужно: она грузит его обычным
     скриптом, тем же файлом, что и сайт. */
  if (route === "/api/pricing" && req.method === "GET") {
    sendJSON(res, 200, { overrides: pricing.read() });
    return;
  }

  if (route === "/api/pricing" && req.method === "PUT") {
    const body = JSON.parse((await readBody(req, 1024 * 1024)).toString("utf8"));
    pricing.write(body.overrides || {});
    sendJSON(res, 200, {
      ok: true,
      savedAt: new Date().toISOString(),
      count: Object.keys(body.overrides || {}).length
    });
    return;
  }

  if (route === "/api/media" && req.method === "GET") {
    sendJSON(res, 200, {
      folders: media.listFolders(),
      files: media.list(url.searchParams.get("folder") || "")
    });
    return;
  }

  if (route === "/api/media" && req.method === "DELETE") {
    const body = JSON.parse((await readBody(req, 1024 * 64)).toString("utf8") || "{}");
    media.remove(body.src);
    sendJSON(res, 200, { ok: true });
    return;
  }

  // Папка раздела: создаётся при добавлении проекта/новости и
  // удаляется вместе с ними — чтобы медиатека не зарастала мусором.
  if (route === "/api/folder" && req.method === "POST") {
    const body = JSON.parse((await readBody(req, 1024 * 64)).toString("utf8") || "{}");
    sendJSON(res, 200, { ok: true, folder: media.ensureFolder(body.folder) });
    return;
  }

  if (route === "/api/folder" && req.method === "DELETE") {
    const body = JSON.parse((await readBody(req, 1024 * 64)).toString("utf8") || "{}");
    sendJSON(res, 200, Object.assign({ ok: true }, media.removeFolder(body.folder)));
    return;
  }

  // Обложка из ролика по ссылке: сервер скачивает кадр-заставку у YouTube
  // или Rutube и кладёт его в медиатеку как обычную загрузку — с тем же
  // сжатием и теми же правилами имени файла.
  if (route === "/api/video-cover" && req.method === "POST") {
    const body = JSON.parse((await readBody(req, 1024 * 64)).toString("utf8") || "{}");
    const cover = await videoCover.fetchCover(body.url);
    const saved = media.save(cover.buffer, cover.name, body.folder || "");
    sendJSON(res, 200, { src: saved.src, size: saved.size, note: saved.note || null });
    return;
  }

  if (route === "/api/upload" && req.method === "POST") {
    const raw = await readBody(req, MAX_UPLOAD);
    const { fields, files } = parseMultipart(raw, req.headers["content-type"]);
    if (!files.length) { sendJSON(res, 400, { error: "Файл не получен" }); return; }
    const saved = files.map((f) => media.save(f.data, f.filename, fields.folder || ""));
    sendJSON(res, 200, { files: saved });
    return;
  }

  sendJSON(res, 404, { error: "Неизвестный метод API: " + route });
}

/* ------------------------------------------------------------- сервер */

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    handleAPI(req, res, url).catch((err) => {
      console.error("API:", err.message);
      sendJSON(res, 400, { error: err.message });
    });
    return;
  }
  serveStatic(req, res, url.pathname);
});

/**
 * Адреса этого компьютера в локальной сети — их и набирают на телефоне.
 * Обычно он один, но при включённом «режиме модема» или VPN бывает
 * несколько, поэтому показываем все и даём выбрать.
 */
function lanAddresses() {
  const found = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list || []) {
      if (net.family === "IPv4" && !net.internal) found.push(net.address);
    }
  }
  // Домашние адреса (192.168.x, 10.x, 172.16–31.x, раздача с iPhone) — вперёд:
  // всё остальное обычно наводит VPN и виртуальные машины, и телефону
  // по таким адресам не достучаться.
  const isHome = (ip) => /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip);
  return found.sort((a, b) => (isHome(b) ? 1 : 0) - (isHome(a) ? 1 : 0));
}

/* Сайт грузит накладку безусловным <script>, поэтому файл должен быть
   на месте даже когда прайс ещё ни разу не правили. */
pricing.ensure();

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("  Сайт:    http://localhost:" + PORT + "/");
  console.log("  Админка: http://localhost:" + PORT + "/admin.html");
  console.log("  Пароль:  " + (process.env.ADMIN_PASSWORD ? "(из ADMIN_PASSWORD)" : '"admin" — задайте свой через ADMIN_PASSWORD'));

  if (HOST === "0.0.0.0") {
    const addresses = lanAddresses();
    console.log("");
    if (addresses.length) {
      console.log("  С ТЕЛЕФОНА — той же сети Wi-Fi:");
      addresses.forEach((ip) => console.log("      http://" + ip + ":" + PORT + "/admin.html"));
      console.log("");
      console.log("  Адрес виден всем в этой сети, так что в кафе и коворкингах");
      console.log("  сервер лучше не оставлять запущенным.");
    } else {
      console.log("  ⚠ Компьютер сейчас не в сети — адреса для телефона нет.");
      console.log("    Подключитесь к Wi-Fi (или включите раздачу с телефона) и перезапустите.");
    }
  }

  if (PASSWORD === "admin") {
    console.log("");
    console.log("  ⚠ Пароль в админку — стандартный «admin».");
    console.log("    Задайте свой в start.command — иначе в общей сети");
    console.log("    админка открыта любому, кто наберёт адрес выше.");
  }
  if (!media.HAS_FFMPEG) console.log("  ⚠ ffmpeg не найден — видео и аудио не будут сжиматься (brew install ffmpeg)");
  console.log("");
  console.log("  Остановить: Ctrl+C");
  console.log("");
});
