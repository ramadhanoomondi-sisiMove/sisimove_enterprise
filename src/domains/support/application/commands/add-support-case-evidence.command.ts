// -----------------------------------------------------------------------------
// Support — Add Support Case Evidence Command
// -----------------------------------------------------------------------------
//
// Application command for adding evidence to a Support Case.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the submitting member public identity;
// - carry the asset identity;
// - optionally carry an evidence description;
// - carry correlation/causation metadata.
//
// Evidence lifecycle behavior remains inside:
//
// - SupportCaseAggregate;
// - SupportCaseEvidenceEntity.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseEvidenceSubmittedByPublicId } from '../../domain/value-objects/support-case-evidence-submitted-by-public-id.vo';
import type { SupportCaseEvidenceAssetId } from '../../domain/value-objects/support-case-evidence-asset-id.vo';
import type { SupportCaseEvidenceDescription } from '../../domain/value-objects/support-case-evidence-description.vo';

export class AddSupportCaseEvidenceCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
    public readonly submittedByPublicId: SupportCaseEvidenceSubmittedByPublicId,
    public readonly assetId: SupportCaseEvidenceAssetId,
    public readonly correlationId: string,
    public readonly description:
      SupportCaseEvidenceDescription | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default AddSupportCaseEvidenceCommand;
