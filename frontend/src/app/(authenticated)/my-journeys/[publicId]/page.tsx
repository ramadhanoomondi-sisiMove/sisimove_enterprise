// -----------------------------------------------------------------------------
// sisiMove — My Journey Page
// -----------------------------------------------------------------------------
//
// Authenticated management route for one owned Journey.
//
// Responsibilities:
// - establish the authenticated Journey management route;
// - read the Journey publicId route parameter;
// - provide route-owned navigation actions for management acknowledgements;
// - compose the Journey management surface.
//
// Non-responsibilities:
// - no Journey fetching;
// - no Journey mutations;
// - no Journey lifecycle logic;
// - no Journey editing logic;
// - no recreation of Journey query behavior;
// - no success-modal state ownership.
//
// JourneyManagement owns the authenticated Journey management experience.
// The route establishes its URL boundary and provides navigation destinations.
//
// Navigation ownership:
//
//   MyJourneyPage
//       │
//       ├── View Journey Details
//       │       └── AUTHENTICATED_ROUTES.MY_JOURNEY(publicId)
//       │
//       └── Continue Editing
//               └── AUTHENTICATED_ROUTES.JOURNEY_CREATE(publicId)
//
// Both destinations remain inside the authenticated Journey namespace.
//
// The public marketplace Journey route is intentionally not used here.
// Public Journey discovery/navigation is owned by the public marketplace
// and landing-page experience.
//
// This keeps route construction and navigation at the page boundary while
// JourneyManagement remains responsible for the management workflow itself.
//
// -----------------------------------------------------------------------------

import Link from "next/link";
import { notFound } from "next/navigation";

import { JourneyManagementPanel } from "@/components/journey/manage";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing/authenticated-routes";

// =============================================================================
// Route Props
// =============================================================================

interface MyJourneyPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

// =============================================================================
// Publication Success Actions
// =============================================================================

interface PublicationSuccessActionsProps {
  readonly journeyPublicId: string;
}

function PublicationSuccessActions({
  journeyPublicId,
}: PublicationSuccessActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Link
        href={AUTHENTICATED_ROUTES.MY_JOURNEYS}
        className={[
          "inline-flex",
          "min-h-10",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-md)]",
          "border",
          "border-[var(--border)]",
          "px-4",
          "text-sm",
          "font-medium",
          "text-[var(--foreground)]",
          "transition-colors",
          "hover:bg-[var(--surface-muted)]",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--brand)]",
          "focus-visible:outline-offset-2",
        ].join(" ")}
      >
        View My Journeys
      </Link>

      <Link
        href={AUTHENTICATED_ROUTES.JOURNEY_CREATE(journeyPublicId)}
        className={[
          "inline-flex",
          "min-h-10",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-md)]",
          "bg-[var(--brand)]",
          "px-4",
          "text-sm",
          "font-medium",
          "text-[var(--brand-foreground)]",
          "transition-opacity",
          "hover:opacity-90",
          "focus-visible:outline-2",
          "focus-visible:outline-[var(--brand)]",
          "focus-visible:outline-offset-2",
        ].join(" ")}
      >
        Continue Editing
      </Link>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

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
            publicationSuccessActions={
              <PublicationSuccessActions
                journeyPublicId={publicId}
              />
            }
          />
        </div>
      </div>
    </main>
  );
}