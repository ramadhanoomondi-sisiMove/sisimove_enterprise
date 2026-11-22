
'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import {
  adminProvidersApi,
  type AdminConfigureMpesaInput,
  type AdminMpesaConfigurationStatusResponse,
  type AdminProvider,
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
// Configuration status:
// - Loaded separately for Sandbox and Production.
// - Only boolean configuration indicators are retrieved.
// - Credentials are never returned to the frontend.
//
// -----------------------------------------------------------------------------

export interface ProviderMpesaConfigurationFormProps {
  provider: AdminProvider;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: (
    input: AdminConfigureMpesaInput,
  ) => void | Promise<void>;
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
  onConfirm: (
    input: AdminConfigureMpesaInput,
  ) => void | Promise<void>;
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
  // Configuration Status
  // ===========================================================================

  const [configurationStatus, setConfigurationStatus] =
    useState<AdminMpesaConfigurationStatusResponse | null>(null);

  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  // ===========================================================================
  // Submission Error
  // ===========================================================================

  const [submissionError, setSubmissionError] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cover both the parent-owned operation state and this form's own submit
  // lifecycle. This prevents duplicate saves during asynchronous callbacks.
  const isBusy = isLoading || isSubmitting;

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
  // Load Configuration Status
  // ===========================================================================

  useEffect(() => {
    let active = true;

    const loadStatus = async () => {
      setIsStatusLoading(true);
      setStatusError(null);
      setConfigurationStatus(null);

      try {
        const result =
          await adminProvidersApi.getMpesaConfigurationStatus({
            providerPublicId: provider.publicId,
            environment,
          });

        if (active) {
          setConfigurationStatus(result);
        }
      } catch {
        if (active) {
          setStatusError(
            'Unable to retrieve M-PESA configuration status. You can still enter credentials and try again.',
          );
        }
      } finally {
        if (active) {
          setIsStatusLoading(false);
        }
      }
    };

    void loadStatus();

    return () => {
      active = false;
    };
  }, [provider.publicId, environment]);

  // ===========================================================================
  // Refresh Configuration Status
  // ===========================================================================

  const refreshConfigurationStatus = async (): Promise<void> => {
    setIsStatusLoading(true);
    setStatusError(null);

    try {
      const result =
        await adminProvidersApi.getMpesaConfigurationStatus({
          providerPublicId: provider.publicId,
          environment,
        });

      setConfigurationStatus(result);
    } catch {
      setStatusError(
        'Configuration was saved, but the latest status could not be retrieved. Please refresh the status.',
      );
    } finally {
      setIsStatusLoading(false);
    }
  };

  // ===========================================================================
  // C2B Validation
  // ===========================================================================

  const normalizedC2BShortcode = c2bShortcode.trim();

  const hasAnyC2BField = normalizedC2BShortcode.length > 0;

  const isC2BValid =
    !hasAnyC2BField ||
    (
      normalizedC2BShortcode.length <= 20 &&
      (
        c2bBusinessType === 'PAYBILL' ||
        c2bBusinessType === 'BUY_GOODS'
      )
    );

  // ===========================================================================
  // B2C Validation
  // ===========================================================================

  const normalizedB2CShortcode = b2cShortcode.trim();
  const normalizedInitiatorName = initiatorName.trim();
  const normalizedSecurityCredential = securityCredential.trim();

  const hasAnyB2CField =
    normalizedB2CShortcode.length > 0 ||
    normalizedInitiatorName.length > 0 ||
    normalizedSecurityCredential.length > 0;

  const isB2CValid =
    !hasAnyB2CField ||
    (
      normalizedB2CShortcode.length > 0 &&
      normalizedB2CShortcode.length <= 20 &&
      normalizedInitiatorName.length > 0 &&
      normalizedInitiatorName.length <= 100 &&
      normalizedSecurityCredential.length > 0 &&
      normalizedSecurityCredential.length <= 4096
    );

  // ===========================================================================
  // Required Shared Authentication and STK Validation
  // ===========================================================================

  const normalizedConsumerKey = consumerKey.trim();
  const normalizedConsumerSecret = consumerSecret.trim();
  const normalizedShortcode = shortcode.trim();
  const normalizedPasskey = passkey.trim();

  const isRequiredConfigurationValid =
    normalizedConsumerKey.length > 0 &&
    normalizedConsumerKey.length <= 255 &&
    normalizedConsumerSecret.length > 0 &&
    normalizedConsumerSecret.length <= 255 &&
    normalizedShortcode.length > 0 &&
    normalizedShortcode.length <= 20 &&
    normalizedPasskey.length > 0 &&
    normalizedPasskey.length <= 255;

  const isValid =
    isRequiredConfigurationValid &&
    isC2BValid &&
    isB2CValid;

  // ===========================================================================
  // Submission
  // ===========================================================================

  const handleConfirm = async () => {
    if (!isValid || isBusy) {
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    const input: AdminConfigureMpesaInput = {
      environment,

      // Shared Daraja authentication.
      consumerKey: normalizedConsumerKey,
      consumerSecret: normalizedConsumerSecret,

      // STK Push top-up.
      shortcode: normalizedShortcode,
      passkey: normalizedPasskey,

      // Optional C2B top-up.
      ...(hasAnyC2BField
        ? {
            c2bShortcode: normalizedC2BShortcode,
            c2bBusinessType,
          }
        : {}),

      // Optional B2C available-funds withdrawal.
      ...(hasAnyB2CField
        ? {
            b2cShortcode: normalizedB2CShortcode,
            initiatorName: normalizedInitiatorName,
            securityCredential: normalizedSecurityCredential,
          }
        : {}),
    };

    try {
      await onConfirm(input);

      // Refresh status only after the configuration operation succeeds.
      await refreshConfigurationStatus();
    } catch {
      setSubmissionError(
        'M-PESA configuration could not be saved. Please check the supplied details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================================================================
  // Validation Message
  // ===========================================================================

  const validationMessage = !isRequiredConfigurationValid
    ? 'Complete all required shared Daraja and STK Push fields. Check their maximum lengths.'
    : !isC2BValid
      ? 'Check the C2B shortcode. It must contain between 1 and 20 characters.'
      : !isB2CValid
        ? 'Complete all three B2C fields, or leave all three blank.'
        : null;

  // ===========================================================================
  // Configuration Status Display
  // ===========================================================================

  const statusItems = [
    {
      label: 'Shared Daraja Authentication',
      configured:
        configurationStatus?.sharedAuthenticationConfigured ?? false,
    },
    {
      label: 'STK Push — Customer Top-up',
      configured: configurationStatus?.stkPushConfigured ?? false,
    },
    {
      label: 'C2B — Customer Top-up',
      configured: configurationStatus?.c2bConfigured ?? false,
    },
    {
      label: 'B2C — Available-Funds Withdrawal',
      configured: configurationStatus?.b2cConfigured ?? false,
    },
  ];

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
      isLoading={isBusy}
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
            onChange={(event) => {
              setEnvironment(
                event.target.value as 'SANDBOX' | 'PRODUCTION',
              );
              setSubmissionError(null);
            }}
            disabled={isBusy}
            className={inputClass}
          >
            <option value="SANDBOX">Sandbox</option>
            <option value="PRODUCTION">Production</option>
          </select>

          <p className="text-xs text-muted-foreground">
            Configuration is stored separately for each environment.
          </p>
        </div>

        {/* ================================================================= */}
        {/* Existing Configuration Status */}
        {/* ================================================================= */}

        <section
          className="space-y-3 rounded-lg border p-4"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Saved Configuration Status
              </h3>

              <p className="text-xs text-muted-foreground">
                {environment === 'SANDBOX' ? 'Sandbox' : 'Production'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refreshConfigurationStatus()}
              disabled={isStatusLoading || isBusy}
              className="text-xs font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {isStatusLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading configuration status...
            </p>
          ) : statusError ? (
            <div className="space-y-2">
              <p role="alert" className="text-sm text-destructive">
                {statusError}
              </p>

              <button
                type="button"
                onClick={() => void refreshConfigurationStatus()}
                disabled={isBusy}
                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-foreground">
                    {item.label}
                  </span>

                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
                      item.configured
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {item.configured ? 'Configured' : 'Not configured'}
                  </span>
                </div>
              ))}

              <p className="border-t pt-3 text-xs leading-5 text-muted-foreground">
                These indicators confirm that configuration values are
                saved. They do not confirm successful authentication
                with Safaricom.
              </p>
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* Shared Daraja Authentication */}
        {/* ================================================================= */}

        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Shared Daraja Authentication
            </h3>

            <p className="text-xs text-muted-foreground">
              Enter credentials to configure or update authentication.
              Previously saved secrets are never displayed.
            </p>
          </div>

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
              disabled={isBusy}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Enter Daraja consumer key"
            />
          </div>

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
              disabled={isBusy}
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
              disabled={isBusy}
              required
              maxLength={20}
              className={inputClass}
              placeholder="Enter STK Push shortcode"
            />
          </div>

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
              disabled={isBusy}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Enter STK Push passkey"
            />

            <p className="text-xs text-muted-foreground">
              Use the passkey supplied for your STK Push shortcode.
              This is not the B2C security credential.
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
              optional. Leave the shortcode blank if you are not adding
              or updating C2B settings.
            </p>
          </div>

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
              disabled={isBusy}
              className={inputClass}
            >
              <option value="PAYBILL">PayBill</option>
              <option value="BUY_GOODS">Buy Goods / Till</option>
            </select>
          </div>

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
              disabled={isBusy}
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
              This section is optional. If you enter any B2C field,
              all three fields must be completed.
            </p>
          </div>

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
              disabled={isBusy}
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
              disabled={isBusy}
              required={hasAnyB2CField}
              maxLength={100}
              className={inputClass}
              placeholder="Enter B2C initiator username"
            />
          </div>

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
              disabled={isBusy}
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

        {validationMessage && (
          <div
            role="alert"
            className="rounded-md border border-amber-200 bg-amber-50 p-3"
          >
            <p className="text-xs leading-5 text-amber-800">
              {validationMessage}
            </p>
          </div>
        )}

        {/* ================================================================= */}
        {/* Submission Error */}
        {/* ================================================================= */}

        {submissionError && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 p-3"
          >
            <p className="text-sm text-destructive">
              {submissionError}
            </p>
          </div>
        )}

        {/* ================================================================= */}
        {/* Configuration Retention Notice */}
        {/* ================================================================= */}

        <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm leading-5 text-blue-800">
            Existing optional C2B and B2C settings are retained when
            their fields are left blank. Removing previously saved
            credentials requires a separate configuration-removal
            operation.
          </p>
        </div>

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
