#!/bin/zsh
# Двойной клик по этому файлу запускает сайт и админку.
# Пароль в админку можно поменять здесь: ADMIN_PASSWORD="ваш-пароль"
#
# BIND_HOST=0.0.0.0 — сервер виден и с телефона, если он в той же сети Wi-Fi.
# Адрес для телефона печатается при запуске. Чтобы вернуть сервер обратно
# «только этот компьютер», поставьте здесь BIND_HOST="127.0.0.1".
#
# Именно BIND_HOST: переменная HOST в zsh уже занята под имя компьютера,
# и сервер с ней слушал бы только сам мак.

cd "$(dirname "$0")"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-magistrLev}"
export PORT="${PORT:-4000}"
export BIND_HOST="${BIND_HOST:-0.0.0.0}"

echo "Запускаю сервер…"
open "http://localhost:$PORT/admin.html" 2>/dev/null &
node server/server.js
