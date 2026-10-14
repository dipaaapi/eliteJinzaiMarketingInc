import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import './portal.css';
import './help.css';
import { RequireAuth } from './auth/AuthProvider';
import { AppLayout, PublicLayout } from './components/Layouts';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import JobsPage from './pages/portal/JobsPage';
import ApplicationsPage from './pages/portal/ApplicationsPage';
import RequestsPage from './pages/portal/RequestsPage';
import DeploymentsPage from './pages/portal/DeploymentsPage';
import GuidePage from './pages/portal/GuidePage';
import HelpPage from './pages/HelpPage';
import ScrollManager from './components/ScrollManager';
import ScrollTopButton from './components/ScrollTopButton';

function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/help" element={<HelpPage />} />
          {/* Old addresses now open the combined account page. */}
          <Route path="/login" element={<Navigate to="/account" replace />} />
          <Route path="/register" element={<Navigate to="/account?mode=register" replace />} />
          <Route path="/settings" element={<Navigate to="/account" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/deployments" element={<DeploymentsPage />} />
          <Route path="/guide" element={<GuidePage />} />
        </Route>
      </Routes>
      <ScrollTopButton />
    </>
  );
}

export default App;
