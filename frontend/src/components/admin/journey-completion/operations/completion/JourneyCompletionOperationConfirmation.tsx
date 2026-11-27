import type { ReactNode } from 'react';

import {
  Badge,
  Button,
  Dialog,
} from '@/components/ui';

export type JourneyCompletionConfirmationTone =
  | 'default'
  | 'warning'
  | 'danger';

export interface JourneyCompletionOperationConfirmationProps {
  readonly open: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly tone?: JourneyCompletionConfirmationTone;
  readonly loading?: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
  readonly children?: ReactNode;
}

export function JourneyCompletionOperationConfirmation({
  open,
  title,
  description,
  confirmLabel,
  tone = 'default',
  loading = false,
  onConfirm,
  onClose,
  children,
}: JourneyCompletionOperationConfirmationProps) {
  const badgeVariant =
    tone === 'danger'
      ? 'danger'
      : tone === 'warning'
        ? 'warning'
        : 'default';

  const buttonVariant =
    tone === 'danger' ? 'danger' : 'primary';

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) onClose();
      }}
      title={title}
      description={description}
      size="sm"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onClose}
          >
            Back
          </Button>

          <Button
            variant={buttonVariant}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <Badge variant={badgeVariant}>
          {tone === 'danger'
            ? 'Important action'
            : tone === 'warning'
              ? 'Please review'
              : 'Confirmation required'}
        </Badge>

        {children}
      </div>
    </Dialog>
  );
}