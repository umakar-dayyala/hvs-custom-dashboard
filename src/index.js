import './public-path/Public-path';
//import reportWebVitals from "./reportWebVitals";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root = null;

// Qiankun lifecycle function: bootstrap
export async function bootstrap() {
  console.log('CBRN DashBoard app bootstrapped');
}

// Qiankun lifecycle function: mount
export async function mount(props) {
  import('@mui/material/styles');
  import('@hitachivantara/uikit-styles');
  console.log('CBRN DashBoard app mounted with props:', props);
  const container = props?.container 
    ? props.container.querySelector('#root')
    : document.getElementById('root');
  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App {...props} />
    </React.StrictMode>
  );
}

// Qiankun lifecycle function: unmount
export async function unmount(props) {
  console.log('CBRN DashBoard app unmounted');
  root?.unmount();
  root = null;
}

// Optional: for standalone development mode
if (!window.__POWERED_BY_QIANKUN__) {
  const container = document.getElementById('root');
  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
