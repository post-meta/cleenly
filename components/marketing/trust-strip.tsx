import { CheckCircle2 } from "lucide-react";

export function TrustStrip() {
    return (
        <section className="bg-gray-50 border-y border-gray-100 py-4">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary/70" />
                        <span>Background-checked cleaners</span>
                    </div>
                    <div className="hidden md:block text-gray-300">•</div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary/70" />
                        <span>Insured & bonded</span>
                    </div>
                    <div className="hidden md:block text-gray-300">•</div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary/70" />
                        <span>24h satisfaction guarantee</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
