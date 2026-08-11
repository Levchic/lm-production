#!/bin/zsh
# Двойной клик по этому файлу запускает сайт и админку.
# Пароль в админку можно поменять здесь: ADMIN_PASSWORD="ваш-пароль"

cd "$(dirname "$0")"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin}"
export PORT="${PORT:-4000}"

echo "Запускаю сервер…"
open "http://localhost:$PORT/admin.html" 2>/dev/null &
node server/server.js
