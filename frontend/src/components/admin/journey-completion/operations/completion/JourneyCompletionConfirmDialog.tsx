import { useState } from 'react';

import {
  Button,
  Dialog,
  Input,
} from '@/components/ui';


export interface JourneyCompletionConfirmRequest {
  readonly confirmedAt?: string;
}

export interface JourneyCompletionConfirmDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (request: JourneyCompletionConfirmRequest) => void;
}

export function JourneyCompletionConfirmDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: JourneyCompletionConfirmDialogProps) {
  const [confirmedAt, setConfirmedAt] = useState('');

  function handleSubmit() {
    if (loading) return;

    onSubmit(
      confirmedAt
        ? { confirmedAt: new Date(confirmedAt).toISOString() }
        : {},
    );
  }

  function handleClose() {
    if (loading) return;

    setConfirmedAt('');
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
      title="Confirm journey completion"
      description="Confirm that the journey has been completed."
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
            size="sm"
            loading={loading}
            onClick={handleSubmit}
          >
            Confirm completion
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Confirmed at"
          type="datetime-local"
          value={confirmedAt}
          onChange={(event) => setConfirmedAt(event.target.value)}
          helperText="Optional. Leave blank to use the server's operation time."
          disabled={loading}
        />
      </div>
    </Dialog>
  );
}