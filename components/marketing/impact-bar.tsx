"use client";

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Droplet, Leaf, Recycle, Home } from 'lucide-react';

interface ImpactStatProps {
    value: string;
    label: string;
    icon: React.ReactNode;
}

function ImpactStat({ value, label, icon }: ImpactStatProps) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            // Extract number from value string
            const target = parseInt(value.replace(/\D/g, ''));
            if (isNaN(target)) return;

            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, 30);

            return () => clearInterval(timer);
        }
    }, [inView, value]);

    // Format the display value
    const displayValue = value.includes('%')
        ? `${count}%`
        : value.includes('+')
            ? `${count.toLocaleString()}+`
            : count.toLocaleString();

    return (
        <div ref={ref} className="space-y-3 text-center">
            <div className="flex justify-center text-forest">
                {icon}
            </div>
            <div className="text-3xl md:text-4xl font-display font-bold text-charcoal">
                {displayValue}
            </div>
            <div className="text-sm text-charcoal/60 max-w-[200px] mx-auto">
                {label}
            </div>
        </div>
    );
}

export function ImpactBar() {
    return (
        <section className="bg-sage/10 border-y border-sage/20 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    <ImpactStat
                        value="10000+"
                        label="Liters of water saved"
                        icon={<Droplet className="w-8 h-8" />}
                    />
                    <ImpactStat
                        value="0%"
                        label="Toxic chemicals used"
                        icon={<Leaf className="w-8 h-8" />}
                    />
                    <ImpactStat
                        value="100%"
                        label="Recyclable packaging"
                        icon={<Recycle className="w-8 h-8" />}
                    />
                    <ImpactStat
                        value="500+"
                        label="Happy Seattle homes"
                        icon={<Home className="w-8 h-8" />}
                    />
                </div>
            </div>
        </section>
    );
}
