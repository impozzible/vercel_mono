import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Route, Routes } from 'react-router-dom';
import { AuthenticationGuard } from './components/authentication-guard';
import { PageLoader } from './components/page-loader';
import { ProfilePage } from './pages/profile-page';
import { PublicPage } from './pages/public-page';
import { ProtectedPage } from './pages/protected-page';
import { PageLayout } from './components/page-layout';
import './App.css';

// Placeholder components for the routes
const HomePage: React.FC = () => (
  <PageLayout>
    <h1>Home Page</h1>
  </PageLayout>
);
const AdminPage: React.FC = () => (
  <PageLayout>
    <h1>Admin Page</h1>
  </PageLayout>
);
const CallbackPage: React.FC = () => (
  <PageLayout>
    <h1>Callback Page</h1>
  </PageLayout>
);
const NotFoundPage: React.FC = () => (
  <PageLayout>
    <h1>404: Not Found</h1>
  </PageLayout>
);

const App: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/profile"
          element={<AuthenticationGuard component={ProfilePage} />}
        />
        <Route path="/public" element={<PublicPage />} />
        <Route
          path="/protected"
          element={<AuthenticationGuard component={ProtectedPage} />}
        />
        <Route
          path="/admin"
          element={<AuthenticationGuard component={AdminPage} />}
        />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
