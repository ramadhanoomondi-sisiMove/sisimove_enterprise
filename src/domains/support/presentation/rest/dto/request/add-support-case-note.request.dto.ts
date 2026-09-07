// -----------------------------------------------------------------------------
// Support — Add Support Case Note Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for adding an internal note to a Support Case.
//
// Notes are internal Support Case records and are distinct from member-facing
// Support Case messages.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class AddSupportCaseNoteRequestDto {
  // ---------------------------------------------------------------------------
  // Author
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member or support agent creating the note.
   *
   * This remains an opaque Identity reference at the transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly authorPublicId!: string;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  /**
   * Content of the internal Support Case note.
   */
  @IsString()
  @IsNotEmpty()
  public readonly content!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AddSupportCaseNoteRequestDto;
