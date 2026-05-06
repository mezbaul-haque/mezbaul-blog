/**
 * Sitemap generator for SEO
 * Generates XML sitemaps for search engine discovery
 */
import { posts } from '../data/posts.js';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://blog.mezbaul.bd';

const STATIC_PAGES = [
  { url: '/', lastModified: new Date().toISOString(), changeFreq: 'weekly', priority: 1.0 },
  { url: '/archive', lastModified: new Date().toISOString(), changeFreq: 'weekly', priority: 0.8 },
  { url: '/about', lastModified: new Date().toISOString(), changeFreq: 'monthly', priority: 0.6 },
  { url: '/writers', lastModified: new Date().toISOString(), changeFreq: 'weekly', priority: 0.7 },
  { url: '/contact', lastModified: new Date().toISOString(), changeFreq: 'monthly', priority: 0.5 },
];

/**
 * Generate sitemap XML for all posts
 */
export function generatePostsSitemapXml() {
  const urlset = posts.map(post => {
    const postDate = parseDate(post.date);
    return `
  <url>
    <loc>${escapeXml(`${BASE_URL}/posts/${post.slug}`)}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

/**
 * Generate main sitemap XML for static pages
 */
export function generateMainSitemapXml() {
  const urlset = STATIC_PAGES.map(page => {
    return `
  <url>
    <loc>${escapeXml(`${BASE_URL}${page.url}`)}</loc>
    <lastmod>${page.lastModified.split('T')[0]}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

/**
 * Generate sitemap index XML
 * Used when you have multiple sitemaps
 */
export function generateSitemapIndexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(`${BASE_URL}/sitemap.xml`)}</loc>
  </sitemap>
  <sitemap>
    <loc>${escapeXml(`${BASE_URL}/sitemap-posts.xml`)}</loc>
  </sitemap>
</sitemapindex>`;
}

/**
 * Parse date string and return ISO format
 */
function parseDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Get posts data for RSS feed (for future use)
 */
export function generateRssFeed() {
  const now = new Date().toUTCString();
  
  const items = posts.map(post => {
    const postDate = new Date(post.date).toUTCString();
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${BASE_URL}/posts/${post.slug}`)}</link>
      <description>${escapeXml(post.intro)}</description>
      <pubDate>${postDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <guid>${escapeXml(`${BASE_URL}/posts/${post.slug}`)}</guid>
    </item>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Eubello - Thoughtful Writing</title>
    <link>${BASE_URL}</link>
    <description>Mezbaul's blog on operations, systems, workflows, and practical writing.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <docs>http://www.rssboard.org/rss-specification</docs>
${items}
  </channel>
</rss>`;
}
