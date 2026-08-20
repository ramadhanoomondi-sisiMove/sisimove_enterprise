// -----------------------------------------------------------------------------
// Journey Settlement — Create Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for creating a Journey Settlement.
 *
 * The transport layer contains primitive values only.
 *
 * The Journey Completion aggregate identity is intentionally represented by
 * its internal UUID because JourneySettlementEntity stores `completionId`
 * as a UniqueEntityId.
 *
 * Domain value objects are constructed by the presentation/application
 * boundary before creating CreateJourneySettlementCommand.
 */
export class CreateJourneySettlementDto {
  // ===========================================================================
  // Journey Completion Internal ID
  // ===========================================================================

  /**
   * Internal identity of the Journey Completion aggregate.
   *
   * This corresponds to JourneySettlementEntity.completionId.
   */
  @ApiProperty({
    description:
      'Internal UUID of the Journey Completion aggregate associated with the settlement.',
    example: '4b9f4c8d-7a3b-4d1e-9f25-7c2e8b6d1a40',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  completionId!: string;

  // ===========================================================================
  // Journey Public ID
  // ===========================================================================

  /**
   * Public identity of the Journey.
   */
  @ApiProperty({
    description:
      'Public identifier of the Journey associated with the settlement.',
    example: 'JNY_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  journeyPublicId!: string;

  // ===========================================================================
  // Provider Public ID
  // ===========================================================================

  /**
   * Public identity of the provider.
   */
  @ApiProperty({
    description:
      'Public identifier of the provider associated with the settlement.',
    example: 'MEM_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  providerPublicId!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Application correlation identifier.
   */
  @ApiProperty({
    description:
      'Correlation identifier used for tracing the settlement command.',
    example: '9f4a8f1d-6a6e-4c2f-b9e6-1a2f31a8c741',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  correlationId!: string;

  // ===========================================================================
  // Causation ID
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @ApiPropertyOptional({
    description:
      'Optional causation identifier for the command or event chain.',
    example: '8e2e3f10-2a8f-45cc-91e8-53cf7d4b1920',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateJourneySettlementDto;
