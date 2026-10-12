import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

// Public pages
import { Cover } from './pages/Cover';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

// Layout
import { AppShell } from './components/layout/AppShell';

// Console pages
import { Overview } from './pages/Overview';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { Artists } from './pages/Artists';
import { ArtistDetail } from './pages/ArtistDetail';
import { Review } from './pages/Review';
import { Outreach } from './pages/Outreach';
import { Jobs } from './pages/Jobs';
import { Suppression } from './pages/Suppression';
import { Sources } from './pages/Sources';
import { Settings } from './pages/Settings';
import { System } from './pages/System';
import { Plan } from './pages/Plan';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Route guard for /app/*
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const session = useAppStore(state => state.session);

  if (!session.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Cover />} />
        <Route path="/login" element={<Login />} />

        {/* Guarded Console Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route path="artists" element={<Artists />} />
          <Route path="artists/:id" element={<ArtistDetail />} />
          <Route path="review" element={<Review />} />
          <Route path="outreach" element={<Outreach />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="suppression" element={<Suppression />} />
          <Route path="sources" element={<Sources />} />
          <Route path="settings" element={<Settings />} />
          <Route path="system" element={<System />} />
          <Route path="plan" element={<Plan />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
