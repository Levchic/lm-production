/* Запуск третьей копии на отдельном порту: v2 — 4100, оригинал — 4000. */
process.env.PORT = process.env.PORT || "4200";
require("./server.js");
