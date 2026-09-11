/**
 * ОБОЛОЧКА АВТОНОМНОГО КАЛЬКУЛЯТОРА
 * =================================
 * Сам калькулятор — тот же, что на сайте: pricing-config.js,
 * pricing-calc.js и pricing-ui.js вшиты в этот файл при сборке
 * (standalone/build.js) без единой правки. Здесь только то, чего на
 * сайте нет:
 *
 *   • заглушка window.SiteCommon — единственное, чем pricing-ui.js
 *     цепляется за сайт (экранирование и текущий язык);
 *   • редактор прайса: любые ставки, баллы, пороги и названия правятся
 *     под себя и живут в localStorage этого устройства;
 *   • перенос настроек файлом — чтобы отдать свой прайс на другую
 *     машину или получить чужой;
 *   • переключатель «для себя / для клиента».
 *
 * Ничего никуда не отправляется: страница работает с file:// и без сети.
 */

(function () {
  "use strict";

  var KEY = { over: "calc.overrides", full: "calc.full", pro: "price-pro" };

  /* Исходный прайс — снимок до всех правок. По нему определяется, что
     пользователь менял, и к нему возвращает «Сбросить». */
  var DEFAULTS = JSON.parse(JSON.stringify(window.PRICING_CONFIG));

  /* pricing-ui.js обращается к сайту ровно двумя вещами. */
  window.SiteCommon = {
    state: { lang: "ru" },
    esc: function (str) {
      return String(str === undefined || str === null ? "" : str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
  };

  /* ---------- Хранилище ----------
     Chrome не даёт странице, открытой напрямую из файла (file://),
     обращаться к localStorage — бросает SecurityError. Safari и Firefox
     дают. Поэтому хранилище с запасным вариантом: если постоянное
     недоступно, правки живут в памяти вкладки, а пользователю честно
     сказано, что сохранить их можно только файлом. */

  var memory = {};
  var persistent = (function () {
    try {
      localStorage.setItem("__probe", "1");
      localStorage.removeItem("__probe");
      return true;
    } catch (e) { return false; }
  })();

  function read(key) {
    if (!persistent) return key in memory ? memory[key] : null;
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function write(key, value) {
    if (!persistent) {
      if (value === null) delete memory[key]; else memory[key] = value;
      return;
    }
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      persistent = false;
      write(key, value);
    }
  }

  /* Ключ режима общий с pricing-ui.js, а тот читает его сырой строкой,
     без JSON. Поэтому у режима своя пара функций: обёрнутое в кавычки
     "1" калькулятор за единицу не считает. */
  function readMode() {
    if (!persistent) return KEY.pro in memory ? memory[KEY.pro] : null;
    try { return localStorage.getItem(KEY.pro); } catch (e) { return null; }
  }
  function writeMode(value) {
    if (!persistent) {
      if (value === null) delete memory[KEY.pro]; else memory[KEY.pro] = value;
      return;
    }
    try {
      if (value === null) localStorage.removeItem(KEY.pro);
      else localStorage.setItem(KEY.pro, value);
    } catch (e) { persistent = false; writeMode(value); }
  }

  /* ---------- Пути внутри конфига ---------- */

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc === undefined || acc === null ? undefined : acc[key];
    }, obj);
  }
  function setPath(obj, path, value) {
    var keys = path.split(".");
    var last = keys.pop();
    var host = keys.reduce(function (acc, key) { return acc[key]; }, obj);
    if (host) host[last] = value;
  }

  /**
   * Действующий прайс. Правки хранятся двумя способами:
   *   overrides — точечные, «путь → значение». Переживают обновление
   *     калькулятора: новые поля шаблона подхватятся сами.
   *   full — прайс целиком. Появляется после правки JSON или загрузки
   *     чужого файла и имеет приоритет.
   */
  function buildConfig() {
    var full = read(KEY.full);
    if (full) return full;
    var cfg = JSON.parse(JSON.stringify(DEFAULTS));
    var over = read(KEY.over) || {};
    Object.keys(over).forEach(function (path) { setPath(cfg, path, over[path]); });
    return cfg;
  }

  function isEdited() {
    if (read(KEY.full)) return true;
    var over = read(KEY.over);
    return !!(over && Object.keys(over).length);
  }

  function isPathEdited(path) {
    var full = read(KEY.full);
    if (full) return JSON.stringify(getPath(full, path)) !== JSON.stringify(getPath(DEFAULTS, path));
    var over = read(KEY.over) || {};
    return Object.prototype.hasOwnProperty.call(over, path);
  }

  /** Запись одного поля. Значение, совпавшее с исходным, правкой не считается. */
  function edit(path, value) {
    var full = read(KEY.full);
    if (full) {
      setPath(full, path, value);
      write(KEY.full, full);
    } else {
      var over = read(KEY.over) || {};
      if (JSON.stringify(value) === JSON.stringify(getPath(DEFAULTS, path))) delete over[path];
      else over[path] = value;
      write(KEY.over, Object.keys(over).length ? over : null);
    }
  }

  /* ---------- Применение ---------- */

  var host, editedNote;

  function applyConfig() {
    window.PRICING_CONFIG = buildConfig();
    window.PricingUI.mount(host);
    editedNote.hidden = !isEdited();
  }

  /* Значение записывается сразу, а пересборка сметы откладывается: она
     тяжелее ввода одного знака. Раньше отложены были обе операции разом,
     и правка соседнего поля отменяла запись предыдущего. */
  var applyTimer = null;
  function scheduleApply() {
    clearTimeout(applyTimer);
    applyTimer = setTimeout(applyConfig, 220);
  }

  /* Разбор и показ значений — из общей схемы: там же они у админки,
     и расходиться им нельзя. */
  var KIND = window.PricingSchema.KIND;

  /* ---------- Разметка редактора ---------- */

  var esc = window.SiteCommon.esc;

  /**
   * Какие поля показывать, решает js/pricing-schema.js, а не список
   * внутри этого файла. Список был здесь — и разъехался с админкой:
   * права, налог и приёмка проекта появились в прайсе, а в настройках
   * автономной версии их было не найти.
   */
  function fieldHTML(fl) {
    var value = KIND[fl.kind].show(getPath(buildConfig(), fl.path));
    return '<label class="set-field' + (fl.wide ? " set-field--wide" : "") + '">' +
      "<span>" + esc(fl.label) + "</span>" +
      '<input type="text" inputmode="' + (fl.kind === "text" ? "text" : "decimal") + '"' +
        ' value="' + esc(value) + '" data-path="' + esc(fl.path) + '" data-kind="' + fl.kind + '"' +
        (isPathEdited(fl.path) ? ' class="is-edited"' : "") + ">" +
    "</label>";
  }

  function blockHTML(blk) {
    return '<div class="set-block">' +
      '<span class="set-block-title">' + esc(blk.title) + "</span>" +
      (blk.note ? '<span class="set-block-note">' + esc(blk.note) + "</span>" : "") +
      '<div class="set-row">' + blk.fields.map(fieldHTML).join("") + "</div></div>";
  }

  function groupHTML(group) {
    return "<details class=\"set-group\"" + (group.open ? " open" : "") + ">" +
      "<summary>" + esc(group.title) +
        (group.note ? '<span class="set-group-note">' + esc(group.note) + "</span>" : "") +
      "</summary>" +
      '<div class="set-body">' + group.blocks.map(blockHTML).join("") + "</div></details>";
  }

  /* Правка структуры — добавить этап, тип работы или вопрос — полями не
     делается: там меняется не значение, а форма прайса. Для этого есть
     JSON целиком, и после него прайс хранится полным снимком. */
  function jsonGroupHTML(cfg) {
    return groupHTML({
      title: "Весь прайс в JSON", note: "для структурных правок", blocks: []
    }).replace('<div class="set-body"></div>',
      '<div class="set-body">' +
        '<div class="set-block set-json">' +
          '<span class="set-block-note">Здесь можно добавить этап, тип работы или вопрос — ' +
          'то, чего нет в полях выше. После применения прайс сохраняется целиком, ' +
          'и обновление калькулятора новых полей уже не принесёт: чтобы вернуться ' +
          'к обычному режиму, нажмите «Сбросить».</span>' +
          '<textarea spellcheck="false" id="jsonBox">' + esc(JSON.stringify(cfg, null, 2)) + "</textarea>" +
          '<div class="set-json-actions">' +
            '<button type="button" class="app-btn" data-json-apply>Применить JSON</button>' +
            '<button type="button" class="app-btn" data-json-revert>Вернуть текущий</button>' +
            '<span class="set-json-status" id="jsonStatus"></span>' +
          "</div>" +
        "</div>" +
      "</div>");
  }

  function renderSettings() {
    var cfg = buildConfig();
    document.getElementById("settingsBody").innerHTML =
      '<p class="set-intro">Меняйте что угодно — расчёт пересобирается сразу. ' +
      'Правки хранятся в браузере этого устройства; изменённые поля подсвечены. ' +
      '«Сохранить в файл» выгружает ваш прайс целиком — им можно поделиться ' +
      'или перенести на другое устройство.</p>' +
      window.PricingSchema.build(cfg).map(groupHTML).join("") +
      jsonGroupHTML(cfg);
  }

  /* ---------- Перенос настроек файлом ---------- */

  /* Страница, открытая внутри рамки (по ссылке — она всегда в рамке),
     скачивать файлы не может: браузер гасит такую попытку молча, без
     ошибки. Проверяем заранее, чтобы не обещать кнопкой того, чего не
     будет, — и вместо файла кладём прайс в буфер обмена. */
  var canDownload = (function () {
    try { return window.self === window.top; } catch (e) { return false; }
  })();

  function exportConfig() {
    var text = JSON.stringify(buildConfig(), null, 2);

    if (canDownload) {
      try {
        var url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
        var a = document.createElement("a");
        a.href = url; a.download = "прайс-калькулятора.json";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        notify("Прайс сохранён в файл «прайс-калькулятора.json»", "good");
        return;
      } catch (e) { /* ниже — запасной путь через буфер */ }
    }

    showJson(text);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { notify("Прайс скопирован в буфер обмена. Его же видно в поле «Весь прайс в JSON» внизу.", "good"); },
        function () { notify("Прайс открыт в поле «Весь прайс в JSON» внизу — выделите его и скопируйте.", null); }
      );
    } else {
      notify("Прайс открыт в поле «Весь прайс в JSON» внизу — выделите его и скопируйте.", null);
    }
  }

  /** Разворачивает секцию с JSON и подставляет туда текст. */
  function showJson(text) {
    var box = document.getElementById("jsonBox");
    if (!box) return;
    var group = box.closest(".set-group");
    if (group) group.open = true;
    box.value = text;
    box.scrollIntoView({ block: "center" });
    box.focus();
    box.select();
  }

  /** Ответ на действие. Заменяет alert(): диалоги в песочнице недоступны. */
  function notify(text, kind) {
    var node = document.getElementById("sheetStatus");
    if (!node) return;
    node.textContent = text;
    node.className = "sheet-status" + (kind ? " is-" + kind : "");
    node.hidden = !text;
  }

  function looksLikeConfig(obj) {
    return obj && Array.isArray(obj.modules) && Array.isArray(obj.workTypes) &&
           obj.category && Array.isArray(obj.category.questions) &&
           Array.isArray(obj.urgency) && typeof obj.minimum === "number";
  }

  function importConfig(text) {
    var parsed;
    try { parsed = JSON.parse(text); } catch (e) { return "Это не JSON: " + e.message; }
    if (!looksLikeConfig(parsed)) return "Файл не похож на прайс калькулятора";
    write(KEY.full, parsed);
    write(KEY.over, null);
    applyConfig();
    renderSettings();
    return null;
  }

  function status(text, kind) {
    var node = document.getElementById("jsonStatus");
    if (!node) return;
    node.textContent = text;
    node.className = "set-json-status" + (kind ? " is-" + kind : "");
  }

  /* ---------- Панель ---------- */

  function openSettings() {
    renderSettings();
    document.getElementById("settings").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeSettings() {
    document.getElementById("settings").hidden = true;
    document.body.style.overflow = "";
  }

  function resetAll() {
    write(KEY.over, null);
    write(KEY.full, null);
    applyConfig();
    /* Форма перерисовывается всегда, а не только при открытой панели:
       сброс со второй кнопки — в плашке «прайс изменён» — оставлял
       в полях стёртые значения до следующего открытия настроек. */
    renderSettings();
    notify("Исходный прайс возвращён", "good");
  }

  /**
   * Сброс подтверждается вторым нажатием той же кнопки. Системный
   * confirm() в песочнице может быть выключен, и тогда подтверждения
   * не спросят вовсе — а стереть чужие правки без вопроса нельзя.
   */
  var armed = null;
  function armReset(button) {
    if (armed === button) {
      disarm();
      resetAll();
      return;
    }
    disarm();
    armed = button;
    button.dataset.label = button.textContent;
    button.textContent = "Точно сбросить?";
    button.classList.add("is-armed");
    setTimeout(function () { if (armed === button) disarm(); }, 5000);
  }
  function disarm() {
    if (!armed) return;
    armed.textContent = armed.dataset.label || "Сбросить";
    armed.classList.remove("is-armed");
    armed = null;
  }

  /* ---------- Запуск ---------- */

  function init() {
    host = document.getElementById("calcHost");
    editedNote = document.getElementById("editedNote");

    /* По умолчанию инструмент открывается «для себя»: это личный
       калькулятор, а не витрина. */
    if (readMode() === null) writeMode("1");
    var pro = readMode() === "1";
    document.getElementById(pro ? "mode-exact" : "mode-range").checked = true;

    if (!persistent) document.getElementById("storageNote").hidden = false;
    if (!canDownload) {
      document.querySelector("[data-export]").textContent = "Скопировать прайс";
      document.querySelector("[data-import]").textContent = "Загрузить прайс";
    }

    if (!persistent && location.hash !== "#pro" && location.hash !== "#pro-off") {
      history.replaceState(null, "", location.pathname + location.search + (pro ? "#pro" : "#pro-off"));
    }

    applyConfig();

    document.getElementById("openSettings").addEventListener("click", openSettings);

    document.addEventListener("change", function (e) {
      if (e.target.name === "app-mode") setMode(e.target.id === "mode-exact");
    });

    document.getElementById("settingsBody").addEventListener("input", function (e) {
      var input = e.target;
      var path = input.getAttribute && input.getAttribute("data-path");
      if (!path) return;
      var value = KIND[input.getAttribute("data-kind")].parse(input.value);
      if (value === null) return;     /* поле стирают, чтобы ввести заново */
      edit(path, value);
      input.classList.toggle("is-edited", isPathEdited(path));
      editedNote.hidden = !isEdited();
      scheduleApply();
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) { closeSettings(); return; }
      var reset = e.target.closest("[data-reset]");
      if (reset) { armReset(reset); return; }
      disarm();
      if (e.target.closest("[data-export]")) { exportConfig(); return; }
      if (e.target.closest("[data-import]")) { document.getElementById("importFile").click(); return; }
      if (e.target.closest("[data-json-revert]")) {
        document.getElementById("jsonBox").value = JSON.stringify(buildConfig(), null, 2);
        status("");
        return;
      }
      if (e.target.closest("[data-json-apply]")) {
        var problem = importConfig(document.getElementById("jsonBox").value);
        status(problem || "Прайс применён", problem ? "bad" : "good");
      }
    });

    document.getElementById("importFile").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var problem = importConfig(String(reader.result));
        notify(problem ? "Не вышло загрузить прайс. " + problem : "Прайс загружен", problem ? "bad" : "good");
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !document.getElementById("settings").hidden) closeSettings();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
