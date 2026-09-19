// -----------------------------------------------------------------------------
// sisiMove — Register User Command
// -----------------------------------------------------------------------------
//
// Application intent:
//
//   Register a new sisiMove user account.
//
// This command represents the business request to establish a new user
// account and its foundational marketplace and financial account state.
//
// Registration creates the user's initial account and marketplace identity.
// It also establishes the user's foundational Financial Account.
//
// Registration does NOT establish MEMBER or DRIVER verification.
//
// -----------------------------------------------------------------------------
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
//   ├── TrustProfile
//   │
//   └── FinancialAccount
//       └── FinancialAccountBalance
//
// The Financial Account is created as part of foundational user account
// establishment.
//
// Financial Account creation is performed through the Financial domain's
// application contract. Registration does not construct the Financial Account
// aggregate directly.
//
// The Financial Account is initialized by the Financial domain with:
//
//   - account type: USER
//   - lifecycle status: ACTIVE
//   - owner: the newly created Identity public ID
//   - currency: KES
//   - available balance: 0
//   - pending balance: 0
//   - held balance: 0
//   - balance version: 1
//
// These values are domain/application policy and are therefore intentionally
// NOT supplied by the registration caller.
//
// -----------------------------------------------------------------------------
// Membership is established separately through verification:
//
//   VerificationLevel.NONE
//        │
//        └── member verification
//               │
//               ▼
//           MEMBER
//               │
//               └── driver verification
//                      │
//                      ▼
//                   DRIVER
//
// Therefore, registration MUST NOT assign an Identity MEMBER role or otherwise
// treat the newly registered user as a verified member.
//
// -----------------------------------------------------------------------------
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
//
// Registration also does NOT create financial activity records:
//
//   - FinancialTransaction
//   - FinancialTransactionEntry
//   - FinancialPayment
//   - FinancialPaymentMethod
//   - FinancialPaymentAttempt
//   - FinancialAccountHold
//   - FinancialAccountWithdrawal
//   - FinancialSettlement
//   - FinancialSettlementItem
//   - FinancialSettlementAllocation
//   - FinancialDisbursement
//   - FinancialDisbursementAttempt
//   - FinancialDisbursementDestination
//
// Registration does NOT create accounting records:
//
//   - AccountingAccount
//   - AccountingPeriod
//   - AccountingJournal
//   - AccountingJournalEntry
//   - AccountingJournalLine
//
// The Financial Account represents foundational account infrastructure.
// Financial transactions and accounting records are created only when actual
// financial activity occurs.
//
// Authentication/session establishment belongs to SignInCommand.
//
// -----------------------------------------------------------------------------
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
//   - The Financial Account type and currency are not caller-supplied.
//     Registration establishes a USER financial account denominated in KES
//     through the Financial domain's CreateFinancialAccountCommand.
//
//   - The newly created Identity public ID is passed to the Financial domain
//     as an opaque FinancialAccountOwnerPublicId. The Financial domain does
//     not establish a persistence relation to Identity.
//
//   - Financial Account lifecycle state and opening balance are owned by the
//     Financial Account aggregate and are therefore not supplied by this
//     command.
//
//   - Role assignments, verification outcomes, public IDs, password hashes,
//     sessions, financial account persistence, and other infrastructure
//     concerns are deliberately not supplied by the caller.
//
// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

export class RegisterUserCommand extends Command {
  public constructor(
    /**
     * Name of the traveller registering the account.
     */
    public readonly travellerName: string,

    /**
     * ISO country code associated with the registered traveller.
     */
    public readonly countryCode: string,

    /**
     * Email address used for authentication and account communication.
     */
    public readonly email: string,

    /**
     * Phone number used for authentication and account communication.
     */
    public readonly phoneNumber: string,

    /**
     * Plain-text password supplied transiently for authentication setup.
     *
     * The password must only cross the appropriate authentication/security
     * boundary and must never be persisted directly by registration.
     */
    public readonly password: string,

    /**
     * Indicates acceptance of the Terms and Privacy Policy.
     */
    public readonly termsAccepted: boolean,
  ) {
    super();
  }
}

export default RegisterUserCommand;
