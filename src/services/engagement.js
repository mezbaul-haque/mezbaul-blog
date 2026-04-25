import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// Likes
export async function toggleLike(postId, userId) {
  if (!db) return;

  const likeRef = doc(db, 'likes', `${userId}_${postId}`);
  const likeSnap = await getDoc(likeRef);

  if (likeSnap.exists()) {
    await unlike(postId, userId);
    return false;
  } else {
    await like(postId, userId);
    return true;
  }
}

async function like(postId, userId) {
  if (!db) return;

  const likeRef = doc(db, 'likes', `${userId}_${postId}`);
  const postRef = doc(db, 'posts', postId);

  await setDoc(likeRef, {
    userId,
    postId,
    createdAt: serverTimestamp(),
  });

  await setDoc(postRef, { likeCount: increment(1) }, { merge: true });
}

async function unlike(postId, userId) {
  if (!db) return;

  const likeRef = doc(db, 'likes', `${userId}_${postId}`);
  const postRef = doc(db, 'posts', postId);

  await deleteDoc(likeRef);
  await setDoc(postRef, { likeCount: increment(-1) }, { merge: true });
}

export async function isUserLikedPost(postId, userId) {
  if (!db || !userId) return false;

  const likeRef = doc(db, 'likes', `${userId}_${postId}`);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
}

export async function getLikeCount(postId) {
  if (!db) return 0;

  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  return postSnap.exists() ? postSnap.data().likeCount || 0 : 0;
}

export function subscribeToLikeCount(postId, callback) {
  if (!db) {
    callback(0);
    return () => {};
  }

  const postRef = doc(db, 'posts', postId);
  return onSnapshot(postRef, (snap) => {
    callback(snap.exists() ? snap.data().likeCount || 0 : 0);
  });
}

// Follows
export async function toggleFollow(writerId, followerId) {
  if (!db) return;

  const followRef = doc(db, 'follows', `${followerId}_${writerId}`);
  const followSnap = await getDoc(followRef);

  if (followSnap.exists()) {
    await unfollow(writerId, followerId);
    return false;
  } else {
    await follow(writerId, followerId);
    return true;
  }
}

async function follow(writerId, followerId) {
  if (!db) return;

  const followRef = doc(db, 'follows', `${followerId}_${writerId}`);
  const writerRef = doc(db, 'users', writerId);

  await setDoc(followRef, {
    followerId,
    writerId,
    createdAt: serverTimestamp(),
  });

  await setDoc(writerRef, { followerCount: increment(1) }, { merge: true });
}

async function unfollow(writerId, followerId) {
  if (!db) return;

  const followRef = doc(db, 'follows', `${followerId}_${writerId}`);
  const writerRef = doc(db, 'users', writerId);

  await deleteDoc(followRef);
  await setDoc(writerRef, { followerCount: increment(-1) }, { merge: true });
}

export async function isUserFollowing(writerId, followerId) {
  if (!db || !followerId) return false;

  const followRef = doc(db, 'follows', `${followerId}_${writerId}`);
  const followSnap = await getDoc(followRef);
  return followSnap.exists();
}

export async function getFollowerCount(writerId) {
  if (!db) return 0;

  const writerRef = doc(db, 'users', writerId);
  const writerSnap = await getDoc(writerRef);
  return writerSnap.exists() ? writerSnap.data().followerCount || 0 : 0;
}

export function subscribeToFollowerCount(writerId, callback) {
  if (!db) {
    callback(0);
    return () => {};
  }

  const writerRef = doc(db, 'users', writerId);
  return onSnapshot(writerRef, (snap) => {
    callback(snap.exists() ? snap.data().followerCount || 0 : 0);
  });
}

// Comments
export async function addComment(postId, userId, content) {
  if (!db) return null;

  const commentRef = doc(collection(db, 'comments'));
  const commentData = {
    postId,
    userId,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(commentRef, commentData);
  return { id: commentRef.id, ...commentData };
}

export async function updateComment(commentId, userId, content) {
  if (!db) return;

  const commentRef = doc(db, 'comments', commentId);
  await setDoc(commentRef, { content, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteComment(commentId) {
  if (!db) return;

  const commentRef = doc(db, 'comments', commentId);
  await deleteDoc(commentRef);
}

export async function getCommentsForPost(postId) {
  if (!db) return [];

  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, where('postId', '==', postId));
  const snapshot = await getDocs(q);

  const comments = [];
  snapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() });
  });

  return comments.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
}

export function subscribeToComments(postId, callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, where('postId', '==', postId));

  return onSnapshot(q, (snapshot) => {
    const comments = [];
    snapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    callback(comments.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
  });
}
