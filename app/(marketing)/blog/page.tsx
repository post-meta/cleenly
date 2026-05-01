import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
    title: "Cleaning guides | CLEENLY",
    description: "Practical cleaning guides for Greater Seattle homes — what landlords actually inspect, when to deep-clean, where pet hair hides.",
    alternates: { canonical: "https://cleenly.app/blog" },
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function BlogIndexPage() {
    const sorted = [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    return (
        <main className="bg-white">
            <nav className="border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Guides</span>
                </div>
            </nav>

            <section className="py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Cleaning guides</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                        Short, practical guides for keeping a home in good shape — and for the times when it isn&apos;t.
                    </p>
                </div>
            </section>

            <section className="pb-24">
                <div className="max-w-3xl mx-auto px-6 space-y-10">
                    {sorted.map((post) => (
                        <article key={post.slug} className="border-b border-gray-100 pb-10 last:border-b-0">
                            <Link href={`/blog/${post.slug}`} className="group block">
                                <div className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                                    {formatDate(post.publishedAt)} · {post.readingMinutes} min read
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                                    {post.title}
                                </h2>
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <span className="mt-4 inline-block text-sm font-medium text-accent">
                                    Read guide →
                                </span>
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
