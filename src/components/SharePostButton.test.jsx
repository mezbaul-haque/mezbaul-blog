import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationListener } from './NotificationListener';
import { SharePostButton } from './SharePostButton';
import { NotificationProvider } from '../contexts/NotificationContext';

describe('SharePostButton', () => {
  const originalShare = navigator.share;
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: originalShare,
    });

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    });
  });

  it('copies the post link when native share is unavailable', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <NotificationProvider>
        <SharePostButton title="Test post" url="https://example.com/posts/test-post" />
        <NotificationListener />
      </NotificationProvider>,
    );

    await user.click(screen.getByRole('button', { name: /share/i }));

    expect(writeText).toHaveBeenCalledWith('https://example.com/posts/test-post');
    expect(screen.getByText(/link copied\. share it anywhere you like\./i)).toBeInTheDocument();
  });
});
