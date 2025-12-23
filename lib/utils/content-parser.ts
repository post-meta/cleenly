import fs from 'fs';
import path from 'path';

interface CityContent {
    cityIntro: string;
    regularCleaning: string;
    deepCleaning: string;
    moveOutCleaning: string;
    whyChoose: string;
    localFAQs: Array<{ question: string; answer: string }>;
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
    };
}

function parseSection(content: string, section: string): string {
    const regex = new RegExp(`## ${section}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
    const match = content.match(regex);
    return match ? match[1].trim() : '';
}

function parseFAQs(content: string): Array<{ question: string; answer: string }> {
    const faqSection = parseSection(content, 'Local FAQ');
    const faqs: Array<{ question: string; answer: string }> = [];

    const regex = /### (.+?)\n\n([\s\S]*?)(?=\n### |$)/g;
    let match;

    while ((match = regex.exec(faqSection)) !== null) {
        faqs.push({
            question: match[1].trim(),
            answer: match[2].trim(),
        });
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
