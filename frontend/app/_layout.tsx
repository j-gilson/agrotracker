import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SnackbarProvider } from '../src/presentation/components';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <Stack />
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
