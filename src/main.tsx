import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { router } from './router';
import { ThemeProvider } from './theme/ThemeProvider.tsx';
import './globals.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    defaultTheme="dark"
    storageKey="vite-ui-theme"
  >
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
);
