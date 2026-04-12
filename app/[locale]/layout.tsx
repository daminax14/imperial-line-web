import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDictionary, isSupportedLocale } from "@/lib/get-dictionary";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { getSiteUrl } from "@/lib/site-url";

import AppBackground from "@/components/AppBackground";
import CookieConsentToast from "@/components/CookieConsentToast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = getSiteUrl();
  const metadataBase = new URL(siteUrl);
  const canonicalPath = `/${isSupportedLocale(locale) ? locale : "it"}`;

  return {
    metadataBase,
    title: {
      default: "Imperial Line Siberians",
      template: "%s | Imperial Line Siberians",
    },
    description:
      "Allevamento etico di gatti Siberiani con informazioni su cucciolate, gatti disponibili e condizioni di adozione.",
    alternates: {
      canonical: canonicalPath,
      languages: {
        it: "/it",
        en: "/en",
        fr: "/fr",
        de: "/de",
      },
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      siteName: "Imperial Line Siberians",
      title: "Imperial Line Siberians",
      description:
        "Allevamento etico di gatti Siberiani con informazioni su cucciolate, gatti disponibili e condizioni di adozione.",
      locale,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased relative min-h-screen">
        {/* SFONDO GLOBALE (client component) */}
        <AppBackground />

        <Navbar dict={dict} locale={locale} />
        {children}
        <Footer dict={dict} locale={locale} />
        <CookieConsentToast locale={locale} />
        <SpeedInsights />
      </body>
    </html>
  );
}