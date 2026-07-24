# CLEENLY — Session Handoff (2026-07-23)

> Написано, чтобы продолжить работу на другой машине. Прочитай ЭТОТ файл целиком.
> Глубокие детали проекта — в auto-memory (`cleenly-project.md`), она подхватывается автоматически.
> На новой машине сначала: `cd ~/GITHUB-PROJECT/cleenly-app/cleenly && git pull` (должен встать на HEAD `50e7d2f` или новее).

---

## TL;DR — где мы

Сегодня закрыли инфраструктурные хвосты (репо-синк, SMS-код, фавикон) и **уперлись в главный открытый вопрос: готовность к запуску рекламы.** Ответ — **сайт готов принимать трафик, но к ПЛАТНОЙ рекламе нет: не стоит трекинг конверсий.** Дальше нужно решение юзера по масштабу/каналу (вопросы ниже) — это живой тред, с него и продолжаем.

---

## Что сделано в этой сессии (всё в проде, запушено)

1. **Репо синхронизирован.** `git pull` подтянул 2 коммита с origin (A2P opt-in links + resubmit-пакет). Fast-forward.
2. **`lib/sms.ts` → Messaging Service SID** (коммит `d42107f`). OTP теперь предпочитает `TWILIO_MESSAGING_SERVICE_SID`, фолбэк на `from`-номер. Запушено.
   - ⚠️ **Чтобы заработало в проде — нужно прописать `TWILIO_MESSAGING_SERVICE_SID` в Vercel Production** (SID кампании `MG48b661…`). Без переменной — безопасный no-op (старое поведение).
3. **Фавикон переделан** (коммит `50e7d2f`, задеплоен + подтверждён curl'ом на проде):
   - Была placeholder-заглушка (чёрный круг + белый треугольник) — её Google и показывал в SERP.
   - Стало: терракотовый круг `#D97757` + белая курсивная «C» (глиф из шрифта лого Instrument Serif Italic; компонент `Logo` рендерит «Cleenly» курсивом, НЕ OPTIUnivers).
   - Файлы: `app/favicon.ico` (16/32/48), `app/icon.svg`, `app/apple-icon.png` (180px).
   - Google обновит иконку в выдаче с лагом дни–недели (можно пнуть переобход главной в GSC).
4. **Deploy-схема (важно, старые заметки устарели):** `git push origin main` теперь **авто-деплоит в Production** (в `vercel ls` свежий деплой сразу `Environment: Production`). `vercel promote` НЕ нужен. Push protection не срабатывает. Verify shipped = `curl https://cleenly.app/...` + md5.

---

## 🔴 ГЛАВНЫЙ ОТКРЫТЫЙ ТРЕД: готовность к рекламе

### Вердикт
Продукт как посадочная — готов. Измерительный слой — НЕТ. Запускать Ads сейчас = лить бюджет вслепую (Smart Bidding не оптимизируется, не видно какой город/ключ/канал даёт букинги).

### ✅ Готово
- Букинг end-to-end: форма → БД → Telegram (Eugene `515815145`) + email. Лид не теряется.
- Цена прозрачна («see your price online», оценка = счёт).
- Voice-линия принимает звонки. Privacy/Terms есть. 22 города + услуги, индексируются, мобилка ок.
- **Код конверсии есть и подключён:** `lib/analytics.ts` → `trackBookingSubmitted` шлёт `generate_lead` (currency USD + value) на успехе букинга в `components/booking/steps/step-confirmation.tsx`.

### ❌ Блокеры (чинить ДО денег)
1. **GA4 выключен в проде.** `NEXT_PUBLIC_GA_MEASUREMENT_ID` не задан в Vercel → на cleenly.app **0 gtag-тегов**. Событие `generate_lead` уходит в никуда. (Ahrefs-скрипт стоит, но это SEO, не конверсии.)
2. **Нет Google Ads-трекинга.** Ни AW-тега, ни линка Ads↔GA4, ни conversion action.
3. **Звонки не трекаются.** `trackPhoneClick` (и `trackBookingStarted`) описаны в `lib/analytics.ts`, но нигде не вызываются. Для клининга звонки конвертят.

### Стратегия канала (local-service плейбук из памяти)
- Для house cleaning топ-ROI обычно **Local Services Ads (Google Guaranteed)** + Карты, потом Search PPC.
- LSA требует верификации: лицензия + страховка + background check → онбординг дни-недели.
- Правило: **не параллелить каналы на старте — один канал с гейтом** (`feedback_phase_0_before_parallel`, `feedback_paid_only_first_season`, `feedback_local_service_lead_engine_priority`).

### Рекомендованный порядок
1. Включить измерение (~1-2 ч): создать/подтвердить GA4-проперти → `NEXT_PUBLIC_GA_MEASUREMENT_ID` в Vercel → Google Ads + conversion action (импорт `generate_lead` из GA4 либо AW-тег) → дотянуть `trackPhoneClick` на телефонные CTA → тестовый букинг + realtime-проверка.
2. Выбрать ОДИН канал, настроить кампанию.
3. Только потом — деньги.

### ⏸️ Ждём от юзера (вопросы, которые он захотел уточнить — НЕ отвечены)
Прежде чем что-то делать по рекламе, уточнить:
- **Масштаб**: полноценные Google Ads с оптимизацией под конверсии? или LSA/Карты / соцсети / ручной тест на маленьком бюджете? (от этого — насколько жёстко нужен трекинг)
- **Кто ведёт кампанию**: настраиваем и запускаем сами, или готовим сайт для передачи подрядчику?
- **Бюджет / срочность**: «лить завтра» vs «правильно, старт через 1-2 недели»?
- **Что значит «готовы»**: технически принимать трафик (почти да) vs «можно включать деньги и мерить» (нет — нет трекинга)?

---

## Прочие хвосты (не блокеры рекламы, но открыты)

- **A2P 10DLC / SMS:** кампания получала отказ TCR (30908/30882/30896). Фикс сделан (on-domain `/privacy`+`/terms` на `procraftcleaning.com`, репо `~/GITHUB-PROJECT/procraftcleaning-site`). **Ждём: юзер делает Console Edit+Resubmit кампании (бесплатно, НЕ через API — API delete+recreate стоил $15).** До аппрува SMS режутся 30034. Voice ✅ работает.
- **Stripe live:** сейчас test-mode, инвойсинг ручной. Live = нужна активация (бизнес+банк).
- **Security TODO (инцидент 06-16):** докоммитить миграцию `20260616170000_secure_users_rls.sql`; юзеру `e.s***` сменить пароль.
- **5 verifiable claims** (страховка $, % оплаты клинерам, background-check, дата инкорпорации) — до сих пор не на сайте, ждут подтверждения Eugene.

---

## Быстрые факты для продолжения

- Repo: `~/GITHUB-PROJECT/cleenly-app/cleenly` · GitHub `post-meta/cleenly` (private) · git HEAD на момент хендоффа: `50e7d2f`
- Prod: `cleenly.app` · Vercel `postmeta/cleenly` (`git push main` = авто Production)
- Supabase: ref `onhrawahtfiuqzovglkb` (CityHill org, Pro) · старый мёртвый ref `hspmtqlnrmomatmzklnh` — НЕ трогать
- Stack: Next.js 16, TS, Tailwind 4, Supabase, NextAuth v5
- Analytics: `lib/analytics.ts` (события есть), GA4 в `app/layout.tsx` за `GA_ID = NEXT_PUBLIC_GA_MEASUREMENT_ID` (в проде НЕ задан)
- Twilio: аккаунт `ACbc8f74…` «Cleenly» active/Full, номер +1 425 230 5957, кампания `MG48b661…`
- Analytics MCP доступен (можно проверить/создать GA4-проперти для cleenly.app)

---

## Следующее действие на новой машине

Продолжаем тред «готовность к рекламе»: дождаться ответов юзера на 4 уточняющих вопроса (масштаб / кто ведёт / бюджет-срочность / что значит «готовы»), затем — либо начать настройку трекинга (шаг 1 выше), либо расписать план. Трекинг обязателен при любом канале.
