import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Button } from '@mui/material';
import { useNotify } from '../contexts/NotificationContext';

export function SharePostButton({ title, url = typeof window !== 'undefined' ? window.location.href : '', image = '' }) {
  const { notify } = useNotify();

  async function handleShare() {
    try {
      if (navigator.share) {
        const shareData = {
          title,
          text: `Read this post: ${title}`,
          url,
        };

        // Try to add image if available
        if (image) {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            const file = new File([blob], 'post-image.jpg', { type: blob.type });
            
            // Check if canShare is available and supports files
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          } catch (err) {
            // If image fetch fails, continue with text share
            console.warn('Could not fetch image for sharing:', err);
          }
        }

        await navigator.share(shareData);
        return;
      }

      // Fallback: copy URL to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
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
