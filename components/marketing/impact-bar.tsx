'use client';

import { useEffect, useRef, useState } from 'react';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const duration = 1500;
                    const steps = 40;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, hasAnimated]);

    const displayValue = target >= 100
        ? count.toLocaleString() + (suffix === '+' ? '+' : suffix)
        : (Number.isInteger(target) ? count : count.toFixed(1)) + suffix;

    return (
        <div ref={ref} className="text-2xl md:text-3xl font-semibold text-foreground">
            {displayValue}
        </div>
    );
}

export function ImpactBar() {
    return (
        <section className="border-y border-border bg-muted/30 py-8 md:py-10">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <Counter target={1200} suffix="+" />
                        <div className="text-sm text-muted-foreground mt-1">cleanings done</div>
                    </div>
                    <div>
                        <Counter target={4.9} suffix="★" />
                        <div className="text-sm text-muted-foreground mt-1">avg rating</div>
                    </div>
                    <div>
                        <Counter target={98} suffix="%" />
                        <div className="text-sm text-muted-foreground mt-1">rebook rate</div>
                    </div>
                    <div>
                        <div className="text-2xl md:text-3xl font-semibold text-foreground">$0</div>
                        <div className="text-sm text-muted-foreground mt-1">hidden fees</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
