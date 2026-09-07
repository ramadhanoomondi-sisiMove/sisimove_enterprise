// -----------------------------------------------------------------------------
// Support — Add Support Case Note Command
// -----------------------------------------------------------------------------
//
// Application command for adding an internal note to a Support Case.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the note author public identity;
// - carry the note content;
// - carry correlation/causation metadata.
//
// Note lifecycle behavior remains inside:
//
// - SupportCaseAggregate;
// - SupportCaseNoteEntity.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseNoteAuthorPublicId } from '../../domain/value-objects/support-case-note-author-public-id.vo';
import type { SupportCaseNoteContent } from '../../domain/value-objects/support-case-note-content.vo';

export class AddSupportCaseNoteCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
    public readonly authorPublicId: SupportCaseNoteAuthorPublicId,
    public readonly content: SupportCaseNoteContent,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}

export default AddSupportCaseNoteCommand;
