import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { authors as staticAuthors } from '../data/authors';
import { posts as staticPosts } from '../data/posts';
import { db } from './firebase';

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

function mergeAuthors(liveAuthors) {
  const merged = new Map(
    Object.values(staticAuthors).map((author) => [author.id, normalizeAuthor(author)]),
  );

  liveAuthors.forEach((author) => {
    merged.set(author.id, normalizeAuthor(author));
  });

  return Array.from(merged.values());
}

function mergePosts(livePosts) {
  const merged = new Map(staticPosts.map((post) => [post.slug, normalizePost(post)]));

  livePosts.forEach((post) => {
    merged.set(post.slug, normalizePost(post));
  });

  return Array.from(merged.values()).sort((a, b) => {
    const first = toDateValue(a.publishedAt || a.date);
    const second = toDateValue(b.publishedAt || b.date);

    if (!first && !second) return 0;
    if (!first) return 1;
    if (!second) return -1;
    return second.getTime() - first.getTime();
  });
}

export function usePublicContent() {
  const [livePosts, setLivePosts] = useState([]);
  const [liveAuthors, setLiveAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        setLivePosts(
          snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .filter((post) => post.status === 'published'),
        );
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
        setLiveAuthors(
          snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .filter((author) => author.approvalStatus === 'approved' && author.isProfileVisible),
        );
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

  const authors = useMemo(() => mergeAuthors(liveAuthors), [liveAuthors]);
  const posts = useMemo(() => mergePosts(livePosts), [livePosts]);

  return {
    isLoading,
    authors,
    posts,
    authorsById: Object.fromEntries(authors.map((author) => [author.id, author])),
    postsBySlug: Object.fromEntries(posts.map((post) => [post.slug, post])),
  };
}
