// -----------------------------------------------------------------------------
// Journey Completion Confirmation Added Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyCompletionDomainEvent } from './journey-completion-domain.event';

// -----------------------------------------------------------------------------
// Journey Completion Confirmation Added
// -----------------------------------------------------------------------------

/**
 * Raised when a member adds a confirmation to a Journey Completion.
 *
 * The event records the confirmation identity, member identity, optional
 * Journey Booking reference, confirmation role, and resulting confirmation
 * count.
 *
 * Internal persistence identifiers are used only for aggregate identity and
 * are never exposed as cross-domain references in the event payload.
 */
export class JourneyCompletionConfirmationAddedEvent extends JourneyCompletionDomainEvent {
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
    confirmedAt: Date,
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
      'JourneyCompletionConfirmationAdded',
      correlationId ?? journeyCompletionId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.confirmationPublicId = confirmationPublicId;
    this.memberPublicId = memberPublicId;
    this.bookingPublicId = bookingPublicId;
    this.role = role;
    this.confirmedAt = new Date(confirmedAt.getTime());
    this.confirmedCount = confirmedCount;
    this.requiredConfirmations = requiredConfirmations;

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Confirmation
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the confirmation that was added.
   */
  public readonly confirmationPublicId: string;

  /**
   * Public identity of the member who added the confirmation.
   */
  public readonly memberPublicId: string;

  /**
   * Optional public identity of the Journey Booking associated with the
   * confirming passenger.
   */
  public readonly bookingPublicId: string | undefined;

  /**
   * Role of the member providing the confirmation.
   */
  public readonly role: string;

  /**
   * Time at which the confirmation was added.
   */
  public readonly confirmedAt: Date;

  // ---------------------------------------------------------------------------
  // Confirmation Tracking
  // ---------------------------------------------------------------------------

  /**
   * Number of active confirmations after this confirmation was added.
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
      confirmedAt: this.confirmedAt,
      confirmedCount: this.confirmedCount,
      requiredConfirmations: this.requiredConfirmations,
    };
  }
}
