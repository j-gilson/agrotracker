import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AppRoutes } from '../src/core/routes/AppRoutes';
import { SnackbarProvider, Loading } from '../src/presentation/components';
import { AuthProvider, useAuthSession } from '../src/presentation/contexts/AuthContext';
import { ActiveFarmProvider } from '../src/presentation/contexts/ActiveFarmContext';

const queryClient = new QueryClient();

const AuthGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const segments = useSegments();
  const { status } = useAuthSession();

  useEffect(() => {
    if (status === 'loading') return;

    const inAuthFlow = segments[0] === 'auth';

    if (status === 'unauthenticated' && !inAuthFlow) {
      router.replace({ pathname: AppRoutes.AUTH });
      return;
    }

    if (status === 'authenticated' && inAuthFlow) {
      router.replace({ pathname: AppRoutes.HOME });
    }
  }, [router, segments, status]);

  if (status === 'loading') {
    return <Loading text="Carregando..." />;
  }

  return <>{children}</>;
};

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ActiveFarmProvider>
          <SnackbarProvider>
            <AuthGate>
              <Stack />
            </AuthGate>
          </SnackbarProvider>
        </ActiveFarmProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
