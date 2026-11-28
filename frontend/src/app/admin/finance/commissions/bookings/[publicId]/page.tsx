import { BookingCommissionDetailsContainer } from '@/components/admin/finance/commissions/booking/BookingCommissionDetailsContainer';

interface BookingCommissionDetailsPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function BookingCommissionDetailsPage({
  params,
}: BookingCommissionDetailsPageProps) {
  const { publicId } = await params;

  return (
    <BookingCommissionDetailsContainer
      commissionPublicId={publicId}
    />
  );
}