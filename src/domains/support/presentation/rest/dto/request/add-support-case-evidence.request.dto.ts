// -----------------------------------------------------------------------------
// Support — Add Support Case Evidence Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for attaching evidence to a Support Case.
//
// Evidence references an asset managed outside the Support domain.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class AddSupportCaseEvidenceRequestDto {
  // ---------------------------------------------------------------------------
  // Submitter
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member submitting the evidence.
   *
   * This remains an opaque Identity reference at the transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly submittedByPublicId!: string;

  // ---------------------------------------------------------------------------
  // Asset
  // ---------------------------------------------------------------------------

  /**
   * Identifier of the asset containing the evidence.
   *
   * This remains an opaque asset reference at the Support transport boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly assetId!: string;

  // ---------------------------------------------------------------------------
  // Description
  // ---------------------------------------------------------------------------

  /**
   * Optional description explaining the relevance or contents of the evidence.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly description?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AddSupportCaseEvidenceRequestDto;
