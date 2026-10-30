// -----------------------------------------------------------------------------
// Financial Payment Provider — Update Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for updating an existing provider's details.
//
// The provider public ID is supplied through the route parameter.
// -----------------------------------------------------------------------------

// NestJS Swagger
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Class Transformer
import { Transform, type TransformFnParams } from 'class-transformer';

// Class Validator
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class UpdateFinancialPaymentProviderRequestDto {
  // ===========================================================================
  // Provider Name
  // ===========================================================================

  @ApiProperty({
    example: 'M-Pesa Kenya',
    description: 'Updated display name of the payment provider.',
    maxLength: 120,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this update.',
    nullable: true,
    maxLength: 128,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  causationId?: string;
}

// Default Export
export default UpdateFinancialPaymentProviderRequestDto;
