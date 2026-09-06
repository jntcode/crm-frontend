"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getAuthSession, setDemoSession } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/context";
import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

function useAnimatedCounter(end: number, duration: number = 2000, inView: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, inView]);

  return count;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const session = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getAuthSession();
  }, []);

  const counter1 = useAnimatedCounter(100, 2000, statsInView);
  const counter2 = useAnimatedCounter(500, 2000, statsInView);
  const counter3 = useAnimatedCounter(99, 2000, statsInView);

  const features = [
    {
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
    },
    {
      title: t("feature4Title"),
      desc: t("feature4Desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: t("feature5Title"),
      desc: t("feature5Desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
    {
      title: t("feature6Title"),
      desc: t("feature6Desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const steps = [
    { num: "01", title: t("step1Title"), desc: t("step1Desc") },
    { num: "02", title: t("step2Title"), desc: t("step2Desc") },
    { num: "03", title: t("step3Title"), desc: t("step3Desc") },
  ];

  const testimonials = [
    {
      quote: t("feature1Title") + " — " + t("feature1Desc"),
      name: "Sarah Chen",
      role: "VP of Sales, TechCorp",
    },
    {
      quote: t("feature5Title") + " — " + t("feature5Desc"),
      name: "Marcus Rodriguez",
      role: "Sales Director, GrowthLab",
    },
    {
      quote: t("feature3Title") + " — " + t("feature3Desc"),
      name: "Emily Park",
      role: "Founder, StudioMode",
    },
  ];

  return (
    <main className="min-h-screen transition-colors overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] nav-blur bg-[var(--panel)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            ◇ CRM
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
              How It Works
            </a>
            <Link href="/about" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-28">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] hover:brightness-110 transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] hover:brightness-110 transition"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6 hero-gradient"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-[0.08]"
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-8">
              ✦ Professional CRM Platform
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-[var(--foreground)] mb-6"
          >
            {t("heroTitle")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl text-[var(--muted)] mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--button)] px-8 py-4 text-base font-semibold text-[var(--button-text)] hover:brightness-110 transition shadow-lg hover:shadow-xl"
            >
              {t("getStarted")}
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <button
              onClick={async () => {
                await setDemoSession();
                router.push("/dashboard");
              }}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-8 py-4 text-base font-semibold text-[var(--foreground)] hover:bg-[var(--soft)] transition"
            >
              {t("tryDemo")}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-[var(--border)] flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-[var(--muted)]" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section ref={statsRef} className="px-6 py-20 border-t border-[var(--border)]">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-12"
          >
            <div className="text-center">
              <p className="text-5xl font-bold text-[var(--foreground)] mb-2">
                {counter1}<span className="text-[var(--accent)]">+</span>
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("statContacts")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[var(--foreground)] mb-2">
                {counter2}<span className="text-[var(--accent)]">+</span>
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("statDeals")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[var(--foreground)] mb-2">
                {counter3}<span className="text-[var(--accent)]">%</span>
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("statUptime")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="px-6 py-24 bg-[var(--soft)]/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] mb-4">
              ✦ KEY FEATURES
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
              {t("feature1Title").split(" ")[0]} {t("feature3Title").split(" ")[0]} {t("feature5Title").split(" ")[0]}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-7 card-glow hover:border-[var(--accent)]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-5 group-hover:bg-[var(--accent)]/20 transition">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" ref={howItWorksRef} className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] mb-4">
              ✦ {t("howItWorks").toUpperCase()}
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
              {t("howItWorks")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                initial="hidden"
                animate={howItWorksInView ? "visible" : "hidden"}
                transition={{ duration: 0.5, delay: 0.2 * i }}
                className="relative text-center"
              >
                <div className="text-6xl font-bold text-[var(--accent)]/20 mb-4">{step.num}</div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">{step.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 w-16 border-t border-[var(--border)] border-dashed" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" ref={testimonialsRef} className="px-6 py-24 bg-[var(--soft)]/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] mb-4">
              ✦ {t("testimonials").toUpperCase()}
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
              {t("testimonials")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.name}
                variants={scaleIn}
                initial="hidden"
                animate={testimonialsInView ? "visible" : "hidden"}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-7"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[var(--foreground)] leading-relaxed mb-6">&ldquo;{item.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">{item.name}</p>
                  <p className="text-sm text-[var(--muted)]">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 hero-gradient opacity-50" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-[var(--muted)] mb-8 text-lg max-w-xl mx-auto">
                {t("ctaSubtitle")}
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--button)] px-10 py-4 text-base font-semibold text-[var(--button-text)] hover:brightness-110 transition shadow-lg animate-glow"
              >
                {t("getStarted")}
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-16 bg-[var(--soft)]/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-bold text-[var(--foreground)] mb-4">◇ CRM</div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {t("heroSubtitle")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                <li><a href="#features" className="hover:text-[var(--foreground)] transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-[var(--foreground)] transition">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-[var(--foreground)] transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-4 text-sm uppercase tracking-wider">Developer</h4>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                <li>
                  <a href="https://github.com/jntcode" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/jhonata-silva-181675373/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://crm-frontend-six-pearl.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    Live Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                <li><a href="#" className="hover:text-[var(--foreground)] transition">Help Center</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition">Contact</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)]">
            <p>Built by <a href="https://www.linkedin.com/in/jhonata-silva-181675373/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Jhonata Rusaffa</a> &copy; 2026 CRM Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
