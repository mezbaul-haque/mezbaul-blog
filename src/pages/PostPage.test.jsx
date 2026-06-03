import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PostPage } from './PostPage';

vi.mock('../services/content', () => ({
  usePublicContent: () => ({
    isLoading: false,
    authorsById: {},
    postsBySlug: {},
    posts: [
      {
        slug: 'partial-live-post',
        title: 'Partial live post',
        category: 'Notes',
        authorId: 'missing-author',
        authorName: 'Live Writer',
        intro: 'A post with incomplete live content.',
        date: 'June 3, 2026',
        readTime: '1 min read',
        heroImage: '',
        sections: [
          {
            heading: 'Still renders',
          },
        ],
        related: null,
      },
    ],
  }),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../components/engagement/LikeButton', () => ({
  LikeButton: () => <button type="button">Like</button>,
}));

vi.mock('../components/engagement/Comments', () => ({
  Comments: () => <section aria-label="comments" />,
}));

vi.mock('../components/SharePostButton', () => ({
  SharePostButton: () => <button type="button">Share</button>,
}));

vi.mock('../services/seo', () => ({
  updateOpenGraphMeta: vi.fn(),
  setCanonicalUrl: vi.fn(),
}));

vi.mock('../services/analytics', () => ({
  trackPostView: vi.fn(),
}));

vi.mock('../services/structuredData', () => ({
  addStructuredDataScript: vi.fn(() => vi.fn()),
  generateArticleSchema: vi.fn(() => ({})),
  generateBreadcrumbSchema: vi.fn(() => ({})),
}));

describe('PostPage', () => {
  it('renders a partial live post without optional media, related posts, or paragraphs', () => {
    render(
      <MemoryRouter initialEntries={['/posts/partial-live-post']}>
        <Routes>
          <Route path="/posts/:slug" element={<PostPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /partial live post/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /still renders/i })).toBeInTheDocument();
    expect(screen.getByText(/written by/i)).toBeInTheDocument();
  });
});
