/**
 * Structured data utilities for SEO (JSON-LD)
 * Helps search engines understand your content better
 */

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://blog.mezbaul.bd';

function absoluteUrl(path = '') {
  if (!path) return BASE_URL;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Add a structured data script to the page
 */
export function addStructuredDataScript(data, id = 'page') {
  const existingScript = document.querySelector(
    `script[type="application/ld+json"][data-structured-data-id="${id}"]`,
  );
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.structuredDataId = id;
  script.innerHTML = JSON.stringify(data);
  document.head.appendChild(script);

  return () => removeStructuredDataScript(id);
}

/**
 * Remove a structured data script from the page
 */
export function removeStructuredDataScript(id) {
  const script = document.querySelector(
    `script[type="application/ld+json"][data-structured-data-id="${id}"]`,
  );

  if (script) {
    script.remove();
  }
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
    image: image ? {
      '@type': 'ImageObject',
      url: absoluteUrl(image),
      width: 1200,
      height: 630,
    } : undefined,
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
      item: absoluteUrl(item.url),
    })),
  };
}

/**
 * Generate author profile schema
 */
export function generateAuthorSchema({ name, url, image, description, title, website, twitter }) {
  const sameAs = [website, twitter].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    url: absoluteUrl(url),
    image: image ? absoluteUrl(image) : undefined,
    jobTitle: title,
    description: description,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

/**
 * Generate schema for the about page
 */
export function generateAboutPageSchema({ title, description }) {
  const organization = generateOrganizationSchema();
  delete organization['@context'];

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title || 'About Eubello',
    description,
    url: `${BASE_URL}/about`,
    about: organization,
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
    url: `${BASE_URL}/archive`,
    hasPart: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${BASE_URL}/posts/${post.slug}`,
      image: post.heroImage ? absoluteUrl(post.heroImage) : undefined,
      author: post.authorName ? {
        '@type': 'Person',
        name: post.authorName,
      } : undefined,
      articleSection: post.category,
    })),
  };
}

/**
 * Generate writers collection schema
 */
export function generateWritersCollectionSchema(authors) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Eubello Writers',
    description: 'A collection of authors contributing to Eubello',
    itemListElement: authors.map((author, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: author.name,
        url: `${BASE_URL}/writers/${author.id}`,
        image: author.avatar ? absoluteUrl(author.avatar) : undefined,
        jobTitle: author.title,
        description: author.bio,
        sameAs: [author.website, author.twitter].filter(Boolean).length
          ? [author.website, author.twitter].filter(Boolean)
          : undefined,
      },
    })),
  };
}
