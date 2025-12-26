# CLEENLY

> Home cleaning booking platform for Greater Seattle area

**Status:** 75% готово к MVP | **Timeline:** 2-3 недели до запуска

---

## 🎯 О проекте

CLEENLY — платформа для бронирования услуг клининга в районе Greater Seattle. Прямая коммуникация, прозрачные цены, локальный фокус.

### Ключевые особенности:
- ✅ **35 страниц** — Marketing, Booking, Dashboard, Admin
- ✅ **24 города** — Уникальный контент для каждого
- ✅ **10 услуг** — От regular cleaning до post-construction
- ✅ **Manual Payroll CRM** — Полный контроль над выплатами
- ✅ **SEO оптимизация** — Schema.org, локальный контент
- ✅ **Premium design** — Кастомный шрифт, Shadcn/Embla carousel

---

## 📚 Документация

### Быстрый старт:
- **[QUICK_OVERVIEW.md](QUICK_OVERVIEW.md)** — Краткий обзор (5 мин)
- **[PRIORITIES.md](PRIORITIES.md)** — Что делать дальше (10 мин)

### Полная документация:
- **[DOCS_INDEX.md](DOCS_INDEX.md)** — Навигация по всей документации
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** — Полное саммари проекта
- **[ROADMAP.md](ROADMAP.md)** — Визуальная roadmap
- **[PROJECT_BRIEF.md](PROJECT_BRIEF.md)** — Бриф проекта

---

## 🚀 Tech Stack

### Core:
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Deployment:** Vercel

### UI:
- **Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Carousel:** Embla Carousel

### Integrations:
- **Auth:** NextAuth v5 + Supabase
- **Payments:** Stripe (в процессе)
- **Email:** Resend
- **SMS:** Twilio
- **Analytics:** Ahrefs

---

## 🏁 Getting Started

### 1. Установка:

```bash
# Clone repository
git clone [repo-url]
cd cleenly

# Install dependencies
npm install
```

### 2. Environment Variables:

Создайте `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Stripe (optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Resend (optional for now)
RESEND_API_KEY=re_...

# Twilio (optional for now)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

### 3. Database Setup:

```bash
# Run migrations
# В Supabase SQL Editor выполните миграции из /supabase/migrations/
# Или используйте Supabase CLI:
supabase db push
```

### 4. Run Development Server:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
cleenly/
├── app/
│   ├── (marketing)/          # 12 публичных страниц
│   ├── (booking)/            # Booking wizard (7 шагов)
│   ├── [city]/               # 24 локальных страницы
│   ├── admin/                # Admin panel (CRM + Finance)
│   ├── dashboard/            # Customer dashboard
│   ├── api/                  # API routes
│   └── actions/              # Server actions
├── components/
│   ├── marketing/            # 19 компонентов
│   ├── booking/              # 12 компонентов
│   ├── dashboard/            # 11 компонентов
│   ├── admin/                # 11 компонентов
│   ├── shared/               # 9 компонентов
│   └── ui/                   # 9 shadcn компонентов
├── lib/
│   ├── data/                 # Services, Cities data
│   ├── supabase/             # Supabase client
│   └── utils/                # Helpers
├── content/
│   └── cities/               # 24 markdown файла
├── supabase/
│   └── migrations/           # 14 SQL миграций
├── docs/                     # Спецификации страниц
└── plans/                    # Implementation guides
```

---

## 🗄️ Database

### Таблицы (8 шт):
- `profiles` — Пользователи
- `cleaner_profiles` — Клинеры
- `bookings` — Бронирования
- `payments` — Платежи от клиентов
- `cleaner_payouts` — Выплаты клинерам (MANUAL)
- `addresses` — Сохраненные адреса
- `reviews` — Отзывы
- `customer_notes` — Заметки

### Миграции:
14 миграций в `/supabase/migrations/`

Подробнее: см. `PROJECT_SUMMARY.md` → раздел "База данных"

---

## 🎨 Design System

### Кастомный шрифт:
**OPTIUniversSixtySeven** для логотипа и заголовков

```tsx
// Использование:
<h1 className="font-display">Heading</h1>
<Link className="text-logo">CLEENLY</Link>
```

### Цвета:
```css
--background: #FFFFFF
--foreground: #0A0A0A
--primary: #0A0A0A (черный)
--muted: #F5F5F5
```

### Компоненты:
shadcn/ui + кастомные компоненты

Подробнее: см. `PROJECT_BRIEF.md` → раздел "Design System"

---

## 📊 Текущий статус

### Готовность: **75%**

**Что готово:** ✅
- Marketing pages (35 страниц)
- Booking flow (7 шагов)
- Customer dashboard
- Admin panel (CRM + Manual Payroll)
- SEO optimization
- Design system

**Что нужно для MVP:** 🔴
- Stripe integration (3-5 дней)
- Email notifications (2-3 дня)
- Reviews system (2-3 дня)

**Timeline до запуска:** 2-3 недели

Подробнее: см. `QUICK_OVERVIEW.md`

---

## 🚀 Deployment

### Vercel:

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Environment Variables:
Добавьте все переменные из `.env.local` в Vercel Dashboard

### Database:
Supabase автоматически создает production database

---

## 🔐 Security

- ✅ Row Level Security (RLS) enabled
- ✅ NextAuth session management
- ✅ Environment variables secured
- ✅ HTTPS only
- ✅ CSRF protection

---

## 📈 Next Steps

### Эта неделя:
1. Stripe integration
2. Email notifications
3. Testing

### Следующая неделя:
1. Reviews system
2. End-to-end testing
3. Bug fixes

### Через 2-3 недели:
🚀 **LAUNCH!**

Подробный план: см. `PRIORITIES.md`

---

## 📞 Links

- **Documentation:** `DOCS_INDEX.md`
- **Roadmap:** `ROADMAP.md`
- **Priorities:** `PRIORITIES.md`
- **Supabase:** [указать URL]
- **Vercel:** [указать URL]

---

## 📝 License

Private project

---

**Last Updated:** December 25, 2024  
**Version:** 0.1.0 (Pre-MVP)  
**Status:** 75% Complete
