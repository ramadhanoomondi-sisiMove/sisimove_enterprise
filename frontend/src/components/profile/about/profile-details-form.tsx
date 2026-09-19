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
// -----------------------------------------------------------------------------

'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

export interface ProfileDetailsFormValues {
  handle: string;
  bio: string;
  country: string;
}

export interface ProfileDetailsFormProps {
  initialValues: ProfileDetailsFormValues;
  onSave?: (values: ProfileDetailsFormValues) => void;
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
      className="rounded-xl border border-border bg-background p-5"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="profile-handle"
            className="text-sm font-medium"
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
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-bio"
            className="text-sm font-medium"
          >
            Bio
          </label>

          <textarea
            id="profile-bio"
            name="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-country"
            className="text-sm font-medium"
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
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        {onSave !== undefined ? (
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
            >
              Save profile
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}