// -----------------------------------------------------------------------------
// Support Case — Get Notes Query DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for retrieving all internal notes belonging to a Support Case.
//
// The Support Case public identity identifies the aggregate whose notes are
// requested.
//
// The DTO does NOT contain:
//
// - internal database identifiers;
// - domain entities;
// - domain value objects;
// - pagination parameters;
// - authorization data;
// - repository information.
//
// The transport value is converted into SupportCasePublicId by the
// application boundary before constructing GetSupportCaseNotesQuery.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class GetSupportCaseNotesQueryDto {
  // ---------------------------------------------------------------------------
  // Support Case
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Support Case whose notes are requested.
   *
   * This is an opaque Support Case reference at the transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly supportCasePublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCaseNotesQueryDto;
