
'use client';

import { useEffect } from 'react';

import { BookingErrorState } from '@/components/admin/bookings/shared/BookingErrorState';

interface BookingDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BookingDetailError({
  error,
  reset,
}: BookingDetailErrorProps) {
  useEffect(() => {
    console.error('Admin booking detail route error:', error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingErrorState
        description="We couldn't load this booking's details. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
