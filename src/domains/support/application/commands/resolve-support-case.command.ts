// -----------------------------------------------------------------------------
// Support — Resolve Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for resolving a Support Case.
//
// The command expresses the intent to resolve a Support Case with a recorded
// resolution.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the resolution type;
// - carry the resolution summary;
// - carry the resolver public identity;
// - optionally carry the resolution timestamp;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - load the SupportCaseAggregate;
// - create SupportCaseResolutionEntity;
// - mutate SupportCaseEntity;
// - validate resolution rules;
// - access repositories;
// - access Prisma;
// - emit domain events.
//
// The SupportCaseAggregate owns resolution creation and the transition into
// RESOLVED.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

import type { SupportCaseResolutionType } from '../../domain/value-objects/support-case-resolution-type.vo';

import type { SupportCaseResolutionSummary } from '../../domain/value-objects/support-case-resolution-summary.vo';

import type { SupportCaseResolutionResolvedByPublicId } from '../../domain/value-objects/support-case-resolution-resolved-by-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class ResolveSupportCaseCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly resolutionType: SupportCaseResolutionType,

    public readonly resolutionSummary: SupportCaseResolutionSummary,

    public readonly resolvedByPublicId: SupportCaseResolutionResolvedByPublicId,

    public readonly correlationId: string,

    public readonly resolvedAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default ResolveSupportCaseCommand;
