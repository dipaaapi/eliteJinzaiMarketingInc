import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { LanguageProvider } from './i18n';
import { AuthProvider } from './auth/AuthProvider';
import { ThemeProvider } from './theme';
import { config } from './config';
import { seedJobs } from './data/db';
import { hasDemoData, loadDemoData } from './data/demoData';

seedJobs();
if (config.demoData && !hasDemoData()) loadDemoData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
