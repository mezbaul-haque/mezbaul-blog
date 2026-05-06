/**
 * Structured data utilities for SEO (JSON-LD)
 * Helps search engines understand your content better
 */

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://blog.mezbaul.bd';

/**
 * Add a structured data script to the page
 */
export function addStructuredDataScript(data) {
  // Remove existing structured data script if present
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Create and add new script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Generate schema for a blog post
 */
export function generateArticleSchema({
  title,
  description,
  image,
  author,
  publishDate,
  modifiedDate,
  url,
  category,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: author || 'Mezbaul',
      url: BASE_URL,
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category || 'Blog',
    inLanguage: 'en',
  };
}

/**
 * Generate schema for the website/organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eubello',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description:
      'Thoughtful writing on work, systems, technology, and everyday life.',
    sameAs: [
      'https://twitter.com/mezbaul',
      'https://linkedin.com/in/mezbaul',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'contact@mezbaul.bd',
    },
  };
}

/**
 * Generate schema for the home page
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Eubello',
    url: BASE_URL,
    description:
      'Mezbaul\'s blog on operations, systems, workflows, and practical writing.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate breadcrumb schema for better navigation
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate author profile schema
 */
export function generateAuthorSchema({ name, url, image, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    url: url || BASE_URL,
    image: image,
    description: description,
    sameAs: [
      'https://twitter.com/mezbaul',
      'https://linkedin.com/in/mezbaul',
    ],
  };
}

/**
 * Generate blog collection schema
 */
export function generateBlogCollectionSchema(posts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog Archive',
    description: 'All blog posts from Eubello',
    hasPart: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${BASE_URL}/posts/${post.slug}`,
      image: post.heroImage?.startsWith('http')
        ? post.heroImage
        : `${BASE_URL}${post.heroImage}`,
    })),
  };
}
