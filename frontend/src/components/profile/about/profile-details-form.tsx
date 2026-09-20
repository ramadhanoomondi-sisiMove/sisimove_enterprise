// -----------------------------------------------------------------------------
// sisiMove — Profile Details Form
// -----------------------------------------------------------------------------
//
// Authenticated profile form for editing basic traveller profile information.
//
// Responsibilities:
// - Present editable profile details.
// - Maintain local draft form state.
// - Submit the draft through the parent callback.
//
// Non-responsibilities:
// - Fetching profile data.
// - Persisting profile changes.
// - Validating domain rules.
// - Performing API requests.
//
// The parent/profile workflow owns persistence and supplies the initial values.
//
// Architectural note:
// - The form owns only temporary UI draft state.
// - `initialValues` are presentation inputs supplied by the parent.
// - Trimming is presentation-level input normalization immediately before
//   submission; domain validation remains the responsibility of the parent
//   workflow/backend.
// - No API client, mutation hook, or domain command is introduced here.
//
// Visual language:
// - Compact mobile-first profile surface.
// - Clear field hierarchy and restrained borders.
// - sisiMove blue focus treatment.
// - Primary save action uses the shared brand language.
// -----------------------------------------------------------------------------

'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

export interface ProfileDetailsFormValues {
  readonly handle: string;
  readonly bio: string;
  readonly country: string;
}

export interface ProfileDetailsFormProps {
  readonly initialValues: ProfileDetailsFormValues;
  readonly onSave?: (values: ProfileDetailsFormValues) => void;
}

export function ProfileDetailsForm({
  initialValues,
  onSave,
}: ProfileDetailsFormProps): ReactNode {
  const [handle, setHandle] = useState(initialValues.handle);
  const [bio, setBio] = useState(initialValues.bio);
  const [country, setCountry] = useState(initialValues.country);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onSave?.({
      handle: handle.trim(),
      bio: bio.trim(),
      country: country.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
    >
      <div className="space-y-5 p-4 sm:p-5">
        {/* -----------------------------------------------------------------
            Handle
        ----------------------------------------------------------------- */}
        <div className="space-y-2">
          <label
            htmlFor="profile-handle"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Handle
          </label>

          <input
            id="profile-handle"
            name="handle"
            type="text"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            autoComplete="username"
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
          />
        </div>

        {/* -----------------------------------------------------------------
            Bio
        ----------------------------------------------------------------- */}
        <div className="space-y-2">
          <label
            htmlFor="profile-bio"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Bio
          </label>

          <textarea
            id="profile-bio"
            name="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm leading-5 text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
          />
        </div>

        {/* -----------------------------------------------------------------
            Country
        ----------------------------------------------------------------- */}
        <div className="space-y-2">
          <label
            htmlFor="profile-country"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Country
          </label>

          <input
            id="profile-country"
            name="country"
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            autoComplete="country-name"
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
          />
        </div>

        {/* -----------------------------------------------------------------
            Save action
            -----------------------------------------------------------------
            Persistence remains owned by the parent workflow.
        ----------------------------------------------------------------- */}
        {onSave !== undefined ? (
          <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] sm:w-auto"
            >
              Save profile
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}