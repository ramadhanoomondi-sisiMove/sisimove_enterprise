import type { ReactNode } from 'react';
import { Button, Dialog } from '@/components/ui';

export interface JourneySettlementOperationConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  tone?: 'default' | 'danger';
  children?: ReactNode;
}

export function JourneySettlementOperationConfirmation({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending = false,
  tone = 'default',
  children,
}: JourneySettlementOperationConfirmationProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
    >
      <div className="space-y-4">
        {children}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={tone === 'danger' ? 'danger' : 'primary'}
            loading={isPending}
            disabled={isPending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default JourneySettlementOperationConfirmation;