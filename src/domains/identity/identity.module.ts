// src/domains/identity/identity.module.ts

import { Module } from '@nestjs/common';

import { EventsModule } from '../../infrastructure/events/events.module';

//
// REST Controllers
//
import { IdentityController } from './presentation/rest/controllers/identity.controller';
import { AuthenticationController } from './presentation/rest/controllers/authentication.controller';
import { AuthorizationController } from './presentation/rest/controllers/authorization.controller';
import { DeviceController } from './presentation/rest/controllers/device.controller';
import { RecoveryController } from './presentation/rest/controllers/recovery.controller';
import { VerificationController } from './presentation/rest/controllers/verification.controller';

//
// Core Command Handlers
//
import { RegisterIdentityHandler } from './application/handlers/register-identity.handler';
import { ActivateIdentityHandler } from './application/handlers/activate-identity.handler';

//
// Authentication Command Handlers
//
import { RegisterAuthenticationHandler } from './application/handlers/register-authentication.handler';
import { LoginHandler } from './application/handlers/login.handler';
import { RefreshTokenHandler } from './application/handlers/refresh-token.handler';
import { LogoutHandler } from './application/handlers/logout.handler';
import { LogoutAllSessionsHandler } from './application/handlers/logout-all-sessions.handler';
import { ChangePasswordHandler } from './application/handlers/change-password.handler';
import { EnableMfaHandler } from './application/handlers/enable-mfa.handler';
import { DisableMfaHandler } from './application/handlers/disable-mfa.handler';
import { RotateMfaSecretHandler } from './application/handlers/rotate-mfa-secret.handler';
import { LockAuthenticationHandler } from './application/handlers/lock-authentication.handler';
import { UnlockAuthenticationHandler } from './application/handlers/unlock-authentication.handler';
import { ExpirePasswordHandler } from './application/handlers/expire-password.handler';

//
// Authorization Command Handlers
//
import { CreateRoleHandler } from './application/handlers/create-role.handler';
import { RenameRoleHandler } from './application/handlers/rename-role.handler';
import { ChangeRoleDescriptionHandler } from './application/handlers/change-role-description.handler';
import { ChangeRoleDisplayOrderHandler } from './application/handlers/change-role-display-order.handler';
import { ActivateRoleHandler } from './application/handlers/activate-role.handler';
import { DeactivateRoleHandler } from './application/handlers/deactivate-role.handler';
import { AssignRoleHandler } from './application/handlers/assign-role.handler';
import { RevokeRoleHandler } from './application/handlers/revoke-role.handler';
import { AssignPermissionToRoleHandler } from './application/handlers/assign-permission-to-role.handler';
import { RemovePermissionFromRoleHandler } from './application/handlers/remove-permission-from-role.handler';

//
// Device Command Handlers
//
import { RegisterDeviceHandler } from './application/handlers/register-device.handler';
import { TrustDeviceHandler } from './application/handlers/trust-device.handler';
import { RevokeDeviceHandler } from './application/handlers/revoke-device.handler';

//
// Verification Command Handlers
//
import { StartVerificationHandler } from './application/handlers/start-verification.handler';
import { SubmitVerificationRequestHandler } from './application/handlers/submit-verification-request.handler';
import { ApproveVerificationRequestHandler } from './application/handlers/approve-verification-request.handler';
import { RejectVerificationRequestHandler } from './application/handlers/reject-verification-request.handler';
import { RenewVerificationHandler } from './application/handlers/renew-verification.handler';
import { ExpireVerificationHandler } from './application/handlers/expire-verification.handler';
import { RevokeVerificationHandler } from './application/handlers/revoke-verification.handler';

//
// Recovery Command Handlers
//
import { RequestRecoveryHandler } from './application/handlers/request-recovery.handler';
import { CompleteRecoveryHandler } from './application/handlers/complete-recovery.handler';
import { CancelRecoveryHandler } from './application/handlers/cancel-recovery.handler';

//
// Identity Query Handlers
//
import { GetIdentityHandler } from './application/handlers/query-handlers/get-identity.handler';

//
// Authentication Query Handlers
//
import { GetAuthenticationByIdentityHandler } from './application/handlers/query-handlers/get-authentication-by-identity.handler';

//
// Authorization Query Handlers
//
import { GetRoleHandler } from './application/handlers/query-handlers/get-role.handler';
import { ListRolesHandler } from './application/handlers/query-handlers/list-roles.handler';
import { GetPermissionHandler } from './application/handlers/query-handlers/get-permission.handler';
import { ListPermissionsHandler } from './application/handlers/query-handlers/list-permissions.handler';

//
// Device Query Handlers
//
import { GetDeviceHandler } from './application/handlers/query-handlers/get-device.handler';
import { ListIdentityDevicesHandler } from './application/handlers/query-handlers/list-identity-devices.handler';

//
// Verification Query Handlers
//
import { GetVerificationHandler } from './application/handlers/query-handlers/get-verification.handler';
import { GetVerificationSummaryHandler } from './application/handlers/query-handlers/get-verification-summary.handler';
import { GetVerificationRequestHandler } from './application/handlers/query-handlers/get-verification-request.handler';
import { GetVerificationReviewHandler } from './application/handlers/query-handlers/get-verification-review.handler';
import { ListVerificationsHandler } from './application/handlers/query-handlers/list-verifications.handler';
import { ListPendingVerificationsHandler } from './application/handlers/query-handlers/list-pending-verifications.handler';
import { ListExpiredVerificationsHandler } from './application/handlers/query-handlers/list-expired-verifications.handler';

//
// Repository Implementations
//
import { IdentityPrismaRepository } from './infrastructure/persistence/identity.prisma.repository';
import { AuthenticationPrismaRepository } from './infrastructure/persistence/prisma-authentication.repository';
import { SessionPrismaRepository } from './infrastructure/persistence/session.prisma.repository';
import { DevicePrismaRepository } from './infrastructure/persistence/device.prisma.repository';
import { VerificationPrismaRepository } from './infrastructure/persistence/verification.prisma.repository';
import { RecoveryPrismaRepository } from './infrastructure/persistence/recovery.prisma.repository';
import { RolePrismaRepository } from './infrastructure/persistence/role.prisma.repository';
import { PermissionPrismaRepository } from './infrastructure/persistence/permission.prisma.repository';
import { IdentityRolePrismaRepository } from './infrastructure/persistence/identity-role.prisma.repository';
import { RolePermissionPrismaRepository } from './infrastructure/persistence/role-permission.prisma.repository';

//
// Read Repositories
//
import { PrismaRoleReadRepository } from './infrastructure/persistence/read-models/prisma-role-read.repository';
import { PrismaPermissionReadRepository } from './infrastructure/persistence/read-models/prisma-permission-read.repository';

//
// Query Services
//
import { PrismaVerificationQueryService } from './infrastructure/persistence/prisma-verification-query.service';

//
// Security Services
//
import { CryptoTokenGeneratorService } from '../../infrastructure/security/crypto-token-generator.service';
import { RecoveryTokenGeneratorService } from '../../infrastructure/security/recovery-token-generator.service';
import { RecoveryTokenHasherService } from '../../infrastructure/security/recovery-token-hasher.service';

//
// Presentation
//
import { AuthenticationPersistenceMapper } from './presentation/rest/mappers/authentication-persistence.mapper';

@Module({
  imports: [EventsModule],

  controllers: [
    IdentityController,
    AuthenticationController,
    AuthorizationController,
    DeviceController,
    RecoveryController,
    VerificationController,
  ],

  providers: [
    // =========================================================================
    // Core Command Handlers
    // =========================================================================
    RegisterIdentityHandler,
    ActivateIdentityHandler,

    // =========================================================================
    // Authentication Command Handlers
    // =========================================================================
    RegisterAuthenticationHandler,
    LoginHandler,
    RefreshTokenHandler,
    LogoutHandler,
    LogoutAllSessionsHandler,
    ChangePasswordHandler,
    EnableMfaHandler,
    DisableMfaHandler,
    RotateMfaSecretHandler,
    LockAuthenticationHandler,
    UnlockAuthenticationHandler,
    ExpirePasswordHandler,

    // =========================================================================
    // Authorization Command Handlers
    // =========================================================================
    CreateRoleHandler,
    RenameRoleHandler,
    ChangeRoleDescriptionHandler,
    ChangeRoleDisplayOrderHandler,
    ActivateRoleHandler,
    DeactivateRoleHandler,

    // Remove these if they do not actually exist in your project.
    AssignRoleHandler,
    RevokeRoleHandler,

    AssignPermissionToRoleHandler,
    RemovePermissionFromRoleHandler,

    // =========================================================================
    // Device Command Handlers
    // =========================================================================
    RegisterDeviceHandler,
    TrustDeviceHandler,
    RevokeDeviceHandler,

    // =========================================================================
    // Verification Command Handlers
    // =========================================================================
    StartVerificationHandler,
    SubmitVerificationRequestHandler,
    ApproveVerificationRequestHandler,
    RejectVerificationRequestHandler,
    RenewVerificationHandler,
    ExpireVerificationHandler,
    RevokeVerificationHandler,

    // =========================================================================
    // Recovery Command Handlers
    // =========================================================================
    RequestRecoveryHandler,
    CompleteRecoveryHandler,
    CancelRecoveryHandler,

    // =========================================================================
    // Identity Query Handlers
    // =========================================================================
    GetIdentityHandler,

    // =========================================================================
    // Authentication Query Handlers
    // =========================================================================
    GetAuthenticationByIdentityHandler,

    // =========================================================================
    // Authorization Query Handlers
    // =========================================================================
    GetRoleHandler,
    ListRolesHandler,
    GetPermissionHandler,
    ListPermissionsHandler,

    // =========================================================================
    // Device Query Handlers
    // =========================================================================
    GetDeviceHandler,
    ListIdentityDevicesHandler,

    // =========================================================================
    // Verification Query Handlers
    // =========================================================================
    GetVerificationHandler,
    GetVerificationSummaryHandler,
    GetVerificationRequestHandler,
    GetVerificationReviewHandler,
    ListVerificationsHandler,
    ListPendingVerificationsHandler,
    ListExpiredVerificationsHandler,

    // =========================================================================
    // Repository Implementations
    // =========================================================================
    IdentityPrismaRepository,
    AuthenticationPrismaRepository,
    SessionPrismaRepository,
    DevicePrismaRepository,
    VerificationPrismaRepository,
    RecoveryPrismaRepository,
    RolePrismaRepository,
    PermissionPrismaRepository,
    IdentityRolePrismaRepository,
    RolePermissionPrismaRepository,

    // =========================================================================
    // Read Repositories
    // =========================================================================
    PrismaRoleReadRepository,
    PrismaPermissionReadRepository,

    // =========================================================================
    // Query Services
    // =========================================================================
    PrismaVerificationQueryService,

    // =========================================================================
    // Security Services
    // =========================================================================
    CryptoTokenGeneratorService,
    RecoveryTokenGeneratorService,
    RecoveryTokenHasherService,

    // =========================================================================
    // Presentation
    // =========================================================================
    AuthenticationPersistenceMapper,

    // =========================================================================
    // Repository Tokens
    // =========================================================================
    {
      provide: 'IdentityRepository',
      useExisting: IdentityPrismaRepository,
    },
    {
      provide: 'AuthenticationRepository',
      useExisting: AuthenticationPrismaRepository,
    },
    {
      provide: 'SessionRepository',
      useExisting: SessionPrismaRepository,
    },
    {
      provide: 'DeviceRepository',
      useExisting: DevicePrismaRepository,
    },
    {
      provide: 'VerificationRepository',
      useExisting: VerificationPrismaRepository,
    },
    {
      provide: 'RecoveryRepository',
      useExisting: RecoveryPrismaRepository,
    },
    {
      provide: 'RoleRepository',
      useExisting: RolePrismaRepository,
    },
    {
      provide: 'PermissionRepository',
      useExisting: PermissionPrismaRepository,
    },
    {
      provide: 'IdentityRoleRepository',
      useExisting: IdentityRolePrismaRepository,
    },
    {
      provide: 'RolePermissionRepository',
      useExisting: RolePermissionPrismaRepository,
    },

    // =========================================================================
    // Read Repository Tokens
    // =========================================================================
    {
      provide: 'RoleReadRepository',
      useExisting: PrismaRoleReadRepository,
    },
    {
      provide: 'PermissionReadRepository',
      useExisting: PrismaPermissionReadRepository,
    },

    // =========================================================================
    // Query Service Tokens
    // =========================================================================
    {
      provide: 'VerificationQueryService',
      useExisting: PrismaVerificationQueryService,
    },

    // =========================================================================
    // Security Tokens
    // =========================================================================
    {
      provide: 'TokenGenerator',
      useExisting: CryptoTokenGeneratorService,
    },
    {
      provide: 'RecoveryTokenGenerator',
      useExisting: RecoveryTokenGeneratorService,
    },
    {
      provide: 'TokenHasher',
      useExisting: RecoveryTokenHasherService,
    },
    {
      provide: 'RecoveryTokenHasher',
      useExisting: RecoveryTokenHasherService,
    },
  ],

  exports: [
    // =========================================================================
    // Core Command Handlers
    // =========================================================================
    RegisterIdentityHandler,
    ActivateIdentityHandler,

    // =========================================================================
    // Authentication Command Handlers
    // =========================================================================
    RegisterAuthenticationHandler,
    LoginHandler,
    RefreshTokenHandler,
    LogoutHandler,
    LogoutAllSessionsHandler,
    ChangePasswordHandler,
    EnableMfaHandler,
    DisableMfaHandler,
    RotateMfaSecretHandler,
    LockAuthenticationHandler,
    UnlockAuthenticationHandler,
    ExpirePasswordHandler,

    // =========================================================================
    // Authorization Command Handlers
    // =========================================================================
    CreateRoleHandler,
    RenameRoleHandler,
    ChangeRoleDescriptionHandler,
    ChangeRoleDisplayOrderHandler,
    ActivateRoleHandler,
    DeactivateRoleHandler,
    AssignRoleHandler,
    RevokeRoleHandler,
    AssignPermissionToRoleHandler,
    RemovePermissionFromRoleHandler,

    // =========================================================================
    // Device Command Handlers
    // =========================================================================
    RegisterDeviceHandler,
    TrustDeviceHandler,
    RevokeDeviceHandler,

    // =========================================================================
    // Verification Command Handlers
    // =========================================================================
    StartVerificationHandler,
    SubmitVerificationRequestHandler,
    ApproveVerificationRequestHandler,
    RejectVerificationRequestHandler,
    RenewVerificationHandler,
    ExpireVerificationHandler,
    RevokeVerificationHandler,

    // =========================================================================
    // Recovery Command Handlers
    // =========================================================================
    RequestRecoveryHandler,
    CompleteRecoveryHandler,
    CancelRecoveryHandler,

    // =========================================================================
    // Query Handlers
    // =========================================================================
    GetIdentityHandler,
    GetAuthenticationByIdentityHandler,
    GetRoleHandler,
    ListRolesHandler,
    GetPermissionHandler,
    ListPermissionsHandler,
    GetDeviceHandler,
    ListIdentityDevicesHandler,
    GetVerificationHandler,
    GetVerificationSummaryHandler,
    GetVerificationRequestHandler,
    GetVerificationReviewHandler,
    ListVerificationsHandler,
    ListPendingVerificationsHandler,
    ListExpiredVerificationsHandler,

    // =========================================================================
    // Repository Tokens
    // =========================================================================
    'IdentityRepository',
    'AuthenticationRepository',
    'SessionRepository',
    'DeviceRepository',
    'VerificationRepository',
    'RecoveryRepository',
    'RoleRepository',
    'PermissionRepository',
    'IdentityRoleRepository',
    'RolePermissionRepository',

    // =========================================================================
    // Read Repository Tokens
    // =========================================================================
    'RoleReadRepository',
    'PermissionReadRepository',

    // =========================================================================
    // Query Service Tokens
    // =========================================================================
    'VerificationQueryService',

    // =========================================================================
    // Security Tokens
    // =========================================================================
    'TokenGenerator',
    'TokenHasher',
    'RecoveryTokenGenerator',
    'RecoveryTokenHasher',

    // =========================================================================
    // Shared Mapper
    // =========================================================================
    AuthenticationPersistenceMapper,
  ],
})
export class IdentityModule {}
