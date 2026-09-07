// -----------------------------------------------------------------------------
// Support — Delete Support Case Message Command
// -----------------------------------------------------------------------------
//
// Application command for deleting a Support Case message.
//
// Deletion is represented as a soft deletion through deletedAt.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the message public identity;
// - optionally carry the deletion timestamp;
// - carry correlation/causation metadata.
//
// Message lifecycle behavior remains inside:
//
// - SupportCaseAggregate;
// - SupportCaseMessageEntity.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseMessagePublicId } from '../../domain/value-objects/support-case-message-public-id.vo';

export class DeleteSupportCaseMessageCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
    public readonly messagePublicId: SupportCaseMessagePublicId,
    public readonly correlationId: string,
    public readonly deletedAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default DeleteSupportCaseMessageCommand;
