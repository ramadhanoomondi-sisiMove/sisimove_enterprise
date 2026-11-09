import { WithdrawalDetailPage } from '@/components/admin/finance/withdrawals/details';

interface AdminWithdrawalDetailRouteProps {
  params: Promise<{
    publicId: string;
  }>;
}

export default async function AdminWithdrawalDetailRoute({
  params,
}: AdminWithdrawalDetailRouteProps) {
  const { publicId } = await params;

  return <WithdrawalDetailPage withdrawalPublicId={publicId} />;
}