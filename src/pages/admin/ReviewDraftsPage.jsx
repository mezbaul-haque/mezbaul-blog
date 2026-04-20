import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function ReviewDraftsPage() {
  const { user } = useAuth();
  const [submittedDrafts, setSubmittedDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'drafts'),
      where('status', '==', 'submitted'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const drafts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSubmittedDrafts(drafts);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleApprove(draft) {
    if (!user) return;
    const authorSnapshot = await getDoc(doc(db, 'users', draft.authorId));
    const authorProfile = authorSnapshot.exists() ? authorSnapshot.data() : null;

    const postData = {
      ...draft,
      slug: draft.slug || draft.id,
      status: 'published',
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedBy: user.uid,
      sourceDraftId: draft.id,
      authorName: authorProfile?.name || '',
      authorTitle: authorProfile?.title || '',
      authorAvatar: authorProfile?.avatar || '',
    };
    delete postData.id;
    delete postData.submittedAt;
    delete postData.reviewedAt;
    delete postData.reviewedBy;
    delete postData.rejectionReason;

    await setDoc(doc(db, 'posts', postData.slug), postData);
    await updateDoc(doc(db, 'drafts', draft.id), {
      status: 'approved',
      reviewedAt: serverTimestamp(),
      reviewedBy: user.uid,
    });

    setSelectedDraft(null);
  }

  async function handleReject() {
    if (!user || !selectedDraft) return;

    await updateDoc(doc(db, 'drafts', selectedDraft.id), {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: user.uid,
      rejectionReason,
    });

    setShowRejectDialog(false);
    setSelectedDraft(null);
    setRejectionReason('');
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Review Drafts
      </Typography>

      {submittedDrafts.length === 0 ? (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography color="text.secondary">
              No drafts pending review.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ mt: 3 }}>
          {submittedDrafts.map((draft) => (
            <Card key={draft.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={draft.title || 'Untitled'}
                  secondary={
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        Category: {draft.category || 'None'}
                      </Typography>
                      <Typography variant="caption">
                        Submitted: {draft.submittedAt?.toDate?.()?.toLocaleDateString()}
                      </Typography>
                    </Stack>
                  }
                />
                <Chip label="Submitted" color="primary" size="small" />
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => setSelectedDraft(draft)}
                >
                  Review
                </Button>
              </ListItem>
            </Card>
          ))}
        </List>
      )}

      <Dialog open={!!selectedDraft} onClose={() => setSelectedDraft(null)} maxWidth="md" fullWidth>
        <DialogTitle>Review Draft</DialogTitle>
        <DialogContent>
          {selectedDraft && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="h6">{selectedDraft.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Category: {selectedDraft.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Writer ID: {selectedDraft.authorId}
              </Typography>
              <Typography variant="subtitle2">Summary</Typography>
              <Typography variant="body2">{selectedDraft.summary}</Typography>
              <Typography variant="subtitle2">Introduction</Typography>
              <Typography variant="body2">{selectedDraft.intro}</Typography>
              {selectedDraft.sections?.map((section, i) => (
                <Box key={i}>
                  {section.heading && (
                    <Typography variant="subtitle2">{section.heading}</Typography>
                  )}
                  {section.paragraphs?.map((p, j) => (
                    <Typography key={j} variant="body2" sx={{ mb: 1 }}>{p}</Typography>
                  ))}
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDraft(null)}>Cancel</Button>
          <Button
            onClick={() => setShowRejectDialog(true)}
            color="error"
          >
            Reject
          </Button>
          <Button
            onClick={() => handleApprove(selectedDraft)}
            variant="contained"
            color="success"
          >
            Approve & Publish
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
        <DialogTitle>Reject Draft</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleReject} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
