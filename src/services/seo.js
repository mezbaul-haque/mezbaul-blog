const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://blog.mezbaul.bd';

/**
 * Update canonical URL meta tag
 */
export function setCanonicalUrl(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url || window.location.href);
}

/**
 * Add structured data (JSON-LD) for SEO
 */
export function addStructuredData(data) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Generate structured data for an article
 */
export function generateArticleStructuredData({ title, description, image, author, publishDate, modifiedDate, url, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Person',
      name: author || 'Mezbaul',
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
  };
}

/**
 * Generate structured data for the site
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eubello',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: 'Thoughtful writing on work, systems, technology, and everyday life.',
    sameAs: [
      'https://twitter.com/mezbaul',
      'https://linkedin.com/in/mezbaul',
    ],
  };
}

/**
 * Update Open Graph meta tags for social sharing
 */
export function updateOpenGraphMeta({ title, description, url, image }) {
  console.log('Updating OG meta tags:', { title, description, url, image });

  // Update og:title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title || 'Eubello');

  // Update og:description
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute('content', description || 'Mezbaul\'s blog on operations, systems, workflows, and practical writing.');

  // Update og:url
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', url || window.location.href);

  // Update og:image - CRITICAL: must have a valid image URL
  let ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) {
    ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    document.head.appendChild(ogImage);
  }
  if (image) {
    ogImage.setAttribute('content', image);
    console.log('OG image set to:', image);
  }

  // Ensure og:type is set
  let ogType = document.querySelector('meta[property="og:type"]');
  if (!ogType) {
    ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    document.head.appendChild(ogType);
  }
  ogType.setAttribute('content', 'article');

  // Set image dimensions for better social sharing
  let ogImageWidth = document.querySelector('meta[property="og:image:width"]');
  if (!ogImageWidth) {
    ogImageWidth = document.createElement('meta');
    ogImageWidth.setAttribute('property', 'og:image:width');
    document.head.appendChild(ogImageWidth);
  }
  ogImageWidth.setAttribute('content', '1200');

  let ogImageHeight = document.querySelector('meta[property="og:image:height"]');
  if (!ogImageHeight) {
    ogImageHeight = document.createElement('meta');
    ogImageHeight.setAttribute('property', 'og:image:height');
    document.head.appendChild(ogImageHeight);
  }
  ogImageHeight.setAttribute('content', '630');

  // Update Twitter Card meta tags for better sharing on Twitter/X
  let twitterCard = document.querySelector('meta[name="twitter:card"]');
  if (!twitterCard) {
    twitterCard = document.createElement('meta');
    twitterCard.setAttribute('name', 'twitter:card');
    document.head.appendChild(twitterCard);
  }
  twitterCard.setAttribute('content', 'summary_large_image');

  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twitterTitle) {
    twitterTitle = document.createElement('meta');
    twitterTitle.setAttribute('name', 'twitter:title');
    document.head.appendChild(twitterTitle);
  }
  twitterTitle.setAttribute('content', title || 'Eubello');

  let twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (!twitterDescription) {
    twitterDescription = document.createElement('meta');
    twitterDescription.setAttribute('name', 'twitter:description');
    document.head.appendChild(twitterDescription);
  }
  twitterDescription.setAttribute('content', description || 'Mezbaul\'s blog on operations, systems, workflows, and practical writing.');

  let twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (!twitterImage) {
    twitterImage = document.createElement('meta');
    twitterImage.setAttribute('name', 'twitter:image');
    document.head.appendChild(twitterImage);
  }
  if (image) {
    twitterImage.setAttribute('content', image);
  }

  // Update regular meta description for SEO
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description || 'Mezbaul\'s blog on operations, systems, workflows, and practical writing.');
  }

  // Update page title
  document.title = title ? `${title} - Eubello` : 'Eubello';
}

/**
 * Get the absolute URL for an image
 */
export function getAbsoluteImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
}
