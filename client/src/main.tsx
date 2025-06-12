import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from './contexts/AuthProvider.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';
const queryClient = new QueryClient({
  defaultOptions: {},
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster />
        <AuthProvider>
          <App />
        </AuthProvider>
        <ReactQueryDevtools />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
