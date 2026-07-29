// src/domains/identity/infrastructure/query-services/prisma-verification-query.service.ts

import { Injectable } from '@nestjs/common';

import { VerificationQueryService } from '../../application/services/verification-query.service';

import type { VerificationLevel } from '../../domain/enums/verification-level.enum';
import type { VerificationStatus } from '../../domain/enums/verification-status.enum';

import type { VerificationListItem } from '../../application/contracts/verification-list-item';
import type { VerificationRequestResult } from '../../application/contracts/verification-request-result';
import type { VerificationResult } from '../../application/contracts/verification-result';
import type { VerificationReviewResult } from '../../application/contracts/verification-review-result';
import type { VerificationSummary } from '../../application/contracts/verification-summary';

@Injectable()
export class PrismaVerificationQueryService extends VerificationQueryService {
  public findByPublicId(
    verificationPublicId: string,
  ): Promise<VerificationResult | null> {
    void verificationPublicId;

    throw new Error('Method not implemented.');
  }

  public findByIdentityPublicId(
    identityPublicId: string,
  ): Promise<VerificationResult | null> {
    void identityPublicId;

    throw new Error('Method not implemented.');
  }

  public findSummary(
    verificationPublicId: string,
  ): Promise<VerificationSummary | null> {
    void verificationPublicId;

    throw new Error('Method not implemented.');
  }

  public findRequest(
    requestPublicId: string,
  ): Promise<VerificationRequestResult | null> {
    void requestPublicId;

    throw new Error('Method not implemented.');
  }

  public findReview(
    requestPublicId: string,
  ): Promise<VerificationReviewResult | null> {
    void requestPublicId;

    throw new Error('Method not implemented.');
  }

  public findAll(): Promise<VerificationListItem[]> {
    throw new Error('Method not implemented.');
  }

  public findByStatus(
    status: VerificationStatus,
  ): Promise<VerificationListItem[]> {
    void status;

    throw new Error('Method not implemented.');
  }

  public findByLevel(
    level: VerificationLevel,
  ): Promise<VerificationListItem[]> {
    void level;

    throw new Error('Method not implemented.');
  }

  public findPending(): Promise<VerificationListItem[]> {
    throw new Error('Method not implemented.');
  }

  public findExpired(): Promise<VerificationListItem[]> {
    throw new Error('Method not implemented.');
  }

  public findExpiringSoon(before: Date): Promise<VerificationListItem[]> {
    void before;

    throw new Error('Method not implemented.');
  }

  public listVerificationRequests(
    verificationPublicId: string,
  ): Promise<VerificationRequestResult[]> {
    void verificationPublicId;

    throw new Error('Method not implemented.');
  }

  public listPendingRequests(): Promise<VerificationRequestResult[]> {
    throw new Error('Method not implemented.');
  }
}
