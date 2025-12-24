# CLEENLY — Cities Content

Уникальный контент для локальных landing pages.

## Структура файлов

Каждый `.md` файл содержит:
- **City Intro** — для страницы `/[city]`
- **Regular Cleaning** — для страницы `/[city]/regular-cleaning`
- **Deep Cleaning** — для страницы `/[city]/deep-cleaning`
- **Move-Out Cleaning** — для страницы `/[city]/move-out-cleaning`
- **Why Choose** — секция "Why [City] Homeowners Choose CLEENLY"
- **Local FAQ** — специфичные для города вопросы

## Города по приоритету

### Приоритет 1 (основные рынки)
- [x] seattle.md
- [x] bellevue.md
- [x] kirkland.md
- [x] redmond.md
- [x] renton.md

### Приоритет 2 (Eastside)
- [x] sammamish.md
- [x] issaquah.md
- [x] bothell.md
- [x] woodinville.md
- [x] mercer-island.md
- [x] medina.md
- [x] clyde-hill.md

### Приоритет 3 (South King)
- [x] kent.md
- [x] federal-way.md
- [x] auburn.md
- [x] burien.md
- [x] tukwila.md

### Приоритет 4 (North + Pierce)
- [x] shoreline.md
- [x] edmonds.md
- [x] lynnwood.md
- [x] everett.md
- [x] tacoma.md
- [x] lakewood.md

## Использование

### В коде (Next.js)

Можно парсить markdown или импортировать как raw text:

```typescript
// Вариант 1: Импорт как строка
import seattleContent from '@/content/cities/seattle.md';

// Вариант 2: Читать файл
import fs from 'fs';
import path from 'path';

function getCityContent(slug: string) {
  const filePath = path.join(process.cwd(), 'content/cities', `${slug}.md`);
  return fs.readFileSync(filePath, 'utf8');
}
```

### Парсинг секций

```typescript
function parseSection(content: string, section: string): string {
  const regex = new RegExp(`## ${section}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

// Использование
const intro = parseSection(seattleContent, 'City Intro');
const regularCleaning = parseSection(seattleContent, 'Regular Cleaning');
```

## Принципы написания

См. `CLEENLY_CONTENT_WRITING_GUIDE.md` в project knowledge.

### Ключевые правила:
1. Первое предложение = сервис + город + цена
2. Упоминать 2-3 конкретных района
3. Локальная проблема (пыль, влажность, и т.д.)
4. Инсайт про дома в городе
5. FAQ специфичны для города
6. Без маркетинговых штампов

### Запрещённые слова:
- "professional team"
- "sparkling results"
- "we care about your home"
- "dedicated professionals"
- "quality service"
- "your satisfaction is our priority"

## Обновление контента

1. Редактируй соответствующий `.md` файл
2. Коммить изменения
3. При билде контент подтянется автоматически

---

*Последнее обновление: Декабрь 2024*
