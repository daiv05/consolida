#!/usr/bin/env sh
set -eu

BASE="${1:-http://127.0.0.1:3000}"
JAR="$(mktemp)"
EMAIL="smoke-$(date +%s)@example.com"
FAIL=0

check() {
  label="$1"; expected="$2"; actual="$3"
  if [ "$expected" = "$actual" ]; then
    echo "ok    $label ($actual)"
  else
    echo "FAIL  $label: expected $expected, got $actual"
    FAIL=1
  fi
}

req() {
  method="$1"; path="$2"; body="${3:-}"
  if [ -n "$body" ]; then
    curl -s -o /tmp/smoke-body -w '%{http_code}' -b "$JAR" -c "$JAR" -X "$method" -H 'Content-Type: application/json' -d "$body" "$BASE$path"
  else
    curl -s -o /tmp/smoke-body -w '%{http_code}' -b "$JAR" -c "$JAR" -X "$method" "$BASE$path"
  fi
}

check "health" 200 "$(req GET /api/health)"
check "home page" 200 "$(req GET /)"
check "me without session" 401 "$(req GET /api/me)"
check "register invalid email" 400 "$(req POST /api/auth/register '{"name":"Smoke","email":"nope","password":"secret123","startDate":"2026-10-21"}')"
check "register short password" 400 "$(req POST /api/auth/register "{\"name\":\"Smoke\",\"email\":\"$EMAIL\",\"password\":\"123\",\"startDate\":\"2026-10-21\"}")"
check "register" 201 "$(req POST /api/auth/register "{\"name\":\"Smoke\",\"email\":\"$EMAIL\",\"password\":\"secret123\",\"startDate\":\"2026-10-21\"}")"
grep -q '"startDate":"2026-10-19"' /tmp/smoke-body && echo "ok    start date normalised to Monday" || { echo "FAIL  start date not normalised"; FAIL=1; }
check "register duplicate" 409 "$(req POST /api/auth/register "{\"name\":\"Smoke\",\"email\":\"$EMAIL\",\"password\":\"secret123\",\"startDate\":\"2026-10-21\"}")"
check "me" 200 "$(req GET /api/me)"
check "complete task" 200 "$(req PUT /api/progress/w1.d0.listen '{"done":true}')"
check "complete task twice" 200 "$(req PUT /api/progress/w1.d0.listen '{"done":true}')"
check "unknown task" 404 "$(req PUT /api/progress/w9.d0.nope '{"done":true}')"
check "progress list" 200 "$(req GET /api/progress)"
grep -q 'w1.d0.listen' /tmp/smoke-body && echo "ok    progress contains task" || { echo "FAIL  progress missing task"; FAIL=1; }
check "journal save" 200 "$(req PUT /api/journals/1 '{"mistakes":["I have went"],"cefr":"A2+","notes":"bien"}')"
check "journal bad week" 404 "$(req PUT /api/journals/9 '{"mistakes":[],"cefr":null,"notes":""}')"
check "journal bad cefr" 400 "$(req PUT /api/journals/1 '{"mistakes":[],"cefr":"Z9","notes":""}')"
check "phrase create" 201 "$(req POST /api/phrases '{"week":1,"text":"I went to the beach.","meaning":"Fui a la playa."}')"
PHRASE_ID="$(sed -n 's/.*"id":\([0-9]*\).*/\1/p' /tmp/smoke-body)"
check "phrase update" 200 "$(req PATCH "/api/phrases/$PHRASE_ID" '{"source":"Easy Stories"}')"
check "anki export" 200 "$(req GET /api/phrases/anki)"
grep -q 'I went to the beach' /tmp/smoke-body && echo "ok    anki export contains phrase" || { echo "FAIL  anki export"; FAIL=1; }
check "data export" 200 "$(req GET /api/me/export)"
check "profile update" 200 "$(req PATCH /api/me '{"name":"Smoke 2"}')"
check "password wrong current" 403 "$(req POST /api/me/password '{"currentPassword":"bad","newPassword":"another123"}')"
check "password change" 200 "$(req POST /api/me/password '{"currentPassword":"secret123","newPassword":"another123"}')"
check "logout" 200 "$(req POST /api/auth/logout)"
check "me after logout" 401 "$(req GET /api/me)"
check "login old password" 401 "$(req POST /api/auth/login "{\"email\":\"$EMAIL\",\"password\":\"secret123\"}")"
check "login" 200 "$(req POST /api/auth/login "{\"email\":\"$EMAIL\",\"password\":\"another123\"}")"
check "phrase delete" 200 "$(req DELETE "/api/phrases/$PHRASE_ID")"
check "delete account wrong password" 403 "$(req DELETE /api/me '{"password":"bad"}')"
check "delete account" 200 "$(req DELETE /api/me '{"password":"another123"}')"
check "me after delete" 401 "$(req GET /api/me)"

rm -f "$JAR" /tmp/smoke-body
exit "$FAIL"
