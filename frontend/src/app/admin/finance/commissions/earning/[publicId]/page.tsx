
import { EarningCommissionDetailsLayout } from '@/components/admin/commissions/earning/EarningCommissionDetailsLayout';

interface EarningCommissionPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function EarningCommissionPage({
  params,
}: EarningCommissionPageProps) {
  const { publicId } = await params;

  return (
    <EarningCommissionDetailsLayout
      commissionPublicId={publicId}
    />
  );
}
