import Link from "next/link";
import { PageHero, SiteFooter } from "@/components/site";
import { Reveal } from "@/components/motion";
import { services } from "@/lib/services";

export default function Services() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PageHero
        title="Our Services"
        subtitle="Everything you need to see a doctor, in one place."
        crumbs={[["Home", "/"], ["Services"]]}
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 100}>
            <Link
              href={`/services/${s.slug}`}
              className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-125">{s.icon}</span>
                {s.soon && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Coming soon</span>}
              </div>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.short}</p>
              <p className="mt-3 text-sm font-medium text-emerald-700">Learn more →</p>
            </Link>
          </Reveal>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}