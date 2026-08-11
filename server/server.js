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
 *   HOST           — по умолчанию 127.0.0.1, т.е. только этот компьютер.
 *                    Для онлайн-версии достаточно поднять этот же файл на
 *                    хостинге с Node и задать HOST=0.0.0.0 и свой пароль.
 */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const store = require("./content-store");
const media = require("./media");
const telegram = require("./telegram");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "127.0.0.1";
const PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_SECRET = crypto.randomBytes(32);
const MAX_UPLOAD = 800 * 1024 * 1024;

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
    const body = JSON.parse((await readBody(req, 1024 * 64)).toString("utf8") || "{}");
    const ok = typeof body.password === "string" &&
      body.password.length === PASSWORD.length &&
      crypto.timingSafeEqual(Buffer.from(body.password), Buffer.from(PASSWORD));
    if (!ok) { sendJSON(res, 401, { error: "Неверный пароль" }); return; }
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

  // На хостинге формы обрабатывает send.php; локально Node отвечает по тому же
  // адресу, поэтому на сайте и там и там один и тот же запрос.
  if (url.pathname === "/send.php" && req.method === "POST") {
    readBody(req, 64 * 1024)
      .then((body) => telegram.send(JSON.parse(body.toString("utf8") || "{}")))
      .then(() => sendJSON(res, 200, { ok: true }))
      .catch((err) => sendJSON(res, 400, { ok: false, error: err.message }));
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    handleAPI(req, res, url).catch((err) => {
      console.error("API:", err.message);
      sendJSON(res, 400, { error: err.message });
    });
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("  Сайт:    http://localhost:" + PORT + "/");
  console.log("  Админка: http://localhost:" + PORT + "/admin.html");
  console.log("  Пароль:  " + (process.env.ADMIN_PASSWORD ? "(из ADMIN_PASSWORD)" : '"admin" — задайте свой через ADMIN_PASSWORD'));
  if (!media.HAS_FFMPEG) console.log("  ⚠ ffmpeg не найден — видео и аудио не будут сжиматься (brew install ffmpeg)");
  console.log("");
  console.log("  Остановить: Ctrl+C");
  console.log("");
});
