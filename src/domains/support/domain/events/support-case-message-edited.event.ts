// -----------------------------------------------------------------------------
// Support Case — Message Edited Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an existing Support Case message is edited.
//
// The event exposes the resulting message state rather than persistence
// details.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseMessageEditedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly messagePublicId: string,
    public readonly content: string | undefined,
    public readonly assetId: string | undefined,
    public readonly editedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseMessageEdited',
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

      content: this.content,
      assetId: this.assetId,

      editedAt: new Date(this.editedAt.getTime()),
    };
  }
}
