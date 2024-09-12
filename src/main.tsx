import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './globals.css';
import { Provider } from 'react-redux';
import { store } from './store.ts';
import { router } from "./router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={ store }>
      <RouterProvider router={ router } />
    </Provider>
  </StrictMode>,
)
