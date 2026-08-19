// src/domains/journey-boarding/presentation/rest/dto/request/create-journey-boarding.dto.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Create Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for creating a Journey Boarding.
 *
 * This DTO belongs exclusively to the presentation layer and therefore
 * contains transport primitives rather than domain value objects.
 *
 * The presentation/application mapping layer is responsible for converting:
 *
 * - journeyId        → JourneyBoardingJourneyId
 * - providerPublicId → JourneyBoardingProviderPublicId
 *
 * before constructing CreateJourneyBoardingCommand.
 *
 * The Journey Boarding aggregate is created in NOT_STARTED state by the
 * application/domain layer.
 */
export class CreateJourneyBoardingDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Public identifier of the Journey for which boarding is being created.
   *
   * This is a cross-domain public identifier and is converted to
   * JourneyBoardingJourneyId before entering the application layer.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey for which the boarding process is being created.',
    example: 'JNY-01J8XYZ123',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  journeyId!: string;

  // ===========================================================================
  // Provider
  // ===========================================================================

  /**
   * Public identifier of the provider responsible for the Journey.
   *
   * This is a cross-domain member/provider identity and is converted to
   * JourneyBoardingProviderPublicId before entering the application layer.
   */
  @ApiProperty({
    description:
      'Public identifier of the provider responsible for the Journey.',
    example: 'MEM-01J8XYZ456',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  providerPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier used to trace the request through the application
   * and domain workflow.
   */
  @ApiProperty({
    description:
      'Identifier used to correlate this request with the originating workflow or distributed trace.',
    example: 'corr-01J8XYZ789',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this request.
   *
   * This value is propagated to the domain event when supplied.
   */
  @ApiPropertyOptional({
    description:
      'Identifier of the command or event that caused this request, when applicable.',
    example: 'cmd-01J8XYZABC',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateJourneyBoardingDto;
