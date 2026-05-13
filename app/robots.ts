import { MetadataRoute } from "next";

const BASE_URL = "https://freelancer-manager-site.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API 엔드포인트는 인덱싱 안 함
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
