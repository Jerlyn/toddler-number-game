import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Handle GitHub Pages path issues
if (process.env.NODE_ENV === 'production') {
  // Remove trailing slash for consistency
  const path = window.location.pathname.replace(/\/$/, '');
  
  // If we're on a "not found" page, redirect to the root
  if (path.indexOf('/toddler-number-game') !== 0) {
    window.location.href = '/toddler-number-game/';
  }
}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
