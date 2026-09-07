// -----------------------------------------------------------------------------
// Support Case Evidence — Entity
// -----------------------------------------------------------------------------
//
// Represents evidence submitted in relation to a Support Case.
//
// Aggregate:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// SupportCaseEvidenceEntity is a child entity owned by the
// SupportCaseAggregate.
//
// The entity records:
// - the evidence public identity;
// - the Identity member who submitted the evidence;
// - the Asset containing the evidence;
// - an optional description;
// - the creation timestamp.
//
// The entity does NOT contain:
// - caseId;
// - Prisma relations;
// - repository access;
// - Asset domain objects;
// - Identity domain objects.
//
// The aggregate owns the relationship between the Support Case and
// its evidence.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseEvidencePublicId } from '../value-objects/support-case-evidence-public-id.vo';
import type { SupportCaseEvidenceSubmittedByPublicId } from '../value-objects/support-case-evidence-submitted-by-public-id.vo';
import type { SupportCaseEvidenceAssetId } from '../value-objects/support-case-evidence-asset-id.vo';
import type { SupportCaseEvidenceDescription } from '../value-objects/support-case-evidence-description.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseEvidenceAssetInvalidException } from '../exceptions/support-case-evidence-asset-invalid.exception';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface SupportCaseEvidenceProps {
  submittedByPublicId: SupportCaseEvidenceSubmittedByPublicId;
  assetId: SupportCaseEvidenceAssetId;
  description?: SupportCaseEvidenceDescription;

  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents evidence submitted for a Support Case.
 *
 * Evidence belongs to the SupportCaseAggregate and is managed through
 * aggregate-level behavior.
 */
export class SupportCaseEvidenceEntity extends Entity<
  SupportCaseEvidenceProps,
  SupportCaseEvidencePublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: SupportCaseEvidenceProps,
    id?: UniqueEntityId,
    publicId?: SupportCaseEvidencePublicId,
  ) {
    super(
      {
        ...props,
        createdAt: new Date(props.createdAt),
      },
      id,
      publicId,
    );

    this.validateInvariants();
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Support Case Evidence entity.
   */
  public static create(props: {
    submittedByPublicId: SupportCaseEvidenceSubmittedByPublicId;
    assetId: SupportCaseEvidenceAssetId;
    description?: SupportCaseEvidenceDescription;
    createdAt?: Date;
  }): SupportCaseEvidenceEntity {
    const now = new Date();

    return new SupportCaseEvidenceEntity({
      submittedByPublicId: props.submittedByPublicId,
      assetId: props.assetId,
      ...(props.description !== undefined
        ? { description: props.description }
        : {}),
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an existing Support Case Evidence entity.
   *
   * Intended for repository/infrastructure mapping.
   */
  public static rehydrate(
    props: SupportCaseEvidenceProps,
    id: UniqueEntityId,
    publicId: SupportCaseEvidencePublicId,
  ): SupportCaseEvidenceEntity {
    return new SupportCaseEvidenceEntity(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public get evidencePublicId(): SupportCaseEvidencePublicId {
    return this.publicId;
  }

  // ---------------------------------------------------------------------------
  // Evidence
  // ---------------------------------------------------------------------------

  /**
   * Returns the Identity member who submitted the evidence.
   *
   * This is an opaque cross-domain reference.
   */
  public get submittedByPublicId(): SupportCaseEvidenceSubmittedByPublicId {
    return this.props.submittedByPublicId;
  }

  /**
   * Returns the Asset reference containing the evidence.
   *
   * This is an opaque cross-domain reference.
   */
  public get assetId(): SupportCaseEvidenceAssetId {
    return this.props.assetId;
  }

  /**
   * Returns the optional evidence description.
   */
  public get description(): SupportCaseEvidenceDescription | undefined {
    return this.props.description;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  // ---------------------------------------------------------------------------
  // Domain Behavior
  // ---------------------------------------------------------------------------

  /**
   * Changes the member who submitted the evidence.
   *
   * This should normally be used only for legitimate domain corrections.
   */
  public changeSubmittedBy(
    submittedByPublicId: SupportCaseEvidenceSubmittedByPublicId,
  ): void {
    this.props.submittedByPublicId = submittedByPublicId;
  }

  /**
   * Replaces the Asset associated with the evidence.
   */
  public changeAsset(assetId: SupportCaseEvidenceAssetId): void {
    this.validateAsset(assetId);

    this.props.assetId = assetId;
  }

  /**
   * Changes the optional evidence description.
   *
   * When no description is supplied, the optional property is removed
   * rather than explicitly assigned undefined.
   */
  public changeDescription(description?: SupportCaseEvidenceDescription): void {
    if (description === undefined) {
      delete this.props.description;
      return;
    }

    this.props.description = description;
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    this.validateAsset(this.props.assetId);
    this.validateCreatedAt(this.props.createdAt);
  }

  private validateAsset(assetId: SupportCaseEvidenceAssetId): void {
    if (!assetId || !assetId.value.trim()) {
      throw new SupportCaseEvidenceAssetInvalidException();
    }
  }

  private validateCreatedAt(createdAt: Date): void {
    if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
      throw new Error(
        'Support case evidence creation timestamp must be a valid date.',
      );
    }
  }
}
