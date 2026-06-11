# CLEENLY Voice Agent

Голосовой AI-агент для support-номера CLEENLY (**+1 425 230 5957**) на базе
[Twilio ConversationRelay](https://www.twilio.com/docs/voice/twiml/connect/conversationrelay) +
Anthropic Claude (`claude-haiku-4-5-20251001`) + Cloudflare Workers.

Номер указан в Stripe как support phone → звонки часто про оплату. Агент:
отвечает на вопросы о ценах/политиках, ищет букинг по номеру звонящего (Supabase),
эскалирует Eugene в Telegram, после каждого звонка шлёт полный транскрипт.
**Карточные данные по телефону не принимает никогда.**

## Архитектура

```
Звонок → Twilio number → POST /voice (TwiML <Connect><ConversationRelay>)
                              │
                              ▼
            wss://<worker>/relay  ←→  Twilio (STT/TTS)
                              │
              Claude Haiku (streaming, tool use)
               ├─ lookup_booking → Supabase REST (bookings)
               └─ escalate       → Telegram (Eugene)
                              │
        Конец звонка → транскрипт в Telegram
        POST /connect-done → <Hangup/> (или <Say> fallback при ошибке)
        POST /sms → форвард текста в Telegram
```

| Route | Что делает |
|---|---|
| `POST /voice` | Voice webhook. Валидирует `X-Twilio-Signature`, возвращает TwiML с ConversationRelay. `?fallback=1` — голосовое извинение (для Voice fallback URL). |
| `GET /relay` | WebSocket ConversationRelay. Протокол: входящие `setup`/`prompt`/`interrupt`/`error`, исходящие `{"type":"text","token":"…","last":bool}`. |
| `POST /connect-done` | `<Connect action>` callback. `SessionStatus != completed` → fallback `<Say>` + алерт в Telegram. |
| `POST /sms` | Inbound SMS → форвард в Telegram. STOP/HELP перехватывает Twilio Advanced Opt-Out раньше нас. |
| `GET /health` | 200 ok. |

## Env vars (все — secrets)

| Имя | Что это |
|---|---|
| `TWILIO_AUTH_TOKEN` | Auth Token аккаунта Twilio (Console → Account Info). Для валидации подписи вебхуков. |
| `ANTHROPIC_API_KEY` | Ключ Anthropic API. |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота для уведомлений Eugene. |
| `ADMIN_TELEGRAM_CHAT_ID` | Chat id Eugene: `515815145`. |
| `SUPABASE_URL` | `https://onhrawahtfiuqzovglkb.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (Dashboard → Settings → API). Только здесь, server-side. |

Установка после `wrangler login`:

```sh
cd workers/voice-agent
npm install
wrangler secret put TWILIO_AUTH_TOKEN
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put ADMIN_TELEGRAM_CHAT_ID
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

## Деплой + привязка номера

1. `wrangler deploy` → получаем URL, напр. `https://cleenly-voice-agent.<account>.workers.dev`
2. Twilio Console → **Phone Numbers → Active Numbers → +1 425 230 5957 → Configure**:
   - **Voice → A call comes in:** Webhook, `https://<worker>/voice`, HTTP POST
   - **Voice → Call fails (fallback URL):** `https://<worker>/voice?fallback=1`, HTTP POST
   - **Messaging → A message comes in:** Webhook, `https://<worker>/sms`, HTTP POST
     (если номер в Messaging Service — указать URL там и включить Advanced Opt-Out)
3. Тестовый звонок → проверить, что транскрипт пришёл в Telegram.

Через CLI:

```sh
twilio phone-numbers:update +14252305957 \
  --voice-url=https://<worker>/voice \
  --voice-fallback-url="https://<worker>/voice?fallback=1" \
  --sms-url=https://<worker>/sms
```

## Локальное тестирование

```sh
npm run check    # tsc --noEmit
wrangler dev     # http://localhost:8787
```

Вебхуки валидируют подпись, поэтому голый `curl` на `/voice` вернёт 403 — это
ожидаемо. Варианты:

**1. Реальные вебхуки через туннель + Twilio CLI:**

```sh
wrangler dev
cloudflared tunnel --url http://localhost:8787   # или ngrok
twilio phone-numbers:update +14252305957 --voice-url=https://<tunnel>/voice
# позвонить на номер
```

**2. Симуляция CR-сообщений по WebSocket напрямую (без Twilio, подпись не нужна):**

```sh
npm i -g wscat
wscat -c ws://localhost:8787/relay
> {"type":"setup","callSid":"CA_test","from":"+14255551234","to":"+14252305957"}
> {"type":"prompt","voicePrompt":"How much is a deep clean?","last":true}
# ← поток {"type":"text","token":"…","last":false}, в конце last:true
> {"type":"prompt","voicePrompt":"What's the status of my booking?","last":true}
# ← вызовет lookup_booking по +14255551234
```

**3. Подписанный curl** — проще временно протестировать через wscat (п.2);
подпись считается как `Base64(HMAC-SHA1(authToken, url + sorted(key+value)))`.

## Ключевые решения

- **Без SDK** — Anthropic Messages API через `fetch` + ручной SSE-парсер
  (`src/anthropic.ts`). Zero deps в рантайме, мгновенный cold start.
- **Стейт звонка в замыкании WebSocket** — один сокет = один звонок; история
  диалога и транскрипт живут в памяти сессии. Без Durable Objects (звонок
  привязан к одному соединению, персистентность не нужна).
- **Interrupt** — `AbortController` на каждый turn; caller перебил → стрим
  Claude обрывается немедленно.
- **Голосовой промпт** (`src/prompt.ts`) — короткая версия
  `lib/chat/system-prompt.ts`: те же факты цен/политик, но реплики 1–3
  предложения, без списков/markdown. При изменении цен обновлять оба файла.
- **lookup_booking** — телефон нормализуется до последних 10 цифр; в Supabase
  пре-фильтр `phone=like.*<last4>`, точный матч по 10 цифрам — в Worker'е
  (форматы хранения телефона различаются).
- **Telegram никогда не роняет звонок** — `sendTelegram` не бросает исключений,
  отправка транскрипта/алертов через `ctx.waitUntil`.

## Чеклист деплоя (когда появятся креды Twilio)

- [ ] `npm install` в `workers/voice-agent/`
- [ ] 6 × `wrangler secret put` (см. выше)
- [ ] `wrangler deploy`
- [ ] `curl https://<worker>/health` → `ok`
- [ ] Привязать `/voice`, `/voice?fallback=1`, `/sms` к номеру в Twilio
- [ ] В Messaging Service включить Advanced Opt-Out (STOP/HELP)
- [ ] Тестовый звонок: приветствие → вопрос о цене → ответ голосом
- [ ] Тест lookup: позвонить с номера, на который есть букинг → спросить статус
- [ ] Тест эскалации: «I want a refund» → сообщение Eugene в Telegram
- [ ] Проверить транскрипт в Telegram после звонка
- [ ] Тест SMS: текст на номер → форвард в Telegram
- [ ] Тест fallback: временно сломать primary URL → убедиться, что fallback говорит извинение

## Известные ограничения

- `/relay` не валидирует подпись Twilio (ConversationRelay не подписывает
  WS-upgrade). Митигация: URL нигде не публикуется; при желании можно добавить
  секретный query-параметр в TwiML и проверять его на upgrade.
- История диалога ограничена ~60 сообщениями (марафонские звонки), tool-loop —
  4 итерациями на реплику.
- Промпт-кэширование не включено: голосовой промпт короче минимума
  кэшируемого префикса Haiku 4.5 (4096 токенов) — маркер просто не сработал бы.
