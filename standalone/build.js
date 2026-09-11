/**
 * СБОРКА АВТОНОМНОГО КАЛЬКУЛЯТОРА
 * ===============================
 * Собирает один самодостаточный HTML-файл: разметка, стили, шрифты и
 * скрипты внутри, ни одного внешнего запроса. Файл открывается двойным
 * кликом, работает без интернета и пересылается как вложение.
 *
 * Запуск: npm run build:calc
 *
 * Логика расчёта НЕ дублируется: js/pricing-config.js, js/pricing-calc.js,
 * js/pricing-schema.js и js/pricing-ui.js вшиваются дословно. Поэтому пересмотр цен на сайте
 * достаточно повторить одной пересборкой — расхождения между сайтом и
 * автономной версией не будет.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(__dirname, "Калькулятор-стоимости.html");
/* Вторая сборка — для публикации ссылкой. Отличается только обёрткой:
   страницу-артефакт заворачивают в свой скелет, поэтому <!doctype>,
   <html>, <head> и <body> писать нельзя, а <title> и <style> идут
   первыми строками файла. Содержимое обеих сборок одно и то же. */
const OUT_PAGE = path.join(__dirname, "artifact-page.html");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ---------- Шрифты в base64 ----------
   Подмножества те же, что на сайте: кириллица и латиница отдельно, чтобы
   браузер тянул только нужное. Здесь тянуть неоткуда, но unicode-range
   всё равно нужен — он разводит два файла одной гарнитуры. */
const CYRILLIC = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, " +
              "U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, " +
              "U+2212, U+2215, U+FEFF, U+FFFD";

const FONTS = [
  { family: "Unbounded", weight: "400 900", file: "unbounded-cyrillic-normal-400-900.woff2", range: CYRILLIC },
  { family: "Unbounded", weight: "400 900", file: "unbounded-latin-normal-400-900.woff2", range: LATIN },
  { family: "Jost", weight: "200 700", file: "jost-cyrillic-normal-200-700.woff2", range: CYRILLIC },
  { family: "Jost", weight: "200 700", file: "jost-latin-normal-200-700.woff2", range: LATIN }
];

function fontFaces() {
  return FONTS.map((f) => {
    const data = fs.readFileSync(path.join(ROOT, "assets/fonts", f.file)).toString("base64");
    return `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};` +
           `font-display:swap;src:url(data:font/woff2;base64,${data}) format('woff2');` +
           `unicode-range:${f.range};}`;
  }).join("\n");
}

/* ---------- Куски стилей сайта ----------
   Берём ровно два блока: токены темы и стили калькулятора. Всё
   остальное (шапка сайта, hero, портфолио) здесь не нужно. */
function sliceStyles() {
  const css = read("css/styles.css");

  const tokensStart = css.indexOf(":root {");
  const tokensEnd = css.indexOf("\n}", tokensStart);
  if (tokensStart < 0 || tokensEnd < 0) throw new Error("не найден блок :root в css/styles.css");
  const tokens = css.slice(tokensStart, tokensEnd + 2);

  const calcStart = css.indexOf("   ПРИНЦИП РАСЧЁТА И КАЛЬКУЛЯТОР");
  const calcEnd = css.indexOf("/* ---------- Отзывы ---------- */");
  if (calcStart < 0 || calcEnd < 0) throw new Error("не найден блок калькулятора в css/styles.css");
  const calc = css.slice(css.lastIndexOf("/*", calcStart), calcEnd);

  return { tokens, calc };
}

function build() {
  const { tokens, calc } = sliceStyles();
  const config = read("js/pricing-config.js");
  const version = (config.match(/version:\s*"([^"]+)"/) || [, "—"])[1];

  const favicon = "data:image/svg+xml;base64," +
    fs.readFileSync(path.join(ROOT, "favicon.svg")).toString("base64");

  const shell = read("standalone/shell.html").replace("<!--VERSION-->", version);

  const styles = `<style>
${fontFaces()}

${tokens}

${calc}
${read("standalone/app.css")}
</style>`;

  /* Правки из админки вшиваются сразу за прайсом: иначе на телефоне
     оставались бы старые ставки, а на сайте новые. Снимок «до всех
     правок» внутри автономной версии берётся уже после них — значит
     «Сбросить» возвращает к тому, по чему сайт считает сегодня, а не
     к тому, что записано в pricing-config.js. */
  const scripts = [config, read("js/pricing-overrides.js"),
                   read("js/pricing-calc.js"), read("js/pricing-schema.js"),
                   read("js/pricing-ui.js"), read("standalone/app.js")]
    .map((code) => `<script>\n${code}\n</script>`).join("\n");

  fs.writeFileSync(OUT_PAGE,
    `<title>Калькулятор оркестровых работ</title>\n${styles}\n${shell}\n${scripts}\n`, "utf8");

  const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Калькулятор стоимости — оркестровые работы</title>
<meta name="description" content="Расчёт предварительной стоимости оркестровых аранжировок, нотного набора, клика и плейбэка. Работает без интернета, прайс настраивается под себя.">
<meta name="theme-color" content="#17151a">
<meta name="color-scheme" content="dark">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Калькулятор">
<link rel="icon" href="${favicon}">
<link rel="apple-touch-icon" href="${favicon}">
${styles}
</head>
<body>
${shell}
${scripts}
</body>
</html>
`;

  fs.writeFileSync(OUT, html, "utf8");
  const kb = (f) => Math.round(fs.statSync(f).size / 1024);
  console.log(`✓ ${path.basename(OUT)} — ${kb(OUT)} КБ, прайс ${version}`);
  console.log(`✓ ${path.basename(OUT_PAGE)} — ${kb(OUT_PAGE)} КБ, для публикации ссылкой`);
}

build();
