
'use client';

import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminConfigureMpesaInput,
  AdminProvider,
} from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — M-PESA Configuration Form
// -----------------------------------------------------------------------------

export interface ProviderMpesaConfigurationFormProps {
  provider: AdminProvider;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: (input: AdminConfigureMpesaInput) => void;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderMpesaConfigurationForm({
  provider,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderMpesaConfigurationFormProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <ProviderMpesaConfigurationFormContent
      key={provider.publicId}
      provider={provider}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

// -----------------------------------------------------------------------------
// Form Content
// -----------------------------------------------------------------------------

interface ProviderMpesaConfigurationFormContentProps {
  provider: AdminProvider;
  isLoading: boolean;
  onConfirm: (input: AdminConfigureMpesaInput) => void;
  onCancel: () => void;
}

function ProviderMpesaConfigurationFormContent({
  provider,
  isLoading,
  onConfirm,
  onCancel,
}: ProviderMpesaConfigurationFormContentProps) {
  // ---------------------------------------------------------------------------
  // Environment
  // ---------------------------------------------------------------------------

  const [environment, setEnvironment] =
    useState<'SANDBOX' | 'PRODUCTION'>('SANDBOX');

  // ---------------------------------------------------------------------------
  // Shared Daraja Authentication
  // ---------------------------------------------------------------------------

  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [shortcode, setShortcode] = useState('');

  // ---------------------------------------------------------------------------
  // STK Push Configuration
  // ---------------------------------------------------------------------------

  const [passkey, setPasskey] = useState('');

  // ---------------------------------------------------------------------------
  // B2C Withdrawal Configuration
  // ---------------------------------------------------------------------------

  const [initiatorName, setInitiatorName] = useState('');
  const [securityCredential, setSecurityCredential] = useState('');

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const isValid =
    consumerKey.trim().length > 0 &&
    consumerKey.trim().length <= 255 &&
    consumerSecret.trim().length > 0 &&
    consumerSecret.trim().length <= 255 &&
    shortcode.trim().length > 0 &&
    shortcode.trim().length <= 20 &&
    passkey.trim().length > 0 &&
    passkey.trim().length <= 255 &&
    initiatorName.trim().length > 0 &&
    initiatorName.trim().length <= 100 &&
    securityCredential.trim().length > 0 &&
    securityCredential.trim().length <= 4096;

  // ---------------------------------------------------------------------------
  // Submission
  // ---------------------------------------------------------------------------

  const handleConfirm = () => {
    if (!isValid || isLoading) {
      return;
    }

    onConfirm({
      environment,
      consumerKey: consumerKey.trim(),
      consumerSecret: consumerSecret.trim(),
      shortcode: shortcode.trim(),
      passkey: passkey.trim(),
      initiatorName: initiatorName.trim(),
      securityCredential: securityCredential.trim(),
    });
  };

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <ProviderOperationConfirmation
      isOpen
      title="Configure M-PESA"
      description={`Enter the Safaricom Daraja credentials for ${provider.name}.`}
      confirmLabel="Save Configuration"
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-5">

        {/* Environment */}

        <div className="space-y-2">
          <label
            htmlFor="mpesa-environment"
            className="text-sm font-medium text-foreground"
          >
            Environment *
          </label>

          <select
            id="mpesa-environment"
            value={environment}
            onChange={(event) =>
              setEnvironment(
                event.target.value as 'SANDBOX' | 'PRODUCTION',
              )
            }
            disabled={isLoading}
            className={inputClass}
          >
            <option value="SANDBOX">Sandbox</option>
            <option value="PRODUCTION">Production</option>
          </select>
        </div>

        {/* Shared Daraja Authentication */}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Shared Daraja Authentication
          </h3>

          {/* Consumer Key */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-consumer-key"
              className="text-sm font-medium text-foreground"
            >
              Consumer Key *
            </label>

            <input
              id="mpesa-consumer-key"
              type="password"
              autoComplete="new-password"
              value={consumerKey}
              onChange={(event) => setConsumerKey(event.target.value)}
              disabled={isLoading}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Enter Daraja consumer key"
            />
          </div>

          {/* Consumer Secret */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-consumer-secret"
              className="text-sm font-medium text-foreground"
            >
              Consumer Secret *
            </label>

            <input
              id="mpesa-consumer-secret"
              type="password"
              autoComplete="new-password"
              value={consumerSecret}
              onChange={(event) => setConsumerSecret(event.target.value)}
              disabled={isLoading}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Enter Daraja consumer secret"
            />
          </div>

          {/* Shortcode */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-shortcode"
              className="text-sm font-medium text-foreground"
            >
              Business Shortcode *
            </label>

            <input
              id="mpesa-shortcode"
              type="text"
              value={shortcode}
              onChange={(event) => setShortcode(event.target.value)}
              disabled={isLoading}
              required
              maxLength={20}
              className={inputClass}
              placeholder="Enter business shortcode"
            />
          </div>
        </div>

        {/* STK Push Configuration */}

        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-semibold text-foreground">
            STK Push Configuration
          </h3>

          <div className="space-y-2">
            <label
              htmlFor="mpesa-passkey"
              className="text-sm font-medium text-foreground"
            >
              STK Push Passkey *
            </label>

            <input
              id="mpesa-passkey"
              type="password"
              autoComplete="new-password"
              value={passkey}
              onChange={(event) => setPasskey(event.target.value)}
              disabled={isLoading}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Enter STK Push passkey"
            />
          </div>
        </div>

        {/* B2C Withdrawal Configuration */}

        <div className="space-y-4 border-t pt-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              B2C Withdrawal Configuration
            </h3>

            <p className="text-xs leading-5 text-muted-foreground">
              Configure Safaricom credentials for sending payments
              from SisiMove to customer M-PESA accounts.
            </p>
          </div>

          {/* Initiator Name */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-initiator-name"
              className="text-sm font-medium text-foreground"
            >
              B2C Initiator Name *
            </label>

            <input
              id="mpesa-initiator-name"
              type="text"
              autoComplete="off"
              value={initiatorName}
              onChange={(event) => setInitiatorName(event.target.value)}
              disabled={isLoading}
              required
              maxLength={100}
              className={inputClass}
              placeholder="Enter B2C initiator username"
            />
          </div>

          {/* Security Credential */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-security-credential"
              className="text-sm font-medium text-foreground"
            >
              B2C Security Credential *
            </label>

            <input
              id="mpesa-security-credential"
              type="password"
              autoComplete="new-password"
              value={securityCredential}
              onChange={(event) =>
                setSecurityCredential(event.target.value)
              }
              disabled={isLoading}
              required
              maxLength={4096}
              className={inputClass}
              placeholder="Paste RSA-encrypted security credential"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Use the RSA-encrypted initiator password generated
              with the correct Safaricom environment certificate.
              Do not enter your ordinary initiator password here.
            </p>
          </div>
        </div>

        {/* Validation */}

        {!isValid && (
          <p className="text-xs text-amber-700">
            Complete all required fields and check their maximum
            lengths before saving.
          </p>
        )}

        {/* Security Notice */}

        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm leading-5 text-amber-800">
            Credentials will be sent to the backend for encrypted
            storage. Saving them does not yet verify the Safaricom
            connection or authorize B2C withdrawals.
          </p>
        </div>
      </div>
    </ProviderOperationConfirmation>
  );
}

// -----------------------------------------------------------------------------
// Shared Input Styles
// -----------------------------------------------------------------------------

const inputClass = cn(
  'min-h-10 w-full rounded-md border border-input',
  'bg-background px-3 py-2 text-sm text-foreground',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-ring disabled:cursor-not-allowed',
  'disabled:opacity-50',
);
