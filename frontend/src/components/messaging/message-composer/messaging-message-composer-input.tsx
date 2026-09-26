// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Composer Input
// -----------------------------------------------------------------------------
//
// Controlled text input for the Messaging composer.
//
// Responsibilities:
// - Render the message draft input.
// - Report draft changes to the composer.
// - Submit the surrounding form when Enter is pressed.
//
// Non-responsibilities:
// - Sending messages.
// - Mutation state.
// - API communication.
// - Conversation authorization.
// -----------------------------------------------------------------------------

'use client';

import type {
  ChangeEvent,
  KeyboardEvent,
} from 'react';

import { Input } from '@/components/ui';

export interface MessagingMessageComposerInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
}

export function MessagingMessageComposerInput({
  value,
  onChange,
  disabled = false,
}: MessagingMessageComposerInputProps) {
  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    onChange(event.target.value);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <Input
      id="messaging-message"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      autoComplete="off"
      placeholder="Write a message..."
      aria-label="Message"
      fullWidth
    />
  );
}