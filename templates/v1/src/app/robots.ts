import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
