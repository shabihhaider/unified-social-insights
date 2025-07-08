import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // ✅
import { ThemeProvider } from './context/ThemeContext'; // ✅ Theme Context

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// ✅ PWA: Register service worker
serviceWorkerRegistration.register();

// Optional: Report web vitals
reportWebVitals();
