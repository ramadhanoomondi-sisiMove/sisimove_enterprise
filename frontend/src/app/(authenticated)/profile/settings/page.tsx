
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Account Settings Route
// -----------------------------------------------------------------------------
//
// Route:
//     /profile/settings
//
// Responsibilities:
// - Load the authenticated user's Identity.
// - Allow editing email and phone number.
// - Allow changing the authenticated user's password.
// - Show loading, pending, success, and error states.
// - Keep mutations inside their owning feature boundaries.
// - Provide navigation back to the member profile.
//
// Non-responsibilities:
// - Direct backend calls.
// - Direct session management.
// - Password hashing.
// - Identity verification.
//
// -----------------------------------------------------------------------------

import { useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@/components/ui/container';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing/authenticated-routes';

import {
  useCurrentIdentity,
  useChangeIdentityEmail,
  useChangeIdentityPhoneNumber,
} from '@/features/identity/hooks';

import { useChangePassword } from '@/features/authentication/login/hooks';

// =============================================================================
// Types
// =============================================================================

type EditingSection = 'email' | 'phone' | 'password' | null;

interface SettingsItemProps {
  readonly title: string;
  readonly description: string;
  readonly icon: ReactNode;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

interface FeedbackProps {
  readonly message: string;
  readonly type: 'success' | 'error';
}

// =============================================================================
// Shared Settings Item
// =============================================================================

function SettingsItem({
  title,
  description,
  icon,
  onClick,
  disabled = false,
}: SettingsItemProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        group flex w-full items-center gap-4 rounded-xl
        border border-[var(--border)]
        bg-[var(--surface)] p-4 text-left
        transition hover:border-[var(--brand)]
        hover:bg-[var(--background-subtle)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        sm:p-5
      "
    >
      <span
        aria-hidden="true"
        className="
          flex h-11 w-11 shrink-0 items-center justify-center
          rounded-xl bg-[var(--background-subtle)]
          text-lg text-[var(--foreground-secondary)]
          transition group-hover:text-[var(--brand)]
        "
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[var(--foreground)]">
          {title}
        </span>

        <span className="mt-1 block break-words text-sm leading-5 text-[var(--foreground-secondary)]">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="
          shrink-0 text-lg text-[var(--foreground-muted)]
          transition group-hover:translate-x-0.5
          group-hover:text-[var(--brand)]
        "
      >
        →
      </span>
    </button>
  );
}

// =============================================================================
// Feedback
// =============================================================================

function Feedback({ message, type }: FeedbackProps): ReactNode {
  return (
    <p
      role={type === 'error' ? 'alert' : 'status'}
      className={`mt-3 rounded-lg border p-3 text-sm ${
        type === 'error'
          ? 'border-red-500/30 bg-red-500/5 text-red-700'
          : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground)]'
      }`}
    >
      {message}
    </p>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function AccountSettingsPage(): ReactNode {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Feature Queries and Mutations
  // ---------------------------------------------------------------------------

  const identityQuery = useCurrentIdentity();
  const emailMutation = useChangeIdentityEmail();
  const phoneMutation = useChangeIdentityPhoneNumber();
  const passwordMutation = useChangePassword();

  // ---------------------------------------------------------------------------
  // Editor State
  // ---------------------------------------------------------------------------

  const [editingSection, setEditingSection] =
    useState<EditingSection>(null);

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------------------------------------------------------
  // Feedback State
  // ---------------------------------------------------------------------------

  const [emailFeedback, setEmailFeedback] =
    useState<FeedbackProps | null>(null);

  const [phoneFeedback, setPhoneFeedback] =
    useState<FeedbackProps | null>(null);

  const [passwordFeedback, setPasswordFeedback] =
    useState<FeedbackProps | null>(null);

  const identity = identityQuery.data;

  const isSubmitting =
    emailMutation.isPending ||
    phoneMutation.isPending ||
    passwordMutation.isLoading;

  // ===========================================================================
  // Email
  // ===========================================================================

  function openEmailEditor(): void {
    if (!identity) return;

    setEmail(identity.email);
    setEmailFeedback(null);
    setEditingSection('email');
  }

  async function submitEmail(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!identity) return;

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setEmailFeedback({
        type: 'error',
        message: 'Enter an email address.',
      });
      return;
    }

    if (normalizedEmail === identity.email) {
      setEmailFeedback({
        type: 'error',
        message: 'Enter a different email address to make a change.',
      });
      return;
    }

    setEmailFeedback(null);

    try {
      await emailMutation.mutateAsync({
        identityPublicId: identity.publicId,
        email: normalizedEmail,
      });

      setEmailFeedback({
        type: 'success',
        message:
          'Email update submitted successfully. Check whether additional verification is required.',
      });

      setEditingSection(null);
      await identityQuery.refetch();
    } catch (error: unknown) {
      setEmailFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'We could not update your email address. Please try again.',
      });
    }
  }

  // ===========================================================================
  // Phone Number
  // ===========================================================================

  function openPhoneEditor(): void {
    if (!identity) return;

    setPhoneNumber(identity.phoneNumber);
    setPhoneFeedback(null);
    setEditingSection('phone');
  }

  async function submitPhoneNumber(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!identity) return;

    const normalizedPhone = phoneNumber.trim();

    if (!normalizedPhone) {
      setPhoneFeedback({
        type: 'error',
        message: 'Enter a phone number.',
      });
      return;
    }

    if (normalizedPhone === identity.phoneNumber) {
      setPhoneFeedback({
        type: 'error',
        message: 'Enter a different phone number to make a change.',
      });
      return;
    }

    setPhoneFeedback(null);

    try {
      await phoneMutation.mutateAsync({
        identityPublicId: identity.publicId,
        phoneNumber: normalizedPhone,
      });

      setPhoneFeedback({
        type: 'success',
        message:
          'Phone number update submitted successfully. Check whether additional verification is required.',
      });

      setEditingSection(null);
      await identityQuery.refetch();
    } catch (error: unknown) {
      setPhoneFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'We could not update your phone number. Please try again.',
      });
    }
  }

  // ===========================================================================
  // Password
  // ===========================================================================

  function openPasswordEditor(): void {
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setPasswordFeedback(null);
    passwordMutation.reset();
    setEditingSection('password');
  }

  async function submitPassword(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    // Preserve the exact password, including intentional whitespace.
    if (newPassword.length === 0) {
      setPasswordFeedback({
        type: 'error',
        message: 'Enter your new password.',
      });
      return;
    }

    if (newPassword.length > 128) {
      setPasswordFeedback({
        type: 'error',
        message: 'Your password must not exceed 128 characters.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        message: 'The passwords do not match.',
      });
      return;
    }

    setPasswordFeedback(null);

    try {
      await passwordMutation.changePassword(newPassword);

      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setEditingSection(null);

      setPasswordFeedback({
        type: 'success',
        message: 'Your password has been changed successfully.',
      });
    } catch (error: unknown) {
      setPasswordFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'We could not change your password. Please try again.',
      });
    }
  }

  function cancelPasswordEditor(): void {
    setEditingSection(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setPasswordFeedback(null);
    passwordMutation.reset();
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <Container size="lg" padded>
        <div className="py-6 sm:py-8 lg:py-10">
          {/* Header */}
          <header className="mb-8">
            <button
              type="button"
              onClick={() =>
                router.push(AUTHENTICATED_ROUTES.PROFILE)
              }
              className="
                mb-5 inline-flex min-h-10 items-center gap-2
                rounded-lg text-sm font-medium
                text-[var(--foreground-secondary)]
                transition hover:text-[var(--brand)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
              "
            >
              <span aria-hidden="true">←</span>
              Back to profile
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              ACCOUNT
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Account settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
              Manage your contact information and account security.
            </p>
          </header>

          {/* Identity loading */}
          {identityQuery.isPending && (
            <section
              aria-live="polite"
              className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-sm text-[var(--foreground-secondary)]">
                Loading your account details…
              </p>
            </section>
          )}

          {/* Identity error */}
          {identityQuery.isError && (
            <section className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p role="alert" className="text-sm text-red-700">
                We could not load your account details. Please try again.
              </p>

              <button
                type="button"
                onClick={() => void identityQuery.refetch()}
                className="mt-3 text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                Try again
              </button>
            </section>
          )}

          {/* Empty Identity */}
          {!identityQuery.isPending &&
            !identityQuery.isError &&
            identity == null && (
              <section className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-sm text-[var(--foreground-secondary)]">
                  No Identity record was returned for this account.
                </p>
              </section>
            )}

          {/* Settings sections */}
          {identity && (
            <>
              {/* Contact Information */}
              <section
                aria-labelledby="contact-settings-heading"
                className="mb-8"
              >
                <div className="mb-4">
                  <h2
                    id="contact-settings-heading"
                    className="text-base font-semibold text-[var(--foreground)]"
                  >
                    Contact information
                  </h2>

                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    Keep your account contact details up to date.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Email */}
                  <SettingsItem
                    title="Email address"
                    description={identity.email}
                    icon="✉"
                    onClick={openEmailEditor}
                    disabled={isSubmitting}
                  />

                  {editingSection === 'email' && (
                    <form
                      onSubmit={submitEmail}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
                    >
                      <label
                        htmlFor="settings-email"
                        className="block text-sm font-medium text-[var(--foreground)]"
                      >
                        New email address
                      </label>

                      <input
                        id="settings-email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        className="
                          mt-2 min-h-11 w-full rounded-lg
                          border border-[var(--border)]
                          bg-[var(--surface)] px-3
                          text-sm text-[var(--foreground)]
                          outline-none focus:border-[var(--brand)]
                          focus:ring-2 focus:ring-[var(--brand)]/20
                        "
                      />

                      {emailFeedback && (
                        <Feedback {...emailFeedback} />
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={emailMutation.isPending}
                          className="
                            min-h-10 rounded-lg bg-[var(--brand)]
                            px-4 text-sm font-semibold text-white
                            transition hover:opacity-90
                            disabled:cursor-not-allowed disabled:opacity-60
                          "
                        >
                          {emailMutation.isPending
                            ? 'Saving…'
                            : 'Save email'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingSection(null);
                            setEmailFeedback(null);
                          }}
                          disabled={emailMutation.isPending}
                          className="
                            min-h-10 rounded-lg border
                            border-[var(--border)] px-4
                            text-sm font-medium text-[var(--foreground)]
                            disabled:opacity-60
                          "
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {editingSection !== 'email' && emailFeedback && (
                    <Feedback {...emailFeedback} />
                  )}

                  {/* Phone */}
                  <SettingsItem
                    title="Phone number"
                    description={
                      identity.phoneNumber || 'No phone number provided'
                    }
                    icon="☎"
                    onClick={openPhoneEditor}
                    disabled={isSubmitting}
                  />

                  {editingSection === 'phone' && (
                    <form
                      onSubmit={submitPhoneNumber}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
                    >
                      <label
                        htmlFor="settings-phone"
                        className="block text-sm font-medium text-[var(--foreground)]"
                      >
                        New phone number
                      </label>

                      <input
                        id="settings-phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        maxLength={32}
                        value={phoneNumber}
                        onChange={(event) =>
                          setPhoneNumber(event.target.value)
                        }
                        placeholder="Enter your phone number"
                        className="
                          mt-2 min-h-11 w-full rounded-lg
                          border border-[var(--border)]
                          bg-[var(--surface)] px-3
                          text-sm text-[var(--foreground)]
                          outline-none focus:border-[var(--brand)]
                          focus:ring-2 focus:ring-[var(--brand)]/20
                        "
                      />

                      {phoneFeedback && (
                        <Feedback {...phoneFeedback} />
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={phoneMutation.isPending}
                          className="
                            min-h-10 rounded-lg bg-[var(--brand)]
                            px-4 text-sm font-semibold text-white
                            transition hover:opacity-90
                            disabled:cursor-not-allowed disabled:opacity-60
                          "
                        >
                          {phoneMutation.isPending
                            ? 'Saving…'
                            : 'Save phone number'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingSection(null);
                            setPhoneFeedback(null);
                          }}
                          disabled={phoneMutation.isPending}
                          className="
                            min-h-10 rounded-lg border
                            border-[var(--border)] px-4
                            text-sm font-medium text-[var(--foreground)]
                            disabled:opacity-60
                          "
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {editingSection !== 'phone' && phoneFeedback && (
                    <Feedback {...phoneFeedback} />
                  )}
                </div>
              </section>

              {/* Account Security */}
              <section aria-labelledby="security-settings-heading">
                <div className="mb-4">
                  <h2
                    id="security-settings-heading"
                    className="text-base font-semibold text-[var(--foreground)]"
                  >
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    Protect access to your sisiMove account.
                  </p>
                </div>

                <div className="space-y-3">
                  <SettingsItem
                    title="Change password"
                    description="Update the password you use to sign in."
                    icon="🔒"
                    onClick={openPasswordEditor}
                    disabled={isSubmitting}
                  />

                  {editingSection === 'password' && (
                    <form
                      onSubmit={submitPassword}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
                    >
                      <div>
                        <label
                          htmlFor="settings-new-password"
                          className="block text-sm font-medium text-[var(--foreground)]"
                        >
                          New password
                        </label>

                        <input
                          id="settings-new-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          minLength={1}
                          maxLength={128}
                          value={newPassword}
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                          className="
                            mt-2 min-h-11 w-full rounded-lg
                            border border-[var(--border)]
                            bg-[var(--surface)] px-3
                            text-sm text-[var(--foreground)]
                            outline-none focus:border-[var(--brand)]
                            focus:ring-2 focus:ring-[var(--brand)]/20
                          "
                        />
                      </div>

                      <div className="mt-4">
                        <label
                          htmlFor="settings-confirm-password"
                          className="block text-sm font-medium text-[var(--foreground)]"
                        >
                          Confirm new password
                        </label>

                        <input
                          id="settings-confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          minLength={1}
                          maxLength={128}
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          className="
                            mt-2 min-h-11 w-full rounded-lg
                            border border-[var(--border)]
                            bg-[var(--surface)] px-3
                            text-sm text-[var(--foreground)]
                            outline-none focus:border-[var(--brand)]
                            focus:ring-2 focus:ring-[var(--brand)]/20
                          "
                        />
                      </div>

                      <label className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={(event) =>
                            setShowPassword(event.target.checked)
                          }
                        />
                        Show passwords
                      </label>

                      <p className="mt-2 text-xs leading-5 text-[var(--foreground-secondary)]">
                        Your new password must not exceed 128 characters.
                        Choose a strong password that you do not use for
                        another account.
                      </p>

                      {passwordFeedback && (
                        <Feedback {...passwordFeedback} />
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={passwordMutation.isLoading}
                          className="
                            min-h-10 rounded-lg bg-[var(--brand)]
                            px-4 text-sm font-semibold text-white
                            transition hover:opacity-90
                            disabled:cursor-not-allowed disabled:opacity-60
                          "
                        >
                          {passwordMutation.isLoading
                            ? 'Changing password…'
                            : 'Change password'}
                        </button>

                        <button
                          type="button"
                          onClick={cancelPasswordEditor}
                          disabled={passwordMutation.isLoading}
                          className="
                            min-h-10 rounded-lg border
                            border-[var(--border)] px-4
                            text-sm font-medium text-[var(--foreground)]
                            disabled:opacity-60
                          "
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {editingSection !== 'password' &&
                    passwordFeedback && (
                      <Feedback {...passwordFeedback} />
                    )}
                </div>
              </section>
            </>
          )}

          {/* Security Reminder */}
          <aside className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="text-lg">
                ⓘ
              </span>

              <div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  Keep your account secure
                </h2>

                <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                  Only update account information that belongs to you. Some
                  changes may require additional verification.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
