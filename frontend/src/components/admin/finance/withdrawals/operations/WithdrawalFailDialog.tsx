
'use client';

import { useState, type FormEvent } from 'react';

import { Button, Dialog, Input, Textarea } from '@/components/ui';

import type {
  AdminWithdrawalFailRequest,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal-operations.model';

import WithdrawalInlineAlert from '../feedback/WithdrawalInlineAlert';

export interface WithdrawalFailDialogProps {
  open: boolean;
  withdrawalPublicId: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminWithdrawalFailRequest) => void;
}

function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const local = new Date(
    now.getTime() - now.getTimezoneOffset() * 60_000,
  );

  return local.toISOString().slice(0, 16);
}

export function WithdrawalFailDialog({
  open,
  withdrawalPublicId,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: WithdrawalFailDialogProps) {
  const [reason, setReason] = useState('');
  const [failedAt, setFailedAt] = useState(
    getCurrentDateTimeLocal,
  );
  const [error, setError] = useState('');

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    if (!nextOpen) {
      setReason('');
      setFailedAt(getCurrentDateTimeLocal());
      setError('');
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const date = new Date(failedAt);

    if (!reason.trim()) {
      setError('Provide a reason for marking this withdrawal as failed.');
      return;
    }

    if (!failedAt || Number.isNaN(date.getTime())) {
      setError('Enter a valid failure date and time.');
      return;
    }

    setError('');

    onSubmit({
      reason: reason.trim(),
      failedAt: date.toISOString(),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Mark withdrawal as failed"
      description={`Record the failure of ${withdrawalPublicId}.`}
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
            form="withdrawal-fail-form"
            variant="danger"
            loading={isSubmitting}
          >
            Confirm failure
          </Button>
        </div>
      }
    >
      <form
        id="withdrawal-fail-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <WithdrawalInlineAlert variant="warning">
          This is a terminal status. A failed withdrawal cannot be moved
          back through the normal withdrawal lifecycle.
        </WithdrawalInlineAlert>

        {error && (
          <WithdrawalInlineAlert variant="error">
            {error}
          </WithdrawalInlineAlert>
        )}

        <Textarea
          id="withdrawal-failure-reason"
          label="Failure reason"
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            if (error) setError('');
          }}
          placeholder="Explain why the withdrawal failed"
          rows={3}
          required
        />

        <Input
          id="withdrawal-failed-at"
          label="Failure date and time"
          type="datetime-local"
          value={failedAt}
          onChange={(event) => {
            setFailedAt(event.target.value);
            if (error) setError('');
          }}
          required
        />
      </form>
    </Dialog>
  );
}

export default WithdrawalFailDialog;
