/**
 * Тесты расчёта стоимости. Запуск: npm test
 *
 * Зависимостей нет намеренно: сайт статический, сборки в проекте не
 * заведено, и заводить её ради одного файла тестов не нужно.
 *
 * Что проверяется: порядок применения коэффициентов, пороги категорий,
 * надбавка за число номеров, минимальный заказ, взаимоисключения этапов
 * и границы, на которых формулы переключаются. Именно эти места ломаются
 * при пересмотре цен.
 */

const assert = require("assert");
const path = require("path");

global.window = {};
require(path.join(__dirname, "..", "js", "pricing-config.js"));
const config = global.window.PRICING_CONFIG;
const Calc = require(path.join(__dirname, "..", "js", "pricing-calc.js"));

let passed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    failures.push({ name, err });
  }
}

/** Базовый набор: категория задана вручную, чтобы тест ставки не зависел
    ещё и от анкеты; один номер, чтобы надбавка за комплект не мешала. */
function input(over) {
  return Object.assign({
    category: "B",
    answers: {},
    minutes: 10,
    pieces: 1,
    modules: {},
    urgency: "normal",
    sources: false,
    extraRevisions: 0
  }, over);
}

/**
 * Итог «к оплате» из суммы за работу. Тесты ниже проверяют музыкальную
 * часть сметы — порядок множителей, ставки, надбавку за номера, — а
 * хвост у неё всегда один и тот же: приёмка проекта фиксом, потом
 * gross-up налога. Держать его в каждом ожидаемом значении руками
 * значит менять два десятка чисел при каждой правке ставки НПД.
 */
function payable(work, over) {
  const o = Object.assign({ tax: 0.04, contract: 0, revisions: 0 }, over);
  return Math.round((work + o.revisions + config.intake.amount + o.contract) / (1 - o.tax));
}

/* ---------- Категория: относительная шкала ---------- */

test("вопросы отбираются по выбранным этапам", () => {
  const forScore = Calc.activeQuestions({ m2: true }, config).map((q) => q.id);
  assert.deepStrictEqual(forScore, ["ensemble", "texture", "choir", "percussion", "rare", "meter"]);

  const forEngraving = Calc.activeQuestions({ m8: true }, config).map((q) => q.id);
  assert.deepStrictEqual(forEngraving, ["ensemble", "texture"]);
  assert.ok(!forEngraving.includes("choir"), "хор при нотном наборе не спрашивают");

  const forTranscription = Calc.activeQuestions({ m1: true }, config).map((q) => q.id);
  assert.ok(forTranscription.includes("recording"), "про качество записи спрашивают только при снятии");
  assert.ok(!Calc.activeQuestions({ m2: true }, config).map((q) => q.id).includes("recording"));
});

test("состояние исходника спрашивают один раз — в самом этапе, а не в анкете", () => {
  const ids = config.category.questions.map((q) => q.id);
  assert.ok(!ids.includes("source"), "вопрос анкеты дублировал выбор варианта у набора");
  const engraving = config.modules.find((m) => m.id === "m8");
  assert.deepStrictEqual(engraving.variants.map((v) => v.id), ["file", "manuscript", "draft"]);
});

test("максимум баллов зависит от набора вопросов", () => {
  assert.strictEqual(Calc.maxScore({ m2: true }, config), 14);
  assert.strictEqual(Calc.maxScore({ m8: true }, config), 6);
  assert.strictEqual(Calc.maxScore({ m4: true }, config), 5);
});

test("на полном наборе шкала совпадает с прежней: 0–3 A, 4–7 B, 8–10 C, 11+ D", () => {
  const at = (score) => Calc.categoryForScore(score, 14, config);
  assert.strictEqual(at(0), "A");
  assert.strictEqual(at(3), "A");
  assert.strictEqual(at(4), "B");
  assert.strictEqual(at(7), "B");
  assert.strictEqual(at(8), "C");
  assert.strictEqual(at(10), "C");
  assert.strictEqual(at(11), "D");
  assert.strictEqual(at(14), "D");
});

test("короткая анкета даёт те же категории пропорционально", () => {
  /* Восемь баллов из восьми — это максимум, а не «середина»: на полном
     наборе те же восемь дали бы всего C. */
  assert.strictEqual(Calc.categoryForScore(8, 8, config), "D");
  assert.strictEqual(Calc.categoryForScore(8, 14, config), "C");
  assert.strictEqual(Calc.categoryForScore(0, 8, config), "A");
});

test("категория считается из анкеты, когда не задана вручную", () => {
  const r = Calc.calculate(
    input({ category: null, modules: { m2: true },
            answers: { ensemble: 3, texture: 3, choir: 2, percussion: 1 } }),
    config
  );
  assert.strictEqual(r.score, 9);
  assert.strictEqual(r.maxScore, 14);
  assert.strictEqual(r.category, "C");
});

test("баллы по вопросам, выключённым вместе с этапом, в сумму не идут", () => {
  /* Ответ про хор остаётся в состоянии формы, но при нотном наборе
     вопрос не показан — и утяжелять категорию он не должен. */
  const answers = { ensemble: 1, texture: 1, choir: 2, percussion: 2 };
  const engraving = Calc.calculate(input({ category: null, modules: { m8: true }, answers }), config);
  assert.strictEqual(engraving.score, 2, "считаются только ensemble и texture");
  assert.strictEqual(engraving.maxScore, 6);
});

/* ---------- Ставки этапов ---------- */

test("оркестровка: ставка категории × минуты", () => {
  const r = Calc.calculate(input({ minutes: 12, modules: { m2: true } }), config);
  assert.strictEqual(r.lines.find((l) => l.id === "m2").amount, 9000 * 12);
});

test("дробный хронометраж считается без округления промежутков", () => {
  const r = Calc.calculate(input({ minutes: 15.7, modules: { m2: true } }), config);
  assert.strictEqual(r.lines[0].amount, 9000 * 15.7);
});

test("снятие на слух в одиночку идёт по полной ставке", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m1: true } }), config);
  assert.strictEqual(r.lines[0].amount, 4000 * 10);
});

test("снятие вместе с оркестровкой — 70% ставки", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m1: true, m2: true } }), config);
  const m1 = r.lines.find((l) => l.id === "m1");
  assert.strictEqual(m1.rate, 4000 * 0.7);
  assert.ok(m1.discounted);
});

test("у снятия своя длительность, если задана отдельно", () => {
  const r = Calc.calculate(input({ minutes: 10, sourceMinutes: 14, modules: { m1: true } }), config);
  assert.strictEqual(r.lines[0].amount, 4000 * 14);
});

/* ---------- Аудиоверсия партитуры ---------- */

test("аудиоверсия в связке идёт по одной низкой ставке, без категорий", () => {
  ["m1", "m2", "m8"].forEach((neighbour) => {
    const r = Calc.calculate(
      input({ category: "D", minutes: 10, pages: 1, modules: { m9: true, [neighbour]: true } }), config);
    const line = r.lines.find((l) => l.id === "m9");
    assert.strictEqual(line.rate, 1000, `рядом с ${neighbour} ставка должна быть льготной`);
    assert.ok(line.bundled, "строка помечается как идущая в связке");
  });
});

test("аудиоверсия отдельно считается по категории и состоянию исходника", () => {
  const withProject = Calc.calculate(
    input({ category: "B", minutes: 10, modules: { m9: true }, variants: { m9: "project" } }), config);
  assert.strictEqual(withProject.lines[0].rate, 2500);
  assert.strictEqual(withProject.lines[0].bundled, false);

  const fromScore = Calc.calculate(
    input({ category: "B", minutes: 10, modules: { m9: true }, variants: { m9: "score" } }), config);
  assert.strictEqual(fromScore.lines[0].rate, 2500 * 1.6, "по нотам ноты сначала надо внести в проект");
});

test("отдельная аудиоверсия дороже той, что идёт в связке", () => {
  const alone = Calc.calculate(input({ category: "B", minutes: 10, modules: { m9: true } }), config);
  const bundled = Calc.calculate(
    input({ category: "B", minutes: 10, modules: { m9: true, m2: true } }), config);
  const bundledLine = bundled.lines.find((l) => l.id === "m9");
  assert.ok(bundledLine.amount < alone.lines[0].amount);
});

test("адаптация — половина ставки оркестровки по категории", () => {
  const r = Calc.calculate(input({ category: "D", minutes: 10, modules: { m7: true } }), config);
  assert.strictEqual(r.lines.find((l) => l.id === "m7").amount, 15000 * 0.5 * 10);
});

/* ---------- Саунд-дизайн как надбавка к плейбэку ---------- */

test("саунд-дизайн больше не отдельный этап", () => {
  assert.strictEqual(config.modules.find((m) => m.id === "m6"), undefined);
  const playback = config.modules.find((m) => m.id === "m5");
  assert.ok(playback.addons.some((a) => a.id === "sound"), "он живёт надбавкой внутри плейбэка");
});

test("саунд-дизайн добавляет 40% к плейбэку, а не отдельную строку", () => {
  const plain = Calc.calculate(input({ minutes: 10, modules: { m5: true } }), config);
  const withSound = Calc.calculate(
    input({ minutes: 10, modules: { m5: true }, addons: { "m5:sound": true } }), config);
  assert.strictEqual(plain.lines.length, 1);
  assert.strictEqual(withSound.lines.length, 1, "строк по-прежнему одна");
  assert.strictEqual(withSound.lines[0].amount, plain.lines[0].amount * 1.4);
  assert.strictEqual(withSound.lines[0].addonFactor, 1.4);
});

/* ---------- Структура программы: порог на десяти минутах ---------- */

test("структура программы до 10 минут — фиксированная сумма", () => {
  const r = Calc.calculate(input({ minutes: 8, modules: { m3: true } }), config);
  assert.strictEqual(r.modulesSubtotal, 15000);
});

test("ровно 10 минут — ещё без доплаты", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m3: true } }), config);
  assert.strictEqual(r.modulesSubtotal, 15000);
});

test("свыше 10 минут — доплата за каждую минуту сверх", () => {
  const r = Calc.calculate(input({ minutes: 25, modules: { m3: true } }), config);
  assert.strictEqual(r.modulesSubtotal, 15000 + 1500 * 15);
});

test("структура программы не тянет за собой сдачу комплекта", () => {
  const r = Calc.calculate(input({ minutes: 25, pieces: 8, modules: { m3: true } }), config);
  assert.strictEqual(r.delivery, null, "нот она не производит");
});

/* ---------- Надбавка за число номеров ---------- */

test("десять коротких номеров дороже одного длинного той же длительности", () => {
  const one = Calc.calculate(input({ minutes: 30, pieces: 1, modules: { m2: true } }), config);
  const ten = Calc.calculate(input({ minutes: 30, pieces: 10, modules: { m2: true } }), config);
  assert.strictEqual(one.lines[0].amount, ten.lines[0].amount, "музыки поровну");
  assert.ok(ten.total > one.total, "но комплектов десять, а не один");
  assert.strictEqual(ten.total - one.total, payable(4000 * 9) - payable(0));
});

test("сдача комплекта считается по категории и числу номеров", () => {
  const r = Calc.calculate(input({ category: "C", minutes: 12, pieces: 4, modules: { m2: true } }), config);
  assert.strictEqual(r.delivery.rate, 6000);
  assert.strictEqual(r.delivery.amount, 6000 * 4);
  assert.strictEqual(r.modulesSubtotal, 12000 * 12 + 6000 * 4);
});

test("сдача комплекта появляется только там, где рождаются ноты", () => {
  assert.strictEqual(Calc.calculate(input({ minutes: 10, pieces: 5, modules: { m4: true } }), config).delivery, null);
  assert.strictEqual(Calc.calculate(input({ minutes: 10, pieces: 5, modules: { m5: true } }), config).delivery, null);
  assert.strictEqual(Calc.calculate(input({ minutes: 10, pieces: 5, modules: { m9: true } }), config).delivery, null);
  assert.ok(Calc.calculate(input({ minutes: 10, pieces: 5, modules: { m1: true } }), config).delivery);
  assert.ok(Calc.calculate(input({ minutes: 10, pieces: 5, modules: { m7: true } }), config).delivery);
});

test("у нотного набора вывод уже сидит в ставке", () => {
  const r = Calc.calculate(
    input({ pieces: 6, modules: { m8: true }, units: { m8: "piece" }, variants: { m8: "file" } }), config);
  assert.strictEqual(r.delivery, null, "иначе комплект посчитался бы дважды");
  assert.strictEqual(r.modulesSubtotal, 12000 * 6);
});

test("сдача комплекта попадает под срочность вместе со всем остальным", () => {
  const r = Calc.calculate(
    input({ minutes: 10, pieces: 3, modules: { m2: true }, urgency: "rush" }), config);
  assert.strictEqual(r.total, payable((9000 * 10 + 4000 * 3) * 1.3));
});

/* ---------- Нотный набор ---------- */

test("нотный набор меряется страницами, минутами или номерами", () => {
  const perPage = Calc.calculate(
    input({ pages: 20, modules: { m8: true }, units: { m8: "page" }, variants: { m8: "file" } }), config);
  assert.strictEqual(perPage.modulesSubtotal, 500 * 20);

  const perMinute = Calc.calculate(
    input({ minutes: 12, modules: { m8: true }, units: { m8: "minute" }, variants: { m8: "file" } }), config);
  assert.strictEqual(perMinute.modulesSubtotal, 3000 * 12);

  const perPiece = Calc.calculate(
    input({ pieces: 3, modules: { m8: true }, units: { m8: "piece" }, variants: { m8: "file" } }), config);
  assert.strictEqual(perPiece.modulesSubtotal, 12000 * 3);
});

test("одна и та же работа в разных единицах не путает величины", () => {
  /* Страницы не должны утекать в расчёт по минутам и наоборот. */
  const r = Calc.calculate(
    input({ pages: 99, minutes: 12, pieces: 7, modules: { m8: true },
            units: { m8: "minute" }, variants: { m8: "file" } }), config);
  assert.strictEqual(r.lines[0].quantity, 12);
  assert.strictEqual(r.lines[0].unit, "minute");
});

test("состояние оригинала поднимает ставку в любой единице", () => {
  const unit = config.modules.find((m) => m.id === "m8").units.find((u) => u.id === "page");
  assert.ok(unit.rate.file < unit.rate.manuscript && unit.rate.manuscript < unit.rate.draft);

  const draft = Calc.calculate(
    input({ pages: 10, modules: { m8: true }, units: { m8: "page" }, variants: { m8: "draft" } }), config);
  assert.strictEqual(draft.modulesSubtotal, unit.rate.draft * 10);
});

test("нотная подготовка добавляет 30% к ставке набора", () => {
  const plain = Calc.calculate(
    input({ pages: 20, modules: { m8: true }, units: { m8: "page" }, variants: { m8: "manuscript" } }), config);
  const withParts = Calc.calculate(
    input({ pages: 20, modules: { m8: true }, units: { m8: "page" }, variants: { m8: "manuscript" },
            addons: { "m8:parts": true } }), config);
  assert.strictEqual(withParts.modulesSubtotal, plain.modulesSubtotal * 1.3);
  assert.strictEqual(config.modules.find((m) => m.id === "m8").addons[0].label.ru,
    "Нотная подготовка: комплект партий");
});

test("названия этапов читаются без цехового жаргона", () => {
  const byId = (id) => config.modules.find((m) => m.id === id);
  assert.strictEqual(byId("m8").title.ru, "Нотный набор");
  assert.strictEqual(byId("m9").title.ru, "Аудиоверсия партитуры");
  assert.strictEqual(byId("m3").title.ru, "Структура программы");
  config.modules.forEach((m) => {
    assert.ok(!/MIDI-макет|Драматургия|извлечен/i.test(m.title.ru + m.description.ru),
      `${m.id}: в тексте остался старый термин`);
  });
});

/* ---------- Взаимоисключения ---------- */

test("снятие на слух и нотный набор не совмещаются", () => {
  const conflict = Calc.conflictsFor("m8", { m1: true }, config);
  assert.ok(conflict, "набор гасится снятием");
  assert.strictEqual(conflict.by, "m1");
  assert.ok(Calc.conflictsFor("m1", { m8: true }, config), "и наоборот — конфликт двусторонний");
});

test("оркестровка гасит адаптацию и нотный набор", () => {
  assert.ok(Calc.conflictsFor("m7", { m2: true }, config));
  assert.ok(Calc.conflictsFor("m8", { m2: true }, config));
});

test("совместимые этапы друг друга не блокируют", () => {
  assert.strictEqual(Calc.conflictsFor("m4", { m2: true, m5: true }, config), null);
  assert.strictEqual(Calc.conflictsFor("m9", { m2: true }, config), null);
  assert.strictEqual(Calc.conflictsFor("m2", { m1: true }, config), null, "снять и переложить — нормальная пара");
});

test("конфликтующая пара из старой ссылки не считается дважды", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m2: true, m8: true } }), config);
  assert.strictEqual(r.lines.length, 1);
  assert.strictEqual(r.lines[0].id, "m2");
});

/* ---------- Порядок коэффициентов ---------- */

test("срочность применяется ко всей сумме этапов", () => {
  const r = Calc.calculate(
    input({ minutes: 10, pieces: 1, modules: { m4: true, m5: true }, urgency: "rush" }), config);
  assert.strictEqual(r.total, payable((1500 + 3500) * 10 * 1.3));
});

test("исходники применяются ПОСЛЕ срочности, а не параллельно", () => {
  const r = Calc.calculate(
    input({ minutes: 10, pieces: 1, modules: { m5: true }, urgency: "urgent", sources: true }), config);
  assert.strictEqual(r.total, payable(3500 * 10 * 1.5 * 1.15));
  /* Если бы коэффициенты складывались (×1,65), а не перемножались
     (×1,725), сумма была бы другой — проверяем именно это. */
  assert.notStrictEqual(r.total, payable(3500 * 10 * 1.65));
});

/* ---------- Минимальный заказ ---------- */

test("доплаты до минимального заказа нет — вместо неё приёмка проекта", () => {
  assert.strictEqual(config.minimum, 0);
  assert.strictEqual(config.intake.amount, 3000);
});

test("короткий заказ стоит свою работу плюс приёмку, а не минимум", () => {
  const r = Calc.calculate(input({ minutes: 2, modules: { m4: true } }), config);
  assert.strictEqual(r.minimum.applied, false);
  assert.strictEqual(r.intake.amount, 3000);
  /* Минута клика стоила 1 500 ₽, а показывалась как 10 000 ₽: разрыв
     в шесть раз читался как «мне не хотят продавать». */
  assert.strictEqual(r.total, payable(1500 * 2));
});

test("приёмка не умножается на срочность и на права", () => {
  const plain = Calc.calculate(input({ minutes: 4, modules: { m4: true } }), config);
  const rush = Calc.calculate(
    input({ minutes: 4, modules: { m4: true }, urgency: "urgent", rightsTier: "transfer" }), config);
  assert.strictEqual(plain.intake.amount, rush.intake.amount);
  assert.strictEqual(rush.total, payable(1500 * 4 * 1.5 * 2.5));
});

test("минимум, если его вернуть, применяется последним — к сумме с налогом", () => {
  const withFloor = Object.assign({}, config, { minimum: 40000 });
  const r = Calc.calculate(input({ minutes: 2, modules: { m4: true } }), withFloor);
  assert.ok(r.minimum.applied);
  assert.strictEqual(r.minimum.before, payable(1500 * 2));
  assert.strictEqual(r.total, 40000);
});

test("минимум не срабатывает, когда сумма его превысила", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m2: true } }), config);
  assert.strictEqual(r.minimum.applied, false);
});

test("пустой выбор этапов не выставляет минимальный заказ", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: {} }), config);
  assert.ok(r.empty);
  assert.strictEqual(r.minimum.applied, false);
  assert.strictEqual(r.total, 0);
  assert.strictEqual(r.delivery, null);
});

/* ---------- Правки ---------- */

test("дополнительные круги правок добавляются поверх сметы", () => {
  const r = Calc.calculate(input({ minutes: 2, modules: { m4: true }, extraRevisions: 2 }), config);
  assert.strictEqual(r.total, payable(1500 * 2, { revisions: 5000 * 2 }));
});

test("круги правок не умножаются на срочность", () => {
  const r = Calc.calculate(
    input({ minutes: 10, modules: { m2: true }, urgency: "rush", extraRevisions: 1 }), config);
  assert.strictEqual(r.total, payable((9000 * 10 + 4000) * 1.3, { revisions: 5000 }));
});

/* ---------- Публичная вилка ---------- */

test("вилка округляется до тысяч и накрывает расчёт сверху", () => {
  const r = Calc.calculate(input({ minutes: 12, pieces: 1, modules: { m2: true } }), config);
  assert.strictEqual(r.total, payable(9000 * 12 + 4000));
  assert.strictEqual(r.range.low % 1000, 0, "нижняя граница округлена до тысяч");
  assert.strictEqual(r.range.high % 1000, 0, "верхняя тоже");
  assert.strictEqual(r.range.low, Math.floor(r.total / 1000) * 1000);
  assert.strictEqual(r.range.high, Math.ceil((r.total * 1.15) / 1000) * 1000);
  assert.ok(r.range.low <= r.total && r.total <= r.range.high);
});

test("при сработавшем минимуме вилки нет — минимум это твёрдая цифра", () => {
  const withFloor = Object.assign({}, config, { minimum: 40000 });
  const r = Calc.calculate(input({ minutes: 2, modules: { m4: true } }), withFloor);
  assert.strictEqual(r.range.low, 40000);
  assert.strictEqual(r.range.high, 40000);
});

/* ---------- Права на результат ---------- */

test("по умолчанию берётся самая узкая ступень прав", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m2: true } }), config);
  assert.strictEqual(r.rights.tier, "once");
  assert.strictEqual(r.rights.factor, 1);
  assert.strictEqual(r.rights.amount, 0);
});

test("ступени прав идут от разового исполнения к полной передаче", () => {
  const ids = config.rights.tiers.map((t) => t.id);
  assert.deepStrictEqual(ids, ["once", "repertoire", "exclusive", "transfer"]);
  const factors = config.rights.tiers.map((t) => t.factor);
  assert.deepStrictEqual(factors.slice().sort((a, b) => a - b), factors, "коэффициенты только растут");
  assert.strictEqual(config.rights.tiers[0].factor, 1, "разовое исполнение — это база, а не надбавка");
});

test("надбавки к правам складываются со ступенью, а не умножаются на неё", () => {
  const r = Calc.calculate(input({
    minutes: 10, modules: { m2: true },
    rightsTier: "exclusive", rightsAddons: { audiovisual: true }
  }), config);
  /* 1,7 + 0,7 = 2,4. При умножении вышло бы 2,89 — цифра, которую
     нечем объяснить заказчику. */
  assert.strictEqual(r.rights.factor, 2.4);
  assert.strictEqual(r.total, payable((9000 * 10 + 4000) * 2.4));
});

test("права считаются от суммы этапов и складываются со срочностью перемножением", () => {
  const r = Calc.calculate(input({
    minutes: 10, modules: { m2: true }, urgency: "rush", rightsTier: "transfer"
  }), config);
  assert.strictEqual(r.total, payable((9000 * 10 + 4000) * 1.3 * 2.5));
});

test("полная передача прав стоит в два с половиной раза дороже разового исполнения", () => {
  const once = Calc.calculate(input({ minutes: 10, modules: { m2: true } }), config);
  const transfer = Calc.calculate(
    input({ minutes: 10, modules: { m2: true }, rightsTier: "transfer" }), config);
  assert.strictEqual(transfer.rights.factor / once.rights.factor, 2.5);
});

/* ---------- Заказчик, налог и приёмка ---------- */

test("частное лицо и организация различаются налогом и договором, но не ставками", () => {
  const person = Calc.calculate(input({ minutes: 10, modules: { m2: true }, client: "person" }), config);
  const company = Calc.calculate(input({ minutes: 10, modules: { m2: true }, client: "company" }), config);
  assert.strictEqual(person.modulesSubtotal, company.modulesSubtotal, "работа стоит одинаково");
  assert.strictEqual(person.client.tax, 0.04);
  assert.strictEqual(company.client.tax, 0.06);
  assert.strictEqual(person.client.contractFee, 0);
  assert.strictEqual(company.client.contractFee, 4000);
});

test("налог считается gross-up: он внутри цены, а не сверху", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m2: true }, client: "company" }), config);
  const work = 9000 * 10 + 4000;
  assert.strictEqual(r.total, payable(work, { tax: 0.06, contract: 4000 }));
  /* Ровно 6% от итоговой суммы — столько уходит в налог. */
  assert.ok(Math.abs(r.client.taxAmount - r.total * 0.06) < 1);
});

test("разница между частным лицом и организацией — около двух процентов", () => {
  const person = Calc.calculate(input({ minutes: 40, modules: { m2: true }, client: "person" }), config);
  const company = Calc.calculate(input({ minutes: 40, modules: { m2: true }, client: "company" }), config);
  const gap = company.total / person.total - 1;
  assert.ok(gap > 0.02 && gap < 0.04, "иначе клиент читает это как наценку за то, что он организация");
});

test("договорная надбавка не берётся, когда считать нечего", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: {}, client: "company" }), config);
  assert.ok(r.empty);
  assert.strictEqual(r.client.contractFee, 0);
  assert.strictEqual(r.intake, null);
  assert.strictEqual(r.total, 0);
});

/* ---------- Сегментная скидка ---------- */

test("учебная скидка снимает четверть со сметы", () => {
  const plain = Calc.calculate(input({ minutes: 10, modules: { m2: true } }), config);
  const school = Calc.calculate(input({ minutes: 10, modules: { m2: true }, segment: true }), config);
  assert.strictEqual(school.segment.applied, true);
  assert.strictEqual(school.total, payable((9000 * 10 + 4000) * 0.75));
  assert.ok(school.total < plain.total);
});

test("со скидкой объём прав срезается до репертуарного", () => {
  const r = Calc.calculate(input({
    minutes: 10, modules: { m2: true }, segment: true, rightsTier: "transfer"
  }), config);
  assert.strictEqual(r.rights.askedTier, "transfer");
  assert.strictEqual(r.rights.tier, "repertoire", "дешевле отдаётся то, что не пойдёт зарабатывать");
  assert.ok(r.rights.capped);
  assert.strictEqual(r.total, payable((9000 * 10 + 4000) * 1.25 * 0.75));
});

test("скидка снимает коммерческие надбавки, а не только ступень", () => {
  const r = Calc.calculate(input({
    minutes: 10, modules: { m2: true }, segment: true,
    rightsTier: "transfer", rightsAddons: { audiovisual: true, anonymous: true }
  }), config);
  /* «Для школы» и «в рекламу» не могут стоять в одной смете, а вот
     работа без указания авторства скидке не противоречит. */
  assert.deepStrictEqual(r.rights.addons, ["anonymous"]);
  assert.strictEqual(r.rights.factor, 1.25 + 0.25);
});

test("без скидки ступень не срезается", () => {
  const r = Calc.calculate(input({ minutes: 10, modules: { m2: true }, rightsTier: "transfer" }), config);
  assert.strictEqual(r.rights.tier, "transfer");
  assert.strictEqual(r.rights.capped, false);
});

/* ---------- Мелодическая строка ---------- */

test("мелодическая строка дешевле полного снятия", () => {
  const lead = Calc.calculate(input({ minutes: 10, modules: { m10: true } }), config);
  const full = Calc.calculate(input({ minutes: 10, modules: { m1: true } }), config);
  assert.ok(lead.modulesSubtotal < full.modulesSubtotal);
  assert.strictEqual(lead.modulesSubtotal, 2200 * 10);
});

test("мелодическая строка не производит комплекта партий", () => {
  const r = Calc.calculate(input({ minutes: 10, pieces: 5, modules: { m10: true } }), config);
  assert.strictEqual(r.delivery, null, "это один лист, а не партитура с партиями");
});

test("мелодическая строка исключает снятие и нотный набор", () => {
  assert.ok(Calc.conflictsFor("m10", { m1: true }, config), "полное снятие её заменяет");
  assert.ok(Calc.conflictsFor("m10", { m8: true }, config), "набор тоже");
  assert.strictEqual(Calc.conflictsFor("m10", { m2: true }, config), null, "с оркестровкой уживается");
});

/* ---------- Музыка к изображению ---------- */

test("привязка к изображению добавляет 30% к оркестровке", () => {
  const plain = Calc.calculate(input({ minutes: 10, modules: { m2: true } }), config);
  const toPicture = Calc.calculate(
    input({ minutes: 10, modules: { m2: true }, addons: { "m2:picture": true } }), config);
  assert.strictEqual(toPicture.lines[0].amount, plain.lines[0].amount * 1.3);
});

/* ---------- Две строки накладных расходов ---------- */

/** Слова длиннее четырёх букв, огрублённые до первых пяти: «партитуры» и
    «партитура» должны считаться одним словом. */
function stems(text) {
  return String(text).toLowerCase().split(/[^a-zа-яё]+/i)
    .filter((w) => w.length >= 5)
    .map((w) => w.slice(0, 5));
}

test("«Партитура и партии» и «Ведение проекта» не пересекаются ни одним словом", () => {
  /* Заказчик увидел в смете «Оформление и сдача комплекта» рядом с
     «Приём и сдача проекта» и прочитал это как одну работу, посчитанную
     дважды: в обоих заголовках стояло «сдача», в обоих описаниях —
     «сборка». Работа разная, а слова были одни и те же. */
  const a = stems(config.delivery.title.ru + " " + config.delivery.description.ru);
  const b = stems(config.intake.title.ru + " " + config.intake.description.ru);
  const shared = a.filter((w) => b.includes(w));
  assert.deepStrictEqual(shared, [], "строки описаны одними и теми же словами");

  const aEn = stems(config.delivery.title.en + " " + config.delivery.description.en);
  const bEn = stems(config.intake.title.en + " " + config.intake.description.en);
  assert.deepStrictEqual(aEn.filter((w) => bEn.includes(w)), []);
});

test("каждая из двух строк называет свою единицу счёта", () => {
  /* Без этого «за номер» и «за проект» на глаз не различить, а именно
     единица и объясняет, почему строк две. */
  assert.match(config.delivery.description.ru, /на каждый номер/i);
  assert.match(config.intake.description.ru, /один раз на проект/i);
  assert.match(config.delivery.description.en, /per number/i);
  assert.match(config.intake.description.en, /once per project/i);
});

test("нотная строка растёт по номерам, а ведение проекта — нет", () => {
  const one = Calc.calculate(input({ minutes: 20, pieces: 1, modules: { m2: true } }), config);
  const five = Calc.calculate(input({ minutes: 20, pieces: 5, modules: { m2: true } }), config);
  assert.strictEqual(five.delivery.amount, one.delivery.amount * 5);
  assert.strictEqual(five.intake.amount, one.intake.amount, "ведение проекта одно на весь заказ");
});

/* ---------- Схема редактора прайса ---------- */

const Schema = require(path.join(__dirname, "..", "js", "pricing-schema.js"));
const overridesStore = require(path.join(__dirname, "..", "server", "pricing-store.js"));

test("каждый путь схемы существует в прайсе", () => {
  /* Главная проверка этого блока: переименовали ключ в прайсе — редактор
     показал бы пустое поле и записал правку в никуда. */
  const broken = Schema.paths(config).filter((p) => Schema.getPath(config, p) === undefined);
  assert.deepStrictEqual(broken, [], "поля редактора без значения в прайсе");
});

test("схема покрывает права, налог и приёмку", () => {
  const paths = Schema.paths(config);
  assert.ok(paths.includes("rights.tiers.3.factor"), "ступени прав");
  assert.ok(paths.includes("rights.addons.0.factor"), "надбавки к правам");
  assert.ok(paths.includes("client.types.2.tax"), "ставка налога");
  assert.ok(paths.includes("segment.factor"), "учебная скидка");
  assert.ok(paths.includes("intake.amount"), "приём и сдача проекта");
});

test("схема растёт вместе с прайсом, а не задана списком", () => {
  const extended = JSON.parse(JSON.stringify(config));
  extended.modules.push({
    id: "mX", kind: "per-minute-flat",
    title: { ru: "Новый этап" }, description: { ru: "" }, unit: { ru: "" }, rate: 1000
  });
  const paths = Schema.paths(extended);
  assert.ok(paths.includes("modules." + (extended.modules.length - 1) + ".rate"),
    "дописанный в конфиг этап появляется в редакторе сам");
});

test("проценты показываются и читаются обратно без потерь", () => {
  const p = Schema.KIND.percent;
  assert.strictEqual(p.show(0.4), "40");
  assert.strictEqual(p.parse("40"), 0.4);
  assert.strictEqual(p.parse(p.show(0.35)), 0.35);
  /* Запятая — обычный десятичный разделитель в русской раскладке. */
  assert.strictEqual(Schema.KIND.ratio.parse("1,25"), 1.25);
  assert.strictEqual(Schema.KIND.ratio.show(1.25), "1,25");
});

test("правки накладываются, но исходный прайс не трогают", () => {
  const before = config.modules[2].rate.B;
  const patched = Schema.apply(config, { "modules.2.rate.B": 12345 });
  assert.strictEqual(patched.modules[2].rate.B, 12345);
  assert.strictEqual(config.modules[2].rate.B, before, "исходник остался прежним");
});

test("расчёт по прайсу с правками берёт новую ставку", () => {
  const patched = Schema.apply(config, { "modules.2.rate.B": 12000 });
  const r = Calc.calculate(input({ minutes: 10, modules: { m2: true } }), patched);
  assert.strictEqual(r.lines[0].amount, 12000 * 10);
});

/* ---------- Хранилище правок ---------- */

test("хранилище принимает только плоскую карту простых значений", () => {
  assert.doesNotThrow(() => overridesStore.validate({}));
  assert.doesNotThrow(() => overridesStore.validate({ "modules.0.rate.B": 4500 }));
  assert.doesNotThrow(() => overridesStore.validate({ "category.names.A.ru": "Простая" }));

  assert.throws(() => overridesStore.validate(null), /объектом/);
  assert.throws(() => overridesStore.validate([]), /объектом/);
  assert.throws(() => overridesStore.validate({ "a..b": 1 }), /путь/);
  assert.throws(() => overridesStore.validate({ "modules.0": { rate: 1 } }), /числом/);
  assert.throws(() => overridesStore.validate({ "minimum": NaN }), /не число/);
});

/* ---------- Целостность конфига ---------- */

test("у каждого этапа с категорийной ставкой заполнены все четыре категории", () => {
  config.modules
    .filter((m) => m.kind === "per-minute-category")
    .forEach((m) => {
      config.category.order.forEach((cat) => {
        assert.strictEqual(typeof m.rate[cat], "number", `${m.id}: нет ставки для категории ${cat}`);
      });
    });
  config.category.order.forEach((cat) => {
    assert.strictEqual(typeof config.delivery.rate[cat], "number", `сдача комплекта: нет ставки для ${cat}`);
  });
});

test("у этапа с единицами заполнена вся таблица ставок", () => {
  config.modules.filter((m) => m.kind === "per-unit").forEach((m) => {
    assert.ok(m.units && m.units.length, `${m.id}: не задано ни одной единицы`);
    m.units.forEach((u) => {
      assert.ok(u.qtyField, `${m.id}/${u.id}: не сказано, откуда брать количество`);
      assert.ok(u.short && u.short.ru, `${m.id}/${u.id}: нет короткой подписи`);
      m.variants.forEach((v) => {
        assert.strictEqual(typeof u.rate[v.id], "number",
          `${m.id}: нет ставки для «${u.id} × ${v.id}»`);
      });
    });
  });
});

test("ставка в связке объявлена вместе с соседями, которые её включают", () => {
  config.modules.filter((m) => typeof m.bundledRate === "number").forEach((m) => {
    assert.ok(m.bundledWith && m.bundledWith.length, `${m.id}: не сказано, с чем идёт связка`);
    m.bundledWith.forEach((id) =>
      assert.ok(config.modules.some((x) => x.id === id), `${m.id}: связка с несуществующим ${id}`));
    assert.ok(m.bundledRate < Math.min.apply(null, config.category.order.map((c) => m.rate[c])),
      `${m.id}: ставка в связке должна быть ниже любой отдельной`);
  });
});

test("все ссылки между этапами, типами работ и вопросами ведут в существующее", () => {
  const ids = config.modules.map((m) => m.id);
  assert.strictEqual(new Set(ids).size, ids.length, "дубликат id этапа");

  config.workTypes.forEach((w) => {
    w.modules.forEach((id) => assert.ok(ids.includes(id), `тип ${w.id}: нет этапа ${id}`));
    (w.available || []).forEach((id) => assert.ok(ids.includes(id), `тип ${w.id}: доступен несуществующий ${id}`));
    w.modules.forEach((id) => assert.ok(
      !w.available || w.available.includes(id),
      `тип ${w.id}: этап ${id} включён, но не показан`));
    Object.keys(w.addons || {}).forEach((key) => {
      const [modId, addonId] = key.split(":");
      const mod = config.modules.find((m) => m.id === modId);
      assert.ok(mod && (mod.addons || []).some((a) => a.id === addonId), `тип ${w.id}: нет надбавки ${key}`);
    });
  });

  config.modules.filter((m) => m.kind === "share-of-module")
    .forEach((m) => assert.ok(ids.includes(m.ofModule), `${m.id}: ссылка на несуществующий ${m.ofModule}`));
  config.modules.filter((m) => m.discountWith)
    .forEach((m) => assert.ok(ids.includes(m.discountWith.module), `${m.id}: скидка от несуществующего этапа`));
  config.modules.filter((m) => m.conflictsWith)
    .forEach((m) => m.conflictsWith.forEach((id) =>
      assert.ok(ids.includes(id), `${m.id}: конфликт с несуществующим ${id}`)));

  config.category.questions.forEach((q) => {
    assert.ok(q.appliesTo && q.appliesTo.length, `вопрос ${q.id}: не сказано, к каким этапам относится`);
    q.appliesTo.forEach((id) => assert.ok(ids.includes(id), `вопрос ${q.id}: ссылка на несуществующий ${id}`));
  });
  config.delivery.appliesWhen.forEach((id) =>
    assert.ok(ids.includes(id), `сдача комплекта: ссылка на несуществующий ${id}`));
});

test("у каждого этапа есть хотя бы один тип работы, из которого до него дойти", () => {
  config.modules.forEach((m) => {
    const reachable = config.workTypes.some((w) => !w.available || w.available.includes(m.id));
    assert.ok(reachable, `до этапа ${m.id} нельзя добраться ни из одного типа работы`);
  });
});

test("у всех подписей есть обе языковые версии", () => {
  const check = (obj, where) => assert.ok(obj && obj.ru && obj.en, `${where}: не хватает ru или en`);
  config.modules.forEach((m) => {
    check(m.title, `этап ${m.id} title`);
    check(m.unit, `этап ${m.id} unit`);
    check(m.description, `этап ${m.id} description`);
    (m.addons || []).forEach((a) => check(a.label, `этап ${m.id}, надбавка ${a.id}`));
    (m.variants || []).forEach((v) => check(v.label, `этап ${m.id}, вариант ${v.id}`));
    (m.units || []).forEach((u) => {
      check(u.label, `этап ${m.id}, единица ${u.id}`);
      check(u.short, `этап ${m.id}, короткая подпись ${u.id}`);
    });
  });
  config.workTypes.forEach((w) => {
    check(w.label, `тип работы ${w.id}`);
    check(w.description, `тип работы ${w.id} description`);
  });
  config.category.questions.forEach((q) => {
    check(q.label, `вопрос ${q.id}`);
    q.options.forEach((o, i) => check(o.label, `вопрос ${q.id}, вариант ${i}`));
  });
  check(config.delivery.title, "сдача комплекта");
  config.urgency.forEach((u) => check(u.label, `срочность ${u.id}`));
  config.extraServices.forEach((s, i) => {
    check(s.title, `прикладная работа ${i}`);
    check(s.price, `прикладная работа ${i} price`);
  });
});

/* ---------- Итог ---------- */

if (failures.length) {
  console.error(`\n✗ Провалено ${failures.length} из ${passed + failures.length}\n`);
  failures.forEach(({ name, err }) => {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}\n`);
  });
  process.exit(1);
}
console.log(`✓ Все тесты пройдены (${passed})`);
