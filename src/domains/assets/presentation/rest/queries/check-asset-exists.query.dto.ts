// -----------------------------------------------------------------------------
// Assets — Check Asset Exists Query DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for checking whether an Asset exists.
//
// The request supports exactly one of the supported Asset lookup dimensions:
//
//     publicId
//     objectKey
//
// Exactly one lookup criterion must be supplied.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies exactly one:
//
//     publicId
//
// or:
//
//     objectKey
//
// The application/internal boundary converts the supplied transport primitive
// into the corresponding domain value object:
//
//     publicId  -> AssetPublicId
//     objectKey -> AssetObjectKey
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetPublicId as a domain value object;
// - AssetObjectKey as a domain value object;
// - Asset aggregate;
// - persistence identifiers;
// - storage-provider SDK types;
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Query responsibility:
//
// CheckAssetExistsQuery performs a read-only existence lookup.
//
// It does NOT:
//
// - modify Asset state;
// - modify physical storage;
// - perform lifecycle transitions;
// - communicate with a physical storage provider;
// - directly access Prisma.
//
// -----------------------------------------------------------------------------
//
// Validation:
//
// Exactly one supported lookup criterion must be supplied.
//
// A request containing both:
//
//     publicId
//     objectKey
//
// is invalid.
//
// A request containing neither value is also invalid.
//
// Individual values must be non-empty strings.
//
// Domain-level identifier validation remains the responsibility of the
// corresponding Asset value object.
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// Both supported lookup criteria are documented as optional because the
// request must contain exactly one of them.
//
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  type ValidationArguments,
  type ValidatorConstraintInterface,
} from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_OBJECT_KEY_LENGTH = 1;
const MAX_OBJECT_KEY_LENGTH = 1024;

// =============================================================================
// Transformation
// =============================================================================

const trimString = ({ value }: TransformFnParams): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim();
};

// =============================================================================
// Exactly-One Validator
// =============================================================================

class ExactlyOneAssetLookupConstraint implements ValidatorConstraintInterface {
  public validate(_value: unknown, args: ValidationArguments): boolean {
    const object = args.object as {
      publicId?: unknown;
      objectKey?: unknown;
    };

    const hasPublicId =
      typeof object.publicId === 'string' && object.publicId.trim().length > 0;

    const hasObjectKey =
      typeof object.objectKey === 'string' &&
      object.objectKey.trim().length > 0;

    return hasPublicId !== hasObjectKey;
  }

  public defaultMessage(): string {
    return 'Exactly one of publicId or objectKey must be supplied.';
  }
}

// =============================================================================
// DTO
// =============================================================================

export class CheckAssetExistsQueryDto {
  // ===========================================================================
  // Public Identifier
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'AS-5GH3MK',
    description:
      'Opaque public identifier of the Asset. Must not be supplied together with objectKey.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PUBLIC_ID_LENGTH)
  @MaxLength(MAX_PUBLIC_ID_LENGTH)
  @Validate(ExactlyOneAssetLookupConstraint)
  publicId?: string;

  // ===========================================================================
  // Storage Object Key
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'assets/AS-5GH3MK/profile/photo.jpg',
    description:
      'Opaque storage object key identifying the Asset. Must not be supplied together with publicId.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_OBJECT_KEY_LENGTH)
  @MaxLength(MAX_OBJECT_KEY_LENGTH)
  objectKey?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CheckAssetExistsQueryDto;
