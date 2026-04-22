import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

function sortDraftsBySubmittedAt(drafts) {
  return [...drafts].sort((first, second) => {
    const firstTime = first.submittedAt?.toDate?.()?.getTime?.() || 0;
    const secondTime = second.submittedAt?.toDate?.()?.getTime?.() || 0;
    return secondTime - firstTime;
  });
}

export function ReviewDraftsPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [submittedDrafts, setSubmittedDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!db) {
      setErrorMessage('Firebase is not configured, so draft review is unavailable.');
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    setErrorMessage('');

    const q = query(collection(db, 'drafts'), where('status', '==', 'submitted'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const drafts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSubmittedDrafts(sortDraftsBySubmittedAt(drafts));
        setIsLoading(false);
      },
      (error) => {
        console.error('Failed to load submitted drafts:', error);
        setErrorMessage('Could not load submitted drafts right now. Please try again.');
        setIsLoading(false);
      },
    );

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
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
        <CircularProgress size={28} />
        <Typography color="text.secondary">Loading submitted drafts...</Typography>
      </Stack>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Review Drafts
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {!errorMessage && submittedDrafts.length === 0 ? (
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
              <ListItem
                sx={{
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}
              >
                <ListItemText
                  primary={draft.title || 'Untitled'}
                  secondary={
                    <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
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
                  sx={{ ml: { sm: 2 }, alignSelf: { xs: 'stretch', sm: 'center' } }}
                  onClick={() => setSelectedDraft(draft)}
                >
                  Review
                </Button>
              </ListItem>
            </Card>
          ))}
        </List>
      )}

      <Dialog
        open={!!selectedDraft}
        onClose={() => setSelectedDraft(null)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
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
        <DialogActions sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1, p: 2 }}>
          <Button onClick={() => setSelectedDraft(null)}>Cancel</Button>
          <Button
            onClick={() => setShowRejectDialog(true)}
            color="error"
            fullWidth={isMobile}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleApprove(selectedDraft)}
            variant="contained"
            color="success"
            fullWidth={isMobile}
          >
            Approve & Publish
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)} fullScreen={isMobile}>
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
        <DialogActions sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1, p: 2 }}>
          <Button onClick={() => setShowRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleReject} color="error" variant="contained" fullWidth={isMobile}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
