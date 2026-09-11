/**
 * ПРАЙС: ЕДИНЫЙ ФАЙЛ С ЦИФРАМИ
 * ============================
 * Здесь лежат все ставки, баллы и коэффициенты, по которым считает
 * калькулятор на странице услуг. Цены пересматриваются раз в год —
 * правится ТОЛЬКО этот файл, логика расчёта (js/pricing-calc.js) и
 * интерфейс (js/pricing-ui.js) не трогаются.
 *
 * Почему цифры не в content.js: тот файл переписывает админка, и она
 * не знает про структуру прайса — сбитая связка «вариант ответа ↔ балл»
 * молча испортила бы расчёт. Здесь же подписи лежат рядом со своими
 * баллами, и поправить их можно только вместе.
 *
 * ЧТО ВИДИТ ПОСЕТИТЕЛЬ: ставки на страницу не выводятся. Публично
 * показывается только итог по конкретному проекту, и показывается
 * вилкой (см. publicRange ниже). Точные цифры и сами ставки видны в
 * режиме «для себя» — services.html#pro (см. js/pricing-ui.js).
 * Полностью спрятать ставки на статическом сайте нельзя: расчёт идёт
 * в браузере, значит файл читаем. Задача здесь не спрятать, а не
 * публиковать прайс таблицей.
 *
 * ПОРЯДОК ШАГОВ В ФОРМЕ (менять только вместе с pricing-ui.js):
 *   1. тип работы   → определяет доступные и включённые этапы
 *   2. объём        → минуты и число номеров
 *   3. этапы        → чекбоксы, взаимоисключения через conflictsWith
 *   4. сложность    → вопросы, отобранные под выбранные этапы
 *
 * ЕДИНИЦЫ. kind у этапа определяет, как считается строка:
 *   per-minute-category — ставка по категории × минуты
 *   per-minute-flat     — одна ставка × минуты
 *   program-tier        — фикс за программу + доплата за минуты сверх порога
 *   share-of-module     — доля от ставки другого этапа × минуты
 *   per-piece           — за номер, с вариантами и надбавками
 */

window.PRICING_CONFIG = {
  /* Год прайса. Выводится в подписи под калькулятором. */
  version: "2026",
  validUntil: { ru: "31 декабря 2026 года", en: "31 December 2026" },

  /* ------------------------------------------------------------------
     ТИП РАБОТЫ — первый шаг формы.
     Задаёт, какие этапы вообще показывать (available), какие отметить
     сразу (modules), и с какого объёма начинать. Без него человек
     упирается в список из восьми этапов и не знает, что ему нужно.

     Числа minutes и pieces — не цена, а разумная точка старта:
     калькулятор не должен открываться цифрой за целое отделение.
     ------------------------------------------------------------------ */
  workTypes: [
    {
      id: "arrangement",
      label: { ru: "Аранжировка номера", en: "Arranging one number" },
      description: {
        ru: "Один номер: от эскиза, трека или клавира до партитуры и партий.",
        en: "A single number: from a sketch, track or piano score to a full score and parts."
      },
      modules: ["m2"],
      available: ["m1", "m2", "m9", "m4", "m5"],
      minutes: 4,
      pieces: 1
    },
    {
      id: "program",
      label: { ru: "Концертная программа", en: "Concert programme" },
      description: {
        ru: "Несколько номеров: структура вечера, аранжировки, клик и плейбэк.",
        en: "Several numbers: the shape of the evening, arrangements, click and playback."
      },
      modules: ["m2", "m3", "m4", "m5"],
      available: ["m1", "m2", "m3", "m4", "m5", "m9"],
      minutes: 20,
      pieces: 6
    },
    {
      id: "transcribe",
      label: { ru: "Снятие на слух", en: "Transcription by ear" },
      description: {
        ru: "Нот не существует — нужно восстановить нотный текст с записи.",
        en: "No notation exists — the score has to be reconstructed from a recording."
      },
      modules: ["m1"],
      available: ["m1", "m10", "m2", "m9"],
      minutes: 4,
      pieces: 1
    },
    {
      id: "engrave",
      label: { ru: "Нотный набор", en: "Music engraving" },
      description: {
        ru: "Материал есть — нужны чистая партитура и комплект партий.",
        en: "The material exists — a clean score and a set of parts are needed."
      },
      modules: ["m8"],
      available: ["m8", "m9"],
      /* Не ноль: набор меряется страницами, но если к нему добавят
         аудиоверсию, минуты понадобятся — и считаться она должна не
         от нулевого хронометража. Поле показывается, только когда
         выбранным этапам действительно нужны минуты. */
      minutes: 4,
      pieces: 3
    },
    {
      id: "stage",
      label: { ru: "Клик и плейбэк", en: "Click and playback" },
      description: {
        ru: "Партитура готова — нужна техническая часть для сцены.",
        en: "The score is ready — the stage technical package is what's missing."
      },
      modules: ["m4", "m5"],
      available: ["m4", "m5", "m9"],
      minutes: 20,
      pieces: 6
    },
    {
      id: "adapt",
      label: { ru: "Адаптация под состав", en: "Adapting to an ensemble" },
      description: {
        ru: "Партитура есть — нужна версия под другой оркестр или гастрольный состав.",
        en: "A score exists — a version for another orchestra or a touring line-up is needed."
      },
      modules: ["m7"],
      available: ["m7", "m4", "m5", "m9"],
      minutes: 8,
      pieces: 2
    },
    {
      id: "mockup",
      label: { ru: "Аудиоверсия партитуры", en: "Audio version of a score" },
      description: {
        ru: "Готовую партитуру нужно услышать: озвучить библиотеками до первой репетиции.",
        en: "An existing score needs to be heard: played back through libraries before the first rehearsal."
      },
      modules: ["m9"],
      /* Подсказка у этапа советует добавить снятие, когда нот нет вовсе,
         и набор, когда они только на бумаге, — значит оба должны быть
         в списке, иначе совет некуда применить. */
      available: ["m9", "m1", "m2", "m8"],
      minutes: 4,
      pieces: 1
    },
    {
      id: "show",
      label: { ru: "Спектакль или шоу", en: "Theatre or show" },
      description: {
        ru: "Сквозная музыка к постановке: номера, переходы, атмосферы.",
        en: "Music running through a production: numbers, transitions, atmospheres."
      },
      modules: ["m2", "m4", "m5"],
      addons: { "m5:sound": true },
      available: ["m2", "m3", "m4", "m5", "m9"],
      minutes: 30,
      pieces: 10
    },
    {
      id: "leadsheet",
      label: { ru: "Мелодическая строка", en: "Lead sheet" },
      description: {
        ru: "Мелодия, слова и гармония на одном листе — то, по чему играет группа.",
        en: "Melody, words and chords on one sheet — what the band plays from."
      },
      modules: ["m10"],
      available: ["m10", "m2", "m9"],
      minutes: 4,
      pieces: 1
    },
    {
      id: "vocal",
      label: { ru: "Вокальная и хоровая аранжировка", en: "Vocal and choral arranging" },
      description: {
        ru: "Голоса: подголоски, бэк-вокал, хоровая партитура — с треком или без.",
        en: "Voices: counter-lines, backing vocals, a choral score — with or without a track."
      },
      modules: ["m2"],
      available: ["m1", "m2", "m10", "m4", "m5", "m9"],
      minutes: 4,
      pieces: 1
    },
    {
      id: "picture",
      label: { ru: "Музыка к изображению", en: "Music to picture" },
      description: {
        ru: "Под видеоряд: опорные точки, монтажные стыки, заданный хронометраж.",
        en: "To a cut: hit points, edits to catch, a running time that is fixed."
      },
      modules: ["m2", "m5"],
      addons: { "m2:picture": true },
      available: ["m2", "m4", "m5", "m9"],
      minutes: 6,
      pieces: 3
    },
    {
      id: "custom",
      label: { ru: "Своё сочетание", en: "Custom mix" },
      description: {
        ru: "Собрать этапы вручную — доступны все.",
        en: "Pick the stages by hand — all of them are available."
      },
      modules: [],
      available: null,
      minutes: 4,
      pieces: 1
    }
  ],

  /* ------------------------------------------------------------------
     КАТЕГОРИЯ СЛОЖНОСТИ
     Вопросы отбираются по выбранным этапам: спрашивать про хор, когда
     считается только нотный набор, бессмысленно. Из-за этого максимум
     баллов плавает, и пороги заданы ДОЛЕЙ от максимума, а не абсолютным
     числом. На полном наборе (максимум 14) доли дают ровно прежнюю
     шкалу: 0–3 → A, 4–7 → B, 8–10 → C, 11+ → D.
     ------------------------------------------------------------------ */
  category: {
    order: ["A", "B", "C", "D"],
    thresholds: [
      { id: "A", maxRatio: 0.22 },
      { id: "B", maxRatio: 0.52 },
      { id: "C", maxRatio: 0.78 },
      { id: "D", maxRatio: null }
    ],
    names: {
      A: { ru: "Базовая", en: "Basic" },
      B: { ru: "Стандартная", en: "Standard" },
      C: { ru: "Повышенная", en: "Advanced" },
      D: { ru: "Максимальная", en: "Maximum" }
    },
    /* appliesTo — при каких этапах вопрос имеет смысл. Если ни один из
       перечисленных этапов не выбран, вопрос не показывается и в сумму
       баллов не входит. */
    questions: [
      {
        id: "ensemble",
        appliesTo: ["m1", "m2", "m4", "m5", "m7", "m8", "m9"],
        label: { ru: "Для какого состава?", en: "What ensemble is it for?" },
        hint: {
          ru: "Считаются строки в партитуре, а не музыканты на сцене: у скрипок одна строка на всю группу.",
          en: "Count staves in the score, not players on stage: the whole violin section shares one stave."
        },
        options: [
          { score: 0, label: { ru: "Небольшой ансамбль", en: "Small ensemble" }, note: { ru: "до 12 строк", en: "up to 12 staves" } },
          { score: 1, label: { ru: "Камерный оркестр или биг-бэнд", en: "Chamber orchestra or big band" }, note: { ru: "13–20", en: "13–20" } },
          { score: 2, label: { ru: "Симфонический оркестр", en: "Symphony orchestra" }, note: { ru: "21–30", en: "21–30" } },
          { score: 3, label: { ru: "Расширенный состав", en: "Extended forces" }, note: { ru: "31 и больше", en: "31 and up" } }
        ]
      },
      {
        id: "texture",
        appliesTo: ["m1", "m2", "m7", "m8", "m9", "m10"],
        label: { ru: "Насколько густо написана музыка?", en: "How dense is the writing?" },
        hint: {
          ru: "Сколько всего звучит одновременно и делятся ли группы внутри себя.",
          en: "How much sounds at once, and whether sections divide within themselves."
        },
        options: [
          { score: 0, label: { ru: "Прозрачно", en: "Transparent" }, note: { ru: "мелодия и сопровождение", en: "melody and accompaniment" } },
          { score: 1, label: { ru: "Средне", en: "Moderate" }, note: { ru: "три-четыре самостоятельные линии", en: "three or four independent lines" } },
          { score: 2, label: { ru: "Плотно", en: "Dense" }, note: { ru: "группы делятся, линий много", en: "sections divide, many lines" } },
          { score: 3, label: { ru: "Очень плотно", en: "Very dense" }, note: { ru: "divisi почти везде", en: "divisi almost throughout" } }
        ]
      },
      {
        id: "choir",
        appliesTo: ["m1", "m2", "m5", "m7", "m9"],
        label: { ru: "Есть ли хор?", en: "Is there a choir?" },
        options: [
          { score: 0, label: { ru: "Нет", en: "No" } },
          { score: 1, label: { ru: "Есть, простой", en: "Yes, simple" }, note: { ru: "унисон или два голоса", en: "unison or two parts" } },
          { score: 2, label: { ru: "Есть, развитый", en: "Yes, full" }, note: { ru: "четыре голоса, divisi", en: "four parts, divisi" } }
        ]
      },
      {
        id: "percussion",
        appliesTo: ["m1", "m2", "m5", "m7", "m9"],
        label: { ru: "Сколько человек в ударных?", en: "How many percussionists?" },
        options: [
          { score: 0, label: { ru: "Один", en: "One" } },
          { score: 1, label: { ru: "Двое-трое", en: "Two or three" } },
          { score: 2, label: { ru: "Четверо и больше", en: "Four and up" } }
        ]
      },
      {
        id: "rare",
        appliesTo: ["m1", "m2", "m7", "m9"],
        label: { ru: "Редкие или этнические инструменты соло?", en: "Rare or ethnic solo instruments?" },
        hint: {
          ru: "Те, для которых партию нужно писать отдельно, сверяясь с возможностями исполнителя.",
          en: "Ones whose part has to be written separately, against what the player can actually do."
        },
        options: [
          { score: 0, label: { ru: "Нет", en: "None" } },
          { score: 1, label: { ru: "Один-два", en: "One or two" } },
          { score: 2, label: { ru: "Три и больше", en: "Three and up" } }
        ]
      },
      {
        id: "meter",
        appliesTo: ["m1", "m2", "m4", "m7", "m9", "m10"],
        label: { ru: "Меняются ли темп и размер?", en: "Do tempo and metre change?" },
        options: [
          { score: 0, label: { ru: "Почти нет", en: "Hardly ever" } },
          { score: 1, label: { ru: "Регулярно", en: "Regularly" } },
          { score: 2, label: { ru: "Постоянно", en: "Constantly" } }
        ]
      },
      {
        id: "recording",
        appliesTo: ["m1", "m10"],
        label: { ru: "Как звучит запись?", en: "How does the recording sound?" },
        options: [
          { score: 0, label: { ru: "Чисто", en: "Clean" }, note: { ru: "всё различимо", en: "everything is audible" } },
          { score: 1, label: { ru: "Обычная концертная запись", en: "A normal live recording" } },
          { score: 2, label: { ru: "Плотный микс", en: "A dense mix" }, note: { ru: "партии тонут друг в друге", en: "parts drown in each other" } }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------
     ЭТАПЫ РАБОТЫ
     Порядок в массиве — порядок строк в смете и в списке на странице.
     id менять нельзя: по ним собраны типы работ и конфликты.

     conflictsWith — этапы, которые не имеют смысла вместе. Не запрет
     ради запрета: снятие на слух уже даёт набранные ноты, оркестровка
     уже включает партии, адаптация и новая оркестровка — это или-или.
     Интерфейс гасит такой этап и показывает причину.
     ------------------------------------------------------------------ */
  modules: [
    {
      id: "m1",
      kind: "per-minute-category",
      title: { ru: "Снятие на слух", en: "Transcription by ear" },
      unit: { ru: "за минуту исходника", en: "per minute of source" },
      description: {
        ru: "Восстановление нотного текста с фонограммы, когда нот не существует. Результат — набранная партитура.",
        en: "Reconstructing the score from a recording when no notation exists. The result is an engraved score."
      },
      rate: { A: 3000, B: 4000, C: 5500, D: 7000 },
      conflictsWith: ["m8"],
      conflictReason: {
        ru: "При снятии ноты набираются сразу — отдельный набор не нужен.",
        en: "Transcription produces engraved notation already — separate engraving is redundant."
      },
      /* Вместе с оркестровкой снятие дешевле: материал всё равно
         разбирается по слоям внутри работы над партитурой. */
      discountWith: { module: "m2", factor: 0.7 },
      /* Считается по хронометражу исходника, а не готовой музыки:
         в pro-режиме его можно задать отдельным полем. */
      minutesField: "sourceMinutes"
    },
    {
      id: "m10",
      kind: "per-minute-category",
      title: { ru: "Мелодическая строка", en: "Lead sheet" },
      unit: { ru: "за минуту исходника", en: "per minute of source" },
      description: {
        ru: "Мелодия, слова и гармония на одном листе: то, по чему играет группа и поёт солист. Без партий и без партитуры.",
        en: "Melody, words and chord symbols on a single sheet: what the band plays from and the singer sings from. No parts, no full score."
      },
      /* Самая дешёвая точка входа. Снимается тот же материал, что и в
         полном снятии, но записывается один голос и буквенная гармония,
         а не вся фактура по строкам. */
      rate: { A: 1800, B: 2200, C: 2800, D: 3500 },
      conflictsWith: ["m1", "m8"],
      conflictReason: {
        ru: "Мелодическая строка — это сокращённое снятие: полное снятие и нотный набор её заменяют.",
        en: "A lead sheet is transcription in short form: full transcription and engraving replace it."
      },
      minutesField: "sourceMinutes",
      note: {
        ru: "Если нужны партии по инструментам, это уже снятие на слух или нотный набор.",
        en: "If parts for individual instruments are needed, that is transcription or engraving instead."
      }
    },
    {
      id: "m2",
      kind: "per-minute-category",
      title: { ru: "Аранжировка и оркестровка", en: "Arranging and orchestration" },
      unit: { ru: "за минуту готовой музыки", en: "per minute of finished music" },
      description: {
        ru: "Партитура под заданный состав: распределение материала, динамический план, играбельность партий.",
        en: "A score for the given ensemble: material spread across sections, dynamic plan, playable parts."
      },
      rate: { A: 7000, B: 9000, C: 12000, D: 15000 },
      conflictsWith: ["m7", "m8"],
      conflictReason: {
        ru: "Новая оркестровка уже включает набор партитуры и партий.",
        en: "A new orchestration already includes engraving the score and parts."
      },
      /* Музыка под экран — та же оркестровка, но со сквозной привязкой
         к таймкоду: опорные точки, попадания в монтажные стыки, правка
         формы под чужой хронометраж, который менять нельзя. Отдельным
         этапом делать не стал — работа та же, дисциплина другая. */
      addons: [
        {
          id: "picture",
          factor: 0.3,
          label: { ru: "Музыка к изображению", en: "Music to picture" },
          hint: {
            ru: "Привязка к таймкоду: опорные точки, попадания в монтаж, форма под заданный хронометраж.",
            en: "Locked to timecode: hit points, cuts to catch, form built around a fixed running time."
          }
        }
      ]
    },
    {
      id: "m3",
      kind: "program-tier",
      title: { ru: "Структура программы", en: "Shape of the programme" },
      unit: { ru: "за программу", en: "per programme" },
      description: {
        ru: "Форма вечера целиком: отбор и порядок номеров, стыковки и переходы, темпокарта, тональный план.",
        en: "The shape of the whole evening: choice and order of numbers, joins and transitions, tempo map, key plan."
      },
      base: 15000,
      includedMinutes: 10,
      perExtraMinute: 1500,
      note: {
        ru: "Не нужна, если порядок номеров и переходы уже собраны.",
        en: "Not needed if the running order and transitions are already settled."
      }
    },
    {
      id: "m4",
      kind: "per-minute-flat",
      title: { ru: "Клик-трек", en: "Click track" },
      unit: { ru: "за минуту", en: "per minute" },
      description: {
        ru: "Темпокарта, отсчёты, метки перехода, служебные ориентиры для дирижёра и оркестра.",
        en: "Tempo map, count-ins, transition markers, cues for the conductor and the orchestra."
      },
      rate: 1500
    },
    {
      id: "m5",
      kind: "per-minute-category",
      title: { ru: "Плейбэк", en: "Playback" },
      unit: { ru: "за минуту", en: "per minute" },
      description: {
        ru: "Синтезаторные партии, хор, ударные, дополнительные слои. Сведение, стемы, сдача в концертном формате.",
        en: "Synth parts, choir, drums, extra layers. Mixing, stems, concert-ready delivery."
      },
      rate: { A: 3500, B: 3500, C: 5000, D: 5000 },
      /* Саунд-дизайн отдельной строкой дублировал плейбэк: шумы и
         переходы делаются в том же проекте, теми же руками и в ту же
         сдачу. Поэтому он не этап, а надбавка к плейбэку — считается
         однозначно и в смете видна отдельной строкой. */
      addons: [
        {
          id: "sound",
          factor: 0.4,
          label: { ru: "Саунд-дизайн", en: "Sound design" },
          hint: {
            ru: "Шумы, атмосферы, переходы, эффекты — поверх музыкальных слоёв.",
            en: "Textures, atmospheres, transitions, effects — over the musical layers."
          }
        }
      ]
    },
    {
      id: "m9",
      kind: "per-minute-category",
      title: { ru: "Аудиоверсия партитуры", en: "Audio version of the score" },
      unit: { ru: "за минуту", en: "per minute" },
      description: {
        ru: "Партитура, озвученная оркестровыми библиотеками: послушать номер до репетиции, показать заказчику или худсовету.",
        en: "The score played back through orchestral libraries: hear the number before rehearsal, show it to a client or a board."
      },
      /* Чаще всего это добавка к работе, которая и так идёт: партитура
         уже набрана и открыта, озвучить её — дело настройки, а не
         разбора материала. Отсюда одна низкая ставка вместо категорий. */
      bundledRate: 1000,
      bundledWith: ["m1", "m2", "m8"],
      bundledNote: {
        ru: "Идёт вместе с набором, оркестровкой или снятием — партитура уже в работе.",
        en: "Bundled with engraving, orchestration or transcription — the score is already open."
      },
      /* Отдельным заказом дороже: чужую партитуру нужно сначала внести
         в проект, а от того, в каком она виде, зависит объём работы. */
      rate: { A: 2000, B: 2500, C: 3000, D: 4000 },
      variants: [
        { id: "project", factor: 1,
          label: { ru: "Есть проект или MIDI", en: "A project or MIDI exists" } },
        { id: "score", factor: 1.6,
          label: { ru: "Есть только ноты", en: "Only sheet music" } }
      ],
      variantsLabel: { ru: "Что есть на руках", en: "What you already have" },
      note: {
        ru: "Если нот нет вовсе — добавьте «Снятие на слух»: тогда аудиоверсия идёт по льготной ставке.",
        en: "If no notation exists at all, add “Transcription by ear” — the audio version then goes at the bundled rate."
      }
    },
    {
      id: "m7",
      kind: "share-of-module",
      title: { ru: "Адаптация под другой состав", en: "Adaptation for another ensemble" },
      unit: { ru: "за минуту", en: "per minute" },
      description: {
        ru: "Переработка готовой партитуры под сокращённый, расширенный или иной состав — например, гастрольная версия.",
        en: "Reworking an existing score for a reduced, expanded or different ensemble — a touring version, say."
      },
      ofModule: "m2",
      factor: 0.5,
      conflictsWith: ["m2", "m8"],
      conflictReason: {
        ru: "Адаптация перерабатывает готовую партитуру — новая оркестровка её заменяет, а не дополняет.",
        en: "Adaptation reworks an existing score — a new orchestration replaces it rather than adding to it."
      },
      note: {
        ru: "Если фактуру нужно переписывать, а не перераспределять, считается как новая оркестровка.",
        en: "If the texture must be rewritten rather than redistributed, it is quoted as a new orchestration."
      }
    },
    {
      id: "m8",
      kind: "per-unit",
      title: { ru: "Нотный набор", en: "Music engraving" },
      unit: { ru: "по выбранной единице", en: "by the chosen unit" },
      description: {
        ru: "Перенос материала в нотный редактор: набор, вёрстка, вычитка. Считается так, как удобнее считать объём.",
        en: "Moving the material into a notation editor: setting, layout, proofreading. Priced by whichever unit measures the job best."
      },
      conflictsWith: ["m1", "m2", "m7"],
      conflictReason: {
        ru: "Набор входит в снятие на слух, оркестровку и адаптацию — отдельно он нужен только сам по себе.",
        en: "Engraving is part of transcription, orchestration and adaptation — on its own only when it is the whole job."
      },
      /* Три способа мерить одну и ту же работу. Постранично — когда
         набирают с готовых нот и объём виден глазами; по минутам —
         когда известен хронометраж; за номер — стартовая ставка из
         прайс-листа. Ставка в каждой единице своя для каждого
         состояния исходника. */
      units: [
        { id: "page", qtyField: "pages",
          label: { ru: "За страницу", en: "Per page" },
          short: { ru: "стр.", en: "pg" },
          qtyLabel: { ru: "Страниц в оригинале", en: "Pages in the original" },
          rate: { file: 500, manuscript: 700, draft: 900 } },
        { id: "minute", qtyField: "minutes",
          label: { ru: "За минуту", en: "Per minute" },
          short: { ru: "мин", en: "min" },
          rate: { file: 3000, manuscript: 4000, draft: 5000 } },
        { id: "piece", qtyField: "pieces",
          label: { ru: "За номер", en: "Per piece" },
          short: { ru: "ном.", en: "pcs" },
          rate: { file: 12000, manuscript: 15000, draft: 18000 } }
      ],
      variants: [
        { id: "file", label: { ru: "Из файла", en: "From a file" },
          note: { ru: "MIDI или нотный проект", en: "MIDI or a notation project" } },
        { id: "manuscript", label: { ru: "С рукописи или PDF", en: "From manuscript or PDF" },
          note: { ru: "разборчивый оригинал", en: "a legible original" } },
        { id: "draft", label: { ru: "С черновика", en: "From a draft" },
          note: { ru: "правки, вставки, неясные места", en: "corrections, inserts, unclear passages" } }
      ],
      variantsLabel: { ru: "Из чего набираем", en: "What we set it from" },
      addons: [
        {
          id: "parts",
          factor: 0.3,
          /* «Нотная подготовка» — принятое в отрасли название этой
             работы (music preparation). Прежняя «вёрстка и экспорт PDF»
             описывала нажатие кнопки, а не ремесло. */
          label: { ru: "Нотная подготовка: комплект партий", en: "Music preparation: the set of parts" },
          hint: {
            ru: "Отдельные ноты каждому инструменту: перевороты страниц в паузах, репетиционные цифры, вычитка, готовые PDF.",
            en: "A separate part for every instrument: page turns in the rests, rehearsal marks, proofreading, print-ready PDFs."
          }
        },
        {
          id: "midi",
          factor: 0.25,
          label: { ru: "Подготовка MIDI-материала", en: "Preparing the MIDI material" },
          hint: {
            ru: "Присланный проект сначала нужно привести в порядок: разложить по голосам, выправить длительности и залиговки, убрать игровые неточности.",
            en: "The project you send has to be put in order first: split into voices, note values and ties fixed, performance slop removed."
          }
        }
      ],
      note: {
        ru: "Ставка стартовая: итог зависит от плотности партитуры и состояния оригинала.",
        en: "A starting rate: the total depends on how dense the score is and the state of the original."
      }
    }
  ],

  /* ------------------------------------------------------------------
     ОФОРМЛЕНИЕ И СДАЧА КОМПЛЕКТА — за каждый номер.
     Десять пьес по три минуты дороже одной тридцатиминутной, хотя
     музыки столько же: у каждой свой проект, свой титул, своя разметка,
     свой вывод партитуры и комплекта партий, своё именование файлов.
     Строка появляется сама, когда в работе есть нотный результат;
     у нотного набора (m8) вывод уже сидит в ставке за номер.
     ------------------------------------------------------------------ */
  delivery: {
    appliesWhen: ["m1", "m2", "m7"],
    rate: { A: 2500, B: 4000, C: 6000, D: 8000 },
    /* Названия этой строки и intake разведены намеренно. Раньше они
       звались «Оформление и сдача комплекта» и «Приём и сдача проекта»,
       стояли в смете рядом и читались как одна работа, посчитанная
       дважды: в обоих заголовках «сдача», в обоих описаниях «сборка».
       Теперь одна строка называет нотный результат, другая — ведение
       заказа, и каждая начинается с единицы счёта. */
    title: { ru: "Партитура и партии", en: "Score and parts" },
    description: {
      ru: "На каждый номер: шаблон и титул, репетиционные цифры, экспорт партитуры и всех партий, проверка комплекта.",
      en: "Per number: template and title page, rehearsal marks, exporting the score and every part, checking the set."
    }
  },

  /* ------------------------------------------------------------------
     Коэффициенты. Применяются в жёстком порядке: сначала срочность
     ко всей сумме этапов, затем передача исходников. Порядок важен —
     на нём построены и тесты, и согласованные с заказчиками сметы.
     ------------------------------------------------------------------ */
  urgency: [
    { id: "normal", factor: 1, label: { ru: "Обычный срок", en: "Normal timeline" },
      hint: { ru: "От 10 рабочих дней", en: "10 working days or more" } },
    { id: "rush", factor: 1.3, label: { ru: "Срочно", en: "Rush" },
      hint: { ru: "Менее 10 рабочих дней", en: "Under 10 working days" } },
    { id: "urgent", factor: 1.5, label: { ru: "Экстренно", en: "Emergency" },
      hint: { ru: "Менее 5 рабочих дней", en: "Under 5 working days" } }
  ],

  /* Передача редактируемых исходников (Sibelius, Logic Pro).

     Раньше здесь стоял ×1,5, и внутри одной галочки жили две разные
     вещи: сама передача файлов и право этими файлами распоряжаться —
     переделывать, выпускать производные версии. Технической услугой
     продавалось право, и заказчик логично считал, что раз файлы у
     него, то и делать с ними можно что угодно.

     Теперь передача файлов стоит своих 15% (чистка проекта, сборка,
     документация к нему), а право на переработку переехало в блок
     rights отдельной надбавкой. Сумма для того, кому нужно и то и
     другое, осталась прежней: 1,15 × 1,5 ≈ 1,7. */
  sources: {
    factor: 1.15,
    label: { ru: "Передача исходных проектов", en: "Editable project files" },
    hint: {
      ru: "Файлы Sibelius и Logic Pro: собранный проект, слои, документация к нему.",
      en: "Sibelius and Logic Pro files: the assembled project, its layers and documentation."
    }
  },

  /* ------------------------------------------------------------------
     ПРАВА НА РЕЗУЛЬТАТ
     Вторая половина сметы. Первая — производство: сколько стоит труд по
     созданию партитуры. Она не зависит от того, кто заказчик и что он
     собирается с материалом делать. Права — отдельная величина, и
     считаются они долей от производства: ценность прав пропорциональна
     ценности материала, а она уже посчитана этапами.

     Складывать «цель», «периодичность» и «объём прав» в три независимых
     множителя нельзя — они перемножатся и дадут ×4 на ровном месте.
     Поэтому цель использования не имеет своего коэффициента: она только
     ПРЕДЛАГАЕТ ступень прав, а платится ступень.
     ------------------------------------------------------------------ */
  rights: {
    /* Оркестровка чужой песни — производное произведение (ст. 1260 ГК).
       Передать больше, чем есть, нельзя: права на оригинал остаются у
       его автора, и решает этот вопрос заказчик. Здесь продаются права
       на мой слой — партитуру, оркестровку, плейбэк. Без этой оговорки
       калькулятор продаёт то, чем я не владею. */
    warning: {
      ru: "Аранжировка чужого произведения — переработка, и права на оригинал остаются у его автора: их заказчик получает отдельно, у правообладателя или через РАО. Здесь считаются права на мою работу — партитуру, оркестровку, плейбэк.",
      en: "An arrangement of someone else's work is a derivative: rights to the original stay with its author and are cleared separately by the client. What is priced here are the rights to my own layer — the score, the orchestration, the playback."
    },

    purposeLabel: { ru: "Как это будет использоваться", en: "How it will be used" },
    purposeHint: {
      ru: "Ответ подставляет подходящий объём прав — его можно поменять вручную.",
      en: "The answer preselects a matching scope of rights — you can change it by hand."
    },
    /* suggests — что подставить в ступень и надбавки. Не запрет: человек
       вправе выбрать другое, поле остаётся редактируемым. */
    purposes: [
      { id: "own", suggests: { tier: "once" },
        label: { ru: "Для себя, учёба, конкурс", en: "Personal use, study, a competition" } },
      { id: "event", suggests: { tier: "once" },
        label: { ru: "Один концерт или мероприятие", en: "A single concert or event" } },
      { id: "repertoire", suggests: { tier: "repertoire" },
        label: { ru: "Постоянный репертуар коллектива", en: "Standing repertoire of an ensemble" } },
      { id: "touring", suggests: { tier: "repertoire" },
        label: { ru: "Гастроли, продажа билетов, фестивали", en: "Touring, ticketed shows, festivals" } },
      { id: "release", suggests: { tier: "repertoire", addons: ["phonogram"] },
        label: { ru: "Запись и издание", en: "Recording and release" } },
      { id: "media", suggests: { tier: "exclusive", addons: ["audiovisual"] },
        label: { ru: "Реклама, кино, телевидение", en: "Advertising, film, television" } }
    ],

    tierLabel: { ru: "Объём прав", en: "Scope of rights" },
    tiers: [
      { id: "once", factor: 1,
        label: { ru: "Разовое исполнение", en: "A single performance" },
        hint: { ru: "Один концерт, одна постановка, одна дата", en: "One concert, one production, one date" } },
      { id: "repertoire", factor: 1.25,
        label: { ru: "Репертуар коллектива", en: "Ensemble repertoire" },
        hint: { ru: "Сколько угодно исполнений своим составом, бессрочно, без передачи третьим лицам", en: "Any number of performances by your own ensemble, without limit of time, not transferable" } },
      { id: "exclusive", factor: 1.7,
        label: { ru: "Исключительная лицензия", en: "Exclusive licence" },
        hint: { ru: "Только заказчик и никто больше — включая меня; срок и территория оговариваются", en: "The client and nobody else — myself included; term and territory are agreed" } },
      { id: "transfer", factor: 2.5,
        label: { ru: "Полная передача прав", en: "Full assignment" },
        hint: { ru: "Исключительное право переходит заказчику целиком и навсегда (ст. 1234 ГК)", en: "The exclusive right passes to the client in full and for good (art. 1234 of the Civil Code)" } }
    ],

    addonsLabel: { ru: "Что ещё входит", en: "What else is included" },
    addons: [
      { id: "phonogram", factor: 0.35,
        label: { ru: "Запись и издание фонограммы", en: "Recording and releasing a phonogram" },
        hint: { ru: "Выпуск на площадках, тираж, размещение в каталогах", en: "Release on platforms, physical copies, catalogue placement" } },
      { id: "audiovisual", factor: 0.7,
        label: { ru: "Использование с изображением", en: "Use with moving image" },
        hint: { ru: "Реклама, кино, сериал, ролик бренда", en: "Advertising, film, series, brand video" } },
      { id: "derivative", factor: 0.5,
        label: { ru: "Право на производные версии", en: "The right to make derivatives" },
        hint: { ru: "Заказчик сам переделывает материал под другие составы и случаи", en: "The client reworks the material for other ensembles and occasions themselves" } },
      { id: "anonymous", factor: 0.25,
        label: { ru: "Без указания авторства", en: "Without attribution" },
        hint: { ru: "Работа выходит под именем заказчика, моё имя нигде не звучит", en: "The work goes out under the client's name; mine appears nowhere" } },
      { id: "noPortfolio", factor: 0.2,
        label: { ru: "Запрет на показ в портфолио", en: "No portfolio use" },
        hint: { ru: "Работа, которую нельзя показать, не приводит следующую", en: "Work that cannot be shown brings no work after it" } }
    ]
  },

  /* ------------------------------------------------------------------
     ЗАКАЗЧИК И НАЛОГ
     Форма собственности НЕ меняет ставки за работу: брать с организации
     больше за ту же партитуру «потому что бюджет» заказчики чувствуют и
     не прощают. Она меняет ровно две вещи — ставку НПД и объём бумаг.

     НПД: 4% с физических лиц, 6% с юридических лиц и ИП. Ставки и лимит
     2,4 млн ₽ в год на 2026 год сохранены, режим продлён до конца 2028.

     Считается это как gross-up: цена в смете УЖЕ включает налог, и
     показывается одна сумма к оплате. Отдельной строкой «+6% НПД»
     показывать нельзя — НПД не НДС, предъявить его заказчику
     юридически не выйдет, а выглядит это как перекладывание своего
     налога. Разница между 4% и 6% в итоге — около 2%, то есть клиент
     не чувствует наценки за то, что он организация.
     ------------------------------------------------------------------ */
  client: {
    label: { ru: "Кто заказчик", en: "Who the client is" },
    hint: {
      ru: "От этого зависят налоговая ставка и объём документов, а не цена работы.",
      en: "This sets the tax rate and the paperwork, not the price of the work."
    },
    types: [
      { id: "person", tax: 0.04, contractFee: 0,
        label: { ru: "Частное лицо", en: "A private individual" },
        note: { ru: "Чек, без договора", en: "A receipt, no contract" } },
      { id: "entrepreneur", tax: 0.06, contractFee: 4000,
        label: { ru: "ИП или самозанятый", en: "Sole trader" },
        note: { ru: "Договор, акт, чек", en: "Contract, act, receipt" } },
      { id: "company", tax: 0.06, contractFee: 4000,
        label: { ru: "Организация", en: "An organisation" },
        note: { ru: "Договор, акт, счёт, ЭДО", en: "Contract, act, invoice, e-document flow" } }
    ],
    contractTitle: { ru: "Работа по договору", en: "Working under contract" },
    contractDescription: {
      ru: "Договор и приложения, акт, счёт, обмен через ЭДО, сверка и сроки оплаты.",
      en: "Contract and annexes, act of acceptance, invoice, e-document exchange, reconciliation and payment terms."
    },
    taxTitle: { ru: "В том числе НПД", en: "Including tax on professional income" }
  },

  /* Сегментная скидка. Не по форме собственности, а по тому, кто платит:
     школа, училище, детский или любительский коллектив. Осознанная
     политика, а не рыночная цена — поэтому и потолок по правам: дешевле
     отдаётся то, что не пойдёт зарабатывать. */
  segment: {
    factor: 0.75,
    maxTier: "repertoire",
    /* Скидка обещает «без коммерческого использования» — значит и
       надбавки, которые это использование и означают, при ней недоступны.
       Иначе школьная цена уезжала бы в рекламный ролик. */
    blockedAddons: ["phonogram", "audiovisual"],
    label: { ru: "Учебное заведение или любительский коллектив", en: "An educational institution or an amateur ensemble" },
    hint: {
      ru: "Школы, училища, детские и любительские коллективы. Без коммерческого использования.",
      en: "Schools, colleges, children's and amateur ensembles. No commercial use."
    },
    cappedNote: {
      ru: "Со скидкой отдаётся объём прав не выше репертуарного.",
      en: "At the reduced rate the scope of rights goes no further than repertoire use."
    }
  },

  /* ------------------------------------------------------------------
     ПРИЁМ И СДАЧА ПРОЕКТА
     Пришла на смену доплате до минимального заказа. Минимум решал
     реальную задачу — у любого проекта есть накладные, не зависящие от
     объёма, — но решал её несправедливо: клик на одну минуту стоит
     1 500 ₽, а человек видел 10 000 ₽ и читал это как «мне не хотят
     продавать». Разрыв в шесть раз ничем не объяснить.

     Отдельная строка объясняет себя сама: разобрать присланное,
     согласовать смету, оформить документы, собрать и сдать файлы,
     положить в архив. В большом проекте она незаметна, в маленьком
     как раз и составляет смысл.
     ------------------------------------------------------------------ */
  intake: {
    amount: 3000,
    title: { ru: "Ведение проекта", en: "Running the project" },
    description: {
      ru: "Один раз на проект: разбор присланного материала, согласование сметы, документы и чек, переписка по ходу работы, хранение архива.",
      en: "Once per project: reviewing the material you send, agreeing the estimate, paperwork and receipt, correspondence along the way, keeping the archive."
    }
  },

  /* Минимальный заказ. Ноль — доплаты нет: её работу делает строка
     «Ведение проекта» (см. intake выше). Поле оставлено, чтобы
     порог можно было вернуть одним числом: он применяется последним,
     то есть задаёт сумму К ОПЛАТЕ, уже с налогом. */
  minimum: 0,

  /* Два круга правок входят в стоимость, дальше — за круг.
     В расчёт добавляется отдельной строкой уже после минимума:
     это не объём работ, а надбавка сверх сметы. */
  revisions: { included: 2, perRound: 5000 },

  /* Публичная вилка. Нижняя граница — расчёт как есть, верхняя — запас
     на уточнение категории и объёма при разборе материала.
     Ставится, чтобы на странице не стояла цифра до рубля, которую
     потом придётся защищать. В pro-режиме вилка не показывается. */
  publicRange: { low: 1, high: 1.15, roundTo: 1000 },

  /* ------------------------------------------------------------------
     Прикладные работы вне калькулятора: слишком разные по объёму,
     чтобы считать формулой. Выводятся на странице отдельным списком
     с пометкой «расчёт по запросу».
     ------------------------------------------------------------------ */
  extraServices: [
    {
      title: { ru: "Транспонирование готовой партитуры", en: "Transposing an existing score" },
      description: { ru: "Смена тональности под вокалиста или инструмент, с правкой удобства партий.", en: "New key for a singer or instrument, with playability fixed." },
      price: { ru: "от 3 000 ₽ / номер", en: "from 3,000 ₽ / piece" }
    },
    {
      title: { ru: "Корректура чужой партитуры", en: "Proofreading someone else's score" },
      description: { ru: "Вычитка на ошибки, диапазоны, неудобные места и расхождения с клавиром.", en: "Errors, ranges, awkward passages and mismatches with the piano score." },
      price: { ru: "от 4 000 ₽ / номер", en: "from 4,000 ₽ / piece" }
    },
    {
      title: { ru: "Сопровождение репетиции и саундчека", en: "Rehearsal and soundcheck support" },
      description: { ru: "Правки по ходу репетиции, запуск клика и плейбэка, стыковка с звукорежиссёром.", en: "On-the-spot fixes, running click and playback, working with the sound engineer." },
      price: { ru: "от 10 000 ₽ / смена", en: "from 10,000 ₽ / session" }
    },
    {
      title: { ru: "Разбор партитуры по видеосвязи", en: "Score review over video call" },
      description: { ru: "Совместный разбор материала на экране: правки по ходу разговора, оценка играбельности, подбор состава под площадку и бюджет.", en: "Going through the material together on screen: edits as we talk, playability checked, an ensemble chosen for the venue and the budget." },
      price: { ru: "3 500 ₽ / час", en: "3,500 ₽ / hour" }
    }
  ]
};
