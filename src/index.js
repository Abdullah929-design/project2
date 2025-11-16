import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import (React 18+)
import App from './App'; // Make sure './App' exists



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);