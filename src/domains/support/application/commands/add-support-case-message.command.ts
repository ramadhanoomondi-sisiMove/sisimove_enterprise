// -----------------------------------------------------------------------------
// Support — Add Support Case Message Command
// -----------------------------------------------------------------------------
//
// Application command for adding a message to a Support Case.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the sender public identity;
// - carry the message type;
// - optionally carry message content;
// - optionally carry an asset identity;
// - optionally carry the message timestamp;
// - carry correlation/causation metadata.
//
// Message sender and lifecycle invariants remain inside:
//
// - SupportCaseAggregate;
// - SupportCaseMessageEntity.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseMessageSenderPublicId } from '../../domain/value-objects/support-case-message-sender-public-id.vo';
import type { SupportCaseMessageType } from '../../domain/value-objects/support-case-message-type.vo';
import type { SupportCaseMessageContent } from '../../domain/value-objects/support-case-message-content.vo';
import type { SupportCaseMessageAssetId } from '../../domain/value-objects/support-case-message-asset-id.vo';

export class AddSupportCaseMessageCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
    public readonly senderPublicId: SupportCaseMessageSenderPublicId,
    public readonly type: SupportCaseMessageType,
    public readonly correlationId: string,
    public readonly content: SupportCaseMessageContent | undefined = undefined,
    public readonly assetId: SupportCaseMessageAssetId | undefined = undefined,
    public readonly sentAt: Date | undefined = undefined,
    public readonly causationId?: string,
  ) {}
}

export default AddSupportCaseMessageCommand;
