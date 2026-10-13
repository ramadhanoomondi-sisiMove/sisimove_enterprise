// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant Summary Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Compose the public Traveller Profile and Trust read models.
// - Retrieve the participant's Identity and Verification aggregates.
// - Resolve the public avatar through the Assets application boundary.
// - Include contact details only when permitted by the applicable policy.
// - Return a read-only participant summary for providers and passengers.
//
// Architectural rules:
// - No direct persistence access.
// - No aggregate mutation.
// - No manually constructed Asset URLs.
// - No invented journey statistics.
// - Public verification status is validity-aware.
// - Contact visibility must be determined using trusted authenticated context.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { IDENTITY_TOKENS } from '../../../identity/application/identity.tokens';
import { GetIdentityQuery } from '../../../identity/application/queries/get-identity.query';
import { GetVerificationQuery } from '../../../identity/application/queries/get-verification.query';
import type { IdentityAggregate } from '../../../identity/domain/aggregates/identity.aggregate';
import type { VerificationAggregate } from '../../../identity/domain/aggregates/verification.aggregate';

import { TRAVELLER_PROFILE_TOKENS } from '../../../social/application/traveller-profile.tokens';
import { GetPublicTravellerByMemberQuery } from '../../../social/application/queries/get-public-traveller-by-member.query';
import { MemberPublicId as TravellerMemberPublicId } from '../../../social/domain/value-objects/member-public-id.vo';

import { TRUST_PROFILE_TOKENS } from '../../../trust/application/trust-profile.tokens';
import { GetPublicTrustProfileByMemberQuery } from '../../../trust/application/queries/trust-profile/get-public-trust-profile-by-member.query';

import { ASSET_TOKENS } from '../../../assets/application/asset.tokens';
import { GetPublicAssetReferenceQuery } from '../../../assets/application/queries/get-public-asset-reference.query';
import { AssetPublicId } from '../../../assets/domain/value-objects/asset-public-id.vo';

import type { GetParticipantSummaryQuery } from '../queries/get-participant-summary.query';

// =============================================================================
// Public Read-Model Contracts
// =============================================================================

interface PublicTravellerProfile {
  publicId: string;
  handle: string;
  bio: string | null;
  avatar: { publicId: string } | null;
  countryCode: string;
}

interface PublicTrustBadge {
  publicId: string;
  type: string;
  name: string;
  description: string | null;
  asset: {
    publicId: string;
    url: string;
    alt: string;
  } | null;
}

interface PublicTrustProfile {
  verificationLevel: string;
  ratingAverage: number;
  ratingCount: number;
  completedJourneys: number;
  badges: PublicTrustBadge[];
}

interface PublicAssetReference {
  publicId: string;
  url: string;
}

export interface JourneyBoardingParticipantSummary {
  participant: {
    publicId: string;
    handle: string;
    bio: string | null;
    countryCode: string;
    avatarUrl: string | null;
    accountStatus: string;
  };

  contact: {
    email: string;
    phoneNumber: string;
  } | null;

  verification: {
    status: string;
    level: string;
    active: boolean;
    verified: boolean;
    expiresAt: Date | null;
  };

  trust: {
    verificationLevel: string;
    ratingAverage: number;
    ratingCount: number;
    completedJourneys: number;
    badges: PublicTrustBadge[];
  };

  // Informational only; this is not a guarantee of safety.
  verificationDisclaimer: string;
}

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetJourneyBoardingParticipantSummaryHandler implements QueryHandler<
  GetParticipantSummaryQuery,
  JourneyBoardingParticipantSummary
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY)
    private readonly getIdentityHandler: QueryHandler<
      GetIdentityQuery,
      IdentityAggregate
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_VERIFICATION)
    private readonly getVerificationHandler: QueryHandler<
      GetVerificationQuery,
      VerificationAggregate
    >,

    @Inject(
      TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID,
    )
    private readonly getPublicTravellerHandler: QueryHandler<
      GetPublicTravellerByMemberQuery,
      PublicTravellerProfile
    >,

    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID)
    private readonly getPublicTrustProfileHandler: QueryHandler<
      GetPublicTrustProfileByMemberQuery,
      PublicTrustProfile
    >,

    @Inject(ASSET_TOKENS.QUERY_HANDLERS.GET_PUBLIC_ASSET_REFERENCE)
    private readonly getPublicAssetReferenceHandler: QueryHandler<
      GetPublicAssetReferenceQuery,
      PublicAssetReference
    >,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetParticipantSummaryQuery,
  ): Promise<JourneyBoardingParticipantSummary> {
    if (query === undefined || query.participantPublicId === undefined) {
      throw new Error(
        'Participant summary query and participant ID are required.',
      );
    }

    const participantPublicId = query.participantPublicId;
    const memberPublicId = new TravellerMemberPublicId(
      participantPublicId.value,
    );

    const [identity, verification, profile, trust] = await Promise.all([
      this.getIdentityHandler.execute(
        new GetIdentityQuery(participantPublicId),
      ),

      this.getVerificationHandler.execute(
        new GetVerificationQuery(participantPublicId),
      ),

      this.getPublicTravellerHandler.execute(
        new GetPublicTravellerByMemberQuery(memberPublicId),
      ),

      this.getPublicTrustProfileHandler.execute(
        new GetPublicTrustProfileByMemberQuery(participantPublicId.value),
      ),
    ]);

    const now = new Date();
    const verificationActive = verification.isActive(now);

    // Preserve existing validity-aware verification semantics.
    const currentlyVerified =
      verificationActive &&
      (verification.isMemberVerified() || verification.isDriverVerified());

    const avatarUrl = await this.resolveAvatarUrl(profile.avatar?.publicId);

    // These values must originate from trusted authenticated context and
    // trusted controller-side boarding authorization, never from an
    // untrusted request body or query parameter.
    const requesterPublicId = query.requesterPublicId;

    const isParticipantViewingOwnSummary =
      requesterPublicId !== undefined &&
      requesterPublicId.value === participantPublicId.value;

    // The trusted controller authorizes contact sharing only after verifying
    // that the requester and target belong to the same Journey Boarding.
    //
    // This supports:
    // - Passenger viewing another passenger's contact details.
    // - Passenger viewing the provider's contact details.
    // - Provider viewing a passenger's contact details.
    // - Participants viewing their own contact details.
    //
    // Never infer boarding membership from these identity IDs alone.
    const mayViewContactDetails =
      isParticipantViewingOwnSummary ||
      query.allowJourneyContactSharing === true;

    return {
      participant: {
        publicId: participantPublicId.value,
        handle: profile.handle,
        bio: profile.bio,
        countryCode: profile.countryCode,
        avatarUrl,
        accountStatus: identity.status.value,
      },

      contact: mayViewContactDetails
        ? {
            email: identity.email.toString(),
            phoneNumber: identity.phoneNumber.toString(),
          }
        : null,

      verification: {
        status: verification.status.value,
        level: verification.level.value,
        active: verificationActive,
        verified: currentlyVerified,
        expiresAt: verification.expiresAt ?? null,
      },

      trust: {
        verificationLevel: trust.verificationLevel,
        ratingAverage: trust.ratingAverage,
        ratingCount: trust.ratingCount,
        completedJourneys: trust.completedJourneys,
        badges: trust.badges,
      },

      verificationDisclaimer:
        'Verification reflects the current verification record and does not guarantee safety.',
    };
  }

  // ===========================================================================
  // Public Avatar Resolution
  // ===========================================================================

  private async resolveAvatarUrl(
    avatarPublicId: string | undefined,
  ): Promise<string | null> {
    if (!avatarPublicId) {
      return null;
    }

    try {
      const reference = await this.getPublicAssetReferenceHandler.execute(
        new GetPublicAssetReferenceQuery(new AssetPublicId(avatarPublicId)),
      );

      return reference.url;
    } catch {
      // A missing or unavailable public avatar should not hide the profile.
      return null;
    }
  }
}

export default GetJourneyBoardingParticipantSummaryHandler;
