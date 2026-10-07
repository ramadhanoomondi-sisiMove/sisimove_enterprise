// -----------------------------------------------------------------------------
// Path:
// src/app/(authenticated)/my-demands/[publicId]/page.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — My Journey Demand Management Page
//
// Authenticated owner-management route.
//
// Route:
//
//     /my-demands/[publicId]
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// This page is intentionally a very thin Next.js route boundary.
//
// It is responsible only for:
//
// - receiving the Journey Demand public ID from the URL;
// - validating that the route parameter is usable;
// - composing JourneyDemandManagementPanel;
// - providing the normalized public ID to that panel.
//
// It does NOT:
//
// - query the Journey Demand;
// - call an API;
// - own mutation hooks;
// - own lifecycle actions;
// - determine lifecycle capabilities;
// - perform authorization;
// - reconstruct a Journey Demand aggregate;
// - construct editor sections;
// - persist Journey Demand edits;
// - own section-level editing state;
// - decide which sections are rendered.
//
// -----------------------------------------------------------------------------
//
// DATA FLOW
// -----------------------------------------------------------------------------
//
//     /my-demands/[publicId]
//              │
//              ▼
//     JourneyDemandManagementPanel
//              │
//              ▼
//     useMyJourneyDemand(publicId)
//              │
//              ▼
//     JourneyDemandManagement
//              │
//              ├── JourneyDemandActions
//              │
//              └── JourneyDemandEditor
//                       │
//                       └── JourneyDemandEditorSections
//
// The management panel owns the authenticated read-model query.
//
// JourneyDemandManagement owns lifecycle orchestration and projection
// refresh coordination.
//
// JourneyDemandEditor owns the Journey Demand editing workflow, including
// composition of its editable sections.
//
// Individual section editors remain presentation-oriented and receive their
// state and save callbacks from JourneyDemandEditor.
//
// Individual lifecycle action components own their own mutations.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// There is intentionally NO:
//
//     /my-demands/[publicId]/edit
//
// Editing is part of the authenticated management surface:
//
//     /my-demands/[publicId]
//
// The authenticated route namespace is therefore:
//
//     /demands/[publicId]
//         → public Journey Demand detail
//
//     /my-demands/[publicId]
//         → authenticated owner management
//
// This keeps public marketplace resources and owner-management resources in
// separate URL namespaces and avoids ambiguous dynamic Next.js routes.
//
// -----------------------------------------------------------------------------
//
// SECTION OWNERSHIP
// -----------------------------------------------------------------------------
//
// The page must NOT do this:
//
//     <JourneyDemandManagementPanel
//       ...
//       sections={[]}
//     />
//
// `sections={[]}` was a placeholder from the earlier composition model.
//
// The current architecture is:
//
//     JourneyDemandManagementPanel
//              ↓
//     JourneyDemandManagement
//              ↓
//     JourneyDemandEditor
//              ↓
//     JourneyDemandEditorSections
//
// Therefore the editor itself composes the authoritative section order.
//
// The route has no loaded Journey Demand projection and therefore has no
// reason to construct section content.
//
// -----------------------------------------------------------------------------
//
// QUERY OWNERSHIP
// -----------------------------------------------------------------------------
//
// The page deliberately does not call:
//
//     useMyJourneyDemand()
//
// The query boundary is:
//
//     JourneyDemandManagementPanel
//
// This keeps the Next.js route independent from the client-side Journey
// Demand read-model implementation.
//
// -----------------------------------------------------------------------------
//
// AUTHORIZATION
// -----------------------------------------------------------------------------
//
// The page does not determine whether the current member owns the Journey
// Demand.
//
// The backend authenticated `/me` read endpoint remains authoritative.
//
// A valid public ID does not imply ownership.
//
// Therefore:
//
//     route parameter validation
//             ≠
//     resource existence
//             ≠
//     resource ownership
//
// -----------------------------------------------------------------------------
//
// LIFECYCLE
// -----------------------------------------------------------------------------
//
// The page does not determine whether the Journey Demand can:
//
// - publish;
// - cancel;
// - match;
// - convert;
// - fulfill.
//
// Lifecycle actions remain visible through the management surface and the
// backend remains authoritative for whether an operation is permitted.
//
// -----------------------------------------------------------------------------
//
// ROUTE PARAMETER
// -----------------------------------------------------------------------------
//
// Next.js 16 route params are asynchronous, hence:
//
//     params: Promise<{ publicId: string }>
//
// The public ID is trimmed only to reject an unusable empty route parameter.
//
// No public ID transformation, lookup, decoding policy, or domain validation
// is performed here.
//
// `AUTHENTICATED_ROUTES.MY_DEMAND()` remains the canonical URL constructor
// for navigation into this route.
//
// -----------------------------------------------------------------------------


import { notFound } from 'next/navigation';

import { JourneyDemandManagementPanel } from '@/components/journey-demand/manage/journey-demand-management-panel';

// =============================================================================
// Route Props
// =============================================================================

interface JourneyDemandManagementPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default async function JourneyDemandManagementPage({
  params,
}: JourneyDemandManagementPageProps) {
  // ---------------------------------------------------------------------------
  // Resolve the dynamic route parameter.
  // ---------------------------------------------------------------------------
  //
  // Next.js supplies dynamic route params asynchronously in the current
  // application architecture.
  //
  // ---------------------------------------------------------------------------

  const { publicId } = await params;

  // ---------------------------------------------------------------------------
  // Normalize only the route input.
  // ---------------------------------------------------------------------------
  //
  // This is deliberately not domain normalization.
  //
  // We only remove accidental surrounding whitespace so that an otherwise
  // unusable empty route parameter can be rejected before the client-side
  // management surface is mounted.
  //
  // ---------------------------------------------------------------------------

  const normalizedPublicId = publicId.trim();

  // ---------------------------------------------------------------------------
  // Invalid Route Parameter
  // ---------------------------------------------------------------------------
  //
  // A Journey Demand management surface cannot be addressed without a
  // public ID.
  //
  // `notFound()` handles the invalid URL at the Next.js route boundary.
  //
  // This check does NOT determine whether the Journey Demand exists or
  // belongs to the authenticated member.
  //
  // Those concerns remain inside the authenticated backend query owned by
  // JourneyDemandManagementPanel.
  //
  // ---------------------------------------------------------------------------

  if (normalizedPublicId.length === 0) {
    notFound();
  }

  // ---------------------------------------------------------------------------
  // Authenticated Management Surface
  // ---------------------------------------------------------------------------
  //
  // This page intentionally supplies only the resource identifier.
  //
  // JourneyDemandManagementPanel owns the query.
  //
  // JourneyDemandManagement owns management/lifecycle composition.
  //
  // JourneyDemandEditor owns editing workflow and section composition.
  //
  // No `sections` prop is passed here because the current editor architecture
  // no longer expects the route or management page to construct sections.
  //
  // ---------------------------------------------------------------------------

  return (
    <main className="page-container py-5 sm:py-6">
      <JourneyDemandManagementPanel
        journeyDemandPublicId={normalizedPublicId}
      />
    </main>
  );
}