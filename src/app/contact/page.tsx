"use client";
import { FormEvent, useState } from "react";
import { PageHero, SiteFooter } from "@/components/site";
import { inputClass } from "@/components/ui";

const EMAIL = "hello@tibuhealth.example"; // replace with your real address

export default function Contact() {
  const [form, setForm] = useState({ name: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(form.message);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PageHero title="Contact Us" subtitle="Questions? We'd love to hear from you." />

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Get in touch</h2>
          <p className="text-slate-700">📍 Nairobi, Kenya</p>
          <p className="text-slate-700">✉️ {EMAIL}</p>
          <p className="text-slate-700">📞 +254 700 000 000</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Your name</span>
            <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Message</span>
            <textarea required rows={5} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </label>
          <button type="submit" className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-medium text-white hover:bg-emerald-800">
            Send message
          </button>
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}