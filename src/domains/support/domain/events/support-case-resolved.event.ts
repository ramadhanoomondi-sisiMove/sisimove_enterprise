// -----------------------------------------------------------------------------
// Support Case — Resolved Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a Support Case is resolved.
//
// Resolution details remain in the SupportCaseResolution child entity.
// The event exposes the resolution information required by consumers without
// exposing the persistence model.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseResolvedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly resolutionPublicId: string,
    public readonly resolutionType: string,
    public readonly summary: string,
    public readonly resolvedByPublicId: string,
    public readonly resolvedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(supportCaseId, 'SupportCaseResolved', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      resolutionPublicId: this.resolutionPublicId,
      resolutionType: this.resolutionType,
      summary: this.summary,

      resolvedByPublicId: this.resolvedByPublicId,

      resolvedAt: new Date(this.resolvedAt.getTime()),
    };
  }
}
