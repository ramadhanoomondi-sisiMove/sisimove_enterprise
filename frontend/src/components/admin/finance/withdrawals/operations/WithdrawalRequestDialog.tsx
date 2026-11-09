
'use client';

import { useState, type FormEvent } from 'react';

import { Button, Dialog, Input, Select } from '@/components/ui';

import type {
  AdminWithdrawalDestinationType,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal.enums';

import type {
  AdminWithdrawalRequest,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal-operations.model';

import WithdrawalInlineAlert from '../feedback/WithdrawalInlineAlert';

export interface WithdrawalRequestAccountOption {
  id: string;
  label: string;
}

export interface WithdrawalRequestDialogProps {
  open: boolean;
  accounts: readonly WithdrawalRequestAccountOption[];
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminWithdrawalRequest) => void;
  defaultAccountId?: string;
  className?: string;
}

const DESTINATION_OPTIONS = [
  { label: 'Mobile Money', value: 'MOBILE_MONEY' },
  { label: 'Bank Account', value: 'BANK_ACCOUNT' },
  { label: 'Other', value: 'OTHER' },
] satisfies {
  label: string;
  value: AdminWithdrawalDestinationType;
}[];

export function WithdrawalRequestDialog({
  open,
  accounts,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
  defaultAccountId = '',
  className,
}: WithdrawalRequestDialogProps) {
  const [accountId, setAccountId] = useState(defaultAccountId);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('KES');

  const [destinationType, setDestinationType] =
    useState<AdminWithdrawalDestinationType>('MOBILE_MONEY');

  const [destinationValue, setDestinationValue] = useState('');
  const [referenceType, setReferenceType] = useState('');
  const [referencePublicId, setReferencePublicId] = useState('');
  const [validationError, setValidationError] = useState('');

  const resetForm = () => {
    setAccountId(defaultAccountId);
    setAmount('');
    setCurrency('KES');
    setDestinationType('MOBILE_MONEY');
    setDestinationValue('');
    setReferenceType('');
    setReferencePublicId('');
    setValidationError('');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericAmount = Number(amount);
    const normalizedCurrency = currency.trim().toUpperCase();

    if (!accountId) {
      setValidationError('Select the account for this withdrawal.');
      return;
    }

    if (!Number.isSafeInteger(numericAmount) || numericAmount <= 0) {
      setValidationError('Enter a positive whole-number amount.');
      return;
    }

    if (!normalizedCurrency) {
      setValidationError('Enter a currency.');
      return;
    }

    if (!destinationValue.trim()) {
      setValidationError('Enter the destination value.');
      return;
    }

    setValidationError('');

    onSubmit({
      accountId,
      amount: numericAmount,
      currency: normalizedCurrency,
      destinationType,
      destinationValue: destinationValue.trim(),
      ...(referenceType.trim() && {
        referenceType: referenceType.trim(),
      }),
      ...(referencePublicId.trim() && {
        referencePublicId: referencePublicId.trim(),
      }),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Request withdrawal"
      description="Create a new withdrawal request for a financial account."
      size="lg"
      className={className}
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
            form="withdrawal-request-form"
            loading={isSubmitting}
            disabled={accounts.length === 0}
          >
            Submit request
          </Button>
        </div>
      }
    >
      <form
        id="withdrawal-request-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {accounts.length === 0 && (
          <WithdrawalInlineAlert variant="warning">
            No account options were supplied. Load the available financial
            accounts before creating a withdrawal request.
          </WithdrawalInlineAlert>
        )}

        {validationError && (
          <WithdrawalInlineAlert variant="error">
            {validationError}
          </WithdrawalInlineAlert>
        )}

        <Select
          id="withdrawal-request-account"
          label="Financial account"
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          required
          options={[
            { label: 'Select an account', value: '' },
            ...accounts.map((account) => ({
              label: account.label,
              value: account.id,
            })),
          ]}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="withdrawal-request-amount"
            label="Amount"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />

          <Input
            id="withdrawal-request-currency"
            label="Currency"
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value.toUpperCase())
            }
            maxLength={3}
            required
          />
        </div>

        <Select
          id="withdrawal-request-destination-type"
          label="Destination type"
          value={destinationType}
          onChange={(event) =>
            setDestinationType(
              event.target.value as AdminWithdrawalDestinationType,
            )
          }
          options={DESTINATION_OPTIONS}
          required
        />

        <Input
          id="withdrawal-request-destination-value"
          label="Destination value"
          value={destinationValue}
          onChange={(event) => setDestinationValue(event.target.value)}
          placeholder="Enter the destination account or number"
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="withdrawal-request-reference-type"
            label="Reference type (optional)"
            value={referenceType}
            onChange={(event) => setReferenceType(event.target.value)}
          />

          <Input
            id="withdrawal-request-reference-public-id"
            label="Reference public ID (optional)"
            value={referencePublicId}
            onChange={(event) =>
              setReferencePublicId(event.target.value)
            }
          />
        </div>
      </form>
    </Dialog>
  );
}

export default WithdrawalRequestDialog;
