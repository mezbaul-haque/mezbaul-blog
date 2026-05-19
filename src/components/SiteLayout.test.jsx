import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SiteLayout } from './SiteLayout';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isAdmin: false,
    canWritePosts: false,
    currentRole: null,
    userProfile: null,
    logOut: vi.fn(),
  }),
}));

function CurrentPath() {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
}

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="*"
          element={
            <SiteLayout>
              <CurrentPath />
            </SiteLayout>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SiteLayout', () => {
  it('closes the mobile navigation after selecting a route', async () => {
    const user = userEvent.setup();
    renderLayout();

    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    await user.click(menuButton);

    const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i });
    await user.click(within(mobileNav).getByRole('link', { name: /archive/i }));

    expect(screen.getByTestId('current-path')).toHaveTextContent('/archive');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
