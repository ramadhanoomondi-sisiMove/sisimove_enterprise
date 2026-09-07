// -----------------------------------------------------------------------------
// Support Case — Evidence Added Domain Event
// -----------------------------------------------------------------------------
//
// Raised when evidence is attached to a Support Case.
//
// The asset identifier is an opaque reference to the Asset bounded context.
// Support does not load or own the referenced Asset entity.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseEvidenceAddedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly evidencePublicId: string,
    public readonly submittedByPublicId: string,
    public readonly assetId: string,
    public readonly description: string | undefined,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseEvidenceAdded',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      evidencePublicId: this.evidencePublicId,
      submittedByPublicId: this.submittedByPublicId,

      assetId: this.assetId,
      description: this.description,

      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
