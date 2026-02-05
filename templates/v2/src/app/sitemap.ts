import { MetadataRoute } from 'next';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lumina.inc'; // Replace with actual domain
  const languages = ['en', 'de', 'fr'];
  const routes = ['', '/about', '/contact', '/privacy', '/terms', '/imprint'];

  const sitemap: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}
