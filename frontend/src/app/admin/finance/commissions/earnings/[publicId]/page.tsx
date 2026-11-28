import { EarningCommissionDetailsContainer } from '@/components/admin/finance/commissions/earning/EarningCommissionDetailsContainer';

interface EarningCommissionDetailsPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function EarningCommissionDetailsPage({
  params,
}: EarningCommissionDetailsPageProps) {
  const { publicId } = await params;

  return (
    <EarningCommissionDetailsContainer
      commissionPublicId={publicId}
    />
  );
}