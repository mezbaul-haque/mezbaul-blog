import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { SiteLayout } from './components/SiteLayout';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationListener } from './components/NotificationListener';
import { addStructuredDataScript, generateOrganizationSchema, generateWebsiteSchema } from './services/structuredData';

const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const ArchivePage = lazy(() => import('./pages/ArchivePage').then((module) => ({ default: module.ArchivePage })));
const AuthorPage = lazy(() => import('./pages/AuthorPage').then((module) => ({ default: module.AuthorPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const PostPage = lazy(() => import('./pages/PostPage').then((module) => ({ default: module.PostPage })));
const WritersPage = lazy(() => import('./pages/WritersPage').then((module) => ({ default: module.WritersPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout').then((module) => ({ default: module.DashboardLayout })));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome').then((module) => ({ default: module.DashboardHome })));
const ProfileEditorPage = lazy(() => import('./pages/dashboard/ProfileEditorPage').then((module) => ({ default: module.ProfileEditorPage })));
const DraftListPage = lazy(() => import('./pages/dashboard/DraftListPage').then((module) => ({ default: module.DraftListPage })));
const DraftEditorPage = lazy(() => import('./pages/dashboard/DraftEditorPage').then((module) => ({ default: module.DraftEditorPage })));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((module) => ({ default: module.AdminLayout })));
const AdminHome = lazy(() => import('./pages/admin/AdminHome').then((module) => ({ default: module.AdminHome })));
const ReviewDraftsPage = lazy(() => import('./pages/admin/ReviewDraftsPage').then((module) => ({ default: module.ReviewDraftsPage })));
const ManageWritersPage = lazy(() => import('./pages/admin/ManageWritersPage').then((module) => ({ default: module.ManageWritersPage })));
const ManagePostsPage = lazy(() => import('./pages/admin/ManagePostsPage').then((module) => ({ default: module.ManagePostsPage })));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute').then((module) => ({ default: module.ProtectedRoute })));
const AdminRoute = lazy(() => import('./components/auth/AdminRoute').then((module) => ({ default: module.AdminRoute })));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

function RouteLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  // Add structured data for SEO on mount
  useEffect(() => {
    // Add organization schema
    addStructuredDataScript(generateOrganizationSchema());
    
    // Add website schema
    addStructuredDataScript(generateWebsiteSchema());
  }, []);

  return (
    <NotificationProvider>
      <NotificationListener />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Public routes wrapped in SiteLayout */}
          <Route
            path="/*"
            element={
              <SiteLayout>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/archive" element={<ArchivePage />} />
                  <Route path="/writers" element={<WritersPage />} />
                  <Route path="/writers/:authorId" element={<AuthorPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/posts/:slug" element={<PostPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </SiteLayout>
            }
          />

          {/* Writer dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfileEditorPage />} />
            <Route path="drafts" element={<DraftListPage />} />
            <Route path="drafts/new" element={<DraftEditorPage />} />
            <Route path="drafts/:draftId/edit" element={<DraftEditorPage />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="review" element={<ReviewDraftsPage />} />
            <Route path="writers" element={<ManageWritersPage />} />
            <Route path="posts" element={<ManagePostsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </NotificationProvider>
  );
}
