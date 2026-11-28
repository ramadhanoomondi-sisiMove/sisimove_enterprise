
'use client';

import { useState, type FormEvent } from 'react';

import { Button, Dialog, Input } from '@/components/ui';

import type {
  AdminCommissionRuleModel,
  AdminUpdateCommissionRuleModel,
} from '@/features/admin/commissions/models';

export interface CommissionRuleUpdateDialogProps {
  readonly open: boolean;
  readonly rule: AdminCommissionRuleModel | null;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (
    payload: AdminUpdateCommissionRuleModel,
  ) => void | Promise<void>;
}

interface FormValues {
  percentage: string;
  effectiveFrom: string;
  effectiveTo: string;
  version: string;
}

function toDateTimeLocal(value?: string | null): string {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

function toIsoDateTime(value: string): string {
  return new Date(value).toISOString();
}

function getInitialValues(
  rule: AdminCommissionRuleModel | null,
): FormValues {
  return {
    percentage: rule?.percentage ?? '',
    effectiveFrom: toDateTimeLocal(rule?.effectiveFrom),
    effectiveTo: toDateTimeLocal(rule?.effectiveTo),
    version: rule ? String(rule.version) : '',
  };
}

interface CommissionRuleUpdateFormProps {
  readonly rule: AdminCommissionRuleModel;
  readonly loading: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (
    payload: AdminUpdateCommissionRuleModel,
  ) => void | Promise<void>;
}

function CommissionRuleUpdateForm({
  rule,
  loading,
  onClose,
  onSubmit,
}: CommissionRuleUpdateFormProps) {
  const [values, setValues] = useState<FormValues>(
    () => getInitialValues(rule),
  );

  const [validationError, setValidationError] = useState<string | null>(
    null,
  );

  function updateField(
    field: keyof FormValues,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setValidationError(null);
  }

  function validate(): string | null {
    const percentage = Number(values.percentage);
    const version = Number(values.version);

    if (
      !values.percentage.trim() ||
      !Number.isFinite(percentage) ||
      percentage <= 0 ||
      percentage > 100
    ) {
      return 'Enter a percentage greater than 0 and no greater than 100.';
    }

    if (!values.effectiveFrom) {
      return 'Effective from date is required.';
    }

    if (Number.isNaN(new Date(values.effectiveFrom).getTime())) {
      return 'Enter a valid effective from date.';
    }

    if (values.effectiveTo) {
      if (Number.isNaN(new Date(values.effectiveTo).getTime())) {
        return 'Enter a valid effective to date.';
      }

      if (
        new Date(values.effectiveTo).getTime() <
        new Date(values.effectiveFrom).getTime()
      ) {
        return 'Effective to date cannot be earlier than effective from date.';
      }
    }

    if (
      !values.version.trim() ||
      !Number.isInteger(version) ||
      version < 1
    ) {
      return 'Version must be a positive whole number.';
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const error = validate();

    if (error) {
      setValidationError(error);
      return;
    }

    const payload: AdminUpdateCommissionRuleModel = {
      type: rule.type,
      percentage: values.percentage.trim(),
      effectiveFrom: toIsoDateTime(values.effectiveFrom),
      effectiveTo: values.effectiveTo
        ? toIsoDateTime(values.effectiveTo)
        : null,
      version: Number(values.version),
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSubmit(payload);
    } catch {
      // Parent owns mutation error presentation.
      // Keep the dialog open so the user can retry.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md border border-[var(--border)] bg-[var(--background-muted)] p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--foreground-secondary)]">
            Commission type
          </span>
          <span className="text-sm font-medium">{rule.type}</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--foreground-secondary)]">
            Current status
          </span>
          <span className="text-sm font-medium">{rule.status}</span>
        </div>
      </div>

      <Input
        label="Commission percentage"
        type="number"
        min="0.01"
        max="100"
        step="0.01"
        value={values.percentage}
        onChange={(event) =>
          updateField('percentage', event.target.value)
        }
        placeholder="e.g. 10"
        helperText="Enter a value greater than 0 and up to 100."
        required
        disabled={loading}
      />

      <Input
        label="Effective from"
        type="datetime-local"
        value={values.effectiveFrom}
        onChange={(event) =>
          updateField('effectiveFrom', event.target.value)
        }
        required
        disabled={loading}
      />

      <Input
        label="Effective to"
        type="datetime-local"
        value={values.effectiveTo}
        onChange={(event) =>
          updateField('effectiveTo', event.target.value)
        }
        helperText="Leave empty if the rule has no end date."
        disabled={loading}
      />

      <Input
        label="Version"
        type="number"
        min="1"
        step="1"
        value={values.version}
        onChange={(event) =>
          updateField('version', event.target.value)
        }
        required
        disabled={loading}
      />

      {validationError && (
        <p
          role="alert"
          className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {validationError}
        </p>
      )}

      <p className="text-xs text-[var(--foreground-secondary)]">
        Updating a rule does not activate or deactivate it.
        Lifecycle actions are handled separately.
      </p>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}

export function CommissionRuleUpdateDialog({
  open,
  rule,
  loading = false,
  onClose,
  onSubmit,
}: CommissionRuleUpdateDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) {
          onClose();
        }
      }}
      title="Update commission rule"
      description="Update the percentage and effective period for this commission rule."
      size="md"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      {!rule ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            No commission rule has been selected.
          </p>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <CommissionRuleUpdateForm
          key={`${rule.publicId}-${rule.version}`}
          rule={rule}
          loading={loading}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
}
