// -----------------------------------------------------------------------------
// Support Case — Message Deleted Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Support Case message is deleted.
//
// The message remains identifiable through its public identity. The event does
// not expose persistence-specific deletion mechanics.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseMessageDeletedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly messagePublicId: string,
    public readonly deletedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseMessageDeleted',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,
      messagePublicId: this.messagePublicId,

      deletedAt: new Date(this.deletedAt.getTime()),
    };
  }
}
