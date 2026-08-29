import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { seedDatabaseClient } from './firebase.ts';

// Seed initial Firebase database content on load if collections are empty
seedDatabaseClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
