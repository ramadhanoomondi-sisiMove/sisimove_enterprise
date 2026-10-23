
import { BookingLoadingState } from '@/components/admin/bookings/shared/BookingLoadingState';

export default function AdminBookingsLoading() {
  return (
    <main className="mx-auto w-full max-w-none space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <BookingLoadingState
        variant="page"
        message="Loading booking control center…"
        rows={5}
      />
    </main>
  );
}
