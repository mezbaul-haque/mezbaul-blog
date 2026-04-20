import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { collection, doc, addDoc, updateDoc, onSnapshot, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function DraftEditorPage() {
  const { draftId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isNew = !draftId;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [thumbImage, setThumbImage] = useState('');
  const [intro, setIntro] = useState('');
  const [sections, setSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('draft');
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!isNew && draftId) {
      const unsubscribe = onSnapshot(doc(db, 'drafts', draftId), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTitle(data.title || '');
          setCategory(data.category || '');
          setSummary(data.summary || '');
          setHeroImage(data.heroImage || '');
          setThumbImage(data.thumbImage || '');
          setIntro(data.intro || '');
          setSections(data.sections || []);
          setStatus(data.status || 'draft');
          setRelated(data.related || []);
        }
      });
      return unsubscribe;
    }
  }, [draftId, isNew]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), where('status', '==', 'published'));
      const snapshot = await getDocs(q);
      setPublishedPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchPosts();
  }, []);

  async function handleImageUpload(e, field) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      if (field === 'hero') {
        setHeroImage(url);
      } else {
        setThumbImage(url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }

  function addSection() {
    setSections([...sections, { heading: '', paragraphs: [''] }]);
  }

  function updateSection(index, field, value) {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  }

  function updateParagraph(sectionIndex, paragraphIndex, value) {
    const updated = [...sections];
    updated[sectionIndex].paragraphs[paragraphIndex] = value;
    setSections(updated);
  }

  function addParagraph(sectionIndex) {
    const updated = [...sections];
    updated[sectionIndex].paragraphs.push('');
    setSections(updated);
  }

  function removeSection(index) {
    setSections(sections.filter((_, i) => i !== index));
  }

  async function handleSave(saveAsDraft = true) {
    if (!user) return;
    setIsSaving(true);

    const draftData = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      summary,
      heroImage,
      thumbImage,
      intro,
      sections,
      related,
      authorId: user.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isNew) {
        draftData.status = 'draft';
        draftData.createdAt = serverTimestamp();
        const draftRef = await addDoc(collection(db, 'drafts'), draftData);
        navigate(`/dashboard/drafts/${draftRef.id}/edit`);
        return draftRef.id;
      } else {
        if (saveAsDraft && status === 'submitted') {
          draftData.status = 'draft';
        }
        await updateDoc(doc(db, 'drafts', draftId), draftData);
        return draftId;
      }
    } catch (err) {
      console.error('Save failed:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmitForReview() {
    const resolvedDraftId = draftId || (await handleSave(false));
    if (!resolvedDraftId) return;

    try {
      await updateDoc(doc(db, 'drafts', resolvedDraftId), {
        status: 'submitted',
        submittedAt: serverTimestamp(),
      });
      setStatus('submitted');
    } catch (err) {
      console.error('Submit failed:', err);
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          {isNew ? 'New Draft' : 'Edit Draft'}
        </Typography>
        <Chip label={status} color={status === 'submitted' ? 'primary' : 'default'} />
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              placeholder="e.g., Web, Design, Technology"
            />

            <TextField
              label="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Hero Image</Typography>
                <Button component="label" variant="outlined">
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero')}
                  />
                </Button>
                {heroImage && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Image uploaded
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Thumbnail</Typography>
                <Button component="label" variant="outlined">
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'thumb')}
                  />
                </Button>
              </Box>
            </Stack>

            <TextField
              label="Introduction"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>Sections</Typography>

      {sections.map((section, sIndex) => (
        <Card key={sIndex} sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Section {sIndex + 1}</Typography>
              <IconButton onClick={() => removeSection(sIndex)} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>

            <TextField
              label="Heading (optional)"
              value={section.heading}
              onChange={(e) => updateSection(sIndex, 'heading', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            {section.paragraphs.map((para, pIndex) => (
              <TextField
                key={pIndex}
                label={`Paragraph ${pIndex + 1}`}
                value={para}
                onChange={(e) => updateParagraph(sIndex, pIndex, e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            ))}

            <Button
              size="small"
              onClick={() => addParagraph(sIndex)}
              startIcon={<AddIcon />}
            >
              Add Paragraph
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outlined"
        onClick={addSection}
        startIcon={<AddIcon />}
        sx={{ mb: 3 }}
      >
        Add Section
      </Button>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => handleSave(true)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>

        {!isNew && status !== 'submitted' && (
          <Button
            variant="contained"
            onClick={handleSubmitForReview}
            disabled={isSaving || !title}
          >
            Submit for Review
          </Button>
        )}
      </Stack>
    </Box>
  );
}
