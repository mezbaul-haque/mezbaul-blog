import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotify } from '../../contexts/NotificationContext';
import { subscribeToComments, addComment, updateComment, deleteComment, fetchUserProfile } from '../../services/engagement';

export function Comments({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotify();
  const [comments, setComments] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = subscribeToComments(postId, setComments);
    return unsubscribe;
  }, [postId]);

  useEffect(() => {
    const fetchMissingProfiles = async () => {
      const uniqueUserIds = [...new Set(comments.map((c) => c.userId))];
      const missingIds = uniqueUserIds.filter((id) => !profiles[id]);

      if (missingIds.length === 0) return;

      const fetchedProfiles = {};
      await Promise.all(
        missingIds.map(async (id) => {
          const profile = await fetchUserProfile(id);
          if (profile) {
            fetchedProfiles[id] = profile;
          }
        })
      );
      setProfiles((currentProfiles) => ({ ...currentProfiles, ...fetchedProfiles }));
    };

    fetchMissingProfiles();
  }, [comments, profiles]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, user.uid, newComment.trim());
      setNewComment('');
    } catch {
      notify('Failed to post comment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await updateComment(commentId, user.uid, content);
      setEditingId(null);
      setEditContent('');
    } catch {
      notify('Failed to update comment. Please try again.', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch {
      notify('Failed to delete comment. Please try again.', 'error');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h2" sx={{ fontSize: '1.5rem', mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      {isAuthenticated ? (
        <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            sx={{ mb: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post comment'}
          </Button>
        </Box>
      ) : (
        <Card sx={{ p: 3, mb: 3, bgcolor: 'action.hover' }}>
          <Typography color="text.secondary">
            Sign in to join the conversation
          </Typography>
        </Card>
      )}

      <Stack spacing={2}>
        {comments.map((comment) => {
          const isOwner = comment.userId === user?.uid;
          const isEditing = editingId === comment.id;

          return (
            <Card key={comment.id} sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Avatar
                    src={profiles[comment.userId]?.avatar}
                    sx={{ width: 32, height: 32 }}
                  >
                    {profiles[comment.userId]?.name?.charAt(0) || '?'}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {profiles[comment.userId]?.name || 'Loading...'}
                  </Typography>
                </Stack>
                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      minRows={2}
                      autoFocus
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={() => handleEditComment(comment.id, editContent)}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography variant="body1">{comment.content}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                      {isOwner && (
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditContent(comment.content);
                            }}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteComment(comment.id)}
                            color="error"
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Stack>
                      )}
                    </Stack>
                  </>
                )}
              </Stack>
            </Card>
          );
        })}

        {comments.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No comments yet. Be the first to share your thoughts!
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
