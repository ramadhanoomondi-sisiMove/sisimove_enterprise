
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Create Dialog
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Collect commission rule definition fields.
// - Validate the form before submission.
// - Emit an AdminCreateCommissionRuleModel payload.
//
// Architecture:
// - No API calls or mutations are performed here.
// - The parent owns submission, loading, and error handling.
// - Rule lifecycle status remains controlled by the backend.
// -----------------------------------------------------------------------------

import { useState, type FormEvent } from 'react';

import {
  Button,
  Dialog,
  Input,
} from '@/components/ui';

import type {
  AdminCreateCommissionRuleModel,
} from '@/features/admin/finance/commissions/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommissionRuleCreateDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (
    payload: AdminCreateCommissionRuleModel,
  ) => void | Promise<void>;
}

interface CommissionRuleFormState {
  readonly type: 'BOOKING' | 'EARNING';
  readonly percentage: string;
  readonly effectiveFrom: string;
  readonly effectiveTo: string;
  readonly version: string;
}

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const INITIAL_FORM: CommissionRuleFormState = {
  type: 'BOOKING',
  percentage: '',
  effectiveFrom: '',
  effectiveTo: '',
  version: '1',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionRuleCreateDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CommissionRuleCreateDialogProps) {
  const [form, setForm] =
    useState<CommissionRuleFormState>(INITIAL_FORM);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Form Updates
  // ---------------------------------------------------------------------------

  const updateField = <K extends keyof CommissionRuleFormState>(
    field: K,
    value: CommissionRuleFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setValidationError(null);
  };

  // ---------------------------------------------------------------------------
  // Close
  // ---------------------------------------------------------------------------

  const handleClose = () => {
    if (loading) return;

    setForm(INITIAL_FORM);
    setValidationError(null);
    onClose();
  };

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const validateForm = (): string | null => {
    const percentage = Number(form.percentage);
    const version = Number(form.version);

    if (!form.percentage.trim()) {
      return 'Enter the commission percentage.';
    }

    if (
      !Number.isFinite(percentage) ||
      percentage <= 0 ||
      percentage > 100
    ) {
      return 'Percentage must be greater than 0 and no more than 100.';
    }

    if (!form.effectiveFrom) {
      return 'Select the effective start date.';
    }

    if (
      form.effectiveTo &&
      new Date(form.effectiveTo).getTime() <=
        new Date(form.effectiveFrom).getTime()
    ) {
      return 'The effective end date must be later than the start date.';
    }

    if (
      !Number.isInteger(version) ||
      version < 1
    ) {
      return 'Version must be a positive whole number.';
    }

    return null;
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const error = validateForm();

    if (error) {
      setValidationError(error);
      return;
    }

    const payload: AdminCreateCommissionRuleModel = {
      type: form.type,
      percentage: form.percentage.trim(),
      effectiveFrom: new Date(form.effectiveFrom).toISOString(),
      effectiveTo: form.effectiveTo
        ? new Date(form.effectiveTo).toISOString()
        : null,
      version: Number(form.version),
    };

    try {
      await onSubmit(payload);
    } catch {
      // Submission errors are owned and displayed by the parent.
      // Keep the dialog open so the user can retry.
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
      title="Create commission rule"
      description="Define the commission type, percentage, effective period, and version."
      size="lg"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Commission Type */}

        <div className="space-y-2">
          <label
            htmlFor="commission-rule-type"
            className="block text-sm font-medium text-foreground"
          >
            Commission type
          </label>

          <select
            id="commission-rule-type"
            value={form.type}
            disabled={loading}
            onChange={(event) =>
              updateField(
                'type',
                event.target.value as CommissionRuleFormState['type'],
              )
            }
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="BOOKING">Booking commission</option>
            <option value="EARNING">Earning commission</option>
          </select>
        </div>

        {/* Percentage */}

        <Input
          label="Commission percentage"
          type="number"
          min="0"
          max="100"
          step="0.01"
          placeholder="e.g. 10"
          value={form.percentage}
          disabled={loading}
          onChange={(event) =>
            updateField('percentage', event.target.value)
          }
          helperText="Enter a percentage greater than 0 and up to 100."
        />

        {/* Effective From */}

        <Input
          label="Effective from"
          type="datetime-local"
          value={form.effectiveFrom}
          disabled={loading}
          onChange={(event) =>
            updateField('effectiveFrom', event.target.value)
          }
        />

        {/* Effective To */}

        <Input
          label="Effective to (optional)"
          type="datetime-local"
          value={form.effectiveTo}
          disabled={loading}
          onChange={(event) =>
            updateField('effectiveTo', event.target.value)
          }
          helperText="Leave empty if the rule has no scheduled end date."
        />

        {/* Version */}

        <Input
          label="Rule version"
          type="number"
          min="1"
          step="1"
          value={form.version}
          disabled={loading}
          onChange={(event) =>
            updateField('version', event.target.value)
          }
          helperText="Enter the version number for this rule."
        />

        {/* Validation Error */}

        {validationError && (
          <div
            role="alert"
            className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
          >
            {validationError}
          </div>
        )}

        {/* Actions */}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Create rule
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
