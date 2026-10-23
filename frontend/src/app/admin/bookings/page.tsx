
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  BookingControlCenterHeader,
  BookingPageContainer,
} from '@/components/admin/bookings/layout';

import { BookingOverviewDashboard } from '@/components/admin/bookings/overview/BookingOverviewDashboard';
import { BookingDirectory } from '@/components/admin/bookings/directory/BookingDirectory';

import type { AdminBooking } from '@/features/admin/bookings';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

export default function AdminBookingsPage() {
  const router = useRouter();

  const handleViewBooking = useCallback(
    (booking: AdminBooking) => {
      router.push(ADMIN_ROUTES.BOOKING(booking.publicId));
    },
    [router],
  );

  return (
    <BookingPageContainer>
      <BookingControlCenterHeader
        title="Booking Control Center"
        description="Monitor booking activity, review payment summaries, and inspect individual journey bookings."
      />

      <BookingOverviewDashboard />

      <BookingDirectory onViewBooking={handleViewBooking} />
    </BookingPageContainer>
  );
}
