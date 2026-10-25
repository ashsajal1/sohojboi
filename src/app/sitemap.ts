import type { MetadataRoute } from "next";

const BASE_URL = "https://sohojboi.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/article",
    "/question",
    "/quiz",
    "/rank",
    "/series",
    "/challenge",
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
