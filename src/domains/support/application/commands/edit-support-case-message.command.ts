// -----------------------------------------------------------------------------
// Support — Edit Support Case Message Command
// -----------------------------------------------------------------------------
//
// Application command for editing a Support Case message.
//
// The command carries the new message content. The aggregate/entity enforce
// whether the message is eligible for editing.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the message public identity;
// - carry the replacement content;
// - carry correlation/causation metadata.
//
// Message editing rules remain inside:
//
// - SupportCaseAggregate;
// - SupportCaseMessageEntity.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseMessagePublicId } from '../../domain/value-objects/support-case-message-public-id.vo';
import type { SupportCaseMessageContent } from '../../domain/value-objects/support-case-message-content.vo';

export class EditSupportCaseMessageCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
    public readonly messagePublicId: SupportCaseMessagePublicId,
    public readonly content: SupportCaseMessageContent,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}

export default EditSupportCaseMessageCommand;
