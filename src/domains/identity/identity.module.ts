// src/domains/identity/identity.module.ts

import { Module } from '@nestjs/common';

import { EventsModule } from '../../infrastructure/events/events.module';

// ============================================================================
// Identity Tokens
// ============================================================================

import {
  IDENTITY_AUTHENTICATION_REPOSITORY,
  IDENTITY_DEVICE_REPOSITORY,
  IDENTITY_EVENT_PUBLISHER,
  IDENTITY_PASSWORD_HASHER,
  IDENTITY_RECOVERY_REPOSITORY,
  IDENTITY_RECOVERY_TOKEN_GENERATOR,
  IDENTITY_RECOVERY_TOKEN_HASHER,
  IDENTITY_REPOSITORY,
  IDENTITY_SESSION_REPOSITORY,
  IDENTITY_TOKEN_GENERATOR,
  IDENTITY_TOKEN_HASHER,
  IDENTITY_VERIFICATION_QUERY_SERVICE,
  IDENTITY_VERIFICATION_REPOSITORY,
} from './application/identity.tokens';

// ============================================================================
// Authorization Tokens
// ============================================================================

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_IDENTITY_ROLE_REPOSITORY,
  AUTHORIZATION_PERMISSION_READ_REPOSITORY,
  AUTHORIZATION_PERMISSION_REPOSITORY,
  AUTHORIZATION_ROLE_PERMISSION_REPOSITORY,
  AUTHORIZATION_ROLE_READ_REPOSITORY,
  AUTHORIZATION_ROLE_REPOSITORY,
} from './application/authorization.tokens';

import {
  IDENTITY_AUDIT_EVENT_PUBLISHER,
  IDENTITY_AUDIT_REPOSITORY,
} from './application/identity-audit.tokens';

// ============================================================================
// Infrastructure
// ============================================================================

import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

import { JwtTokenService } from '../../infrastructure/security/jwt-token.service';
import { BcryptPasswordService } from '../../infrastructure/security/bcrypt-password.service';
import { Sha256TokenHasherService } from '../../infrastructure/security/sha256-token-hasher.service';
import { RecoveryTokenGeneratorService } from '../../infrastructure/security/recovery-token-generator.service';
import { RecoveryTokenHasherService } from '../../infrastructure/security/recovery-token-hasher.service';

import { EventPublisher } from '../../infrastructure/events/event-publisher';

// ============================================================================
// Authorization Repository Implementations
// ============================================================================

import { RolePrismaRepository } from './infrastructure/persistence/role-prisma.repository';
import { PermissionPrismaRepository } from './infrastructure/persistence/permission-prisma.repository';
import { RolePermissionPrismaRepository } from './infrastructure/persistence/role-permission-prisma.repository';
import { IdentityRolePrismaRepository } from './infrastructure/persistence/identity-role-prisma.repository';

// ============================================================================
// Read Repository Implementations
// ============================================================================

import { RoleReadPrismaRepository } from './infrastructure/persistence/read-models/role-read-prisma.repository';
import { PermissionReadPrismaRepository } from './infrastructure/persistence/read-models/permission-read-prisma.repository';

// ============================================================================
// Query Services
// ============================================================================

import { PrismaVerificationQueryService } from './infrastructure/query-services/prisma-verification-query.service';

// ============================================================================
// Identity Repository Implementations
// ============================================================================

import { IdentityPrismaRepository } from './infrastructure/persistence/identity-prisma.repository';
import { AuthenticationPrismaRepository } from './infrastructure/persistence/authentication-prisma.repository';
import { SessionPrismaRepository } from './infrastructure/persistence/session-prisma.repository';
import { DevicePrismaRepository } from './infrastructure/persistence/device-prisma.repository';
import { VerificationPrismaRepository } from './infrastructure/persistence/verification-prisma.repository';
import { RecoveryPrismaRepository } from './infrastructure/persistence/recovery-prisma.repository';
import { IdentityAuditPrismaRepository } from './infrastructure/persistence/prisma-identity-audit.repository';
// ============================================================================
// REST Controllers
// ============================================================================

import { AuthenticationController } from './presentation/rest/controllers/authentication.controller';
import { AuthorizationController } from './presentation/rest/controllers/authorization.controller';
import { DeviceController } from './presentation/rest/controllers/device.controller';
import { IdentityController } from './presentation/rest/controllers/identity.controller';
import { RecoveryController } from './presentation/rest/controllers/recovery.controller';
import { VerificationController } from './presentation/rest/controllers/verification.controller';
import { IdentityAuditController } from './presentation/rest/controllers/identity-audit.controller';

// ============================================================================
// Identity Command Handlers
// ============================================================================

import { ActivateIdentityHandler } from './application/handlers/activate-identity.handler';
import { RegisterIdentityHandler } from './application/handlers/register-identity.handler';

// ============================================================================
// Authentication Command Handlers
// ============================================================================

import { ChangePasswordHandler } from './application/handlers/change-password.handler';
import { DisableMfaHandler } from './application/handlers/disable-mfa.handler';
import { EnableMfaHandler } from './application/handlers/enable-mfa.handler';
import { ExpirePasswordHandler } from './application/handlers/expire-password.handler';
import { ExtendAuthenticationLockHandler } from './application/handlers/extend-authentication-lock.handler';
import { LockAuthenticationHandler } from './application/handlers/lock-authentication.handler';
import { LoginHandler } from './application/handlers/login.handler';
import { LogoutAllSessionsHandler } from './application/handlers/logout-all-sessions.handler';
import { LogoutHandler } from './application/handlers/logout.handler';
import { RecordFailedMfaVerificationHandler } from './application/handlers/record-failed-mfa-verification.handler';
import { RecordSuccessfulMfaVerificationHandler } from './application/handlers/record-successful-mfa-verification.handler';
import { RefreshTokenHandler } from './application/handlers/refresh-token.handler';
import { RegisterAuthenticationHandler } from './application/handlers/register-authentication.handler';
import { RequirePasswordChangeHandler } from './application/handlers/require-password-change.handler';
import { ResetPasswordHandler } from './application/handlers/reset-password.handler';
import { RotateMfaSecretHandler } from './application/handlers/rotate-mfa-secret.handler';
import { UnlockAuthenticationHandler } from './application/handlers/unlock-authentication.handler';

// ============================================================================
// Authorization Command Handlers
// ============================================================================

import { ActivateRoleHandler } from './application/handlers/activate-role.handler';
import { AssignPermissionToRoleHandler } from './application/handlers/assign-permission-to-role.handler';
import { AssignRoleHandler } from './application/handlers/assign-role.handler';
import { ChangeRoleDescriptionHandler } from './application/handlers/change-role-description.handler';
import { ChangeRoleDisplayOrderHandler } from './application/handlers/change-role-display-order.handler';
import { CreateRoleHandler } from './application/handlers/create-role.handler';
import { DeactivateRoleHandler } from './application/handlers/deactivate-role.handler';
import { RemovePermissionFromRoleHandler } from './application/handlers/remove-permission-from-role.handler';
import { RenameRoleHandler } from './application/handlers/rename-role.handler';
import { RevokeRoleHandler } from './application/handlers/revoke-role.handler';

// ============================================================================
// Device Command Handlers
// ============================================================================

import { RegisterDeviceHandler } from './application/handlers/register-device.handler';
import { RevokeDeviceHandler } from './application/handlers/revoke-device.handler';
import { TrustDeviceHandler } from './application/handlers/trust-device.handler';

// ============================================================================
// Recovery Command Handlers
// ============================================================================

import { CancelRecoveryHandler } from './application/handlers/cancel-recovery.handler';
import { CompleteRecoveryHandler } from './application/handlers/complete-recovery.handler';
import { ExpireRecoveryHandler } from './application/handlers/expire-recovery.handler';
import { RequestRecoveryHandler } from './application/handlers/request-recovery.handler';

// ============================================================================
// Verification Command Handlers
// ============================================================================

import { ApproveVerificationRequestHandler } from './application/handlers/approve-verification-request.handler';
import { ExpireVerificationHandler } from './application/handlers/expire-verification.handler';
import { RejectVerificationRequestHandler } from './application/handlers/reject-verification-request.handler';
import { RenewVerificationHandler } from './application/handlers/renew-verification.handler';
import { RevokeVerificationHandler } from './application/handlers/revoke-verification.handler';
import { StartVerificationHandler } from './application/handlers/start-verification.handler';
import { SubmitVerificationRequestHandler } from './application/handlers/submit-verification-request.handler';

// ============================================================================
// Identity Query Handlers
// ============================================================================

import { GetIdentityHandler } from './application/handlers/query-handlers/get-identity.handler';

// ============================================================================
// Authentication Query Handlers
// ============================================================================

import { AuthenticationExistsByIdentityHandler } from './application/handlers/query-handlers/authentication-exists-by-identity.handler';
import { AuthenticationExistsHandler } from './application/handlers/query-handlers/authentication-exists.handler';
import { GetAuthenticationByIdentityHandler } from './application/handlers/query-handlers/get-authentication-by-identity.handler';
import { GetAuthenticationHandler } from './application/handlers/query-handlers/get-authentication.handler';
import { GetLatestPasswordHistoryHandler } from './application/handlers/query-handlers/get-latest-password-history.handler';
import { GetPasswordHistoryHandler } from './application/handlers/query-handlers/get-password-history.handler';

// ============================================================================
// Authorization Query Handlers
// ============================================================================

import { GetIdentityPermissionsHandler } from './application/handlers/query-handlers/get-identity-permissions.handler';
import { GetIdentityRolesHandler } from './application/handlers/query-handlers/get-identity-roles.handler';
import { GetPermissionHandler } from './application/handlers/query-handlers/get-permission.handler';
import { GetRoleHandler } from './application/handlers/query-handlers/get-role.handler';
import { ListPermissionsHandler } from './application/handlers/query-handlers/list-permissions.handler';
import { ListRolesHandler } from './application/handlers/query-handlers/list-roles.handler';

// ============================================================================
// Device Query Handlers
// ============================================================================

import { GetDeviceHandler } from './application/handlers/query-handlers/get-device.handler';
import { ListIdentityDevicesHandler } from './application/handlers/query-handlers/list-identity-devices.handler';
import { RecordIdentityAuditHandler } from './application/handlers/record-identity-audit.handler';
import { GetIdentityAuditHandler } from './application/handlers/query-handlers/get-identity-audit.handler';
import { ListIdentityAuditsHandler } from './application/handlers/query-handlers/list-identity-audits.handler';

// ============================================================================
// Verification Query Handlers
// ============================================================================

import { GetVerificationHandler } from './application/handlers/query-handlers/get-verification.handler';
import { GetVerificationRequestHandler } from './application/handlers/query-handlers/get-verification-request.handler';
import { GetVerificationReviewHandler } from './application/handlers/query-handlers/get-verification-review.handler';
import { GetVerificationSummaryHandler } from './application/handlers/query-handlers/get-verification-summary.handler';
import { ListExpiredVerificationsHandler } from './application/handlers/query-handlers/list-expired-verifications.handler';
import { ListPendingVerificationsHandler } from './application/handlers/query-handlers/list-pending-verifications.handler';
import { ListVerificationsHandler } from './application/handlers/query-handlers/list-verifications.handler';
import { AuthenticationResponseMapper } from './infrastructure/mappers/authentication.response.mapper';

@Module({
  imports: [EventsModule],

  controllers: [
    IdentityController,
    AuthenticationController,
    AuthorizationController,
    DeviceController,
    RecoveryController,
    VerificationController,
    IdentityAuditController,
  ],

  providers: [
    // ==========================================================================
    // Infrastructure
    // ==========================================================================

    PrismaService,
    AuthenticationResponseMapper,

    IdentityPrismaRepository,
    AuthenticationPrismaRepository,
    SessionPrismaRepository,
    DevicePrismaRepository,
    VerificationPrismaRepository,
    RecoveryPrismaRepository,

    RolePrismaRepository,
    PermissionPrismaRepository,
    RolePermissionPrismaRepository,
    IdentityRolePrismaRepository,

    RoleReadPrismaRepository,
    PermissionReadPrismaRepository,

    PrismaVerificationQueryService,

    JwtTokenService,
    BcryptPasswordService,
    Sha256TokenHasherService,
    RecoveryTokenGeneratorService,
    RecoveryTokenHasherService,

    // ==========================================================================
    // Identity Repository Tokens
    // ==========================================================================

    {
      provide: IDENTITY_REPOSITORY,
      useExisting: IdentityPrismaRepository,
    },
    {
      provide: IDENTITY_AUTHENTICATION_REPOSITORY,
      useExisting: AuthenticationPrismaRepository,
    },
    {
      provide: IDENTITY_SESSION_REPOSITORY,
      useExisting: SessionPrismaRepository,
    },
    {
      provide: IDENTITY_DEVICE_REPOSITORY,
      useExisting: DevicePrismaRepository,
    },
    {
      provide: IDENTITY_VERIFICATION_REPOSITORY,
      useExisting: VerificationPrismaRepository,
    },
    {
      provide: IDENTITY_RECOVERY_REPOSITORY,
      useExisting: RecoveryPrismaRepository,
    },

    // ==========================================================================
    // Authorization Repository Tokens
    // ==========================================================================

    {
      provide: AUTHORIZATION_ROLE_REPOSITORY,
      useExisting: RolePrismaRepository,
    },
    {
      provide: AUTHORIZATION_PERMISSION_REPOSITORY,
      useExisting: PermissionPrismaRepository,
    },
    {
      provide: AUTHORIZATION_ROLE_PERMISSION_REPOSITORY,
      useExisting: RolePermissionPrismaRepository,
    },
    {
      provide: AUTHORIZATION_IDENTITY_ROLE_REPOSITORY,
      useExisting: IdentityRolePrismaRepository,
    },

    // ==========================================================================
    // Read Repository Tokens
    // ==========================================================================

    {
      provide: AUTHORIZATION_ROLE_READ_REPOSITORY,
      useExisting: RoleReadPrismaRepository,
    },
    {
      provide: AUTHORIZATION_PERMISSION_READ_REPOSITORY,
      useExisting: PermissionReadPrismaRepository,
    },

    // ==========================================================================
    // Query Services
    // ==========================================================================

    {
      provide: IDENTITY_VERIFICATION_QUERY_SERVICE,
      useExisting: PrismaVerificationQueryService,
    },

    // ==========================================================================
    // Security Services
    // ==========================================================================

    {
      provide: IDENTITY_PASSWORD_HASHER,
      useExisting: BcryptPasswordService,
    },
    {
      provide: IDENTITY_TOKEN_GENERATOR,
      useExisting: JwtTokenService,
    },
    {
      provide: IDENTITY_TOKEN_HASHER,
      useExisting: Sha256TokenHasherService,
    },
    {
      provide: IDENTITY_RECOVERY_TOKEN_GENERATOR,
      useExisting: RecoveryTokenGeneratorService,
    },
    {
      provide: IDENTITY_RECOVERY_TOKEN_HASHER,
      useExisting: RecoveryTokenHasherService,
    },

    // ==========================================================================
    // Application Services
    // ==========================================================================

    {
      provide: IDENTITY_EVENT_PUBLISHER,
      useExisting: EventPublisher,
    },
    {
      provide: AUTHORIZATION_EVENT_PUBLISHER,
      useExisting: EventPublisher,
    },
    {
      provide: IDENTITY_AUDIT_REPOSITORY,
      useClass: IdentityAuditPrismaRepository,
    },

    {
      provide: IDENTITY_AUDIT_EVENT_PUBLISHER,
      useExisting: EventPublisher,
    },
    // ==========================================================================
    // Identity Command Handlers
    // ==========================================================================

    ActivateIdentityHandler,
    RegisterIdentityHandler,

    // ==========================================================================
    // Authentication Command Handlers
    // ==========================================================================

    ChangePasswordHandler,
    DisableMfaHandler,
    EnableMfaHandler,
    ExpirePasswordHandler,
    ExtendAuthenticationLockHandler,
    LockAuthenticationHandler,
    LoginHandler,
    LogoutAllSessionsHandler,
    LogoutHandler,
    RecordFailedMfaVerificationHandler,
    RecordSuccessfulMfaVerificationHandler,
    RefreshTokenHandler,
    RegisterAuthenticationHandler,
    RequirePasswordChangeHandler,
    ResetPasswordHandler,
    RotateMfaSecretHandler,
    UnlockAuthenticationHandler,

    // ==========================================================================
    // Authorization Command Handlers
    // ==========================================================================

    ActivateRoleHandler,
    AssignPermissionToRoleHandler,
    AssignRoleHandler,
    ChangeRoleDescriptionHandler,
    ChangeRoleDisplayOrderHandler,
    CreateRoleHandler,
    DeactivateRoleHandler,
    RemovePermissionFromRoleHandler,
    RenameRoleHandler,
    RevokeRoleHandler,

    // ==========================================================================
    // Device Command Handlers
    // ==========================================================================

    RegisterDeviceHandler,
    RevokeDeviceHandler,
    TrustDeviceHandler,

    // ==========================================================================
    // Recovery Command Handlers
    // ==========================================================================

    CancelRecoveryHandler,
    CompleteRecoveryHandler,
    ExpireRecoveryHandler,
    RequestRecoveryHandler,

    // ==========================================================================
    // Verification Command Handlers
    // ==========================================================================

    ApproveVerificationRequestHandler,
    ExpireVerificationHandler,
    RejectVerificationRequestHandler,
    RenewVerificationHandler,
    RevokeVerificationHandler,
    StartVerificationHandler,
    SubmitVerificationRequestHandler,

    // ==========================================================================
    // Identity Query Handlers
    // ==========================================================================

    GetIdentityHandler,

    // ==========================================================================
    // Authentication Query Handlers
    // ==========================================================================

    AuthenticationExistsByIdentityHandler,
    AuthenticationExistsHandler,
    GetAuthenticationByIdentityHandler,
    GetAuthenticationHandler,
    GetLatestPasswordHistoryHandler,
    GetPasswordHistoryHandler,

    // ==========================================================================
    // Authorization Query Handlers
    // ==========================================================================

    GetIdentityPermissionsHandler,
    GetIdentityRolesHandler,
    GetPermissionHandler,
    GetRoleHandler,
    ListPermissionsHandler,
    ListRolesHandler,

    // ==========================================================================
    // Device Query Handlers
    // ==========================================================================

    GetDeviceHandler,
    ListIdentityDevicesHandler,
    RecordIdentityAuditHandler,

    GetIdentityAuditHandler,
    ListIdentityAuditsHandler,

    // ==========================================================================
    // Verification Query Handlers
    // ==========================================================================

    GetVerificationHandler,
    GetVerificationRequestHandler,
    GetVerificationReviewHandler,
    GetVerificationSummaryHandler,
    ListExpiredVerificationsHandler,
    ListPendingVerificationsHandler,
    ListVerificationsHandler,
  ],

  exports: [
    // ==========================================================================
    // Identity Services
    // ==========================================================================

    IDENTITY_REPOSITORY,
    IDENTITY_AUTHENTICATION_REPOSITORY,
    IDENTITY_SESSION_REPOSITORY,
    IDENTITY_DEVICE_REPOSITORY,
    IDENTITY_VERIFICATION_REPOSITORY,
    IDENTITY_RECOVERY_REPOSITORY,

    // ==========================================================================
    // Authorization Services
    // ==========================================================================

    AUTHORIZATION_ROLE_REPOSITORY,
    AUTHORIZATION_PERMISSION_REPOSITORY,
    AUTHORIZATION_ROLE_PERMISSION_REPOSITORY,
    AUTHORIZATION_IDENTITY_ROLE_REPOSITORY,

    // ==========================================================================
    // Read Repositories
    // ==========================================================================

    AUTHORIZATION_ROLE_READ_REPOSITORY,
    AUTHORIZATION_PERMISSION_READ_REPOSITORY,

    // ==========================================================================
    // Query Services
    // ==========================================================================

    IDENTITY_VERIFICATION_QUERY_SERVICE,

    // ==========================================================================
    // Security Services
    // ==========================================================================

    IDENTITY_PASSWORD_HASHER,
    IDENTITY_TOKEN_GENERATOR,
    IDENTITY_TOKEN_HASHER,
    IDENTITY_RECOVERY_TOKEN_GENERATOR,
    IDENTITY_RECOVERY_TOKEN_HASHER,

    // ==========================================================================
    // Event Publishers
    // ==========================================================================

    IDENTITY_EVENT_PUBLISHER,
    AUTHORIZATION_EVENT_PUBLISHER,
    GetIdentityPermissionsHandler,
    GetIdentityRolesHandler,
  ],
})
export class IdentityModule {}
