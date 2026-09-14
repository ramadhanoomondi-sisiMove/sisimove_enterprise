import {
  PrismaClient,
  Prisma,
  IdentityStatus,
  AuthenticationStatus,
  VerificationStatus,
  VerificationLevel,
  VerificationRequestType,
  VerificationRequestStatus,
  AssetType,
  AssetCategory,
  AssetStatus,
  AssetVisibility,
  StorageProvider,
  TravellerProfileStatus,
  TravellerProfileVisibility,
  TrustProfileStatus,
  TrustVerificationLevel,
  JourneyStatus,
  JourneyWaypointType,
  JourneySmokingPolicy,
  JourneyPetsPolicy,
  JourneyLuggagePolicy,
  JourneyConversationPreference,
  JourneyMusicPreference,
  JourneyAssetType,
  JourneyDemandStatus,
  JourneyDemandWaypointType,
  JourneyDemandParticipantStatus,
  JourneyBookingStatus,
  JourneyBookingPaymentStatus,
  JourneyBoardingStatus,
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  JourneyBoardingEventType,
  JourneyCompletionStatus,
  JourneyCompletionConfirmationRole,
  JourneyCompletionConfirmationStatus,
  JourneySettlementStatus,
  CommercialCommissionType,
  CommercialCommissionRuleStatus,
  CommercialCommissionStatus,
  FinancialAccountType,
  FinancialAccountStatus,
  FinancialTransactionType,
  FinancialTransactionStatus,
  FinancialTransactionEntryType,
  FinancialBalanceType,
  FinancialPaymentMethodType,
  FinancialPaymentStatus,
  FinancialPaymentAttemptStatus,
  FinancialSettlementStatus,
  FinancialSettlementItemStatus,
  FinancialSettlementAllocationType,
  MessagingConversationType,
  MessagingConversationStatus,
  MessagingParticipantRole,
  MessagingParticipantStatus,
  MessagingMessageType,
  MessagingMessageStatus,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationChannel,
  NotificationDeliveryStatus,
  SupportCaseStatus,
  SupportCasePriority,
  SupportCaseCategory,
  SupportCaseParticipantRole,
  SupportMessageType,
} from '@prisma/client';

const prisma = new PrismaClient();

const NOW = new Date();

const DAYS = (days: number): Date =>
  new Date(NOW.getTime() + days * 24 * 60 * 60 * 1000);

const HOURS = (hours: number): Date =>
  new Date(NOW.getTime() + hours * 60 * 60 * 1000);

const money = (value: number): number => value;

async function main(): Promise<void> {
  console.log('==============================================');
  console.log('SisiMove development seed');
  console.log('==============================================');

  function requireRecord<T>(
  value: T | undefined,
  description: string,
): T {
  if (value === undefined) {
    throw new Error(`Seed data not found: ${description}`);
  }

  return value;
}

  // ===========================================================================
  // 1. ROLES
  // ===========================================================================

  console.log('\n[1/12] Seeding roles...');

  const roleDefinitions = [
    {
      code: 'MEMBER',
      name: 'Member',
      description: 'Standard SisiMove member.',
      displayOrder: 1,
    },
    {
      code: 'DRIVER',
      name: 'Driver',
      description: 'Verified member authorized to provide journeys.',
      displayOrder: 2,
    },
    {
      code: 'ADMIN',
      name: 'Administrator',
      description: 'Platform administrator.',
      displayOrder: 3,
    },
    {
      code: 'SUPER_ADMIN',
      name: 'Super Administrator',
      description: 'Highest platform administration role.',
      displayOrder: 4,
    },
  ];

  const roles: Record<string, { id: string; publicId: string }> = {};

  for (const definition of roleDefinitions) {
    const role = await prisma.role.upsert({
      where: {
        code: definition.code,
      },
      update: {
        name: definition.name,
        description: definition.description,
        displayOrder: definition.displayOrder,
        isSystem: true,
        isActive: true,
      },
      create: {
        publicId: `SM-ROLE-${definition.code}`,
        code: definition.code,
        name: definition.name,
        description: definition.description,
        displayOrder: definition.displayOrder,
        isSystem: true,
        isActive: true,
      },
    });

    roles[definition.code] = {
      id: role.id,
      publicId: role.publicId,
    };
  }

  // ===========================================================================
  // 2. PERMISSIONS
  // ===========================================================================

  console.log('[2/12] Seeding permissions...');

  const permissionDefinitions = [
    // Identity
    ['identity', 'read'],
    ['identity', 'update'],
    ['identity', 'manage'],

    // Profile
    ['profile', 'read'],
    ['profile', 'update'],
    ['profile', 'manage'],

    // Journey
    ['journey', 'read'],
    ['journey', 'create'],
    ['journey', 'update'],
    ['journey', 'cancel'],
    ['journey', 'manage'],

    // Demand
    ['demand', 'read'],
    ['demand', 'create'],
    ['demand', 'update'],
    ['demand', 'cancel'],
    ['demand', 'manage'],

    // Booking
    ['booking', 'read'],
    ['booking', 'create'],
    ['booking', 'cancel'],
    ['booking', 'manage'],

    // Boarding
    ['boarding', 'read'],
    ['boarding', 'manage'],

    // Verification
    ['verification', 'read'],
    ['verification', 'submit'],
    ['verification', 'review'],
    ['verification', 'manage'],

    // Assets
    ['asset', 'read'],
    ['asset', 'upload'],
    ['asset', 'manage'],

    // Trust
    ['trust', 'read'],
    ['trust', 'rate'],
    ['trust', 'manage'],

    // Financial
    ['financial', 'read'],
    ['financial', 'manage'],

    // Support
    ['support', 'read'],
    ['support', 'create'],
    ['support', 'manage'],

    // Authorization
    ['role', 'read'],
    ['role', 'assign'],
    ['role', 'manage'],
    ['permission', 'read'],
    ['permission', 'manage'],

    // Administration
    ['admin', 'read'],
    ['admin', 'manage'],
  ] as const;

  const permissions: Record<
    string,
    { id: string; publicId: string }
  > = {};

  for (const [resource, action] of permissionDefinitions) {
    const code = `${resource}.${action}`;

    const permission = await prisma.permission.upsert({
      where: {
        code,
      },
      update: {
        name: `${resource} ${action}`,
        resource,
        action,
        isSystem: true,
        isActive: true,
      },
      create: {
        publicId: `SM-PERM-${resource.toUpperCase()}-${action.toUpperCase()}`,
        code,
        name: `${resource} ${action}`,
        resource,
        action,
        isSystem: true,
        isActive: true,
      },
    });

    permissions[code] = {
      id: permission.id,
      publicId: permission.publicId,
    };
  }

// ===========================================================================
// 3. ROLE -> PERMISSIONS
// ===========================================================================

console.log('[3/12] Seeding role permissions...');

const memberPermissions = [
  'identity.read',
  'profile.read',
  'profile.update',
  'journey.read',
  'demand.read',
  'demand.create',
  'demand.update',
  'demand.cancel',
  'booking.read',
  'booking.create',
  'booking.cancel',
  'boarding.read',
  'verification.read',
  'verification.submit',
  'asset.read',
  'asset.upload',
  'trust.read',
  'trust.rate',
  'support.read',
  'support.create',
];

const driverPermissions = [
  ...memberPermissions,
  'journey.create',
  'journey.update',
  'journey.cancel',
  'journey.manage',
  'boarding.manage',
];

const adminPermissions = [
  'identity.read',
  'identity.update',
  'identity.manage',

  'profile.read',
  'profile.update',
  'profile.manage',

  'journey.read',
  'journey.manage',

  'demand.read',
  'demand.manage',

  'booking.read',
  'booking.manage',

  'boarding.read',
  'boarding.manage',

  'verification.read',
  'verification.review',

  'asset.read',
  'asset.manage',

  'trust.read',
  'trust.manage',

  'financial.read',

  'support.read',
  'support.manage',

  'role.read',
  'role.assign',

  'permission.read',

  'admin.read',
];

const superAdminPermissions = Object.keys(permissions);

const rolePermissionMap: Record<string, string[]> = {
  MEMBER: memberPermissions,
  DRIVER: driverPermissions,
  ADMIN: adminPermissions,
  SUPER_ADMIN: superAdminPermissions,
};

for (const [roleCode, permissionCodes] of Object.entries(
  rolePermissionMap,
)) {
  const role = roles[roleCode];

  if (!role) {
    throw new Error(
      `Role "${roleCode}" was not found while seeding role permissions.`,
    );
  }

  for (const permissionCode of permissionCodes) {
    const permission = permissions[permissionCode];

    if (!permission) {
      throw new Error(
        `Permission "${permissionCode}" was not found while seeding role "${roleCode}".`,
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
        publicId: `SM-RP-${roleCode}-${permissionCode
          .replace('.', '-')
          .toUpperCase()}`,
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }
}

  // ===========================================================================
  // 4. IDENTITIES
  // ===========================================================================

  console.log('[4/12] Seeding identities...');

  const identityDefinitions = {
    member: {
      publicId: 'SM-MEMBER-001',
      email: 'member@sisimove.test',
      phoneNumber: '+254700000001',
    },
    driver: {
      publicId: 'SM-DRIVER-001',
      email: 'driver@sisimove.test',
      phoneNumber: '+254700000002',
    },
    admin: {
      publicId: 'SM-ADMIN-001',
      email: 'admin@sisimove.test',
      phoneNumber: '+254700000003',
    },
    superAdmin: {
      publicId: 'SM-SUPERADMIN-001',
      email: 'superadmin@sisimove.test',
      phoneNumber: '+254700000004',
    },
  };

  const identities: Record<
    keyof typeof identityDefinitions,
    {
      id: string;
      publicId: string;
    }
  > = {} as Record<
    keyof typeof identityDefinitions,
    {
      id: string;
      publicId: string;
    }
  >;

  for (const [key, definition] of Object.entries(identityDefinitions)) {
    const identity = await prisma.identity.upsert({
      where: {
        email: definition.email,
      },
      update: {
        phoneNumber: definition.phoneNumber,
        status: IdentityStatus.ACTIVE,
        activatedAt: NOW,
        suspendedAt: null,
        closedAt: null,
      },
      create: {
        publicId: definition.publicId,
        email: definition.email,
        phoneNumber: definition.phoneNumber,
        status: IdentityStatus.ACTIVE,
        activatedAt: NOW,
      },
    });

    identities[key as keyof typeof identityDefinitions] = {
      id: identity.id,
      publicId: identity.publicId,
    };
  }

// ===========================================================================
// 5. IDENTITY ROLES
// ===========================================================================

console.log('[5/12] Assigning identity roles...');

const identityRoleDefinitions = [
  ['member', 'MEMBER'],
  ['driver', 'DRIVER'],
  ['admin', 'ADMIN'],
  ['superAdmin', 'SUPER_ADMIN'],
] as const;

for (const [identityKey, roleCode] of identityRoleDefinitions) {
  const identity = identities[identityKey];

  if (!identity) {
    throw new Error(
      `Identity "${identityKey}" was not found while assigning role "${roleCode}".`,
    );
  }

  const role = roles[roleCode];

  if (!role) {
    throw new Error(
      `Role "${roleCode}" was not found while assigning it to identity "${identityKey}".`,
    );
  }

  const assignedById =
    roleCode === 'SUPER_ADMIN'
      ? identity.id
      : identities.superAdmin?.id;

  if (!assignedById) {
    throw new Error(
      `Super-admin identity was not found while assigning role "${roleCode}" to identity "${identityKey}".`,
    );
  }

  const existing = await prisma.identityRole.findFirst({
    where: {
      identityId: identity.id,
      roleId: role.id,
      revokedAt: null,
    },
  });

  if (!existing) {
    await prisma.identityRole.create({
      data: {
        publicId: `SM-IR-${roleCode}-${identityKey.toUpperCase()}`,
        identityId: identity.id,
        roleId: role.id,
        assignedById,
        assignedAt: NOW,
      },
    });
  }
}

  // ===========================================================================
  // 6. AUTHENTICATION
  // ===========================================================================

  console.log('[6/12] Seeding authentication...');

  /*
   * Development-only password hash.
   *
   * Password:
   *   SisiMove123!
   *
   * Replace this with your application's actual password-hashing service
   * before using this seed outside development.
   */
  const developmentPasswordHash =
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC7Y2s3X9u4mG0gJ5v5K';

  for (const identity of Object.values(identities)) {
    await prisma.authentication.upsert({
      where: {
        identityPublicId: identity.publicId,
      },
      update: {
        status: AuthenticationStatus.ACTIVE,
        passwordHash: developmentPasswordHash,
        passwordMustChange: false,
        failedAuthenticationCount: 0,
        lockedAt: null,
        lockedUntil: null,
        lockReason: null,
      },
      create: {
        publicId: `SM-AUTH-${identity.publicId}`,
        identityPublicId: identity.publicId,
        status: AuthenticationStatus.ACTIVE,
        passwordHash: developmentPasswordHash,
        passwordVersion: 1,
        passwordChangedAt: NOW,
        passwordMustChange: false,
        failedAuthenticationCount: 0,
      },
    });
  }

  // ===========================================================================
  // 7. ASSETS
  // ===========================================================================

  console.log('[7/12] Seeding assets...');

  const memberAvatar = await prisma.asset.upsert({
    where: {
      objectKey: 'seed/member/profile.jpg',
    },
    update: {
      ownerIdentityId: identities.member.id,
      type: AssetType.IMAGE,
      category: AssetCategory.PROFILE_PHOTO,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PUBLIC,
    },
    create: {
      publicId: 'SM-ASSET-MEMBER-PROFILE',
      ownerIdentityId: identities.member.id,
      type: AssetType.IMAGE,
      category: AssetCategory.PROFILE_PHOTO,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PUBLIC,
      storageProvider: StorageProvider.LOCAL,
      bucket: 'sisimove-dev',
      objectKey: 'seed/member/profile.jpg',
      originalFilename: 'member-profile.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: BigInt(125000),
      uploadedAt: NOW,
    },
  });

  const driverAvatar = await prisma.asset.upsert({
    where: {
      objectKey: 'seed/driver/profile.jpg',
    },
    update: {
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.PROFILE_PHOTO,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PUBLIC,
    },
    create: {
      publicId: 'SM-ASSET-DRIVER-PROFILE',
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.PROFILE_PHOTO,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PUBLIC,
      storageProvider: StorageProvider.LOCAL,
      bucket: 'sisimove-dev',
      objectKey: 'seed/driver/profile.jpg',
      originalFilename: 'driver-profile.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: BigInt(145000),
      uploadedAt: NOW,
    },
  });

  const driverLicense = await prisma.asset.upsert({
    where: {
      objectKey: 'seed/driver/license.jpg',
    },
    update: {
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.DRIVER_LICENSE,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PRIVATE,
    },
    create: {
      publicId: 'SM-ASSET-DRIVER-LICENSE',
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.DRIVER_LICENSE,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PRIVATE,
      storageProvider: StorageProvider.LOCAL,
      bucket: 'sisimove-dev',
      objectKey: 'seed/driver/license.jpg',
      originalFilename: 'driver-license.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: BigInt(175000),
      uploadedAt: NOW,
    },
  });

  const governmentId = await prisma.asset.upsert({
    where: {
      objectKey: 'seed/driver/government-id.jpg',
    },
    update: {
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.GOVERNMENT_ID,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PRIVATE,
    },
    create: {
      publicId: 'SM-ASSET-DRIVER-GOV-ID',
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.GOVERNMENT_ID,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PRIVATE,
      storageProvider: StorageProvider.LOCAL,
      bucket: 'sisimove-dev',
      objectKey: 'seed/driver/government-id.jpg',
      originalFilename: 'government-id.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: BigInt(165000),
      uploadedAt: NOW,
    },
  });

  const vehiclePhoto = await prisma.asset.upsert({
    where: {
      objectKey: 'seed/driver/vehicle.jpg',
    },
    update: {
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.VEHICLE_PHOTO,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PUBLIC,
    },
    create: {
      publicId: 'SM-ASSET-VEHICLE-001',
      ownerIdentityId: identities.driver.id,
      type: AssetType.IMAGE,
      category: AssetCategory.VEHICLE_PHOTO,
      status: AssetStatus.READY,
      visibility: AssetVisibility.PUBLIC,
      storageProvider: StorageProvider.LOCAL,
      bucket: 'sisimove-dev',
      objectKey: 'seed/driver/vehicle.jpg',
      originalFilename: 'vehicle.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: BigInt(210000),
      uploadedAt: NOW,
    },
  });

  // ===========================================================================
  // 8. VERIFICATION
  // ===========================================================================

  console.log('[8/12] Seeding verification...');

  const driverVerification = await prisma.verification.upsert({
    where: {
      identityId: identities.driver.id,
    },
    update: {
      status: VerificationStatus.VERIFIED,
      level: VerificationLevel.DRIVER,
      profilePhotoVerified: true,
      governmentIdVerified: true,
      driverLicenseVerified: true,
      verifiedAt: NOW,
      memberVerifiedAt: NOW,
      driverVerifiedAt: NOW,
      profilePhotoVerifiedAt: NOW,
      governmentIdVerifiedAt: NOW,
      driverLicenseVerifiedAt: NOW,
      reviewedById: identities.admin.id,
      lastReviewedAt: NOW,
    },
    create: {
      publicId: 'SM-VERIFICATION-DRIVER-001',
      identityId: identities.driver.id,
      status: VerificationStatus.VERIFIED,
      level: VerificationLevel.DRIVER,
      profilePhotoVerified: true,
      governmentIdVerified: true,
      driverLicenseVerified: true,
      verifiedAt: NOW,
      memberVerifiedAt: NOW,
      driverVerifiedAt: NOW,
      profilePhotoVerifiedAt: NOW,
      governmentIdVerifiedAt: NOW,
      driverLicenseVerifiedAt: NOW,
      reviewedById: identities.admin.id,
      lastReviewedAt: NOW,
    },
  });

  await prisma.verification.upsert({
    where: {
      identityId: identities.member.id,
    },
    update: {
      status: VerificationStatus.VERIFIED,
      level: VerificationLevel.MEMBER,
      profilePhotoVerified: true,
      governmentIdVerified: true,
      driverLicenseVerified: false,
      verifiedAt: NOW,
      memberVerifiedAt: NOW,
      profilePhotoVerifiedAt: NOW,
      governmentIdVerifiedAt: NOW,
      driverLicenseVerifiedAt: null,
      reviewedById: identities.admin.id,
      lastReviewedAt: NOW,
    },
    create: {
      publicId: 'SM-VERIFICATION-MEMBER-001',
      identityId: identities.member.id,
      status: VerificationStatus.VERIFIED,
      level: VerificationLevel.MEMBER,
      profilePhotoVerified: true,
      governmentIdVerified: true,
      driverLicenseVerified: false,
      verifiedAt: NOW,
      memberVerifiedAt: NOW,
      profilePhotoVerifiedAt: NOW,
      governmentIdVerifiedAt: NOW,
      reviewedById: identities.admin.id,
      lastReviewedAt: NOW,
    },
  });

  // Verification requests for the driver's evidence.
  await prisma.verificationRequest.upsert({
    where: {
      publicId: 'SM-VREQ-DRIVER-LICENSE-001',
    },
    update: {
      status: VerificationRequestStatus.APPROVED,
      reviewedAt: NOW,
      reviewedById: identities.admin.id,
      rejectionReason: null,
    },
    create: {
      publicId: 'SM-VREQ-DRIVER-LICENSE-001',
      verificationId: driverVerification.id,
      type: VerificationRequestType.DRIVER_LICENSE,
      status: VerificationRequestStatus.APPROVED,
      assetId: driverLicense.id,
      submittedAt: NOW,
      reviewedAt: NOW,
      reviewedById: identities.admin.id,
    },
  });

  await prisma.verificationRequest.upsert({
    where: {
      publicId: 'SM-VREQ-DRIVER-GOV-ID-001',
    },
    update: {
      status: VerificationRequestStatus.APPROVED,
      reviewedAt: NOW,
      reviewedById: identities.admin.id,
      rejectionReason: null,
    },
    create: {
      publicId: 'SM-VREQ-DRIVER-GOV-ID-001',
      verificationId: driverVerification.id,
      type: VerificationRequestType.GOVERNMENT_ID,
      status: VerificationRequestStatus.APPROVED,
      assetId: governmentId.id,
      submittedAt: NOW,
      reviewedAt: NOW,
      reviewedById: identities.admin.id,
    },
  });

  // ===========================================================================
  // 9. TRAVELLER PROFILES
  // ===========================================================================

  console.log('[9/12] Seeding traveller profiles...');

  const memberProfile = await prisma.travellerProfile.upsert({
    where: {
      memberPublicId: identities.member.publicId,
    },
    update: {
      handle: 'sisimove_member',
      bio: 'SisiMove development member.',
      avatarAssetPublicId: memberAvatar.publicId,
      countryCode: 'KE',
      status: TravellerProfileStatus.ACTIVE,
      visibility: TravellerProfileVisibility.PUBLIC,
    },
    create: {
      publicId: 'SM-TRAVELLER-MEMBER-001',
      memberPublicId: identities.member.publicId,
      handle: 'sisimove_member',
      bio: 'SisiMove development member.',
      avatarAssetPublicId: memberAvatar.publicId,
      countryCode: 'KE',
      status: TravellerProfileStatus.ACTIVE,
      visibility: TravellerProfileVisibility.PUBLIC,
    },
  });

  const driverProfile = await prisma.travellerProfile.upsert({
    where: {
      memberPublicId: identities.driver.publicId,
    },
    update: {
      handle: 'sisimove_driver',
      bio: 'Verified SisiMove development driver.',
      avatarAssetPublicId: driverAvatar.publicId,
      countryCode: 'KE',
      status: TravellerProfileStatus.ACTIVE,
      visibility: TravellerProfileVisibility.PUBLIC,
      providerJourneys: 3,
      completedProviderJourneys: 2,
      totalJourneys: 3,
      completedJourneys: 2,
    },
    create: {
      publicId: 'SM-TRAVELLER-DRIVER-001',
      memberPublicId: identities.driver.publicId,
      handle: 'sisimove_driver',
      bio: 'Verified SisiMove development driver.',
      avatarAssetPublicId: driverAvatar.publicId,
      countryCode: 'KE',
      status: TravellerProfileStatus.ACTIVE,
      visibility: TravellerProfileVisibility.PUBLIC,
      providerJourneys: 3,
      completedProviderJourneys: 2,
      totalJourneys: 3,
      completedJourneys: 2,
    },
  });

  await prisma.travellerProfilePreferences.upsert({
    where: {
      profileId: memberProfile.id,
    },
    update: {},
    create: {
      publicId: 'SM-TPREF-MEMBER-001',
      profileId: memberProfile.id,
      showJourneyHistory: true,
      showJourneyStatistics: true,
      allowJourneyInvites: true,
    },
  });

  await prisma.travellerProfilePreferences.upsert({
    where: {
      profileId: driverProfile.id,
    },
    update: {},
    create: {
      publicId: 'SM-TPREF-DRIVER-001',
      profileId: driverProfile.id,
      showJourneyHistory: true,
      showJourneyStatistics: true,
      allowJourneyInvites: true,
    },
  });

  // ===========================================================================
  // 10. TRUST
  // ===========================================================================

  console.log('[10/12] Seeding trust profiles...');

  await prisma.trustProfile.upsert({
    where: {
      memberPublicId: identities.member.publicId,
    },
    update: {
      status: TrustProfileStatus.ACTIVE,
      verificationLevel: TrustVerificationLevel.VERIFIED,
      ratingAverage: new Prisma.Decimal('4.80'),
      ratingCount: 2,
      completedJourneys: 2,
      passengerJourneys: 2,
      completedPassengerJourneys: 2,
      completionRate: new Prisma.Decimal('100.00'),
      cancellationRate: new Prisma.Decimal('0.00'),
    },
    create: {
      publicId: 'SM-TRUST-MEMBER-001',
      memberPublicId: identities.member.publicId,
      status: TrustProfileStatus.ACTIVE,
      verificationLevel: TrustVerificationLevel.VERIFIED,
      ratingAverage: new Prisma.Decimal('4.80'),
      ratingCount: 2,
      completedJourneys: 2,
      passengerJourneys: 2,
      completedPassengerJourneys: 2,
      completionRate: new Prisma.Decimal('100.00'),
      cancellationRate: new Prisma.Decimal('0.00'),
    },
  });

  await prisma.trustProfile.upsert({
    where: {
      memberPublicId: identities.driver.publicId,
    },
    update: {
      status: TrustProfileStatus.ACTIVE,
      verificationLevel: TrustVerificationLevel.HIGHLY_VERIFIED,
      ratingAverage: new Prisma.Decimal('4.90'),
      ratingCount: 5,
      completedJourneys: 2,
      providerJourneys: 3,
      completedProviderJourneys: 2,
      completionRate: new Prisma.Decimal('100.00'),
      cancellationRate: new Prisma.Decimal('0.00'),
    },
    create: {
      publicId: 'SM-TRUST-DRIVER-001',
      memberPublicId: identities.driver.publicId,
      status: TrustProfileStatus.ACTIVE,
      verificationLevel: TrustVerificationLevel.HIGHLY_VERIFIED,
      ratingAverage: new Prisma.Decimal('4.90'),
      ratingCount: 5,
      completedJourneys: 2,
      providerJourneys: 3,
      completedProviderJourneys: 2,
      completionRate: new Prisma.Decimal('100.00'),
      cancellationRate: new Prisma.Decimal('0.00'),
    },
  });

  // ===========================================================================
  // 11. JOURNEY VEHICLES
  // ===========================================================================

  console.log('[11/12] Seeding vehicles and published journeys...');

  const vehicle = await prisma.journeyVehicle.upsert({
    where: {
      publicId: 'SM-JVEHICLE-001',
    },
    update: {
      make: 'Toyota',
      model: 'Fielder',
      year: 2021,
      color: 'Silver',
      registration: 'KDA 123A',
      assetPublicId: vehiclePhoto.publicId,
    },
    create: {
      publicId: 'SM-JVEHICLE-001',
      make: 'Toyota',
      model: 'Fielder',
      year: 2021,
      color: 'Silver',
      registration: 'KDA 123A',
      assetPublicId: vehiclePhoto.publicId,
    },
  });

  const departure = HOURS(36);
  const arrival = HOURS(41);

  const journey = await prisma.journey.upsert({
    where: {
      publicId: 'SM-JOURNEY-001',
    },
    update: {
      providerPublicId: identities.driver.publicId,
      status: JourneyStatus.PUBLISHED,
      publishedAt: NOW,
      startedAt: null,
      completionRequestedAt: null,
      completedAt: null,
      cancelledAt: null,
      expiredAt: null,
      version: 1,
      vehicleId: vehicle.id,
    },
    create: {
      publicId: 'SM-JOURNEY-001',
      providerPublicId: identities.driver.publicId,
      status: JourneyStatus.PUBLISHED,
      publishedAt: NOW,
      version: 1,
      vehicleId: vehicle.id,
    },
  });

  const journeyCorridor = await prisma.journeyCorridor.upsert({
    where: {
      journeyId: journey.id,
    },
    update: {
      originName: 'Nairobi',
      destinationName: 'Nakuru',
      originLatitude: new Prisma.Decimal('-1.2863890'),
      originLongitude: new Prisma.Decimal('36.8172230'),
      destinationLatitude: new Prisma.Decimal('-0.3030990'),
      destinationLongitude: new Prisma.Decimal('36.0800250'),
      corridorKey: 'KE-NAIROBI-NAKURU',
    },
    create: {
      publicId: 'SM-JCORRIDOR-001',
      journeyId: journey.id,
      originName: 'Nairobi',
      destinationName: 'Nakuru',
      originLatitude: new Prisma.Decimal('-1.2863890'),
      originLongitude: new Prisma.Decimal('36.8172230'),
      destinationLatitude: new Prisma.Decimal('-0.3030990'),
      destinationLongitude: new Prisma.Decimal('36.0800250'),
      corridorKey: 'KE-NAIROBI-NAKURU',
    },
  });

  const journeyWaypoints = [
    {
      publicId: 'SM-JWAYPOINT-001',
      type: JourneyWaypointType.ORIGIN,
      sequence: 1,
      name: 'Nairobi CBD',
      latitude: new Prisma.Decimal('-1.2863890'),
      longitude: new Prisma.Decimal('36.8172230'),
      pickupAllowed: true,
      dropoffAllowed: false,
    },
    {
      publicId: 'SM-JWAYPOINT-002',
      type: JourneyWaypointType.WAYPOINT,
      sequence: 2,
      name: 'Naivasha',
      latitude: new Prisma.Decimal('-0.7177000'),
      longitude: new Prisma.Decimal('36.4310000'),
      pickupAllowed: true,
      dropoffAllowed: true,
    },
    {
      publicId: 'SM-JWAYPOINT-003',
      type: JourneyWaypointType.DESTINATION,
      sequence: 3,
      name: 'Nakuru CBD',
      latitude: new Prisma.Decimal('-0.3030990'),
      longitude: new Prisma.Decimal('36.0800250'),
      pickupAllowed: false,
      dropoffAllowed: true,
    },
  ];

  for (const waypoint of journeyWaypoints) {
    await prisma.journeyWaypoint.upsert({
      where: {
        corridorId_sequence: {
          corridorId: journeyCorridor.id,
          sequence: waypoint.sequence,
        },
      },
      update: {
        type: waypoint.type,
        name: waypoint.name,
        latitude: waypoint.latitude,
        longitude: waypoint.longitude,
        pickupAllowed: waypoint.pickupAllowed,
        dropoffAllowed: waypoint.dropoffAllowed,
      },
      create: {
        ...waypoint,
        corridorId: journeyCorridor.id,
      },
    });
  }

  await prisma.journeySchedule.upsert({
    where: {
      journeyId: journey.id,
    },
    update: {
      departureAt: departure,
      arrivalAt: arrival,
      timezone: 'Africa/Nairobi',
    },
    create: {
      publicId: 'SM-JSCHEDULE-001',
      journeyId: journey.id,
      departureAt: departure,
      arrivalAt: arrival,
      timezone: 'Africa/Nairobi',
    },
  });

  await prisma.journeyCapacity.upsert({
    where: {
      journeyId: journey.id,
    },
    update: {
      totalSeats: 4,
      bookedSeats: 1,
    },
    create: {
      publicId: 'SM-JCAPACITY-001',
      journeyId: journey.id,
      totalSeats: 4,
      bookedSeats: 1,
    },
  });

  await prisma.journeyPricing.upsert({
    where: {
      journeyId: journey.id,
    },
    update: {
      amount: money(1250),
      currency: 'KES',
    },
    create: {
      publicId: 'SM-JPRICING-001',
      journeyId: journey.id,
      amount: money(1250),
      currency: 'KES',
    },
  });

  await prisma.journeyPreferences.upsert({
    where: {
      journeyId: journey.id,
    },
    update: {
      smoking: JourneySmokingPolicy.NOT_ALLOWED,
      pets: JourneyPetsPolicy.NOT_ALLOWED,
      luggage: JourneyLuggagePolicy.STANDARD,
      conversation: JourneyConversationPreference.MODERATE,
      music: JourneyMusicPreference.LOW,
    },
    create: {
      publicId: 'SM-JPREFERENCES-001',
      journeyId: journey.id,
      smoking: JourneySmokingPolicy.NOT_ALLOWED,
      pets: JourneyPetsPolicy.NOT_ALLOWED,
      luggage: JourneyLuggagePolicy.STANDARD,
      conversation: JourneyConversationPreference.MODERATE,
      music: JourneyMusicPreference.LOW,
    },
  });

  await prisma.journeyAsset.upsert({
    where: {
      journeyId_assetPublicId: {
        journeyId: journey.id,
        assetPublicId: vehiclePhoto.publicId,
      },
    },
    update: {
      type: JourneyAssetType.VEHICLE,
      sortOrder: 1,
    },
    create: {
      publicId: 'SM-JASSET-001',
      journeyId: journey.id,
      assetPublicId: vehiclePhoto.publicId,
      type: JourneyAssetType.VEHICLE,
      sortOrder: 1,
    },
  });


  const additionalPublishedJourneys = [
    {
      publicId: 'SM-JOURNEY-002',
      corridorPublicId: 'SM-JCORRIDOR-002',
      schedulePublicId: 'SM-JSCHEDULE-002',
      capacityPublicId: 'SM-JCAPACITY-002',
      pricingPublicId: 'SM-JPRICING-002',
      preferencesPublicId: 'SM-JPREFERENCES-002',
      vehiclePublicId: 'SM-JVEHICLE-002',
      vehicle: {
        make: 'Nissan',
        model: 'X-Trail',
        year: 2022,
        color: 'Black',
        registration: 'KDG 456B',
      },
      originName: 'Nairobi',
      destinationName: 'Mombasa',
      corridorKey: 'KE-NAIROBI-MOMBASA',
      originLatitude: '-1.2863890',
      originLongitude: '36.8172230',
      destinationLatitude: '-4.0434771',
      destinationLongitude: '39.6682065',
      departureHours: 60,
      arrivalHours: 68,
      price: 2200,
      totalSeats: 4,
      bookedSeats: 0,
      waypoints: [
        { publicId: 'SM-JWAYPOINT-004', type: JourneyWaypointType.ORIGIN, sequence: 1, name: 'Nairobi CBD', latitude: '-1.2863890', longitude: '36.8172230', pickupAllowed: true, dropoffAllowed: false },
        { publicId: 'SM-JWAYPOINT-005', type: JourneyWaypointType.WAYPOINT, sequence: 2, name: 'Voi', latitude: '-3.3960000', longitude: '38.5560000', pickupAllowed: true, dropoffAllowed: true },
        { publicId: 'SM-JWAYPOINT-006', type: JourneyWaypointType.DESTINATION, sequence: 3, name: 'Mombasa CBD', latitude: '-4.0434771', longitude: '39.6682065', pickupAllowed: false, dropoffAllowed: true },
      ],
    },
    {
      publicId: 'SM-JOURNEY-003',
      corridorPublicId: 'SM-JCORRIDOR-003',
      schedulePublicId: 'SM-JSCHEDULE-003',
      capacityPublicId: 'SM-JCAPACITY-003',
      pricingPublicId: 'SM-JPRICING-003',
      preferencesPublicId: 'SM-JPREFERENCES-003',
      vehiclePublicId: 'SM-JVEHICLE-003',
      vehicle: {
        make: 'Subaru',
        model: 'Forester',
        year: 2020,
        color: 'Blue',
        registration: 'KDH 789C',
      },
      originName: 'Nairobi',
      destinationName: 'Eldoret',
      corridorKey: 'KE-NAIROBI-ELDORET',
      originLatitude: '-1.2863890',
      originLongitude: '36.8172230',
      destinationLatitude: '0.5142779',
      destinationLongitude: '35.2697800',
      departureHours: 84,
      arrivalHours: 91,
      price: 1500,
      totalSeats: 4,
      bookedSeats: 1,
      waypoints: [
        { publicId: 'SM-JWAYPOINT-007', type: JourneyWaypointType.ORIGIN, sequence: 1, name: 'Nairobi CBD', latitude: '-1.2863890', longitude: '36.8172230', pickupAllowed: true, dropoffAllowed: false },
        { publicId: 'SM-JWAYPOINT-008', type: JourneyWaypointType.WAYPOINT, sequence: 2, name: 'Nakuru CBD', latitude: '-0.3030990', longitude: '36.0800250', pickupAllowed: true, dropoffAllowed: true },
        { publicId: 'SM-JWAYPOINT-009', type: JourneyWaypointType.DESTINATION, sequence: 3, name: 'Eldoret CBD', latitude: '0.5142779', longitude: '35.2697800', pickupAllowed: false, dropoffAllowed: true },
      ],
    },
    {
      publicId: 'SM-JOURNEY-004',
      corridorPublicId: 'SM-JCORRIDOR-004',
      schedulePublicId: 'SM-JSCHEDULE-004',
      capacityPublicId: 'SM-JCAPACITY-004',
      pricingPublicId: 'SM-JPRICING-004',
      preferencesPublicId: 'SM-JPREFERENCES-004',
      vehiclePublicId: 'SM-JVEHICLE-004',
      vehicle: {
        make: 'Mazda',
        model: 'CX-5',
        year: 2023,
        color: 'White',
        registration: 'KDJ 321D',
      },
      originName: 'Nakuru',
      destinationName: 'Kisumu',
      corridorKey: 'KE-NAKURU-KISUMU',
      originLatitude: '-0.3030990',
      originLongitude: '36.0800250',
      destinationLatitude: '-0.1022100',
      destinationLongitude: '34.7617100',
      departureHours: 108,
      arrivalHours: 114,
      price: 1300,
      totalSeats: 4,
      bookedSeats: 0,
      waypoints: [
        { publicId: 'SM-JWAYPOINT-010', type: JourneyWaypointType.ORIGIN, sequence: 1, name: 'Nakuru CBD', latitude: '-0.3030990', longitude: '36.0800250', pickupAllowed: true, dropoffAllowed: false },
        { publicId: 'SM-JWAYPOINT-011', type: JourneyWaypointType.WAYPOINT, sequence: 2, name: 'Kericho', latitude: '-0.3692000', longitude: '35.2863000', pickupAllowed: true, dropoffAllowed: true },
        { publicId: 'SM-JWAYPOINT-012', type: JourneyWaypointType.DESTINATION, sequence: 3, name: 'Kisumu CBD', latitude: '-0.1022100', longitude: '34.7617100', pickupAllowed: false, dropoffAllowed: true },
      ],
    },
  ];

  for (const definition of additionalPublishedJourneys) {
    const additionalVehicle = await prisma.journeyVehicle.upsert({
      where: { publicId: definition.vehiclePublicId },
      update: definition.vehicle,
      create: { publicId: definition.vehiclePublicId, ...definition.vehicle },
    });

    const additionalJourney = await prisma.journey.upsert({
      where: { publicId: definition.publicId },
      update: {
        providerPublicId: identities.driver.publicId,
        status: JourneyStatus.PUBLISHED,
        publishedAt: NOW,
        startedAt: null,
        completionRequestedAt: null,
        completedAt: null,
        cancelledAt: null,
        expiredAt: null,
        version: 1,
        vehicleId: additionalVehicle.id,
      },
      create: {
        publicId: definition.publicId,
        providerPublicId: identities.driver.publicId,
        status: JourneyStatus.PUBLISHED,
        publishedAt: NOW,
        version: 1,
        vehicleId: additionalVehicle.id,
      },
    });

    const additionalCorridor = await prisma.journeyCorridor.upsert({
      where: { journeyId: additionalJourney.id },
      update: {
        originName: definition.originName,
        destinationName: definition.destinationName,
        originLatitude: new Prisma.Decimal(definition.originLatitude),
        originLongitude: new Prisma.Decimal(definition.originLongitude),
        destinationLatitude: new Prisma.Decimal(definition.destinationLatitude),
        destinationLongitude: new Prisma.Decimal(definition.destinationLongitude),
        corridorKey: definition.corridorKey,
      },
      create: {
        publicId: definition.corridorPublicId,
        journeyId: additionalJourney.id,
        originName: definition.originName,
        destinationName: definition.destinationName,
        originLatitude: new Prisma.Decimal(definition.originLatitude),
        originLongitude: new Prisma.Decimal(definition.originLongitude),
        destinationLatitude: new Prisma.Decimal(definition.destinationLatitude),
        destinationLongitude: new Prisma.Decimal(definition.destinationLongitude),
        corridorKey: definition.corridorKey,
      },
    });

    for (const waypoint of definition.waypoints) {
      await prisma.journeyWaypoint.upsert({
        where: {
          corridorId_sequence: {
            corridorId: additionalCorridor.id,
            sequence: waypoint.sequence,
          },
        },
        update: {
          type: waypoint.type,
          name: waypoint.name,
          latitude: new Prisma.Decimal(waypoint.latitude),
          longitude: new Prisma.Decimal(waypoint.longitude),
          pickupAllowed: waypoint.pickupAllowed,
          dropoffAllowed: waypoint.dropoffAllowed,
        },
        create: {
          publicId: waypoint.publicId,
          corridorId: additionalCorridor.id,
          type: waypoint.type,
          sequence: waypoint.sequence,
          name: waypoint.name,
          latitude: new Prisma.Decimal(waypoint.latitude),
          longitude: new Prisma.Decimal(waypoint.longitude),
          pickupAllowed: waypoint.pickupAllowed,
          dropoffAllowed: waypoint.dropoffAllowed,
        },
      });
    }

    await prisma.journeySchedule.upsert({
      where: { journeyId: additionalJourney.id },
      update: {
        departureAt: HOURS(definition.departureHours),
        arrivalAt: HOURS(definition.arrivalHours),
        timezone: 'Africa/Nairobi',
      },
      create: {
        publicId: definition.schedulePublicId,
        journeyId: additionalJourney.id,
        departureAt: HOURS(definition.departureHours),
        arrivalAt: HOURS(definition.arrivalHours),
        timezone: 'Africa/Nairobi',
      },
    });

    await prisma.journeyCapacity.upsert({
      where: { journeyId: additionalJourney.id },
      update: {
        totalSeats: definition.totalSeats,
        bookedSeats: definition.bookedSeats,
      },
      create: {
        publicId: definition.capacityPublicId,
        journeyId: additionalJourney.id,
        totalSeats: definition.totalSeats,
        bookedSeats: definition.bookedSeats,
      },
    });

    await prisma.journeyPricing.upsert({
      where: { journeyId: additionalJourney.id },
      update: {
        amount: money(definition.price),
        currency: 'KES',
      },
      create: {
        publicId: definition.pricingPublicId,
        journeyId: additionalJourney.id,
        amount: money(definition.price),
        currency: 'KES',
      },
    });

    await prisma.journeyPreferences.upsert({
      where: { journeyId: additionalJourney.id },
      update: {
        smoking: JourneySmokingPolicy.NOT_ALLOWED,
        pets: JourneyPetsPolicy.NOT_ALLOWED,
        luggage: JourneyLuggagePolicy.STANDARD,
        conversation: JourneyConversationPreference.MODERATE,
        music: JourneyMusicPreference.LOW,
      },
      create: {
        publicId: definition.preferencesPublicId,
        journeyId: additionalJourney.id,
        smoking: JourneySmokingPolicy.NOT_ALLOWED,
        pets: JourneyPetsPolicy.NOT_ALLOWED,
        luggage: JourneyLuggagePolicy.STANDARD,
        conversation: JourneyConversationPreference.MODERATE,
        music: JourneyMusicPreference.LOW,
      },
    });
  }

  // ===========================================================================
  // 12. JOURNEY DEMANDS
  // ===========================================================================

  console.log('[12/12] Seeding journey demands and open demand listings...');

  const demand = await prisma.journeyDemand.upsert({
    where: {
      publicId: 'SM-DEMAND-001',
    },
    update: {
      requesterPublicId: identities.member.publicId,
      status: JourneyDemandStatus.MATCHED,
      matchedJourneyPublicId: journey.publicId,
      publishedAt: NOW,
      matchedAt: NOW,
      convertedAt: null,
      fulfilledAt: null,
      cancelledAt: null,
      expiredAt: null,
      version: 1,
    },
    create: {
      publicId: 'SM-DEMAND-001',
      requesterPublicId: identities.member.publicId,
      status: JourneyDemandStatus.MATCHED,
      matchedJourneyPublicId: journey.publicId,
      publishedAt: NOW,
      matchedAt: NOW,
      version: 1,
    },
  });

  const demandCorridor = await prisma.journeyDemandCorridor.upsert({
    where: {
      demandId: demand.id,
    },
    update: {
      originName: 'Nairobi',
      destinationName: 'Nakuru',
      originLatitude: new Prisma.Decimal('-1.2863890'),
      originLongitude: new Prisma.Decimal('36.8172230'),
      destinationLatitude: new Prisma.Decimal('-0.3030990'),
      destinationLongitude: new Prisma.Decimal('36.0800250'),
      corridorKey: 'KE-NAIROBI-NAKURU',
    },
    create: {
      publicId: 'SM-DCORRIDOR-001',
      demandId: demand.id,
      originName: 'Nairobi',
      destinationName: 'Nakuru',
      originLatitude: new Prisma.Decimal('-1.2863890'),
      originLongitude: new Prisma.Decimal('36.8172230'),
      destinationLatitude: new Prisma.Decimal('-0.3030990'),
      destinationLongitude: new Prisma.Decimal('36.0800250'),
      corridorKey: 'KE-NAIROBI-NAKURU',
    },
  });

  const demandWaypoints = [
    {
      publicId: 'SM-DWAYPOINT-001',
      type: JourneyDemandWaypointType.ORIGIN,
      sequence: 1,
      name: 'Nairobi CBD',
      latitude: new Prisma.Decimal('-1.2863890'),
      longitude: new Prisma.Decimal('36.8172230'),
      pickupRequired: true,
      dropoffRequired: false,
    },
    {
      publicId: 'SM-DWAYPOINT-002',
      type: JourneyDemandWaypointType.DESTINATION,
      sequence: 2,
      name: 'Nakuru CBD',
      latitude: new Prisma.Decimal('-0.3030990'),
      longitude: new Prisma.Decimal('36.0800250'),
      pickupRequired: false,
      dropoffRequired: true,
    },
  ];

  for (const waypoint of demandWaypoints) {
    await prisma.journeyDemandWaypoint.upsert({
      where: {
        corridorId_sequence: {
          corridorId: demandCorridor.id,
          sequence: waypoint.sequence,
        },
      },
      update: {
        type: waypoint.type,
        name: waypoint.name,
        latitude: waypoint.latitude,
        longitude: waypoint.longitude,
        pickupRequired: waypoint.pickupRequired,
        dropoffRequired: waypoint.dropoffRequired,
      },
      create: {
        ...waypoint,
        corridorId: demandCorridor.id,
      },
    });
  }

  await prisma.journeyDemandSchedule.upsert({
    where: {
      demandId: demand.id,
    },
    update: {
      earliestDeparture: HOURS(32),
      latestDeparture: HOURS(40),
      targetArrival: HOURS(45),
      maximumArrival: HOURS(48),
      timezone: 'Africa/Nairobi',
    },
    create: {
      publicId: 'SM-DSCHEDULE-001',
      demandId: demand.id,
      earliestDeparture: HOURS(32),
      latestDeparture: HOURS(40),
      targetArrival: HOURS(45),
      maximumArrival: HOURS(48),
      timezone: 'Africa/Nairobi',
    },
  });

  await prisma.journeyDemandCapacity.upsert({
    where: {
      demandId: demand.id,
    },
    update: {
      requestedSeats: 1,
      matchedSeats: 1,
    },
    create: {
      publicId: 'SM-DCAPACITY-001',
      demandId: demand.id,
      requestedSeats: 1,
      matchedSeats: 1,
    },
  });

  await prisma.journeyDemandPricing.upsert({
    where: {
      demandId: demand.id,
    },
    update: {
      maximumPricePerSeat: 1400,
      preferredPricePerSeat: 1250,
      currency: 'KES',
    },
    create: {
      publicId: 'SM-DPRICING-001',
      demandId: demand.id,
      maximumPricePerSeat: 1400,
      preferredPricePerSeat: 1250,
      currency: 'KES',
    },
  });

  const existingDemandParticipant =
    await prisma.journeyDemandParticipant.findFirst({
      where: {
        demandId: demand.id,
        memberPublicId: identities.member.publicId,
      },
    });

  if (!existingDemandParticipant) {
    await prisma.journeyDemandParticipant.create({
      data: {
        publicId: 'SM-DPARTICIPANT-001',
        demandId: demand.id,
        memberPublicId: identities.member.publicId,
        seats: 1,
        status: JourneyDemandParticipantStatus.ACTIVE,
        joinedAt: NOW,
      },
    });
  }


  const additionalOpenDemands = [
    {
      publicId: 'SM-DEMAND-002',
      corridorPublicId: 'SM-DCORRIDOR-002',
      schedulePublicId: 'SM-DSCHEDULE-002',
      capacityPublicId: 'SM-DCAPACITY-002',
      pricingPublicId: 'SM-DPRICING-002',
      participantPublicId: 'SM-DPARTICIPANT-002',
      originName: 'Nairobi',
      destinationName: 'Mombasa',
      corridorKey: 'KE-NAIROBI-MOMBASA',
      originLatitude: '-1.2863890',
      originLongitude: '36.8172230',
      destinationLatitude: '-4.0434771',
      destinationLongitude: '39.6682065',
      earliestDepartureHours: 54,
      latestDepartureHours: 66,
      targetArrivalHours: 72,
      maximumArrivalHours: 78,
      requestedSeats: 1,
      maximumPricePerSeat: 2300,
      preferredPricePerSeat: 2100,
      waypoints: [
        { publicId: 'SM-DWAYPOINT-003', type: JourneyDemandWaypointType.ORIGIN, sequence: 1, name: 'Nairobi CBD', latitude: '-1.2863890', longitude: '36.8172230', pickupRequired: true, dropoffRequired: false },
        { publicId: 'SM-DWAYPOINT-004', type: JourneyDemandWaypointType.DESTINATION, sequence: 2, name: 'Mombasa CBD', latitude: '-4.0434771', longitude: '39.6682065', pickupRequired: false, dropoffRequired: true },
      ],
    },
    {
      publicId: 'SM-DEMAND-003',
      corridorPublicId: 'SM-DCORRIDOR-003',
      schedulePublicId: 'SM-DSCHEDULE-003',
      capacityPublicId: 'SM-DCAPACITY-003',
      pricingPublicId: 'SM-DPRICING-003',
      participantPublicId: 'SM-DPARTICIPANT-003',
      originName: 'Nairobi',
      destinationName: 'Eldoret',
      corridorKey: 'KE-NAIROBI-ELDORET',
      originLatitude: '-1.2863890',
      originLongitude: '36.8172230',
      destinationLatitude: '0.5142779',
      destinationLongitude: '35.2697800',
      earliestDepartureHours: 78,
      latestDepartureHours: 90,
      targetArrivalHours: 96,
      maximumArrivalHours: 102,
      requestedSeats: 2,
      maximumPricePerSeat: 1600,
      preferredPricePerSeat: 1450,
      waypoints: [
        { publicId: 'SM-DWAYPOINT-005', type: JourneyDemandWaypointType.ORIGIN, sequence: 1, name: 'Nairobi CBD', latitude: '-1.2863890', longitude: '36.8172230', pickupRequired: true, dropoffRequired: false },
        { publicId: 'SM-DWAYPOINT-006', type: JourneyDemandWaypointType.DESTINATION, sequence: 2, name: 'Eldoret CBD', latitude: '0.5142779', longitude: '35.2697800', pickupRequired: false, dropoffRequired: true },
      ],
    },
    {
      publicId: 'SM-DEMAND-004',
      corridorPublicId: 'SM-DCORRIDOR-004',
      schedulePublicId: 'SM-DSCHEDULE-004',
      capacityPublicId: 'SM-DCAPACITY-004',
      pricingPublicId: 'SM-DPRICING-004',
      participantPublicId: 'SM-DPARTICIPANT-004',
      originName: 'Nakuru',
      destinationName: 'Kisumu',
      corridorKey: 'KE-NAKURU-KISUMU',
      originLatitude: '-0.3030990',
      originLongitude: '36.0800250',
      destinationLatitude: '-0.1022100',
      destinationLongitude: '34.7617100',
      earliestDepartureHours: 102,
      latestDepartureHours: 114,
      targetArrivalHours: 120,
      maximumArrivalHours: 126,
      requestedSeats: 1,
      maximumPricePerSeat: 1400,
      preferredPricePerSeat: 1250,
      waypoints: [
        { publicId: 'SM-DWAYPOINT-007', type: JourneyDemandWaypointType.ORIGIN, sequence: 1, name: 'Nakuru CBD', latitude: '-0.3030990', longitude: '36.0800250', pickupRequired: true, dropoffRequired: false },
        { publicId: 'SM-DWAYPOINT-008', type: JourneyDemandWaypointType.DESTINATION, sequence: 2, name: 'Kisumu CBD', latitude: '-0.1022100', longitude: '34.7617100', pickupRequired: false, dropoffRequired: true },
      ],
    },
  ];

  for (const definition of additionalOpenDemands) {
    const openDemand = await prisma.journeyDemand.upsert({
      where: { publicId: definition.publicId },
      update: {
        requesterPublicId: identities.member.publicId,
        status: JourneyDemandStatus.OPEN,
        matchedJourneyPublicId: null,
        publishedAt: NOW,
        matchedAt: null,
        convertedAt: null,
        fulfilledAt: null,
        cancelledAt: null,
        expiredAt: null,
        version: 1,
      },
      create: {
        publicId: definition.publicId,
        requesterPublicId: identities.member.publicId,
        status: JourneyDemandStatus.OPEN,
        publishedAt: NOW,
        version: 1,
      },
    });

    const openDemandCorridor = await prisma.journeyDemandCorridor.upsert({
      where: { demandId: openDemand.id },
      update: {
        originName: definition.originName,
        destinationName: definition.destinationName,
        originLatitude: new Prisma.Decimal(definition.originLatitude),
        originLongitude: new Prisma.Decimal(definition.originLongitude),
        destinationLatitude: new Prisma.Decimal(definition.destinationLatitude),
        destinationLongitude: new Prisma.Decimal(definition.destinationLongitude),
        corridorKey: definition.corridorKey,
      },
      create: {
        publicId: definition.corridorPublicId,
        demandId: openDemand.id,
        originName: definition.originName,
        destinationName: definition.destinationName,
        originLatitude: new Prisma.Decimal(definition.originLatitude),
        originLongitude: new Prisma.Decimal(definition.originLongitude),
        destinationLatitude: new Prisma.Decimal(definition.destinationLatitude),
        destinationLongitude: new Prisma.Decimal(definition.destinationLongitude),
        corridorKey: definition.corridorKey,
      },
    });

    for (const waypoint of definition.waypoints) {
      await prisma.journeyDemandWaypoint.upsert({
        where: {
          corridorId_sequence: {
            corridorId: openDemandCorridor.id,
            sequence: waypoint.sequence,
          },
        },
        update: {
          type: waypoint.type,
          name: waypoint.name,
          latitude: new Prisma.Decimal(waypoint.latitude),
          longitude: new Prisma.Decimal(waypoint.longitude),
          pickupRequired: waypoint.pickupRequired,
          dropoffRequired: waypoint.dropoffRequired,
        },
        create: {
          publicId: waypoint.publicId,
          corridorId: openDemandCorridor.id,
          type: waypoint.type,
          sequence: waypoint.sequence,
          name: waypoint.name,
          latitude: new Prisma.Decimal(waypoint.latitude),
          longitude: new Prisma.Decimal(waypoint.longitude),
          pickupRequired: waypoint.pickupRequired,
          dropoffRequired: waypoint.dropoffRequired,
        },
      });
    }

    await prisma.journeyDemandSchedule.upsert({
      where: { demandId: openDemand.id },
      update: {
        earliestDeparture: HOURS(definition.earliestDepartureHours),
        latestDeparture: HOURS(definition.latestDepartureHours),
        targetArrival: HOURS(definition.targetArrivalHours),
        maximumArrival: HOURS(definition.maximumArrivalHours),
        timezone: 'Africa/Nairobi',
      },
      create: {
        publicId: definition.schedulePublicId,
        demandId: openDemand.id,
        earliestDeparture: HOURS(definition.earliestDepartureHours),
        latestDeparture: HOURS(definition.latestDepartureHours),
        targetArrival: HOURS(definition.targetArrivalHours),
        maximumArrival: HOURS(definition.maximumArrivalHours),
        timezone: 'Africa/Nairobi',
      },
    });

    await prisma.journeyDemandCapacity.upsert({
      where: { demandId: openDemand.id },
      update: {
        requestedSeats: definition.requestedSeats,
        matchedSeats: 0,
      },
      create: {
        publicId: definition.capacityPublicId,
        demandId: openDemand.id,
        requestedSeats: definition.requestedSeats,
        matchedSeats: 0,
      },
    });

    await prisma.journeyDemandPricing.upsert({
      where: { demandId: openDemand.id },
      update: {
        maximumPricePerSeat: definition.maximumPricePerSeat,
        preferredPricePerSeat: definition.preferredPricePerSeat,
        currency: 'KES',
      },
      create: {
        publicId: definition.pricingPublicId,
        demandId: openDemand.id,
        maximumPricePerSeat: definition.maximumPricePerSeat,
        preferredPricePerSeat: definition.preferredPricePerSeat,
        currency: 'KES',
      },
    });

    const existingOpenDemandParticipant = await prisma.journeyDemandParticipant.findFirst({
      where: {
        demandId: openDemand.id,
        memberPublicId: identities.member.publicId,
      },
    });

    if (!existingOpenDemandParticipant) {
      await prisma.journeyDemandParticipant.create({
        data: {
          publicId: definition.participantPublicId,
          demandId: openDemand.id,
          memberPublicId: identities.member.publicId,
          seats: definition.requestedSeats,
          status: JourneyDemandParticipantStatus.ACTIVE,
          joinedAt: NOW,
        },
      });
    }
  }


  // ===========================================================================
  // 13. JOURNEY BOOKING
  // ===========================================================================

  console.log('[13/22] Seeding journey booking...');

  const booking = await prisma.journeyBooking.upsert({
    where: {
      publicId: 'SM-BOOKING-001',
    },
    update: {
      journeyPublicId: journey.publicId,
      passengerPublicId: identities.member.publicId,
      status: JourneyBookingStatus.CONFIRMED,
      seats: 1,
      confirmedAt: NOW,
      cancelledAt: null,
      completedAt: null,
      expiredAt: null,
      version: 1,
    },
    create: {
      publicId: 'SM-BOOKING-001',
      journeyPublicId: journey.publicId,
      passengerPublicId: identities.member.publicId,
      status: JourneyBookingStatus.CONFIRMED,
      seats: 1,
      confirmedAt: NOW,
      version: 1,
    },
  });

  await prisma.journeyBookingSnapshot.upsert({
    where: {
      bookingId: booking.id,
    },
    update: {
      originName: 'Nairobi',
      destinationName: 'Nakuru',
      originLatitude: new Prisma.Decimal('-1.2863890'),
      originLongitude: new Prisma.Decimal('36.8172230'),
      destinationLatitude: new Prisma.Decimal('-0.3030990'),
      destinationLongitude: new Prisma.Decimal('36.0800250'),
      departureAt: departure,
      arrivalAt: arrival,
      timezone: 'Africa/Nairobi',
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year,
      vehicleColor: vehicle.color,
      vehicleRegistration: vehicle.registration,
    },
    create: {
      publicId: 'SM-BSNAPSHOT-001',
      bookingId: booking.id,
      originName: 'Nairobi',
      destinationName: 'Nakuru',
      originLatitude: new Prisma.Decimal('-1.2863890'),
      originLongitude: new Prisma.Decimal('36.8172230'),
      destinationLatitude: new Prisma.Decimal('-0.3030990'),
      destinationLongitude: new Prisma.Decimal('36.0800250'),
      departureAt: departure,
      arrivalAt: arrival,
      timezone: 'Africa/Nairobi',
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year,
      vehicleColor: vehicle.color,
      vehicleRegistration: vehicle.registration,
    },
  });

  await prisma.journeyBookingPricing.upsert({
    where: {
      bookingId: booking.id,
    },
    update: {
      pricePerSeat: 1200,
      seats: 1,
      subtotal: 1200,
      discountAmount: 0,
      adjustmentAmount: 0,
      totalAmount: 1200,
      currency: 'KES',
    },
    create: {
      publicId: 'SM-BPRICING-001',
      bookingId: booking.id,
      pricePerSeat: 1200,
      seats: 1,
      subtotal: 1200,
      discountAmount: 0,
      adjustmentAmount: 0,
      totalAmount: 1200,
      currency: 'KES',
    },
  });

  // Passenger payment = KES 1,200 journey price + KES 60 booking commission.
  await prisma.journeyBookingPayment.upsert({
    where: {
      bookingId: booking.id,
    },
    update: {
      status: JourneyBookingPaymentStatus.CAPTURED,
      amount: 1260,
      currency: 'KES',
      transactionPublicId: 'SM-FIN-TX-PAYMENT-001',
      authorizedAt: NOW,
      capturedAt: NOW,
      failedAt: null,
      refundedAt: null,
      failureReason: null,
    },
    create: {
      publicId: 'SM-BPAYMENT-001',
      bookingId: booking.id,
      status: JourneyBookingPaymentStatus.CAPTURED,
      amount: 1260,
      currency: 'KES',
      transactionPublicId: 'SM-FIN-TX-PAYMENT-001',
      authorizedAt: NOW,
      capturedAt: NOW,
    },
  });

  // ===========================================================================
  // 14. JOURNEY BOARDING
  // ===========================================================================

  console.log('[14/22] Seeding journey boarding...');

  const boarding = await prisma.journeyBoarding.upsert({
    where: {
      journeyId: journey.id,
    },
    update: {
      providerPublicId: identities.driver.publicId,
      status: JourneyBoardingStatus.STARTED,
      boardingStartedAt: departure,
      journeyStartedAt: departure,
      cancelledAt: null,
      version: 1,
    },
    create: {
      publicId: 'SM-BOARDING-001',
      journeyId: journey.id,
      providerPublicId: identities.driver.publicId,
      status: JourneyBoardingStatus.STARTED,
      boardingStartedAt: departure,
      journeyStartedAt: departure,
      version: 1,
    },
  });

  const boardingParticipants = [
    {
      publicId: 'SM-BPARTICIPANT-PROVIDER-001',
      memberPublicId: identities.driver.publicId,
      bookingPublicId: null,
      role: JourneyBoardingParticipantRole.PROVIDER,
      status: JourneyBoardingParticipantStatus.BOARDED,
      expectedAt: departure,
      boardedAt: departure,
      withdrawnAt: null,
      noShowAt: null,
      removedAt: null,
    },
    {
      publicId: 'SM-BPARTICIPANT-PASSENGER-001',
      memberPublicId: identities.member.publicId,
      bookingPublicId: booking.publicId,
      role: JourneyBoardingParticipantRole.PASSENGER,
      status: JourneyBoardingParticipantStatus.BOARDED,
      expectedAt: departure,
      boardedAt: departure,
      withdrawnAt: null,
      noShowAt: null,
      removedAt: null,
    },
  ];

  for (const participant of boardingParticipants) {
    await prisma.journeyBoardingParticipant.upsert({
      where: {
        boardingId_memberPublicId: {
          boardingId: boarding.id,
          memberPublicId: participant.memberPublicId,
        },
      },
      update: {
        bookingPublicId: participant.bookingPublicId,
        role: participant.role,
        status: participant.status,
        expectedAt: participant.expectedAt,
        boardedAt: participant.boardedAt,
        withdrawnAt: participant.withdrawnAt,
        noShowAt: participant.noShowAt,
        removedAt: participant.removedAt,
      },
      create: {
        publicId: participant.publicId,
        boardingId: boarding.id,
        memberPublicId: participant.memberPublicId,
        bookingPublicId: participant.bookingPublicId,
        role: participant.role,
        status: participant.status,
        expectedAt: participant.expectedAt,
        boardedAt: participant.boardedAt,
      },
    });
  }

  const boardingEvents = [
    {
      publicId: 'SM-BEVENT-001',
      type: JourneyBoardingEventType.BOARDING_OPENED,
      memberPublicId: null,
      bookingPublicId: null,
      actorPublicId: identities.driver.publicId,
      occurredAt: departure,
      metadata: { seed: true },
    },
    {
      publicId: 'SM-BEVENT-002',
      type: JourneyBoardingEventType.PROVIDER_BOARDED,
      memberPublicId: identities.driver.publicId,
      bookingPublicId: null,
      actorPublicId: identities.driver.publicId,
      occurredAt: departure,
      metadata: { seed: true },
    },
    {
      publicId: 'SM-BEVENT-003',
      type: JourneyBoardingEventType.PASSENGER_BOARDED,
      memberPublicId: identities.member.publicId,
      bookingPublicId: booking.publicId,
      actorPublicId: identities.driver.publicId,
      occurredAt: departure,
      metadata: { seed: true },
    },
    {
      publicId: 'SM-BEVENT-004',
      type: JourneyBoardingEventType.JOURNEY_STARTED,
      memberPublicId: null,
      bookingPublicId: null,
      actorPublicId: identities.driver.publicId,
      occurredAt: departure,
      metadata: { seed: true },
    },
  ];

  for (const event of boardingEvents) {
    await prisma.journeyBoardingEvent.upsert({
      where: {
        publicId: event.publicId,
      },
      update: {
        type: event.type,
        memberPublicId: event.memberPublicId,
        bookingPublicId: event.bookingPublicId,
        actorPublicId: event.actorPublicId,
        occurredAt: event.occurredAt,
        metadata: event.metadata,
      },
      create: {
        publicId: event.publicId,
        boardingId: boarding.id,
        type: event.type,
        memberPublicId: event.memberPublicId,
        bookingPublicId: event.bookingPublicId,
        actorPublicId: event.actorPublicId,
        occurredAt: event.occurredAt,
        metadata: event.metadata,
      },
    });
  }

  // Keep the Journey lifecycle consistent with the seeded execution state.
  await prisma.journey.update({
    where: {
      id: journey.id,
    },
    data: {
      status: JourneyStatus.IN_PROGRESS,
      startedAt: departure,
      completionRequestedAt: null,
      completedAt: null,
      cancelledAt: null,
      expiredAt: null,
    },
  });

  // ===========================================================================
  // 15. JOURNEY COMPLETION
  // ===========================================================================

  console.log('[15/22] Seeding journey completion...');

  const completion = await prisma.journeyCompletion.upsert({
    where: {
      journeyPublicId: journey.publicId,
    },
    update: {
      providerPublicId: identities.driver.publicId,
      status: JourneyCompletionStatus.CONFIRMED,
      completionRequestedAt: arrival,
      confirmedAt: arrival,
      disputedAt: null,
      cancelledAt: null,
      requiredConfirmations: 2,
      confirmedCount: 2,
      version: 1,
    },
    create: {
      publicId: 'SM-COMPLETION-001',
      journeyPublicId: journey.publicId,
      providerPublicId: identities.driver.publicId,
      status: JourneyCompletionStatus.CONFIRMED,
      completionRequestedAt: arrival,
      confirmedAt: arrival,
      requiredConfirmations: 2,
      confirmedCount: 2,
      version: 1,
    },
  });

  const completionConfirmations = [
    {
      publicId: 'SM-CCONFIRM-PROVIDER-001',
      memberPublicId: identities.driver.publicId,
      bookingPublicId: null,
      role: JourneyCompletionConfirmationRole.PROVIDER,
    },
    {
      publicId: 'SM-CCONFIRM-PASSENGER-001',
      memberPublicId: identities.member.publicId,
      bookingPublicId: booking.publicId,
      role: JourneyCompletionConfirmationRole.PASSENGER,
    },
  ];

  for (const confirmation of completionConfirmations) {
    await prisma.journeyCompletionConfirmation.upsert({
      where: {
        completionId_memberPublicId: {
          completionId: completion.id,
          memberPublicId: confirmation.memberPublicId,
        },
      },
      update: {
        bookingPublicId: confirmation.bookingPublicId,
        role: confirmation.role,
        status: JourneyCompletionConfirmationStatus.CONFIRMED,
        confirmedAt: arrival,
        withdrawnAt: null,
      },
      create: {
        publicId: confirmation.publicId,
        completionId: completion.id,
        memberPublicId: confirmation.memberPublicId,
        bookingPublicId: confirmation.bookingPublicId,
        role: confirmation.role,
        status: JourneyCompletionConfirmationStatus.CONFIRMED,
        confirmedAt: arrival,
      },
    });
  }

  await prisma.journey.update({
    where: {
      id: journey.id,
    },
    data: {
      status: JourneyStatus.COMPLETED,
      startedAt: departure,
      completionRequestedAt: arrival,
      completedAt: arrival,
      cancelledAt: null,
      expiredAt: null,
    },
  });

  await prisma.journeyBooking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: JourneyBookingStatus.COMPLETED,
      confirmedAt: NOW,
      completedAt: arrival,
      cancelledAt: null,
      expiredAt: null,
    },
  });

  // ===========================================================================
  // 16. JOURNEY SETTLEMENT
  // ===========================================================================

  console.log('[16/22] Seeding journey settlement...');

  const journeySettlement = await prisma.journeySettlement.upsert({
    where: {
      completionId: completion.id,
    },
    update: {
      journeyPublicId: journey.publicId,
      providerPublicId: identities.driver.publicId,
      status: JourneySettlementStatus.COMPLETED,
      financialTransactionPublicId: 'SM-FIN-TX-SETTLEMENT-001',
      submittedAt: arrival,
      processingAt: arrival,
      completedAt: arrival,
      failedAt: null,
      heldAt: null,
      cancelledAt: null,
      failureReason: null,
      version: 1,
    },
    create: {
      publicId: 'SM-JSETTLEMENT-001',
      completionId: completion.id,
      journeyPublicId: journey.publicId,
      providerPublicId: identities.driver.publicId,
      status: JourneySettlementStatus.COMPLETED,
      financialTransactionPublicId: 'SM-FIN-TX-SETTLEMENT-001',
      submittedAt: arrival,
      processingAt: arrival,
      completedAt: arrival,
      version: 1,
    },
  });

  // ===========================================================================
  // 17. COMMERCIAL
  // ===========================================================================

  console.log('[17/22] Seeding commercial rules and commissions...');

  const bookingCommissionRule = await prisma.commercialCommissionRule.upsert({
    where: {
      type_version: {
        type: CommercialCommissionType.BOOKING,
        version: 1,
      },
    },
    update: {
      percentage: new Prisma.Decimal('5.00'),
      status: CommercialCommissionRuleStatus.ACTIVE,
      effectiveFrom: NOW,
      effectiveTo: null,
      version: 1,
    },
    create: {
      publicId: 'SM-COMMISSION-RULE-BOOKING-001',
      type: CommercialCommissionType.BOOKING,
      percentage: new Prisma.Decimal('5.00'),
      status: CommercialCommissionRuleStatus.ACTIVE,
      effectiveFrom: NOW,
      version: 1,
    },
  });

  const earningCommissionRule = await prisma.commercialCommissionRule.upsert({
    where: {
      type_version: {
        type: CommercialCommissionType.EARNING,
        version: 1,
      },
    },
    update: {
      percentage: new Prisma.Decimal('5.00'),
      status: CommercialCommissionRuleStatus.ACTIVE,
      effectiveFrom: NOW,
      effectiveTo: null,
      version: 1,
    },
    create: {
      publicId: 'SM-COMMISSION-RULE-EARNING-001',
      type: CommercialCommissionType.EARNING,
      percentage: new Prisma.Decimal('5.00'),
      status: CommercialCommissionRuleStatus.ACTIVE,
      effectiveFrom: NOW,
      version: 1,
    },
  });

  await prisma.commercialBookingCommission.upsert({
    where: {
      bookingPublicId: booking.publicId,
    },
    update: {
      journeyPublicId: journey.publicId,
      commissionRuleId: bookingCommissionRule.id,
      percentage: new Prisma.Decimal('5.00'),
      baseAmount: 1200,
      commissionAmount: 60,
      currency: 'KES',
      status: CommercialCommissionStatus.ASSESSED,
      assessedAt: NOW,
      cancelledAt: null,
    },
    create: {
      publicId: 'SM-BOOKING-COMMISSION-001',
      bookingPublicId: booking.publicId,
      journeyPublicId: journey.publicId,
      commissionRuleId: bookingCommissionRule.id,
      percentage: new Prisma.Decimal('5.00'),
      baseAmount: 1200,
      commissionAmount: 60,
      currency: 'KES',
      status: CommercialCommissionStatus.ASSESSED,
      assessedAt: NOW,
    },
  });

  await prisma.commercialEarningCommission.upsert({
    where: {
      settlementPublicId: journeySettlement.publicId,
    },
    update: {
      journeyPublicId: journey.publicId,
      providerPublicId: identities.driver.publicId,
      commissionRuleId: earningCommissionRule.id,
      percentage: new Prisma.Decimal('5.00'),
      baseAmount: 1200,
      commissionAmount: 60,
      netAmount: 1140,
      currency: 'KES',
      status: CommercialCommissionStatus.ASSESSED,
      assessedAt: NOW,
      cancelledAt: null,
    },
    create: {
      publicId: 'SM-EARNING-COMMISSION-001',
      journeyPublicId: journey.publicId,
      settlementPublicId: journeySettlement.publicId,
      providerPublicId: identities.driver.publicId,
      commissionRuleId: earningCommissionRule.id,
      percentage: new Prisma.Decimal('5.00'),
      baseAmount: 1200,
      commissionAmount: 60,
      netAmount: 1140,
      currency: 'KES',
      status: CommercialCommissionStatus.ASSESSED,
      assessedAt: NOW,
    },
  });

  // ===========================================================================
  // 18. FINANCIAL
  // ===========================================================================

  console.log('[18/22] Seeding financial accounts, payment and settlement...');

  const memberAccount = await prisma.financialAccount.upsert({
    where: {
      ownerPublicId: identities.member.publicId,
    },
    update: {
      type: FinancialAccountType.USER,
      status: FinancialAccountStatus.ACTIVE,
      currency: 'KES',
    },
    create: {
      publicId: 'SM-FIN-ACCOUNT-MEMBER-001',
      type: FinancialAccountType.USER,
      status: FinancialAccountStatus.ACTIVE,
      ownerPublicId: identities.member.publicId,
      currency: 'KES',
    },
  });

  const driverAccount = await prisma.financialAccount.upsert({
    where: {
      ownerPublicId: identities.driver.publicId,
    },
    update: {
      type: FinancialAccountType.USER,
      status: FinancialAccountStatus.ACTIVE,
      currency: 'KES',
    },
    create: {
      publicId: 'SM-FIN-ACCOUNT-DRIVER-001',
      type: FinancialAccountType.USER,
      status: FinancialAccountStatus.ACTIVE,
      ownerPublicId: identities.driver.publicId,
      currency: 'KES',
    },
  });

  const platformAccount = await prisma.financialAccount.upsert({
    where: {
      publicId: 'SM-FIN-ACCOUNT-PLATFORM-001',
    },
    update: {
      type: FinancialAccountType.PLATFORM,
      status: FinancialAccountStatus.ACTIVE,
      ownerPublicId: null,
      currency: 'KES',
    },
    create: {
      publicId: 'SM-FIN-ACCOUNT-PLATFORM-001',
      type: FinancialAccountType.PLATFORM,
      status: FinancialAccountStatus.ACTIVE,
      ownerPublicId: null,
      currency: 'KES',
    },
  });

  await prisma.financialAccountBalance.upsert({
    where: {
      accountId: memberAccount.id,
    },
    update: {
      availableAmount: 0,
      pendingAmount: 0,
      heldAmount: 0,
      currency: 'KES',
      version: 1,
    },
    create: {
      publicId: 'SM-FIN-BALANCE-MEMBER-001',
      accountId: memberAccount.id,
      availableAmount: 0,
      pendingAmount: 0,
      heldAmount: 0,
      currency: 'KES',
      version: 1,
    },
  });

  await prisma.financialAccountBalance.upsert({
    where: {
      accountId: driverAccount.id,
    },
    update: {
      availableAmount: 1140,
      pendingAmount: 0,
      heldAmount: 0,
      currency: 'KES',
      version: 1,
    },
    create: {
      publicId: 'SM-FIN-BALANCE-DRIVER-001',
      accountId: driverAccount.id,
      availableAmount: 1140,
      pendingAmount: 0,
      heldAmount: 0,
      currency: 'KES',
      version: 1,
    },
  });

  await prisma.financialAccountBalance.upsert({
    where: {
      accountId: platformAccount.id,
    },
    update: {
      availableAmount: 120,
      pendingAmount: 0,
      heldAmount: 0,
      currency: 'KES',
      version: 1,
    },
    create: {
      publicId: 'SM-FIN-BALANCE-PLATFORM-001',
      accountId: platformAccount.id,
      availableAmount: 120,
      pendingAmount: 0,
      heldAmount: 0,
      currency: 'KES',
      version: 1,
    },
  });

  const memberPaymentMethod = await prisma.financialPaymentMethod.upsert({
    where: {
      provider_providerReference: {
        provider: 'M-PESA',
        providerReference: 'SEED-MEMBER-001',
      },
    },
    update: {
      accountId: memberAccount.id,
      type: FinancialPaymentMethodType.MOBILE_MONEY,
      displayName: 'M-PESA',
      lastFour: '0001',
      isDefault: true,
      isActive: true,
    },
    create: {
      publicId: 'SM-FIN-PMETHOD-MEMBER-001',
      accountId: memberAccount.id,
      type: FinancialPaymentMethodType.MOBILE_MONEY,
      provider: 'M-PESA',
      providerReference: 'SEED-MEMBER-001',
      displayName: 'M-PESA',
      lastFour: '0001',
      isDefault: true,
      isActive: true,
    },
  });

  const paymentTransaction = await prisma.financialTransaction.upsert({
    where: {
      publicId: 'SM-FIN-TX-PAYMENT-001',
    },
    update: {
      type: FinancialTransactionType.PAYMENT,
      status: FinancialTransactionStatus.COMPLETED,
      sourceAccountId: memberAccount.id,
      destinationAccountId: platformAccount.id,
      amount: 1260,
      currency: 'KES',
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      accountingJournalPublicId: null,
      completedAt: NOW,
      failedAt: null,
      reversedAt: null,
      cancelledAt: null,
    },
    create: {
      publicId: 'SM-FIN-TX-PAYMENT-001',
      type: FinancialTransactionType.PAYMENT,
      status: FinancialTransactionStatus.COMPLETED,
      sourceAccountId: memberAccount.id,
      destinationAccountId: platformAccount.id,
      amount: 1260,
      currency: 'KES',
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      completedAt: NOW,
    },
  });

  const payment = await prisma.financialPayment.upsert({
    where: {
      publicId: 'SM-FIN-PAYMENT-001',
    },
    update: {
      accountId: memberAccount.id,
      amount: 1260,
      currency: 'KES',
      status: FinancialPaymentStatus.SUCCEEDED,
      methodId: memberPaymentMethod.id,
      transactionPublicId: paymentTransaction.publicId,
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      initiatedAt: NOW,
      completedAt: NOW,
      failedAt: null,
      cancelledAt: null,
    },
    create: {
      publicId: 'SM-FIN-PAYMENT-001',
      accountId: memberAccount.id,
      amount: 1260,
      currency: 'KES',
      status: FinancialPaymentStatus.SUCCEEDED,
      methodId: memberPaymentMethod.id,
      transactionPublicId: paymentTransaction.publicId,
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      initiatedAt: NOW,
      completedAt: NOW,
    },
  });

  await prisma.financialPaymentAttempt.upsert({
    where: {
      provider_providerReference: {
        provider: 'M-PESA',
        providerReference: 'SEED-TXN-0001',
      },
    },
    update: {
      paymentId: payment.id,
      status: FinancialPaymentAttemptStatus.SUCCEEDED,
      amount: 1260,
      currency: 'KES',
      failureCode: null,
      failureMessage: null,
      startedAt: NOW,
      completedAt: NOW,
      failedAt: null,
    },
    create: {
      publicId: 'SM-FIN-PATTEMPT-001',
      paymentId: payment.id,
      status: FinancialPaymentAttemptStatus.SUCCEEDED,
      provider: 'M-PESA',
      providerReference: 'SEED-TXN-0001',
      amount: 1260,
      currency: 'KES',
      startedAt: NOW,
      completedAt: NOW,
    },
  });

  await prisma.financialTransactionEntry.upsert({
    where: {
      publicId: 'SM-FIN-ENTRY-PAYMENT-DEBIT-001',
    },
    update: {
      transactionId: paymentTransaction.id,
      accountId: memberAccount.id,
      type: FinancialTransactionEntryType.DEBIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1260,
    },
    create: {
      publicId: 'SM-FIN-ENTRY-PAYMENT-DEBIT-001',
      transactionId: paymentTransaction.id,
      accountId: memberAccount.id,
      type: FinancialTransactionEntryType.DEBIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1260,
    },
  });

  await prisma.financialTransactionEntry.upsert({
    where: {
      publicId: 'SM-FIN-ENTRY-PAYMENT-CREDIT-001',
    },
    update: {
      transactionId: paymentTransaction.id,
      accountId: platformAccount.id,
      type: FinancialTransactionEntryType.CREDIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1260,
    },
    create: {
      publicId: 'SM-FIN-ENTRY-PAYMENT-CREDIT-001',
      transactionId: paymentTransaction.id,
      accountId: platformAccount.id,
      type: FinancialTransactionEntryType.CREDIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1260,
    },
  });

  const settlementTransaction = await prisma.financialTransaction.upsert({
    where: {
      publicId: 'SM-FIN-TX-SETTLEMENT-001',
    },
    update: {
      type: FinancialTransactionType.SETTLEMENT,
      status: FinancialTransactionStatus.COMPLETED,
      sourceAccountId: platformAccount.id,
      destinationAccountId: driverAccount.id,
      amount: 1140,
      currency: 'KES',
      referenceType: 'JourneySettlement',
      referencePublicId: journeySettlement.publicId,
      accountingJournalPublicId: null,
      completedAt: arrival,
      failedAt: null,
      reversedAt: null,
      cancelledAt: null,
    },
    create: {
      publicId: 'SM-FIN-TX-SETTLEMENT-001',
      type: FinancialTransactionType.SETTLEMENT,
      status: FinancialTransactionStatus.COMPLETED,
      sourceAccountId: platformAccount.id,
      destinationAccountId: driverAccount.id,
      amount: 1140,
      currency: 'KES',
      referenceType: 'JourneySettlement',
      referencePublicId: journeySettlement.publicId,
      completedAt: arrival,
    },
  });

  await prisma.financialTransactionEntry.upsert({
    where: {
      publicId: 'SM-FIN-ENTRY-SETTLEMENT-DEBIT-001',
    },
    update: {
      transactionId: settlementTransaction.id,
      accountId: platformAccount.id,
      type: FinancialTransactionEntryType.DEBIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1140,
    },
    create: {
      publicId: 'SM-FIN-ENTRY-SETTLEMENT-DEBIT-001',
      transactionId: settlementTransaction.id,
      accountId: platformAccount.id,
      type: FinancialTransactionEntryType.DEBIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1140,
    },
  });

  await prisma.financialTransactionEntry.upsert({
    where: {
      publicId: 'SM-FIN-ENTRY-SETTLEMENT-CREDIT-001',
    },
    update: {
      transactionId: settlementTransaction.id,
      accountId: driverAccount.id,
      type: FinancialTransactionEntryType.CREDIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1140,
    },
    create: {
      publicId: 'SM-FIN-ENTRY-SETTLEMENT-CREDIT-001',
      transactionId: settlementTransaction.id,
      accountId: driverAccount.id,
      type: FinancialTransactionEntryType.CREDIT,
      balanceType: FinancialBalanceType.AVAILABLE,
      amount: 1140,
    },
  });

  const financialSettlement = await prisma.financialSettlement.upsert({
    where: {
      publicId: 'SM-FIN-SETTLEMENT-001',
    },
    update: {
      status: FinancialSettlementStatus.COMPLETED,
      currency: 'KES',
      totalAmount: 1140,
      startedAt: arrival,
      completedAt: arrival,
      failedAt: null,
      cancelledAt: null,
    },
    create: {
      publicId: 'SM-FIN-SETTLEMENT-001',
      status: FinancialSettlementStatus.COMPLETED,
      currency: 'KES',
      totalAmount: 1140,
      startedAt: arrival,
      completedAt: arrival,
    },
  });

  const financialSettlementItem =
    await prisma.financialSettlementItem.upsert({
      where: {
        publicId: 'SM-FIN-SETTLEMENT-ITEM-001',
      },
      update: {
        settlementId: financialSettlement.id,
        referenceType: 'JourneySettlement',
        referencePublicId: journeySettlement.publicId,
        amount: 1140,
        currency: 'KES',
        status: FinancialSettlementItemStatus.SETTLED,
      },
      create: {
        publicId: 'SM-FIN-SETTLEMENT-ITEM-001',
        settlementId: financialSettlement.id,
        referenceType: 'JourneySettlement',
        referencePublicId: journeySettlement.publicId,
        amount: 1140,
        currency: 'KES',
        status: FinancialSettlementItemStatus.SETTLED,
      },
    });

  await prisma.financialSettlementAllocation.upsert({
    where: {
      publicId: 'SM-FIN-SETTLEMENT-ALLOC-001',
    },
    update: {
      settlementItemId: financialSettlementItem.id,
      accountId: driverAccount.id,
      type: FinancialSettlementAllocationType.PRINCIPAL,
      amount: 1140,
      currency: 'KES',
      transactionPublicId: settlementTransaction.publicId,
    },
    create: {
      publicId: 'SM-FIN-SETTLEMENT-ALLOC-001',
      settlementItemId: financialSettlementItem.id,
      accountId: driverAccount.id,
      type: FinancialSettlementAllocationType.PRINCIPAL,
      amount: 1140,
      currency: 'KES',
      transactionPublicId: settlementTransaction.publicId,
    },
  });

  // ===========================================================================
  // 19. MESSAGING
  // ===========================================================================

  console.log('[19/22] Seeding messaging...');

  const conversation = await prisma.messagingConversation.upsert({
    where: {
      publicId: 'SM-CONVERSATION-001',
    },
    update: {
      type: MessagingConversationType.JOURNEY,
      status: MessagingConversationStatus.ACTIVE,
      journeyPublicId: journey.publicId,
      bookingPublicId: booking.publicId,
      lastMessageAt: NOW,
      closedAt: null,
    },
    create: {
      publicId: 'SM-CONVERSATION-001',
      type: MessagingConversationType.JOURNEY,
      status: MessagingConversationStatus.ACTIVE,
      journeyPublicId: journey.publicId,
      bookingPublicId: booking.publicId,
      lastMessageAt: NOW,
    },
  });

  const messagingParticipants = [
    {
      publicId: 'SM-MPARTICIPANT-DRIVER-001',
      memberPublicId: identities.driver.publicId,
      role: MessagingParticipantRole.PROVIDER,
    },
    {
      publicId: 'SM-MPARTICIPANT-MEMBER-001',
      memberPublicId: identities.member.publicId,
      role: MessagingParticipantRole.PASSENGER,
    },
  ];

  for (const participant of messagingParticipants) {
    await prisma.messagingConversationParticipant.upsert({
      where: {
        conversationId_memberPublicId: {
          conversationId: conversation.id,
          memberPublicId: participant.memberPublicId,
        },
      },
      update: {
        role: participant.role,
        status: MessagingParticipantStatus.ACTIVE,
        joinedAt: NOW,
        leftAt: null,
        removedAt: null,
        lastReadAt: NOW,
      },
      create: {
        publicId: participant.publicId,
        conversationId: conversation.id,
        memberPublicId: participant.memberPublicId,
        role: participant.role,
        status: MessagingParticipantStatus.ACTIVE,
        joinedAt: NOW,
        lastReadAt: NOW,
      },
    });
  }

  await prisma.messagingMessage.upsert({
    where: {
      publicId: 'SM-MESSAGE-001',
    },
    update: {
      conversationId: conversation.id,
      senderPublicId: identities.driver.publicId,
      type: MessagingMessageType.TEXT,
      status: MessagingMessageStatus.SENT,
      content: 'Hello! I will be at Nairobi CBD before departure.',
      assetId: null,
      sentAt: NOW,
      editedAt: null,
      deletedAt: null,
      moderatedAt: null,
    },
    create: {
      publicId: 'SM-MESSAGE-001',
      conversationId: conversation.id,
      senderPublicId: identities.driver.publicId,
      type: MessagingMessageType.TEXT,
      status: MessagingMessageStatus.SENT,
      content: 'Hello! I will be at Nairobi CBD before departure.',
      sentAt: NOW,
    },
  });

  // ===========================================================================
  // 20. NOTIFICATIONS
  // ===========================================================================

  console.log('[20/22] Seeding notification preferences and notifications...');

  const notificationPreferenceDefinitions = [
    {
      publicId: 'SM-NPREF-MEMBER-001',
      memberPublicId: identities.member.publicId,
    },
    {
      publicId: 'SM-NPREF-DRIVER-001',
      memberPublicId: identities.driver.publicId,
    },
    {
      publicId: 'SM-NPREF-ADMIN-001',
      memberPublicId: identities.admin.publicId,
    },
    {
      publicId: 'SM-NPREF-SUPERADMIN-001',
      memberPublicId: identities.superAdmin.publicId,
    },
  ];

  for (const preference of notificationPreferenceDefinitions) {
    await prisma.notificationPreference.upsert({
      where: {
        memberPublicId: preference.memberPublicId,
      },
      update: {
        journeyEnabled: true,
        bookingEnabled: true,
        paymentEnabled: true,
        walletEnabled: true,
        trustEnabled: true,
        verificationEnabled: true,
        messageEnabled: true,
        supportEnabled: true,
        systemEnabled: true,
      },
      create: {
        publicId: preference.publicId,
        memberPublicId: preference.memberPublicId,
        journeyEnabled: true,
        bookingEnabled: true,
        paymentEnabled: true,
        walletEnabled: true,
        trustEnabled: true,
        verificationEnabled: true,
        messageEnabled: true,
        supportEnabled: true,
        systemEnabled: true,
      },
    });
  }

  const notification = await prisma.notification.upsert({
    where: {
      publicId: 'SM-NOTIFICATION-BOOKING-001',
    },
    update: {
      recipientPublicId: identities.member.publicId,
      type: NotificationType.BOOKING,
      priority: NotificationPriority.NORMAL,
      status: NotificationStatus.READ,
      title: 'Journey completed',
      body: 'Your Nairobi to Nakuru journey has been completed.',
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      eventType: 'JourneyCompleted',
      eventPublicId: 'SM-COMPLETION-001',
      sentAt: NOW,
      readAt: NOW,
      failedAt: null,
      cancelledAt: null,
      failureReason: null,
    },
    create: {
      publicId: 'SM-NOTIFICATION-BOOKING-001',
      recipientPublicId: identities.member.publicId,
      type: NotificationType.BOOKING,
      priority: NotificationPriority.NORMAL,
      status: NotificationStatus.READ,
      title: 'Journey completed',
      body: 'Your Nairobi to Nakuru journey has been completed.',
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      eventType: 'JourneyCompleted',
      eventPublicId: 'SM-COMPLETION-001',
      sentAt: NOW,
      readAt: NOW,
    },
  });

  await prisma.notificationDelivery.upsert({
    where: {
      notificationId_channel: {
        notificationId: notification.id,
        channel: NotificationChannel.IN_APP,
      },
    },
    update: {
      status: NotificationDeliveryStatus.DELIVERED,
      providerReference: null,
      sentAt: NOW,
      deliveredAt: NOW,
      failedAt: null,
      cancelledAt: null,
      failureReason: null,
    },
    create: {
      publicId: 'SM-NDELIVERY-001',
      notificationId: notification.id,
      channel: NotificationChannel.IN_APP,
      status: NotificationDeliveryStatus.DELIVERED,
      sentAt: NOW,
      deliveredAt: NOW,
    },
  });

  // ===========================================================================
  // 21. SUPPORT
  // ===========================================================================

  console.log('[21/22] Seeding support...');

  const supportCase = await prisma.supportCase.upsert({
    where: {
      publicId: 'SM-SUPPORT-CASE-001',
    },
    update: {
      requesterPublicId: identities.member.publicId,
      status: SupportCaseStatus.OPEN,
      priority: SupportCasePriority.NORMAL,
      category: SupportCaseCategory.BOOKING,
      subject: 'Development booking support case',
      description: 'Seeded support case for the completed development booking.',
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      assignedToPublicId: identities.admin.publicId,
      resolvedAt: null,
      closedAt: null,
      cancelledAt: null,
      version: 1,
    },
    create: {
      publicId: 'SM-SUPPORT-CASE-001',
      requesterPublicId: identities.member.publicId,
      status: SupportCaseStatus.OPEN,
      priority: SupportCasePriority.NORMAL,
      category: SupportCaseCategory.BOOKING,
      subject: 'Development booking support case',
      description: 'Seeded support case for the completed development booking.',
      referenceType: 'JourneyBooking',
      referencePublicId: booking.publicId,
      assignedToPublicId: identities.admin.publicId,
      version: 1,
    },
  });

  const supportParticipants = [
    {
      publicId: 'SM-SUPPORT-PARTICIPANT-MEMBER-001',
      memberPublicId: identities.member.publicId,
      role: SupportCaseParticipantRole.REQUESTER,
    },
    {
      publicId: 'SM-SUPPORT-PARTICIPANT-ADMIN-001',
      memberPublicId: identities.admin.publicId,
      role: SupportCaseParticipantRole.SUPPORT_AGENT,
    },
  ];

  for (const participant of supportParticipants) {
    await prisma.supportCaseParticipant.upsert({
      where: {
        caseId_memberPublicId_role: {
          caseId: supportCase.id,
          memberPublicId: participant.memberPublicId,
          role: participant.role,
        },
      },
      update: {
        joinedAt: NOW,
        leftAt: null,
      },
      create: {
        publicId: participant.publicId,
        caseId: supportCase.id,
        memberPublicId: participant.memberPublicId,
        role: participant.role,
        joinedAt: NOW,
      },
    });
  }

  await prisma.supportCaseMessage.upsert({
    where: {
      publicId: 'SM-SUPPORT-MESSAGE-001',
    },
    update: {
      caseId: supportCase.id,
      senderPublicId: identities.member.publicId,
      type: SupportMessageType.TEXT,
      content: 'This is a seeded support message for development.',
      assetId: null,
      sentAt: NOW,
      editedAt: null,
      deletedAt: null,
    },
    create: {
      publicId: 'SM-SUPPORT-MESSAGE-001',
      caseId: supportCase.id,
      senderPublicId: identities.member.publicId,
      type: SupportMessageType.TEXT,
      content: 'This is a seeded support message for development.',
      sentAt: NOW,
    },
  });

  await prisma.supportCaseNote.upsert({
    where: {
      publicId: 'SM-SUPPORT-NOTE-001',
    },
    update: {
      caseId: supportCase.id,
      authorPublicId: identities.admin.publicId,
      content: 'Seeded administrative note.',
    },
    create: {
      publicId: 'SM-SUPPORT-NOTE-001',
      caseId: supportCase.id,
      authorPublicId: identities.admin.publicId,
      content: 'Seeded administrative note.',
    },
  });

  await prisma.supportCaseEvidence.upsert({
    where: {
      publicId: 'SM-SUPPORT-EVIDENCE-001',
    },
    update: {
      caseId: supportCase.id,
      submittedByPublicId: identities.member.publicId,
      assetId: memberAvatar.publicId,
      description: 'Seeded profile image used as support evidence.',
    },
    create: {
      publicId: 'SM-SUPPORT-EVIDENCE-001',
      caseId: supportCase.id,
      submittedByPublicId: identities.member.publicId,
      assetId: memberAvatar.publicId,
      description: 'Seeded profile image used as support evidence.',
    },
  });

  // ===========================================================================
  // 22. FINAL STATE / SUMMARY
  // ===========================================================================

  console.log('[22/22] Finalizing development graph...');

  // ===========================================================================
  // SUMMARY
  // ===========================================================================

  console.log('\n==============================================');
  console.log('SEED COMPLETE');
  console.log('==============================================');

  console.log('\nAccounts:');
  console.log('  MEMBER      member@sisimove.test');
  console.log('  DRIVER      driver@sisimove.test');
  console.log('  ADMIN       admin@sisimove.test');
  console.log('  SUPER ADMIN superadmin@sisimove.test');

  console.log('\nDevelopment password:');
  console.log('  SisiMove123!');

  console.log('\nSeeded:');
  console.log('  ✓ Roles');
  console.log('  ✓ Permissions');
  console.log('  ✓ Role permissions');
  console.log('  ✓ Identities');
  console.log('  ✓ Identity roles');
  console.log('  ✓ Authentication');
  console.log('  ✓ Assets');
  console.log('  ✓ Verification');
  console.log('  ✓ Traveller profiles');
  console.log('  ✓ Trust profiles');
  console.log('  ✓ Journey vehicle');
  console.log('  ✓ Journey + corridor + waypoints');
  console.log('  ✓ Journey schedule + capacity + pricing + preferences');
  console.log('  ✓ Journey assets');
  console.log('  ✓ Matched journey demand');
  console.log('  ✓ Journey booking + snapshot + pricing + payment');
  console.log('  ✓ Journey boarding + participants + events');
  console.log('  ✓ Journey completion + confirmations');
  console.log('  ✓ Journey settlement');
  console.log('  ✓ Commercial booking + earning commissions');
  console.log('  ✓ Financial accounts + balances');
  console.log('  ✓ Financial payment + attempt + transaction + entries');
  console.log('  ✓ Financial settlement + item + allocation');
  console.log('  ✓ Messaging conversation + participants + message');
  console.log('  ✓ Notification preferences + notification + delivery');
  console.log('  ✓ Support case + participants + message + note + evidence');

  console.log('\nHappy-path state:');
  console.log(
    '  PUBLISHED → BOOKED → PAYMENT CAPTURED → BOARDING → JOURNEY STARTED',
  );
  console.log(
    '  → COMPLETION CONFIRMED → SETTLEMENT COMPLETED → COMMISSIONS ASSESSED',
  );

  console.log('\nFinancial example:');
  console.log('  Journey price:        KES 1,200');
  console.log('  Booking commission:   KES    60');
  console.log('  Passenger payment:    KES 1,260');
  console.log('  Earning commission:   KES    60');
  console.log('  Provider settlement:  KES 1,140');

  console.log('\n==============================================');

}

main()
  .catch((error: unknown) => {
    console.error('\nSeed failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });