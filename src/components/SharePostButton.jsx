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

        // Add image if available and if the browser supports it
        if (image && navigator.canShare) {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            const file = new File([blob], 'post-image.jpg', { type: blob.type });
            
            if (navigator.canShare({ files: [file] })) {
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
