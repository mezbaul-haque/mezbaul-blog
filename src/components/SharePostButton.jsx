import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Button } from '@mui/material';
import { useNotify } from '../contexts/NotificationContext';

export function SharePostButton({ title, url = typeof window !== 'undefined' ? window.location.href : '' }) {
  const { notify } = useNotify();

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Read this post: ${title}`,
          url,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        notify('Link copied. Share it anywhere you like.', 'success');
        return;
      }

      notify('Sharing is not available on this device.', 'warning');
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      notify('Could not share this post right now.', 'error');
    }
  }

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<ShareOutlinedIcon />}
      onClick={handleShare}
    >
      Share
    </Button>
  );
}
