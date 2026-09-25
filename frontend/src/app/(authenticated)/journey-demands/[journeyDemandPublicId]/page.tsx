'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Page
// -----------------------------------------------------------------------------
//
// Authenticated detail surface for a Journey Demand.
//
// URL:
//   /journey-demands/:journeyDemandPublicId
//
// This surface is intentionally separate from the creation workflow:
//
//   /journey-demands/create/:journeyDemandPublicId/...
//
// The detail container owns data composition. This route only resolves the
// public ID and establishes the page layout.
// -----------------------------------------------------------------------------

import { useParams } from 'next/navigation';

import {
  JourneyDemandDetailContainer,
} from '@/components/journey-demands';

export default function JourneyDemandDetailPage() {
  const params = useParams<{
    journeyDemandPublicId: string;
  }>();

  const journeyDemandPublicId = params.journeyDemandPublicId;

  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <JourneyDemandDetailContainer
            journeyDemandPublicId={journeyDemandPublicId}
          />
        </section>
      </div>
    </div>
  );
}