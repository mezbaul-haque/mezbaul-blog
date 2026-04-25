import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToComments, addComment, updateComment, deleteComment } from '../../services/engagement';

export function Comments({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = subscribeToComments(postId, setComments);
    return unsubscribe;
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, user.uid, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await updateComment(commentId, user.uid, content);
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
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
