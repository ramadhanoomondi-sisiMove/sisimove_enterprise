// -----------------------------------------------------------------------------
// Recovery — Get Recoveries Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving multiple Recovery aggregates.
//
// Query:
//
//     Get Recoveries
//
// The current GetRecoveriesQuery represents an unfiltered collection query
// and therefore requires no transport-level parameters.
//
// DTO-to-domain conversion is not required because the query carries no
// domain input.
//
// The presentation/application layer is responsible for constructing:
//
//     GetRecoveriesQuery
//
// This DTO does NOT:
//
// - load Recovery aggregates;
// - access RecoveryRepository;
// - access Prisma;
// - perform authorization;
// - validate Identity domain state;
// - contain domain business logic;
// - perform persistence operations;
// - map aggregates to response DTOs.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     GET /recoveries
//
// No query parameters are required.
//
// -----------------------------------------------------------------------------
//
// Filtering:
//
// Filtering by Identity, type, status, or other criteria should be represented
// by dedicated query DTOs when those application use cases are introduced.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// Recovery token material is intentionally absent.
//
// This DTO must never carry:
//
// - raw recovery tokens;
// - recovery-token hashes;
// - passwords;
// - password hashes;
// - OTP values;
// - OTP hashes;
// - session credentials.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     HTTP Request
//          │
//          ▼
//     GetRecoveriesQueryDto
//          │
//          ▼
//     GetRecoveriesQuery
//          │
//          ▼
//     GetRecoveriesHandler
//          │
//          ▼
//     RecoveryRepository
//
// -----------------------------------------------------------------------------
//
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for retrieving multiple Recovery aggregates.
 *
 * No transport-level query parameters are currently required.
 */
export class GetRecoveriesQueryDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetRecoveriesQueryDto;
