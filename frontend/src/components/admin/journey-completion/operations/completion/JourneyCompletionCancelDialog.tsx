import { useState } from 'react';

import {
  Button,
  Dialog,
  Input,
} from '@/components/ui';

export interface JourneyCompletionCancelRequest {
  readonly cancelledAt?: string;
}

export interface JourneyCompletionCancelDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (request: JourneyCompletionCancelRequest) => void;
}

export function JourneyCompletionCancelDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: JourneyCompletionCancelDialogProps) {
  const [cancelledAt, setCancelledAt] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    onSubmit(
      cancelledAt
        ? { cancelledAt: new Date(cancelledAt).toISOString() }
        : {},
    );
  }

  function handleClose() {
    if (loading) return;

    setCancelledAt('');
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
      title="Cancel journey completion"
      description="This action will submit a cancellation for this journey completion."
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
            form="journey-completion-cancel-form"
            variant="danger"
            size="sm"
            loading={loading}
          >
            Cancel completion
          </Button>
        </div>
      }
    >
      <form
        id="journey-completion-cancel-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          label="Cancelled at"
          type="datetime-local"
          value={cancelledAt}
          onChange={(event) => setCancelledAt(event.target.value)}
          helperText="Optional. Leave blank to use the server's operation time."
          disabled={loading}
        />
      </form>
    </Dialog>
  );
}