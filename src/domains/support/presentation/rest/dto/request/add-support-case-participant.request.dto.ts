// -----------------------------------------------------------------------------
// Support — Add Support Case Participant Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for adding a member as a participant in a Support Case.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class AddSupportCaseParticipantRequestDto {
  // ---------------------------------------------------------------------------
  // Member
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member being added to the Support Case.
   *
   * This remains an opaque Identity reference at the transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly memberPublicId!: string;

  // ---------------------------------------------------------------------------
  // Role
  // ---------------------------------------------------------------------------

  /**
   * Role of the member within the Support Case.
   *
   * The domain value object is responsible for validating supported roles.
   */
  @IsString()
  @IsNotEmpty()
  public readonly role!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AddSupportCaseParticipantRequestDto;
