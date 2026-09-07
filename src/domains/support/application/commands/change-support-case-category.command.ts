// -----------------------------------------------------------------------------
// Support — Change Support Case Category Command
// -----------------------------------------------------------------------------
//
// Application command for changing the category of a Support Case.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the new category;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - load the SupportCaseAggregate;
// - mutate SupportCaseEntity;
// - validate category transition rules;
// - access repositories;
// - access Prisma;
// - emit domain events.
//
// SupportCaseAggregate.changeCategory() owns the category change.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

import type { SupportCaseCategory } from '../../domain/value-objects/support-case-category.vo';

// =============================================================================
// Command
// =============================================================================

export class ChangeSupportCaseCategoryCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly category: SupportCaseCategory,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {}
}

export default ChangeSupportCaseCategoryCommand;
