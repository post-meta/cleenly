import { EditorialPullQuote } from "@/components/ui/editorial-pull-quote";

const statements = [
  "Greater Seattle service area.",
  "Liability insurance carried.",
  "Not right? We come back within 24 hours.",
];

export function TrustStrip() {
  return (
    <section className="bg-surface-warm py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {statements.map((line) => (
            <EditorialPullQuote key={line} className="text-[22px] md:text-[26px]">
              {line}
            </EditorialPullQuote>
          ))}
        </div>
      </div>
    </section>
  );
}
