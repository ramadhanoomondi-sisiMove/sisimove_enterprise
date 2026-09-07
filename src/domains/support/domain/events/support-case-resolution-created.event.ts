// -----------------------------------------------------------------------------
// Support Case — Resolution Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a SupportCaseResolutionEntity is created for a Support Case.
//
// A Support Case may have at most one resolution, enforced by the aggregate
// and represented by the unique caseId constraint in persistence.
//
// This event represents creation of the resolution as a domain child entity.
// The SupportCaseResolvedEvent represents the corresponding case lifecycle
// transition to RESOLVED.
// -----------------------------------------------------------------------------

import { SupportCaseDomainEvent } from './support-case-domain.event';

// =============================================================================
// Event
// =============================================================================

export class SupportCaseResolutionCreatedEvent extends SupportCaseDomainEvent {
  public constructor(
    supportCaseId: string,
    public readonly publicId: string,
    public readonly resolutionPublicId: string,
    public readonly type: string,
    public readonly summary: string,
    public readonly resolvedByPublicId: string,
    public readonly resolvedAt: Date,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      supportCaseId,
      'SupportCaseResolutionCreated',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId,

      resolutionPublicId: this.resolutionPublicId,

      type: this.type,
      summary: this.summary,

      resolvedByPublicId: this.resolvedByPublicId,

      resolvedAt: new Date(this.resolvedAt.getTime()),
      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
