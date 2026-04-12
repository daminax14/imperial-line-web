import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const locales = ["it", "en", "fr", "de"] as const;

const localizedPaths = [
  "",
  "/gattini-disponibili",
  "/i-nostri-gatti",
  "/su-di-noi",
  "/consigli",
  "/contatti",
  "/condizioni-adozione",
  "/privacy",
  "/cookies",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return locales.flatMap((locale) =>
    localizedPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.8,
    }))
  );
}
