// -----------------------------------------------------------------------------
// Notification Preference — Update Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for updating a Notification Preference aggregate.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root entity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - receive UpdateNotificationPreferenceCommand;
// - retrieve the Notification Preference aggregate;
// - apply the requested Journey preference;
// - apply the requested Booking preference;
// - apply the requested Payment preference;
// - apply the requested Wallet preference;
// - apply the requested Trust preference;
// - apply the requested Verification preference;
// - apply the requested Message preference;
// - apply the requested Support preference;
// - apply the requested System preference;
// - update the aggregate timestamp;
// - record NotificationPreferenceUpdatedEvent;
// - persist the aggregate;
// - return the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - mutate persistence records directly;
// - validate Identity member existence;
// - authorize the caller;
// - implement notification delivery rules;
// - send notifications;
// - publish domain events directly.
//
// Preference state mutation is delegated to the aggregate/entity boundary.
//
// -----------------------------------------------------------------------------
//
// Workflow:
//
// 1. Retrieve NotificationPreferenceAggregate by public identity.
// 2. Fail if the aggregate does not exist.
// 3. Apply all requested preference states through the aggregate.
// 4. Apply the optional update timestamp.
// 5. Record NotificationPreferenceUpdatedEvent.
// 6. Persist the aggregate.
// 7. Return the aggregate.
//
// -----------------------------------------------------------------------------
//
// Update semantics:
//
// The command carries the complete desired preference state.
//
// Each preference is delegated to the aggregate rather than modifying the
// NotificationPreferenceEntity directly.
//
// The aggregate/entity is therefore responsible for:
//
// - validating the preference values;
// - maintaining entity invariants;
// - updating modification timestamps;
// - preserving the aggregate boundary.
//
// -----------------------------------------------------------------------------
//
// Timestamp semantics:
//
// Each preference setter may update the entity timestamp through its domain
// mutation mechanism.
//
// The explicit setUpdatedAt() call establishes the command/application
// timestamp as the final update timestamp.
//
// If no timestamp is supplied by the command, the current application time
// is used.
//
// -----------------------------------------------------------------------------
//
// Event semantics:
//
// The handler records NotificationPreferenceUpdatedEvent after all requested
// state changes have been applied successfully.
//
// The event therefore represents the resulting preference state rather than
// an intermediate state.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import { UpdateNotificationPreferenceCommand } from '../commands/update-notification-preference.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { NotificationPreferenceAggregate } from '../../domain/aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { NotificationPreferenceRepository } from '../../domain/repositories/notification-preference.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from '../../domain/exceptions/notification.exception';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class UpdateNotificationPreferenceHandler implements CommandHandler<
  UpdateNotificationPreferenceCommand,
  NotificationPreferenceAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE)
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Update Notification Preference command.
   *
   * The handler retrieves the aggregate and delegates all preference
   * mutations through the aggregate boundary.
   *
   * The handler does not mutate the entity's internal state directly.
   */
  public async execute(
    command: UpdateNotificationPreferenceCommand,
  ): Promise<NotificationPreferenceAggregate> {
    // -------------------------------------------------------------------------
    // Retrieve Aggregate
    // -------------------------------------------------------------------------

    const aggregate =
      await this.notificationPreferenceRepository.findByPublicId(
        command.preferencePublicId,
      );

    // -------------------------------------------------------------------------
    // Aggregate Not Found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new NotificationException(
        `Notification preference '${command.preferencePublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Apply Journey Preference
    // -------------------------------------------------------------------------

    aggregate.setJourneyEnabled(command.journeyEnabled);

    // -------------------------------------------------------------------------
    // Apply Booking Preference
    // -------------------------------------------------------------------------

    aggregate.setBookingEnabled(command.bookingEnabled);

    // -------------------------------------------------------------------------
    // Apply Payment Preference
    // -------------------------------------------------------------------------

    aggregate.setPaymentEnabled(command.paymentEnabled);

    // -------------------------------------------------------------------------
    // Apply Wallet Preference
    // -------------------------------------------------------------------------

    aggregate.setWalletEnabled(command.walletEnabled);

    // -------------------------------------------------------------------------
    // Apply Trust Preference
    // -------------------------------------------------------------------------

    aggregate.setTrustEnabled(command.trustEnabled);

    // -------------------------------------------------------------------------
    // Apply Verification Preference
    // -------------------------------------------------------------------------

    aggregate.setVerificationEnabled(command.verificationEnabled);

    // -------------------------------------------------------------------------
    // Apply Message Preference
    // -------------------------------------------------------------------------

    aggregate.setMessageEnabled(command.messageEnabled);

    // -------------------------------------------------------------------------
    // Apply Support Preference
    // -------------------------------------------------------------------------

    aggregate.setSupportEnabled(command.supportEnabled);

    // -------------------------------------------------------------------------
    // Apply System Preference
    // -------------------------------------------------------------------------

    aggregate.setSystemEnabled(command.systemEnabled);

    // -------------------------------------------------------------------------
    // Update Timestamp
    // -------------------------------------------------------------------------
    //
    // The command may provide an explicit timestamp.
    //
    // When omitted, the application layer supplies the current time.
    //
    // Timestamp validation remains inside the aggregate/entity boundary.
    //

    aggregate.setUpdatedAt(command.updatedAt ?? new Date());

    // -------------------------------------------------------------------------
    // Record Updated Event
    // -------------------------------------------------------------------------

    aggregate.recordUpdated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.notificationPreferenceRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return Aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default UpdateNotificationPreferenceHandler;
