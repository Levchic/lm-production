/**
 * ЕДИНЫЙ ФАЙЛ КОНТЕНТА САЙТА
 * ==========================
 * Всё, что видно на сайте (тексты, проекты, услуги, отзывы, новости, контакты),
 * лежит здесь на двух языках — ru и en.
 *
 * ВАЖНО: этот файл редактируется через админку (admin.html) — она читает и
 * перезаписывает его автоматически. Поэтому объект ниже записан строгим JSON
 * (все ключи в кавычках) и без комментариев внутри. Руками править тоже можно,
 * но не ломайте JSON-синтаксис, иначе админка не сможет его прочитать.
 *
 * Запуск админки:  npm start  (или ./start.command)
 */

window.SITE_CONTENT = {
  "ru": {
    "meta": {
      "title": "Лев Майденко — аранжировщик и оркестровщик",
      "description": "Аранжировка, оркестровка и саунд-продакшн: оркестровые шоу, треки и каверы, клик и плейбэк, саунд-дизайн, партитуры и партии."
    },
    "nav": {
      "brand": "L.M.PRODUCTION",
      "links": [
        {
          "href": "about.html",
          "label": "Обо мне"
        },
        {
          "href": "portfolio.html",
          "label": "Портфолио"
        },
        {
          "href": "services.html",
          "label": "Услуги"
        },
        {
          "href": "refs.html",
          "label": "Мастерская"
        },
        {
          "href": "index.html#faq",
          "label": "Вопросы"
        },
        {
          "href": "blog.html",
          "label": "Новости"
        },
        {
          "href": "index.html#contact",
          "label": "Контакты"
        }
      ],
      "cta": "Обсудить проект"
    },
    "hero": {
      "annotation": "Аранжировка и оркестровка на заказ",
      "name": "Лев Майденко",
      "role": "Аранжировщик и оркестровщик, Санкт-Петербург",
      "description": "Музыка для оркестровых шоу, артистов и записи — **оркестровка, аранжировка, саунд-дизайн.**",
      "ctaPrimary": "Обсудить проект",
      "ctaSecondary": "Портфолио",
      "photoCaption": "Галерея",
      "frameLabel": "Кадр",
      "photoSrc": "assets/media/home/img_48.jpg",
      "photos": [
        "assets/media/home/img_48.jpg",
        "assets/media/portfolio/burton-show/05.jpg",
        "assets/media/na-glavnuyu.jpg",
        "assets/media/6.jpg",
        "assets/media/snimok-ekrana-2026-08-11-v-15.43.32-2.jpg"
      ],
      "ticker": [
        "Аранжировка",
        "Оркестровка",
        "Снятие на слух",
        "Партитуры и партии",
        "Нотный набор",
        "Клик и плейбэк",
        "Саунд-дизайн",
        "Оркестровые шоу",
        "Запись и сведение"
      ],
      "marginNote": ""
    },
    "introVideo": {
      "eyebrow": "Видео",
      "heading": "Как создаётся оркестровое шоу?",
      "subheading": "",
      "src": "assets/media/home/intro.mp4",
      "poster": "assets/media/home/about-1.jpg",
      "digestLabel": "Этапы",
      "duration": "1:23",
      "summary": "Музыка для шоу саундтреков: отбор материала, аранжировка, партии. **Самый трудоёмкий этап — снятие на слух**: партия каждого инструмента восстанавливается по записи.",
      "points": [
        "Отбор материала и драматургия программы",
        "Темповая карта и сетка партитуры",
        "Снятие на слух",
        "Аранжировка под состав, саунд-дизайн, плейбэк",
        "Клик и синхронизация с видеорядом",
        "Партитура, партии, репетиции"
      ],
      "bgPhoto": ""
    },
    "about": {
      "eyebrow": "Обо мне",
      "heading": "Биография",
      "paragraphs": [
        "Я аранжировщик и оркестровщик из Санкт-Петербурга. Делаю оркестровые шоу, аранжировки для оркестров и артистов, плейбэки и саунд-дизайн.",
        "Начинал как баянист: музыкальная школа в Тольятти, училище имени Римского-Корсакова, международные конкурсы. Несколько лет был штатным аранжировщиком Imperial Orchestra и продолжаю с ними работать, а также с другими оркестрами, театрами и артистами."
      ],
      "long": [
        "Музыкой я занимаюсь с шести лет. В Лицее искусств в Тольятти я услышал ансамбль народных инструментов, где виртуозно играл баянист-старшеклассник, — и выбрал баян.",
        "Восемь лет учёбы и конкурсы, с которых я привозил призовые места. В девятом классе специальности по программе уже не было, но педагог занималась со мной отдельно, чтобы я поступал в музыкальное училище. Школьные учителя говорили, что музыкой семью не прокормишь, и советовали идти в десятый класс — я даже сменил экзамены на физику и химию. Но на конкурсе в Петербурге нас заметил преподаватель училища имени Римского-Корсакова и пригласил поступать, и в 2016 году я переехал из Тольятти в Петербург.",
        "За четыре года учёбы я побывал во Франции, Германии, Литве и Сербии — с народным оркестром и на конкурсах. В Сербии получил гран-при международного конкурса баянистов, в 2018 году выступал в Каунасе на Кубке мира — одном из самых престижных конкурсов для баянистов. Тогда же освоил Sibelius: писал аранжировки для народных ансамблей и оркестра, снимал музыку на слух и набирал ноты на заказ.",
        "В 2020 году поступил в консерваторию по классу баяна и ушёл на срочную службу — в эстрадно-симфонический оркестр. Играл в нём на баяне и параллельно делал для дирижёра аранжировки и партитуры. После армии около года работал в консерватории работником сцены: расставлял пульты и стулья, развозил инструменты по площадкам города. Тогда я узнал составы и рассадку оркестра не по учебникам.",
        "Однажды я подрабатывал на монтаже сцены перед концертом Imperial Orchestra. Масштаб шоу поразил, и я спросил, не нужен ли им помощник с нотами. Главный композитор как раз искал ассистента — сейчас мы коллеги. Через пару лет я уже делал программы самостоятельно как штатный аранжировщик. Оркестр собирает многотысячные залы, его записи на YouTube набирают миллионы просмотров, и часть этих аранжировок — моя.",
        "Потом я ушёл во фриланс: продолжаю работать с Imperial Orchestra, а также с другими оркестрами и ансамблями, театрами, композиторами и артистами. В 2025 году был музыкальным продюсером в арт-школе «Таврида.Арт» и делал аранжировки песен её участников.",
        "Самая сложная программа за всё время — шоу по фильмам Тима Бёртона. Музыка Дэнни Эльфмана к «Сонной лощине» по языку ближе к авангарду XX века: тональность и форма размыты, стили сменяют друг друга, и снимать её на слух было настоящим испытанием. Партитуры были готовы в срок, концерт прозвучал так, как должен был.",
        "Сейчас я продолжаю работать с оркестрами и артистами, учусь писать свою музыку и развиваюсь в звукорежиссуре и саунд-дизайне. Без него современную оркестровую музыку уже не представить: у Людвига Йоранссона, например, на саунд-дизайне держится всё звучание."
      ],
      "tags": [
        "Оркестровка",
        "Аранжировка",
        "Саунд-дизайн",
        "Снятие на слух",
        "Клик-треки",
        "Плейбэки",
        "Сведение",
        "Нотный набор"
      ],
      "portrait": "assets/media/about/photo_2026-08-10-23.33.43.jpg",
      "readMore": "Подробнее",
      "bgPhoto": "assets/media/home/about-2.jpg"
    },
    "forWhom": {
      "eyebrow": "Для кого",
      "heading": "С кем я работаю",
      "subheading": "",
      "bgPhoto": "",
      "items": [
        {
          "title": "Продюсеры шоу и концертные оркестры",
          "description": "Концертные программы целиком и отдельные номера.",
          "tasks": [
            "Программа под ключ",
            "Отдельные номера",
            "Клик и плейбэк",
            "Адаптация под состав"
          ]
        },
        {
          "title": "Артисты и группы",
          "description": "Аранжировки и минусовки, оркестровые версии песен, концертные плейбэки.",
          "tasks": [
            "Аранжировка трека",
            "Минусовка",
            "Оркестровая версия песни",
            "Клик и плейбэк"
          ]
        },
        {
          "title": "Студии, продакшены, медиа",
          "description": "Музыка и звук для видео, рекламы и эфиров.",
          "tasks": [
            "Эпик-кавер",
            "Саунд-дизайн",
            "Музыка к видео",
            "Сведение и мультитреки"
          ]
        },
        {
          "title": "Композиторы и аранжировщики",
          "description": "Оркестровка эскизов, нотный набор, аудиоверсии для показа.",
          "tasks": [
            "Оркестровка демо",
            "Нотный набор",
            "Проверка партитуры",
            "Аудиоверсия"
          ]
        },
        {
          "title": "Театры",
          "description": "Оркестровка и переаранжировка под состав театра.",
          "tasks": [
            "Оркестровка из клавира",
            "Переаранжировка под состав",
            "Фонограммы"
          ]
        },
        {
          "title": "Учебные и любительские коллективы",
          "description": "Переложения под реальный состав и уровень исполнителей. Сниженные цены.",
          "tasks": [
            "Переложение под состав",
            "Партии по уровню",
            "Народный оркестр"
          ]
        }
      ]
    },
    "process": {
      "eyebrow": "Процесс",
      "heading": "Порядок работы",
      "subheading": "Изучение материалов и смета — бесплатно. Работа начинается после предоплаты.",
      "steps": [
        {
          "title": "Техническое задание",
          "description": "Изучение задачи и исходных материалов: записей, нот, референсов. Уточнение состава, сроков и условий исполнения.",
          "result": "объём работ"
        },
        {
          "title": "Смета и сроки",
          "description": "Расчёт стоимости и графика по этапам.",
          "result": "смета и график"
        },
        {
          "title": "Договор",
          "description": "Объём, сроки и число кругов правок фиксируются в договоре. Предоплата — 50%. Демоверсия до договора — на платной основе.",
          "result": "согласованные условия"
        },
        {
          "title": "Работа и согласование",
          "description": "Аудиоверсия аранжировки утверждается до нотного этапа. Для нотных задач порядок согласования определяется отдельно.",
          "result": "утверждённый материал"
        },
        {
          "title": "Сдача",
          "description": "Материалы в оговорённых форматах. Правки по итогам репетиций — в рамках оговорённых кругов. Остаток оплаты — после сдачи.",
          "result": "партитура, партии, клик и плейбэк"
        }
      ],
      "bgPhoto": "assets/media/home/photo_2026-08-11-16.47.31.jpg",
      "resultLabel": "Результат"
    },
    "portfolio": {
      "eyebrow": "Портфолио",
      "heading": "Портфолио",
      "subheading": "",
      "viewAll": "Все проекты",
      "backToList": "← Все проекты",
      "detailsLabel": "Подробнее",
      "stagesLabel": "Этапы работы",
      "galleryLabel": "Фото",
      "videoLabel": "Видео",
      "audioLabel": "Аудио",
      "filters": [
        {
          "key": "all",
          "label": "Все"
        },
        {
          "key": "show",
          "label": "Оркестровые шоу"
        },
        {
          "key": "arrangement",
          "label": "Аранжировка и оркестровка"
        },
        {
          "key": "theatre",
          "label": "Театр и мюзиклы"
        },
        {
          "key": "production",
          "label": "Саунд-продакшн"
        }
      ],
      "projects": [
        {
          "id": "burton-show",
          "category": "show",
          "categoryLabel": "Оркестровое шоу",
          "title": "Шоу саундтреков по фильмам Тима Бёртона",
          "meta": "90 минут музыки · симфонический оркестр",
          "description": "Полный цикл подготовки концертной программы по музыке фильмов Тима Бёртона: от структуры номеров до сдачи партитур и сопровождения на репетициях и премьере. В программе двенадцать номеров: «Кошмар перед Рождеством», «Труп невесты», «Эдвард руки-ножницы», «Суини Тодд», «Алиса в стране чудес», «Битлджус», «Уэнсдэй» по первому сезону, «Мрачные тени», «Сонная лощина», «Франкенвини», «Чарли и шоколадная фабрика» и «Уэнсдэй» по второму сезону.",
          "stats": [
            {
              "value": "90′",
              "label": "хронометраж",
              "icon": "clock"
            },
            {
              "value": "8",
              "label": "этапов работы",
              "icon": "steps"
            },
            {
              "value": "2025",
              "label": "премьера",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Создание «структур» номеров по каждому фильму",
            "Создание клик-трека",
            "Съём по слуху оркестрового материала",
            "Аранжировка",
            "Саунд-дизайн и подбор синтов",
            "Создание плейбэка",
            "Партитуры и партии",
            "Участие в репетициях"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/burton-show/main.jpg"
          },
          "heroImage": "assets/media/portfolio/burton-show/main.jpg",
          "photos": [
            "assets/media/portfolio/burton-show/conductor.jpg",
            "assets/media/portfolio/burton-show/10.jpg",
            "assets/media/portfolio/burton-show/02.jpg",
            "assets/media/portfolio/burton-show/03.jpg",
            "assets/media/portfolio/burton-show/04.jpg",
            "assets/media/portfolio/burton-show/05.jpg",
            "assets/media/portfolio/burton-show/06.jpg",
            "assets/media/portfolio/burton-show/07.jpg",
            "assets/media/portfolio/burton-show/08.jpg",
            "assets/media/portfolio/burton-show/09.jpg",
            "assets/media/portfolio/burton-show/11.jpg",
            "assets/media/portfolio/burton-show/photo_2026-10-17-04.41.44.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/burton-show/img_4140.mp4",
              "poster": "assets/media/portfolio/burton-show/img_4140-poster.jpg"
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "date": "2025-10",
          "music": []
        },
        {
          "id": "harry-potter-show",
          "category": "show",
          "categoryLabel": "Оркестровое шоу",
          "title": "Шоу саундтреков по фильмам о «Гарри Поттере»",
          "meta": "100 минут музыки · симфонический оркестр",
          "description": "Программа из симфонических картин по каждому фильму франшизы. Работа шла по тем же этапам, что и в программе по Бёртону; часть номеров делали другие аранжировщики, их партитуры я проверял и редактировал.",
          "stats": [
            {
              "value": "100′",
              "label": "хронометраж",
              "icon": "clock"
            },
            {
              "value": "7",
              "label": "основных симфонических картин",
              "icon": "steps"
            },
            {
              "value": "Декабрь 2024",
              "label": "премьера",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Создание «структур» номеров по каждому фильму",
            "Создание клик-трека",
            "Съём по слуху оркестрового материала части номеров",
            "Аранжировка",
            "Проверка и редактура работы других аранжировщиков",
            "Саунд-дизайн и подбор синтов",
            "Создание плейбэка",
            "Партитуры и партии",
            "Участие в репетициях и концертах"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/harry-potter-show/44b6c2e6bb00421db5fa60fa3c07.jpg"
          },
          "heroImage": "assets/media/portfolio/harry-potter-show/44b6c2e6bb00421db5fa60fa3c07.jpg",
          "photos": [
            "assets/media/portfolio/harry-potter-show/44b6c2e6bb00421db5fa60fa3c07.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/harry-potter-show/img_8210.mp4",
              "poster": "assets/media/portfolio/harry-potter-show/img_8210-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/harry-potter-show/img_8217.mp4",
              "poster": ""
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/harry-potter-show/img_8218.mp4",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "hp-planetarium",
          "category": "show",
          "categoryLabel": "Оркестровое шоу",
          "title": "«Гарри Поттер» в планетарии",
          "meta": "Amadeus · 50 минут музыки · уменьшенный состав",
          "description": "Программа по музыке всех фильмов франшизы для планетария. Плотную оркестровку Джона Уильямса, Николаса Хупера и Александра Деспла нужно было переложить на состав намного меньше симфонического так, чтобы темы остались узнаваемыми. Срок — две с половиной недели, часть номеров делал второй аранжировщик.",
          "stats": [
            {
              "value": "50′",
              "label": "хронометраж",
              "icon": "clock"
            },
            {
              "value": "24",
              "label": "композиции",
              "icon": "steps"
            },
            {
              "value": "2025",
              "label": "премьера",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Съём материала на слух",
            "Сборка номеров по каждому фильму",
            "Переложение на уменьшенный состав",
            "Партитуры и комплекты партий"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/hp-planetarium/img_4653.jpg"
          },
          "heroImage": "assets/media/portfolio/hp-planetarium/img_4653.jpg",
          "photos": [
            "assets/media/portfolio/hp-planetarium/img_4653.jpg",
            "assets/media/portfolio/hp-planetarium/img_4651.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/video.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/video-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4666.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4666-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4667.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4667-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4668.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4668-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4670.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4670-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4665.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4665-poster.jpg"
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "date": "Декабрь 2025",
          "music": []
        },
        {
          "id": "kish",
          "category": "show",
          "categoryLabel": "Оркестровое шоу",
          "title": "Шоу «Король и Шут» с симфоническим оркестром",
          "meta": "Imperial Orchestra · две редакции программы",
          "description": "Первая редакция сделана вместе с главным композитором-аранжировщиком. Обновлённую программу вёл уже сам: новые номера, работа с хором, пересборка партитур и клика, репетиции и концерты.",
          "stats": [],
          "scope": [
            "Набор основ и правка партитур первой редакции",
            "Клик-треки",
            "Три новых номера целиком",
            "Новые хоровые партии и запись хора",
            "Проверка и исправление партитур других авторов",
            "Пересборка программы, партитур и партий",
            "Новый клик и плейбэк",
            "Участие в репетициях и концертах"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/kish/orig.jpg"
          },
          "heroImage": "assets/media/portfolio/kish/orig.jpg",
          "photos": [
            "assets/media/portfolio/kish/img_9826-poster.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/kish/img_9826.mp4",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "duduk",
          "category": "show",
          "categoryLabel": "Оркестровое шоу",
          "title": "Программа «Магия дудука»",
          "meta": "Imperial Orchestra · сборка программы",
          "description": "Здесь я не аранжировал, а собирал программу: проверял чужие партитуры, подгонял номера под состав, исправлял ошибки, готовил клик, плейбэк и партии.",
          "stats": [],
          "scope": [
            "Проверка и редактура партитур других авторов",
            "Подгонка номеров под состав",
            "Клик-треки и плейбэки",
            "Комплекты партий"
          ],
          "media": {
            "type": "score",
            "src": ""
          },
          "heroImage": "",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": [],
          "hidden": true
        },
        {
          "id": "wizard-oz",
          "category": "theatre",
          "categoryLabel": "Театр и мюзиклы",
          "title": "Партитуры мюзикла «Волшебник Изумрудного города»",
          "meta": "29 номеров · сокращение состава",
          "description": "Переработка музыкального материала спектакля: 29 номеров, сокращение состава в партитурах и частичная переоркестровка, чистовые партитуры и партии.",
          "stats": [
            {
              "value": "29",
              "label": "номеров",
              "icon": "steps"
            }
          ],
          "scope": [
            "Разбор исходных партитур",
            "Сокращение состава",
            "Частичная переоркестровка",
            "Оформление партитур и партий",
            "Проверка и сдача комплекта"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/wizard-oz/taqx5pqdmokmio-1tzwyck0vjylpmazwxh4xil6oj5lyy4cgzw1vtkninuir.jpg"
          },
          "heroImage": "assets/media/portfolio/wizard-oz/taqx5pqdmokmio-1tzwyck0vjylpmazwxh4xil6oj5lyy4cgzw1vtkninuir.jpg",
          "photos": [
            "assets/media/portfolio/wizard-oz/taqx5pqdmokmio-1tzwyck0vjylpmazwxh4xil6oj5lyy4cgzw1vtkninuir.jpg"
          ],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "polnolunie",
          "category": "theatre",
          "categoryLabel": "Театр и мюзиклы",
          "title": "Концертные партитуры к рок-опере «Полнолуние»",
          "meta": "37 проектов Logic · 240 минут · партитуры и партии",
          "description": "Концертная версия рок-оперы: от проектов Logic до готовых партитур и партий. Каждый из 37 проектов нужно было проверить и почистить, выровнять MIDI, снять на слух партии, которые существовали только в аудио, и сверить всё с клавиром. Дальше — оркестровка на концертный состав, партитуры с вокальными строчками из клавира, аудиоверсия каждой партитуры и комплекты партий. Работа заняла почти четыре месяца.",
          "stats": [
            {
              "value": "240′",
              "label": "хронометраж",
              "icon": "clock"
            },
            {
              "value": "37",
              "label": "проектов Logic",
              "icon": "steps"
            },
            {
              "value": "4",
              "label": "месяца работы",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Проверка и очистка 37 проектов Logic",
            "Выравнивание MIDI",
            "Снятие на слух партий, записанных только в аудио",
            "Сверка с клавиром",
            "Оркестровка на концертный состав",
            "Вывод партитур и перенос вокальных строчек из клавира",
            "Аудиоверсия каждой партитуры из Sibelius",
            "Вёрстка и сборка комплектов партий",
            "Правки по замечаниям автора"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/polnolunie/snimok-ekrana-2026-09-22-v-03.18.13.jpg"
          },
          "heroImage": "assets/media/portfolio/polnolunie/snimok-ekrana-2026-09-22-v-03.18.13.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "multiland",
          "category": "show",
          "categoryLabel": "Оркестровое шоу",
          "title": "Шоу мультипликационных саундтреков «Мультиленд»",
          "meta": "Imperial Orchestra · симфонический оркестр",
          "description": "Детская программа по музыке мультфильмов. Роль в номерах разная: что-то сделано целиком, где-то это набор партитуры с оригинала под аранжировку другого автора, где-то — съём недостающего материала на слух.",
          "stats": [],
          "scope": [
            "«Аллилуйя» из «Шрека» — номер целиком: съём, аранжировка, партитура и партии",
            "«Аладдин» — набор партитуры с оригинала, переаранжировка, сборка нескольких тем в один номер",
            "«Рапунцель» — то же, часть материала снята на слух",
            "«Моана» — съём вокальных партий",
            "«Русалочка» и «Красавица и Чудовище» — набор партитур с оригиналов, аранжировка другого автора"
          ],
          "media": {
            "type": "score",
            "src": ""
          },
          "heroImage": "",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": [],
          "hidden": true
        },
        {
          "id": "tavrida-2025",
          "category": "production",
          "categoryLabel": "Саунд-продакшн",
          "title": "Саунд-продюсирование треков, «Таврида.Арт» 2025",
          "meta": "2 трека · летняя творческая школа",
          "description": "Работа саунд-продюсером в летней творческой школе «Таврида.Арт». За 5 дней было сделано очень много аранжировок и демо-записей, но до финального выступления добрались только 2 трека: «Это путь» (Настя Заровкина) и «Привет» (Вячеслав Булатов).",
          "stats": [
            {
              "value": "2",
              "label": "трека",
              "icon": "steps"
            },
            {
              "value": "2025",
              "label": "год",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Разбор демо и поиск звучания трека",
            "Аранжировка и подбор партий",
            "Запись и сведение",
            "Финальная подача материала"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/tavrida-2025/4bb13d7e12fe44a5b6885998f03be644.jpg"
          },
          "heroImage": "assets/media/portfolio/tavrida-2025/4bb13d7e12fe44a5b6885998f03be644.jpg",
          "photos": [
            "assets/media/portfolio/tavrida-2025/4bb13d7e12fe44a5b6885998f03be644.jpg",
            "assets/media/portfolio/tavrida-2025/755669a45dd340029f0a50c06987a85c.jpg",
            "assets/media/portfolio/tavrida-2025/photo_2026-08-10-23.57.00.jpg",
            "assets/media/portfolio/tavrida-2025/photo_2026-08-10-23.57.06.jpg",
            "assets/media/portfolio/tavrida-2025/photo_2026-08-10-23.57.10.jpg"
          ],
          "videos": [],
          "audio": [
            {
              "title": "Настя Заровкина - \"Это путь\" (Демо)",
              "src": "assets/media/portfolio/tavrida-2025/zarovkina-22eto-put-22-demo.mp3"
            },
            {
              "title": "Вячеслав Булатов - \"Привет\" (Демо)",
              "src": "assets/media/portfolio/tavrida-2025/bulatov-22privet-22-demo.mp3"
            }
          ],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "romashka",
          "category": "production",
          "categoryLabel": "Саунд-продакшн",
          "title": "Песня-заставка «Раз, ромашка! Два, стихи!»",
          "meta": "Детский спектакль · аранжировка и сведение",
          "description": "Заказчик напел мелодию и текст голосом — из этого собрана аранжировка по его пожеланиям, сведена и отдана мультитреком.",
          "stats": [],
          "scope": [
            "Аранжировка по напетому референсу",
            "Сведение",
            "Сдача мультитреком"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/romashka/img_0298.jpg"
          },
          "heroImage": "assets/media/portfolio/romashka/img_0298.jpg",
          "photos": [
            "assets/media/portfolio/romashka/img_0298.jpg"
          ],
          "videos": [],
          "audio": [
            {
              "title": "Раз, Ромашка (+)",
              "src": "assets/media/portfolio/romashka/raz-romashka.mp3"
            }
          ],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "luzha",
          "category": "production",
          "categoryLabel": "Саунд-продакшн",
          "title": "Запись песни «Лужа» — Манка",
          "meta": "Запись · релиз на стриминге",
          "description": "Запись песни и подготовка материала. Сведение делал другой инженер; релиз доступен на стриминговых площадках.",
          "stats": [],
          "scope": [
            "Запись",
            "Подготовка мультитрека"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/luzha/photo_2026-10-17-05.03.00.jpg"
          },
          "heroImage": "assets/media/portfolio/luzha/photo_2026-10-17-05.03.00.jpg",
          "photos": [
            "assets/media/portfolio/luzha/photo_2026-10-17-05.03.00.jpg"
          ],
          "videos": [
            {
              "title": "«Лужа» — Манка (Яндекс Музыка)",
              "url": "https://music.yandex.ru/album/36335579/track/138470477",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "neznaika",
          "category": "theatre",
          "categoryLabel": "Театр и мюзиклы",
          "title": "Оркестровка детского спектакля «Незнайка на Луне»",
          "meta": "15 номеров · из клавира в оркестр",
          "description": "Перенос музыкального материала спектакля из клавира в полноценную оркестровую партитуру — 15 номеров.",
          "stats": [
            {
              "value": "15",
              "label": "номеров",
              "icon": "steps"
            }
          ],
          "scope": [
            "Разбор клавира",
            "Оркестровка под состав спектакля",
            "Оформление партитур и партий"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/neznaika/irqxze3sje0vm-gogc88gw5w4ybpqmjm-txzthyrv9tr_q1jvpuoa-mjithk.jpg"
          },
          "heroImage": "assets/media/portfolio/neznaika/irqxze3sje0vm-gogc88gw5w4ybpqmjm-txzthyrv9tr_q1jvpuoa-mjithk.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "mihail-krug",
          "category": "theatre",
          "categoryLabel": "Театр и мюзиклы",
          "title": "Мюзикл на основе песен Михаила Круга",
          "meta": "Редакция проектов · партитуры",
          "description": "Ревизия готовых проектов аранжировок, вывод материала в ноты и чистовое оформление партитур для постановки.",
          "stats": [],
          "scope": [
            "Редакция проектов аранжировок",
            "Вывод материала в ноты",
            "Оформление и проверка партитур"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/mihail-krug/snimok-ekrana-2026-08-11-v-16.25.50.jpg"
          },
          "heroImage": "assets/media/portfolio/mihail-krug/snimok-ekrana-2026-08-11-v-16.25.50.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "hidden": true,
          "music": []
        },
        {
          "id": "dune-3",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка музыки трейлера «Дюна, часть 3»",
          "meta": "Симфонический оркестр",
          "description": "Переложение музыки трейлера на симфонический оркестр: плотная электронно-акустическая фактура оригинала разобрана по секциям живого состава.",
          "stats": [],
          "scope": [
            "Снятие материала на слух",
            "Аранжировка на симфонический оркестр",
            "Партитура и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/dune-3/cover.jpg"
          },
          "heroImage": "assets/media/portfolio/dune-3/cover.jpg",
          "photos": [],
          "videos": [
            {
              "title": "Трейлер «Дюна, часть 3» — Imperial Orchestra",
              "url": "https://www.youtube.com/watch?v=_KL8ab5f8NE",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "legends-heroes",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Четыре номера программы «Легенды и герои»",
          "meta": "Imperial Orchestra · «Дюна», Skyrim, Assassin's Creed, God of War",
          "description": "Четыре номера программы сделаны целиком — от выстраивания формы до готовых нот.",
          "stats": [],
          "scope": [
            "Создание формы номера",
            "Съём материала на слух",
            "Аранжировка на состав",
            "Партитура и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/legends-heroes/images-2.jpg"
          },
          "heroImage": "assets/media/portfolio/legends-heroes/images-2.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "richter",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Пять номеров программы по музыке Макса Рихтера",
          "meta": "Imperial Orchestra · пять номеров из программы",
          "description": "Пять номеров программы: The Quality of Mercy, Mercy, Infra 5, The Trees и November / Memoryhouse. Остальные номера делали другие авторы.",
          "stats": [],
          "scope": [
            "Съём материала на слух",
            "Аранжировка на состав",
            "Партитура и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/richter/1900x1900-000000-80-0-0.jpg"
          },
          "heroImage": "assets/media/portfolio/richter/1900x1900-000000-80-0-0.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "einaudi",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Два номера программы по музыке Людовико Эйнауди",
          "meta": "Imperial Orchestra · Fly и Life",
          "description": "Два номера программы — Fly и Life. Остальные номера делали другие авторы.",
          "stats": [],
          "scope": [
            "Съём материала на слух",
            "Аранжировка на состав",
            "Партитура и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/einaudi/1651_ltmys_hero-mary-croppedjpg.jpg"
          },
          "heroImage": "assets/media/portfolio/einaudi/1651_ltmys_hero-mary-croppedjpg.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "oppenheimer",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "«Оппенгеймер» — Can You Hear the Music",
          "meta": "Imperial Orchestra · совместная работа",
          "description": "Номер сделан вдвоём со вторым композитором-аранжировщиком: материал снят на слух и переложен на состав оркестра.",
          "stats": [],
          "scope": [
            "Съём материала на слух",
            "Аранжировка на состав",
            "Партитура и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/oppenheimer/youtube-tmfqyxzx9fa-maxresdefault.jpg"
          },
          "heroImage": "assets/media/portfolio/oppenheimer/youtube-tmfqyxzx9fa-maxresdefault.jpg",
          "photos": [],
          "videos": [
            {
              "title": "Oppenheimer / Can You Hear The Music — Imperial Orchestra",
              "url": "https://www.youtube.com/watch?v=TmfqYXZx9FA",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "obraz-disney",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Вокальные номера Disney для театра «Образ»",
          "meta": "Театр «Образ» · русскоязычные версии песен",
          "description": "Песни из мультфильмов в русскоязычных версиях, аранжированные под конкретных исполнителей театра. Часть номеров сдана, часть в работе.",
          "stats": [],
          "scope": [
            "«Холодное сердце» — «Отпусти и забудь», дуэт Анны и Ханса, песни Кристофа и Анны",
            "«Красавица и чудовище» — песня Белль, «Гастон», ария Чудовища",
            "«Русалочка» — песня Урсулы",
            "«Аладдин» — песня Жасмин",
            "«Король Лев» — песня Шрама",
            "«Анастасия» — песня Распутина"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/obraz-disney/img_0340.jpg"
          },
          "heroImage": "assets/media/portfolio/obraz-disney/img_0340.jpg",
          "photos": [
            "assets/media/portfolio/obraz-disney/img_0340.jpg"
          ],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "mtv-orchestra",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Две песни для оркестра, MTV",
          "meta": "Spice Girls и «Отпетые мошенники»",
          "description": "Два популярных трека переложены на симфонический оркестр целиком — от съёма на слух до готовых партий.",
          "stats": [],
          "scope": [
            "Съём материала на слух",
            "Аранжировка на симфонический оркестр",
            "Партитура и партии"
          ],
          "media": {
            "type": "score",
            "src": ""
          },
          "heroImage": "",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": [],
          "hidden": true
        },
        {
          "id": "karamanov",
          "category": "arrangement",
          "categoryLabel": "Нотный набор",
          "title": "Набор партитуры с рукописи: Концерт для скрипки А. Караманова",
          "meta": "175 страниц партитуры · с рукописного оригинала",
          "description": "Партитура концерта набрана с рукописи — 175 страниц. Нужно было разобрать почерк, восстановить неразборчивые места и свести разночтения между страницами, чтобы оркестр играл по нотам без вопросов.",
          "stats": [
            {
              "value": "175",
              "label": "страниц партитуры",
              "icon": "steps"
            }
          ],
          "scope": [
            "Разбор рукописного оригинала",
            "Набор партитуры",
            "Проверка и сверка разночтений"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.06.30.jpg"
          },
          "heroImage": "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.06.30.jpg",
          "photos": [
            "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.05.48.jpg",
            "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.06.30.jpg"
          ],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "new-project",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка саундтрека из фильма «Одиссея»",
          "meta": "16 минут музыки · оркестр, синтезаторы и этнические инструменты",
          "description": "Самая объёмная из отдельных аранжировок: шестнадцать минут непрерывной музыки. Партитура Людвига Йоранссона держится на сочетании, которое встречаешь нечасто — греческие этнические инструменты, современный саунд-дизайн и симфонический оркестр звучат одним организмом, а не тремя слоями друг поверх друга. Основная работа была не в нотах, а в поиске: какими синтезаторами набрать нужный тембр и как посадить его в оркестр, чтобы он не спорил с живыми инструментами и не тонул в них.",
          "stats": [
            {
              "value": "16′",
              "label": "хронометраж",
              "icon": "clock"
            }
          ],
          "scope": [
            "Съём материала на слух",
            "Оркестровка на симфонический состав",
            "Подбор синтезаторов и тембров",
            "Баланс электроники и живого оркестра",
            "Партитура и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/new-project/1200x675_cmsv2_c2af739c-5ea8-55d4-b5b6-d0ea1b4bc478-9839988..avif"
          },
          "heroImage": "assets/media/portfolio/new-project/1200x675_cmsv2_c2af739c-5ea8-55d4-b5b6-d0ea1b4bc478-9839988..avif",
          "photos": [
            "assets/media/portfolio/new-project/snimok-ekrana-2026-09-22-v-03.50.14.jpg",
            "assets/media/portfolio/new-project/snimok-ekrana-2026-10-17-v-03.27.05.jpg",
            "assets/media/portfolio/new-project/snimok-ekrana-2026-10-17-v-03.27.16.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "https://youtu.be/GnaQf1Tluyc?si=sOUE00qBeBFsWShL",
              "src": "",
              "poster": ""
            },
            {
              "title": "",
              "url": "https://open.spotify.com/album/0rBYeLCQiEAz77aEgGO4Vy?si=IYixS1efQV2TypaBlkirUg",
              "src": "",
              "poster": ""
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/new-project/img_9472.mp4",
              "poster": "assets/media/portfolio/new-project/img_9472-poster.jpg"
            }
          ],
          "audio": [],
          "hidden": false,
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "gladiator",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка саундтрека из фильма «Гладиатор»",
          "meta": "14 минут · полный цикл продакшена",
          "description": "Номер для оркестрового шоу, сделанный целиком: снятие на слух, аранжировка, саунд-дизайн, клик, плейбэк, партитура и партии.",
          "stats": [
            {
              "value": "14′",
              "label": "хронометраж",
              "icon": "clock"
            }
          ],
          "scope": [
            "Снятие материала на слух",
            "Аранжировка и оркестровка",
            "Саунд-дизайн и подбор синтов",
            "Клик-трек и плейбэк",
            "Партитуры и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/gladiator/youtube-5fi0-8d9b_0-maxresdefault.jpg"
          },
          "heroImage": "assets/media/portfolio/gladiator/youtube-5fi0-8d9b_0-maxresdefault.jpg",
          "photos": [],
          "videos": [
            {
              "title": "«Гладиатор» — Imperial Orchestra, Hans Zimmer's Universe",
              "url": "https://youtu.be/5fi0-8d9B_0?si=Q6O5ak20qrMFisYj",
              "src": "",
              "poster": "assets/media/portfolio/gladiator/youtube-meqzv23sdgo-maxresdefault.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/gladiator/gladiator-part-1-1.mp4",
              "poster": "assets/media/portfolio/gladiator/gladiator-part-1-1-poster.jpg"
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "james-bond",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка саундтрека из фильма «Джеймс Бонд»",
          "meta": "12 минут · полный цикл продакшена",
          "description": "Номер для оркестрового шоу, сделанный целиком: снятие на слух, аранжировка, саунд-дизайн, клик, плейбэк, партитура и партии.",
          "stats": [
            {
              "value": "12′",
              "label": "хронометраж",
              "icon": "clock"
            }
          ],
          "scope": [
            "Снятие материала на слух",
            "Аранжировка и оркестровка",
            "Саунд-дизайн и подбор синтов",
            "Клик-трек и плейбэк",
            "Партитуры и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/james-bond/c6u8rhrir4sslltu8a10.jpg"
          },
          "heroImage": "assets/media/portfolio/james-bond/c6u8rhrir4sslltu8a10.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "top-gun",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка саундтрека из фильма «Топ Ган»",
          "meta": "5 минут · полный цикл продакшена",
          "description": "Номер для оркестрового шоу, сделанный целиком: снятие на слух, аранжировка, саунд-дизайн, клик, плейбэк, партитура и партии.",
          "stats": [
            {
              "value": "5′",
              "label": "хронометраж",
              "icon": "clock"
            }
          ],
          "scope": [
            "Снятие материала на слух",
            "Аранжировка и оркестровка",
            "Саунд-дизайн и подбор синтов",
            "Клик-трек и плейбэк",
            "Партитуры и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/top-gun/756599473916784.jpg"
          },
          "heroImage": "assets/media/portfolio/top-gun/756599473916784.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "the-boys",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка саундтрека из сериала «Пацаны»",
          "meta": "5 минут · полный цикл продакшена",
          "description": "Номер для оркестрового шоу, сделанный целиком: снятие на слух, аранжировка, саунд-дизайн, клик, плейбэк, партитура и партии.",
          "stats": [
            {
              "value": "5′",
              "label": "хронометраж",
              "icon": "clock"
            }
          ],
          "scope": [
            "Снятие материала на слух",
            "Аранжировка и оркестровка",
            "Саунд-дизайн и подбор синтов",
            "Клик-трек и плейбэк",
            "Партитуры и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/the-boys/cover.jpg"
          },
          "heroImage": "assets/media/portfolio/the-boys/cover.jpg",
          "photos": [],
          "videos": [
            {
              "title": "Тема Хоумлендера, «Пацаны» — Imperial Orchestra Live",
              "url": "https://www.youtube.com/watch?v=9TA8fujWBss",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "stranger-things",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка саундтрека из сериала «Очень странные дела»",
          "meta": "14 минут · полный цикл продакшена",
          "description": "Номер для оркестрового шоу, сделанный целиком: снятие на слух, аранжировка, саунд-дизайн, клик, плейбэк, партитура и партии.",
          "stats": [
            {
              "value": "14′",
              "label": "хронометраж",
              "icon": "clock"
            }
          ],
          "scope": [
            "Снятие материала на слух",
            "Аранжировка и оркестровка",
            "Саунд-дизайн и подбор синтов",
            "Клик-трек и плейбэк",
            "Партитуры и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/stranger-things/960x540.jpg"
          },
          "heroImage": "assets/media/portfolio/stranger-things/960x540.jpg",
          "photos": [],
          "videos": [
            {
              "title": "",
              "url": "https://youtu.be/XFifsyyKL2g?is=n-IgpIc9ZnlGtum6",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "date": "2026-04",
          "music": []
        },
        {
          "id": "house-of-the-dragon",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Аранжировка саундтрека из сериала «Дом Дракона»",
          "meta": "12 минут · полный цикл продакшена",
          "description": "Номер для оркестрового шоу, сделанный целиком: снятие на слух, аранжировка, саунд-дизайн, клик, плейбэк, партитура и партии.",
          "stats": [
            {
              "value": "12′",
              "label": "хронометраж",
              "icon": "clock"
            }
          ],
          "scope": [
            "Снятие материала на слух",
            "Аранжировка и оркестровка",
            "Саунд-дизайн и подбор синтов",
            "Клик-трек и плейбэк",
            "Партитуры и партии"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/house-of-the-dragon/cover.jpg"
          },
          "heroImage": "assets/media/portfolio/house-of-the-dragon/cover.jpg",
          "photos": [],
          "videos": [
            {
              "title": "",
              "url": "https://www.youtube.com/watch?v=asQEnl-mH-0&si=tVp45N8KglplBRo8",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        }
      ],
      "bgPhoto": ""
    },
    "services": {
      "eyebrow": "Услуги",
      "heading": "Услуги и цены",
      "subheading": "Ориентировочные цены и калькулятор. Точная стоимость — после изучения материала.",
      "viewAll": "Все услуги и цены",
      "note": "Цены ориентировочные и не являются публичной офертой. Итоговая стоимость зависит от состава, объёма, сроков и формата использования музыки: концерт, запись, гастроли, реклама. Для учебных и любительских коллективов — скидка. Стоимость фиксируется в договоре.",
      "bgPhoto": "",
      "detailsLabel": "Подробнее",
      "hideLabel": "Свернуть",
      "groups": [
        {
          "id": "arrangement",
          "title": "Аранжировка и оркестровка",
          "summary": "Оркестр, камерный и эстрадный состав, концертные программы."
        },
        {
          "id": "production",
          "title": "Саунд-продакшн",
          "summary": "Треки, каверы, плейбэки и саунд-дизайн в Logic Pro."
        },
        {
          "id": "score",
          "title": "Ноты",
          "summary": "Нотный набор, снятие на слух, мелодическая строка."
        }
      ],
      "items": [
        {
          "bullets": [],
          "title": "Аранжировка для оркестра",
          "group": "arrangement",
          "description": "Оркестровка под заданный состав, динамический план.",
          "detail": "Полная партитура по эскизу или референсу: распределение материала по группам, динамический план, баланс, исполнимость партий. Стоимость зависит от состава и сложности материала.",
          "price": "от 5 000 ₽ / мин"
        },
        {
          "bullets": [],
          "title": "Камерное переложение",
          "group": "arrangement",
          "description": "Переложение под струнный, духовой или смешанный ансамбль.",
          "detail": "Переложение готовой партитуры с учётом возможностей конкретного ансамбля. Работа по записи без партитуры относится к аранжировке.",
          "price": "от 2 500 ₽ / мин"
        },
        {
          "bullets": [],
          "title": "Концертная программа под ключ",
          "group": "arrangement",
          "description": "Структура номеров, аранжировки, клик, плейбэк, партитуры.",
          "detail": "Программа целиком: структура вечера и номеров, снятие и аранжировка материала, клик-треки и плейбэки, партитуры и партии, работа на репетициях. Цена — по объёму программы.",
          "price": "от 150 000 ₽ / программа"
        },
        {
          "bullets": [],
          "title": "Аранжировка трека",
          "group": "production",
          "description": "Поп, рок, эстрада: аранжировка песни или минусовка.",
          "detail": "Аранжировка песни под артиста или группу, минусовка по оригиналу, новая версия известного трека. Живые и виртуальные инструменты, сведение, стемы для концерта.",
          "price": "от 10 000 ₽ / трек"
        },
        {
          "bullets": [],
          "title": "Эпик-кавер",
          "group": "production",
          "description": "Оркестровая версия трека с эффектами и сведением.",
          "detail": "Кавер в кинематографическом звучании: оркестровые и хоровые библиотеки, синтезаторы, ударные, эффекты. Сведение, мастер и мультитреки для дальнейшей работы.",
          "price": "от 10 000 ₽ / трек"
        },
        {
          "bullets": [],
          "title": "Клик и плейбэк",
          "group": "production",
          "description": "Темповая сетка, метки, синтезаторные и хоровые слои.",
          "detail": "Темповая сетка и метки переходов, синтезаторные партии, хор и дополнительные слои. Стемы и клик — в формате для звукорежиссёра и дирижёра.",
          "price": "от 500 ₽ / мин"
        },
        {
          "bullets": [],
          "title": "Саунд-дизайн",
          "group": "production",
          "description": "Шумы, атмосферы, переходы, звук к видео.",
          "detail": "Шумы, атмосферы, удары и переходы для шоу, видео и рекламы.",
          "price": "от 2 000 ₽ / мин"
        },
        {
          "bullets": [],
          "title": "Сведение и мультитреки",
          "group": "production",
          "description": "Сведение трека, стемы и мультитреки.",
          "detail": "Сведение собственных и присланных треков, подготовка стемов и мультитреков для концерта, записи или передачи другому звукорежиссёру.",
          "price": "от 10 000 ₽ / трек"
        },
        {
          "bullets": [],
          "title": "Аудиоверсия партитуры",
          "group": "production",
          "description": "Звучание номера до первой репетиции.",
          "detail": "Озвучивание партитуры оркестровыми библиотеками с проработкой баланса, штрихов и динамики — для показа заказчику или художественному совету. Для собственных партитур дешевле: проект уже собран. Сторонняя партитура требует переноса в DAW.",
          "price": "от 500 ₽ / мин"
        },
        {
          "bullets": [],
          "title": "Нотный набор",
          "group": "score",
          "description": "Набор и вёрстка в редакторе: с файла, PDF или рукописи.",
          "detail": "Набор, вёрстка и проверка на ошибки в нотном редакторе. Партитурная страница с рукописи — от 500 ₽, одноголосная партия или чистовой файл — от 350 ₽; возможен расчёт по минутам или за номер. Комплект партий с репетиционными цифрами и переворотами в паузах — отдельно.",
          "price": "от 350 ₽ / стр."
        },
        {
          "bullets": [],
          "title": "Снятие на слух",
          "group": "score",
          "description": "Расшифровка плотной фактуры с записи.",
          "detail": "Расшифровка многослойной фактуры с записи при отсутствии нот. Результат сверяется с референсом на каждом этапе.",
          "price": "от 1 500 ₽ / мин"
        },
        {
          "bullets": [],
          "title": "Мелодическая строка",
          "group": "score",
          "description": "Мелодия, слова и гармония на одном листе.",
          "detail": "Мелодия, текст и буквенные обозначения аккордов по записи. Без партитуры и партий: поинструментальные партии — это снятие на слух или нотный набор.",
          "price": "от 800 ₽ / мин"
        }
      ],
      "pricing": {
        "eyebrow": "Принцип",
        "heading": "Как формируется цена",
        "subheading": "",
        "principles": [
          {
            "title": "Только нужные этапы",
            "text": "В смету входят только необходимые этапы. При наличии партитуры снятие на слух не требуется. Любой этап можно заказать отдельно."
          },
          {
            "title": "Основная единица — минута музыки",
            "text": "Для нотного набора — также страница или номер. Количество номеров учитывается отдельно: десять коротких пьес — десять партитур и комплектов партий."
          },
          {
            "title": "Сложность определяется по партитуре",
            "text": "Категория складывается из того, что видно в нотах: размер состава, плотность фактуры, хор, ударные, редкие инструменты, смены темпа и размера."
          },
          {
            "title": "Цена фиксируется до начала работы",
            "text": "Стоимость и объём согласуются письменно до старта. Два круга правок входят в стоимость. Изменение состава или структуры — пересчёт сметы."
          }
        ]
      },
      "calculator": {
        "eyebrow": "Расчёт",
        "heading": "Калькулятор стоимости",
        "subheading": "Предварительный расчёт. Данные никуда не передаются.",
        "openLabel": "Посчитать стоимость",
        "hideLabel": "Свернуть расчёт",
        "toggleNote": "Семь шагов, 2–3 минуты."
      },
      "extra": {
        "eyebrow": "Отдельно",
        "heading": "Прикладные работы",
        "subheading": "Задачи с нестандартным объёмом. Стартовые ставки; точная — после изучения материала."
      },
      "terms": {
        "eyebrow": "Условия",
        "heading": "Условия работы",
        "items": [
          {
            "title": "Предоплата 50%",
            "text": "Работа начинается после предоплаты. Для проектов дольше месяца возможна поэтапная оплата."
          },
          {
            "title": "Остаток — 5 рабочих дней",
            "text": "В течение пяти рабочих дней после сдачи, независимо от даты премьеры."
          },
          {
            "title": "Два круга правок включены",
            "text": "Последующие круги и изменения после сдачи — 5 000 ₽ за круг. Правки, меняющие структуру, состав или тональный план, считаются новым объёмом."
          },
          {
            "title": "Что сдаётся",
            "text": "Партитура и партии в PDF, плейбэк стемами, клик отдельной дорожкой. Редактируемые исходники Sibelius и Logic Pro — по отдельному соглашению."
          },
          {
            "title": "Сроки",
            "text": "Считаются с момента, когда получены все исходные материалы и предоплата."
          },
          {
            "title": "Права на результат",
            "text": "Работа и права на неё — две разные цены. В базовую входит разовое исполнение; репертуар коллектива, исключительная лицензия и полная передача прав считаются надбавкой. Аранжировка чужого произведения — переработка: права на оригинал заказчик получает отдельно, у правообладателя или через РАО."
          }
        ],
        "ctaHeading": "Точный расчёт — по запросу",
        "ctaText": "Точная смета и сроки — после изучения материала.",
        "ctaLabel": "Запросить расчёт"
      },
      "homeHeading": "Услуги",
      "homeSubheading": ""
    },
    "testimonials": {
      "eyebrow": "Отзывы",
      "heading": "Отзывы",
      "subheading": "Со ссылками на оригиналы.",
      "emptyNote": "Здесь появятся отзывы заказчиков.",
      "items": [
        {
          "id": "t-bugakova",
          "name": "Милена Бугакова",
          "role": "Народный оркестр · инструментовка",
          "text": "Хочу поблагодарить за профессиональную, быструю, а самое главное — качественную работу! Заказывала инструментовку для народного оркестра. С самого начала очень внимательно выслушали мои требования и уточнили свои детали. Позже прислали мне первую страницу для подтверждения своей работы. Очень продуманная и качественная инструментовка. Мне очень понравилась, и ребята играют с удовольствием! Спасибо Вам! Обязательно буду обращаться ещё!",
          "date": "06.12.2021",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-sumcova",
          "name": "Вероника Сумцова",
          "role": "Заказчица",
          "text": "Сердечно благодарю Льва за потрясающую и оперативную работу, учитывающую все пожелания, правки и коррективы! Мне невероятно повезло встретить такого профессионального музыканта, который всегда готов прийти на помощь и качественно её осуществить. С момента моего обращения до выдачи мне готового материала прошло всего полдня. Я в восторге! Несомненно, буду обращаться ещё сама и всем рекомендовать!",
          "date": "31.01.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-klionovskaya",
          "name": "Анна Клионовская",
          "role": "Заказчица",
          "text": "Бесконечно благодарна Льву за работу, которая была выполнена за короткий промежуток времени и, что самое главное, очень качественно! Ему удалось воплотить всё то, что было задумано, с точностью, что показывает высокий профессионализм и мастерство в этом деле. Ещё раз спасибо!",
          "date": "11.03.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-pavlova",
          "name": "Елизавета Павлова",
          "role": "Постоянный заказчик",
          "text": "Обращалась к Льву дважды. Всё было выполнено качественно и, самое главное, быстро. Рекомендую всем не сомневаться и попросить именно его выполнить нужную вам работу.",
          "date": "11.03.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-serdobolskaya",
          "name": "Ярослава Сердобольская",
          "role": "Заказчица",
          "text": "Это гений скорости. Человек отзывчивый, грамотный, лучший.",
          "date": "20.05.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-tuygunova",
          "name": "Татьяна Туйгунова-Балева",
          "role": "Заказчица",
          "text": "Лев, спасибо большое за проделанную работу! Очень профессионально, качественно и в короткие сроки. Спасибо за то, что учли все пожелания и даже внесли дополнения, о которых я подумала слишком поздно, когда работа была уже окончена. Было очень приятно с Вами работать. Обязательно обращусь ещё и очень рекомендую тем, кто ищет такого рода услуги.",
          "date": "15.07.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-ilina",
          "name": "Людмила Ильина",
          "role": "Заказчица",
          "text": "Была заказана довольно объёмная работа — выполнена быстро и очень хорошо! Всем рекомендую.",
          "date": "26.08.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        }
      ],
      "sourceLabels": {
        "site": "Отзыв с сайта",
        "vk": "ВКонтакте",
        "avito": "Авито",
        "telegram": "Telegram",
        "other": "Отзыв"
      },
      "sourceLinkLabel": "Смотреть первоисточник",
      "prevLabel": "Предыдущий отзыв",
      "nextLabel": "Следующий отзыв"
    },
    "blog": {
      "eyebrow": "Новости",
      "heading": "Новости",
      "subheading": "Концерты, премьеры, новые проекты.",
      "viewAll": "Все новости",
      "note": "",
      "posts": [
        {
          "id": "dune-trailer",
          "date": "",
          "category": "Работа",
          "title": "Аранжировка трейлера «Дюна, часть 3»",
          "excerpt": "Полную версию аранжировки эпик-трейлера выложили на YouTube.",
          "body": "На YouTube выложили полную версию нашей аранжировки «эпик»-трейлера «Дюны».\n\nОтдельно отмечу солиста: партия непростая, а спета уверенно и точно попадая в нужный образ.",
          "cover": "assets/media/blog/dune-trailer/cover.jpg",
          "photos": [],
          "video": "https://youtu.be/_KL8ab5f8NE",
          "links": [
            {
              "label": "Смотреть на YouTube",
              "href": "https://youtu.be/_KL8ab5f8NE"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "the-boys-track",
          "date": "17.06.2026",
          "category": "Работа",
          "title": "Закончил работу над новым треком «Пацаны»",
          "excerpt": "Новый трек в работе над сериалом — и несколько слов про инструменты.",
          "body": "Сделали очередной трек по сериалу «Пацаны». Отдельно радует, как ребята сводят материал: по сравнению с сырой концертной записью разница слышна сразу.\n\nВместо живой записи в этот раз использовал библиотеку народных инструментов Ильи Ефимова — баян в ней звучит достаточно убедительно для такой задачи.",
          "cover": "assets/media/blog/the-boys-track/cover.jpg",
          "photos": [],
          "video": "https://youtu.be/9TA8fujWBss",
          "links": [
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/108"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "orchestral-tracks",
          "date": "08.06.2026",
          "category": "Из мастерской",
          "title": "Пять дней над двумя большими треками",
          "excerpt": "Фрагмент работы и несколько мыслей о том, как не «замылить» слух за долгую смену.",
          "body": "Готовлю два больших трека для оркестра и решил показать фрагмент того, что успел сделать за пять дней работы.\n\nСамое сложное в такой долгой работе — даже не написать, а удержать концентрацию: через несколько часов слух «замыливается», и решения начинают приниматься по инерции. Помогают перерывы, сон и спорт — банально, но без этого качество на длинной дистанции падает быстрее, чем кажется.",
          "cover": "assets/media/blog/orchestral-tracks/photo_2026-09-22-05.37.14.jpg",
          "photos": [],
          "video": "https://t.me/levlvovichmusicwork/107",
          "links": [
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/106"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "beat-library",
          "date": "31.05.2026",
          "category": "Инструменты",
          "title": "Сделал справочник drum-паттернов",
          "excerpt": "Небольшой веб-сервис: визуализация, сортировка по жанрам, прослушивание и выгрузка в MIDI.",
          "body": "Собрал небольшой интерактивный веб-сервис с drum-паттернами на основе одного полезного справочника.\n\nВнутри — визуализация рисунка, сортировка по жанрам и воспроизведение примеров. Позже добавил выгрузку в MIDI и гайд по условным обозначениям.\n\nПользуйтесь, если пригодится в работе.",
          "cover": "assets/media/blog/beat-library/01.jpg",
          "photos": [],
          "video": "",
          "links": [
            {
              "label": "Открыть BeatLibrary",
              "href": "https://levchic.github.io/BeatLibrary/"
            },
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/104"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "burton-concert",
          "date": "19.04.2026",
          "category": "Отчёт",
          "title": "Сходил на «Мир Бёртона» — спустя полгода после работы",
          "excerpt": "Послушал программу, над которой работал полгода назад, уже как слушатель.",
          "body": "Сходил на концертную программу «Мир Бёртона», которую делал полгода назад: хотелось послушать и разобрать её уже свежей головой.\n\nАртисты, правда, припомнили мне довольно сложный и неудобный материал. Но звучало всё на порядок лучше, чем на премьере — музыка там действительно непростая.\n\nМестами есть вопросы, но они скорее следствие принятых в аранжировках решений: как раз за этим я и шёл — определить их и учесть в следующей работе.",
          "cover": "assets/media/blog/burton-concert/01.jpg",
          "photos": [
            "assets/media/blog/burton-concert/02.jpg",
            "assets/media/blog/burton-concert/03.jpg",
            "assets/media/blog/burton-concert/04.jpg",
            "assets/media/blog/burton-concert/05.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/90"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "profi-song",
          "date": "14.04.2026",
          "category": "Работа",
          "title": "Детская песня на заставку к спектаклю",
          "excerpt": "Голос, записанный на телефон, — и из него полноценная аранжировка.",
          "body": "Пришли с Профи.ру: нужна была детская песня на заставку к спектаклю.\n\nЗадачу осложняло то, что прислали только голос, записанный на телефон: тональность, темп и ноты были очень приблизительные. Пришлось сначала подбирать, выравнивать и подгонять — и только потом делать аранжировку.\n\nПридумывание без чётких границ и требований для меня всегда стресс, но работу приняли. Доведу до ума и добавлю готовую запись в портфолио.",
          "cover": "assets/media/blog/profi-song/01.jpg",
          "photos": [],
          "video": "",
          "links": [
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/88"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "potter-planetarium",
          "date": "14.12.2025",
          "category": "Работа",
          "title": "Гарри Поттер для планетария: 50 минут музыки за 2,5 недели",
          "excerpt": "Ещё один проект по вселенной Поттера — и снова рекорд по срокам.",
          "body": "Снова о Гарри Поттере, только уже в другом проекте — для планетария.\n\nСнова бьём рекорды по скорости: нужно было успеть сделать 50 минут музыки за две с половиной недели. Один я бы не справился, поэтому здорово, что нашёлся человек, который взял на себя часть работы.\n\nЗадачу осложняло и то, что предстояло уместить довольно насыщенную оркестровку Джона Уильямса, Николаса Хупера и Александра Деспла в существенно меньший состав.",
          "cover": "assets/media/blog/potter-planetarium/01.jpg",
          "photos": [
            "assets/media/blog/potter-planetarium/02.jpg",
            "assets/media/blog/potter-planetarium/03.jpg",
            "assets/media/blog/potter-planetarium/04.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/52"
            }
          ],
          "isPlaceholder": false,
          "videoSrc": "assets/media/blog/video.mp4",
          "videoPoster": "assets/media/blog/video-poster.jpg"
        },
        {
          "id": "imperial-burton",
          "date": "13.12.2025",
          "category": "Отчёт",
          "title": "Программа для Imperial Orchestra: самая сложная работа на данный момент",
          "excerpt": "Три месяца над хэллоуинской программой по фильмам Тима Бёртона.",
          "body": "С августа по конец октября работал над программой для Imperial Orchestra — на сегодня, пожалуй, самой сложной для меня: и по уровню задач, и по срокам.\n\nТематика была приурочена к Хэллоуину, поэтому выбор пал на Тима Бёртона с его готическим фэнтези и очень разнообразной музыкой Дэнни Эльфмана.\n\nЭта работа заметно подняла планку: после неё многие вещи, казавшиеся сложными, стали рабочей рутиной.",
          "cover": "assets/media/blog/imperial-burton/01.jpg",
          "photos": [
            "assets/media/blog/imperial-burton/02.jpg",
            "assets/media/blog/imperial-burton/03.jpg",
            "assets/media/blog/imperial-burton/04.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/45"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "how-programs-made",
          "date": "10.12.2025",
          "category": "Видео",
          "title": "Как создаются концертные оркестровые программы",
          "excerpt": "Рассказал в видео весь путь — от идеи программы до партий на пультах.",
          "body": "Как создаются концертные оркестровые программы для шоу саундтреков? Рассказываю в этом видео.\n\nСъёмка и монтаж — Даня Жадаев. Фрагмент концертной записи взят с YouTube-канала Imperial Orchestra.",
          "cover": "assets/media/archive/about-3.jpg",
          "photos": [],
          "video": "https://youtu.be/6zIsDrHYI0c",
          "links": [
            {
              "label": "Съёмка и монтаж — danyazhadaev.ru",
              "href": "http://danyazhadaev.ru/"
            },
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/40"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "tavrida-artschool",
          "date": "10.12.2025",
          "category": "Отчёт",
          "title": "Арт-школа «Тавриды»: песенный саунд-продакшн с нуля",
          "excerpt": "Записывали вокал, гитары, скрипку и духовые — в студиях, домиках и беседках у моря.",
          "body": "Случайно попав в арт-школу «Тавриды», получилось прокачаться в саунд-продакшне песенного формата — практически не имея в этом опыта.\n\nЗаписывали вокал и бэк-вокал, гитары, скрипку, саксофон и флейту. Утром, днём, вечером и ночью, с перерывами на еду. В студиях, в жилых домиках и в беседках под шум моря.\n\nВ первые дни был некоторый хаос в организации, но в итоге всё сложилось — и опыт оказался из тех, что двигают вперёд сильнее любого курса.",
          "cover": "assets/media/blog/tavrida-artschool/04.jpg",
          "photos": [
            "assets/media/blog/tavrida-artschool/02.jpg",
            "assets/media/blog/tavrida-artschool/03.jpg",
            "assets/media/blog/tavrida-artschool/04.jpg",
            "assets/media/blog/tavrida-artschool/01.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Пост в Telegram",
              "href": "https://t.me/levlvovichmusicwork/36"
            }
          ],
          "isPlaceholder": false
        }
      ],
      "bgPhoto": "",
      "readMore": "Читать статью",
      "backLabel": "Все новости",
      "photosHeading": "Фото",
      "linksHeading": "Ссылки",
      "postNotFound": "Новость не найдена."
    },
    "faq": {
      "eyebrow": "Частые вопросы",
      "heading": "Частые вопросы",
      "subheading": "",
      "viewAll": "Все вопросы",
      "note": "Остались вопросы — напишите.",
      "openLabel": "Раскрыть ответ",
      "hideLabel": "Свернуть ответ",
      "bgPhoto": "assets/media/home/desk-keys.jpg",
      "items": [
        {
          "question": "Сколько стоит работа?",
          "answer": "Ориентировочные цены и калькулятор — на странице «Услуги». Точная сумма зависит от состава, сложности и сроков и называется после изучения материала. Смета бесплатная."
        },
        {
          "question": "Как начать работу?",
          "answer": "Описать задачу и прислать материалы: записи, ноты, референсы. В ответ — смета и сроки. Далее договор или согласование условий в переписке и предоплата 50%; остаток — после сдачи."
        },
        {
          "question": "Можно ли получить пробный фрагмент?",
          "answer": "Да, на платной основе: демо — такая же работа. Бесплатно — изучение материала и смета. В ходе проекта аудиоверсия аранжировки утверждается до работы над партитурой."
        },
        {
          "question": "Сколько времени занимает проект?",
          "answer": "Зависит от объёма. Сроки называются вместе со сметой и фиксируются в договоре. О срочных дедлайнах лучше сообщить сразу."
        },
        {
          "question": "Сколько правок входит в стоимость?",
          "answer": "Два круга. Следующие — 5 000 ₽ за круг. Изменения структуры, состава или тонального плана считаются новым объёмом."
        },
        {
          "question": "Есть только запись с телефона или напетая мелодия. Этого достаточно?",
          "answer": "Да. Песня-заставка «Раз, ромашка! Два, стихи!» сделана по мелодии, напетой на телефон: аранжировка, сведение, мультитрек."
        },
        {
          "question": "Кому принадлежат права на музыку?",
          "answer": "Права оговариваются до начала работы и фиксируются в договоре. Права на оригинал аранжируемого произведения остаются у правообладателя и оформляются заказчиком. Закрытые проекты не публикуются без согласия заказчика."
        },
        {
          "question": "В каком виде сдаются материалы?",
          "answer": "Партитура и партии — PDF, готовые к печати; клик и плейбэк — в формате для звукорежиссёра и дирижёра. Исходные проекты Logic Pro и Sibelius — по договорённости."
        },
        {
          "question": "Возможна ли удалённая работа?",
          "answer": "Да, большинство проектов ведётся удалённо. Ответ на сообщения — обычно в течение дня. Выезд на репетиции и запись — по договорённости."
        },
        {
          "question": "Работаете официально?",
          "answer": "Да. Самозанятость, договор и чек; для организаций — договор, акт и чек. Реквизиты — в разделе «Контакты»."
        }
      ]
    },
    "contact": {
      "eyebrow": "Контакты",
      "heading": "Контакты",
      "subheading": "Для расчёта сметы: состав, хронометраж, сроки, записи или ноты.",
      "email": "lev.maidenko@gmail.com",
      "emailLabel": "Почта",
      "copyLabel": "Скопировать",
      "copiedLabel": "Скопировано",
      "copyFailLabel": "Не вышло — выделите вручную",
      "social": [
        {
          "label": "Telegram",
          "href": "https://t.me/levlvovich2000"
        },
        {
          "label": "Telegram-канал",
          "href": "https://t.me/levlvovichmusicwork"
        },
        {
          "label": "Сообщество ВКонтакте",
          "href": "https://vk.ru/mus_helper"
        },
        {
          "label": "Личная страница ВКонтакте",
          "href": "https://vk.com/lev.maidenko"
        },
        {
          "label": "YouTube",
          "href": "https://www.youtube.com/@levlvovich2000"
        }
      ],
      "primaryBadge": "основной канал",
      "directHeading": "Написать напрямую",
      "directNote": "Ответ — обычно в течение дня.",
      "directFoot": "Майденко Лев Львович, самозанятый, ИНН 632148507539. Работа по договору."
    },
    "footer": {
      "tagline": "Аранжировка · Оркестровка · Саунд-продакшн · Logic Pro  · Sibelius",
      "rights": "Права на упомянутые произведения и материалы третьих лиц принадлежат их правообладателям.",
      "faq": "Частые вопросы",
      "privacy": "Политика конфиденциальности",
      "cookie": "Сайт использует файлы cookie. <a href=\"privacy.html\">Подробнее</a>",
      "cookieOk": "Понятно"
    },
    "langSwitch": {
      "current": "RU",
      "other": "EN"
    },
    "common": {
      "placeholderFlag": "заполните",
      "placeholderFlagShort": "заглушка",
      "readFull": "Читать полностью",
      "hideFull": "Свернуть"
    }
  },
  "en": {
    "meta": {
      "title": "Lev Maidenko — arranger and orchestrator",
      "description": "Arranging, orchestration and sound production: orchestral shows, tracks and covers, click and playback, sound design, scores and parts."
    },
    "nav": {
      "brand": "L.M.Production",
      "links": [
        {
          "href": "about.html",
          "label": "About"
        },
        {
          "href": "portfolio.html",
          "label": "Portfolio"
        },
        {
          "href": "services.html",
          "label": "Services"
        },
        {
          "href": "refs.html",
          "label": "Workshop"
        },
        {
          "href": "index.html#faq",
          "label": "FAQ"
        },
        {
          "href": "blog.html",
          "label": "News"
        },
        {
          "href": "index.html#contact",
          "label": "Contact"
        }
      ],
      "cta": "Discuss a project"
    },
    "hero": {
      "annotation": "Arranging and orchestration",
      "name": "Lev Maidenko",
      "role": "Arranger and orchestrator, St Petersburg",
      "description": "Music for orchestral shows, artists and recording — **orchestration, arranging, sound design.**",
      "ctaPrimary": "Discuss a project",
      "ctaSecondary": "Portfolio",
      "photoCaption": "At the desk",
      "frameLabel": "Frame",
      "photoSrc": "assets/media/home/img_48.jpg",
      "photos": [
        "assets/media/home/img_48.jpg",
        "assets/media/portfolio/burton-show/05.jpg",
        "assets/media/na-glavnuyu.jpg",
        "assets/media/6.jpg",
        "assets/media/snimok-ekrana-2026-08-11-v-15.43.32-2.jpg"
      ],
      "ticker": [
        "Arranging",
        "Orchestration",
        "Transcription",
        "Scores and parts",
        "Music engraving",
        "Click and playback",
        "Sound design",
        "Orchestral shows",
        "Recording and mixing"
      ],
      "marginNote": ""
    },
    "introVideo": {
      "eyebrow": "Video",
      "heading": "How is an orchestral show made?",
      "subheading": "",
      "src": "assets/media/home/intro.mp4",
      "poster": "assets/media/home/about-1.jpg",
      "digestLabel": "Stages",
      "duration": "1:23",
      "summary": "Music for a film soundtrack show: selecting material, arranging, parts. **The most demanding stage is transcription by ear**: every instrument's part is reconstructed from the recording.",
      "points": [
        "Material selection and programme dramaturgy",
        "Tempo map and score grid",
        "Transcription by ear",
        "Arranging for the ensemble, sound design, playback",
        "Click and sync to picture",
        "Score, parts, rehearsals"
      ],
      "bgPhoto": ""
    },
    "about": {
      "eyebrow": "About",
      "heading": "Biography",
      "paragraphs": [
        "I'm an arranger and orchestrator based in St Petersburg. I work on orchestral shows, arrangements for orchestras and artists, playbacks and sound design.",
        "I started out as a bayan player: music school in Tolyatti, the Rimsky-Korsakov College of Music, international competitions. For several years I was a staff arranger at Imperial Orchestra and still work with them, as well as with other orchestras, theatres and artists."
      ],
      "long": [
        "I've been playing music since I was six. At the Lyceum of Arts in Tolyatti I heard a folk ensemble with a senior student playing the bayan with real virtuosity — and chose the bayan.",
        "Eight years of lessons and competitions, most of which I came back from with a prize. By ninth grade the specialist subject was no longer in the curriculum, but my teacher kept working with me privately so I could apply to music college. School teachers told me music wouldn't feed a family and advised staying on for tenth grade — I even switched my exams to physics and chemistry. But at a competition in St Petersburg a teacher from the Rimsky-Korsakov College noticed us and invited us to apply, and in 2016 I moved from Tolyatti to St Petersburg.",
        "Over four years of study I travelled to France, Germany, Lithuania and Serbia, with a folk orchestra and to competitions. In Serbia I won the grand prix of an international bayan competition, and in 2018 I played at the World Cup in Kaunas, one of the most prestigious competitions for the instrument. That's also when I learned Sibelius: arranging for folk ensembles and orchestra, transcribing by ear and engraving to order.",
        "In 2020 I entered the Conservatory in the bayan class and was called up for military service — into a variety and symphony orchestra. I played bayan there and arranged and copied scores for the conductor on the side. Back in civilian life, I spent about a year on the Conservatory's stage crew: setting up stands and chairs, moving instruments between venues across the city. That's where I learned orchestral line-ups and seating from practice rather than textbooks.",
        "One day I was working a stage-setup shift before an Imperial Orchestra concert. The scale of the show was stunning, and I asked whether they needed help with sheet music. The chief composer happened to be looking for an assistant — today we're colleagues. A couple of years later I was producing programmes on my own as a staff arranger. The orchestra plays to audiences of thousands, its videos on YouTube get millions of views, and some of those arrangements are mine.",
        "Then I went freelance: I still work with Imperial Orchestra, as well as with other orchestras and ensembles, theatres, composers and artists. In 2025 I was a music producer at the Tavrida.Art art school, arranging songs for its participants.",
        "The hardest programme I've done is the Tim Burton show. Danny Elfman's score for Sleepy Hollow is closer to 20th-century avant-garde: tonality and form are blurred, styles shift constantly, and transcribing it by ear was a real test. The scores were ready on time, and the concert sounded the way it should.",
        "Today I keep working with orchestras and artists, I'm learning to write my own music, and I'm growing as a sound engineer and sound designer. Modern orchestral music is hard to imagine without sound design: in Ludwig Göransson's scores, for instance, it carries the whole sound."
      ],
      "tags": [
        "Orchestration",
        "Arranging",
        "Sound design",
        "Transcription",
        "Click tracks",
        "Playbacks",
        "Mixing",
        "Music engraving"
      ],
      "portrait": "assets/media/about/photo_2026-08-10-23.33.43.jpg",
      "readMore": "More",
      "bgPhoto": "assets/media/home/about-2.jpg"
    },
    "forWhom": {
      "eyebrow": "Clients",
      "heading": "Who I work with",
      "subheading": "",
      "bgPhoto": "",
      "items": [
        {
          "title": "Show producers and concert orchestras",
          "description": "Complete concert programmes and single numbers.",
          "tasks": [
            "Turnkey programme",
            "Single numbers",
            "Click and playback",
            "Adapting to an ensemble"
          ]
        },
        {
          "title": "Artists and bands",
          "description": "Arrangements and backing tracks, orchestral versions of songs, live playbacks.",
          "tasks": [
            "Track arrangement",
            "Backing track",
            "Orchestral version of a song",
            "Click and playback"
          ]
        },
        {
          "title": "Studios, production companies, media",
          "description": "Music and sound for video, advertising and broadcast.",
          "tasks": [
            "Epic cover",
            "Sound design",
            "Music to picture",
            "Mixing and multitracks"
          ]
        },
        {
          "title": "Composers and arrangers",
          "description": "Orchestrating sketches, music engraving, mock-ups for presentation.",
          "tasks": [
            "Orchestrating a demo",
            "Music engraving",
            "Score check",
            "Audio mock-up"
          ]
        },
        {
          "title": "Theatres",
          "description": "Orchestration and re-arranging for the theatre's ensemble.",
          "tasks": [
            "Orchestration from a vocal score",
            "Re-arranging for the pit",
            "Backing tracks"
          ]
        },
        {
          "title": "Student and amateur ensembles",
          "description": "Arrangements for the actual line-up and level of the players. Reduced rates.",
          "tasks": [
            "Arranging for the line-up",
            "Parts by level",
            "Folk orchestra"
          ]
        }
      ]
    },
    "process": {
      "eyebrow": "Process",
      "heading": "How it works",
      "subheading": "Reviewing the material and the estimate are free. Work starts after the advance payment.",
      "steps": [
        {
          "title": "Brief",
          "description": "Review of the task and source material: recordings, sheet music, references. Line-up, deadlines and performance conditions.",
          "result": "scope of work"
        },
        {
          "title": "Estimate and schedule",
          "description": "Cost and timeline by stage.",
          "result": "estimate and schedule"
        },
        {
          "title": "Contract",
          "description": "Scope, deadlines and revision rounds are fixed in the contract. 50% advance. A demo before the contract is paid work.",
          "result": "agreed terms"
        },
        {
          "title": "Work and approval",
          "description": "The audio version of the arrangement is approved before notation. For notation-only tasks the approval steps are set separately.",
          "result": "approved material"
        },
        {
          "title": "Delivery",
          "description": "Materials in the agreed formats. Fixes after rehearsals within the agreed rounds. Balance due on delivery.",
          "result": "score, parts, click and playback"
        }
      ],
      "bgPhoto": "assets/media/home/photo_2026-08-11-16.47.31.jpg",
      "resultLabel": "Result"
    },
    "portfolio": {
      "eyebrow": "Portfolio",
      "heading": "Portfolio",
      "subheading": "",
      "viewAll": "All projects",
      "backToList": "← All projects",
      "detailsLabel": "Details",
      "stagesLabel": "Work stages",
      "galleryLabel": "Photo",
      "videoLabel": "Video",
      "audioLabel": "Audio",
      "filters": [
        {
          "key": "all",
          "label": "All"
        },
        {
          "key": "show",
          "label": "Orchestral shows"
        },
        {
          "key": "arrangement",
          "label": "Arranging & orchestration"
        },
        {
          "key": "theatre",
          "label": "Theatre & musicals"
        },
        {
          "key": "production",
          "label": "Sound production"
        }
      ],
      "projects": [
        {
          "id": "burton-show",
          "category": "show",
          "categoryLabel": "Orchestral show",
          "title": "Tim Burton Film Soundtracks Show",
          "meta": "90 minutes of music · symphony orchestra",
          "description": "Full preparation cycle for a concert program based on Tim Burton's film music: from number structures to final scores and rehearsal support. The programme holds twelve numbers: The Nightmare Before Christmas, Corpse Bride, Edward Scissorhands, Sweeney Todd, Alice in Wonderland, Beetlejuice, Wednesday (season one), Dark Shadows, Sleepy Hollow, Frankenweenie, Charlie and the Chocolate Factory, and Wednesday (season two).",
          "stats": [
            {
              "value": "90′",
              "label": "runtime",
              "icon": "clock"
            },
            {
              "value": "8",
              "label": "work stages",
              "icon": "steps"
            },
            {
              "value": "2025",
              "label": "premiere",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Creating number \"structures\" for each film",
            "Building the click track",
            "Transcribing orchestral material by ear",
            "Arranging",
            "Sound design and synth selection",
            "Creating the playback",
            "Scores and parts",
            "Rehearsal support"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/burton-show/main.jpg"
          },
          "heroImage": "assets/media/portfolio/burton-show/main.jpg",
          "photos": [
            "assets/media/portfolio/burton-show/conductor.jpg",
            "assets/media/portfolio/burton-show/10.jpg",
            "assets/media/portfolio/burton-show/02.jpg",
            "assets/media/portfolio/burton-show/03.jpg",
            "assets/media/portfolio/burton-show/04.jpg",
            "assets/media/portfolio/burton-show/05.jpg",
            "assets/media/portfolio/burton-show/06.jpg",
            "assets/media/portfolio/burton-show/07.jpg",
            "assets/media/portfolio/burton-show/08.jpg",
            "assets/media/portfolio/burton-show/09.jpg",
            "assets/media/portfolio/burton-show/11.jpg",
            "assets/media/portfolio/burton-show/photo_2026-10-17-04.41.44.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/burton-show/img_4140.mp4",
              "poster": "assets/media/portfolio/burton-show/img_4140-poster.jpg"
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "date": "2025-10",
          "music": []
        },
        {
          "id": "harry-potter-show",
          "category": "show",
          "categoryLabel": "Orchestral show",
          "title": "Harry Potter Film Soundtracks Show",
          "meta": "100 minutes of music · symphony orchestra",
          "description": "A program of symphonic pictures, one per film in the franchise: its own dramaturgy inside each number, a single arc across the evening. The work stages are the same as on the Burton program.",
          "stats": [
            {
              "value": "100′",
              "label": "runtime",
              "icon": "clock"
            },
            {
              "value": "7",
              "label": "symphonic pictures",
              "icon": "steps"
            },
            {
              "value": "Декабрь 2024",
              "label": "premiere",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Creating number \"structures\" for each film",
            "Building the click track",
            "Transcribing orchestral material by ear",
            "Arranging",
            "Reviewing and editing other contributors' material",
            "Sound design and synth selection",
            "Creating the playback",
            "Scores and parts",
            "Rehearsal support"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/harry-potter-show/44b6c2e6bb00421db5fa60fa3c07.jpg"
          },
          "heroImage": "assets/media/portfolio/harry-potter-show/44b6c2e6bb00421db5fa60fa3c07.jpg",
          "photos": [
            "assets/media/portfolio/harry-potter-show/44b6c2e6bb00421db5fa60fa3c07.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/harry-potter-show/img_8210.mp4",
              "poster": "assets/media/portfolio/harry-potter-show/img_8210-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/harry-potter-show/img_8217.mp4",
              "poster": ""
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/harry-potter-show/img_8218.mp4",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "hp-planetarium",
          "category": "show",
          "categoryLabel": "Orchestral show",
          "title": "“Harry Potter” at the planetarium",
          "meta": "Amadeus · 50 minutes of music · reduced ensemble",
          "description": "A programme drawn from the music of the whole franchise. The hard part was not the length but the forces: the dense orchestration of John Williams, Nicholas Hooper and Alexandre Desplat had to fit an ensemble far smaller than a symphony orchestra without losing what makes it recognisable. Done in two and a half weeks between two of us — a second person took on part of the numbers.",
          "stats": [
            {
              "value": "50′",
              "label": "running time",
              "icon": "clock"
            },
            {
              "value": "24",
              "label": "films in the franchise",
              "icon": "steps"
            },
            {
              "value": "2025",
              "label": "premiere",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Transcribing by ear",
            "Assembling a number for each film",
            "Setting it for a reduced ensemble",
            "Scores and sets of parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/hp-planetarium/img_4653.jpg"
          },
          "heroImage": "assets/media/portfolio/hp-planetarium/img_4653.jpg",
          "photos": [
            "assets/media/portfolio/hp-planetarium/img_4653.jpg",
            "assets/media/portfolio/hp-planetarium/img_4651.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/video.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/video-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4666.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4666-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4667.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4667-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4668.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4668-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4670.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4670-poster.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/hp-planetarium/img_4665.mp4",
              "poster": "assets/media/portfolio/hp-planetarium/img_4665-poster.jpg"
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "date": "Декабрь 2025",
          "music": []
        },
        {
          "id": "kish",
          "category": "show",
          "categoryLabel": "Orchestral show",
          "title": "“Korol i Shut” with a symphony orchestra",
          "meta": "Imperial Orchestra · two editions of the programme",
          "description": "The first edition was made together with a second arranger. The updated programme I ran myself: new numbers, choral work, rebuilding the scores and the click, rehearsals and shows.",
          "stats": [],
          "scope": [
            "Engraving the groundwork and correcting the first edition's scores",
            "Click tracks",
            "Three new numbers end to end",
            "New choral parts and the choir recording",
            "Checking and correcting other authors' scores",
            "Rebuilding the programme, the scores and the parts",
            "New click and playback",
            "Rehearsals and performances"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/kish/orig.jpg"
          },
          "heroImage": "assets/media/portfolio/kish/orig.jpg",
          "photos": [
            "assets/media/portfolio/kish/img_9826-poster.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/kish/img_9826.mp4",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "duduk",
          "category": "show",
          "categoryLabel": "Orchestral show",
          "title": "“The Magic of the Duduk” programme",
          "meta": "Imperial Orchestra · assembling the programme",
          "description": "Here the role was not the arranger's but the one who assembles the whole programme: checking other people's scores, fitting numbers to the ensemble, correcting errors and preparing everything the stage needs.",
          "stats": [],
          "scope": [
            "Checking and editing other authors' scores",
            "Fitting the numbers to the ensemble",
            "Click tracks and playbacks",
            "Sets of parts"
          ],
          "media": {
            "type": "score",
            "src": ""
          },
          "heroImage": "",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": [],
          "hidden": true
        },
        {
          "id": "wizard-oz",
          "category": "theatre",
          "categoryLabel": "Theatre & musicals",
          "title": "Scores for the musical “The Wizard of the Emerald City”",
          "meta": "29 numbers · reduced forces",
          "description": "Reworking the show’s music: 29 numbers, the scores cut down to a smaller ensemble and partly re-orchestrated, with final scores and parts.",
          "stats": [
            {
              "value": "29",
              "label": "numbers",
              "icon": "steps"
            }
          ],
          "scope": [
            "Reviewing the original scores",
            "Reducing the ensemble",
            "Partial re-orchestration",
            "Engraving scores and parts",
            "Proofreading and delivering the set"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/wizard-oz/taqx5pqdmokmio-1tzwyck0vjylpmazwxh4xil6oj5lyy4cgzw1vtkninuir.jpg"
          },
          "heroImage": "assets/media/portfolio/wizard-oz/taqx5pqdmokmio-1tzwyck0vjylpmazwxh4xil6oj5lyy4cgzw1vtkninuir.jpg",
          "photos": [
            "assets/media/portfolio/wizard-oz/taqx5pqdmokmio-1tzwyck0vjylpmazwxh4xil6oj5lyy4cgzw1vtkninuir.jpg"
          ],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "polnolunie",
          "category": "theatre",
          "categoryLabel": "Theatre & musicals",
          "title": "Concert scores for the rock opera “Polnolunie”",
          "meta": "37 Logic projects · 240 minutes · scores and parts",
          "description": "A concert version of a rock opera, from Logic projects to finished scores and parts. Each of the 37 projects had to be checked and cleaned up, the MIDI aligned, parts that existed only as audio transcribed by ear, and everything checked against the vocal score. Then came orchestration for the concert line-up, scores with the vocal lines taken from the vocal score, an audio version of every score, and sets of parts. The work took almost four months.",
          "stats": [
            {
              "value": "240′",
              "label": "running time",
              "icon": "clock"
            },
            {
              "value": "37",
              "label": "Logic projects",
              "icon": "steps"
            },
            {
              "value": "4",
              "label": "months of work",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Checking and cleaning 37 Logic projects",
            "Aligning the MIDI",
            "Transcribing parts that existed only as audio",
            "Checking against the vocal score",
            "Orchestration for the concert line-up",
            "Score export, vocal lines from the vocal score",
            "An audio version of every score from Sibelius",
            "Engraving and assembling sets of parts",
            "Revisions from the composer’s notes"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/polnolunie/snimok-ekrana-2026-09-22-v-03.18.13.jpg"
          },
          "heroImage": "assets/media/portfolio/polnolunie/snimok-ekrana-2026-09-22-v-03.18.13.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "multiland",
          "category": "show",
          "categoryLabel": "Orchestral show",
          "title": "“Multiland” — a show of animation soundtracks",
          "meta": "Imperial Orchestra · symphony orchestra",
          "description": "A children's programme built on music from animated films. My role differs from number to number: some were done end to end, some were engraved from the original score under another arranger's chart, and some needed missing material transcribed by ear.",
          "stats": [],
          "scope": [
            "“Hallelujah” from Shrek — the whole number: transcription, arrangement, score and parts",
            "Aladdin — engraving from the original, re-arranging, several themes assembled into one number",
            "Rapunzel — the same, with part of the material transcribed by ear",
            "Moana — transcribing the vocal parts",
            "The Little Mermaid and Beauty and the Beast — engraving from the originals, arrangement by another author"
          ],
          "media": {
            "type": "score",
            "src": ""
          },
          "heroImage": "",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": [],
          "hidden": true
        },
        {
          "id": "tavrida-2025",
          "category": "production",
          "categoryLabel": "Sound production",
          "title": "Sound production at Tavrida.Art 2025",
          "meta": "2 tracks · summer creative school",
          "description": "Working as sound producer at the Tavrida.Art summer creative school: the tracks “Eto put'” (Nastya Zarovkina) and “Privet” (Vyacheslav Bulatov).",
          "stats": [
            {
              "value": "2",
              "label": "tracks",
              "icon": "steps"
            },
            {
              "value": "2025",
              "label": "year",
              "icon": "calendar"
            }
          ],
          "scope": [
            "Working through the demo and finding the track's sound",
            "Arranging and choosing the parts",
            "Recording and mixing",
            "Final delivery"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/tavrida-2025/4bb13d7e12fe44a5b6885998f03be644.jpg"
          },
          "heroImage": "assets/media/portfolio/tavrida-2025/4bb13d7e12fe44a5b6885998f03be644.jpg",
          "photos": [
            "assets/media/portfolio/tavrida-2025/4bb13d7e12fe44a5b6885998f03be644.jpg",
            "assets/media/portfolio/tavrida-2025/755669a45dd340029f0a50c06987a85c.jpg",
            "assets/media/portfolio/tavrida-2025/photo_2026-08-10-23.57.00.jpg",
            "assets/media/portfolio/tavrida-2025/photo_2026-08-10-23.57.06.jpg",
            "assets/media/portfolio/tavrida-2025/photo_2026-08-10-23.57.10.jpg"
          ],
          "videos": [],
          "audio": [
            {
              "title": "Nastya Zarovkina — “Eto put” (demo)",
              "src": "assets/media/portfolio/tavrida-2025/zarovkina-22eto-put-22-demo.mp3"
            },
            {
              "title": "Vyacheslav Bulatov — “Privet” (demo)",
              "src": "assets/media/portfolio/tavrida-2025/bulatov-22privet-22-demo.mp3"
            }
          ],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "romashka",
          "category": "production",
          "categoryLabel": "Sound production",
          "title": "“Raz, romashka!” — a title song",
          "meta": "Children's theatre · arrangement and mix",
          "description": "The client sang the melody and the words into a phone — the arrangement was built from that to their brief, mixed, and delivered as a multitrack.",
          "stats": [],
          "scope": [
            "Arranging from a sung reference",
            "Mixing",
            "Delivery as a multitrack"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/romashka/img_0298.jpg"
          },
          "heroImage": "assets/media/portfolio/romashka/img_0298.jpg",
          "photos": [
            "assets/media/portfolio/romashka/img_0298.jpg"
          ],
          "videos": [],
          "audio": [
            {
              "title": "",
              "src": "assets/media/portfolio/romashka/raz-romashka.mp3"
            }
          ],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "luzha",
          "category": "production",
          "categoryLabel": "Sound production",
          "title": "Recording the song “Luzha” — Manka",
          "meta": "Recording · released on streaming",
          "description": "Recording the song and preparing the material. The mix was done by another engineer; the release is available on streaming services.",
          "stats": [],
          "scope": [
            "Recording",
            "Preparing the multitrack"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/luzha/photo_2026-10-17-05.03.00.jpg"
          },
          "heroImage": "assets/media/portfolio/luzha/photo_2026-10-17-05.03.00.jpg",
          "photos": [
            "assets/media/portfolio/luzha/photo_2026-10-17-05.03.00.jpg"
          ],
          "videos": [
            {
              "title": "«Лужа» — Манка (Яндекс Музыка)",
              "url": "https://music.yandex.ru/album/36335579/track/138470477",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "neznaika",
          "category": "theatre",
          "categoryLabel": "Theatre & musicals",
          "title": "Orchestration for the children's play “Dunno on the Moon”",
          "meta": "15 numbers · from piano score to orchestra",
          "description": "Moving the show's musical material from the piano score into a full orchestral score — 15 numbers.",
          "stats": [
            {
              "value": "15",
              "label": "numbers",
              "icon": "steps"
            }
          ],
          "scope": [
            "Working through the piano score",
            "Orchestrating for the show's ensemble",
            "Engraving scores and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/neznaika/irqxze3sje0vm-gogc88gw5w4ybpqmjm-txzthyrv9tr_q1jvpuoa-mjithk.jpg"
          },
          "heroImage": "assets/media/portfolio/neznaika/irqxze3sje0vm-gogc88gw5w4ybpqmjm-txzthyrv9tr_q1jvpuoa-mjithk.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "mihail-krug",
          "category": "theatre",
          "categoryLabel": "Theatre & musicals",
          "title": "A musical based on Mikhail Krug's songs",
          "meta": "Project revision · scores",
          "description": "Revising the existing arrangement projects, exporting the material to notation and engraving the final scores for the production.",
          "stats": [],
          "scope": [
            "Revising the arrangement projects",
            "Exporting the material to notation",
            "Engraving and proofreading the scores"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/mihail-krug/snimok-ekrana-2026-08-11-v-16.25.50.jpg"
          },
          "heroImage": "assets/media/portfolio/mihail-krug/snimok-ekrana-2026-08-11-v-16.25.50.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "hidden": true,
          "music": []
        },
        {
          "id": "dune-3",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Arrangement of the “Dune: Part Three” trailer music",
          "meta": "Symphony orchestra",
          "description": "Moving the trailer music onto a symphony orchestra: the original's dense electro-acoustic texture broken down across the sections of a live ensemble.",
          "stats": [],
          "scope": [
            "Transcribing the material by ear",
            "Arranging for symphony orchestra",
            "Score and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/dune-3/cover.jpg"
          },
          "heroImage": "assets/media/portfolio/dune-3/cover.jpg",
          "photos": [],
          "videos": [
            {
              "title": "“Dune: Part Three” trailer — Imperial Orchestra",
              "url": "https://www.youtube.com/watch?v=_KL8ab5f8NE",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "legends-heroes",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Four numbers from the “Legends and Heroes” programme",
          "meta": "Imperial Orchestra · Dune, Skyrim, Assassin's Creed, God of War",
          "description": "Four numbers of the programme done end to end — from shaping the form to finished parts.",
          "stats": [],
          "scope": [
            "Shaping the form of the number",
            "Transcribing by ear",
            "Arranging for the ensemble",
            "Score and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/legends-heroes/images-2.jpg"
          },
          "heroImage": "assets/media/portfolio/legends-heroes/images-2.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "richter",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Five numbers from a Max Richter programme",
          "meta": "Imperial Orchestra · five numbers from the programme",
          "description": "Five numbers of the programme: The Quality of Mercy, Mercy, Infra 5, The Trees and November / Memoryhouse. The rest were done by other authors.",
          "stats": [],
          "scope": [
            "Transcribing by ear",
            "Arranging for the ensemble",
            "Score and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/richter/1900x1900-000000-80-0-0.jpg"
          },
          "heroImage": "assets/media/portfolio/richter/1900x1900-000000-80-0-0.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "einaudi",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Two numbers from a Ludovico Einaudi programme",
          "meta": "Imperial Orchestra · Fly and Life",
          "description": "Two numbers of the programme — Fly and Life. The rest were done by other authors.",
          "stats": [],
          "scope": [
            "Transcribing by ear",
            "Arranging for the ensemble",
            "Score and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/einaudi/1651_ltmys_hero-mary-croppedjpg.jpg"
          },
          "heroImage": "assets/media/portfolio/einaudi/1651_ltmys_hero-mary-croppedjpg.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "oppenheimer",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "“Oppenheimer” — Can You Hear the Music",
          "meta": "Imperial Orchestra · a joint piece of work",
          "description": "The number was made with a second composer-arranger: the material was transcribed by ear and set for the orchestra.",
          "stats": [],
          "scope": [
            "Transcribing by ear",
            "Arranging for the ensemble",
            "Score and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/oppenheimer/youtube-tmfqyxzx9fa-maxresdefault.jpg"
          },
          "heroImage": "assets/media/portfolio/oppenheimer/youtube-tmfqyxzx9fa-maxresdefault.jpg",
          "photos": [],
          "videos": [
            {
              "title": "Oppenheimer / Can You Hear The Music — Imperial Orchestra",
              "url": "https://www.youtube.com/watch?v=TmfqYXZx9FA",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "obraz-disney",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Disney vocal numbers for the Obraz theatre",
          "meta": "Obraz theatre · Russian-language versions",
          "description": "Individual songs from animated films in their Russian-language versions — not orchestral medleys but vocal numbers written for particular singers in the company. The set is ongoing: some numbers are delivered, some still in progress.",
          "stats": [],
          "scope": [
            "Frozen — Let It Go, the Anna and Hans duet, Kristoff's and Anna's songs",
            "Beauty and the Beast — Belle, Gaston, the Beast's aria",
            "The Little Mermaid — Ursula's song",
            "Aladdin — Jasmine's song",
            "The Lion King — Scar's song",
            "Anastasia — Rasputin's song"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/obraz-disney/img_0340.jpg"
          },
          "heroImage": "assets/media/portfolio/obraz-disney/img_0340.jpg",
          "photos": [
            "assets/media/portfolio/obraz-disney/img_0340.jpg"
          ],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "mtv-orchestra",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Two songs for orchestra, MTV",
          "meta": "Spice Girls and Otpetye Moshenniki",
          "description": "Two well-known tracks set for symphony orchestra end to end — from transcribing by ear to finished parts.",
          "stats": [],
          "scope": [
            "Transcribing by ear",
            "Arranging for symphony orchestra",
            "Score and parts"
          ],
          "media": {
            "type": "score",
            "src": ""
          },
          "heroImage": "",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": [],
          "hidden": true
        },
        {
          "id": "karamanov",
          "category": "arrangement",
          "categoryLabel": "Music engraving",
          "title": "Engraving a score from manuscript: A. Karamanov's Violin Concerto",
          "meta": "175 pages of score · from the handwritten original",
          "description": "The concerto's score engraved from manuscript — one hundred and seventy-five pages. Not creative work but painstaking work: reading the hand, restoring what is illegible, reconciling discrepancies between pages, and producing a text an orchestra can play without asking questions of the notes.",
          "stats": [
            {
              "value": "175",
              "label": "pages of score",
              "icon": "steps"
            }
          ],
          "scope": [
            "Reading the handwritten original",
            "Engraving the score",
            "Proofreading and reconciling discrepancies"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.06.30.jpg"
          },
          "heroImage": "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.06.30.jpg",
          "photos": [
            "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.05.48.jpg",
            "assets/media/portfolio/karamanov/snimok-ekrana-2026-10-17-v-06.06.30.jpg"
          ],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "new-project",
          "category": "arrangement",
          "categoryLabel": "Аранжировка и оркестровка",
          "title": "Новый проект",
          "meta": "16 minutes of music · orchestra, synthesizers and ethnic instruments",
          "description": "The largest of the standalone arrangements: sixteen unbroken minutes of music. Ludwig Göransson's score rests on a combination you do not meet often — Greek ethnic instruments, modern sound design and a symphony orchestra sounding as one organism rather than three layers stacked on each other. The real work was not in the notes but in the search: which synthesizers give the timbre, and how to seat it in the orchestra so it neither fights the live instruments nor drowns in them.",
          "stats": [
            {
              "value": "16′",
              "label": "running time",
              "icon": "clock"
            }
          ],
          "scope": [
            "Transcribing by ear",
            "Orchestrating for symphony orchestra",
            "Choosing synthesizers and timbres",
            "Balancing electronics against the live orchestra",
            "Score and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/new-project/1200x675_cmsv2_c2af739c-5ea8-55d4-b5b6-d0ea1b4bc478-9839988..avif"
          },
          "heroImage": "assets/media/portfolio/new-project/1200x675_cmsv2_c2af739c-5ea8-55d4-b5b6-d0ea1b4bc478-9839988..avif",
          "photos": [
            "assets/media/portfolio/new-project/snimok-ekrana-2026-09-22-v-03.50.14.jpg",
            "assets/media/portfolio/new-project/snimok-ekrana-2026-10-17-v-03.27.05.jpg",
            "assets/media/portfolio/new-project/snimok-ekrana-2026-10-17-v-03.27.16.jpg"
          ],
          "videos": [
            {
              "title": "",
              "url": "https://youtu.be/GnaQf1Tluyc?si=sOUE00qBeBFsWShL",
              "src": "",
              "poster": ""
            },
            {
              "title": "",
              "url": "https://open.spotify.com/album/0rBYeLCQiEAz77aEgGO4Vy?si=IYixS1efQV2TypaBlkirUg",
              "src": "",
              "poster": ""
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/new-project/img_9472.mp4",
              "poster": "assets/media/portfolio/new-project/img_9472-poster.jpg"
            }
          ],
          "audio": [],
          "hidden": false,
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "gladiator",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Arrangement of the “Gladiator” soundtrack",
          "meta": "14 minutes · full production cycle",
          "description": "An arrangement for an orchestral show: the full production cycle — from transcribing by ear to scores, playback and handover into rehearsals.",
          "stats": [
            {
              "value": "14′",
              "label": "runtime",
              "icon": "clock"
            }
          ],
          "scope": [
            "Transcribing the material by ear",
            "Arranging and orchestration",
            "Sound design and synth selection",
            "Click track and playback",
            "Scores and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/gladiator/youtube-5fi0-8d9b_0-maxresdefault.jpg"
          },
          "heroImage": "assets/media/portfolio/gladiator/youtube-5fi0-8d9b_0-maxresdefault.jpg",
          "photos": [],
          "videos": [
            {
              "title": "“Gladiator” — Imperial Orchestra, Hans Zimmer's Universe",
              "url": "https://youtu.be/5fi0-8d9B_0?si=Q6O5ak20qrMFisYj",
              "src": "",
              "poster": "assets/media/portfolio/gladiator/youtube-meqzv23sdgo-maxresdefault.jpg"
            },
            {
              "title": "",
              "url": "",
              "src": "assets/media/portfolio/gladiator/gladiator-part-1-1.mp4",
              "poster": "assets/media/portfolio/gladiator/gladiator-part-1-1-poster.jpg"
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "james-bond",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Arrangement of the James Bond soundtrack",
          "meta": "12 minutes · full production cycle",
          "description": "An arrangement for an orchestral show: the full production cycle — from transcribing by ear to scores, playback and handover into rehearsals.",
          "stats": [
            {
              "value": "12′",
              "label": "runtime",
              "icon": "clock"
            }
          ],
          "scope": [
            "Transcribing the material by ear",
            "Arranging and orchestration",
            "Sound design and synth selection",
            "Click track and playback",
            "Scores and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/james-bond/c6u8rhrir4sslltu8a10.jpg"
          },
          "heroImage": "assets/media/portfolio/james-bond/c6u8rhrir4sslltu8a10.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "top-gun",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Arrangement of the “Top Gun” soundtrack",
          "meta": "5 minutes · full production cycle",
          "description": "An arrangement for an orchestral show: the full production cycle — from transcribing by ear to scores, playback and handover into rehearsals.",
          "stats": [
            {
              "value": "5′",
              "label": "runtime",
              "icon": "clock"
            }
          ],
          "scope": [
            "Transcribing the material by ear",
            "Arranging and orchestration",
            "Sound design and synth selection",
            "Click track and playback",
            "Scores and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/top-gun/756599473916784.jpg"
          },
          "heroImage": "assets/media/portfolio/top-gun/756599473916784.jpg",
          "photos": [],
          "videos": [],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "the-boys",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Arrangement of “The Boys” soundtrack",
          "meta": "5 minutes · full production cycle",
          "description": "An arrangement for an orchestral show: the full production cycle — from transcribing by ear to scores, playback and handover into rehearsals.",
          "stats": [
            {
              "value": "5′",
              "label": "runtime",
              "icon": "clock"
            }
          ],
          "scope": [
            "Transcribing the material by ear",
            "Arranging and orchestration",
            "Sound design and synth selection",
            "Click track and playback",
            "Scores and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/the-boys/cover.jpg"
          },
          "heroImage": "assets/media/portfolio/the-boys/cover.jpg",
          "photos": [],
          "videos": [
            {
              "title": "Homelander theme, “The Boys” — Imperial Orchestra Live",
              "url": "https://www.youtube.com/watch?v=9TA8fujWBss",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        },
        {
          "id": "stranger-things",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Arrangement of the “Stranger Things” soundtrack",
          "meta": "14 minutes · full production cycle",
          "description": "An arrangement for an orchestral show: the full production cycle — from transcribing by ear to scores, playback and handover into rehearsals.",
          "stats": [
            {
              "value": "14′",
              "label": "runtime",
              "icon": "clock"
            }
          ],
          "scope": [
            "Transcribing the material by ear",
            "Arranging and orchestration",
            "Sound design and synth selection",
            "Click track and playback",
            "Scores and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/stranger-things/960x540.jpg"
          },
          "heroImage": "assets/media/portfolio/stranger-things/960x540.jpg",
          "photos": [],
          "videos": [
            {
              "title": "",
              "url": "https://youtu.be/XFifsyyKL2g?is=n-IgpIc9ZnlGtum6",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "date": "2026-04",
          "music": []
        },
        {
          "id": "house-of-the-dragon",
          "category": "arrangement",
          "categoryLabel": "Arranging & orchestration",
          "title": "Arrangement of the “House of the Dragon” soundtrack",
          "meta": "12 minutes · full production cycle",
          "description": "An arrangement for an orchestral show: the full production cycle — from transcribing by ear to scores, playback and handover into rehearsals.",
          "stats": [
            {
              "value": "12′",
              "label": "runtime",
              "icon": "clock"
            }
          ],
          "scope": [
            "Transcribing the material by ear",
            "Arranging and orchestration",
            "Sound design and synth selection",
            "Click track and playback",
            "Scores and parts"
          ],
          "media": {
            "type": "photo",
            "src": "assets/media/portfolio/house-of-the-dragon/cover.jpg"
          },
          "heroImage": "assets/media/portfolio/house-of-the-dragon/cover.jpg",
          "photos": [],
          "videos": [
            {
              "title": "",
              "url": "https://www.youtube.com/watch?v=asQEnl-mH-0&si=tVp45N8KglplBRo8",
              "src": "",
              "poster": ""
            }
          ],
          "audio": [],
          "isPlaceholder": false,
          "music": []
        }
      ],
      "bgPhoto": ""
    },
    "services": {
      "eyebrow": "Services",
      "heading": "Services & rates",
      "subheading": "Guide prices and a calculator. Exact cost after reviewing the material.",
      "viewAll": "All services & rates",
      "note": "Prices are indicative and do not constitute a public offer. The final cost depends on the line-up, scope, deadlines and how the music will be used: concert, recording, touring, advertising. Discount for student and amateur ensembles. The price is fixed in the contract.",
      "bgPhoto": "",
      "detailsLabel": "Details",
      "hideLabel": "Hide",
      "groups": [
        {
          "id": "arrangement",
          "title": "Arranging and orchestration",
          "summary": "Orchestra, chamber and pop ensembles, concert programmes."
        },
        {
          "id": "production",
          "title": "Sound production",
          "summary": "Tracks, covers, playbacks and sound design in Logic Pro."
        },
        {
          "id": "score",
          "title": "Sheet music",
          "summary": "Engraving, transcription, lead sheets."
        }
      ],
      "items": [
        {
          "bullets": [],
          "title": "Orchestral arrangement",
          "group": "arrangement",
          "description": "Orchestration for the given ensemble, dynamic plan.",
          "detail": "A full score from a sketch or reference: distributing material across sections, dynamic plan, balance, playability. Cost depends on the line-up and complexity.",
          "price": "from 5,000 ₽ / min"
        },
        {
          "bullets": [],
          "title": "Chamber transcription",
          "group": "arrangement",
          "description": "Adapted to a specific ensemble, character intact.",
          "detail": "Reducing an existing score for what a specific ensemble can actually play. Working from a recording without a score counts as arranging.",
          "price": "from 2,500 ₽ / min"
        },
        {
          "bullets": [],
          "title": "Turnkey concert programme",
          "group": "arrangement",
          "description": "Number structure, arrangements, click, playback, scores.",
          "detail": "The whole programme: structure of the evening and numbers, transcription and arranging, click tracks and playbacks, scores and parts, rehearsal support. Priced by the size of the programme.",
          "price": "from 150,000 ₽ / programme"
        },
        {
          "bullets": [],
          "title": "Track arrangement",
          "group": "production",
          "description": "Pop, rock, variety: song arrangement or backing track.",
          "detail": "Arranging a song for an artist or band, a backing track based on the original, a new version of a well-known track. Live and virtual instruments, mixing, stems for the stage.",
          "price": "from 10,000 ₽ / track"
        },
        {
          "bullets": [],
          "title": "Epic cover",
          "group": "production",
          "description": "Orchestral version of a track with effects and mixing.",
          "detail": "A cover with a cinematic sound: orchestral and choir libraries, synths, percussion, effects. Mix, master and multitracks for further work.",
          "price": "from 10,000 ₽ / track"
        },
        {
          "bullets": [],
          "title": "Click and playback",
          "group": "production",
          "description": "Tempo grid, markers, synth and choir layers.",
          "detail": "Tempo grid and transition markers, synth parts, choir and extra layers. Stems and click in a format ready for the sound engineer and conductor.",
          "price": "from 500 ₽ / min"
        },
        {
          "bullets": [],
          "title": "Sound design",
          "group": "production",
          "description": "Noises, atmospheres, transitions, sound to picture.",
          "detail": "Noises, atmospheres, hits and transitions for shows, video and advertising.",
          "price": "from 2,000 ₽ / min"
        },
        {
          "bullets": [],
          "title": "Mixing and multitracks",
          "group": "production",
          "description": "Track mixing, stems and multitracks.",
          "detail": "Mixing my own and supplied tracks, preparing stems and multitracks for the stage, recording or handing over to another engineer.",
          "price": "from 10,000 ₽ / track"
        },
        {
          "bullets": [],
          "title": "Audio version of the score",
          "group": "production",
          "description": "Hear the number before the first rehearsal.",
          "detail": "Rendering the score with orchestral libraries — balance, articulation and dynamics — for the client or an artistic board. Cheaper for my own scores, since the project already exists; a third-party score has to be rebuilt in the DAW first.",
          "price": "from 500 ₽ / min"
        },
        {
          "bullets": [],
          "title": "Music engraving",
          "group": "score",
          "description": "Setting and layout in a notation editor: from a file, PDF or manuscript.",
          "detail": "Engraving, layout and proofreading in a notation editor. A score page from manuscript from 500 ₽, a single-line part or clean file from 350 ₽; per-minute or per-number pricing is also possible. A set of parts with rehearsal marks and page turns in rests is charged separately.",
          "price": "from 350 ₽ / page"
        },
        {
          "bullets": [],
          "title": "Transcription by ear",
          "group": "score",
          "description": "Decoding dense material from a recording.",
          "detail": "Transcribing dense, layered textures from a recording when no sheet music exists. Checked against the reference at every stage.",
          "price": "from 1,500 ₽ / min"
        },
        {
          "bullets": [],
          "title": "Lead sheet",
          "group": "score",
          "description": "Melody, words and chords on a single sheet.",
          "detail": "Melody, lyrics and chord symbols from a recording. No score or parts: separate instrument parts are transcription or engraving.",
          "price": "from 800 ₽ / min"
        }
      ],
      "pricing": {
        "eyebrow": "Principle",
        "heading": "How the price is built",
        "subheading": "",
        "principles": [
          {
            "title": "Only the stages you need",
            "text": "The estimate includes only the necessary stages. With a score in hand, no transcription is needed. Any stage can be ordered separately."
          },
          {
            "title": "The job is measured by whatever measures it best",
            "text": "Engraving can also be priced per page or per number. The number of pieces counts separately: ten short pieces mean ten scores and ten sets of parts."
          },
          {
            "title": "Complexity is read from the score",
            "text": "The category comes from what is visible in the notation: the size of the ensemble, density of the texture, choir, percussion, rare instruments, changes of tempo and metre."
          },
          {
            "title": "The price is fixed before work starts",
            "text": "Cost and scope are agreed in writing before the start. Two revision rounds are included. A change of line-up or structure means a new estimate."
          }
        ]
      },
      "calculator": {
        "eyebrow": "Estimate",
        "heading": "Cost calculator",
        "subheading": "A preliminary estimate. Nothing is sent anywhere.",
        "openLabel": "Work out the cost",
        "hideLabel": "Hide the estimate",
        "toggleNote": "Seven steps, 2–3 minutes."
      },
      "extra": {
        "eyebrow": "Separately",
        "heading": "Applied work",
        "subheading": "Tasks of non-standard scope. Starting rates; exact price after reviewing the material."
      },
      "terms": {
        "eyebrow": "Terms",
        "heading": "Terms of work",
        "items": [
          {
            "title": "50% advance",
            "text": "Work begins once the advance is paid. Projects longer than a month can be paid in stages."
          },
          {
            "title": "Balance within 5 working days",
            "text": "Within five working days of delivery, regardless of the premiere date."
          },
          {
            "title": "Two rounds of revisions included",
            "text": "Further rounds, and changes made after delivery, are 5,000 ₽ per round. Revisions that alter structure, ensemble or key plan count as new scope."
          },
          {
            "title": "What you receive",
            "text": "Score and parts as PDF, playback as stems, click on a separate track. Editable Sibelius and Logic Pro projects by separate agreement."
          },
          {
            "title": "Deadlines",
            "text": "Counted from the moment the complete source material and the advance are received, not from the date we agreed."
          },
          {
            "title": "Rights to the result",
            "text": "The work and the rights to it are two different prices. A single performance is included; ensemble repertoire, an exclusive licence and a full assignment are priced on top. An arrangement of someone else's work is a derivative: rights to the original are cleared separately by the client."
          }
        ],
        "ctaHeading": "An exact quote, on request",
        "ctaText": "Exact estimate and timeline after reviewing the material.",
        "ctaLabel": "Request a quote"
      },
      "homeHeading": "Services",
      "homeSubheading": ""
    },
    "testimonials": {
      "eyebrow": "Testimonials",
      "heading": "Testimonials",
      "subheading": "With links to the originals.",
      "emptyNote": "Client testimonials will appear here.",
      "items": [
        {
          "id": "t-bugakova",
          "name": "Milena Bugakova",
          "role": "Folk orchestra · instrumentation",
          "text": "Thank you for professional, fast and — most importantly — high-quality work! I ordered an instrumentation for a folk orchestra. From the very start my requirements were listened to carefully and all the details were clarified. Later I was sent the first page to confirm the direction. A very thoughtful and well-made instrumentation. I loved it, and the players enjoy performing it! Thank you — I will definitely come back!",
          "date": "06.12.2021",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-sumcova",
          "name": "Veronika Sumtsova",
          "role": "Client",
          "text": "My sincere thanks to Lev for outstanding and prompt work that took every wish, edit and correction into account. I was incredibly lucky to meet such a professional musician, always ready to help and to do it well. Only half a day passed between my request and the finished material. I'm delighted! I will certainly come back and recommend him to everyone.",
          "date": "31.01.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-klionovskaya",
          "name": "Anna Klionovskaya",
          "role": "Client",
          "text": "I'm endlessly grateful to Lev for work done in a short time and, most importantly, done very well. He managed to realise exactly what had been imagined, which shows real professionalism and craft. Thank you again!",
          "date": "11.03.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-pavlova",
          "name": "Elizaveta Pavlova",
          "role": "Returning client",
          "text": "I have worked with Lev twice. Everything was done well and, most importantly, quickly. I recommend not hesitating and asking exactly him to do the work you need.",
          "date": "11.03.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-serdobolskaya",
          "name": "Yaroslava Serdobolskaya",
          "role": "Client",
          "text": "A genius of speed. Responsive, knowledgeable, simply the best.",
          "date": "20.05.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-tuygunova",
          "name": "Tatyana Tuygunova-Baleva",
          "role": "Client",
          "text": "Lev, thank you very much for the work! Very professional, high quality and delivered on a tight schedule. Thank you for taking all my wishes into account and even adding things I thought of too late, when the work was already finished. It was a pleasure working with you. I will definitely come back and warmly recommend you to anyone looking for this kind of service.",
          "date": "15.07.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        },
        {
          "id": "t-ilina",
          "name": "Lyudmila Ilyina",
          "role": "Client",
          "text": "A fairly large job was commissioned — it was done quickly and very well! I recommend him to everyone.",
          "date": "26.08.2022",
          "rating": 5,
          "avatar": "",
          "source": "vk",
          "sourceUrl": "https://vk.ru/topic-208966819_48246776",
          "profileUrl": "",
          "status": "hidden",
          "isPlaceholder": false
        }
      ],
      "sourceLabels": {
        "site": "Review from the site",
        "vk": "VK",
        "avito": "Avito",
        "telegram": "Telegram",
        "other": "Review"
      },
      "sourceLinkLabel": "See the original",
      "prevLabel": "Previous review",
      "nextLabel": "Next review"
    },
    "blog": {
      "eyebrow": "News",
      "heading": "News",
      "subheading": "Concerts, premieres, new projects.",
      "viewAll": "All news",
      "note": "",
      "posts": [
        {
          "id": "dune-trailer",
          "date": "",
          "category": "Work",
          "title": "Arrangement for the “Dune: Part Three” trailer",
          "excerpt": "The full version of the epic trailer arrangement is out on YouTube.",
          "body": "The full version of my arrangement of the “epic” Dune trailer has been published on YouTube.\n\nSpecial credit goes to the soloist: the part is far from easy, yet it is sung confidently and evenly — it is what carries the climax of the piece.",
          "cover": "assets/media/blog/dune-trailer/cover.jpg",
          "photos": [],
          "video": "https://youtu.be/_KL8ab5f8NE",
          "links": [
            {
              "label": "Watch on YouTube",
              "href": "https://youtu.be/_KL8ab5f8NE"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "the-boys-track",
          "date": "17.06.2026",
          "category": "Work",
          "title": "Another track for “The Boys”",
          "excerpt": "A new track in the series project — and a few words about the instruments.",
          "body": "We finished another track for the series “The Boys”. I'm especially glad about how the team mixes the material: next to a raw concert recording the difference is obvious.\n\nInstead of a live recording I used Ilya Efimov's folk instrument library this time — its bayan sounds convincing enough for a task like this.",
          "cover": "assets/media/blog/the-boys-track/cover.jpg",
          "photos": [],
          "video": "https://youtu.be/9TA8fujWBss",
          "links": [
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/108"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "orchestral-tracks",
          "date": "08.06.2026",
          "category": "From the workshop",
          "title": "Five days on two large orchestral tracks",
          "excerpt": "A work-in-progress excerpt and a few thoughts on keeping your ears fresh.",
          "body": "I'm working on two large orchestral tracks and decided to share a fragment of what I managed in five days.\n\nThe hardest part of long work is not the writing but holding concentration: after a few hours your ears go dull and decisions start being made by inertia. Breaks, sleep and sport help — obvious, but without them quality drops faster than you'd expect.",
          "cover": "assets/media/blog/orchestral-tracks/photo_2026-09-22-05.37.14.jpg",
          "photos": [],
          "video": "https://t.me/levlvovichmusicwork/107",
          "links": [
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/106"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "beat-library",
          "date": "31.05.2026",
          "category": "Tools",
          "title": "I built a drum-pattern reference",
          "excerpt": "A small web service: visualisation, genre sorting, playback and MIDI export.",
          "body": "I put together a small interactive web service with drum patterns based on a useful printed reference.\n\nInside: a visualisation of each pattern, sorting by genre and playback of examples. Later I added MIDI export and a guide to the notation.\n\nHelp yourself if it's useful in your work.",
          "cover": "assets/media/blog/beat-library/01.jpg",
          "photos": [],
          "video": "",
          "links": [
            {
              "label": "Open BeatLibrary",
              "href": "https://levchic.github.io/BeatLibrary/"
            },
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/104"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "burton-concert",
          "date": "19.04.2026",
          "category": "Report",
          "title": "Revisiting “The World of Burton” six months on",
          "excerpt": "I went to hear the programme I had worked on half a year earlier, this time as a listener.",
          "body": "I went to the concert programme “The World of Burton”, which I worked on six months ago — I wanted to listen and analyse it with a fresher head.\n\nThe players did remind me how difficult and awkward the material was. But it sounded far more even than at the premiere — the music really is demanding.\n\nThere are still question marks here and there, but they follow from decisions made in the arrangements: spotting them and carrying the lesson into the next project was exactly the point.",
          "cover": "assets/media/blog/burton-concert/01.jpg",
          "photos": [
            "assets/media/blog/burton-concert/02.jpg",
            "assets/media/blog/burton-concert/03.jpg",
            "assets/media/blog/burton-concert/04.jpg",
            "assets/media/blog/burton-concert/05.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/90"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "profi-song",
          "date": "14.04.2026",
          "category": "Work",
          "title": "A children's song for a theatre opening",
          "excerpt": "A voice recorded on a phone — turned into a full arrangement.",
          "body": "A request came through Profi.ru: a children's song was needed for the opening of a play.\n\nThe tricky part was that all I received was a voice recorded on a phone — the key, tempo and pitches were very approximate. First I had to transcribe, straighten and fit everything, and only then arrange it.\n\nInventing without clear boundaries is always stressful for me, but the work was approved. I'll polish it and add the finished recording to the portfolio.",
          "cover": "assets/media/blog/profi-song/01.jpg",
          "photos": [],
          "video": "",
          "links": [
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/88"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "potter-planetarium",
          "date": "14.12.2025",
          "category": "Work",
          "title": "Harry Potter for a planetarium: 50 minutes of music in two and a half weeks",
          "excerpt": "Another project in the Potter universe — and another record for deadlines.",
          "body": "Back to Harry Potter, this time in a different project — for a planetarium.\n\nAnother record for speed: fifty minutes of music had to be ready in two and a half weeks. I wouldn't have managed alone, so it was a relief that someone took part of the work on.\n\nThe task was harder still because the dense orchestration of John Williams, Nicholas Hooper and Alexandre Desplat had to fit a much smaller ensemble.",
          "cover": "assets/media/blog/potter-planetarium/01.jpg",
          "photos": [
            "assets/media/blog/potter-planetarium/02.jpg",
            "assets/media/blog/potter-planetarium/03.jpg",
            "assets/media/blog/potter-planetarium/04.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/52"
            }
          ],
          "isPlaceholder": false,
          "videoSrc": "assets/media/blog/video.mp4",
          "videoPoster": "assets/media/blog/video-poster.jpg"
        },
        {
          "id": "imperial-burton",
          "date": "13.12.2025",
          "category": "Report",
          "title": "A programme for Imperial Orchestra: the hardest job so far",
          "excerpt": "Three months on a Halloween programme built around Tim Burton's films.",
          "body": "From August to the end of October I worked on a programme for Imperial Orchestra — so far the hardest one for me, both in the level of the tasks and in the deadlines.\n\nThe theme was tied to Halloween, so the choice fell on Tim Burton with his gothic fantasy and the highly varied music of Danny Elfman.\n\nThat job raised the bar noticeably: after it, many things that had felt difficult became everyday routine.",
          "cover": "assets/media/blog/imperial-burton/01.jpg",
          "photos": [
            "assets/media/blog/imperial-burton/02.jpg",
            "assets/media/blog/imperial-burton/03.jpg",
            "assets/media/blog/imperial-burton/04.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/45"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "how-programs-made",
          "date": "10.12.2025",
          "category": "Video",
          "title": "How concert orchestral programmes are made",
          "excerpt": "I walk through the whole path on video — from the idea of a programme to the parts on the stands.",
          "body": "How are concert orchestral programmes for soundtrack shows made? I explain it in this video.\n\nFilming and editing by Danya Zhadaev. The fragment of the concert recording is taken from the Imperial Orchestra YouTube channel.",
          "cover": "assets/media/archive/about-3.jpg",
          "photos": [],
          "video": "https://youtu.be/6zIsDrHYI0c",
          "links": [
            {
              "label": "Filming and editing — danyazhadaev.ru",
              "href": "http://danyazhadaev.ru/"
            },
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/40"
            }
          ],
          "isPlaceholder": false
        },
        {
          "id": "tavrida-artschool",
          "date": "10.12.2025",
          "category": "Report",
          "title": "Tavrida art school: song production from scratch",
          "excerpt": "We recorded vocals, guitars, violin and winds — in studios, cabins and gazebos by the sea.",
          "body": "Having ended up at the Tavrida art school almost by chance, I got to level up in song-format sound production — with practically no experience in it.\n\nWe recorded lead and backing vocals, guitars, violin, saxophone and flute. Morning, afternoon, evening and night, with breaks for food. In studios, in living cabins and in gazebos by the sound of the sea.\n\nThe first days were somewhat chaotic, but in the end it all came together — the kind of experience that moves you forward more than any course.",
          "cover": "assets/media/blog/tavrida-artschool/04.jpg",
          "photos": [
            "assets/media/blog/tavrida-artschool/02.jpg",
            "assets/media/blog/tavrida-artschool/03.jpg",
            "assets/media/blog/tavrida-artschool/04.jpg",
            "assets/media/blog/tavrida-artschool/01.jpg"
          ],
          "video": "",
          "links": [
            {
              "label": "Post on Telegram",
              "href": "https://t.me/levlvovichmusicwork/36"
            }
          ],
          "isPlaceholder": false
        }
      ],
      "bgPhoto": "",
      "readMore": "Read the article",
      "backLabel": "All news",
      "photosHeading": "Photos",
      "linksHeading": "Links",
      "postNotFound": "Article not found."
    },
    "faq": {
      "eyebrow": "FAQ",
      "heading": "Frequently asked questions",
      "subheading": "",
      "viewAll": "All questions",
      "note": "Any other questions — get in touch.",
      "openLabel": "Show answer",
      "hideLabel": "Hide answer",
      "bgPhoto": "assets/media/home/desk-keys.jpg",
      "items": [
        {
          "question": "How much does it cost?",
          "answer": "Guide prices and a calculator are on the Services page. The exact amount depends on the line-up, complexity and deadlines and is quoted after reviewing the material. The estimate is free."
        },
        {
          "question": "How do we start?",
          "answer": "Describe the task and send the material: recordings, sheet music, references. You get an estimate and timeline. Then a contract or terms agreed in writing and a 50% advance; the balance on delivery."
        },
        {
          "question": "Can I get a trial piece first?",
          "answer": "Yes, as paid work: a demo is the same work. Reviewing the material and the estimate are free. During the project, the audio version of the arrangement is approved before the score."
        },
        {
          "question": "How long does a project take?",
          "answer": "It depends on the scope. Deadlines come with the estimate and are fixed in the contract. Urgent deadlines are best mentioned up front."
        },
        {
          "question": "How many revisions are included?",
          "answer": "Two rounds. Further rounds are 5,000 ₽ each. Changes to structure, line-up or key plan count as new scope."
        },
        {
          "question": "All I have is a phone recording or a hummed melody. Is that enough?",
          "answer": "Yes. The theme song Raz, romashka! Dva, stikhi! was made from a melody hummed into a phone: arrangement, mix, multitrack."
        },
        {
          "question": "Who owns the rights to the music?",
          "answer": "Rights are discussed before work starts and fixed in the contract. Rights to the original work stay with its owner and are cleared by the client. Private projects are never published without the client's consent."
        },
        {
          "question": "In what form are materials delivered?",
          "answer": "Score and parts as print-ready PDF; click and playback in a format for the sound engineer and conductor. Logic Pro and Sibelius source projects by arrangement."
        },
        {
          "question": "Is remote work possible?",
          "answer": "Yes, most projects run remotely. Replies usually within a day. Travel to rehearsals and sessions by arrangement."
        },
        {
          "question": "Do you work officially?",
          "answer": "Yes. Self-employed (NPD), contract and receipt; for companies — contract, certificate of completion and receipt. Details in Contacts."
        }
      ]
    },
    "contact": {
      "eyebrow": "Contact",
      "heading": "Contact",
      "subheading": "For an estimate: line-up, duration, deadlines, recordings or sheet music.",
      "email": "lev.maidenko@gmail.com",
      "emailLabel": "Email",
      "copyLabel": "Copy",
      "copiedLabel": "Copied",
      "copyFailLabel": "Couldn't copy — select it manually",
      "social": [
        {
          "label": "Telegram",
          "href": "https://t.me/levlvovich2000"
        },
        {
          "label": "Telegram channel",
          "href": "https://t.me/levlvovichmusicwork"
        },
        {
          "label": "VK community",
          "href": "https://vk.ru/mus_helper"
        },
        {
          "label": "VK profile",
          "href": "https://vk.com/lev.maidenko"
        },
        {
          "label": "YouTube",
          "href": "https://www.youtube.com/@levlvovich2000"
        }
      ],
      "primaryBadge": "main channel",
      "directHeading": "Message me directly",
      "directNote": "Replies usually within a day.",
      "directFoot": "Lev Maidenko, self-employed (NPD taxpayer), TIN 632148507539. Work under contract."
    },
    "footer": {
      "tagline": "Arranging · Orchestration · Sound Production · Logic Pro  · Sibelius",
      "rights": "Rights to any third-party works and materials mentioned belong to their respective owners.",
      "faq": "FAQ",
      "privacy": "Privacy policy",
      "cookie": "This site uses cookies. <a href=\"privacy.html\">Details</a>",
      "cookieOk": "Got it"
    },
    "langSwitch": {
      "current": "EN",
      "other": "RU"
    },
    "common": {
      "placeholderFlag": "fill in",
      "placeholderFlagShort": "placeholder",
      "readFull": "Read in full",
      "hideFull": "Collapse"
    }
  }
};
