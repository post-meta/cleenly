import fs from 'fs';
import path from 'path';

interface CityContent {
    cityIntro: string;
    regularCleaning: string;
    deepCleaning: string;
    moveOutCleaning: string;
    whyChoose: string;
    localFAQs: Array<{ question: string; answer: string }>;
    isLoaded: boolean; // Debug flag
}

export function getCityContent(slug: string): CityContent | null {
    const filePath = path.join(process.cwd(), 'content/cities', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    return {
        cityIntro: parseSection(content, 'City Intro'),
        regularCleaning: parseSection(content, 'Regular Cleaning'),
        deepCleaning: parseSection(content, 'Deep Cleaning'),
        moveOutCleaning: parseSection(content, 'Move-Out Cleaning'),
        whyChoose: parseSection(content, 'Why Choose'),
        localFAQs: parseFAQs(content),
        isLoaded: true,
    };
}

function parseSection(content: string, section: string): string {
    // Разбиваем по заголовкам второго уровня
    const parts = content.split(/\n##\s+/);
    for (const part of parts) {
        const lines = part.split('\n');
        const header = lines[0].trim().toLowerCase();
        if (header === section.toLowerCase()) {
            return lines.slice(1).join('\n').trim();
        }
    }
    return '';
}

function parseFAQs(content: string): Array<{ question: string; answer: string }> {
    const faqSection = parseSection(content, 'Local FAQ');
    if (!faqSection) return [];

    const faqs: Array<{ question: string; answer: string }> = [];

    // Разбиваем по заголовкам третьего уровня
    // Добавляем \n### в начало на случай если первая строка это заголовок
    const items = ("\n" + faqSection).split(/\n###\s+/).filter(item => item.trim() !== '');

    for (const item of items) {
        const lines = item.split('\n');
        if (lines.length >= 2) {
            faqs.push({
                question: lines[0].trim(),
                answer: lines.slice(1).join('\n').trim(),
            });
        }
    }

    return faqs;
}

// Получить контент для конкретного сервиса
export function getServiceIntro(slug: string, service: string): string {
    const content = getCityContent(slug);
    if (!content) return '';

    const serviceMap: Record<string, keyof CityContent> = {
        'regular-cleaning': 'regularCleaning',
        'deep-cleaning': 'deepCleaning',
        'move-out-cleaning': 'moveOutCleaning',
    };

    const key = serviceMap[service];
    return key ? (content[key] as string) : '';
}
