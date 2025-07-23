import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './styles/theme.scss';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
