#!/usr/bin/env node

/**
 * SEO Sitemap Generator Script
 * Run this script to generate sitemaps for your blog
 * Usage: node generate-sitemaps.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import sitemap generators
import {
  generatePostsSitemapXml,
  generateMainSitemapXml,
  generateSitemapIndexXml,
  generateRssFeed,
} from './src/services/sitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

try {
  // Generate main sitemap (static pages)
  console.log('Generating main sitemap...');
  const mainSitemap = generateMainSitemapXml();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
  console.log('✓ sitemap.xml created');

  // Generate posts sitemap
  console.log('Generating posts sitemap...');
  const postsSitemap = generatePostsSitemapXml();
  fs.writeFileSync(path.join(publicDir, 'sitemap-posts.xml'), postsSitemap);
  console.log('✓ sitemap-posts.xml created');

  // Generate sitemap index
  console.log('Generating sitemap index...');
  const sitemapIndex = generateSitemapIndexXml();
  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);
  console.log('✓ sitemap-index.xml created');

  // Generate RSS feed
  console.log('Generating RSS feed...');
  const rssFeed = generateRssFeed();
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssFeed);
  console.log('✓ feed.xml created');

  console.log('\n✨ All SEO files generated successfully!');
  console.log('\nGenerated files:');
  console.log('  - public/sitemap.xml (main pages)');
  console.log('  - public/sitemap-posts.xml (blog posts)');
  console.log('  - public/sitemap-index.xml (sitemap index)');
  console.log('  - public/feed.xml (RSS feed)');
  console.log('\nNext steps:');
  console.log('  1. Deploy these files with your site');
  console.log('  2. Go to Google Search Console');
  console.log('  3. Submit the sitemaps for indexing');
  console.log('  4. Monitor crawl statistics in Search Console');

} catch (error) {
  console.error('❌ Error generating sitemaps:', error.message);
  process.exit(1);
}
