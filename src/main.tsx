import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app.js';

import './index.css';

createRoot(document.querySelector('#root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
