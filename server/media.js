/**
 * Работа с медиа: список файлов, загрузка с автосжатием, удаление.
 *
 * Телефонные фото и видео весят десятки–сотни мегабайт, и часть форматов
 * (.HEIC, .DNG, HEVC в .MOV) браузер вообще не открывает. Поэтому всё, что
 * загружается через админку, прогоняется через sips (фото) и ffmpeg (видео и
 * аудио) — на выходе всегда web-совместимый файл разумного веса. Если ffmpeg
 * не установлен, файл кладётся как есть и в ответе приходит предупреждение.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const MEDIA_DIR = path.join(ROOT, "assets", "media");

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".heic", ".heif", ".dng", ".tif", ".tiff", ".webp", ".gif"];
const VIDEO_EXT = [".mp4", ".mov", ".m4v", ".avi", ".mkv", ".webm"];
const AUDIO_EXT = [".mp3", ".wav", ".aif", ".aiff", ".m4a", ".flac", ".ogg"];

const MAX_IMAGE_SIDE = 2200;
const MAX_VIDEO_WIDTH = 1280;

function has(bin) {
  try {
    execFileSync("/usr/bin/which", [bin], { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}
const HAS_FFMPEG = has("ffmpeg");
const HAS_SIPS = has("sips");

function kindOf(ext) {
  if (IMAGE_EXT.includes(ext)) return "photo";
  if (VIDEO_EXT.includes(ext)) return "video";
  if (AUDIO_EXT.includes(ext)) return "audio";
  return "other";
}

/** Транслитерация + чистка: русские имена файлов в url ведут себя плохо. */
const TRANSLIT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "i",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
};
function slugify(name) {
  const lower = String(name || "").toLowerCase();
  let out = "";
  for (const ch of lower) out += TRANSLIT[ch] !== undefined ? TRANSLIT[ch] : ch;
  out = out.replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return out || "file";
}

function ensureUnique(dir, base, ext) {
  let candidate = base + ext;
  let i = 2;
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${base}-${i}${ext}`;
    i++;
  }
  return candidate;
}

function relFromRoot(abs) {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

/** Безопасный путь внутри assets/media — защита от ../ */
function resolveInsideMedia(relPath) {
  const abs = path.resolve(ROOT, relPath);
  if (abs !== MEDIA_DIR && !abs.startsWith(MEDIA_DIR + path.sep)) {
    throw new Error("Путь вне assets/media");
  }
  return abs;
}

/**
 * Приводит «portfolio/Мой Проект» к «portfolio/moy-proekt».
 * Папки вложенные — по разделам сайта: home, about, services,
 * portfolio/<id проекта>, blog/<id новости>, reviews, archive.
 */
function safeFolderPath(folder) {
  return String(folder || "")
    .split("/")
    .map((part) => slugify(part.trim()))
    .filter((part) => part && part !== "file")
    .slice(0, 2)
    .join("/");
}

/** Папки медиатеки, включая вложенные (portfolio/<id>, blog/<id>). */
function listFolders() {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  const out = [];
  function scan(dir, prefix, depth) {
    fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("."))
      .map((d) => d.name)
      .sort()
      .forEach((name) => {
        const rel = prefix ? prefix + "/" + name : name;
        out.push(rel);
        if (depth > 0) scan(path.join(dir, name), rel, depth - 1);
      });
  }
  scan(MEDIA_DIR, "", 1);
  return ["", ...out];
}

/** Создаёт папку раздела (вызывается админкой при добавлении проекта/новости). */
function ensureFolder(folder) {
  const safe = safeFolderPath(folder);
  if (!safe) throw new Error("Пустое имя папки");
  const dir = resolveInsideMedia(path.join("assets/media", safe));
  fs.mkdirSync(dir, { recursive: true });
  return safe;
}

/** Удаляет папку раздела вместе с содержимым (при удалении проекта/новости). */
function removeFolder(folder) {
  const safe = safeFolderPath(folder);
  if (!safe) throw new Error("Пустое имя папки");
  const dir = resolveInsideMedia(path.join("assets/media", safe));
  if (!fs.existsSync(dir)) return { removed: false, files: 0 };
  const files = fs.readdirSync(dir).filter((f) => !f.startsWith(".")).length;
  fs.rmSync(dir, { recursive: true, force: true });
  return { removed: true, files };
}

/**
 * Держит структуру папок в согласии с контентом: у каждого проекта и каждой
 * новости своя папка, а папки удалённых — уезжают в archive/ (не удаляем
 * насовсем: опечатка в идентификаторе не должна стоить фотографий).
 * Вызывается при каждом сохранении контента из админки.
 */
function syncFolders(content) {
  const ru = (content && content.ru) || {};
  const expected = {
    portfolio: ((ru.portfolio && ru.portfolio.projects) || []).map((p) => slugify(String(p.id || ""))).filter(Boolean),
    blog: ((ru.blog && ru.blog.posts) || []).map((p) => slugify(String(p.id || ""))).filter(Boolean)
  };
  const created = [];
  const archived = [];

  ["home", "about", "services", "portfolio", "blog", "reviews", "archive"].forEach((name) => {
    fs.mkdirSync(path.join(MEDIA_DIR, name), { recursive: true });
  });

  Object.keys(expected).forEach((section) => {
    const sectionDir = path.join(MEDIA_DIR, section);
    expected[section].forEach((id) => {
      const dir = path.join(sectionDir, id);
      if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); created.push(section + "/" + id); }
    });

    fs.readdirSync(sectionDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("."))
      .forEach((d) => {
        if (expected[section].includes(d.name)) return;
        const from = path.join(sectionDir, d.name);
        const stamp = new Date().toISOString().slice(0, 10);
        let to = path.join(MEDIA_DIR, "archive", `${section}-${d.name}-${stamp}`);
        let i = 2;
        while (fs.existsSync(to)) { to = path.join(MEDIA_DIR, "archive", `${section}-${d.name}-${stamp}-${i}`); i++; }
        fs.renameSync(from, to);
        archived.push(section + "/" + d.name);
      });
  });

  return { created, archived };
}

function list(folder) {
  const dir = folder ? resolveInsideMedia(path.join("assets/media", folder)) : MEDIA_DIR;
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith("."))
    .map((d) => {
      const abs = path.join(dir, d.name);
      const stat = fs.statSync(abs);
      return {
        name: d.name,
        src: relFromRoot(abs),
        kind: kindOf(path.extname(d.name).toLowerCase()),
        size: stat.size,
        mtime: stat.mtimeMs
      };
    })
    .sort((a, b) => b.mtime - a.mtime);
}

function optimizeImage(tmpFile, outDir, baseName) {
  const outName = ensureUnique(outDir, baseName, ".jpg");
  const outPath = path.join(outDir, outName);
  if (HAS_SIPS) {
    execFileSync("sips", [
      "-s", "format", "jpeg",
      "-s", "formatOptions", "80",
      "-Z", String(MAX_IMAGE_SIDE),
      tmpFile, "--out", outPath
    ], { stdio: "ignore" });
    return { path: outPath, note: null };
  }
  fs.copyFileSync(tmpFile, outPath);
  return { path: outPath, note: "sips не найден — файл сохранён без сжатия" };
}

function optimizeVideo(tmpFile, outDir, baseName) {
  const outName = ensureUnique(outDir, baseName, ".mp4");
  const outPath = path.join(outDir, outName);
  if (!HAS_FFMPEG) {
    fs.copyFileSync(tmpFile, outPath);
    return { path: outPath, poster: null, note: "ffmpeg не найден — видео сохранено без сжатия (может не открыться в браузере)" };
  }
  execFileSync("ffmpeg", [
    "-y", "-i", tmpFile,
    "-vf", `scale='min(${MAX_VIDEO_WIDTH},iw)':-2`,
    "-c:v", "libx264", "-crf", "24", "-preset", "medium",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    outPath
  ], { stdio: "ignore" });

  // Кадр-заглушка: страница показывает его вместо загрузки всего ролика
  const posterName = ensureUnique(outDir, baseName + "-poster", ".jpg");
  const posterPath = path.join(outDir, posterName);
  try {
    execFileSync("ffmpeg", ["-y", "-ss", "1", "-i", outPath, "-frames:v", "1", "-q:v", "3", posterPath], { stdio: "ignore" });
  } catch (e) {
    try {
      execFileSync("ffmpeg", ["-y", "-i", outPath, "-frames:v", "1", "-q:v", "3", posterPath], { stdio: "ignore" });
    } catch (e2) { /* постера не будет — плитка просто покажет кнопку play */ }
  }
  return {
    path: outPath,
    poster: fs.existsSync(posterPath) ? posterPath : null,
    note: null
  };
}

function optimizeAudio(tmpFile, outDir, baseName, originalExt) {
  if (originalExt === ".mp3" || !HAS_FFMPEG) {
    const outName = ensureUnique(outDir, baseName, originalExt === ".mp3" ? ".mp3" : originalExt);
    const outPath = path.join(outDir, outName);
    fs.copyFileSync(tmpFile, outPath);
    return { path: outPath, note: HAS_FFMPEG ? null : "ffmpeg не найден — аудио сохранено как есть" };
  }
  const outName = ensureUnique(outDir, baseName, ".mp3");
  const outPath = path.join(outDir, outName);
  execFileSync("ffmpeg", ["-y", "-i", tmpFile, "-codec:a", "libmp3lame", "-b:a", "192k", outPath], { stdio: "ignore" });
  return { path: outPath, note: null };
}

/**
 * Кладёт загруженный файл в assets/media/<folder>/ и приводит его к
 * web-формату. Возвращает пути, готовые для подстановки в content.js.
 */
function save(buffer, originalName, folder) {
  const safeFolder = safeFolderPath(folder);
  const outDir = safeFolder ? path.join(MEDIA_DIR, safeFolder) : MEDIA_DIR;
  resolveInsideMedia(relFromRoot(outDir));
  fs.mkdirSync(outDir, { recursive: true });

  const ext = path.extname(originalName).toLowerCase();
  const base = slugify(path.basename(originalName, path.extname(originalName))).slice(0, 60);
  const kind = kindOf(ext);

  const tmpFile = path.join(os.tmpdir(), `upload-${Date.now()}-${base}${ext || ".bin"}`);
  fs.writeFileSync(tmpFile, buffer);

  try {
    let result;
    if (kind === "photo") result = optimizeImage(tmpFile, outDir, base);
    else if (kind === "video") result = optimizeVideo(tmpFile, outDir, base);
    else if (kind === "audio") result = optimizeAudio(tmpFile, outDir, base, ext);
    else {
      const outName = ensureUnique(outDir, base, ext || ".bin");
      const outPath = path.join(outDir, outName);
      fs.copyFileSync(tmpFile, outPath);
      result = { path: outPath, note: "Неизвестный тип файла — сохранён как есть" };
    }
    return {
      kind,
      src: relFromRoot(result.path),
      poster: result.poster ? relFromRoot(result.poster) : null,
      size: fs.statSync(result.path).size,
      note: result.note || null
    };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch (e) { /* временный файл уже убран */ }
  }
}

function remove(relPath) {
  const abs = resolveInsideMedia(relPath);
  if (!fs.existsSync(abs)) throw new Error("Файл не найден");
  fs.unlinkSync(abs);
  return true;
}

module.exports = { list, listFolders, ensureFolder, removeFolder, syncFolders, safeFolderPath, save, remove, MEDIA_DIR, HAS_FFMPEG, HAS_SIPS, slugify };
