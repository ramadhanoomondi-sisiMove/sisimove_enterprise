// -----------------------------------------------------------------------------
// Journey Completion Confirmation Withdrawn Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Confirmation Withdrawn
// -----------------------------------------------------------------------------

/**
 * Raised when an existing Journey Completion confirmation is withdrawn.
 *
 * The event records the confirmation being withdrawn, the member who owns
 * that confirmation, the confirmation role, the withdrawal timestamp, and
 * the resulting confirmation count.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionConfirmationWithdrawnEvent extends JourneyCompletionDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    journeyCompletionId: string,
    publicId: string,
    journeyPublicId: string,
    providerPublicId: string,
    confirmationPublicId: string,
    memberPublicId: string,
    role: string,
    withdrawnAt: Date,
    confirmedCount: number,
    requiredConfirmations: number,
    bookingPublicId?: string,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyCompletionId,
      publicId,
      journeyPublicId,
      providerPublicId,
      'JourneyCompletionConfirmationWithdrawn',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.confirmationPublicId = confirmationPublicId;
    this.memberPublicId = memberPublicId;
    this.bookingPublicId = bookingPublicId;
    this.role = role;
    this.withdrawnAt = new Date(withdrawnAt.getTime());
    this.confirmedCount = confirmedCount;
    this.requiredConfirmations = requiredConfirmations;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Confirmation
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the confirmation that was withdrawn.
   */
  public readonly confirmationPublicId: string;

  /**
   * Public identity of the member who owned the confirmation.
   */
  public readonly memberPublicId: string;

  /**
   * Optional public identity of the Journey Booking associated with the
   * passenger confirmation.
   */
  public readonly bookingPublicId: string | undefined;

  /**
   * Role of the member who originally provided the confirmation.
   */
  public readonly role: string;

  /**
   * Time at which the confirmation was withdrawn.
   */
  public readonly withdrawnAt: Date;

  // ---------------------------------------------------------------------------
  // Confirmation Tracking
  // ---------------------------------------------------------------------------

  /**
   * Number of active confirmations remaining after withdrawal.
   */
  public readonly confirmedCount: number;

  /**
   * Number of confirmations required for completion confirmation.
   */
  public readonly requiredConfirmations: number;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      confirmationPublicId: this.confirmationPublicId,
      memberPublicId: this.memberPublicId,
      ...(this.bookingPublicId !== undefined
        ? {
            bookingPublicId: this.bookingPublicId,
          }
        : {}),
      role: this.role,
      withdrawnAt: this.withdrawnAt,
      confirmedCount: this.confirmedCount,
      requiredConfirmations: this.requiredConfirmations,
    };
  }
}
