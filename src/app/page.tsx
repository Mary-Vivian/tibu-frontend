import Link from "next/link";

const features = [
  ["📅", "Book in seconds", "Pick a doctor and a time that suits you. No phone calls, no queues."],
  ["👩🏾‍⚕️", "Trusted doctors", "Browse doctors by specialization and see who's available."],
  ["💬", "Care from anywhere", "Consult from home and keep all your appointments in one place."],
];

const steps = ["Create your free account", "Choose a doctor and a time", "Attend your appointment"];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-lg font-bold text-teal-700">🩺 Tibu Health</span>
        <Link href="/login" className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
          Login
        </Link>
      </header>

      <section className="bg-gradient-to-b from-teal-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            See a doctor <span className="text-teal-600">whenever you need one</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Tibu Health lets you book appointments with doctors online, quickly and simply.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/patients/register" className="rounded-lg bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700">
              Get started
            </Link>
            <Link href="/login" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium hover:bg-slate-50">
              I have an account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:grid-cols-3">
        {features.map(([icon, title, text]) => (
          <div key={title} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="text-3xl">{icon}</div>
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-3 text-slate-700">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-slate-500">© Tibu Health</footer>
    </div>
  );
}