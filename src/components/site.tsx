"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { heroBackground } from "@/lib/themes";
import { services } from "@/lib/services";

export const glass = "border border-white/25 bg-white/15 backdrop-blur-md shadow-lg shadow-black/10";

const footerLinks: [string, string][] = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/services", "Services"],
  ["/contact", "Contact"],
];

// Green-tinted photo band. The nav is fixed, so pt-20 leaves room for it.
export function HeroBand({ children }: { children: ReactNode }) {
  return (
    <div
      className="pt-20 text-white"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: heroBackground(135),
      }}
    >
      {children}
    </div>
  );
}

const navLink = (active: boolean) =>
  `relative px-4 py-2 text-sm font-medium after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:origin-left after:rounded after:bg-white after:transition-transform after:duration-300 ${
    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
  }`;

export function SiteNav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [dd, setDd] = useState(false);
  const [mobileSvc, setMobileSvc] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setDd(false);
  }, [path]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDd(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDd(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const onServices = path.startsWith("/services");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-300 ${
        scrolled
          ? "border-b border-white/15 bg-emerald-950/85 shadow-lg backdrop-blur-md"
          : "border-b border-white/10 bg-black/10 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          🩺 Tibu Health
        </Link>

        <nav className="hidden items-center md:flex">
          <Link href="/" className={navLink(path === "/")}>Home</Link>
          <Link href="/about" className={navLink(path === "/about")}>About Us</Link>

          {/* Services dropdown: opens on hover, click or keyboard */}
          <div
            ref={ddRef}
            className="relative"
            onMouseEnter={() => setDd(true)}
            onMouseLeave={() => setDd(false)}
          >
            <button
              onClick={() => setDd(!dd)}
              aria-expanded={dd}
              aria-haspopup="menu"
              className={`${navLink(onServices)} flex items-center gap-1`}
            >
              Services
              <span className={`text-xs transition-transform duration-300 ${dd ? "rotate-180" : ""}`}>▾</span>
            </button>

            <div
              className={`absolute left-1/2 top-full w-80 -translate-x-1/2 pt-2 transition-all duration-200 ${
                dd ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <div className="rounded-2xl border border-white/15 bg-emerald-950/95 p-2 shadow-2xl backdrop-blur-md">
                <Link
                  href="/services"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-white/10"
                >
                  View all services →
                </Link>
                {(["Patients", "Doctors"] as const).map((group) => (
                  <div key={group}>
                    <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      For {group.toLowerCase()}
                    </p>
                    {services
                      .filter((s) => s.audience === group)
                      .map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                        >
                          <span>{s.icon}</span>
                          <span className="flex-1">{s.title}</span>
                          {s.soon && (
                            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] text-amber-200">
                              Soon
                            </span>
                          )}
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/contact" className={navLink(path === "/contact")}>Contact</Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="rounded-lg border border-white/50 px-4 py-2 text-sm font-medium transition hover:bg-white/20">
            Login
          </Link>
          <Link href="/patients/register" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:scale-105 hover:bg-emerald-50">
            Get started
          </Link>
        </div>

        <button
          className="rounded-lg border border-white/40 px-3 py-2 md:hidden"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
          aria-expanded={menu}
        >
          {menu ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`grid overflow-hidden transition-all duration-300 md:hidden ${
          menu ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 border-t border-white/15 bg-emerald-950/95 px-4 pb-4 pt-2">
            <Link href="/" className="block rounded-lg px-3 py-2 hover:bg-white/10">Home</Link>
            <Link href="/about" className="block rounded-lg px-3 py-2 hover:bg-white/10">About Us</Link>
            <button
              onClick={() => setMobileSvc(!mobileSvc)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-white/10"
            >
              Services <span className={`transition-transform ${mobileSvc ? "rotate-180" : ""}`}>▾</span>
            </button>
            {mobileSvc && (
              <div className="ml-3 space-y-1 border-l border-white/20 pl-3">
                <Link href="/services" className="block rounded-lg px-3 py-2 text-emerald-200">View all</Link>
                {services.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10">
                    {s.icon} {s.title}
                  </Link>
                ))}
              </div>
            )}
            <Link href="/contact" className="block rounded-lg px-3 py-2 hover:bg-white/10">Contact</Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 rounded-lg border border-white/50 py-2 text-center text-sm">Login</Link>
              <Link href="/patients/register" className="flex-1 rounded-lg bg-white py-2 text-center text-sm font-semibold text-emerald-800">Get started</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll progress */}
      <div className="h-0.5 w-full bg-transparent">
        <div className="h-full bg-emerald-300 transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}

// Title area for inner pages
export function PageHero({ title, subtitle, crumbs }: { title: string; subtitle: string; crumbs?: [string, string?][] }) {
  return (
    <HeroBand>
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 text-center sm:pb-20 sm:pt-14">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 flex justify-center gap-2 text-sm text-white/70">
            {crumbs.map(([label, href], i) => (
              <span key={label} className="flex gap-2">
                {href ? <Link href={href} className="hover:text-white hover:underline">{label}</Link> : <span className="text-white">{label}</span>}
                {i < crumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-white/85">{subtitle}</p>
      </div>
    </HeroBand>
  );
}

function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-800 shadow-lg transition hover:bg-emerald-50 ${
          show ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        ↑
      </button>
      <Link
        href="/contact"
        aria-label="Contact us"
        className="floaty flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-xl text-white shadow-lg hover:bg-emerald-700"
      >
        💬
      </Link>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-emerald-950 text-emerald-100">
      <FloatingActions />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">🩺 Tibu Health</p>
          <p className="mt-2 text-sm text-emerald-200/80">Book appointments with doctors online, quickly and simply.</p>
        </div>
        <div>
          <p className="font-semibold text-white">Quick links</p>
          <ul className="mt-2 space-y-1 text-sm">
            {footerLinks.map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:underline">{label}</Link></li>
            ))}
            <li><Link href="/login" className="hover:underline">Login</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>📍 Nairobi, Kenya</li>
            <li>✉️ hello@tibuhealth.example</li>
            <li>📞 +254 700 000 000</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-emerald-200/70">© Tibu Health</p>
    </footer>
  );
}