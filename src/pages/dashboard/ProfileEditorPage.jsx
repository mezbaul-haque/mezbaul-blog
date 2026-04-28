import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function ProfileEditorPage() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setTitle(userProfile.title || '');
      setBio(userProfile.bio || '');
      setWebsite(userProfile.website || '');
      setTwitter(userProfile.twitter || '');
      setAvatar(userProfile.avatar || '');
      setCoverPhoto(userProfile.coverPhoto || '');
    }
  }, [userProfile]);

  async function handleImageUpload(e, field) {
    const file = e.target.files?.[0];
    if (!file || !user || !storage) return;

    try {
      const storageRef = ref(storage, `${field}/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (field === 'avatars') {
        setAvatar(url);
      } else {
        setCoverPhoto(url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }

  async function handleSave() {
    if (!user || !db) return;
    setIsSaving(true);
    setMessage('');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name,
        title,
        bio,
        website,
        twitter,
        avatar,
        coverPhoto,
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      {!db && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Firebase is not configured, so profile editing is unavailable.
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary">
        Approval status: {userProfile?.approvalStatus || 'pending'}
        {userProfile?.isProfileVisible ? ' • visible on Writers page' : ' • hidden from Writers page'}
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={avatar}
                sx={{ width: 80, height: 80 }}
              />
              <IconButton component="label">
                <PhotoCamera />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'avatars')}
                  disabled={!storage}
                />
              </IconButton>
            </Box>

            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              disabled={!db}
            />

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder="Writer, designer, and systems thinker"
              disabled={!db}
            />

            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="A short bio about yourself"
              disabled={!db}
            />

            <TextField
              label="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              fullWidth
              placeholder="https://yourwebsite.com"
              disabled={!db}
            />

            <TextField
              label="Twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              fullWidth
              placeholder="https://twitter.com/username"
              disabled={!db}
            />

            {message && (
              <Typography
                color={message.includes('success') ? 'success.main' : 'error.main'}
              >
                {message}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isSaving || !db}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
