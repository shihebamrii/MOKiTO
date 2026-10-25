import React from 'react';
import ReactDOM from 'react-dom/client';
import MokitoMenuApp from './mokito_qr_code_menu_brand_identity';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <MokitoMenuApp />
    </React.StrictMode>
  );
}
