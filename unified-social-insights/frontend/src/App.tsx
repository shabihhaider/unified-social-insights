import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import PrivateRoute from './components/PrivateRoute';
import OAuthSuccess from './pages/OAuthSuccess';
import InstagramInsights from './pages/InstagramInsights';
import GenerateInsights from './components/GenerateInsights';
import SelectPage from './pages/SelectPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Temporary test route to view AI output */}
          <Route path="/" element={<GenerateInsights />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/instagram-insights" element={<InstagramInsights />} />
          <Route path="/select-page" element={<SelectPage />} />
          
          {/* Commented until pages exist */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
          {/* <Route path="/oauth-success" element={<OAuthSuccess />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
