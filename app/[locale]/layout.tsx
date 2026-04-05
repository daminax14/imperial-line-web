import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDictionary, isSupportedLocale } from "@/lib/get-dictionary";
import { notFound } from "next/navigation";

import AppBackground from "@/components/AppBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

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
      </body>
    </html>
  );
}