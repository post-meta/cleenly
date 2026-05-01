import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    blogPosts,
    getBlogPostBySlug,
    getAllBlogSlugs,
    type BlogPost,
} from "@/lib/data/blog-posts";
import { JsonLd } from "@/components/shared/json-ld";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllBlogSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) return {};

    return {
        title: `${post.title} | CLEENLY`,
        description: post.excerpt,
        alternates: { canonical: `https://cleenly.app/blog/${post.slug}` },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.publishedAt,
            url: `https://cleenly.app/blog/${post.slug}`,
        },
    };
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function buildArticleSchema(post: BlogPost) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "author": { "@type": "Organization", "name": "CLEENLY" },
        "publisher": {
            "@type": "Organization",
            "name": "CLEENLY",
            "url": "https://cleenly.app",
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://cleenly.app/blog/${post.slug}`,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) notFound();

    const articleSchema = buildArticleSchema(post);

    const related = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2);

    return (
        <main className="bg-white">
            <JsonLd data={articleSchema} />

            <nav className="border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/blog" className="hover:text-foreground">Guides</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{post.title}</span>
                </div>
            </nav>

            <article className="py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                        {formatDate(post.publishedAt)} · {post.readingMinutes} min read
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                        {post.title}
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                        {post.excerpt}
                    </p>

                    {/* Short version block — per blog UX convention */}
                    <div className="mt-10 p-6 rounded-lg border border-border bg-muted/30">
                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">The short version</div>
                        <p className="text-base text-foreground leading-relaxed">
                            {post.shortVersion}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="mt-12 space-y-10">
                        {post.sections.map((section, idx) => (
                            <section key={idx}>
                                {section.heading && (
                                    <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
                                )}
                                {section.paragraphs.map((p, pi) => (
                                    <p key={pi} className="text-gray-700 leading-relaxed mb-4">
                                        {p}
                                    </p>
                                ))}
                                {section.bullets && section.bullets.length > 0 && (
                                    <ul className="mt-2 space-y-2 text-gray-700">
                                        {section.bullets.map((b, bi) => (
                                            <li key={bi} className="flex gap-3">
                                                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                                <span className="leading-relaxed">{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>

                    {/* Author block (per Eugene's blog UX convention: author at the bottom) */}
                    <div className="mt-16 pt-8 border-t border-border">
                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Written by</div>
                        <p className="text-base text-foreground">
                            The CLEENLY team — house cleaning in Greater Seattle.{" "}
                            <Link href="/book" className="font-medium text-accent hover:underline">
                                See your price online →
                            </Link>
                        </p>
                    </div>
                </div>
            </article>

            {related.length > 0 && (
                <section className="py-16 border-t border-border bg-muted/30">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-2xl font-semibold mb-8">More guides</h2>
                        <div className="space-y-6">
                            {related.map((p) => (
                                <Link
                                    key={p.slug}
                                    href={`/blog/${p.slug}`}
                                    className="block p-6 rounded-lg bg-white border border-border hover:border-foreground/30 transition-colors group"
                                >
                                    <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                                        {p.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{p.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
