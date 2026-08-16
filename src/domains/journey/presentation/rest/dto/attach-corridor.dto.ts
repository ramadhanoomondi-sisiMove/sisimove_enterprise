import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class AttachCorridorDto {
  @ApiProperty({
    example: 'JRN-ABC12345',
    description: 'Public ID of the Journey to update.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  journeyPublicId!: string;

  @ApiProperty({
    example: 'JCO-ABC12345',
    description: 'Public ID of the Journey corridor to attach.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  corridorPublicId!: string;

  @ApiProperty({
    example: 'corr-01J8XYZ123',
    description: 'Correlation identifier for distributed tracing.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  correlationId!: string;

  @ApiPropertyOptional({
    example: 'cmd-01J8XYZ456',
    description: 'Optional causation identifier for distributed tracing.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  causationId?: string;
}
