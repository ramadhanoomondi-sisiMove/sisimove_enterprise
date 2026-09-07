// -----------------------------------------------------------------------------
// Support Case — Message Added Domain Event
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseMessageAddedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly messagePublicId: string,
    public readonly senderPublicId: string,
    public readonly type: string,
    public readonly content: string | undefined,
    public readonly assetId: string | undefined,
    public readonly sentAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseMessageAdded', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      messagePublicId: this.messagePublicId,
      senderPublicId: this.senderPublicId,

      type: this.type,
      content: this.content,
      assetId: this.assetId,

      sentAt: new Date(this.sentAt.getTime()),
    };
  }
}
