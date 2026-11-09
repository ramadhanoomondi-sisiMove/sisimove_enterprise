
'use client';

import { useState, type FormEvent } from 'react';

import { Button, Dialog, Input } from '@/components/ui';

import type {
  AdminWithdrawalCompleteRequest,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal-operations.model';

import WithdrawalInlineAlert from '../feedback/WithdrawalInlineAlert';

export interface WithdrawalCompleteDialogProps {
  open: boolean;
  withdrawalPublicId: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminWithdrawalCompleteRequest) => void;
}

function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const local = new Date(
    now.getTime() - now.getTimezoneOffset() * 60_000,
  );

  return local.toISOString().slice(0, 16);
}

export function WithdrawalCompleteDialog({
  open,
  withdrawalPublicId,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: WithdrawalCompleteDialogProps) {
  const [completedAt, setCompletedAt] = useState(
    getCurrentDateTimeLocal,
  );
  const [error, setError] = useState('');

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    if (!nextOpen) {
      setCompletedAt(getCurrentDateTimeLocal());
      setError('');
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const date = new Date(completedAt);

    if (!completedAt || Number.isNaN(date.getTime())) {
      setError('Enter a valid completion date and time.');
      return;
    }

    setError('');

    onSubmit({
      completedAt: date.toISOString(),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Complete withdrawal"
      description={`Confirm successful completion of ${withdrawalPublicId}.`}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Close
          </Button>

          <Button
            type="submit"
            form="withdrawal-complete-form"
            loading={isSubmitting}
          >
            Confirm completion
          </Button>
        </div>
      }
    >
      <form
        id="withdrawal-complete-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <WithdrawalInlineAlert variant="warning">
          Only complete this operation after confirming that the associated
          disbursement succeeded.
        </WithdrawalInlineAlert>

        {error && (
          <WithdrawalInlineAlert variant="error">
            {error}
          </WithdrawalInlineAlert>
        )}

        <Input
          id="withdrawal-completed-at"
          label="Completion date and time"
          type="datetime-local"
          value={completedAt}
          onChange={(event) => {
            setCompletedAt(event.target.value);
            if (error) setError('');
          }}
          required
        />
      </form>
    </Dialog>
  );
}

export default WithdrawalCompleteDialog;
