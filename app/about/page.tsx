"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const technologies = [
  { name: "Spring Boot", icon: "☕", color: "from-emerald-500/20 to-emerald-600/10" },
  { name: "Next.js", icon: "▲", color: "from-sky-500/20 to-sky-600/10" },
  { name: "TypeScript", icon: "TS", color: "from-blue-500/20 to-blue-600/10" },
  { name: "React", icon: "⚛", color: "from-cyan-500/20 to-cyan-600/10" },
  { name: "Tailwind CSS", icon: "🎨", color: "from-violet-500/20 to-violet-600/10" },
  { name: "H2 Database", icon: "DB", color: "from-orange-500/20 to-orange-600/10" },
  { name: "JWT Auth", icon: "🔐", color: "from-rose-500/20 to-rose-600/10" },
  { name: "Recharts", icon: "📊", color: "from-pink-500/20 to-pink-600/10" },
  { name: "Framer Motion", icon: "✨", color: "from-amber-500/20 to-amber-600/10" },
  { name: "TanStack Query", icon: "🔄", color: "from-red-500/20 to-red-600/10" },
  { name: "React Hook Form", icon: "📝", color: "from-indigo-500/20 to-indigo-600/10" },
  { name: "Docker", icon: "🐳", color: "from-sky-600/20 to-sky-700/10" },
];

const features = [
  { title: "Real-time Dashboard", desc: "Analytics, pipeline charts, and activity feeds with live data", icon: "📈" },
  { title: "Multi-entity CRM", desc: "Leads, contacts, companies, tasks, emails — all connected", icon: "🔗" },
  { title: "Sales Pipeline", desc: "Kanban board with drag-and-drop lead management", icon: "🎯" },
  { title: "Global Search", desc: "Instantly find any record with Ctrl+K", icon: "🔍" },
  { title: "i18n Support", desc: "English and Portuguese (Brazil) with one-click switching", icon: "🌍" },
  { title: "JWT Authentication", desc: "Secure login with role-based access control", icon: "🔐" },
  { title: "Dark/Light Theme", desc: "Adaptive theming with system preference detection", icon: "🎨" },
  { title: "Mobile Responsive", desc: "Fully responsive with slide-in sidebar on mobile", icon: "📱" },
];

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent)]/10" />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[var(--accent)]/8 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl animate-float-reverse" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4">Portfolio Project</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] leading-tight">
            Enterprise <span className="bg-gradient-to-r from-[var(--accent)] to-violet-500 bg-clip-text text-transparent">CRM System</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-[var(--muted)] text-lg">
            A full-stack customer relationship management platform built with modern web technologies.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-[var(--muted)]">
            <span>By <strong className="text-[var(--foreground)]">Jhonata Rusaffa</strong></span>
            <span>·</span>
            <span>2026</span>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "12+", label: "Tech Stack" },
            { value: "6", label: "Entity Types" },
            { value: "8", label: "Full Pages" },
            { value: "2", label: "Languages" },
          ].map((stat) => (
            <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 text-center"
            >
              <div className="text-2xl font-bold text-[var(--accent)]">{stat.value}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Tech Stack</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Built with industry-standard tools and frameworks</p>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {technologies.map((tech) => (
              <motion.div key={tech.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className={`group rounded-xl border border-[var(--border)] bg-gradient-to-br ${tech.color} p-4 text-center transition hover:scale-105 hover:border-[var(--accent)]/30 cursor-default`}
              >
                <div className="text-2xl mb-2">{tech.icon}</div>
                <div className="text-xs font-medium text-[var(--foreground)]">{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Features</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Enterprise-grade functionality in a clean interface</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feat) => (
              <motion.div key={feat.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5 transition hover:border-[var(--accent)]/30"
              >
                <span className="text-2xl shrink-0">{feat.icon}</span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">{feat.title}</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Architecture</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Clean separation of concerns with modern patterns</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-8"
          >
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-2xl mb-3">🖥</div>
                <h3 className="font-semibold text-[var(--foreground)]">Frontend</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Next.js + TypeScript + Tailwind + TanStack Query + Recharts</p>
              </div>
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl mb-3">⚙️</div>
                <h3 className="font-semibold text-[var(--foreground)]">Backend</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Spring Boot 3 + Java 21 + Spring Security + JWT</p>
              </div>
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-2xl mb-3">📦</div>
                <h3 className="font-semibold text-[var(--foreground)]">Infrastructure</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Docker + Vercel + Render + GitHub Actions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Interested in this project?</h2>
            <p className="text-[var(--muted)] mt-2 mb-6">Check out the source code or try the live demo.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="https://github.com/jntcode/crm-frontend" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] hover:opacity-90 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                Frontend Code
              </a>
              <a href="https://github.com/jntcode/crm-backend" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--soft)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--soft-strong)] transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                Backend Code
              </a>
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/20 transition">
                Live Demo →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
