
'use client';

import { useState, type FormEvent } from 'react';

import { Button, Dialog, Input, Textarea } from '@/components/ui';

import type {
  AdminWithdrawalCancelRequest,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal-operations.model';

import WithdrawalInlineAlert from '../feedback/WithdrawalInlineAlert';

export interface WithdrawalCancelDialogProps {
  open: boolean;
  withdrawalPublicId: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminWithdrawalCancelRequest) => void;
}

function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

  return local.toISOString().slice(0, 16);
}

export function WithdrawalCancelDialog({
  open,
  withdrawalPublicId,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: WithdrawalCancelDialogProps) {
  const [reason, setReason] = useState('');
  const [cancelledAt, setCancelledAt] = useState(
    getCurrentDateTimeLocal,
  );
  const [error, setError] = useState('');

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isSubmitting) {
      setReason('');
      setCancelledAt(getCurrentDateTimeLocal());
      setError('');
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const date = new Date(cancelledAt);

    if (!reason.trim()) {
      setError('Provide a reason for cancelling this withdrawal.');
      return;
    }

    if (!cancelledAt || Number.isNaN(date.getTime())) {
      setError('Enter a valid cancellation date and time.');
      return;
    }

    setError('');

    onSubmit({
      reason: reason.trim(),
      cancelledAt: date.toISOString(),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Cancel withdrawal"
      description={`Cancel withdrawal ${withdrawalPublicId}.`}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Go back
          </Button>

          <Button
            type="submit"
            form="withdrawal-cancel-form"
            variant="danger"
            loading={isSubmitting}
          >
            Confirm cancellation
          </Button>
        </div>
      }
    >
      <form
        id="withdrawal-cancel-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <WithdrawalInlineAlert variant="warning">
          Cancellation is a terminal status. Confirm that this withdrawal
          should no longer proceed.
        </WithdrawalInlineAlert>

        {error && (
          <WithdrawalInlineAlert variant="error">
            {error}
          </WithdrawalInlineAlert>
        )}

        <Textarea
          id="withdrawal-cancellation-reason"
          label="Cancellation reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain why this withdrawal is being cancelled"
          rows={3}
          required
        />

        <Input
          id="withdrawal-cancelled-at"
          label="Cancellation date and time"
          type="datetime-local"
          value={cancelledAt}
          onChange={(event) => setCancelledAt(event.target.value)}
          required
        />
      </form>
    </Dialog>
  );
}

export default WithdrawalCancelDialog;
