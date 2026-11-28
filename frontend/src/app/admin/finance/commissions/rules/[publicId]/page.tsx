import { CommissionRuleDetailsLayout } from '@/components/admin/commissions/rules/CommissionRuleDetailsLayout';

interface CommissionRulePageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function CommissionRulePage({
  params,
}: CommissionRulePageProps) {
  const { publicId } = await params;

  return (
    <CommissionRuleDetailsLayout
      rulePublicId={publicId}
    />
  );
}