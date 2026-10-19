import Link from "next/link";
import { HeroBand, SiteFooter, SiteNav, glass } from "@/components/site";
import { Reveal } from "@/components/motion";
import { Faq, HowItWorks, LiveStats } from "@/components/home-parts";
import { services } from "@/lib/services";

const faqs: [string, string][] = [
  ["Is it free to create an account?", "Yes. Patients can register for free and start booking right away."],
  ["Can I cancel an appointment?", "Yes. Open My appointments and cancel any scheduled visit. The slot becomes available to others."],
  ["Can two people book the same doctor at the same time?", "No. Once a time is taken, the doctor shows as unavailable for that slot."],
  ["Who can add doctors?", "Only an administrator can register doctors, so patients always see doctors the platform has added."],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeroBand>
        <SiteNav />
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 pt-12 md:grid-cols-2 md:pb-32 md:pt-20">
          <Reveal>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              See a doctor <span className="text-emerald-200">whenever you need one</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-white/85">
              Tibu Health lets you book appointments with doctors online, quickly and simply.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/patients/register" className="rounded-lg bg-white px-6 py-3 font-semibold text-emerald-800 transition hover:scale-105 hover:bg-emerald-50">
                Get started
              </Link>
              <Link href="/services" className="rounded-lg border border-white/50 px-6 py-3 font-semibold transition hover:bg-white/20">
                Our services
              </Link>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative mx-auto max-w-md">
              <div
                className="aspect-[4/5] w-full rounded-3xl bg-emerald-800 bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/dr.png')" }}
              />
              <div className={`floaty absolute -left-4 top-8 rounded-2xl px-4 py-3 text-sm font-medium ${glass}`}>✓ Free to join</div>
              <div className={`floaty absolute -right-4 top-1/2 rounded-2xl px-4 py-3 text-sm font-medium ${glass}`} style={{ animationDelay: "1s" }}>
                📅 Book online
              </div>
              <div className={`floaty absolute -bottom-4 left-8 rounded-2xl px-4 py-3 text-sm font-medium ${glass}`} style={{ animationDelay: "2s" }}>
                🕒 Any time
              </div>
            </div>
          </Reveal>
        </section>
      </HeroBand>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <LiveStats />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Reveal>
          <h2 className="text-center text-2xl font-bold">What you can do</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="mt-3 text-sm font-medium text-emerald-700 opacity-0 transition group-hover:opacity-100">Learn more →</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <h2 className="mb-8 text-center text-2xl font-bold">How it works</h2>
          </Reveal>
          <HowItWorks />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <Reveal>
          <h2 className="mb-8 text-center text-2xl font-bold">Common questions</h2>
        </Reveal>
        <Faq items={faqs} />
      </section>

      <section className="bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 py-14 text-center text-white">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to see a doctor?</h2>
          <p className="mt-2 text-white/85">Create your free account and book your first appointment today.</p>
          <Link href="/patients/register" className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-emerald-800 transition hover:scale-105">
            Get started
          </Link>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}