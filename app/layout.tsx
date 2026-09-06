import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AppShell } from "@/components/app-shell";
import { I18nProvider } from "@/lib/i18n/context";
import { Providers } from "@/components/providers";
import { NotificationProvider } from "@/components/notifications";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "◇ CRM Platform | Customer Relationship Management",
    template: "%s | ◇ CRM",
  },
  description: "A full-stack enterprise CRM web application — customer management, lead pipeline, task tracking, email logging, and analytics dashboard. Built with Next.js and Spring Boot.",
  keywords: ["CRM", "customer relationship management", "sales pipeline", "lead management", "Next.js", "Spring Boot"],
  authors: [{ name: "Jhonata Rusaffa" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crm-frontend-six-pearl.vercel.app",
    siteName: "◇ CRM Platform",
    title: "◇ CRM Platform | Customer Relationship Management",
    description: "A full-stack enterprise CRM web application with customer management, lead pipeline, task tracking, and analytics.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "◇ CRM Platform Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "◇ CRM Platform",
    description: "A full-stack enterprise CRM web application.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('crm-theme');if(t&&['dark','slate','light'].includes(t)){document.documentElement.dataset.theme=t}else{document.documentElement.dataset.theme='light'}})()`,
          }}
        />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <Providers>
          <I18nProvider>
            <NotificationProvider>
              <AppShell>{children}</AppShell>
            </NotificationProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
