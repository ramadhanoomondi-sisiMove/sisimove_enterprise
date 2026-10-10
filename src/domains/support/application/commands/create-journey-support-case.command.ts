// -----------------------------------------------------------------------------
// Support — Create Journey Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Support Case associated with a Journey.
//
// Responsibilities:
//
// - carry the authenticated requester's public identity;
// - carry the selected Journey's public identity;
// - carry the requested Support Case priority, category, subject and description;
// - carry correlation and causation identifiers.
//
// This command does NOT:
//
// - load or validate the Journey;
// - authorize the requester;
// - create or persist the Support Case;
// - access Prisma directly.
//
// Journey validation and requester authorization belong to the application
// workflow. Support Case creation and persistence remain delegated to the
// existing CreateSupportCaseHandler.
//
// The Journey reference uses its public identifier, never its internal ID.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCaseRequesterPublicId } from '../../domain/value-objects/support-case-requester-public-id.vo';

import type { SupportCasePriority } from '../../domain/value-objects/support-case-priority.vo';

import type { SupportCaseCategory } from '../../domain/value-objects/support-case-category.vo';

import type { SupportCaseSubject } from '../../domain/value-objects/support-case-subject.vo';

import type { SupportCaseDescription } from '../../domain/value-objects/support-case-description.vo';

import type { SupportCaseReferencePublicId } from '../../domain/value-objects/support-case-reference-public-id.vo';

export class CreateJourneySupportCaseCommand implements Command {
  public constructor(
    public readonly requesterPublicId: SupportCaseRequesterPublicId,

    public readonly journeyPublicId: SupportCaseReferencePublicId,

    public readonly priority: SupportCasePriority,

    public readonly category: SupportCaseCategory,

    public readonly subject: SupportCaseSubject,

    public readonly correlationId: string,

    public readonly causationId?: string,

    public readonly description?: SupportCaseDescription,
  ) {}
}

export default CreateJourneySupportCaseCommand;
