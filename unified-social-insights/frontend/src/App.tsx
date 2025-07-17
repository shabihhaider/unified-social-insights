import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthSuccess from './pages/OAuthSuccess';
import InstagramInsights from './pages/InstagramInsights';
import GenerateInsights from './components/GenerateInsights';
import SelectPage from './pages/dashboard/SelectPage';
import LandingPage from './pages/LandingPage';
import { ThemeToggle } from './components/ThemeToggle';
import RequireAuth from './routes/RequireAuth';
import DashboardShell from './layout/DashboardShell';
import Overview from './pages/dashboard/Overview';
import Insights from './pages/dashboard/Insights';
import RequireRole from './routes/RequireRole';
import Pricing from './pages/Pricing';
import Onboarding from './pages/Onboarding';
import ManageAccounts from './pages/ManageAccounts';
import Analytics from './pages/dashboard/Analytics';
import Reports from './pages/dashboard/Reports';
import Accounts from './pages/dashboard/Accounts';
import Settings from './pages/dashboard/Settings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-success" element={<OAuthSuccess />} />
            <Route path="/select-page" element={<SelectPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
            <Route path="/manage-accounts" element={<ManageAccounts />} />


            {/* Protected Dashboard Layout */}
            <Route
              path="/dashboard/*"
              element={
                <RequireAuth>
                  <DashboardShell />
                </RequireAuth>
              }
            >
              <Route path="overview" element={<Overview />} />
              <Route
                path="insights"
                element={
                  <RequireRole required="pro">
                    <Insights />
                  </RequireRole>
                }
              />
              <Route path="select-page" element={<SelectPage />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="settings" element={<Settings />} />
              <Route index element={<Navigate to="overview" replace />} />
            </Route>

            {/* Other Protected Routes */}
            <Route
              path="/instagram-insights"
              element={
                <RequireAuth>
                  <InstagramInsights />
                </RequireAuth>
              }
            />
            <Route
              path="/generate-insights"
              element={
                <RequireAuth>
                  <GenerateInsights />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
