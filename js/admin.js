/**
 * АДМИНКА САЙТА
 * =============
 * Редактирует js/content.js через локальный сервер (server/server.js).
 *
 * Как это устроено
 * ----------------
 * Весь интерфейс собирается из описания SECTIONS ниже — это просто список
 * полей. Чтобы добавить новое поле на сайт, достаточно дописать его сюда и
 * в js/content.js: отдельный код на каждое поле писать не нужно.
 *
 * Два языка. Контент хранится параллельно в ru и en. Правка обычного поля
 * меняет только текущий язык. Поля с shared: true (пути к файлам, id, ссылки,
 * цифры) пишутся сразу в оба языка — им перевод не нужен. Добавление,
 * удаление и перестановка элементов списка тоже применяются к обоим языкам,
 * иначе ru и en разъедутся.
 */
(function () {
  "use strict";

  /* =====================================================================
     ОПИСАНИЕ РАЗДЕЛОВ
     ===================================================================== */

  var ICON_OPTIONS = [
    { value: "clock", label: "Часы (хронометраж)" },
    { value: "steps", label: "Столбики (количество)" },
    { value: "calendar", label: "Календарь (год)" },
    { value: "ensemble", label: "Люди (состав)" }
  ];

  var PROJECT_ITEM = [
    { key: "id", label: "Идентификатор (латиницей, в адресе страницы)", type: "text", shared: true },
    { key: "category", label: "Категория (ключ фильтра)", type: "text", shared: true },
    { key: "categoryLabel", label: "Категория (подпись на карточке)", type: "text" },
    { key: "title", label: "Название проекта", type: "text" },
    { key: "meta", label: "Подзаголовок (хронометраж, состав)", type: "text" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "__cover", label: "Главное фото проекта", type: "cover" },
    {
      key: "stats", label: "Цифры в шапке проекта", type: "objects",
      titleKey: "value", addLabel: "Добавить цифру",
      newItem: { value: "", label: "", icon: "clock" },
      item: [
        { key: "value", label: "Значение", type: "text", shared: true },
        { key: "label", label: "Подпись", type: "text" },
        { key: "icon", label: "Иконка", type: "select", options: ICON_OPTIONS, shared: true }
      ]
    },
    { key: "scope", label: "Этапы работы", type: "strings", addLabel: "Добавить этап" },
    { key: "photos", label: "Фото проекта", type: "photos" },
    {
      key: "videos", label: "Видео проекта", type: "objects",
      titleKey: "title", addLabel: "Добавить видео",
      newItem: { title: "", url: "", src: "", poster: "" },
      item: [
        { key: "title", label: "Подпись", type: "text" },
        { key: "url", label: "Ссылка на YouTube / VK / Rutube", type: "text", shared: true,
          hint: "Вставьте ссылку из адресной строки. Если она заполнена, файл ниже не нужен." },
        { key: "src", label: "Файл видео", type: "media", accept: "video", shared: true, posterKey: "poster" },
        { key: "poster", label: "Кадр-заглушка", type: "media", accept: "photo", shared: true,
          hint: "Подставляется автоматически при загрузке видео через админку." }
      ]
    },
    {
      key: "audio", label: "Аудио проекта", type: "objects",
      titleKey: "title", addLabel: "Добавить трек",
      newItem: { title: "", src: "" },
      item: [
        { key: "title", label: "Название трека", type: "text" },
        { key: "src", label: "Файл", type: "media", accept: "audio", shared: true }
      ]
    },
    { key: "isPlaceholder", label: "Пометить как незаполненный", type: "checkbox", shared: true,
      hint: "На карточке появится значок «заполните»." }
  ];

  var SECTIONS = [
    {
      id: "general", title: "Общее",
      hint: "Заголовок вкладки, шапка и подвал — видно на всех страницах.",
      groups: [
        {
          title: "Для поисковиков", fields: [
            { key: "meta.title", label: "Заголовок вкладки", type: "text" },
            { key: "meta.description", label: "Описание сайта", type: "textarea" }
          ]
        },
        {
          title: "Шапка и подвал", fields: [
            { key: "nav.brand", label: "Логотип (инициалы)", type: "text" },
            { key: "nav.cta", label: "Кнопка в шапке", type: "text" },
            { key: "footer.tagline", label: "Подпись в подвале", type: "text" },
            { key: "footer.rights", label: "Строка о правах", type: "text" },
            { key: "footer.faq", label: "Ссылка «Частые вопросы» в подвале", type: "text" }
          ]
        },
        {
          title: "Пункты меню", fields: [
            {
              key: "nav.links", label: "", type: "objects",
              titleKey: "label", addLabel: "Добавить пункт",
              newItem: { href: "index.html#contact", label: "Новый пункт" },
              item: [
                { key: "label", label: "Название", type: "text" },
                { key: "href", label: "Ссылка", type: "text", shared: true,
                  hint: "Страница (portfolio.html) или якорь на главной (index.html#process)." }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "hero", title: "Главный экран",
      hint: "Первый экран сайта: фото на весь экран и текст поверх него.",
      groups: [
        {
          title: "Текст", fields: [
            { key: "hero.annotation", label: "Пометка сверху", type: "text" },
            { key: "hero.name", label: "Имя", type: "text" },
            { key: "hero.role", label: "Чем занимаетесь", type: "text" },
            { key: "hero.description", label: "Описание", type: "textarea" },
            { key: "hero.ctaPrimary", label: "Основная кнопка", type: "text" },
            { key: "hero.ctaSecondary", label: "Вторая кнопка", type: "text" },
            { key: "hero.marginNote", label: "Заметка на полях", type: "text" }
          ]
        },
        {
          title: "Фото", fields: [
            { key: "hero.photoSrc", label: "Фоновое фото", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Лучше горизонтальное или вертикальное фото не меньше 1600px по длинной стороне." },
            { key: "hero.photoCaption", label: "Подпись к фото (правый нижний угол)", type: "text" }
          ]
        },
        {
          title: "Видео под первым экраном", fields: [
            { key: "introVideo.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "introVideo.heading", label: "Заголовок", type: "text" },
            { key: "introVideo.subheading", label: "Описание", type: "textarea" },
            { key: "introVideo.src", label: "Файл видео", type: "media", accept: "video", shared: true, folder: "home", posterKey: "introVideo.poster" },
            { key: "introVideo.poster", label: "Кадр-заглушка", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Подставляется сама при загрузке видео выше." },
            { key: "introVideo.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        }
      ]
    },
    {
      id: "about", title: "Обо мне",
      hint: "Короткая версия — на главной, длинная — на странице about.html.",
      groups: [
        {
          title: "Заголовки", fields: [
            { key: "about.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "about.heading", label: "Заголовок", type: "text" },
            { key: "about.readMore", label: "Ссылка «подробнее»", type: "text" },
            { key: "about.portrait", label: "Портрет", type: "media", accept: "photo", shared: true, folder: "about" },
            { key: "about.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        },
        { title: "Короткий текст (главная)", fields: [{ key: "about.paragraphs", label: "", type: "strings", multiline: true, addLabel: "Добавить абзац" }] },
        { title: "Полный текст (страница «Обо мне»)", fields: [{ key: "about.long", label: "", type: "strings", multiline: true, addLabel: "Добавить абзац" }] },
        { title: "Теги-навыки", fields: [{ key: "about.tags", label: "", type: "strings", addLabel: "Добавить тег" }] }
      ]
    },
    {
      id: "forWhom", title: "Для кого",
      groups: [
        {
          title: "Заголовки", fields: [
            { key: "forWhom.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "forWhom.heading", label: "Заголовок", type: "text" },
            { key: "forWhom.subheading", label: "Описание", type: "textarea" },
            { key: "forWhom.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        },
        {
          title: "Карточки", fields: [
            {
              key: "forWhom.items", label: "", type: "objects",
              titleKey: "title", addLabel: "Добавить карточку",
              newItem: { title: "Новая карточка", description: "" },
              item: [
                { key: "title", label: "Заголовок", type: "text" },
                { key: "description", label: "Описание", type: "textarea" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "process", title: "Процесс",
      groups: [
        {
          title: "Заголовки", fields: [
            { key: "process.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "process.heading", label: "Заголовок", type: "text" },
            { key: "process.subheading", label: "Описание", type: "textarea" },
            { key: "process.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        },
        {
          title: "Шаги", fields: [
            {
              key: "process.steps", label: "", type: "objects",
              titleKey: "title", addLabel: "Добавить шаг",
              newItem: { title: "Новый шаг", description: "" },
              item: [
                { key: "title", label: "Название шага", type: "text" },
                { key: "description", label: "Описание", type: "textarea" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "portfolio", title: "Портфолио",
      hint: "Порядок проектов здесь = порядок на сайте. Первые три показываются на главной.",
      groups: [
        {
          title: "Заголовки и подписи", fields: [
            { key: "portfolio.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "portfolio.heading", label: "Заголовок", type: "text" },
            { key: "portfolio.subheading", label: "Описание", type: "textarea" },
            { key: "portfolio.viewAll", label: "Ссылка «все проекты»", type: "text" },
            { key: "portfolio.backToList", label: "Ссылка «назад к списку»", type: "text" },
            { key: "portfolio.detailsLabel", label: "Подпись «подробнее»", type: "text" },
            { key: "portfolio.stagesLabel", label: "Заголовок «этапы работы»", type: "text" },
            { key: "portfolio.galleryLabel", label: "Заголовок блока фото", type: "text" },
            { key: "portfolio.videoLabel", label: "Заголовок блока видео", type: "text" },
            { key: "portfolio.audioLabel", label: "Заголовок блока аудио", type: "text" },
            { key: "portfolio.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        },
        {
          title: "Фильтры", fields: [
            {
              key: "portfolio.filters", label: "", type: "objects",
              titleKey: "label", addLabel: "Добавить фильтр",
              newItem: { key: "new", label: "Новый фильтр" },
              item: [
                { key: "key", label: "Ключ (совпадает с категорией проекта)", type: "text", shared: true },
                { key: "label", label: "Подпись кнопки", type: "text" }
              ]
            }
          ]
        },
        {
          title: "Проекты", fields: [
            {
              key: "portfolio.projects", label: "", type: "objects",
              folder: function (project) { return project && project.id ? "portfolio/" + project.id : "portfolio"; },
              titleKey: "title", addLabel: "Добавить проект", collapsed: true,
              newItem: {
                id: "new-project", category: "arrangement", categoryLabel: "Аранжировка и оркестровка",
                title: "Новый проект", meta: "", description: "",
                stats: [], scope: [], media: { type: "score", placeholder: true },
                heroImage: "", photos: [], videos: [], audio: [], isPlaceholder: false
              },
              item: PROJECT_ITEM
            }
          ]
        }
      ]
    },
    {
      id: "services", title: "Услуги",
      hint: "На главной показываются направления, на services.html — прайс-лист: услуги внутри своих направлений.",
      groups: [
        {
          title: "Заголовки", fields: [
            { key: "services.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "services.heading", label: "Заголовок", type: "text" },
            { key: "services.subheading", label: "Описание", type: "textarea" },
            { key: "services.viewAll", label: "Ссылка «все услуги»", type: "text" },
            { key: "services.note", label: "Примечание внизу списка", type: "textarea" },
            { key: "services.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." },
            { key: "services.detailsLabel", label: "Кнопка «раскрыть подробности»", type: "text" },
            { key: "services.hideLabel", label: "Кнопка «свернуть»", type: "text" }
          ]
        },
        {
          title: "Направления", fields: [
            {
              key: "services.groups", label: "", type: "objects",
              titleKey: "title", addLabel: "Добавить направление", collapsed: true,
              newItem: { id: "", title: "Новое направление", summary: "" },
              item: [
                { key: "id", label: "Код (латиницей, без пробелов)", type: "text",
                  hint: "По нему услуга привязывается к направлению — менять код у существующего направления нельзя, иначе услуги от него отвяжутся." },
                { key: "title", label: "Название", type: "text" },
                { key: "summary", label: "Короткое описание", type: "textarea" }
              ]
            }
          ]
        },
        {
          title: "Список услуг", fields: [
            {
              key: "services.items", label: "", type: "objects",
              titleKey: "title", addLabel: "Добавить услугу", collapsed: true,
              newItem: { title: "Новая услуга", group: "", description: "", detail: "", bullets: [], price: "цена договорная" },
              item: [
                { key: "title", label: "Название", type: "text" },
                { key: "group", label: "Направление (код)", type: "text",
                  hint: "Код направления из блока выше. Пустое или неизвестное — услуга уйдёт в конец страницы отдельным блоком." },
                { key: "description", label: "Короткое описание (видно сразу)", type: "textarea",
                  hint: "Одна строка, без точки в начале списка — так строки прайса держат общий ритм." },
                { key: "detail", label: "Подробности (раскрываются по клику)", type: "textarea" },
                { key: "bullets", label: "Что входит — списком", type: "strings", addLabel: "Добавить пункт" },
                { key: "price", label: "Цена", type: "text",
                  hint: "Одной строкой, например «от 5 000 ₽ / мин» — цены выстраиваются в общую колонку." }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "testimonials", title: "Отзывы",
      hint: "На сайте видны только отзывы со статусом «опубликован».",
      groups: [
        {
          title: "Заголовки", fields: [
            { key: "testimonials.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "testimonials.heading", label: "Заголовок", type: "text" },
            { key: "testimonials.subheading", label: "Описание", type: "textarea" },
            { key: "testimonials.emptyNote", label: "Текст, когда отзывов нет", type: "text" },
            { key: "testimonials.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        },
        {
          title: "Отзывы", fields: [
            {
              key: "testimonials.items", label: "", type: "objects",
              titleKey: "name", addLabel: "Добавить отзыв", statusKey: "status",
              newItem: { id: "", name: "", role: "", text: "", date: "", rating: 0, avatar: "", source: "site", sourceUrl: "", profileUrl: "", status: "published", isPlaceholder: false },
              item: [
                { key: "status", label: "Статус", type: "select", shared: true, options: [
                  { value: "published", label: "Опубликован" },
                  { value: "pending", label: "На модерации" },
                  { value: "hidden", label: "Скрыт" }
                ] },
                { key: "name", label: "Имя", type: "text" },
                { key: "role", label: "Кем работает", type: "text" },
                { key: "text", label: "Текст отзыва", type: "textarea" },
                { key: "date", label: "Дата", type: "text", shared: true },
                { key: "rating", label: "Оценка (звёзды)", type: "select", shared: true, options: [
                  { value: 0, label: "Без оценки" },
                  { value: 5, label: "★★★★★" },
                  { value: 4, label: "★★★★" },
                  { value: 3, label: "★★★" },
                  { value: 2, label: "★★" },
                  { value: 1, label: "★" }
                ] },
                { key: "source", label: "Откуда отзыв", type: "select", shared: true, options: [
                  { value: "site", label: "Оставлен на сайте" },
                  { value: "vk", label: "ВКонтакте" },
                  { value: "avito", label: "Авито" },
                  { value: "telegram", label: "Telegram" },
                  { value: "other", label: "Другое" }
                ], hint: "Для отзывов, перенесённых с других площадок, — подпись на карточке." },
                { key: "sourceUrl", label: "Ссылка на первоисточник", type: "text", shared: true,
                  hint: "Ссылка на отзыв на Авито или на комментарий в VK — посетитель сможет проверить." },
                { key: "profileUrl", label: "Ссылка на профиль автора", type: "text", shared: true },
                { key: "avatar", label: "Фото автора", type: "media", accept: "photo", shared: true, folder: "reviews",
                  hint: "Необязательно: без фото показываются инициалы." },
                { key: "isPlaceholder", label: "Это заглушка", type: "checkbox", shared: true }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "blog", title: "Новости",
      groups: [
        {
          title: "Заголовки", fields: [
            { key: "blog.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "blog.heading", label: "Заголовок", type: "text" },
            { key: "blog.subheading", label: "Описание", type: "textarea" },
            { key: "blog.viewAll", label: "Ссылка «все новости»", type: "text" },
            { key: "blog.note", label: "Примечание внизу", type: "text" },
            { key: "blog.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        },
        {
          title: "Записи", fields: [
            {
              key: "blog.posts", label: "", type: "objects",
              folder: function (post) { return post && post.id ? "blog/" + post.id : "blog"; },
              titleKey: "title", addLabel: "Добавить новость", collapsed: true,
              newItem: { id: "", date: "", category: "Анонс", title: "Новая новость", excerpt: "", body: "", cover: "", photos: [], links: [], isPlaceholder: false },
              item: [
                { key: "id", label: "Идентификатор (латиницей, в адресе страницы)", type: "text", shared: true,
                  hint: "Адрес статьи будет post.html?id=… . У каждой новости должен быть свой." },
                { key: "date", label: "Дата", type: "text", shared: true },
                { key: "category", label: "Рубрика", type: "text" },
                { key: "title", label: "Заголовок", type: "text" },
                { key: "excerpt", label: "Короткий анонс (виден на карточке)", type: "textarea" },
                { key: "body", label: "Полный текст статьи", type: "textarea",
                  hint: "Пустая строка между абзацами = новый абзац на странице." },
                { key: "cover", label: "Обложка", type: "media", accept: "photo", shared: true,
                  hint: "Показывается и на карточке, и фоном в шапке статьи. Если не выбрать — возьмётся первое фото." },
                { key: "video", label: "Ссылка на видео (YouTube / VK / Rutube)", type: "text", shared: true,
                  hint: "Вставьте ссылку из адресной строки — на странице появится встроенный плеер." },
                { key: "photos", label: "Фотографии в статье", type: "photos" },
                {
                  key: "links", label: "Ссылки в статье", type: "objects",
                  titleKey: "label", addLabel: "Добавить ссылку",
                  newItem: { label: "Название ссылки", href: "https://" },
                  item: [
                    { key: "label", label: "Подпись", type: "text" },
                    { key: "href", label: "Адрес", type: "text", shared: true }
                  ]
                },
                { key: "isPlaceholder", label: "Это заглушка", type: "checkbox", shared: true }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "faq", title: "Вопросы",
      hint: "На главной показываются первые пять вопросов, полный список — на странице faq.html.",
      groups: [
        {
          title: "Заголовки", fields: [
            { key: "faq.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "faq.heading", label: "Заголовок", type: "text" },
            { key: "faq.subheading", label: "Описание", type: "textarea" },
            { key: "faq.viewAll", label: "Ссылка «все вопросы»", type: "text" },
            { key: "faq.note", label: "Примечание под списком", type: "textarea" },
            { key: "faq.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." },
            { key: "faq.openLabel", label: "Подпись «раскрыть ответ»", type: "text" },
            { key: "faq.hideLabel", label: "Подпись «свернуть ответ»", type: "text" }
          ]
        },
        {
          title: "Вопросы и ответы", fields: [
            {
              key: "faq.items", label: "", type: "objects",
              titleKey: "question", addLabel: "Добавить вопрос", collapsed: true,
              newItem: { question: "Новый вопрос", answer: "" },
              item: [
                { key: "question", label: "Вопрос", type: "text",
                  hint: "Формулируйте так, как спрашивает заказчик, — по этой строке вопрос ищут глазами." },
                { key: "answer", label: "Ответ", type: "textarea" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "contact", title: "Контакты",
      groups: [
        {
          title: "Заголовки и контакты", fields: [
            { key: "contact.eyebrow", label: "Надзаголовок", type: "text" },
            { key: "contact.heading", label: "Заголовок", type: "text" },
            { key: "contact.subheading", label: "Описание", type: "textarea" },
            { key: "contact.formNote", label: "Примечание под формой", type: "textarea" },
            { key: "contact.directHeading", label: "Заголовок блока соцсетей", type: "text" },
            { key: "contact.directNote", label: "Текст над соцсетями", type: "textarea" },
            { key: "contact.directFoot", label: "Строчка под соцсетями", type: "text" },
            { key: "contact.bgPhoto", label: "Фото в фоне раздела", type: "media", accept: "photo", shared: true, folder: "home",
              hint: "Оставьте пустым — раздел будет однотонным со световыми пятнами." }
          ]
        },
        {
          title: "Подписи в форме", fields: [
            { key: "contact.formLabels.name", label: "Поле «Имя»", type: "text" },
            { key: "contact.formLabels.contact", label: "Поле «Контакт»", type: "text" },
            { key: "contact.formLabels.type", label: "Поле «Тип услуги»", type: "text" },
            { key: "contact.formLabels.message", label: "Поле «Описание задачи»", type: "text" },
            { key: "contact.formLabels.submit", label: "Кнопка отправки", type: "text" },
            { key: "contact.formLabels.typeOptions", label: "Варианты в списке услуг", type: "strings", addLabel: "Добавить вариант" }
          ]
        },
        {
          title: "Соцсети", fields: [
            {
              key: "contact.social", label: "", type: "objects",
              titleKey: "label", addLabel: "Добавить соцсеть",
              newItem: { label: "Название", href: "https://" },
              item: [
                { key: "label", label: "Название", type: "text" },
                { key: "href", label: "Ссылка", type: "text", shared: true }
              ]
            }
          ]
        }
      ]
    },
    { id: "media", title: "Медиатека", custom: "media", hint: "Все файлы сайта: загрузка, просмотр и удаление." }
  ];

  /* =====================================================================
     СОСТОЯНИЕ И УТИЛИТЫ
     ===================================================================== */

  var state = {
    token: localStorage.getItem("admin-token") || "",
    content: null,
    lang: "ru",
    section: "general",
    dirty: false,
    collapsed: {}
  };

  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function getIn(obj, path) {
    return path.split(".").reduce(function (acc, k) { return acc == null ? acc : acc[k]; }, obj);
  }
  function setIn(obj, path, value) {
    var parts = path.split(".");
    var last = parts.pop();
    var target = parts.reduce(function (acc, k) {
      if (acc[k] == null || typeof acc[k] !== "object") acc[k] = {};
      return acc[k];
    }, obj);
    target[last] = value;
  }

  function toast(message, isError) {
    var node = $("#toast");
    node.textContent = message;
    node.className = "toast" + (isError ? " error" : "");
    node.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { node.hidden = true; }, isError ? 6000 : 2600);
  }

  function markDirty() {
    state.dirty = true;
    $("#dirtyFlag").hidden = false;
    $("#btnSave").disabled = false;
  }
  function markClean() {
    state.dirty = false;
    $("#dirtyFlag").hidden = true;
    $("#btnSave").disabled = true;
  }

  /* ---------- Запросы к серверу ---------- */
  function api(path, options) {
    options = options || {};
    var headers = options.headers || {};
    if (state.token) headers.Authorization = "Bearer " + state.token;
    if (options.json !== undefined) {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.json);
    }
    return fetch(path, { method: options.method || "GET", headers: headers, body: options.body })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || "Ошибка " + res.status);
          return data;
        });
      });
  }

  /* =====================================================================
     ОБЩИЕ ЭЛЕМЕНТЫ ПОЛЕЙ
     ===================================================================== */

  function labelNode(field) {
    var node = el("div", "field-label");
    node.textContent = field.label || "";
    if (field.shared) node.appendChild(el("span", "shared-tag", "общее для RU и EN"));
    return node;
  }
  function hintNode(field) {
    if (!field.hint) return null;
    var n = el("div", "media-path");
    n.textContent = field.hint;
    return n;
  }

  /** Кнопки ↑ ↓ ✕ для элементов списка. */
  function rowActions(index, length, onMove, onDelete) {
    var box = el("div", "row-actions");
    var up = el("button", "btn btn-small", "↑");
    up.type = "button"; up.disabled = index === 0;
    up.onclick = function () { onMove(index, -1); };
    var down = el("button", "btn btn-small", "↓");
    down.type = "button"; down.disabled = index === length - 1;
    down.onclick = function () { onMove(index, 1); };
    var del = el("button", "btn btn-small btn-danger", "✕");
    del.type = "button";
    del.onclick = function () { onDelete(index); };
    box.appendChild(up); box.appendChild(down); box.appendChild(del);
    return box;
  }

  /**
   * Массивы в ru и en должны идти строго параллельно, поэтому любая
   * структурная правка применяется сразу к обоим языкам.
   */
  function bothArrays(ruParent, enParent, key) {
    var ruArr = getIn(ruParent, key);
    var enArr = getIn(enParent, key);
    if (!Array.isArray(ruArr)) { ruArr = []; setIn(ruParent, key, ruArr); }
    if (!Array.isArray(enArr)) { enArr = []; setIn(enParent, key, enArr); }
    while (enArr.length < ruArr.length) enArr.push(clone(ruArr[enArr.length]));
    while (ruArr.length < enArr.length) ruArr.push(clone(enArr[ruArr.length]));
    return { ru: ruArr, en: enArr };
  }
  function moveBoth(arrays, index, delta) {
    var to = index + delta;
    if (to < 0 || to >= arrays.ru.length) return;
    [arrays.ru, arrays.en].forEach(function (arr) {
      var item = arr.splice(index, 1)[0];
      arr.splice(to, 0, item);
    });
  }
  function removeBoth(arrays, index) {
    arrays.ru.splice(index, 1);
    arrays.en.splice(index, 1);
  }

  /* =====================================================================
     РЕНДЕР ПОЛЕЙ
     ===================================================================== */

  /**
   * Куда класть файлы этого поля. У поля стоит либо имя папки строкой
   * ("home", "services"), либо функция — она получает сам элемент и строит
   * путь вида "portfolio/<id проекта>".
   */
  var currentFolder = "";

  function folderOf(field, item) {
    if (typeof field.folder === "function") return field.folder(item) || currentFolder;
    return field.folder || currentFolder;
  }

  function renderField(host, field, ruParent, enParent, rerender) {
    var active = state.lang === "ru" ? ruParent : enParent;
    var other = state.lang === "ru" ? enParent : ruParent;

    function write(value) {
      setIn(active, field.key, value);
      if (field.shared) setIn(other, field.key, typeof value === "object" && value !== null ? clone(value) : value);
      markDirty();
    }

    var wrap = el("div", "field");

    if (field.type === "text" || field.type === "textarea") {
      wrap.appendChild(labelNode(field));
      var input = field.type === "textarea" ? el("textarea") : el("input");
      if (field.type === "text") input.type = "text";
      input.value = getIn(active, field.key) || "";
      input.addEventListener("input", function () { write(input.value); });
      wrap.appendChild(input);
      var h = hintNode(field); if (h) wrap.appendChild(h);
      host.appendChild(wrap);
      return;
    }

    if (field.type === "select") {
      wrap.appendChild(labelNode(field));
      var select = el("select");
      field.options.forEach(function (opt) {
        var o = el("option", null, opt.label);
        o.value = opt.value;
        select.appendChild(o);
      });
      select.value = getIn(active, field.key) || field.options[0].value;
      select.addEventListener("change", function () { write(select.value); rerender(); });
      wrap.appendChild(select);
      host.appendChild(wrap);
      return;
    }

    if (field.type === "checkbox") {
      var line = el("label", "field-inline");
      var box = el("input");
      box.type = "checkbox";
      box.checked = !!getIn(active, field.key);
      box.addEventListener("change", function () { write(box.checked); });
      line.appendChild(box);
      line.appendChild(el("span", null, field.label));
      wrap.appendChild(line);
      var h2 = hintNode(field); if (h2) wrap.appendChild(h2);
      host.appendChild(wrap);
      return;
    }

    if (field.type === "media") {
      wrap.appendChild(labelNode(field));
      wrap.appendChild(mediaControl(getIn(active, field.key) || "", field.accept, function (src, file) {
        write(src);
        // видео при загрузке отдаёт кадр-заглушку — сразу кладём его в поле постера
        if (field.posterKey && file && file.poster) {
          setIn(active, field.posterKey, file.poster);
          setIn(other, field.posterKey, file.poster);
        }
        rerender();
      }, folderOf(field, active)));
      var h3 = hintNode(field); if (h3) wrap.appendChild(h3);
      host.appendChild(wrap);
      return;
    }

    if (field.type === "cover") {
      wrap.appendChild(labelNode(field));
      wrap.appendChild(coverControl(ruParent, enParent, rerender, folderOf(field, active)));
      wrap.appendChild(el("div", "media-path",
        "Используется и на карточке в списке, и фоном в шапке страницы проекта."));
      host.appendChild(wrap);
      return;
    }

    if (field.type === "photos") {
      wrap.appendChild(labelNode(field));
      wrap.appendChild(photosControl(ruParent, enParent, field.key, rerender, folderOf(field, active)));
      host.appendChild(wrap);
      return;
    }

    if (field.type === "strings") {
      if (field.label) wrap.appendChild(labelNode(field));
      var arrays = bothArrays(ruParent, enParent, field.key);
      var list = arrays[state.lang];
      var box = el("div", "string-list");
      list.forEach(function (value, i) {
        var row = el("div", "string-row");
        var input = field.multiline ? el("textarea") : el("input");
        if (!field.multiline) input.type = "text";
        input.value = value;
        input.addEventListener("input", function () {
          list[i] = input.value;
          if (field.shared) arrays[state.lang === "ru" ? "en" : "ru"][i] = input.value;
          markDirty();
        });
        row.appendChild(input);
        row.appendChild(rowActions(i, list.length,
          function (idx, d) { moveBoth(arrays, idx, d); markDirty(); rerender(); },
          function (idx) { removeBoth(arrays, idx); markDirty(); rerender(); }));
        box.appendChild(row);
      });
      var add = el("button", "btn btn-small", "+ " + (field.addLabel || "Добавить"));
      add.type = "button";
      add.onclick = function () { arrays.ru.push(""); arrays.en.push(""); markDirty(); rerender(); };
      box.appendChild(add);
      wrap.appendChild(box);
      host.appendChild(wrap);
      return;
    }

    if (field.type === "objects") {
      if (field.label) wrap.appendChild(labelNode(field));
      var arrs = bothArrays(ruParent, enParent, field.key);
      var listBox = el("div", "item-list");

      arrs.ru.forEach(function (_, i) {
        var ruItem = arrs.ru[i];
        var enItem = arrs.en[i];
        var activeItem = state.lang === "ru" ? ruItem : enItem;
        var collapseId = field.key + ":" + i;
        var isCollapsed = field.collapsed
          ? state.collapsed[collapseId] !== false
          : state.collapsed[collapseId] === true;

        var card = el("div", "item-card" + (isCollapsed ? " collapsed" : ""));
        var head = el("div", "item-head");
        head.appendChild(el("span", "chevron", "▾"));
        head.appendChild(el("span", "item-index", String(i + 1)));
        var titleText = (field.titleKey ? activeItem[field.titleKey] : "") || "Без названия";
        head.appendChild(el("span", "item-title", String(titleText)));

        if (field.statusKey) {
          var status = activeItem[field.statusKey] || "published";
          var labels = { published: "Опубликован", pending: "На модерации", hidden: "Скрыт" };
          head.appendChild(el("span", "status-pill " + status, labels[status] || status));
        }

        var actions = rowActions(i, arrs.ru.length,
          function (idx, d) { moveBoth(arrs, idx, d); markDirty(); rerender(); },
          function (idx) {
            if (!confirm("Удалить «" + titleText + "»? Действие отменяется только через Отмену до сохранения.")) return;
            removeBoth(arrs, idx); markDirty(); rerender();
          });
        actions.addEventListener("click", function (e) { e.stopPropagation(); });
        head.appendChild(actions);

        head.addEventListener("click", function () {
          state.collapsed[collapseId] = !card.classList.contains("collapsed") ? true : false;
          card.classList.toggle("collapsed");
        });

        var body = el("div", "item-body");
        // Внутренние поля (фото, видео, аудио) кладут файлы в папку самого
        // элемента: portfolio/<id проекта>, blog/<id новости>.
        var parentFolder = currentFolder;
        currentFolder = folderOf(field, activeItem) || parentFolder;
        field.item.forEach(function (sub) {
          renderField(body, sub, ruItem, enItem, rerender);
        });
        currentFolder = parentFolder;

        card.appendChild(head);
        card.appendChild(body);
        listBox.appendChild(card);
      });

      var addBtn = el("button", "btn", "+ " + (field.addLabel || "Добавить"));
      addBtn.type = "button";
      addBtn.onclick = function () {
        arrs.ru.push(clone(field.newItem || {}));
        arrs.en.push(clone(field.newItem || {}));
        state.collapsed[field.key + ":" + (arrs.ru.length - 1)] = false;
        markDirty();
        rerender();
      };
      listBox.appendChild(addBtn);
      wrap.appendChild(listBox);
      host.appendChild(wrap);
    }
  }

  /* ---------- Медиа-контролы ---------- */

  function previewNode(src) {
    var box = el("div", "media-preview");
    if (!src) { box.textContent = "нет файла"; return box; }
    if (/\.(jpe?g|png|gif|webp|svg)$/i.test(src)) {
      var img = el("img");
      img.src = src + "?t=" + Date.now();
      img.alt = "";
      box.appendChild(img);
    } else if (/\.(mp4|mov|webm)$/i.test(src)) {
      box.textContent = "видео";
    } else if (/\.(mp3|wav|m4a|ogg|aiff?)$/i.test(src)) {
      box.textContent = "аудио";
    } else {
      box.textContent = "файл";
    }
    return box;
  }

  function mediaControl(src, accept, onChange, folder) {
    var wrap = el("div", "media-field");
    wrap.appendChild(previewNode(src));
    var meta = el("div", "media-meta");
    meta.appendChild(el("div", "media-path", src || "файл не выбран"));
    var actions = el("div", "media-actions");

    var pick = el("button", "btn btn-small", src ? "Заменить" : "Выбрать файл");
    pick.type = "button";
    pick.onclick = function () {
      openMediaPicker(accept, false, folder).then(function (chosen) {
        if (chosen) onChange(chosen.src, chosen);
      });
    };
    actions.appendChild(pick);

    if (src) {
      var clear = el("button", "btn btn-small btn-danger", "Убрать");
      clear.type = "button";
      clear.onclick = function () { onChange(""); };
      actions.appendChild(clear);
    }
    meta.appendChild(actions);
    wrap.appendChild(meta);
    return wrap;
  }

  /**
   * Обложка проекта. Прячет от редактора внутреннюю структуру media/heroImage:
   * есть фото — карточка и шапка кейса берут его, нет — рисуется заглушка.
   */
  function coverControl(ruItem, enItem, rerender, folder) {
    var current = (ruItem.media && ruItem.media.src) || ruItem.heroImage || "";

    function apply(src) {
      [ruItem, enItem].forEach(function (item) {
        if (src) {
          item.media = { type: "photo", src: src };
          item.heroImage = src;
        } else {
          item.media = { type: "score", placeholder: true };
          item.heroImage = "";
        }
      });
      markDirty();
      rerender();
    }
    return mediaControl(current, "photo", apply, folder);
  }

  function photosControl(ruItem, enItem, key, rerender, folder) {
    var arrays = bothArrays(ruItem, enItem, key);
    var list = arrays.ru;
    var box = el("div");
    var strip = el("div", "photo-strip");

    list.forEach(function (src, i) {
      var chip = el("div", "photo-chip");
      var img = el("img");
      img.src = src;
      img.alt = "";
      chip.appendChild(img);
      var acts = el("div", "chip-actions");
      var left = el("button", null, "←"); left.type = "button"; left.disabled = i === 0;
      left.onclick = function () { moveBoth(arrays, i, -1); markDirty(); rerender(); };
      var right = el("button", null, "→"); right.type = "button"; right.disabled = i === list.length - 1;
      right.onclick = function () { moveBoth(arrays, i, 1); markDirty(); rerender(); };
      var del = el("button", "del", "✕"); del.type = "button";
      del.onclick = function () { removeBoth(arrays, i); markDirty(); rerender(); };
      acts.appendChild(left); acts.appendChild(right); acts.appendChild(del);
      chip.appendChild(acts);
      strip.appendChild(chip);
    });
    box.appendChild(strip);

    var add = el("button", "btn btn-small", "+ Добавить фото");
    add.type = "button";
    add.style.marginTop = "10px";
    add.onclick = function () {
      openMediaPicker("photo", true, folder).then(function (chosen) {
        if (!chosen) return;
        var items = Array.isArray(chosen) ? chosen : [chosen];
        items.forEach(function (file) {
          arrays.ru.push(file.src);
          arrays.en.push(file.src);
        });
        markDirty();
        rerender();
      });
    };
    box.appendChild(add);
    return box;
  }

  /* =====================================================================
     МЕДИАТЕКА (модалка и раздел)
     ===================================================================== */

  var picker = { resolve: null, accept: null, multiple: false, folder: "" };

  function formatSize(bytes) {
    if (bytes > 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " МБ";
    return Math.max(1, Math.round(bytes / 1024)) + " КБ";
  }

  function loadMedia() {
    return api("/api/media?folder=" + encodeURIComponent(picker.folder)).then(function (data) {
      var folderSelect = $("#mediaFolder");
      folderSelect.innerHTML = "";
      data.folders.forEach(function (f) {
        var o = el("option", null, f || "— корень —");
        o.value = f;
        folderSelect.appendChild(o);
      });
      folderSelect.value = picker.folder;

      var grid = $("#mediaGrid");
      grid.innerHTML = "";
      var files = data.files.filter(function (f) {
        return !picker.accept || f.kind === picker.accept;
      });
      if (!files.length) {
        grid.appendChild(el("p", "media-empty", "В этой папке пока нет подходящих файлов. Загрузите их кнопкой сверху."));
        return;
      }
      files.forEach(function (file) {
        var item = el("button", "media-item");
        item.type = "button";
        var thumb = el("div", "thumb");
        if (file.kind === "photo") {
          var img = el("img"); img.src = file.src; img.alt = ""; img.loading = "lazy";
          thumb.appendChild(img);
        } else {
          thumb.textContent = file.kind === "video" ? "видео" : file.kind === "audio" ? "аудио" : "файл";
        }
        item.appendChild(thumb);
        var info = el("div", "info");
        info.appendChild(el("span", "name", file.name));
        info.appendChild(el("span", "size", formatSize(file.size)));
        item.appendChild(info);

        item.onclick = function () {
          if (picker.resolve) { closePicker(file); return; }
          // Режим просмотра медиатеки — предлагаем удалить
          if (confirm("Удалить файл " + file.name + " с диска? Отменить будет нельзя.")) {
            api("/api/media", { method: "DELETE", json: { src: file.src } })
              .then(function () { toast("Файл удалён"); loadMedia(); })
              .catch(function (e) { toast(e.message, true); });
          }
        };
        grid.appendChild(item);
      });
    });
  }

  function openMediaPicker(accept, multiple, folder) {
    picker.accept = accept || null;
    picker.multiple = !!multiple;
    // папка раздела: и список открывается в ней, и загрузка идёт туда же
    if (typeof folder === "string") picker.folder = folder;
    $("#mediaModalTitle").textContent = folder
      ? "Выберите файл — папка «" + folder + "»"
      : "Выберите файл";
    $("#mediaNote").textContent = multiple ? "Можно загрузить сразу несколько файлов — они добавятся в список." : "";
    $("#mediaModal").hidden = false;
    loadMedia();
    return new Promise(function (resolve) { picker.resolve = resolve; });
  }

  function closePicker(value) {
    $("#mediaModal").hidden = true;
    var resolve = picker.resolve;
    picker.resolve = null;
    if (resolve) resolve(value || null);
  }

  function openMediaLibrary() {
    picker.accept = null;
    picker.resolve = null;
    $("#mediaModalTitle").textContent = "Медиатека";
    $("#mediaNote").textContent = "Клик по файлу — удалить его с диска.";
    $("#mediaModal").hidden = false;
    loadMedia();
  }

  function handleUpload(files) {
    if (!files.length) return;
    var folder = $("#mediaNewFolder").value.trim() || picker.folder;
    var form = new FormData();
    form.append("folder", folder);
    Array.prototype.forEach.call(files, function (f) { form.append("file", f); });

    $("#mediaNote").textContent = "Загружаю и сжимаю… для видео это может занять минуту.";
    api("/api/upload", { method: "POST", body: form })
      .then(function (data) {
        var notes = data.files.map(function (f) { return f.note; }).filter(Boolean);
        $("#mediaNote").textContent = notes.length ? notes.join("; ") : "Готово: загружено файлов — " + data.files.length;
        if (folder) picker.folder = folder;
        $("#mediaNewFolder").value = "";

        // Видео сразу отдаёт постер — подставим его, если выбирали одно видео
        var first = data.files[0];
        if (picker.resolve && data.files.length === 1 && !picker.multiple) {
          closePicker(first);
          if (first.poster) toast("Кадр-заглушка создан: " + first.poster);
          return;
        }
        if (picker.resolve && picker.multiple) { closePicker(data.files); return; }
        loadMedia();
      })
      .catch(function (e) { $("#mediaNote").textContent = "Ошибка: " + e.message; });
  }

  /* =====================================================================
     РЕНДЕР РАЗДЕЛА
     ===================================================================== */

  function renderSidebar() {
    var nav = $("#sidebar");
    nav.innerHTML = "";
    SECTIONS.forEach(function (section) {
      var btn = el("button", section.id === state.section ? "active" : "", section.title);
      btn.type = "button";
      btn.onclick = function () {
        state.section = section.id;
        location.hash = section.id;
        renderSidebar();
        renderSection();
      };
      nav.appendChild(btn);
    });
  }

  function renderSection() {
    var section = SECTIONS.filter(function (s) { return s.id === state.section; })[0];
    var host = $("#content");
    host.innerHTML = "";
    host.appendChild(el("h2", null, section.title));
    if (section.hint) host.appendChild(el("p", "section-hint", section.hint));

    if (section.custom === "media") {
      var open = el("button", "btn btn-primary", "Открыть медиатеку");
      open.type = "button";
      open.onclick = openMediaLibrary;
      host.appendChild(open);
      host.appendChild(el("p", "section-hint",
        "Фото сжимаются до 2200px и переводятся в JPEG, видео — в web-совместимый MP4 с кадром-заглушкой, аудио — в MP3. Исходники остаются у вас на компьютере."));
      return;
    }

    var ru = state.content.ru;
    var en = state.content.en;
    section.groups.forEach(function (group) {
      var box = el("div", "group");
      if (group.title) box.appendChild(el("h3", null, group.title));
      group.fields.forEach(function (field) {
        renderField(box, field, ru, en, renderSection);
      });
      host.appendChild(box);
    });
  }

  /* =====================================================================
     ЗАГРУЗКА И СОХРАНЕНИЕ
     ===================================================================== */

  function loadContent() {
    return api("/api/content").then(function (data) {
      state.content = data.content;
      renderSidebar();
      renderSection();
      markClean();
    });
  }

  function save() {
    $("#btnSave").disabled = true;
    api("/api/content", { method: "PUT", json: { content: state.content } })
      .then(function (data) {
        markClean();
        // сервер заодно приводит папки медиатеки в соответствие с контентом
        var f = (data && data.folders) || {};
        var extra = [];
        if (f.created && f.created.length) extra.push("новых папок: " + f.created.length);
        if (f.archived && f.archived.length) extra.push("в архив убрано папок: " + f.archived.length);
        toast("Сохранено — обновите вкладку сайта, чтобы увидеть изменения" +
          (extra.length ? " (" + extra.join(", ") + ")" : ""));
      })
      .catch(function (e) {
        $("#btnSave").disabled = false;
        toast("Не сохранилось: " + e.message, true);
      });
  }

  /* =====================================================================
     ЗАПУСК
     ===================================================================== */

  function showApp() {
    var fromHash = location.hash.replace("#", "");
    if (SECTIONS.some(function (s) { return s.id === fromHash; })) state.section = fromHash;
    $("#loginScreen").hidden = true;
    $("#app").hidden = false;
    loadContent().catch(function (e) { toast(e.message, true); });
  }

  function bindEvents() {
    $("#loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var password = $("#loginPassword").value;
      api("/api/login", { method: "POST", json: { password: password } })
        .then(function (data) {
          state.token = data.token;
          localStorage.setItem("admin-token", data.token);
          $("#loginError").textContent = "";
          showApp();
        })
        .catch(function (err) { $("#loginError").textContent = err.message; });
    });

    $("#btnSave").addEventListener("click", save);

    $("#langSwitch").addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-lang]");
      if (!btn) return;
      state.lang = btn.getAttribute("data-lang");
      Array.prototype.forEach.call(this.children, function (b) {
        b.classList.toggle("active", b === btn);
      });
      renderSection();
    });

    $("#mediaClose").addEventListener("click", function () { closePicker(null); });
    $("#mediaModal").addEventListener("click", function (e) {
      if (e.target === this) closePicker(null);
    });
    $("#mediaFolder").addEventListener("change", function () {
      picker.folder = this.value;
      loadMedia();
    });
    $("#mediaUpload").addEventListener("change", function () {
      handleUpload(this.files);
      this.value = "";
    });

    window.addEventListener("beforeunload", function (e) {
      if (!state.dirty) return;
      e.preventDefault();
      e.returnValue = "";
    });

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (state.dirty) save();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindEvents();
    if (state.token) {
      // Проверяем, жив ли токен: сервер мог перезапуститься
      api("/api/content").then(showApp).catch(function () {
        localStorage.removeItem("admin-token");
        state.token = "";
      });
    }
  });
})();
