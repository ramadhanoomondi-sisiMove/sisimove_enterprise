//src/app/authenticated/journeys/create/page.ts

'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Entry
// -----------------------------------------------------------------------------
//
// Entry point for the authenticated Journey creation workflow.
//
// This page creates the Journey draft exactly once for the current creation
// attempt and then redirects to the first creation step.
//
// IMPORTANT
// ---------
// React lifecycle guards such as useRef are NOT the source of idempotency.
//
// A client-generated idempotency key is persisted in sessionStorage so that
// the same browser tab reuses the same creation key across remounts.
//
// True idempotency remains a backend responsibility.
//
// The backend must treat:
//
//     idempotencyKey
//
// as the identity of the create request and return the previously-created
// Journey when the same key is submitted again.
//
// Responsibilities:
// - obtain a stable creation idempotency key;
// - create the Journey draft;
// - redirect to the route step;
// - present an actionable mutation failure.
//
// Route-level loading and unexpected errors are delegated to:
//
//     loading.tsx
//     error.tsx
//
// This page intentionally does NOT:
// - collect Journey details;
// - manage route/schedule/vehicle/capacity/pricing/preferences state;
// - attach Journey children;
// - publish the Journey;
// - supply provider/member/identity IDs.
//
// -----------------------------------------------------------------------------

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

// -----------------------------------------------------------------------------
// Journey feature
// -----------------------------------------------------------------------------

import { useCreateJourney } from '@/features/journey/hooks';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { normalizeError } from '@/foundation/errors';

// -----------------------------------------------------------------------------
// Routing
// -----------------------------------------------------------------------------

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui/button';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CREATION_IDEMPOTENCY_STORAGE_KEY =
  'sisiMove.journeys.create.idempotency-key';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getOrCreateIdempotencyKey(): string {
  const existingKey =
    window.sessionStorage.getItem(
      CREATION_IDEMPOTENCY_STORAGE_KEY,
    );

  if (existingKey) {
    return existingKey;
  }

  const newKey = crypto.randomUUID();

  window.sessionStorage.setItem(
    CREATION_IDEMPOTENCY_STORAGE_KEY,
    newKey,
  );

  return newKey;
}

function clearIdempotencyKey(): void {
  window.sessionStorage.removeItem(
    CREATION_IDEMPOTENCY_STORAGE_KEY,
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function JourneyCreatePage() {
  const router = useRouter();

  const createJourney = useCreateJourney();

  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Local lifecycle guard
  // ---------------------------------------------------------------------------
  //
  // This prevents multiple creation calls from the same mounted component.
  //
  // IMPORTANT:
  // This is NOT the idempotency mechanism.
  //
  // sessionStorage + backend idempotency remain the actual protection against
  // duplicate Journey creation across remounts/retries.
  // ---------------------------------------------------------------------------

  const creationStartedRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Create draft
  // ---------------------------------------------------------------------------
  //
  // Notice that this function does not synchronously call setState before the
  // asynchronous operation begins.
  //
  // This avoids the React "setState synchronously within an effect" warning
  // when the initial creation is started from useEffect().
  // ---------------------------------------------------------------------------

  async function createDraft(): Promise<void> {
    try {
      const idempotencyKey =
        getOrCreateIdempotencyKey();

      const journey =
        await createJourney.mutateAsync({
          idempotencyKey,
        });

      // The Journey now exists and its public ID is authoritative for the
      // remainder of the creation workflow.
      //
      // The key can only be removed after successful creation.
      clearIdempotencyKey();

      router.replace(
        AUTHENTICATED_ROUTES.JOURNEY_CREATE_ROUTE(
          journey.publicId,
        ),
      );
    } catch (creationError: unknown) {
      const normalizedError =
        normalizeError(creationError);

      setError(normalizedError.message);
    }
  }

  // ---------------------------------------------------------------------------
  // Initial creation
  // ---------------------------------------------------------------------------
  //
  // The initial creation attempt is started once for this mounted page.
  //
  // React Strict Mode may exercise the effect lifecycle more than once during
  // development. The local ref prevents duplicate calls from this mounted
  // instance, while sessionStorage + backend idempotency protect the request
  // across remounts and ambiguous network failures.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (creationStartedRef.current) {
      return;
    }

    creationStartedRef.current = true;

    void createDraft();

    // createDraft intentionally reads the latest mutation/router instances
    // from this mounted page lifecycle.
    //
    // The creation itself is protected by the persisted idempotency key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Retry
  // ---------------------------------------------------------------------------
  //
  // Retry deliberately reuses the existing idempotency key.
  //
  // If the original request reached the server but the response was lost,
  // retrying with a new key could create a second Journey.
  //
  // Reusing the existing key allows the backend to return the original
  // Journey.
  // ---------------------------------------------------------------------------

  function handleRetry(): void {
    if (createJourney.isPending) {
      return;
    }

    setError(null);

    void createDraft();
  }

  // ---------------------------------------------------------------------------
  // Mutation failure
  // ---------------------------------------------------------------------------
  //
  // This is an expected application-level mutation failure.
  //
  // It is intentionally different from error.tsx:
  //
  //     page.tsx
  //         Known create-mutation failure + retry.
  //
  //     error.tsx
  //         Unexpected error thrown by the route tree.
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <section
            aria-labelledby="journey-create-error-title"
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
          >
            <h1
              id="journey-create-error-title"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              We could not start your journey
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              Your journey draft could not be started. You can safely try
              again without creating another Journey.
            </p>

            <p
              role="alert"
              className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3 text-sm text-[var(--foreground)]"
            >
              {error}
            </p>

            <div className="mt-5">
              <Button
                type="button"
                onClick={handleRetry}
                disabled={createJourney.isPending}
              >
                {createJourney.isPending
                  ? 'Trying again…'
                  : 'Try again'}
              </Button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Creation/loading state
  // ---------------------------------------------------------------------------
  //
  // The actual route transition is handled by router.replace().
  //
  // loading.tsx owns Next.js route-level loading UI. This fallback simply keeps
  // the entry page non-empty while the client mutation is in progress.
  // ---------------------------------------------------------------------------

  return (
    <main
      aria-busy="true"
      aria-label="Starting journey"
      className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <div
          className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]"
          aria-hidden="true"
        />

        <h1 className="text-lg font-semibold text-[var(--foreground)]">
          Starting your journey
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
          We are preparing your journey draft. You will choose the route,
          schedule, vehicle, seats, pricing, and preferences next.
        </p>
      </div>
    </main>
  );
}

