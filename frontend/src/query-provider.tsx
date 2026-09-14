//src/query-provider.tsx
// -----------------------------------------------------------------------------
// sisiMove — Query Provider
// -----------------------------------------------------------------------------
//
// Application-level provider for TanStack Query.
//
// Responsibilities:
// - Create and own the application's QueryClient.
// - Provide the QueryClient to the React component tree.
// - Keep query configuration centralized at the provider boundary.
//
// This provider does NOT:
// - fetch application data;
// - define feature queries;
// - contain marketplace logic;
// - contain authentication logic;
// - contain API clients;
// - contain domain state;
// - replace the existing foundation HTTP layer.
//
// Feature-level hooks remain responsible for defining their own queries.
// The provider only supplies the shared TanStack Query runtime.
//
// -----------------------------------------------------------------------------
// Architecture
// -----------------------------------------------------------------------------
//
// App
//   │
//   ▼
// QueryProvider
//   │
//   ▼
// QueryClientProvider
//   │
//   ├── Public Marketplace
//   ├── Journeys
//   ├── Journey Demands
//   ├── Traveller Profiles
//   ├── Trust
//   └── Assets
//
// -----------------------------------------------------------------------------
//

'use client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { useState, type ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface QueryProviderProps {
  children: ReactNode;
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

export function QueryProvider({
  children,
}: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}