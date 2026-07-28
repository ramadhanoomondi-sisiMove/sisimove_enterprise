// src/domains/identity/infrastructure/persistence/prisma-verification-query.service.ts

import { Injectable } from '@nestjs/common';
import {
  Prisma,
  VerificationRequestStatus as PrismaVerificationRequestStatus,
  VerificationStatus as PrismaVerificationStatus,
} from '@prisma/client';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import { VerificationQueryService } from '../../application/services/verification-query.service';

import type { VerificationListItem } from '../../application/contracts/verification-list-item';
import type { VerificationRequestResult } from '../../application/contracts/verification-request-result';
import type { VerificationResult } from '../../application/contracts/verification-result';
import type { VerificationReviewResult } from '../../application/contracts/verification-review-result';
import type { VerificationSummary } from '../../application/contracts/verification-summary';

import type { VerificationDecisionReason } from '../../domain/enums/verification-decision-reason.enum';
import type { VerificationLevel } from '../../domain/enums/verification-level.enum';
import type { VerificationRequestStatus } from '../../domain/enums/verification-request-status.enum';
import type { VerificationRequestType } from '../../domain/enums/verification-request-type.enum';
import type { VerificationStatus } from '../../domain/enums/verification-status.enum';

const verificationInclude = Prisma.validator<Prisma.VerificationInclude>()({
  identity: {
    select: {
      id: true,
      publicId: true,
    },
  },

  reviewedBy: {
    select: {
      id: true,
      publicId: true,
    },
  },

  requests: {
    select: {
      id: true,
      publicId: true,
      type: true,
      status: true,
      assetPublicId: true,
      submittedAt: true,
      reviewedAt: true,
      rejectionReason: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,

      reviewedBy: {
        select: {
          id: true,
          publicId: true,
        },
      },
    },
  },
});

const verificationRequestInclude =
  Prisma.validator<Prisma.VerificationRequestInclude>()({
    verification: {
      include: {
        identity: {
          select: {
            id: true,
            publicId: true,
          },
        },
      },
    },

    reviewedBy: {
      select: {
        id: true,
        publicId: true,
      },
    },
  });

type VerificationPayload = Prisma.VerificationGetPayload<{
  include: typeof verificationInclude;
}>;

type VerificationRequestPayload = Prisma.VerificationRequestGetPayload<{
  include: typeof verificationRequestInclude;
}>;

@Injectable()
export class PrismaVerificationQueryService extends VerificationQueryService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toVerificationResult(
    verification: VerificationPayload,
  ): VerificationResult {
    const result: VerificationResult = {
      verificationId: verification.id,
      publicId: verification.publicId,

      identityPublicId: verification.identity.publicId,

      status: verification.status as VerificationStatus,
      level: verification.level as VerificationLevel,

      profilePhotoVerified: verification.profilePhotoVerified,
      governmentIdVerified: verification.governmentIdVerified,
      driverLicenseVerified: verification.driverLicenseVerified,

      pendingRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.PENDING,
      ).length,

      approvedRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.APPROVED,
      ).length,

      rejectedRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.REJECTED,
      ).length,

      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
    };

    return {
      ...result,

      ...(verification.verifiedAt && {
        verifiedAt: verification.verifiedAt,
      }),

      ...(verification.expiresAt && {
        expiresAt: verification.expiresAt,
      }),

      ...(verification.reviewedBy && {
        reviewedByPublicId: verification.reviewedBy.publicId,
      }),

      ...(verification.rejectionReason && {
        rejectionReason: verification.rejectionReason,
      }),

      ...(verification.lastReviewedAt && {
        lastReviewedAt: verification.lastReviewedAt,
      }),

      ...(verification.memberVerifiedAt && {
        memberVerifiedAt: verification.memberVerifiedAt,
      }),

      ...(verification.driverVerifiedAt && {
        driverVerifiedAt: verification.driverVerifiedAt,
      }),

      ...(verification.profilePhotoVerifiedAt && {
        profilePhotoVerifiedAt: verification.profilePhotoVerifiedAt,
      }),

      ...(verification.governmentIdVerifiedAt && {
        governmentIdVerifiedAt: verification.governmentIdVerifiedAt,
      }),

      ...(verification.driverLicenseVerifiedAt && {
        driverLicenseVerifiedAt: verification.driverLicenseVerifiedAt,
      }),

      ...(verification.decisionReason && {
        decisionReason:
          verification.decisionReason as VerificationDecisionReason,
      }),
    };
  }

  private toVerificationSummary(
    verification: VerificationPayload,
  ): VerificationSummary {
    const summary: VerificationSummary = {
      verificationId: verification.id,
      verificationPublicId: verification.publicId,

      identityPublicId: verification.identity.publicId,

      status: verification.status as VerificationStatus,
      level: verification.level as VerificationLevel,

      profilePhotoVerified: verification.profilePhotoVerified,
      governmentIdVerified: verification.governmentIdVerified,
      driverLicenseVerified: verification.driverLicenseVerified,

      pendingRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.PENDING,
      ).length,

      approvedRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.APPROVED,
      ).length,

      rejectedRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.REJECTED,
      ).length,

      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
    };

    return {
      ...summary,

      ...(verification.verifiedAt && {
        verifiedAt: verification.verifiedAt,
      }),

      ...(verification.expiresAt && {
        expiresAt: verification.expiresAt,
      }),

      ...(verification.reviewedBy && {
        reviewedByPublicId: verification.reviewedBy.publicId,
      }),

      ...(verification.rejectionReason && {
        rejectionReason: verification.rejectionReason,
      }),

      ...(verification.lastReviewedAt && {
        lastReviewedAt: verification.lastReviewedAt,
      }),

      ...(verification.memberVerifiedAt && {
        memberVerifiedAt: verification.memberVerifiedAt,
      }),

      ...(verification.driverVerifiedAt && {
        driverVerifiedAt: verification.driverVerifiedAt,
      }),

      ...(verification.profilePhotoVerifiedAt && {
        profilePhotoVerifiedAt: verification.profilePhotoVerifiedAt,
      }),

      ...(verification.governmentIdVerifiedAt && {
        governmentIdVerifiedAt: verification.governmentIdVerifiedAt,
      }),

      ...(verification.driverLicenseVerifiedAt && {
        driverLicenseVerifiedAt: verification.driverLicenseVerifiedAt,
      }),

      ...(verification.decisionReason && {
        decisionReason:
          verification.decisionReason as VerificationDecisionReason,
      }),
    };
  }

  private toVerificationListItem(
    verification: VerificationPayload,
  ): VerificationListItem {
    const item: VerificationListItem = {
      verificationId: verification.id,
      verificationPublicId: verification.publicId,

      identityPublicId: verification.identity.publicId,

      status: verification.status as VerificationStatus,
      level: verification.level as VerificationLevel,

      profilePhotoVerified: verification.profilePhotoVerified,
      governmentIdVerified: verification.governmentIdVerified,
      driverLicenseVerified: verification.driverLicenseVerified,

      pendingRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.PENDING,
      ).length,

      approvedRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.APPROVED,
      ).length,

      rejectedRequestCount: verification.requests.filter(
        (r) => r.status === PrismaVerificationRequestStatus.REJECTED,
      ).length,

      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
    };

    return {
      ...item,

      ...(verification.verifiedAt && {
        verifiedAt: verification.verifiedAt,
      }),

      ...(verification.expiresAt && {
        expiresAt: verification.expiresAt,
      }),

      ...(verification.reviewedBy && {
        reviewedByPublicId: verification.reviewedBy.publicId,
      }),

      ...(verification.lastReviewedAt && {
        lastReviewedAt: verification.lastReviewedAt,
      }),

      ...(verification.memberVerifiedAt && {
        memberVerifiedAt: verification.memberVerifiedAt,
      }),

      ...(verification.driverVerifiedAt && {
        driverVerifiedAt: verification.driverVerifiedAt,
      }),

      ...(verification.profilePhotoVerifiedAt && {
        profilePhotoVerifiedAt: verification.profilePhotoVerifiedAt,
      }),

      ...(verification.governmentIdVerifiedAt && {
        governmentIdVerifiedAt: verification.governmentIdVerifiedAt,
      }),

      ...(verification.driverLicenseVerifiedAt && {
        driverLicenseVerifiedAt: verification.driverLicenseVerifiedAt,
      }),

      ...(verification.decisionReason && {
        decisionReason:
          verification.decisionReason as VerificationDecisionReason,
      }),
    };
  }

  private toVerificationRequestResult(
    request: VerificationRequestPayload,
  ): VerificationRequestResult {
    const result: VerificationRequestResult = {
      requestId: request.id,
      requestPublicId: request.publicId,

      verificationId: request.verification.id,
      verificationPublicId: request.verification.publicId,

      identityPublicId: request.verification.identity.publicId,

      type: request.type as VerificationRequestType,
      status: request.status as VerificationRequestStatus,

      assetPublicId: request.assetPublicId,

      submittedAt: request.submittedAt,

      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };

    return {
      ...result,

      ...(request.reviewedAt && {
        reviewedAt: request.reviewedAt,
      }),

      ...(request.reviewedBy && {
        reviewedByPublicId: request.reviewedBy.publicId,
      }),

      ...(request.rejectionReason && {
        rejectionReason: request.rejectionReason,
      }),

      ...(request.metadata && {
        metadata: request.metadata as Readonly<Record<string, unknown>>,
      }),
    };
  }

  private toVerificationReviewResult(
    request: VerificationRequestPayload,
  ): VerificationReviewResult {
    const result: VerificationReviewResult = {
      verificationId: request.verification.id,
      verificationPublicId: request.verification.publicId,

      requestPublicId: request.publicId,
      requestType: request.type as VerificationRequestType,
      status: request.status as VerificationRequestStatus,

      verificationStatus: request.verification.status as VerificationStatus,

      verificationLevel: request.verification.level as VerificationLevel,

      reviewerPublicId: request.reviewedBy!.publicId,

      reviewedAt: request.reviewedAt!,

      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    };

    return {
      ...result,

      ...(request.rejectionReason && {
        rejectionReason: request.rejectionReason,
      }),
    };
  }

  async findByPublicId(publicId: string): Promise<VerificationResult | null> {
    const verification = await this.prisma.verification.findUnique({
      where: {
        publicId,
      },
      include: verificationInclude,
    });

    if (!verification) {
      return null;
    }

    return this.toVerificationResult(verification);
  }

  async findByIdentityPublicId(
    identityPublicId: string,
  ): Promise<VerificationResult | null> {
    const verification = await this.prisma.verification.findFirst({
      where: {
        identity: {
          publicId: identityPublicId,
        },
      },
      include: verificationInclude,
    });

    if (!verification) {
      return null;
    }

    return this.toVerificationResult(verification);
  }

  async findSummary(
    verificationPublicId: string,
  ): Promise<VerificationSummary | null> {
    const verification = await this.prisma.verification.findUnique({
      where: {
        publicId: verificationPublicId,
      },
      include: verificationInclude,
    });

    if (!verification) {
      return null;
    }

    return this.toVerificationSummary(verification);
  }

  async findRequest(
    requestPublicId: string,
  ): Promise<VerificationRequestResult | null> {
    const request = await this.prisma.verificationRequest.findUnique({
      where: {
        publicId: requestPublicId,
      },
      include: verificationRequestInclude,
    });

    if (!request) {
      return null;
    }

    return this.toVerificationRequestResult(request);
  }

  async findReview(
    requestPublicId: string,
  ): Promise<VerificationReviewResult | null> {
    const request = await this.prisma.verificationRequest.findUnique({
      where: {
        publicId: requestPublicId,
      },
      include: verificationRequestInclude,
    });

    if (!request || !request.reviewedAt || !request.reviewedBy) {
      return null;
    }

    return this.toVerificationReviewResult(request);
  }

  async findAll(): Promise<VerificationListItem[]> {
    const verifications = await this.prisma.verification.findMany({
      include: verificationInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return verifications.map((verification) =>
      this.toVerificationListItem(verification),
    );
  }

  async findByStatus(
    status: VerificationStatus,
  ): Promise<VerificationListItem[]> {
    const verifications = await this.prisma.verification.findMany({
      where: {
        status: status,
      },
      include: verificationInclude,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return verifications.map((verification) =>
      this.toVerificationListItem(verification),
    );
  }

  async findByLevel(level: VerificationLevel): Promise<VerificationListItem[]> {
    const verifications = await this.prisma.verification.findMany({
      where: {
        level: level,
      },
      include: verificationInclude,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return verifications.map((verification) =>
      this.toVerificationListItem(verification),
    );
  }

  async findPending(): Promise<VerificationListItem[]> {
    const verifications = await this.prisma.verification.findMany({
      where: {
        status: PrismaVerificationStatus.PENDING,
      },
      include: verificationInclude,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return verifications.map((verification) =>
      this.toVerificationListItem(verification),
    );
  }

  async findExpired(): Promise<VerificationListItem[]> {
    const now = new Date();

    const verifications = await this.prisma.verification.findMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
      include: verificationInclude,
      orderBy: {
        expiresAt: 'asc',
      },
    });

    return verifications.map((verification) =>
      this.toVerificationListItem(verification),
    );
  }

  async findExpiringSoon(before: Date): Promise<VerificationListItem[]> {
    const now = new Date();

    const verifications = await this.prisma.verification.findMany({
      where: {
        expiresAt: {
          gte: now,
          lte: before,
        },
      },
      include: verificationInclude,
      orderBy: {
        expiresAt: 'asc',
      },
    });

    return verifications.map((verification) =>
      this.toVerificationListItem(verification),
    );
  }

  async listVerificationRequests(
    verificationPublicId: string,
  ): Promise<VerificationRequestResult[]> {
    const requests = await this.prisma.verificationRequest.findMany({
      where: {
        verification: {
          publicId: verificationPublicId,
        },
      },
      include: verificationRequestInclude,
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return requests.map((request) => this.toVerificationRequestResult(request));
  }

  async listPendingRequests(): Promise<VerificationRequestResult[]> {
    const requests = await this.prisma.verificationRequest.findMany({
      where: {
        status: PrismaVerificationRequestStatus.PENDING,
      },
      include: verificationRequestInclude,
      orderBy: {
        submittedAt: 'asc',
      },
    });

    return requests.map((request) => this.toVerificationRequestResult(request));
  }
}
