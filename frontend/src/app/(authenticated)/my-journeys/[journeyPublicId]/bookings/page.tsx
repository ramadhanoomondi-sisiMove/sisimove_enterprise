
'use client';

import { useParams } from 'next/navigation';

import { JourneyBookings } from '@/components/journey-booking/manage';

export default function JourneyBookingsPage() {
  const params = useParams<{ journeyPublicId: string }>();
  const journeyPublicId = params.journeyPublicId;

  return (
    <main className="page-container py-6 sm:py-8">
      <JourneyBookings journeyPublicId={journeyPublicId} />
    </main>
  );
}
