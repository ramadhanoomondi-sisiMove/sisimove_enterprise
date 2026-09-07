// -----------------------------------------------------------------------------
// Support — Create Support Case Resolution Command
// -----------------------------------------------------------------------------
//
// Application command for creating a resolution for a Support Case.
//
// Creating the resolution does not itself transition the Support Case to
// RESOLVED. Resolution creation and case resolution are separate aggregate
// operations.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the resolution type;
// - carry the resolution summary;
// - carry the resolving member public identity;
// - optionally carry the resolution timestamp;
// - carry correlation/causation metadata.
//
// Resolution creation behavior remains inside:
//
// - SupportCaseAggregate;
// - SupportCaseResolutionEntity.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseResolutionType } from '../../domain/value-objects/support-case-resolution-type.vo';
import type { SupportCaseResolutionSummary } from '../../domain/value-objects/support-case-resolution-summary.vo';
import type { SupportCaseResolutionResolvedByPublicId } from '../../domain/value-objects/support-case-resolution-resolved-by-public-id.vo';

export class CreateSupportCaseResolutionCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
    public readonly type: SupportCaseResolutionType,
    public readonly summary: SupportCaseResolutionSummary,
    public readonly resolvedByPublicId: SupportCaseResolutionResolvedByPublicId,
    public readonly correlationId: string,
    public readonly resolvedAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default CreateSupportCaseResolutionCommand;
