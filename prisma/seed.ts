import {
  PrismaClient,
  IdentityStatus,
  IdentityType,
  AuthenticationStatus,
  MfaStatus,
  FinancialAccountType,
  FinancialAccountPurpose,
  FinancialAccountStatus,
  TravellerProfileStatus,
  TravellerProfileVisibility,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'SisiMove123!';

type PermissionSeed = readonly [
  code: string,
  name: string,
  resource: string,
  action: string,
];

//
// -----------------------------------------------------------------------------
// SYSTEM ROLES
// -----------------------------------------------------------------------------
const SYSTEM_ROLES = [
  {
    publicId: 'ROL-SUPERADMIN',
    code: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Full unrestricted access',
  },
  {
    publicId: 'ROL-ADMIN',
    code: 'ADMIN',
    name: 'Administrator',
    description: 'Platform administrator',
  },
  {
    publicId: 'ROL-BUSINESS',
    code: 'BUSINESS',
    name: 'Business',
    description: 'Business account',
  },
  {
    publicId: 'ROL-TRAVELER-LEADER',
    code: 'TRAVELER_LEADER',
    name: 'Traveler Leader',
    description: 'Coordinates travel groups',
  },
  {
    publicId: 'ROL-DRIVER',
    code: 'DRIVER',
    name: 'Driver',
    description: 'Provides transport services',
  },
  {
    publicId: 'ROL-TRAVELER',
    code: 'TRAVELER',
    name: 'Traveler',
    description: 'Can travel using the platform',
  },
  {
    publicId: 'ROL-MEMBER',
    code: 'MEMBER',
    name: 'Member',
    description: 'Default registered member',
  },
] as const;

//
// -----------------------------------------------------------------------------
// PERMISSIONS
// -----------------------------------------------------------------------------
const PERMISSIONS: readonly PermissionSeed[] = [
  // Identity
  ['IDENTITY_CREATE', 'Identity Create', 'IDENTITY', 'CREATE'],
  ['IDENTITY_VIEW', 'Identity View', 'IDENTITY', 'VIEW'],
  ['IDENTITY_UPDATE', 'Identity Update', 'IDENTITY', 'UPDATE'],
  ['IDENTITY_DELETE', 'Identity Delete', 'IDENTITY', 'DELETE'],
  ['IDENTITY_ACTIVATE', 'Identity Activate', 'IDENTITY', 'ACTIVATE'],
  ['IDENTITY_SUSPEND', 'Identity Suspend', 'IDENTITY', 'SUSPEND'],
  ['IDENTITY_CLOSE', 'Identity Close', 'IDENTITY', 'CLOSE'],

  // Authentication
  ['AUTH_REGISTER', 'Register', 'AUTH', 'REGISTER'],
  ['AUTH_LOGIN', 'Login', 'AUTH', 'LOGIN'],
  ['AUTH_REFRESH', 'Refresh Token', 'AUTH', 'REFRESH'],
  ['AUTH_LOGOUT', 'Logout', 'AUTH', 'LOGOUT'],
  ['AUTH_LOGOUT_ALL', 'Logout All', 'AUTH', 'LOGOUT_ALL'],
  [
    'AUTH_PASSWORD_CHANGE',
    'Password Change',
    'AUTH',
    'PASSWORD_CHANGE',
  ],
  [
    'AUTH_PASSWORD_RESET',
    'Password Reset',
    'AUTH',
    'PASSWORD_RESET',
  ],

  // Roles
  ['ROLE_VIEW', 'Role View', 'ROLE', 'VIEW'],
  ['ROLE_CREATE', 'Role Create', 'ROLE', 'CREATE'],
  ['ROLE_UPDATE', 'Role Update', 'ROLE', 'UPDATE'],
  ['ROLE_DELETE', 'Role Delete', 'ROLE', 'DELETE'],
  ['ROLE_ASSIGN', 'Role Assign', 'ROLE', 'ASSIGN'],
  ['ROLE_REVOKE', 'Role Revoke', 'ROLE', 'REVOKE'],

  // Permissions
  ['PERMISSION_VIEW', 'Permission View', 'PERMISSION', 'VIEW'],
  ['PERMISSION_CREATE', 'Permission Create', 'PERMISSION', 'CREATE'],
  ['PERMISSION_UPDATE', 'Permission Update', 'PERMISSION', 'UPDATE'],
  ['PERMISSION_DELETE', 'Permission Delete', 'PERMISSION', 'DELETE'],
  ['PERMISSION_ASSIGN', 'Permission Assign', 'PERMISSION', 'ASSIGN'],
  ['PERMISSION_REVOKE', 'Permission Revoke', 'PERMISSION', 'REVOKE'],

  // Devices
  ['DEVICE_REGISTER', 'Device Register', 'DEVICE', 'REGISTER'],
  ['DEVICE_VIEW', 'Device View', 'DEVICE', 'VIEW'],
  ['DEVICE_TRUST', 'Device Trust', 'DEVICE', 'TRUST'],
  ['DEVICE_REVOKE', 'Device Revoke', 'DEVICE', 'REVOKE'],

  // Sessions
  ['SESSION_VIEW', 'Session View', 'SESSION', 'VIEW'],
  ['SESSION_REVOKE', 'Session Revoke', 'SESSION', 'REVOKE'],
  [
    'SESSION_REVOKE_ALL',
    'Session Revoke All',
    'SESSION',
    'REVOKE_ALL',
  ],

  // Verification
  [
    'VERIFICATION_CREATE',
    'Verification Create',
    'VERIFICATION',
    'CREATE',
  ],
  [
    'VERIFICATION_VIEW',
    'Verification View',
    'VERIFICATION',
    'VIEW',
  ],
  [
    'VERIFICATION_APPROVE',
    'Verification Approve',
    'VERIFICATION',
    'APPROVE',
  ],
  [
    'VERIFICATION_REJECT',
    'Verification Reject',
    'VERIFICATION',
    'REJECT',
  ],
  [
    'VERIFICATION_RENEW',
    'Verification Renew',
    'VERIFICATION',
    'RENEW',
  ],
  [
    'VERIFICATION_EXPIRE',
    'Verification Expire',
    'VERIFICATION',
    'EXPIRE',
  ],
  [
    'VERIFICATION_REVOKE',
    'Verification Revoke',
    'VERIFICATION',
    'REVOKE',
  ],

  // Recovery
  ['RECOVERY_CREATE', 'Recovery Create', 'RECOVERY', 'CREATE'],
  ['RECOVERY_VIEW', 'Recovery View', 'RECOVERY', 'VIEW'],
  [
    'RECOVERY_COMPLETE',
    'Recovery Complete',
    'RECOVERY',
    'COMPLETE',
  ],
  ['RECOVERY_CANCEL', 'Recovery Cancel', 'RECOVERY', 'CANCEL'],

  // Audit
  ['AUDIT_VIEW', 'Audit View', 'AUDIT', 'VIEW'],
  ['AUDIT_EXPORT', 'Audit Export', 'AUDIT', 'EXPORT'],

  // Traveller Profile
  [
    'TRAVELLER_PROFILE_CREATE',
    'Traveller Profile Create',
    'TRAVELLER_PROFILE',
    'CREATE',
  ],
  [
    'TRAVELLER_PROFILE_VIEW',
    'Traveller Profile View',
    'TRAVELLER_PROFILE',
    'VIEW',
  ],
  [
    'TRAVELLER_PROFILE_UPDATE',
    'Traveller Profile Update',
    'TRAVELLER_PROFILE',
    'UPDATE',
  ],
  [
    'TRAVELLER_PROFILE_DELETE',
    'Traveller Profile Delete',
    'TRAVELLER_PROFILE',
    'DELETE',
  ],
] as const;

//
// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

async function upsertRole(
  role: (typeof SYSTEM_ROLES)[number],
) {
  return prisma.role.upsert({
    where: {
      code: role.code,
    },

    update: {
      publicId: role.publicId,
      name: role.name,
      description: role.description,
      isSystem: true,
      isActive: true,
    },

    create: {
      publicId: role.publicId,
      code: role.code,
      name: role.name,
      description: role.description,
      isSystem: true,
      isActive: true,
    },
  });
}

async function upsertPermission(
  code: string,
  name: string,
  resource: string,
  action: string,
) {
  return prisma.permission.upsert({
    where: {
      code,
    },

    update: {
      name,
      resource,
      action,
      description: `${name} permission`,
      isSystem: true,
      isActive: true,
    },

    create: {
      publicId: `PER-${code.replace(/_/g, '-')}`,
      code,
      name,
      resource,
      action,
      description: `${name} permission`,
      isSystem: true,
      isActive: true,
    },
  });
}

//
// -----------------------------------------------------------------------------
// SEED ROLES
// -----------------------------------------------------------------------------

async function seedRoles(): Promise<void> {
  console.log('Seeding roles...');

  for (const role of SYSTEM_ROLES) {
    await upsertRole(role);
  }

  console.log(`✓ ${SYSTEM_ROLES.length} roles`);
}

//
// -----------------------------------------------------------------------------
// SEED PERMISSIONS
// -----------------------------------------------------------------------------

async function seedPermissions(): Promise<void> {
  console.log('Seeding permissions...');

  for (const permission of PERMISSIONS) {
    await upsertPermission(
      permission[0],
      permission[1],
      permission[2],
      permission[3],
    );
  }

  console.log(`✓ ${PERMISSIONS.length} permissions`);
}

//
// -----------------------------------------------------------------------------
// SYSTEM USERS
// -----------------------------------------------------------------------------

const SYSTEM_USERS = [
  {
    publicId: 'IDT-SUPERADMIN',
    email: 'superadmin@sisimove.com',
    phoneNumber: '+254700000000',
    role: 'SUPER_ADMIN',
  },
  {
    publicId: 'IDT-ADMIN',
    email: 'admin@sisimove.com',
    phoneNumber: '+254700000001',
    role: 'ADMIN',
  },
  {
    publicId: 'IDT-BUSINESS',
    email: 'business@sisimove.com',
    phoneNumber: '+254700000002',
    role: 'BUSINESS',
  },
  {
    publicId: 'IDT-LEADER',
    email: 'leader@sisimove.com',
    phoneNumber: '+254700000003',
    role: 'TRAVELER_LEADER',
  },
  {
    publicId: 'IDT-DRIVER',
    email: 'driver@sisimove.com',
    phoneNumber: '+254700000004',
    role: 'DRIVER',
  },
  {
    publicId: 'IDT-TRAVELER',
    email: 'traveler@sisimove.com',
    phoneNumber: '+254700000005',
    role: 'TRAVELER',
  },
  {
    publicId: 'IDT-MEMBER',
    email: 'member@sisimove.com',
    phoneNumber: '+254700000006',
    role: 'MEMBER',
  },
] as const;

type SystemUser = (typeof SYSTEM_USERS)[number];

//
// -----------------------------------------------------------------------------
// CREATE / UPDATE FINANCIAL ACCOUNT
// -----------------------------------------------------------------------------
//

async function createFinancialAccount(user: SystemUser) {
  const publicId = `FIN-${user.publicId.replace(/^IDT-/, '')}`;

  return prisma.financialAccount.upsert({
    where: {
      publicId,
    },

    update: {
      ownerPublicId: user.publicId,
      type: FinancialAccountType.INDIVIDUAL,
      purpose: FinancialAccountPurpose.USER_WALLET,
      currency: 'KES',
      status: FinancialAccountStatus.ACTIVE,
    },

    create: {
      publicId,
      ownerPublicId: user.publicId,

      type: FinancialAccountType.INDIVIDUAL,
      purpose: FinancialAccountPurpose.USER_WALLET,

      currency: 'KES',

      availableBalance: 0,
      pendingBalance: 0,

      status: FinancialAccountStatus.ACTIVE,

      version: 1,
    },
  });
}

//
// -----------------------------------------------------------------------------
// CREATE / UPDATE IDENTITY
// -----------------------------------------------------------------------------
//

async function createIdentity(
  user: SystemUser,
  financialAccountId: string,
) {
  return prisma.identity.upsert({
    where: {
      email: user.email,
    },

    update: {
      publicId: user.publicId,
      phoneNumber: user.phoneNumber,
      type: IdentityType.PERSON,
      status: IdentityStatus.ACTIVE,
      activatedAt: new Date(),
      financialAccountId,
    },

    create: {
      publicId: user.publicId,
      email: user.email,
      phoneNumber: user.phoneNumber,
      type: IdentityType.PERSON,
      status: IdentityStatus.ACTIVE,
      activatedAt: new Date(),
      financialAccountId,
    },
  });
}

//
// -----------------------------------------------------------------------------
// CREATE AUTHENTICATION
// -----------------------------------------------------------------------------

async function createAuthentication(identityId: string) {
  const passwordHash = await bcrypt.hash(
    DEFAULT_PASSWORD,
    12,
  );

  return prisma.authentication.upsert({
    where: {
      identityId,
    },

    update: {
      passwordHash,
      status: AuthenticationStatus.ACTIVE,
      mfaStatus: MfaStatus.DISABLED,
    },

    create: {
      publicId: `AUTH-${identityId
        .substring(0, 8)
        .toUpperCase()}`,

      identityId,

      status: AuthenticationStatus.ACTIVE,

      passwordHash,

      mfaStatus: MfaStatus.DISABLED,
    },
  });
}

//
// -----------------------------------------------------------------------------
// SEED SYSTEM USERS
// -----------------------------------------------------------------------------

async function seedSystemUsers(): Promise<Record<string, string>> {
  console.log('Seeding system users...');

  const identities: Record<string, string> = {};

  for (const user of SYSTEM_USERS) {
    const financialAccount =
      await createFinancialAccount(user);

    const identity = await createIdentity(
      user,
      financialAccount.id,
    );

    identities[user.role] = identity.id;

    await createAuthentication(identity.id);

    console.log(`   ✓ ${user.email}`);
  }

  console.log(
    `✓ ${SYSTEM_USERS.length} users`,
  );

  return identities;
}

//
// -----------------------------------------------------------------------------
// TRAVELLER PROFILE SEEDS
// -----------------------------------------------------------------------------
//

interface TravellerProfileSeed {
  memberPublicId: string;
  publicId: string;
  handle: string;
  bio: string | null;
  avatarAssetPublicId: string | null;
  countryCode: string;
  status: TravellerProfileStatus;
  visibility: TravellerProfileVisibility;

  preferences: {
    publicId: string;
    showJourneyHistory: boolean;
    showJourneyStatistics: boolean;
    allowJourneyInvites: boolean;
  };

  corridors: Array<{
    publicId: string;
    originName: string;
    destinationName: string;

    originLatitude: number;
    originLongitude: number;

    destinationLatitude: number;
    destinationLongitude: number;

    corridorKey: string | null;
    isPrimary: boolean;
  }>;
}

const TRAVELLER_PROFILE_SEEDS: readonly TravellerProfileSeed[] = [
  {
    memberPublicId: 'IDT-LEADER',
    publicId: 'TRV-LEADER',
    handle: 'travel_leader',
    bio: 'Traveller leader coordinating group journeys.',
    avatarAssetPublicId: null,
    countryCode: 'KE',
    status: TravellerProfileStatus.ACTIVE,
    visibility: TravellerProfileVisibility.PUBLIC,

    preferences: {
      publicId: 'TRV-PREF-LEADER',
      showJourneyHistory: true,
      showJourneyStatistics: true,
      allowJourneyInvites: true,
    },

    corridors: [
      {
        publicId: 'TRV-COR-LEADER-NRB-NAI',
        originName: 'Nairobi',
        destinationName: 'Naivasha',
        originLatitude: -1.286389,
        originLongitude: 36.817223,
        destinationLatitude: -0.717178,
        destinationLongitude: 36.431025,
        corridorKey: 'KE-NRB-NAI',
        isPrimary: true,
      },

      {
        publicId: 'TRV-COR-LEADER-NRB-NAK',
        originName: 'Nairobi',
        destinationName: 'Nakuru',
        originLatitude: -1.286389,
        originLongitude: 36.817223,
        destinationLatitude: -0.303099,
        destinationLongitude: 36.080025,
        corridorKey: 'KE-NRB-NAK',
        isPrimary: false,
      },
    ],
  },

  {
    memberPublicId: 'IDT-DRIVER',
    publicId: 'TRV-DRIVER',
    handle: 'driver',
    bio: 'Driver offering reliable intercity journeys.',
    avatarAssetPublicId: null,
    countryCode: 'KE',
    status: TravellerProfileStatus.ACTIVE,
    visibility: TravellerProfileVisibility.PUBLIC,

    preferences: {
      publicId: 'TRV-PREF-DRIVER',
      showJourneyHistory: true,
      showJourneyStatistics: true,
      allowJourneyInvites: true,
    },

    corridors: [
      {
        publicId: 'TRV-COR-DRIVER-NRB-THK',
        originName: 'Nairobi',
        destinationName: 'Thika',
        originLatitude: -1.286389,
        originLongitude: 36.817223,
        destinationLatitude: -1.03326,
        destinationLongitude: 37.06933,
        corridorKey: 'KE-NRB-THK',
        isPrimary: true,
      },

      {
        publicId: 'TRV-COR-DRIVER-NRB-MSA',
        originName: 'Nairobi',
        destinationName: 'Mombasa',
        originLatitude: -1.286389,
        originLongitude: 36.817223,
        destinationLatitude: -4.043477,
        destinationLongitude: 39.668206,
        corridorKey: 'KE-NRB-MSA',
        isPrimary: false,
      },
    ],
  },

  {
    memberPublicId: 'IDT-TRAVELER',
    publicId: 'TRV-TRAVELER',
    handle: 'traveler',
    bio: 'Traveller exploring Kenya and beyond.',
    avatarAssetPublicId: null,
    countryCode: 'KE',
    status: TravellerProfileStatus.ACTIVE,
    visibility: TravellerProfileVisibility.PUBLIC,

    preferences: {
      publicId: 'TRV-PREF-TRAVELER',
      showJourneyHistory: true,
      showJourneyStatistics: true,
      allowJourneyInvites: true,
    },

    corridors: [
      {
        publicId: 'TRV-COR-TRAVELER-NRB-MSA',
        originName: 'Nairobi',
        destinationName: 'Mombasa',
        originLatitude: -1.286389,
        originLongitude: 36.817223,
        destinationLatitude: -4.043477,
        destinationLongitude: 39.668206,
        corridorKey: 'KE-NRB-MSA',
        isPrimary: true,
      },

      {
        publicId: 'TRV-COR-TRAVELER-NRB-NAK',
        originName: 'Nairobi',
        destinationName: 'Nakuru',
        originLatitude: -1.286389,
        originLongitude: 36.817223,
        destinationLatitude: -0.303099,
        destinationLongitude: 36.080025,
        corridorKey: 'KE-NRB-NAK',
        isPrimary: false,
      },
    ],
  },

  {
    memberPublicId: 'IDT-MEMBER',
    publicId: 'TRV-MEMBER',
    handle: 'member',
    bio: 'SisiMove member and occasional traveller.',
    avatarAssetPublicId: null,
    countryCode: 'KE',
    status: TravellerProfileStatus.ACTIVE,
    visibility: TravellerProfileVisibility.PUBLIC,

    preferences: {
      publicId: 'TRV-PREF-MEMBER',
      showJourneyHistory: true,
      showJourneyStatistics: true,
      allowJourneyInvites: true,
    },

    corridors: [
      {
        publicId: 'TRV-COR-MEMBER-NRB-KBU',
        originName: 'Nairobi',
        destinationName: 'Kiambu',
        originLatitude: -1.286389,
        originLongitude: 36.817223,
        destinationLatitude: -1.17139,
        destinationLongitude: 36.83556,
        corridorKey: 'KE-NRB-KBU',
        isPrimary: true,
      },
    ],
  },
];

//
// -----------------------------------------------------------------------------
// SEED TRAVELLER PROFILES
// -----------------------------------------------------------------------------
//

async function seedTravellerProfiles(): Promise<void> {
  console.log('Seeding traveller profiles...');

  for (const profileSeed of TRAVELLER_PROFILE_SEEDS) {
    const profile =
      await prisma.travellerProfile.upsert({
        where: {
          memberPublicId:
            profileSeed.memberPublicId,
        },

        update: {
          publicId:
            profileSeed.publicId,

          handle:
            profileSeed.handle,

          bio:
            profileSeed.bio,

          avatarAssetPublicId:
            profileSeed.avatarAssetPublicId,

          countryCode:
            profileSeed.countryCode,

          status:
            profileSeed.status,

          visibility:
            profileSeed.visibility,
        },

        create: {
          publicId:
            profileSeed.publicId,

          memberPublicId:
            profileSeed.memberPublicId,

          handle:
            profileSeed.handle,

          bio:
            profileSeed.bio,

          avatarAssetPublicId:
            profileSeed.avatarAssetPublicId,

          countryCode:
            profileSeed.countryCode,

          status:
            profileSeed.status,

          visibility:
            profileSeed.visibility,

          totalJourneys: 0,
          completedJourneys: 0,

          providerJourneys: 0,
          passengerJourneys: 0,

          completedProviderJourneys: 0,
          completedPassengerJourneys: 0,
        },
      });

    // -------------------------------------------------------------------------
    // Preferences
    // -------------------------------------------------------------------------

    await prisma.travellerProfilePreferences.upsert({
      where: {
        profileId: profile.id,
      },

      update: {
        publicId:
          profileSeed.preferences.publicId,

        showJourneyHistory:
          profileSeed.preferences.showJourneyHistory,

        showJourneyStatistics:
          profileSeed.preferences.showJourneyStatistics,

        allowJourneyInvites:
          profileSeed.preferences.allowJourneyInvites,
      },

      create: {
        publicId:
          profileSeed.preferences.publicId,

        profileId:
          profile.id,

        showJourneyHistory:
          profileSeed.preferences.showJourneyHistory,

        showJourneyStatistics:
          profileSeed.preferences.showJourneyStatistics,

        allowJourneyInvites:
          profileSeed.preferences.allowJourneyInvites,
      },
    });

    // -------------------------------------------------------------------------
    // Corridors
    // -------------------------------------------------------------------------

    for (const corridorSeed of profileSeed.corridors) {
      await prisma.travellerProfileCorridor.upsert({
        where: {
          publicId:
            corridorSeed.publicId,
        },

        update: {
          profileId:
            profile.id,

          originName:
            corridorSeed.originName,

          destinationName:
            corridorSeed.destinationName,

          originLatitude:
            corridorSeed.originLatitude,

          originLongitude:
            corridorSeed.originLongitude,

          destinationLatitude:
            corridorSeed.destinationLatitude,

          destinationLongitude:
            corridorSeed.destinationLongitude,

          corridorKey:
            corridorSeed.corridorKey,

          isPrimary:
            corridorSeed.isPrimary,
        },

        create: {
          publicId:
            corridorSeed.publicId,

          profileId:
            profile.id,

          originName:
            corridorSeed.originName,

          destinationName:
            corridorSeed.destinationName,

          originLatitude:
            corridorSeed.originLatitude,

          originLongitude:
            corridorSeed.originLongitude,

          destinationLatitude:
            corridorSeed.destinationLatitude,

          destinationLongitude:
            corridorSeed.destinationLongitude,

          corridorKey:
            corridorSeed.corridorKey,

          isPrimary:
            corridorSeed.isPrimary,
        },
      });
    }

    console.log(
      `   ✓ ${profileSeed.handle}`,
    );
  }

  console.log(
    `✓ ${TRAVELLER_PROFILE_SEEDS.length} traveller profiles`,
  );
}

//
// -----------------------------------------------------------------------------
// ROLE ASSIGNMENTS
// -----------------------------------------------------------------------------

const ROLE_ASSIGNMENTS: Record<
  string,
  readonly string[]
> = {
  SUPER_ADMIN: ['SUPER_ADMIN'],

  ADMIN: ['ADMIN'],

  BUSINESS: [
    'MEMBER',
    'BUSINESS',
  ],

  TRAVELER_LEADER: [
    'MEMBER',
    'TRAVELER',
    'TRAVELER_LEADER',
  ],

  DRIVER: [
    'MEMBER',
    'DRIVER',
  ],

  TRAVELER: [
    'MEMBER',
    'TRAVELER',
  ],

  MEMBER: [
    'MEMBER',
  ],
};

//
// -----------------------------------------------------------------------------
// ASSIGN ROLE
// -----------------------------------------------------------------------------

async function assignRole(
  identityId: string,
  roleCode: string,
  assignedById: string,
): Promise<void> {
  const role = await prisma.role.findUnique({
    where: {
      code: roleCode,
    },
  });

  if (!role) {
    throw new Error(
      `Role '${roleCode}' does not exist.`,
    );
  }

  await prisma.identityRole.upsert({
    where: {
      identityId_roleId: {
        identityId,
        roleId: role.id,
      },
    },

    update: {
      assignedById,
      assignedAt: new Date(),
      revokedAt: null,
      revokedById: null,
    },

    create: {
      identityId,
      roleId: role.id,
      assignedById,
      assignedAt: new Date(),
    },
  });
}

//
// -----------------------------------------------------------------------------
// ASSIGN SYSTEM ROLES
// -----------------------------------------------------------------------------

async function assignSystemRoles(
  identities: Record<string, string>,
): Promise<void> {
  console.log('Assigning roles...');

  const superAdminId =
    identities['SUPER_ADMIN'];

  if (!superAdminId) {
    throw new Error(
      'SUPER_ADMIN identity was not created.',
    );
  }

  for (const [
    identityKey,
    roles,
  ] of Object.entries(
    ROLE_ASSIGNMENTS,
  )) {
    const identityId =
      identities[identityKey];

    if (!identityId) {
      continue;
    }

    for (const role of roles) {
      await assignRole(
        identityId,
        role,
        superAdminId,
      );

      console.log(
        `   ✓ ${identityKey} -> ${role}`,
      );
    }
  }

  console.log(
    '✓ Role assignments complete',
  );
}

//
// -----------------------------------------------------------------------------
// PERMISSION ASSIGNMENTS
// -----------------------------------------------------------------------------

const ROLE_PERMISSIONS: Record<
  string,
  string[]
> = {
  // SUPER_ADMIN intentionally omitted.
  // PermissionsGuard grants unrestricted access.

  ADMIN: [
    'IDENTITY_VIEW',
    'IDENTITY_CREATE',
    'IDENTITY_UPDATE',
    'IDENTITY_ACTIVATE',
    'IDENTITY_SUSPEND',

    'ROLE_VIEW',
    'ROLE_ASSIGN',
    'ROLE_REVOKE',

    'PERMISSION_VIEW',

    'SESSION_VIEW',
    'SESSION_REVOKE',

    'DEVICE_VIEW',
    'DEVICE_REVOKE',

    'VERIFICATION_VIEW',
    'VERIFICATION_APPROVE',
    'VERIFICATION_REJECT',

    'AUDIT_VIEW',

    'TRAVELLER_PROFILE_VIEW',
    'TRAVELLER_PROFILE_CREATE',
    'TRAVELLER_PROFILE_UPDATE',
    'TRAVELLER_PROFILE_DELETE',
  ],

  BUSINESS: [
    'TRAVELLER_PROFILE_VIEW',
  ],

  TRAVELER_LEADER: [
    'TRAVELLER_PROFILE_VIEW',
    'TRAVELLER_PROFILE_CREATE',
    'TRAVELLER_PROFILE_UPDATE',
  ],

  DRIVER: [
    'TRAVELLER_PROFILE_VIEW',
    'TRAVELLER_PROFILE_CREATE',
    'TRAVELLER_PROFILE_UPDATE',
  ],

  TRAVELER: [
    'TRAVELLER_PROFILE_VIEW',
    'TRAVELLER_PROFILE_CREATE',
    'TRAVELLER_PROFILE_UPDATE',
  ],

  MEMBER: [
    'TRAVELLER_PROFILE_VIEW',
    'TRAVELLER_PROFILE_CREATE',
    'TRAVELLER_PROFILE_UPDATE',
  ],
};

//
// -----------------------------------------------------------------------------
// ASSIGN PERMISSION
// -----------------------------------------------------------------------------

async function assignPermission(
  roleCode: string,
  permissionCode: string,
): Promise<void> {
  const role = await prisma.role.findUnique({
    where: {
      code: roleCode,
    },
  });

  if (!role) {
    throw new Error(
      `Role '${roleCode}' not found.`,
    );
  }

  const permission =
    await prisma.permission.findUnique({
      where: {
        code: permissionCode,
      },
    });

  if (!permission) {
    throw new Error(
      `Permission '${permissionCode}' not found.`,
    );
  }

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: role.id,
        permissionId: permission.id,
      },
    },

    update: {},

    create: {
      roleId: role.id,
      permissionId: permission.id,
    },
  });
}

//
// -----------------------------------------------------------------------------
// ASSIGN ROLE PERMISSIONS
// -----------------------------------------------------------------------------

async function assignRolePermissions(): Promise<void> {
  console.log(
    'Assigning role permissions...',
  );

  for (const [
    role,
    permissions,
  ] of Object.entries(
    ROLE_PERMISSIONS,
  )) {
    for (const permission of permissions) {
      await assignPermission(
        role,
        permission,
      );

      console.log(
        `   ✓ ${role} -> ${permission}`,
      );
    }
  }

  console.log(
    '✓ Role permissions assigned',
  );
}

//
// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('');

  console.log(
    '==========================================================',
  );

  console.log(
    '       SisiMove Identity Bootstrap',
  );

  console.log(
    '==========================================================',
  );

  console.log('');

  // ===========================================================================
  // 1. Roles
  // ===========================================================================

  await seedRoles();

  // ===========================================================================
  // 2. Permissions
  // ===========================================================================

  await seedPermissions();

  // ===========================================================================
  // 3. Role permissions
  // ===========================================================================

  await assignRolePermissions();

  // ===========================================================================
  // 4. Users
  // ===========================================================================

  const identities =
    await seedSystemUsers();

  // ===========================================================================
  // 5. Traveller Profiles
  // ===========================================================================

  await seedTravellerProfiles();

  // ===========================================================================
  // 6. Role assignments
  // ===========================================================================

  await assignSystemRoles(
    identities,
  );

  console.log('');

  console.log(
    '==========================================================',
  );

  console.log(
    'Bootstrap completed successfully',
  );

  console.log(
    '==========================================================',
  );

  console.log('');

  console.table(
    SYSTEM_USERS.map((user) => ({
      Email: user.email,
      Role: user.role,
      Password: DEFAULT_PASSWORD,
    })),
  );

  console.log('');

  console.log(
    'SUPER_ADMIN bypasses permission checks in PermissionsGuard.',
  );

  console.log(
    'All other roles use RolePermission-based authorization.',
  );

  console.log('');
}

main()
  .catch((error) => {
    console.error('');

    console.error(
      '==========================================================',
    );

    console.error(
      'Bootstrap failed',
    );

    console.error(
      '==========================================================',
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });