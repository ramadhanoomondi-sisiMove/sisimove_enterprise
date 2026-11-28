import { BookingCommissionDetailsLayout } from '@/components/admin/commissions/booking/BookingCommissionDetailsLayout';

interface BookingCommissionPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function BookingCommissionPage({
  params,
}: BookingCommissionPageProps) {
  const { publicId } = await params;

  return (
    <BookingCommissionDetailsLayout
      commissionPublicId={publicId}
    />
  );
}