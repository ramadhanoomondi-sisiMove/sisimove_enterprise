import { Badge } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { WithdrawalAlertVariant } from '../feedback/WithdrawalInlineAlert';
import WithdrawalInlineAlert from '../feedback/WithdrawalInlineAlert';

export interface WithdrawalOperationFeedbackProps {
  variant: Extract<WithdrawalAlertVariant, 'success' | 'error' | 'warning' | 'info'>;
  message: string;
  title?: string;
  operation?: string;
  className?: string;
}

export function WithdrawalOperationFeedback({
  variant,
  message,
  title,
  operation,
  className,
}: WithdrawalOperationFeedbackProps) {
  return (
    <WithdrawalInlineAlert
      variant={variant}
      title={title}
      className={cn('space-y-2', className)}
    >
      <div>{message}</div>
      {operation && (
        <Badge variant="outline" size="sm">
          {operation}
        </Badge>
      )}
    </WithdrawalInlineAlert>
  );
}

export default WithdrawalOperationFeedback;