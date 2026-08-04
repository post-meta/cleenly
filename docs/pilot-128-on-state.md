# Пилот: 128 on State (Kirkland) — building landing + PM outreach

Статус: подготовка. Ничего не отправлено, страница не построена.
Гейт на отправку письма: ответы Eugene на «Открытые вопросы» + страница live.

---

## 1. Паспорт комплекса

- **128 on State** — 128 State St S, Kirkland, WA 98033 (Moss Bay, даунтаун Kirkland)
- Построен 2007, 5 этажей, **125 юнитов**, studio–2BR
- **Управляющая компания: Waterton Residential, LLC** (Chicago-based, институциональный портфель).
  Ранее зданием управляла Prometheus Real Estate — их Yelp-листинг закрыт, актуальный листинг отдельный.
- Офис: (833) 951-3227 · Вт–Пт 10:00–18:00, Сб 10:00–17:00
- Рента от ~$2,551–2,831 — премиум-сегмент, платёжеспособные жильцы

### Планировки (известные; каталог мог показать только доступные юниты — добить с сайта здания браузером)

| План | Bed/Bath | Sqft |
|---|---|---|
| STC 1–4 (studio) | Studio / 1 BA | 662–776 |
| 1D | 1 BR / 1 BA | 732 |
| 1G | 1 BR / 1 BA | 757 |
| 1K | 1 BR / 1 BA | 775 |
| 1P | 1 BR / 1 BA | 855 |
| 2C | 2 BR / 2 BA | 1,211 |
| 2E | 2 BR / 2 BA | 1,232 |
| 2G | 2 BR / 2 BA | 1,322 |
| 2B | 2 BR / 2 BA | 1,397 |

Диапазон по зданию: ~510–1,411 sqft. Для прайсинга планы схлопываются в 3 типа (цена зависит только от bed/bath/sqft-range).

## 2. Прайс-таблица (движок lib/pricing.ts, condition=average)

Все юниты ≤1,200 sqft → sqft×1.0; 2BR (1,211–1,397) → 1200_1800 ×1.05. 2 BA → ×1.13.

| Тип | First / Deep clean | Recurring (visit 2+) | Move-out |
|---|---|---|---|
| Studio, 1 BA | $239–287 (3.2 ч) | $185–222 | $314–376 |
| 1 BR, 1 BA | $289–347 (3.9 ч) | $185–222 | $380–455 |
| 2 BR, 2 BA | $440–529 (5.9 ч) | $188–225 | $587–705 |

- Часы = чел-часы; wall-clock командой из 2 ≈ половина.
- На странице НЕ хардкодить — импортировать `calculateFirstVisitPrice` / `PRICE_DISPLAY`, чтобы рекалибровка не разъехалась.
- Наружу — цена за работу + потолок (`PRICE_DISPLAY.framing`). Никаких $75/час (решение 2026-07-31).

## 3. Публичный слой (PUBLIC-LAYER.md в репо нет — собран здесь)

Можно говорить наружу:
- Cleenly — клининговая компания (Eugene + Inna, своя команда), Greater Seattle / Eastside
- Цена вперёд по планировке; финальный счёт не выше верха эстимейта; минимум $185
- Свои расходники; liability insurance (сумма — [ADD]); 24h re-clean
- Услуги: regular/deep/move-out/move-in/recurring; make-ready в мультифэмили — реально выполняемая работа
- Букинг онлайн ~2 минуты; (206) 641-4739; hello@cleenly.app
- Юрлицо для документов: Pro Craft Cleaning (DBA), бренд CLEENLY

Нельзя (пока не подтверждено): суммы страховки, «official partner of 128 on State», имена жильцов, число уборок в здании, Thumbtack-рейтинг (перепроверить актуальность).

## 4. Письмо проперти-менеджеру (draft, EN)

Гейт: не отправлять, пока (а) страница не live, (б) не заполнены [ADD].

---

**Subject: Cleaning for 128 on State residents — priced by floor plan**

Hi [ADD: имя community manager],

My name is Eugene. My wife Inna and I run Cleenly, a house cleaning company serving the Eastside. We already work at 128 on State — [ADD: что именно и для кого делаем в здании].

We built a booking page specifically for your community: cleenly.app/buildings/128-on-state. Every floor plan is priced in advance — a resident in a Plan 1K sees $289–347 for a first clean, picks a time, and books online in about two minutes. The final bill never goes above the top of the estimate.

For your team this means:

- Move-out cleans that come back inspection-ready — units turn faster, and deposit conversations get easier.
- One insured company to point to when a resident asks the leasing desk for a cleaning recommendation.
- Zero cost and zero setup for the property. Residents book and pay us directly.

We also handle make-ready cleaning between residents. [ADD: если 128 и есть make-ready контракт — убрать эту строку и переписать первый абзац: опыт в здании становится главным аргументом]

Could I stop by the office for 10 minutes this week? I'll leave our certificate of insurance and a few cards for the leasing desk.

Eugene Krasnoperov
Cleenly — cleenly.app · (206) 641-4739 · hello@cleenly.app

---

Заметка: факты взяты из публичного слоя §3; заглушки — имя PM, capacity в здании, судьба строки про make-ready. Ограничения обработаны опусканием (никаких «мы не…»). Цифра $289–347 = план 1K из §2 — при рекалибровке прайса обновить и письмо.

## 5. Спека посадочной `/buildings/128-on-state`

Цель юзера: житель бронирует на странице СВОЕГО комплекса и чувствует связь с проперти. Связь делаем **конкретикой, не заявлением аффилиации** (аффилиации пока нет — это цель письма из §4).

- **Роут:** `app/(public)/buildings/[building]/page.tsx` + `lib/data/buildings.ts` (первая запись — 128-on-state; структура сразу под масштабирование)
- **Hero:** «House cleaning at 128 on State» + подстрока Moss Bay/Kirkland. Фото здания — только реальное ([ADD: снять при визите]; AI-фото запрещены)
- **Floor-plan picker:** список планов из §1 → цена по типу → CTA в визард с prefill: city=kirkland, адрес=128 State St S + [unit], bedrooms/bathrooms/sqft из плана (query params, шаги размера скипаются)
- **Логистика здания** — блок, который и создаёт «мы отсюда»: парковка, доступ, лифт [ADD: детали из реального опыта работы в здании]
- **Trust:** insured · 24h re-clean · потолок эстимейта. Если Eugene разрешит — «We already clean at 128 on State» (сильнейший пруф)
- **Fine print:** «Cleenly is an independent cleaning service» — до письменного OK от Waterton. После OK — апгрейд до «recommended by the leasing office»
- **Атрибуция:** страница = посадочная для QR/флаеров/Nextdoor: `?utm_source=building&utm_content=128-on-state` (first-touch cookie уже пишется в bookings)
- **SEO:** индексировать (одна качественная страница — без риска), но канал дистрибуции — офлайн + leasing desk, не поиск
- Sitemap + сверка `<title>` собранного HTML (грабли молчаливого 404 из cities)

## 6. Vendor packet (к визиту в офис)

- [ ] COI — certificate holder: Waterton Residential / 128 on State [ADD: сумма, провайдер, как быстро выпускается]
- [ ] W-9 — Pro Craft Cleaning (DBA)
- [ ] WA business license / UBI — номер под рукой
- [ ] Печатные карточки с QR на страницу (генерить ПОСЛЕ live-страницы; QR с utm)
- [ ] Флаер для move-out packet — отдельный оффер «move-out clean = deposit back», предлагать при встрече

## 7. Жильцы в соцсетях (проверено 2026-08-04)

- **Reddit:** постов про 128 on State нет (site:reddit.com — пусто)
- **ApartmentRatings:** 1 отзыв
- **Yelp:** актуальный листинг жив (старый Prometheus-era закрыт); отзывы читать браузером — Yelp блокирует фетч
- **Nextdoor:** логин-волл — проверяется только из браузера с аккаунтом (CDP-паттерн) или руками. Kirkland/Moss Bay фиды — кандидат №1 на «recommendation threads», где всплывают просьбы «cleaner recommendation?»

## 8. Открытые вопросы (Eugene)

1. **Что именно мы делаем в 128 on State и для кого?** (make-ready для PM? уборки у жильцов?) — переписывает первый абзац письма и решает, можно ли «we already clean here» на странице
2. Имя/контакт community manager; было ли знакомство лично?
3. Страховка: провайдер и сумма — для COI и [ADD] в §3
4. Есть ли фото здания / можно снять при следующем визите?
5. OK на последовательность: страница → письмо → визит с пакетом → карточки на leasing desk?
