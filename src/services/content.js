import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { authors as staticAuthors } from '../data/authors';
import { posts as staticPosts } from '../data/posts';
import { db, isFirebaseConfigured } from './firebase';

function toDateValue(value) {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDisplayDate(value, fallback = 'Draft') {
  const date = toDateValue(value);
  if (!date) return fallback;
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function estimateReadTime(post) {
  if (post.readTime) return post.readTime;

  const text = [
    post.title,
    post.summary,
    post.intro,
    ...(post.sections || []).flatMap((section) => [
      section.heading,
      ...(section.paragraphs || []),
    ]),
  ]
    .filter(Boolean)
    .join(' ');

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function normalizeAuthor(author) {
  return {
    id: author.id,
    name: author.name || 'Unknown writer',
    title: author.title || 'Writer',
    avatar: author.avatar || '',
    coverPhoto: author.coverPhoto || '',
    bio: author.bio || '',
    website: author.website || '',
    twitter: author.twitter || '',
    approvalStatus: author.approvalStatus || 'approved',
    isActive: author.isActive ?? true,
    isProfileVisible: author.isProfileVisible ?? true,
  };
}

function normalizePost(post) {
  return {
    ...post,
    id: post.id || post.slug,
    slug: post.slug || post.id,
    title: post.title || 'Untitled',
    category: post.category || 'Uncategorized',
    summary: post.summary || '',
    intro: post.intro || '',
    heroImage: post.heroImage || post.thumbImage || '',
    thumbImage: post.thumbImage || post.heroImage || '',
    heroAlt: post.heroAlt || post.title || 'Post image',
    sections: post.sections || [],
    related: post.related || [],
    date: post.date || formatDisplayDate(post.publishedAt, 'Unpublished'),
    readTime: estimateReadTime(post),
    status: post.status || 'published',
  };
}

const STATIC_AUTHORS_MAP = new Map(
  Object.values(staticAuthors).map((author) => [author.id, normalizeAuthor(author)]),
);
const STATIC_POSTS_MAP = new Map(
  staticPosts.map((post) => [post.slug, normalizePost(post)]),
);

function sortPostsComparator(a, b) {
  const first = toDateValue(a.publishedAt || a.date);
  const second = toDateValue(b.publishedAt || b.date);

  if (!first && !second) return 0;
  if (!first) return 1;
  if (!second) return -1;
  return second.getTime() - first.getTime();
}

export function usePublicContent() {
  const [livePostsMap, setLivePostsMap] = useState(new Map());
  const [liveAuthorsMap, setLiveAuthorsMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setIsLoading(false);
      return undefined;
    }

    const postsQuery = collection(db, 'posts');
    const authorsQuery = collection(db, 'users');

    let postsReady = false;
    let authorsReady = false;

    const syncLoading = () => {
      if (postsReady && authorsReady) {
        setIsLoading(false);
      }
    };

    const unsubscribePosts = onSnapshot(
      postsQuery,
      (snapshot) => {
        const postsMap = new Map();
        snapshot.docs.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          if (data.status === 'published') {
            postsMap.set(data.slug || data.id, normalizePost(data));
          }
        });
        setLivePostsMap(postsMap);
        postsReady = true;
        syncLoading();
      },
      () => {
        postsReady = true;
        syncLoading();
      },
    );

    const unsubscribeAuthors = onSnapshot(
      authorsQuery,
      (snapshot) => {
        const authorsMap = new Map();
        snapshot.docs.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          if (data.approvalStatus === 'approved' && data.isProfileVisible) {
            authorsMap.set(data.id, normalizeAuthor(data));
          }
        });
        setLiveAuthorsMap(authorsMap);
        authorsReady = true;
        syncLoading();
      },
      () => {
        authorsReady = true;
        syncLoading();
      },
    );

    return () => {
      unsubscribePosts();
      unsubscribeAuthors();
    };
  }, []);

  const mergedAuthorsMap = useMemo(() => {
    const map = new Map(STATIC_AUTHORS_MAP);
    liveAuthorsMap.forEach((val, key) => map.set(key, val));
    return map;
  }, [liveAuthorsMap]);

  const mergedPostsMap = useMemo(() => {
    const map = new Map(STATIC_POSTS_MAP);
    livePostsMap.forEach((val, key) => map.set(key, val));
    return map;
  }, [livePostsMap]);

  const posts = useMemo(() => {
    return Array.from(mergedPostsMap.values()).sort(sortPostsComparator);
  }, [mergedPostsMap]);

  const authors = useMemo(() => Array.from(mergedAuthorsMap.values()), [mergedAuthorsMap]);

  return {
    isLoading,
    authors,
    posts,
    authorsById: Object.fromEntries(mergedAuthorsMap),
    postsBySlug: Object.fromEntries(mergedPostsMap),
  };
}
