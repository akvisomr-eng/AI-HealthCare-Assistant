import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from "./store/store";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <HelmetProvider>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </HelmetProvider>
);

serviceWorker.unregister();
reportWebVitals();
