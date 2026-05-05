/**
 * Update Open Graph meta tags for social sharing
 */
export function updateOpenGraphMeta({ title, description, url, image }) {
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

  // Update og:image
  let ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) {
    ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    document.head.appendChild(ogImage);
  }
  ogImage.setAttribute('content', image || '');

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
  const baseUrl = window.location.origin;
  return `${baseUrl}${imagePath}`;
}
