const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setWithMerge } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.incrementPostViewCount = onDocumentCreated("views/{viewId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();
  const postSlug = data.postSlug;

  if (!postSlug) {
    console.log("No postSlug found in view document");
    return;
  }

  const postStatsRef = admin.firestore().collection("postStats").doc(postSlug);

  try {
    await postStatsRef.set({
      viewCount: admin.firestore.FieldValue.increment(1),
      lastViewedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
    console.log(`Successfully incremented view count for post: ${postSlug}`);
  } catch (error) {
    console.error(`Error incrementing view count for ${postSlug}:`, error);
  }
});
