import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Button } from '@mui/material';
import { useNotify } from '../contexts/NotificationContext';

export function SharePostButton({ title, url = typeof window !== 'undefined' ? window.location.href : '', image = '' }) {
  const { notify } = useNotify();

  async function handleShare() {
    try {
      if (navigator.share) {
        // Prepare base share data
        let shareData = {
          title,
          text: `Read this post: ${title}`,
          url,
        };

        let file = null;

        // Try to fetch and prepare image if available
        if (image) {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            file = new File([blob], 'post-image.jpg', { type: blob.type });
          } catch (err) {
            console.warn('Could not fetch image for sharing:', err);
          }
        }

        // Strategy: Try different share combinations based on browser support
        let shared = false;

        // Try 1: Share with all data (title, text, url, files)
        if (file && navigator.canShare) {
          try {
            const fullShare = { ...shareData, files: [file] };
            if (navigator.canShare(fullShare)) {
              await navigator.share(fullShare);
              shared = true;
            }
          } catch (err) {
            console.warn('Full share with image failed:', err);
          }
        }

        // Try 2: If full share didn't work, try with files only
        if (!shared && file && navigator.canShare) {
          try {
            const filesOnly = { files: [file] };
            if (navigator.canShare(filesOnly)) {
              await navigator.share(filesOnly);
              shared = true;
            }
          } catch (err) {
            console.warn('Files-only share failed:', err);
          }
        }

        // Try 3: Fall back to text + url without files
        if (!shared) {
          try {
            await navigator.share(shareData);
            shared = true;
          } catch (err) {
            console.warn('Text share failed:', err);
          }
        }

        if (shared) {
          return;
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
