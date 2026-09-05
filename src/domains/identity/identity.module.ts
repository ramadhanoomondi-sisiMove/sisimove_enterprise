// -----------------------------------------------------------------------------
// Identity — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Identity bounded context.
//
// Registered capabilities:
//
// - Identity
// - Verification
// - Verification Request
// - Role
// - Permission
// - Role Permission
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository providers;
// - application command handlers;
// - application query handlers;
// - Asset upload orchestration required by verification evidence submission.
//
// Domain behavior remains inside aggregate roots/entities.
//
// Application handlers coordinate application workflows and delegate business
// behavior to the appropriate aggregate / relationship boundary.
//
// Persistence remains behind domain repository contracts.
//
// -----------------------------------------------------------------------------
//
// Aggregate / relationship boundaries:
//
// IdentityAggregate
//
// VerificationAggregate
// └── VerificationRequestEntity
//
// RoleAggregate
//
// PermissionAggregate
//
// RolePermissionAggregate
//
// IMPORTANT:
//
// VerificationRequest is owned by VerificationAggregate and therefore does
// not have a separate repository provider.
//
// IdentityRole is part of the Identity aggregate boundary and does not have
// a separate repository provider.
//
// RolePermission is an independent relationship aggregate.
//
// Authorization evaluation remains outside these aggregates.
//
// -----------------------------------------------------------------------------
//
// Verification evidence submission:
//
// SubmitVerificationRequestHandler
// ├── Asset Upload Handler
// │   └── AssetStoragePort
// ├── Create Verification when required
// └── Create Verification Request
//
// The Identity module therefore imports AssetsModule so the verification
// application layer can consume the exported Asset upload capability through
// its application token.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Database
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Assets — Module
// -----------------------------------------------------------------------------
//
// Verification evidence submission uploads the evidence through the Assets
// bounded context. AssetsModule exports the UploadAsset application handler
// token consumed by SubmitVerificationRequestHandler.
//

import { AssetsModule } from '../assets/assets.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import {
  IdentitiesController,
  VerificationsController,
  RolesController,
  PermissionsController,
  RolePermissionsController,
} from './presentation/rest/controllers';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { IDENTITY_PROVIDERS } from './infrastructure/dependency-injection/identity.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from './application/identity.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  // ===========================================================================
  // Identity
  // ===========================================================================

  CreateIdentityHandler,
  ActivateIdentityHandler,
  SuspendIdentityHandler,
  CloseIdentityHandler,
  ChangeIdentityEmailHandler,
  ChangeIdentityPhoneNumberHandler,
  AssignIdentityRoleHandler,
  RevokeIdentityRoleHandler,

  // ===========================================================================
  // Verification
  // ===========================================================================
  CreateVerificationHandler,
  GrantMemberVerificationHandler,
  GrantDriverVerificationHandler,
  RejectVerificationHandler,
  ReopenVerificationHandler,
  ExpireVerificationHandler,
  RevokeVerificationHandler,

  // ===========================================================================
  // Verification Request
  // ===========================================================================
  SubmitVerificationRequestHandler,
  CreateVerificationRequestHandler,
  ApproveVerificationRequestHandler,
  RejectVerificationRequestHandler,
  CancelVerificationRequestHandler,

  // ===========================================================================
  // Role
  // ===========================================================================
  CreateRoleHandler,
  ActivateRoleHandler,
  DeactivateRoleHandler,

  // ===========================================================================
  // Permission
  // ===========================================================================
  CreatePermissionHandler,
  ActivatePermissionHandler,
  DeactivatePermissionHandler,

  // ===========================================================================
  // Role Permission
  // ===========================================================================
  AssignRolePermissionHandler,
  RevokeRolePermissionHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  // ===========================================================================
  // Identity
  // ===========================================================================

  GetIdentityHandler,
  GetIdentityByEmailHandler,
  GetIdentityByPhoneNumberHandler,
  GetIdentityRolesHandler,

  // ===========================================================================
  // Verification
  // ===========================================================================
  GetVerificationHandler,
  GetVerificationRequestsHandler,
  GetVerificationRequestHandler,

  // ===========================================================================
  // Role
  // ===========================================================================
  GetRoleHandler,
  GetRolesHandler,

  // ===========================================================================
  // Permission
  // ===========================================================================
  GetPermissionHandler,
  GetPermissionsHandler,

  // ===========================================================================
  // Role Permission
  // ===========================================================================
  GetRolePermissionHandler,
  GetRolePermissionsHandler,
} from './application/query-handlers';

// =============================================================================
// Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================
  //
  // AssetsModule is required because SubmitVerificationRequestHandler injects
  // the exported Asset upload application handler token.
  //
  // PrismaModule remains required by the Identity infrastructure repositories.
  //

  imports: [PrismaModule, AssetsModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    IdentitiesController,

    // -------------------------------------------------------------------------
    // Verification
    // -------------------------------------------------------------------------

    VerificationsController,

    // -------------------------------------------------------------------------
    // Role
    // -------------------------------------------------------------------------

    RolesController,

    // -------------------------------------------------------------------------
    // Permission
    // -------------------------------------------------------------------------

    PermissionsController,

    // -------------------------------------------------------------------------
    // Role Permission
    // -------------------------------------------------------------------------

    RolePermissionsController,
  ],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure — Repository Providers
    // =========================================================================

    ...IDENTITY_PROVIDERS,

    // =========================================================================
    // Identity — Command Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_IDENTITY,
      useClass: CreateIdentityHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.ACTIVATE_IDENTITY,
      useClass: ActivateIdentityHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.SUSPEND_IDENTITY,
      useClass: SuspendIdentityHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CLOSE_IDENTITY,
      useClass: CloseIdentityHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CHANGE_IDENTITY_EMAIL,
      useClass: ChangeIdentityEmailHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CHANGE_IDENTITY_PHONE_NUMBER,
      useClass: ChangeIdentityPhoneNumberHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.ASSIGN_IDENTITY_ROLE,
      useClass: AssignIdentityRoleHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.REVOKE_IDENTITY_ROLE,
      useClass: RevokeIdentityRoleHandler,
    },

    // =========================================================================
    // Identity — Query Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY,
      useClass: GetIdentityHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY_BY_EMAIL,
      useClass: GetIdentityByEmailHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY_BY_PHONE_NUMBER,
      useClass: GetIdentityByPhoneNumberHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY_ROLES,
      useClass: GetIdentityRolesHandler,
    },

    // =========================================================================
    // Verification — Command Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_VERIFICATION,
      useClass: CreateVerificationHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.GRANT_MEMBER_VERIFICATION,
      useClass: GrantMemberVerificationHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.GRANT_DRIVER_VERIFICATION,
      useClass: GrantDriverVerificationHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.REJECT_VERIFICATION,
      useClass: RejectVerificationHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.REOPEN_VERIFICATION,
      useClass: ReopenVerificationHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.EXPIRE_VERIFICATION,
      useClass: ExpireVerificationHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.REVOKE_VERIFICATION,
      useClass: RevokeVerificationHandler,
    },

    // =========================================================================
    // Verification — Query Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_VERIFICATION,
      useClass: GetVerificationHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_VERIFICATION_REQUESTS,
      useClass: GetVerificationRequestsHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_VERIFICATION_REQUEST,
      useClass: GetVerificationRequestHandler,
    },

    // =========================================================================
    // Verification Request — Command Handlers
    // =========================================================================
    //
    // SubmitVerificationRequestHandler is the user-facing orchestration:
    //
    //   upload asset
    //        ↓
    //   create verification if required
    //        ↓
    //   create verification request
    //
    // It depends on the Asset upload handler exported by AssetsModule.
    //

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.SUBMIT_VERIFICATION_REQUEST,
      useClass: SubmitVerificationRequestHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_VERIFICATION_REQUEST,
      useClass: CreateVerificationRequestHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.APPROVE_VERIFICATION_REQUEST,
      useClass: ApproveVerificationRequestHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.REJECT_VERIFICATION_REQUEST,
      useClass: RejectVerificationRequestHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CANCEL_VERIFICATION_REQUEST,
      useClass: CancelVerificationRequestHandler,
    },

    // =========================================================================
    // Role — Command Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_ROLE,
      useClass: CreateRoleHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.ACTIVATE_ROLE,
      useClass: ActivateRoleHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.DEACTIVATE_ROLE,
      useClass: DeactivateRoleHandler,
    },

    // =========================================================================
    // Role — Query Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLE,
      useClass: GetRoleHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLES,
      useClass: GetRolesHandler,
    },

    // =========================================================================
    // Permission — Command Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_PERMISSION,
      useClass: CreatePermissionHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.ACTIVATE_PERMISSION,
      useClass: ActivatePermissionHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.DEACTIVATE_PERMISSION,
      useClass: DeactivatePermissionHandler,
    },

    // =========================================================================
    // Permission — Query Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_PERMISSION,
      useClass: GetPermissionHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_PERMISSIONS,
      useClass: GetPermissionsHandler,
    },

    // =========================================================================
    // Role Permission — Command Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.ASSIGN_ROLE_PERMISSION,
      useClass: AssignRolePermissionHandler,
    },

    {
      provide: IDENTITY_TOKENS.COMMAND_HANDLERS.REVOKE_ROLE_PERMISSION,
      useClass: RevokeRolePermissionHandler,
    },

    // =========================================================================
    // Role Permission — Query Handlers
    // =========================================================================

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLE_PERMISSION,
      useClass: GetRolePermissionHandler,
    },

    {
      provide: IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLE_PERMISSIONS,
      useClass: GetRolePermissionsHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // -------------------------------------------------------------------------
    // Identity Repository
    // -------------------------------------------------------------------------

    IDENTITY_TOKENS.REPOSITORIES.IDENTITY,

    // -------------------------------------------------------------------------
    // Verification Repository
    // -------------------------------------------------------------------------

    IDENTITY_TOKENS.REPOSITORIES.VERIFICATION,

    // -------------------------------------------------------------------------
    // Role Repository
    // -------------------------------------------------------------------------

    IDENTITY_TOKENS.REPOSITORIES.ROLE,

    // -------------------------------------------------------------------------
    // Permission Repository
    // -------------------------------------------------------------------------

    IDENTITY_TOKENS.REPOSITORIES.PERMISSION,

    // -------------------------------------------------------------------------
    // Role Permission Repository
    // -------------------------------------------------------------------------

    IDENTITY_TOKENS.REPOSITORIES.ROLE_PERMISSION,
  ],
})
export class IdentityModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default IdentityModule;
