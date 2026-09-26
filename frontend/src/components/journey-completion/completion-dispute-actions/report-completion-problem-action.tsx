// -----------------------------------------------------------------------------
// sisiMove — Report Completion Problem Action
// -----------------------------------------------------------------------------
//
// Presentation action for reporting a problem with a journey completion.
//
// Responsibilities:
// - own the report-problem dialog visibility;
// - render the report-problem action;
// - pass the completion projection to the dialog.
//
// Non-responsibilities:
// - dispute HTTP/API calls;
// - authorization;
// - dispute lifecycle decisions;
// - local completion mutation.
//
// The dialog owns the actual dispute-opening mutation.
//
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui';

import type { JourneyCompletion } from '@/features/journey-completion/models';

import { ReportCompletionProblemDialog } from '../report-problem/report-completion-problem-dialog';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface ReportCompletionProblemActionProps {
  completion: JourneyCompletion;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ReportCompletionProblemAction({
  completion,
}: ReportCompletionProblemActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={() => setOpen(true)}
      >
        Report a problem
      </Button>

      <ReportCompletionProblemDialog
        completion={completion}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}