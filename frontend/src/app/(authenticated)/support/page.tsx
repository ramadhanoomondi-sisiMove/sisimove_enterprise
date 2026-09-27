'use client';

// -----------------------------------------------------------------------------
// sisiMove — Support Page
// -----------------------------------------------------------------------------
//
// Authenticated Support landing surface.
//
// Responsibilities:
// - render the authenticated Support collection;
// - provide navigation to Support case creation;
// - keep route composition thin.
//
// Non-responsibilities:
// - authentication or session management;
// - Support API calls;
// - Support query-state management;
// - Support aggregate/domain orchestration;
// - internal Support notes;
// - assignment or participant administration;
// - resolution mutation;
// - referenced-domain fetching;
// - message composition for an existing case.
//
// Route:
//     /support
//
// Child routes:
//     /support/new
//     /support/cases/[supportCasePublicId]
// -----------------------------------------------------------------------------

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui';
import { SupportCaseList } from '@/components/support-case';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export default function SupportPage() {
  const router = useRouter();

  function handleCreateCase() {
    router.push(AUTHENTICATED_ROUTES.SUPPORT_NEW);
  }

  return (
    <main className="page-container py-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Support
            </h1>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              Get help with your SisiMove journeys, bookings, payments, and
              account.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleCreateCase}
          >
            New case
          </Button>
        </header>

        <SupportCaseList />
      </div>
    </main>
  );
}

