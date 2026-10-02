////src/app/(authenticated)/my-journeys/[publicid]/page.tsx

// -----------------------------------------------------------------------------
// sisiMove — My Journey Page
// -----------------------------------------------------------------------------
//
// Authenticated management route for one owned Journey.
//
// Responsibilities:
// - establish the authenticated Journey management route;
// - read the Journey publicId route parameter;
// - compose the Journey management surface.
//
// Non-responsibilities:
// - no Journey fetching;
// - no Journey mutations;
// - no Journey lifecycle logic;
// - no Journey editing logic;
// - no recreation of Journey query behavior.
//
// JourneyManagement owns the authenticated Journey management experience.
// The route only establishes its URL boundary and passes the opaque publicId.
//
// -----------------------------------------------------------------------------

import { notFound } from "next/navigation";

import { JourneyManagementPanel } from "@/components/journey/manage";

// -----------------------------------------------------------------------------
// Route Props
// -----------------------------------------------------------------------------

interface MyJourneyPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function MyJourneyPage({
  params,
}: MyJourneyPageProps) {
  const { publicId } = await params;

  if (!publicId) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="page-container py-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <JourneyManagementPanel
            journeyPublicId={publicId}
          />
        </div>
      </div>
    </main>
  );
}

