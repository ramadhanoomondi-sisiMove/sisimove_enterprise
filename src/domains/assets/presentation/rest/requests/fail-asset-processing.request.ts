import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class FailAssetProcessingRequest {
  @ApiProperty({
    example: 'APR-7KQ9M2X',
    description: 'Public identifier of the processing job.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^APR-[A-Z0-9]+$/, {
    message:
      'assetProcessingPublicId must be a valid asset processing public identifier.',
  })
  assetProcessingPublicId!: string;

  @ApiProperty({
    example: 'ImageMagick failed to decode the uploaded image.',
    description: 'Reason why processing failed.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(500)
  failureReason!: string;

  @ApiProperty({
    example: {
      processor: 'ImageMagick',
      exitCode: 1,
      retryable: true,
    },
    description: 'Failure metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
