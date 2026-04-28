# Eubello

A professional blogging platform designed for writers and content creators, featuring a robust draft management system and writer approval workflow.

## 🚀 Features

- **Writer Onboarding**: Specialized registration and profile management for writers.
- **Draft Management**: Full editor for creating and managing post drafts.
- **Review Workflow**: Admin panel for reviewing, approving, and managing published posts.
- **Engagement**: Reader features including likes, follows, and real-time counts.
- **Writer Directory**: A dedicated page to explore and discover contributing writers.
- **Responsive Design**: Built with Material UI for a seamless experience across devices.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Material UI (MUI)
- **Backend/Database**: Firebase (Firestore, Auth, Storage)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Deployment**: GitHub Pages (via GitHub Actions)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v24 recommended)
- A Firebase Project

### Local Development
1. **Clone the repository**:
   ```bash
   git clone <<repositoryrepository-url>
   cd mezbaul-blog
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🚢 Deployment

The project is configured for automatic deployment to GitHub Pages.
- Pushing to the `main` branch triggers the `.github/workflows/deploy.yml` workflow.
- Ensure that the required Firebase secrets are configured in your GitHub repository settings.

## 📂 Project Structure

- `src/pages`: Contains all page components (Admin, Dashboard, and Public views).
- `src/services`: Core logic for Firebase and engagement tracking.
- `public`: Static assets.
- `posts`: Local post data/templates.
