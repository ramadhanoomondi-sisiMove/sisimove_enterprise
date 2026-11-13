// -----------------------------------------------------------------------------
// Accounting Domain — Event Registry
// -----------------------------------------------------------------------------
//
// Central registry responsible for rehydrating Accounting domain events.
//
// Registered event families:
// 1. Accounting Account
// 2. Accounting Period
// 3. Accounting Journal
//
// Responsibilities:
// - Register supported Accounting domain events.
// - Resolve event rehydrators using event name and version.
// - Rehydrate events using their static rehydrate() methods.
// - Preserve original event metadata.
// - Reject unsupported event names and versions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Domain Events
// -----------------------------------------------------------------------------

import type {
  DomainEvent,
  EventMetadata,
} from '../../../../../foundation/kernel/domain/domain-event';

// =============================================================================
// Accounting Account Events
// =============================================================================

import { AccountingAccountCreatedEvent } from '../accounting-account-created.event';
import { AccountingAccountActivatedEvent } from '../accounting-account-activated.event';
import { AccountingAccountInactivatedEvent } from '../accounting-account-inactivated.event';
import { AccountingAccountClosedEvent } from '../accounting-account-closed.event';

// =============================================================================
// Accounting Period Events
// =============================================================================

import { AccountingPeriodOpenedEvent } from '../accounting-period-opened.event';
import { AccountingPeriodClosedEvent } from '../accounting-period-closed.event';

// =============================================================================
// Accounting Journal Events
// =============================================================================

import { AccountingJournalCreatedEvent } from '../accounting-journal-created.event';
import { AccountingJournalPostedEvent } from '../accounting-journal-posted.event';
import { AccountingJournalReversedEvent } from '../accounting-journal-reversed.event';

// =============================================================================
// Event Rehydrator
// =============================================================================

type AccountingEventRehydrator = (
  metadata: EventMetadata,
  payload: Record<string, unknown>,
) => DomainEvent;

// =============================================================================
// Accounting Event Registry
// =============================================================================

export class AccountingEventRegistry {
  // ===========================================================================
  // Registered Event Rehydrators
  // ===========================================================================

  private readonly rehydrators = new Map<string, AccountingEventRehydrator>([
    // =========================================================================
    // Accounting Account
    // =========================================================================

    [
      'AccountingAccountCreated:1',
      (metadata, payload): DomainEvent =>
        AccountingAccountCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'AccountingAccountActivated:1',
      (metadata, payload): DomainEvent =>
        AccountingAccountActivatedEvent.rehydrate(metadata, payload),
    ],
    [
      'AccountingAccountInactivated:1',
      (metadata, payload): DomainEvent =>
        AccountingAccountInactivatedEvent.rehydrate(metadata, payload),
    ],
    [
      'AccountingAccountClosed:1',
      (metadata, payload): DomainEvent =>
        AccountingAccountClosedEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Accounting Period
    // =========================================================================

    [
      'AccountingPeriodOpened:1',
      (metadata, payload): DomainEvent =>
        AccountingPeriodOpenedEvent.rehydrate(metadata, payload),
    ],
    [
      'AccountingPeriodClosed:1',
      (metadata, payload): DomainEvent =>
        AccountingPeriodClosedEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Accounting Journal
    // =========================================================================

    [
      'AccountingJournalCreated:1',
      (metadata, payload): DomainEvent =>
        AccountingJournalCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'AccountingJournalPosted:1',
      (metadata, payload): DomainEvent =>
        AccountingJournalPostedEvent.rehydrate(metadata, payload),
    ],
    [
      'AccountingJournalReversed:1',
      (metadata, payload): DomainEvent =>
        AccountingJournalReversedEvent.rehydrate(metadata, payload),
    ],
  ]);

  // ===========================================================================
  // Supports
  // ===========================================================================

  public supports(eventName: string, eventVersion: number): boolean {
    return this.rehydrators.has(`${eventName}:${eventVersion}`);
  }

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): DomainEvent {
    const key = `${metadata.eventName}:${metadata.eventVersion}`;

    const rehydrator = this.rehydrators.get(key);

    if (!rehydrator) {
      throw new Error(
        `Unsupported Accounting event: ${metadata.eventName} ` +
          `version ${metadata.eventVersion}`,
      );
    }

    return rehydrator(metadata, payload);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default AccountingEventRegistry;
