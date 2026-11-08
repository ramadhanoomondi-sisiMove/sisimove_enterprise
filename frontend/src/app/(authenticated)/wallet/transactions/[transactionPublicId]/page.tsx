
import { TransactionDetailsPageContainer } from "@/components/financial/transactions/transaction-details-page-container";

interface FinancialTransactionDetailsRouteProps {
  readonly params: Promise<{
    transactionPublicId: string;
  }>;
}

export default async function FinancialTransactionDetailsRoute({
  params,
}: FinancialTransactionDetailsRouteProps) {
  const { transactionPublicId } = await params;

  return (
    <TransactionDetailsPageContainer
      transactionPublicId={transactionPublicId}
    />
  );
}
