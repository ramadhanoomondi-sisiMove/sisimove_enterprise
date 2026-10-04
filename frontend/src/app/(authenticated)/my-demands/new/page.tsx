// -----------------------------------------------------------------------------
// sisiMove — New Journey Demand Page
// -----------------------------------------------------------------------------
//
// Authenticated entry point for creating a new Journey Demand.
//
// Flow:
//
//     /my-demands/new
//           |
//           | create aggregate
//           v
//     Journey Demand DRAFT
//           |
//           | receive publicId
//           v
//     /my-demands/[publicId]/edit
//
// The edit surface then allows the requester to configure the Journey Demand
// and eventually publish it.
//
// -----------------------------------------------------------------------------

'use client';

import { useRouter } from 'next/navigation';

import { JourneyDemandCreateForm } from '@/components/journey-demand/create';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function NewJourneyDemandPage() {
  const router = useRouter();

  return (
    <JourneyDemandCreateForm
      onCreated={(publicId) => {
        router.push(
          AUTHENTICATED_ROUTES.MY_DEMAND_EDIT(publicId),
        );
      }}
    />
  );
}
