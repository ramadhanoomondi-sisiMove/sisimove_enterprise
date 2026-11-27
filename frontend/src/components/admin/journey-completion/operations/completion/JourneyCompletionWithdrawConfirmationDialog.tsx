import { useState } from 'react';

import {
  Button,
  Dialog,
  Input,
} from '@/components/ui';

export interface JourneyCompletionWithdrawRequest {
  readonly memberPublicId?: string;
}

export interface JourneyCompletionWithdrawConfirmationDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (request: JourneyCompletionWithdrawRequest) => void;
}

export function JourneyCompletionWithdrawConfirmationDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: JourneyCompletionWithdrawConfirmationDialogProps) {
  const [memberPublicId, setMemberPublicId] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    onSubmit(
      memberPublicId.trim()
        ? { memberPublicId: memberPublicId.trim() }
        : {},
    );
  }

  function handleClose() {
    if (loading) return;

    setMemberPublicId('');
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
      title="Withdraw confirmation"
      description="Withdraw a journey completion confirmation."
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
            onClick={handleClose}
          >
            Back
          </Button>

          <Button
            type="submit"
            form="journey-completion-withdraw-form"
            variant="danger"
            size="sm"
            loading={loading}
          >
            Withdraw confirmation
          </Button>
        </div>
      }
    >
      <form
        id="journey-completion-withdraw-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          label="Member public ID"
          value={memberPublicId}
          onChange={(event) => setMemberPublicId(event.target.value)}
          placeholder="Optional member public ID"
          helperText="Leave blank when the operation should determine the relevant member."
          disabled={loading}
        />
      </form>
    </Dialog>
  );
}