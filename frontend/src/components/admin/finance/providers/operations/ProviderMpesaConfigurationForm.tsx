
'use client';

import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminConfigureMpesaInput,
  AdminProvider,
} from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// SisiMove Admin — M-PESA Configuration Form
// -----------------------------------------------------------------------------
//
// M-PESA purposes:
//
// TOP-UP:
// - STK Push
// - C2B PayBill / Buy Goods
//
// WITHDRAWAL:
// - B2C withdrawal of customer available funds
//
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
  // ===========================================================================
  // Environment
  // ===========================================================================

  const [environment, setEnvironment] =
    useState<'SANDBOX' | 'PRODUCTION'>('SANDBOX');

  // ===========================================================================
  // Shared Daraja Authentication
  // ===========================================================================

  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');

  // ===========================================================================
  // STK Push — Customer Top-up
  // ===========================================================================

  const [shortcode, setShortcode] = useState('');
  const [passkey, setPasskey] = useState('');

  // ===========================================================================
  // C2B — Customer Top-up
  // ===========================================================================

  const [c2bShortcode, setC2bShortcode] = useState('');
  const [c2bBusinessType, setC2bBusinessType] =
    useState<'PAYBILL' | 'BUY_GOODS'>('PAYBILL');

  // ===========================================================================
  // B2C — Available-Funds Withdrawal
  // ===========================================================================

  const [b2cShortcode, setB2cShortcode] = useState('');
  const [initiatorName, setInitiatorName] = useState('');
  const [securityCredential, setSecurityCredential] = useState('');

  // ===========================================================================
  // C2B Validation
  // ===========================================================================

  const hasAnyC2BField =
    c2bShortcode.trim().length > 0;

  const isC2BValid =
    !hasAnyC2BField ||
    (
      c2bShortcode.trim().length > 0 &&
      c2bShortcode.trim().length <= 20
    );

  // ===========================================================================
  // B2C Validation
  // ===========================================================================

  const hasAnyB2CField =
    b2cShortcode.trim().length > 0 ||
    initiatorName.trim().length > 0 ||
    securityCredential.trim().length > 0;

  const isB2CValid =
    !hasAnyB2CField ||
    (
      b2cShortcode.trim().length > 0 &&
      b2cShortcode.trim().length <= 20 &&
      initiatorName.trim().length > 0 &&
      initiatorName.trim().length <= 100 &&
      securityCredential.trim().length > 0 &&
      securityCredential.trim().length <= 4096
    );

  // ===========================================================================
  // Required STK / Shared Configuration Validation
  // ===========================================================================

  const isRequiredConfigurationValid =
    consumerKey.trim().length > 0 &&
    consumerKey.trim().length <= 255 &&
    consumerSecret.trim().length > 0 &&
    consumerSecret.trim().length <= 255 &&
    shortcode.trim().length > 0 &&
    shortcode.trim().length <= 20 &&
    passkey.trim().length > 0 &&
    passkey.trim().length <= 255;

  const isValid =
    isRequiredConfigurationValid &&
    isC2BValid &&
    isB2CValid;

  // ===========================================================================
  // Submission
  // ===========================================================================

  const handleConfirm = () => {
    if (!isValid || isLoading) {
      return;
    }

    onConfirm({
      environment,

      // Shared Daraja authentication.
      consumerKey: consumerKey.trim(),
      consumerSecret: consumerSecret.trim(),

      // STK Push top-up.
      shortcode: shortcode.trim(),
      passkey: passkey.trim(),

      // Optional C2B top-up.
      ...(hasAnyC2BField
        ? {
            c2bShortcode: c2bShortcode.trim(),
            c2bBusinessType,
          }
        : {}),

      // Optional B2C available-funds withdrawal.
      ...(hasAnyB2CField
        ? {
            b2cShortcode: b2cShortcode.trim(),
            initiatorName: initiatorName.trim(),
            securityCredential: securityCredential.trim(),
          }
        : {}),
    });
  };

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <ProviderOperationConfirmation
      isOpen
      title="Configure M-PESA"
      description={`Configure Safaricom Daraja for ${provider.name}.`}
      confirmLabel="Save Configuration"
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-6">

        {/* ================================================================= */}
        {/* Environment */}
        {/* ================================================================= */}

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

        {/* ================================================================= */}
        {/* Shared Daraja Authentication */}
        {/* ================================================================= */}

        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Shared Daraja Authentication
            </h3>

            <p className="text-xs text-muted-foreground">
              Credentials shared by STK Push, C2B and B2C.
            </p>
          </div>

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
        </section>

        {/* ================================================================= */}
        {/* STK Push — Top-up */}
        {/* ================================================================= */}

        <section className="space-y-3 border-t pt-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              STK Push — Customer Top-up
            </h3>

            <p className="text-xs text-muted-foreground">
              Customer receives an M-PESA payment prompt on their phone.
            </p>
          </div>

          {/* STK Shortcode */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-shortcode"
              className="text-sm font-medium text-foreground"
            >
              STK Push Business Shortcode *
            </label>

            <input
              id="mpesa-shortcode"
              type="text"
              inputMode="numeric"
              value={shortcode}
              onChange={(event) => setShortcode(event.target.value)}
              disabled={isLoading}
              required
              maxLength={20}
              className={inputClass}
              placeholder="Enter STK Push shortcode"
            />
          </div>

          {/* STK Passkey */}

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

            <p className="text-xs text-muted-foreground">
              Use the passkey supplied for your STK Push shortcode.
            </p>
          </div>
        </section>

        {/* ================================================================= */}
        {/* C2B — Top-up */}
        {/* ================================================================= */}

        <section className="space-y-3 border-t pt-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              C2B — Customer Top-up
            </h3>

            <p className="text-xs leading-5 text-muted-foreground">
              Configure PayBill or Buy Goods payments. This section is
              optional. Leave the shortcode blank if C2B is not being
              configured yet.
            </p>
          </div>

          {/* C2B Business Type */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-c2b-business-type"
              className="text-sm font-medium text-foreground"
            >
              C2B Business Type
            </label>

            <select
              id="mpesa-c2b-business-type"
              value={c2bBusinessType}
              onChange={(event) =>
                setC2bBusinessType(
                  event.target.value as 'PAYBILL' | 'BUY_GOODS',
                )
              }
              disabled={isLoading}
              className={inputClass}
            >
              <option value="PAYBILL">PayBill</option>
              <option value="BUY_GOODS">Buy Goods / Till</option>
            </select>
          </div>

          {/* C2B Shortcode */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-c2b-shortcode"
              className="text-sm font-medium text-foreground"
            >
              C2B Business Shortcode (Optional)
            </label>

            <input
              id="mpesa-c2b-shortcode"
              type="text"
              inputMode="numeric"
              value={c2bShortcode}
              onChange={(event) => setC2bShortcode(event.target.value)}
              disabled={isLoading}
              maxLength={20}
              className={inputClass}
              placeholder="Enter C2B PayBill / Till shortcode"
            />

            <p className="text-xs text-muted-foreground">
              This may be different from your STK Push shortcode.
            </p>
          </div>
        </section>

        {/* ================================================================= */}
        {/* B2C — Available-Funds Withdrawal */}
        {/* ================================================================= */}

        <section className="space-y-4 border-t pt-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              B2C — Available-Funds Withdrawal
            </h3>

            <p className="text-xs leading-5 text-muted-foreground">
              Configure Safaricom B2C credentials for sending a customer&apos;s
              available funds to their M-PESA account.
            </p>

            <p className="text-xs leading-5 text-muted-foreground">
              This section is optional. Leave all three fields blank if
              you are not configuring withdrawals yet. If you enter any
              B2C field, all three must be completed.
            </p>
          </div>

          {/* B2C Party A Shortcode */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-b2c-shortcode"
              className="text-sm font-medium text-foreground"
            >
              B2C Party A Shortcode
            </label>

            <input
              id="mpesa-b2c-shortcode"
              type="text"
              inputMode="numeric"
              value={b2cShortcode}
              onChange={(event) => setB2cShortcode(event.target.value)}
              disabled={isLoading}
              required={hasAnyB2CField}
              maxLength={20}
              className={inputClass}
              placeholder="Enter B2C Party A shortcode"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Use the Party A shortcode supplied in your Daraja B2C
              configuration.
            </p>
          </div>

          {/* B2C Initiator Name */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-initiator-name"
              className="text-sm font-medium text-foreground"
            >
              B2C Initiator Name
            </label>

            <input
              id="mpesa-initiator-name"
              type="text"
              autoComplete="off"
              value={initiatorName}
              onChange={(event) => setInitiatorName(event.target.value)}
              disabled={isLoading}
              required={hasAnyB2CField}
              maxLength={100}
              className={inputClass}
              placeholder="Enter B2C initiator username"
            />
          </div>

          {/* B2C Security Credential */}

          <div className="space-y-2">
            <label
              htmlFor="mpesa-security-credential"
              className="text-sm font-medium text-foreground"
            >
              B2C Security Credential
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
              required={hasAnyB2CField}
              maxLength={4096}
              className={inputClass}
              placeholder="Paste encrypted B2C security credential"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Enter the RSA-encrypted initiator credential generated
              with the correct Safaricom environment certificate.
              Do not enter the ordinary initiator password or STK Passkey.
            </p>
          </div>
        </section>

        {/* ================================================================= */}
        {/* Validation */}
        {/* ================================================================= */}

        {!isValid && (
          <div
            role="alert"
            className="rounded-md border border-amber-200 bg-amber-50 p-3"
          >
            <p className="text-xs leading-5 text-amber-800">
              {!isRequiredConfigurationValid
                ? 'Complete all required shared Daraja and STK Push fields. Check their maximum lengths.'
                : !isC2BValid
                  ? 'Check the C2B shortcode. It must contain between 1 and 20 characters.'
                  : 'Complete all three B2C fields or leave all three blank.'}
            </p>
          </div>
        )}

        {/* ================================================================= */}
        {/* Security Notice */}
        {/* ================================================================= */}

        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm leading-5 text-amber-800">
            Credentials are sent to the backend for encrypted storage.
            Saving them does not verify the Safaricom connection or
            authorize withdrawals. FinancialModule remains responsible
            for withdrawal authorization and customer balance updates.
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
