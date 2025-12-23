'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FadeIn({ children, className = '', delay = 0 }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.1, rootMargin: '-50px' }
            );

            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-600 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } ${className}`}
        >
            {children}
        </div>
    );
}
