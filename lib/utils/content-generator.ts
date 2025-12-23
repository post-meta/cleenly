import { CityData } from '@/lib/data/cities';
import { ServiceData } from '@/lib/data/services';

/**
 * Генерирует hash от строки для детерминированного выбора шаблона
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Генерирует первый параграф страницы (критично для AI/LLM)
 * Начинается с фактов: цена, локация, что входит
 */
export function generateIntroText(city: CityData, service: ServiceData): string {
    const neighborhoods = city.neighborhoods.slice(0, 3).join(', ');

    return `${service.name} in ${city.name}, Washington costs ${service.priceRange} for most homes. CLEENLY serves all ${city.name} neighborhoods including ${neighborhoods}. ${service.shortDescription} Book online in 2 minutes — see your exact price before booking.`;
}

/**
 * Генерирует уникальный текст для секции "Why Choose"
 */
export function generateWhyChooseText(city: CityData, service: ServiceData): string {
    const templates = [
        `Whether you live in ${city.neighborhoods[0]} or ${city.neighborhoods[1]}, our cleaners know ${city.name}. We handle homes across ${city.county}, from apartments to houses.`,
        `Our ${city.name} cleaning teams serve ${city.neighborhoods.slice(0, 3).join(', ')} and beyond. Local knowledge means we understand the homes in your area.`,
        `From ${city.neighborhoods[0]} to ${city.neighborhoods[city.neighborhoods.length - 1]}, we've cleaned hundreds of homes in ${city.name}. ${city.description}`,
    ];

    const index = hashString(city.slug + service.slug) % templates.length;
    return templates[index];
}

/**
 * Адаптирует FAQ для конкретного города
 */
export function generateLocalFAQs(city: CityData, service: ServiceData): Array<{ question: string; answer: string }> {
    // Базовые FAQ из сервиса
    const baseFaqs = service.faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
    }));

    // Добавляем локальный FAQ
    const localFaq = {
        question: `Do you offer ${service.name.toLowerCase()} in my ${city.name} neighborhood?`,
        answer: `Yes, we serve all ${city.name} neighborhoods including ${city.neighborhoods.slice(0, 4).join(', ')}, and more. Enter your address during booking to confirm we cover your area.`,
    };

    // Добавляем FAQ про цену в городе
    const priceFaq = {
        question: `How much does ${service.name.toLowerCase()} cost in ${city.name}?`,
        answer: `${service.name} in ${city.name} costs ${service.priceRange} for most homes. Final price depends on home size and condition. You see the exact price before booking.`,
    };

    return [priceFaq, localFaq, ...baseFaqs];
}
