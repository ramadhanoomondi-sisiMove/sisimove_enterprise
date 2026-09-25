'use client';

// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand Entry
// -----------------------------------------------------------------------------
//
// Creation entry point for the Journey Demand wizard.
//
// Flow:
//
//   /journey-demands/create
//        |
//        | create server-side DRAFT
//        v
//   /journey-demands/create/:journeyDemandPublicId/route
//
// Important:
// - The server creates the Journey Demand as DRAFT.
// - requester identity is derived by the backend from the authenticated
//   session/JWT.
// - This page must not ask the client for requesterPublicId.
// - A successful creation redirects to the first wizard step.
// - The page does not render the wizard itself because there is no aggregate
//   public ID until the draft has been created.
// -----------------------------------------------------------------------------

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { ErrorState, Spinner } from '@/components/ui';
import { useCreateJourneyDemand } from '@/features/journey-demand/hooks';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export default function CreateJourneyDemandPage() {
  const router = useRouter();

  const createJourneyDemand = useCreateJourneyDemand();
  const hasStartedCreation = useRef(false);

  useEffect(() => {
    if (hasStartedCreation.current) {
      return;
    }

    hasStartedCreation.current = true;

    void createJourneyDemand.mutateAsync({}).then((journeyDemand) => {
      router.replace(
        AUTHENTICATED_ROUTES.JOURNEY_DEMAND_CREATE_ROUTE(
          journeyDemand.publicId,
        ),
      );
    });
  }, [createJourneyDemand, router]);

  if (createJourneyDemand.isError) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <section className="section">
            <ErrorState
              title="Unable to start your journey demand"
              description="We could not create the draft needed to begin your journey demand. Please try again."
              onRetry={() => {
                hasStartedCreation.current = false;
                createJourneyDemand.reset();
              }}
            />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <Spinner size="md" />

            <h1 className="mt-4 text-lg font-semibold text-slate-900">
              Starting your journey demand
            </h1>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              We are preparing your draft. You will be able to add your
              route, schedule, seats, and pricing next.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}