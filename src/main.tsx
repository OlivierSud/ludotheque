import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from '@/App';
import '@/styles/tokens.css';
import '@/styles/app.css';

const container = document.getElementById('root');
if (container === null) throw new Error('Élément #root introuvable dans index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerSW({ immediate: true });
