import Link from "next/link";
import { PageHero, SiteFooter } from "@/components/site";
import { Reveal } from "@/components/motion";
import { Tabs } from "@/components/home-parts";

const values = [
  ["Accessible", "Care should be a few taps away, wherever you live."],
  ["Simple", "Booking a doctor shouldn't take phone calls or long queues."],
  ["Trustworthy", "You see who you are booking, and each role sees only what it needs."],
];

const tabs = [
  {
    label: "Patients",
    icon: "🧑🏾",
    items: [
      "Create a free account in a minute",
      "Search doctors by name or specialization",
      "Book, view and cancel your own appointments",
    ],
  },
  {
    label: "Doctors",
    icon: "🩺",
    items: [
      "Get an account created by the administrator",
      "See your own schedule and patient names",
      "Mark visits as completed",
    ],
  },
  {
    label: "Admins",
    icon: "🛡️",
    items: [
      "Register new doctors",
      "See every appointment on the platform",
      "Keep the doctor list accurate",
    ],
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PageHero title="About Us" subtitle="Making it easier for everyone to see a doctor." crumbs={[["Home", "/"], ["About Us"]]} />

      <section className="mx-auto max-w-3xl px-4 py-14">
        <Reveal>
          <h2 className="text-2xl font-bold">Our mission</h2>
          <p className="mt-3 text-slate-700">
            Tibu Health connects patients with doctors through simple online booking. We want to take the stress out of
            finding a doctor, choosing a time and keeping track of your appointments.
          </p>
        </Reveal>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3">
          {values.map(([title, text], i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="h-full rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="font-semibold text-emerald-800">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <h2 className="mb-8 text-center text-2xl font-bold">Who it's for</h2>
          <Tabs tabs={tabs} />
        </Reveal>
      </section>

      <section className="px-4 pb-14 text-center">
        <Link href="/patients/register" className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-emerald-800">
          Create your free account
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}