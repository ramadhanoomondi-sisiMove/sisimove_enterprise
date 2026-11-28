import { CommissionRuleDetailsContainer } from '@/components/admin/finance/commissions/rules/CommissionRuleDetailsContainer';

interface CommissionRuleDetailsPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function CommissionRuleDetailsPage({
  params,
}: CommissionRuleDetailsPageProps) {
  const { publicId } = await params;

  return (
    <CommissionRuleDetailsContainer
      rulePublicId={publicId}
    />
  );
}