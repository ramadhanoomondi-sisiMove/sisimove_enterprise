// -----------------------------------------------------------------------------
// Support Case — Note Added Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an internal Support Case note is added.
//
// Aggregate:
// SupportCaseAggregate
//
// Child entity:
// SupportCaseNoteEntity
//
// Notes are Support-domain information and are distinct from member-facing
// SupportCaseMessageEntity records.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseNoteAddedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly notePublicId: string,
    public readonly authorPublicId: string,
    public readonly content: string,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseNoteAdded', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      notePublicId: this.notePublicId,
      authorPublicId: this.authorPublicId,
      content: this.content,

      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
