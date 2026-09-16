// -----------------------------------------------------------------------------
// sisiMove — Register User Command
// -----------------------------------------------------------------------------
//
// Application intent:
//
//   Register a new sisiMove user account.
//
// This command represents the business request to establish a new user
// account. Registration creates the user's initial account and marketplace
// identity, but it does NOT establish MEMBER or DRIVER verification.
//
// Registration establishes the initial account state:
//
//   Identity
//   ├── ACTIVE
//   │
//   ├── Authentication
//   │   └── ACTIVE
//   │
//   ├── Verification
//   │   └── PENDING / NONE
//   │
//   ├── TravellerProfile
//   │   └── TravellerProfilePreferences
//   │
//   └── TrustProfile
//
// Membership is established separately through verification:
//
//   VerificationLevel.NONE
//        │
//        └── member verification
//                │
//                ▼
//           MEMBER
//                │
//                └── driver verification
//                        │
//                        ▼
//                     DRIVER
//
// Therefore, registration MUST NOT assign an Identity MEMBER role or otherwise
// treat the newly registered user as a verified member.
//
// Registration does NOT create:
//
//   - IdentityRole / MEMBER role assignment
//   - Session
//   - Device
//   - Recovery
//   - OTP challenge
//   - VerificationRequest
//   - Asset
//   - Journey
//   - Booking
//   - Financial account
//
// Authentication/session establishment belongs to SignInCommand.
//
// Architectural notes:
//
//   - confirmPassword is intentionally excluded. It is a presentation/DTO
//     validation concern and is not part of the registration business intent.
//
//   - password is transient sensitive input. The handler must pass it only to
//     the authentication/security boundary for hashing and must never persist,
//     publish, log, or include it in events.
//
//   - termsAccepted is included because accepting the Terms and Privacy Policy
//     is an application-level prerequisite for registration.
//
//   - VerificationLevel.MEMBER is established by the verification workflow,
//     not by registration.
//
//   - Role assignments, verification outcomes, public IDs, password hashes,
//     sessions, and persistence concerns are deliberately not supplied by
//     the caller.
//
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

export class RegisterUserCommand extends Command {
  public constructor(
    public readonly travellerName: string,
    public readonly countryCode: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly password: string,
    public readonly termsAccepted: boolean,
  ) {
    super();
  }
}

export default RegisterUserCommand;
