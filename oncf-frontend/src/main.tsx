// root.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import your App component
import './app.css';
import './index.css'; // This is fine if you have both CSS files

const rootElement = document.getElementById('root');

// Add this null check
if (!rootElement) {
  throw new Error('Root element not found');
}

// Now TypeScript knows rootElement is not null
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App /> {/* Render the App component */}
  </React.StrictMode>
);