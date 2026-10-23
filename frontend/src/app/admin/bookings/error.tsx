
'use client';

import { useEffect } from 'react';

import { BookingErrorState } from '@/components/admin/bookings/shared/BookingErrorState';

interface AdminBookingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminBookingsError({
  error,
  reset,
}: AdminBookingsErrorProps) {
  useEffect(() => {
    console.error('Admin bookings route error:', error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingErrorState
        description="The booking control center could not be displayed. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
