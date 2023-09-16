import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { SocketProvider } from './MyContext';
import { MyProvider } from './alertContext';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
    <MyProvider>
      <App />
    </MyProvider>
  </SocketProvider>,
);
