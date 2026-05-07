/**
 * Analytics Service
 * Tracks post views and provides statistics on reading habits
 */
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

// Session tracking to avoid duplicate views
const viewSessions = new Map();
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get or create a session ID for the current user
 */
function getSessionId() {
  const now = Date.now();
  let sessionId = sessionStorage.getItem('analytics_session_id');
  let sessionTime = sessionStorage.getItem('analytics_session_time');

  if (!sessionId || !sessionTime || now - parseInt(sessionTime) > SESSION_DURATION) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
    sessionStorage.setItem('analytics_session_time', now.toString());
  }

  return sessionId;
}

/**
 * Track a post view
 * Prevents duplicate tracking from same user/session within SESSION_DURATION
 */
export async function trackPostView(postSlug, userId = null) {
  if (!db) {
    console.warn('[Analytics] Firebase not configured. View tracking disabled.');
    return;
  }

  const sessionId = getSessionId();
  const viewKey = `${postSlug}_${sessionId}`;

  // Prevent duplicate tracking in this session
  if (viewSessions.has(viewKey)) {
    console.debug('[Analytics] Duplicate view ignored:', postSlug);
    return;
  }

  viewSessions.set(viewKey, true);

  try {
    console.log('[Analytics] Tracking view for:', postSlug);
    
    // Record the view
    const viewRef = doc(
      db,
      'views',
      `${postSlug}_${sessionId}_${Date.now()}`
    );

    await setDoc(viewRef, {
      postSlug,
      userId: userId || null,
      sessionId,
      viewedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
    });

    console.log('[Analytics] View recorded successfully');

    // Update post view count (for quick access)
    const postStatsRef = doc(db, 'postStats', postSlug);
    const postStatsSnap = await getDoc(postStatsRef);

    if (postStatsSnap.exists()) {
      await updateDoc(postStatsRef, {
        viewCount: increment(1),
        lastViewedAt: serverTimestamp(),
      });
    } else {
      await setDoc(postStatsRef, {
        postSlug,
        viewCount: 1,
        lastViewedAt: serverTimestamp(),
      });
    }
    
    console.log('[Analytics] Post stats updated');
  } catch (error) {
    console.error('[Analytics] Error tracking post view:', error);
  }
}

/**
 * Get the view count for a specific post
 */
export async function getPostViewCount(postSlug) {
  if (!db) {
    console.warn('[Analytics] Firebase not configured. Cannot fetch view count.');
    return 0;
  }

  try {
    const postStatsRef = doc(db, 'postStats', postSlug);
    const postStatsSnap = await getDoc(postStatsRef);

    if (postStatsSnap.exists()) {
      const count = postStatsSnap.data().viewCount || 0;
      console.log('[Analytics] View count for', postSlug, ':', count);
      return count;
    }

    // Fallback: count views from views collection
    const viewsRef = collection(db, 'views');
    const viewsQuery = query(viewsRef, where('postSlug', '==', postSlug));
    const snapshot = await getDocs(viewsQuery);
    console.log('[Analytics] Fallback view count for', postSlug, ':', snapshot.size);
    return snapshot.size;
  } catch (error) {
    console.error('[Analytics] Error getting post view count:', error);
    return 0;
  }
}

/**
 * Get the top posts by view count
 */
export async function getTopPostsByViews(topCount = 5) {
  if (!db) {
    console.warn('[Analytics] Firebase not configured. Cannot fetch top posts.');
    return [];
  }

  try {
    const statsRef = collection(db, 'postStats');
    const topPostsQuery = query(
      statsRef,
      orderBy('viewCount', 'desc'),
      limit(topCount)
    );

    const snapshot = await getDocs(topPostsQuery);
    const results = snapshot.docs.map((doc) => ({
      postSlug: doc.data().postSlug,
      viewCount: doc.data().viewCount,
      lastViewedAt: doc.data().lastViewedAt,
    }));
    
    console.log('[Analytics] Top posts:', results);
    return results;
  } catch (error) {
    console.error('[Analytics] Error fetching top posts:', error);
    return [];
  }
}

/**
 * Get view statistics for all posts
 */
export async function getAllPostsViewStats() {
  if (!db) return {};

  try {
    const statsRef = collection(db, 'postStats');
    const snapshot = await getDocs(statsRef);

    const stats = {};
    snapshot.docs.forEach((doc) => {
      stats[doc.data().postSlug] = {
        viewCount: doc.data().viewCount,
        lastViewedAt: doc.data().lastViewedAt,
      };
    });

    return stats;
  } catch (error) {
    console.error('Error fetching all post stats:', error);
    return {};
  }
}

/**
 * Get view statistics for a specific post over time
 * Returns daily view counts for the last 30 days
 */
export async function getPostViewTrend(postSlug, days = 30) {
  if (!db) return {};

  try {
    const viewsRef = collection(db, 'views');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);

    const viewsQuery = query(
      viewsRef,
      where('postSlug', '==', postSlug),
      where('viewedAt', '>=', thirtyDaysAgo)
    );

    const snapshot = await getDocs(viewsQuery);
    const viewsByDay = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.viewedAt) {
        const date = data.viewedAt.toDate().toISOString().split('T')[0];
        viewsByDay[date] = (viewsByDay[date] || 0) + 1;
      }
    });

    return viewsByDay;
  } catch (error) {
    console.error('Error fetching view trend:', error);
    return {};
  }
}

/**
 * Get view statistics for a post by author
 */
export async function getAuthorPostsViewStats(authorId) {
  if (!db) return [];

  try {
    // This requires posts data to filter by author
    // You'll need to pass in the posts list or query it separately
    // For now, this is a placeholder for the implementation
    return [];
  } catch (error) {
    console.error('Error fetching author post stats:', error);
    return [];
  }
}
