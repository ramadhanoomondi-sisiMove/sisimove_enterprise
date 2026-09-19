// -----------------------------------------------------------------------------
// sisiMove — Authentication — Register User Handler
// -----------------------------------------------------------------------------
//
// Application-level orchestration for complete user registration.
//
// Registration creates the account foundation required for a user to enter
// the sisiMove ecosystem.
//
// Registration provisions:
//
//     Identity
//       └── ACTIVE
//
//     Verification
//       └── PENDING / NONE
//
//     TravellerProfile
//       └── ACTIVE / PUBLIC
//
//     TravellerProfilePreferences
//       └── default preferences
//
//     TrustProfile
//       └── ACTIVE / NONE
//
//     Authentication
//       └── ACTIVE
//
//     FinancialAccount
//       ├── USER / ACTIVE / KES
//       └── FinancialAccountBalance
//           ├── available = 0
//           ├── pending   = 0
//           ├── held      = 0
//           └── version   = 1
//
// The Financial Account is foundational account infrastructure. It is created
// through the Financial domain's application contract and is NOT constructed
// directly by this handler.
//
// Registration deliberately does NOT create:
//
//     - IdentityRole;
//     - Session;
//     - Device;
//     - Recovery;
//     - OtpChallenge;
//     - VerificationRequest;
//     - Asset;
//     - Journey;
//     - Booking;
//     - FinancialTransaction;
//     - FinancialTransactionEntry;
//     - FinancialPayment;
//     - FinancialPaymentMethod;
//     - FinancialPaymentAttempt;
//     - FinancialAccountHold;
//     - FinancialAccountWithdrawal;
//     - FinancialSettlement;
//     - FinancialSettlementItem;
//     - FinancialSettlementAllocation;
//     - FinancialDisbursement;
//     - FinancialDisbursementAttempt;
//     - FinancialDisbursementDestination;
//     - AccountingAccount;
//     - AccountingPeriod;
//     - AccountingJournal;
//     - AccountingJournalEntry;
//     - AccountingJournalLine.
//
// Registration establishes an account and its supporting marketplace,
// trust, authentication, and foundational financial infrastructure.
//
// The user is NOT signed in by registration.
//
// Final application flow:
//
//     Register
//       ↓
//     Account Created
//       ↓
//     Sign In
//       ↓
//     Authenticate
//       ↓
//     Device / Session / Tokens
//
// -----------------------------------------------------------------------------
//
// IMPORTANT ARCHITECTURAL BOUNDARIES
//
// This handler is an application orchestrator.
//
// It coordinates existing application handlers across bounded contexts:
//
//     Identity
//     Verification
//     Social / TravellerProfile
//     Trust
//     Authentication
//     Financial
//
// It does NOT:
//
//     - access Prisma;
//     - construct persistence records;
//     - mutate aggregate entities directly;
//     - construct domain events directly;
//     - implement domain lifecycle rules;
//     - assign Identity roles;
//     - authenticate the newly registered user;
//     - create a Session;
//     - construct a FinancialAccountAggregate directly.
//
// Each aggregate remains responsible for its own domain behavior.
//
// -----------------------------------------------------------------------------
//
// TRANSACTION BOUNDARY
//
// The complete registration workflow executes inside one UnitOfWork boundary.
//
//     RegisterUserHandler
//             │
//             ▼
//     UnitOfWork.execute()
//             │
//             ├── Identity
//             ├── Financial Account
//             ├── Verification
//             ├── TravellerProfile
//             ├── Preferences
//             ├── TrustProfile
//             ├── Authentication
//             └── Authentication activation
//             │
//             ▼
//          COMMIT
//
// If any operation throws, the UnitOfWork implementation rolls back the
// database transaction.
//
// Repository transaction participation is provided by the infrastructure
// PrismaTransactionContext. Repositories must therefore resolve their Prisma
// client through that context rather than directly using the root
// PrismaService.
//
// The handler itself remains persistence-technology agnostic.
//
// -----------------------------------------------------------------------------
//
// IDENTITY
//
// Registration delegates Identity creation to CreateIdentityHandler.
//
// CreateIdentityHandler already owns:
//
//     Create Identity
//          ↓
//       PENDING
//          ↓
//     ActivateIdentityHandler
//          ↓
//        ACTIVE
//
// Therefore this handler MUST NOT separately invoke ActivateIdentityHandler
// for Identity.
//
// The resulting Identity public ID becomes the opaque owner reference used
// when creating the user's Financial Account.
//
// -----------------------------------------------------------------------------
//
// FINANCIAL ACCOUNT
//
// Registration creates exactly one foundational Financial Account for the
// newly created Identity.
//
// The Financial Account is created through:
//
//     CreateFinancialAccountCommand
//             ↓
//     CreateFinancialAccountHandler
//             ↓
//     FinancialAccountAggregate.create()
//             ↓
//     FinancialAccount
//     FinancialAccountBalance
//
// Registration supplies only the domain inputs required by the Financial
// Account creation contract:
//
//     ownerPublicId = identity.publicId
//     type          = USER
//     currency      = KES
//
// The Financial domain owns:
//
//     - FinancialAccount public ID;
//     - FinancialAccountBalance;
//     - initial ACTIVE status;
//     - zero opening balance;
//     - balance version;
//
// Therefore registration does NOT construct any of those values directly.
//
// The Identity public ID is passed as an opaque
// FinancialAccountOwnerPublicId. The Financial domain does not establish a
// persistence relation to Identity.
//
// Creating the account does NOT create financial activity.
//
// No transaction, payment, hold, withdrawal, settlement, disbursement, or
// accounting journal is created during registration.
//
// -----------------------------------------------------------------------------
//
// VERIFICATION
//
// Registration creates exactly one Verification aggregate for the newly
// created Identity.
//
// Initial state:
//
//     status = PENDING
//     level  = NONE
//     requests = []
//
// Creating Verification does NOT create a VerificationRequest.
//
// Verification evidence and membership verification are separate workflows
// performed after registration.
//
// -----------------------------------------------------------------------------
//
// TRAVELLER PROFILE
//
// Registration creates the TravellerProfile using the Identity public ID as
// the opaque cross-domain member reference.
//
// Persisted handle convention:
//
//     ramadhan_omondi
//
// Presentation convention:
//
//     @ramadhan_omondi
//
// The '@' character is NOT persisted.
//
// Registration derives the initial handle from travellerName by:
//
//     - trimming;
//     - converting to lowercase;
//     - replacing whitespace runs with '_';
//
// TravellerHandle remains responsible for final domain validation.
//
// -----------------------------------------------------------------------------
//
// TRAVELLER PROFILE PREFERENCES
//
// Preferences are created after TravellerProfile creation because the
// preferences handler requires the TravellerProfile aggregate ID.
//
// Default registration preferences:
//
//     showJourneyHistory    = true
//     showJourneyStatistics = true
//     allowJourneyInvites   = true
//
// -----------------------------------------------------------------------------
//
// TRUST PROFILE
//
// Registration creates exactly one TrustProfile for the newly registered
// Identity.
//
// Initial state:
//
//     status            = ACTIVE
//     verificationLevel = NONE
//
// Trust statistics are initialized by CreateTrustProfileHandler.
//
// Registration does NOT:
//
//     - grant Trust verification;
//     - create Trust badges;
//     - award Trust badges;
//     - create ratings;
//     - create reviews.
//
// Trust verification remains governed by the Verification/Trust workflows.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION
//
// Registration provisions a password-backed Authentication.
//
// Plaintext password handling:
//
//     RegisterUserCommand.password
//             │
//             ▼
//     PasswordHasher.hash()
//             │
//             ▼
//     AuthenticationPasswordHash
//             │
//             ▼
//     CreateAuthenticationHandler
//
// The plaintext password MUST NOT enter CreateAuthenticationCommand.
//
// The PasswordHasher abstraction belongs to the Foundation Security boundary.
// Its concrete BCrypt implementation remains infrastructure-owned.
//
// Authentication creation:
//
//     CreateAuthenticationHandler
//             │
//             ▼
//         PENDING
//
// Authentication activation:
//
//     ActivateAuthenticationHandler
//             │
//             ▼
//          ACTIVE
//
// Registration therefore provisions an ACTIVE Authentication without invoking
// AuthenticateHandler.
//
// AuthenticateHandler belongs to the login workflow and verifies possession
// of credentials. It is not a registration dependency.
//
// -----------------------------------------------------------------------------
//
// PASSWORD SECURITY
//
// The plaintext password exists only as transient registration input.
//
// It MUST NOT:
//
//     - be persisted;
//     - be logged;
//     - be placed into domain events;
//     - be included in exceptions;
//     - be stored on AuthenticationEntity;
//     - be returned in RegisterUserResult.
//
// The only value crossing into Authentication creation is the cryptographic
// AuthenticationPasswordHash value object.
//
// -----------------------------------------------------------------------------
//
// IDENTITY REFERENCE
//
// Authentication uses:
//
//     AuthenticationIdentityPublicId
//
// rather than the Identity aggregate's internal persistence ID.
//
// The registration orchestrator therefore converts:
//
//     identity.publicId.value
//
// into:
//
//     new AuthenticationIdentityPublicId(...)
//
// The Financial domain independently receives the same Identity public ID
// through:
//
//     FinancialAccountOwnerPublicId.create(identity.publicId.value)
//
// -----------------------------------------------------------------------------
//
// CORRELATION / CAUSATION
//
// Each cross-domain command receives a correlation identifier generated by
// this application workflow.
//
// Correlation identifies the individual registration operation.
//
// Causation is intentionally not synthesized here because RegisterUserCommand
// does not expose a causation identifier.
//
// Each generated child command therefore receives:
//
//     correlationId = randomUUID()
//
// and no causationId.
//
// -----------------------------------------------------------------------------
//
// APPLICATION FLOW
//
//     RegisterUserCommand
//             │
//             ▼
//       UnitOfWork.execute()
//             │
//             ├──────────────────────────────┐
//             │                              │
//             ▼                              ▼
//     CreateIdentityHandler             PasswordHasher
//             │                              │
//             ▼                              ▼
//         Identity ACTIVE             password hash
//             │
//             ├──► FinancialAccount
//             │         │
//             │         └──► Balance = 0
//             │
//             ├──► Verification
//             │
//             ├──► TravellerProfile
//             │         │
//             │         └──► Preferences
//             │
//             ├──► TrustProfile
//             │
//             └──────────────────────────────┤
//                                            ▼
//                                  CreateAuthenticationHandler
//                                            │
//                                            ▼
//                                         PENDING
//                                            │
//                                            ▼
//                                  ActivateAuthenticationHandler
//                                            │
//                                            ▼
//                                         ACTIVE
//                                            │
//                                            ▼
//                                      Account Created
//                                            │
//                                      transaction commit
//                                            │
//                                            ▼
//                                         Sign In
//
// If any step fails:
//
//                         ┌───────────────┐
//                         │    ROLLBACK   │
//                         └───────────────┘
//
// No partial registration is committed.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Foundation — Persistence
// -----------------------------------------------------------------------------

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';
import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type { PasswordHasher } from '../../../../foundation/security/password-hasher.interface';

// -----------------------------------------------------------------------------
// Authentication — Application Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Authentication — Command
// -----------------------------------------------------------------------------

import type { RegisterUserCommand } from '../commands/register-user.command';

// -----------------------------------------------------------------------------
// Authentication — Authentication Commands
// -----------------------------------------------------------------------------

import {
  ActivateAuthenticationCommand,
  CreateAuthenticationCommand,
} from '../../application/commands';

// -----------------------------------------------------------------------------
// Authentication — Authentication Handlers
// -----------------------------------------------------------------------------

import {
  ActivateAuthenticationHandler,
  CreateAuthenticationHandler,
} from '../../application/command-handlers';

// -----------------------------------------------------------------------------
// Authentication — Authentication Aggregate
// -----------------------------------------------------------------------------

import { AuthenticationAggregate } from '../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Authentication — Authentication Value Objects
// -----------------------------------------------------------------------------

import {
  AuthenticationIdentityPublicId,
  AuthenticationPasswordHash,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Identity — Application Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../../../identity/application/identity.tokens';

// -----------------------------------------------------------------------------
// Identity — Commands
// -----------------------------------------------------------------------------

import {
  CreateIdentityCommand,
  CreateVerificationCommand,
} from '../../../identity/application/commands';

// -----------------------------------------------------------------------------
// Identity — Handlers
// -----------------------------------------------------------------------------

import {
  CreateIdentityHandler,
  CreateVerificationHandler,
} from '../../../identity/application/command-handlers';

// -----------------------------------------------------------------------------
// Identity — Value Objects
// -----------------------------------------------------------------------------

import {
  IdentityEmail,
  IdentityPhoneNumber,
} from '../../../identity/domain/value-objects';

// -----------------------------------------------------------------------------
// Identity — Aggregates
// -----------------------------------------------------------------------------

import {
  IdentityAggregate,
  VerificationAggregate,
} from '../../../identity/domain/aggregates';

// -----------------------------------------------------------------------------
// Identity — Exceptions
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../../../identity/domain/exceptions';

// -----------------------------------------------------------------------------
// Traveller Profile — Application Tokens
// -----------------------------------------------------------------------------

import { TRAVELLER_PROFILE_TOKENS } from '../../../social/application/traveller-profile.tokens';

// -----------------------------------------------------------------------------
// Traveller Profile — Commands
// -----------------------------------------------------------------------------

import {
  CreateTravellerProfileCommand,
  CreateTravellerProfilePreferencesCommand,
} from '../../../social/application/commands';

// -----------------------------------------------------------------------------
// Traveller Profile — Handlers
// -----------------------------------------------------------------------------

import {
  CreateTravellerProfileHandler,
  CreateTravellerProfilePreferencesHandler,
} from '../../../social/application/handlers';

// -----------------------------------------------------------------------------
// Traveller Profile — Aggregate
// -----------------------------------------------------------------------------

import { TravellerProfileAggregate } from '../../../social/domain/aggregates/traveller-profile.aggregate';

// -----------------------------------------------------------------------------
// Trust — Application Tokens
// -----------------------------------------------------------------------------

import { TRUST_PROFILE_TOKENS } from '../../../trust/application/trust-profile.tokens';

// -----------------------------------------------------------------------------
// Trust — Commands
// -----------------------------------------------------------------------------

import { CreateTrustProfileCommand } from '../../../trust/application/commands/trust-profile/create-trust-profile.command';

// -----------------------------------------------------------------------------
// Trust — Handlers
// -----------------------------------------------------------------------------

import { CreateTrustProfileHandler } from '../../../trust/application/handlers/trust-profile/create-trust-profile.handler';

// -----------------------------------------------------------------------------
// Trust — Aggregate
// -----------------------------------------------------------------------------

import { TrustProfileAggregate } from '../../../trust/domain/aggregates/trust-profile.aggregate';

// -----------------------------------------------------------------------------
// Financial Account — Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../../../financial/application/financial-account.tokens';

// -----------------------------------------------------------------------------
// Financial Account — Command
// -----------------------------------------------------------------------------

import { CreateFinancialAccountCommand } from '../../../financial/application/commands/create-financial-account.command';

// -----------------------------------------------------------------------------
// Financial Account — Handler
// -----------------------------------------------------------------------------

import { CreateFinancialAccountHandler } from '../../../financial/application/command-handlers/create-financial-account.handler';

// -----------------------------------------------------------------------------
// Financial Account — Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountAggregate } from '../../../financial/domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Financial Account — Value Objects
// -----------------------------------------------------------------------------

import {
  Currency,
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
} from '../../../financial/domain/value-objects';

// =============================================================================
// Result
// =============================================================================

/**
 * Authoritative result returned after successful user registration.
 *
 * Registration establishes account, marketplace identity, trust, verification,
 * authentication, and foundational financial account state.
 *
 * Session and token state are intentionally absent because registration does
 * not authenticate the user.
 */
export interface RegisterUserResult {
  readonly identity: IdentityAggregate;
  readonly verification: VerificationAggregate;
  readonly travellerProfile: TravellerProfileAggregate;
  readonly trustProfile: TrustProfileAggregate;
  readonly authentication: AuthenticationAggregate;
  readonly financialAccount: FinancialAccountAggregate;
}

// =============================================================================
// Handler
// =============================================================================

/**
 * Orchestrates complete user registration.
 *
 * The handler coordinates bounded-context application handlers while keeping
 * aggregate/domain responsibilities inside their respective domains.
 *
 * The entire workflow executes inside one UnitOfWork transaction boundary.
 */
@Injectable()
export class RegisterUserHandler implements CommandHandler<
  RegisterUserCommand,
  RegisterUserResult
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Unit of Work
    // -------------------------------------------------------------------------

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_IDENTITY)
    private readonly createIdentityHandler: CreateIdentityHandler,

    // -------------------------------------------------------------------------
    // Verification
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_VERIFICATION)
    private readonly createVerificationHandler: CreateVerificationHandler,

    // -------------------------------------------------------------------------
    // Traveller Profile
    // -------------------------------------------------------------------------

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createTravellerProfileHandler: CreateTravellerProfileHandler,

    // -------------------------------------------------------------------------
    // Traveller Profile Preferences
    // -------------------------------------------------------------------------

    @Inject(TRAVELLER_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE_PREFERENCES)
    private readonly createTravellerProfilePreferencesHandler: CreateTravellerProfilePreferencesHandler,

    // -------------------------------------------------------------------------
    // Trust Profile
    // -------------------------------------------------------------------------

    @Inject(TRUST_PROFILE_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createTrustProfileHandler: CreateTrustProfileHandler,

    // -------------------------------------------------------------------------
    // Authentication
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CREATE_AUTHENTICATION)
    private readonly createAuthenticationHandler: CreateAuthenticationHandler,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.ACTIVATE_AUTHENTICATION)
    private readonly activateAuthenticationHandler: ActivateAuthenticationHandler,

    // -------------------------------------------------------------------------
    // Financial Account
    // -------------------------------------------------------------------------

    @Inject(FINANCIAL_ACCOUNT_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createFinancialAccountHandler: CreateFinancialAccountHandler,

    // -------------------------------------------------------------------------
    // Password Hasher
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.APPLICATION_SERVICES.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes complete user registration atomically.
   *
   * All database-backed registration operations execute inside one UnitOfWork
   * transaction.
   *
   * If any operation throws, the UnitOfWork implementation is responsible for
   * rolling back the transaction.
   *
   * The handler itself does not know whether the UnitOfWork is implemented by
   * Prisma, another relational database, or another transactional mechanism.
   */
  public async execute(
    command: RegisterUserCommand,
  ): Promise<RegisterUserResult> {
    // -------------------------------------------------------------------------
    // 1. Validate registration command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new IdentityInvariantException(
        'Register user command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Terms acceptance
    // -------------------------------------------------------------------------

    if (command.termsAccepted !== true) {
      throw new IdentityInvariantException(
        'Terms must be accepted before registration.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Construct Identity value objects
    // -------------------------------------------------------------------------

    const email = IdentityEmail.create(command.email);
    const phoneNumber = IdentityPhoneNumber.create(command.phoneNumber);

    // -------------------------------------------------------------------------
    // 3. Execute complete registration inside one UnitOfWork
    // -------------------------------------------------------------------------

    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 3.1 Create Identity
      // -----------------------------------------------------------------------

      const identityCorrelationId = randomUUID();

      const createIdentityCommand = new CreateIdentityCommand(
        email,
        phoneNumber,
        identityCorrelationId,
      );

      const identity = await this.createIdentityHandler.execute(
        createIdentityCommand,
      );

      // -----------------------------------------------------------------------
      // 3.2 Create Financial Account
      // -----------------------------------------------------------------------
      //
      // The Identity now exists and therefore provides the opaque owner public
      // ID required by the Financial domain.
      //
      // Registration creates one USER financial account denominated in KES.
      //
      // The Financial Account aggregate owns:
      //
      //     - account public ID;
      //     - ACTIVE lifecycle state;
      //     - initial zero balance;
      //     - balance version.
      //
      // Registration deliberately does not construct those values.
      // -----------------------------------------------------------------------

      const financialAccountCorrelationId = randomUUID();

      const financialAccountOwnerPublicId =
        FinancialAccountOwnerPublicId.create(identity.publicId.value);

      const financialAccountType = FinancialAccountType.create('USER');

      const financialAccountCurrency = Currency.create('KES');

      const createFinancialAccountCommand = new CreateFinancialAccountCommand(
        financialAccountOwnerPublicId,
        financialAccountType,
        financialAccountCurrency,
        financialAccountCorrelationId,
      );

      const financialAccount = await this.createFinancialAccountHandler.execute(
        createFinancialAccountCommand,
      );

      // -----------------------------------------------------------------------
      // 3.3 Create Verification
      // -----------------------------------------------------------------------
      //
      // Verification starts as:
      //
      //     PENDING / NONE
      //
      // No verification request is created here.
      // -----------------------------------------------------------------------

      const verificationCorrelationId = randomUUID();

      const createVerificationCommand = new CreateVerificationCommand(
        identity.publicId,
        verificationCorrelationId,
      );

      const verification = await this.createVerificationHandler.execute(
        createVerificationCommand,
      );

      // -----------------------------------------------------------------------
      // 3.4 Derive initial TravellerProfile handle
      // -----------------------------------------------------------------------

      const handle = command.travellerName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');

      // -----------------------------------------------------------------------
      // 3.5 Create TravellerProfile
      // -----------------------------------------------------------------------

      const travellerProfileCorrelationId = randomUUID();

      const createTravellerProfileCommand = new CreateTravellerProfileCommand(
        identity.publicId.value,
        handle,
        null,
        null,
        command.countryCode,
        undefined,
        undefined,
        travellerProfileCorrelationId,
      );

      const travellerProfile = await this.createTravellerProfileHandler.execute(
        createTravellerProfileCommand,
      );

      // -----------------------------------------------------------------------
      // 3.6 Create TravellerProfile preferences
      // -----------------------------------------------------------------------

      const preferencesCorrelationId = randomUUID();

      const createPreferencesCommand =
        new CreateTravellerProfilePreferencesCommand(
          travellerProfile.aggregateId.toString(),
          true,
          true,
          true,
          preferencesCorrelationId,
        );

      await this.createTravellerProfilePreferencesHandler.execute(
        createPreferencesCommand,
      );

      // -----------------------------------------------------------------------
      // 3.7 Create TrustProfile
      // -----------------------------------------------------------------------
      //
      // TrustProfile starts as:
      //
      //     ACTIVE / NONE
      //
      // Its statistics are initialized by CreateTrustProfileHandler.
      // -----------------------------------------------------------------------

      const trustProfileCorrelationId = randomUUID();

      const createTrustProfileCommand = new CreateTrustProfileCommand(
        identity.publicId.value,
        undefined,
        undefined,
        trustProfileCorrelationId,
      );

      const trustProfile = await this.createTrustProfileHandler.execute(
        createTrustProfileCommand,
      );

      // -----------------------------------------------------------------------
      // 3.8 Hash registration password
      // -----------------------------------------------------------------------

      const passwordHashValue = await this.passwordHasher.hash(
        command.password,
      );

      // -----------------------------------------------------------------------
      // 3.9 Convert password hash into Authentication value object
      // -----------------------------------------------------------------------

      const passwordHash = AuthenticationPasswordHash.create(passwordHashValue);

      // -----------------------------------------------------------------------
      // 3.10 Construct Authentication Identity reference
      // -----------------------------------------------------------------------

      const authenticationIdentityPublicId = new AuthenticationIdentityPublicId(
        identity.publicId.value,
      );

      // -----------------------------------------------------------------------
      // 3.11 Create Authentication
      // -----------------------------------------------------------------------

      const authenticationCorrelationId = randomUUID();

      const createAuthenticationCommand = new CreateAuthenticationCommand(
        authenticationIdentityPublicId,
        authenticationCorrelationId,
        passwordHash,
      );

      const pendingAuthentication =
        await this.createAuthenticationHandler.execute(
          createAuthenticationCommand,
        );

      // -----------------------------------------------------------------------
      // 3.12 Activate Authentication
      // -----------------------------------------------------------------------

      const activateAuthenticationCommand = new ActivateAuthenticationCommand(
        pendingAuthentication.publicId,
        authenticationCorrelationId,
      );

      const authentication = await this.activateAuthenticationHandler.execute(
        activateAuthenticationCommand,
      );

      // -----------------------------------------------------------------------
      // 3.13 Return complete registration result
      // -----------------------------------------------------------------------
      //
      // Returning from the UnitOfWork callback allows the UnitOfWork
      // implementation to commit the transaction.
      //
      // No Session or authentication token is returned.
      // -----------------------------------------------------------------------

      return {
        identity,
        verification,
        travellerProfile,
        trustProfile,
        authentication,
        financialAccount,
      };
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterUserHandler;
