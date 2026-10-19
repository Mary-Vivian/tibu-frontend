"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HeroBand, SiteFooter, SiteNav, glass } from "@/components/site";
import { Reveal } from "@/components/motion";
import { services } from "@/lib/services";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50">
        <HeroBand><SiteNav /><div className="h-24" /></HeroBand>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Service not found</h1>
          <Link href="/services" className="mt-4 inline-block text-emerald-700 underline">Back to services</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeroBand>
        <SiteNav />
        <div className="mx-auto max-w-6xl px-4 pt-6 text-sm text-white/70">
          <Link href="/" className="hover:text-white hover:underline">Home</Link> /{" "}
          <Link href="/services" className="hover:text-white hover:underline">Services</Link> /{" "}
          <span className="text-white">{service.title}</span>
        </div>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-10 md:grid-cols-2">
          <Reveal>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${glass}`}>
              {service.soon ? "Coming soon" : `For ${service.audience.toLowerCase()}`}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {service.icon} {service.title}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-white/85">{service.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/patients/register" className="rounded-lg bg-white px-6 py-3 font-semibold text-emerald-800 transition hover:scale-105">
                Get started
              </Link>
              <Link href="/contact" className="rounded-lg border border-white/50 px-6 py-3 font-semibold hover:bg-white/20">
                Contact us
              </Link>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative mx-auto max-w-md">
              <div
                className="aspect-[4/3] w-full rounded-3xl bg-emerald-800 bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/dr.png')" }}
              />
              <div className={`floaty absolute -right-3 top-6 rounded-2xl px-4 py-3 text-sm font-medium ${glass}`}>✓ Free account</div>
              <div className={`floaty absolute -bottom-3 left-6 rounded-2xl px-4 py-3 text-sm font-medium ${glass}`} style={{ animationDelay: "1.5s" }}>
                📱 Works on mobile
              </div>
            </div>
          </Reveal>
        </section>
      </HeroBand>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <Reveal><h2 className="text-2xl font-bold">What you get</h2></Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {service.points.map((p, i) => (
            <Reveal key={p} delay={i * 100}>
              <li className="flex h-full gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-emerald-600">✓</span>
                <span className="text-slate-700">{p}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal><h2 className="mb-6 text-center text-2xl font-bold">Other services</h2></Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-md"
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="mt-2 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-slate-600">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}