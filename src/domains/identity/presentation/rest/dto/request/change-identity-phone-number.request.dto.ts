// -----------------------------------------------------------------------------
// Identity — Change Phone Number Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for changing the phone number of an Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// TRANSPORT BOUNDARY
//
// The Identity aggregate is identified by the route parameter:
//
//     PATCH /identities/:identityPublicId/phone-number
//
// The request body contains only:
//
//     {
//       "phoneNumber": "+254712345678"
//     }
//
// The application layer establishes:
//
// - identityPublicId from the validated route parameter;
// - correlationId from the established request-correlation context;
// - causationId from the existing command/event context, when available.
//
// These application-owned values must not be required in the HTTP body.
//
// The application handler converts the phone number into
// IdentityPhoneNumber, loads the IdentityAggregate, invokes:
//
//     identityAggregate.changePhoneNumber(phoneNumber, correlationId)
//
// and persists the aggregate.
//
// The aggregate remains responsible for lifecycle validation, determining
// whether the phone number changed, determining the change timestamp,
// mutating the aggregate and recording IdentityPhoneNumberChangedEvent.
//
// This DTO does NOT:
//
// - construct or mutate IdentityEntity;
// - construct IdentityPhoneNumber;
// - identify the aggregate independently of the route;
// - generate correlation or causation identifiers;
// - supply domain timestamps;
// - perform phone verification or OTP operations;
// - authenticate the Identity;
// - create or revoke credentials or sessions;
// - send notifications;
// - emit domain events directly;
// - perform external side effects.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

// E.164 representation: '+' followed by 7–19 digits.
// Therefore, the shortest valid representation is 8 characters.
const MIN_PHONE_NUMBER_LENGTH = 8;
const MAX_PHONE_NUMBER_LENGTH = 20;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for changing an Identity's phone number.
 *
 * Required transport input:
 *
 * - phoneNumber.
 *
 * The Identity is identified by the route parameter:
 *
 *     :identityPublicId
 *
 * The following values are intentionally NOT supplied by the HTTP client:
 *
 * - identityPublicId;
 * - correlationId;
 * - causationId;
 * - phone-number-change timestamp;
 * - Identity status;
 * - phone verification state;
 * - OTP challenges;
 * - authentication credentials;
 * - sessions;
 * - aggregate state;
 * - domain events.
 *
 * The controller/application boundary obtains the route identifier and
 * established request metadata, then constructs the application command.
 *
 * IdentityAggregate remains authoritative for lifecycle rules and the
 * actual phone-number-change transition.
 */
export class ChangeIdentityPhoneNumberRequestDto {
  // ===========================================================================
  // Phone Number
  // ===========================================================================

  /**
   * New international phone number in E.164 format.
   *
   * Example:
   *
   *     +254712345678
   *
   * This is a transport string. Conversion to IdentityPhoneNumber belongs
   * at the presentation/application mapping boundary.
   */
  @ApiProperty({
    example: '+254712345678',
    description:
      'New international phone number in E.164 format. The Identity is identified by the route parameter; correlation metadata is established by the application.',
    minLength: MIN_PHONE_NUMBER_LENGTH,
    maxLength: MAX_PHONE_NUMBER_LENGTH,
    pattern: '^\\+[1-9]\\d{6,18}$',
  })
  @Transform(trimString)
  @IsString({
    message: 'phoneNumber must be a string.',
  })
  @MinLength(MIN_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must be at least ${MIN_PHONE_NUMBER_LENGTH} characters.`,
  })
  @MaxLength(MAX_PHONE_NUMBER_LENGTH, {
    message: `phoneNumber must not exceed ${MAX_PHONE_NUMBER_LENGTH} characters.`,
  })
  @Matches(/^\+[1-9]\d{6,18}$/, {
    message:
      'phoneNumber must be a valid international phone number in E.164 format.',
  })
  phoneNumber!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PHONE_NUMBER_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_MIN_LENGTH,
  MAX_PHONE_NUMBER_LENGTH as IDENTITY_CHANGE_PHONE_NUMBER_MAX_LENGTH,
};
