/**
 * Generate OG meta tag data for each post
 * This data is used by social crawlers and the app itself
 */
import { posts } from '../data/posts';

export function generatePostMetadata(slug) {
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    return null;
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://blog.mezbaul.bd';
  const postUrl = `${baseUrl}/posts/${slug}`;
  const imageUrl = post.heroImage?.startsWith('http') 
    ? post.heroImage 
    : `${baseUrl}${post.heroImage}`;

  return {
    title: post.title,
    description: post.intro,
    url: postUrl,
    image: imageUrl,
    type: 'article',
    // Additional metadata
    author: post.authorName || 'Mezbaul',
    date: post.date,
    category: post.category,
  };
}

/**
 * Generate HTML snippet for meta tags
 * Useful for server-side rendering or static generation
 */
export function generateMetaTagsHtml(slug) {
  const metadata = generatePostMetadata(slug);
  
  if (!metadata) {
    return '';
  }

  return `
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:url" content="${escapeHtml(metadata.url)}" />
    <meta property="og:image" content="${escapeHtml(metadata.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="article" />
    <meta property="article:author" content="${escapeHtml(metadata.author)}" />
    <meta property="article:published_time" content="${metadata.date}" />
    <meta property="article:section" content="${escapeHtml(metadata.category)}" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
    <meta name="twitter:image" content="${escapeHtml(metadata.image)}" />
    
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <title>${escapeHtml(metadata.title)} - Eubello</title>
  `;
}

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
