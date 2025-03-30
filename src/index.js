import React from 'react';
import ReactDOM from 'react-dom/client';
import CalculatorApp from './App'; // Make sure App.jsx is in the same folder

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CalculatorApp />
  </React.StrictMode>
);
