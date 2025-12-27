import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PricingSection() {
    return (
        <section className="pricing py-16 bg-muted">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-4">
                    Simple, Honest Pricing
                </h2>
                <p className="text-center text-muted-foreground mb-12">
                    Price depends on your home size and condition.
                    Calculator shows exact price based on your answers.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Regular Cleaning Card */}
                    <div className="bg-background border rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">Regular Cleaning</h3>
                        <div className="text-3xl font-bold mb-1">$100-150</div>
                        <div className="text-sm text-muted-foreground mb-6">
                            Typical 2BR apartment, 2-3 hours
                        </div>

                        <ul className="space-y-2 text-sm mb-6">
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>All rooms: dust, vacuum, mop</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Kitchen: counters, sink, outside appliances</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Bathrooms: toilet, shower, sink, mirror</span>
                            </li>
                        </ul>

                        <Button className="w-full" asChild>
                            <Link href="/book?service=regular">Get Exact Price</Link>
                        </Button>
                    </div>

                    {/* Deep Cleaning Card */}
                    <div className="bg-background border rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">Deep Cleaning</h3>
                        <div className="text-3xl font-bold mb-1">$200-350</div>
                        <div className="text-sm text-muted-foreground mb-6">
                            Typical 2BR apartment, 4-5 hours
                        </div>

                        <ul className="space-y-2 text-sm mb-6">
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Everything from Regular +</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Inside oven & fridge</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Baseboards, window sills, light fixtures</span>
                            </li>
                        </ul>

                        <Button className="w-full" asChild>
                            <Link href="/book?service=deep">Get Exact Price</Link>
                        </Button>
                    </div>

                    {/* Move-Out Cleaning Card */}
                    <div className="bg-background border rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">Move-Out Cleaning</h3>
                        <div className="text-3xl font-bold mb-1">$200-400</div>
                        <div className="text-sm text-muted-foreground mb-6">
                            Depends on size & condition
                        </div>

                        <ul className="space-y-2 text-sm mb-6">
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Everything from Deep +</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Inside cabinets, closets, drawers</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Landlord inspection checklist</span>
                            </li>
                        </ul>

                        <Button className="w-full" asChild>
                            <Link href="/book?service=moveout">Get Exact Price</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
