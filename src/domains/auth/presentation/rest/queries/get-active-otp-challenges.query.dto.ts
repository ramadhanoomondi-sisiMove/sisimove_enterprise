// -----------------------------------------------------------------------------
// OTP Challenge — Get Active OTP Challenges Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving active OTP Challenge aggregates.
//
// Query:
//
//     Get Active OTP Challenges
//
// The current GetActiveOtpChallengesQuery requires no transport-level
// parameters.
//
// This DTO therefore contains no properties.
//
// The presentation/application layer is responsible for constructing:
//
//     GetActiveOtpChallengesQuery
//
// This DTO does NOT:
//
// - load OTP Challenge aggregates;
// - access OtpChallengeRepository;
// - access Prisma;
// - perform authorization;
// - evaluate OTP expiration;
// - contain domain business logic;
// - perform persistence operations;
// - map aggregates to response DTOs.
//
// -----------------------------------------------------------------------------
//
// Active OTP Challenge semantics:
//
// Active challenges are retrieved through the persisted PENDING lifecycle
// state.
//
// Dynamic expiration is evaluated by the appropriate application/domain
// workflow and is not represented as a transport parameter.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     GET /otp-challenges/active
//
// No query parameters are required.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// No OTP material is accepted by this DTO.
//
// This DTO must never carry:
//
// - raw OTP values;
// - OTP hashes;
// - passwords;
// - password hashes;
// - refresh tokens;
// - session credentials.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     HTTP Request
//          │
//          ▼
//     GetActiveOtpChallengesQueryDto
//          │
//          ▼
//     GetActiveOtpChallengesQuery
//          │
//          ▼
//     GetActiveOtpChallengesHandler
//          │
//          ▼
//     OtpChallengeRepository.findPending()
//
// -----------------------------------------------------------------------------
//
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving active OTP Challenge aggregates.
 *
 * No transport-level query parameters are currently required.
 */
export class GetActiveOtpChallengesQueryDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetActiveOtpChallengesQueryDto;
