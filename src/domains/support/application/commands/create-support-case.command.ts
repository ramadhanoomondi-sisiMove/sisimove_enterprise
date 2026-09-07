// -----------------------------------------------------------------------------
// Support — Create Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Support Case aggregate.
//
// The command expresses the intent to create a Support Case.
//
// Responsibilities:
//
// - carry the requester public identity;
// - carry the Support Case priority;
// - carry the Support Case category;
// - carry the Support Case subject;
// - carry correlation metadata;
// - optionally carry the Support Case description;
// - optionally carry reference metadata;
// - optionally carry causation metadata.
//
// This command does NOT:
//
// - create the SupportCaseEntity;
// - create the SupportCaseAggregate;
// - validate Support Case business rules;
// - access repositories;
// - access Prisma;
// - mutate domain entities;
// - emit domain events;
// - resolve Identity references;
// - resolve referenced domains.
//
// SupportCaseAggregate creation and domain behavior belong to the
// Support Case domain/application handler.
//
// The command intentionally does not carry SupportCaseStatus.
// A newly created Support Case receives its initial OPEN status from
// the application/domain creation flow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Support Case — Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseRequesterPublicId } from '../../domain/value-objects/support-case-requester-public-id.vo';

import type { SupportCasePriority } from '../../domain/value-objects/support-case-priority.vo';

import type { SupportCaseCategory } from '../../domain/value-objects/support-case-category.vo';

import type { SupportCaseSubject } from '../../domain/value-objects/support-case-subject.vo';

import type { SupportCaseDescription } from '../../domain/value-objects/support-case-description.vo';

import type { SupportCaseReferenceType } from '../../domain/value-objects/support-case-reference-type.vo';

import type { SupportCaseReferencePublicId } from '../../domain/value-objects/support-case-reference-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class CreateSupportCaseCommand implements Command {
  public constructor(
    // -------------------------------------------------------------------------
    // Requester
    // -------------------------------------------------------------------------

    public readonly requesterPublicId: SupportCaseRequesterPublicId,

    // -------------------------------------------------------------------------
    // Case
    // -------------------------------------------------------------------------

    public readonly priority: SupportCasePriority,

    public readonly category: SupportCaseCategory,

    public readonly subject: SupportCaseSubject,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    public readonly correlationId: string,

    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Description
    // -------------------------------------------------------------------------

    public readonly description?: SupportCaseDescription,

    // -------------------------------------------------------------------------
    // Cross-domain reference
    // -------------------------------------------------------------------------

    public readonly referenceType?: SupportCaseReferenceType,

    public readonly referencePublicId?: SupportCaseReferencePublicId,
  ) {}
}

export default CreateSupportCaseCommand;
