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

  // Generate keywords from title, category, and other post data
  const keywords = generateKeywords(post.title, post.category, post.summary);

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
    keywords: keywords,
    slug: slug,
  };
}

/**
 * Generate keywords from post content
 */
function generateKeywords(title, category, summary) {
  const words = [];
  
  // Add category as keyword
  if (category) {
    words.push(category);
  }
  
  // Extract significant words from title (length > 3, not stop words)
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !isStopWord(word))
    .slice(0, 3);
  
  words.push(...titleWords);
  
  // Add generic blog keywords
  words.push('blog', 'writing', 'article');
  
  return Array.from(new Set(words)).join(', ');
}

/**
 * Check if word is a common stop word
 */
function isStopWord(word) {
  const stopWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
    'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy',
    'did', 'got', 'let', 'put', 'say', 'she', 'too', 'use', 'with', 'your',
  ];
  return stopWords.includes(word);
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
    <meta name="keywords" content="${escapeHtml(metadata.keywords)}" />
    <link rel="canonical" href="${escapeHtml(metadata.url)}" />
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
