import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Button } from '@mui/material';
import { useNotify } from '../contexts/NotificationContext';

export function SharePostButton({ title, url = typeof window !== 'undefined' ? window.location.href : '' }) {
  const { notify } = useNotify();

  async function handleShare() {
    try {
      if (navigator.share) {
        // Share only the URL, title, and text
        // The image will be picked up by Open Graph meta tags on social platforms
        const shareData = {
          title,
          text: `Read this post: ${title}`,
          url,
        };

        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err?.name === 'AbortError') {
            return;
          }
          console.warn('Share API failed:', err);
          // Continue to clipboard fallback
        }
      }

      // Fallback: copy URL to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        notify('Link copied. Share it anywhere you like.', 'success');
        return;
      }

      notify('Sharing is not available on this device.', 'warning');
    } catch (error) {
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
