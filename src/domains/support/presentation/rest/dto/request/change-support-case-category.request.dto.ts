// -----------------------------------------------------------------------------
// Support — Change Support Case Category Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for changing the category of a Support Case.
//
// The category is represented as a string at the transport boundary and is
// converted into SupportCaseCategory by the application layer.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class ChangeSupportCaseCategoryRequestDto {
  // ---------------------------------------------------------------------------
  // Category
  // ---------------------------------------------------------------------------

  /**
   * New Support Case category.
   *
   * The domain value object is responsible for validating the supported
   * category values.
   */
  @IsString()
  @IsNotEmpty()
  public readonly category!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangeSupportCaseCategoryRequestDto;
