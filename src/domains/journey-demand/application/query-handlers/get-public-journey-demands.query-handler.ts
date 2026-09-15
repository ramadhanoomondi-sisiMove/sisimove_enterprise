// -----------------------------------------------------------------------------
// sisiMove — Get Public Journey Demands Query Handler
// -----------------------------------------------------------------------------
//
// Public application read boundary for the Journey Demand marketplace.
//
// Journey Demand owns:
//   - Demand lifecycle
//   - requester reference
//   - route/corridor
//   - waypoints
//   - schedule
//   - capacity
//   - pricing
//   - participants
//
// The marketplace additionally needs public Traveller and Trust information
// for:
//   - the Demand requester;
//   - travellers who joined the Demand.
//
// Those profiles remain independently owned bounded contexts.
//
// Therefore this handler performs application-level composition:
//
//     Journey Demand
//          │
//          ├── requesterPublicId
//          │       ├── Traveller Profile
//          │       └── Trust Profile
//          │
//          └── participants[]
//                  │
//                  ├── memberPublicId
//                  │       ├── Traveller Profile
//                  │       └── Trust Profile
//                  │
//                  └── participation data
//
// There is deliberately no Requester aggregate and no separate Participant
// aggregate owned by another bounded context.
//
// IMPORTANT:
//
// Raw domain aggregates, persistence models, internal database IDs,
// requesterPublicId, and participant memberPublicId must never cross the
// public marketplace boundary.
//
// Domain Value Objects are also not exposed directly. They are unwrapped into
// primitives when creating the public read model.
//
// -----------------------------------------------------------------------------
// Public Collection Semantics
// -----------------------------------------------------------------------------
//
// This handler represents the plural public marketplace collection.
//
// An empty query means:
//
//     "Return all publicly discoverable Journey Demands."
//
// Optional filters narrow that public collection:
//
//     from
//     to
//     date
//
// The public collection is therefore marketplace-first:
//
//     Browse all public Demands
//             │
//             └── optionally filter/search
//
// This is intentionally separate from:
//
//     GetJourneyDemandsQueryHandler
//
// because the generic collection handler returns an internal/domain-oriented
// representation and must not also serve the public marketplace contract.
//
// It is also separate from:
//
//     GetPublicJourneyDemandQueryHandler
//
// which retrieves and composes one Demand.
//
// -----------------------------------------------------------------------------
// Architecture
// -----------------------------------------------------------------------------
//
// HTTP Controller
//       │
//       ▼
// GetPublicJourneyDemandsQuery
//       │
//       ▼
// GetPublicJourneyDemandsQueryHandler
//       │
//       ├── JourneyDemandRepository
//       │
//       ├── Traveller Profile public query
//       │
//       └── Trust Profile public query
//       │
//       ▼
// PublicJourneyDemandResponse[]
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Journey Demand — Query
// -----------------------------------------------------------------------------

import type { GetPublicJourneyDemandsQuery } from '../queries/get-public-journey-demands.query';

// -----------------------------------------------------------------------------
// Journey Demand — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Journey Demand — Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';

import type { JourneyDemandParticipantEntity } from '../../domain/entities/journey-demand-participant.entity';

import type {
  JourneyDemandRepository,
  PublicJourneyDemandFilters,
} from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Traveller Profile — Public Query
// -----------------------------------------------------------------------------

import { GetPublicTravellerByMemberQuery } from '../../../social/application/queries/get-public-traveller-by-member.query';

import type { PublicTravellerProfileResponse } from '../../../social/application/query-handlers/get-public-traveller-by-member.query-handler';

import { TRAVELLER_PROFILE_TOKENS } from '../../../social/application/traveller-profile.tokens';

import { MemberPublicId } from '../../../social/domain/value-objects/member-public-id.vo';

// -----------------------------------------------------------------------------
// Trust Profile — Public Query
// -----------------------------------------------------------------------------

import { GetPublicTrustProfileByMemberQuery } from '../../../trust/application/queries/trust-profile/get-public-trust-profile-by-member.query';

import type { PublicTrustProfile } from '../../../trust/application/query-handlers/trust-profile/get-public-trust-profile-by-member.query-handler';

import { TRUST_PROFILE_TOKENS } from '../../../trust/application/trust-profile.tokens';

// =============================================================================
// Public Requester
// =============================================================================

/**
 * Public representation of the Traveller who created the Demand.
 *
 * Journey Demand owns only the opaque requester reference.
 *
 * Traveller Profile and Trust Profile remain separate bounded contexts and
 * are composed here at the application read boundary.
 */
export interface PublicJourneyDemandRequester {
  readonly traveller: PublicTravellerProfileResponse;
  readonly trust: PublicTrustProfile;
}

// =============================================================================
// Public Route
// =============================================================================

export interface PublicJourneyDemandLocation {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

export type PublicJourneyDemandWaypointType =
  'ORIGIN' | 'DESTINATION' | 'PICKUP' | 'DROPOFF' | 'WAYPOINT';

export interface PublicJourneyDemandWaypoint {
  readonly publicId: string;
  readonly type: PublicJourneyDemandWaypointType;
  readonly sequence: number;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly pickupRequired: boolean;
  readonly dropoffRequired: boolean;
}

export interface PublicJourneyDemandRoute {
  readonly origin: PublicJourneyDemandLocation;
  readonly destination: PublicJourneyDemandLocation;
  readonly waypoints: readonly PublicJourneyDemandWaypoint[];
}

// =============================================================================
// Public Schedule
// =============================================================================

export interface PublicJourneyDemandSchedule {
  readonly earliestDeparture: string;
  readonly latestDeparture: string;
  readonly targetArrival: string | null;
  readonly maximumArrival: string | null;
  readonly timezone: string;
}

// =============================================================================
// Public Capacity
// =============================================================================

export interface PublicJourneyDemandCapacity {
  readonly requestedSeats: number;
  readonly matchedSeats: number;
  readonly remainingSeats: number;
}

// =============================================================================
// Public Pricing
// =============================================================================

export interface PublicJourneyDemandPricing {
  readonly maximumPricePerSeat: number | null;
  readonly preferredPricePerSeat: number | null;
  readonly currency: string;
}

// =============================================================================
// Public Participant
// =============================================================================

/**
 * Public representation of a Traveller participating in the Demand.
 *
 * The internal memberPublicId is used only to resolve the participant's
 * public Traveller and Trust projections.
 *
 * It is deliberately not included in the public response.
 */
export interface PublicJourneyDemandParticipant {
  readonly publicId: string;
  readonly traveller: PublicTravellerProfileResponse;
  readonly trust: PublicTrustProfile;
  readonly seats: number;
  readonly status: 'ACTIVE' | 'WITHDRAWN' | 'REMOVED';
  readonly joinedAt: string;
}

// =============================================================================
// Public Status
// =============================================================================

/**
 * Public Demand lifecycle.
 *
 * Internal states such as DRAFT, CANCELLED, and EXPIRED are not part of the
 * public marketplace contract.
 *
 * The repository's public query is responsible for filtering those states
 * before this handler receives the aggregates.
 */
export type PublicJourneyDemandStatus =
  'OPEN' | 'MATCHED' | 'CONVERTED' | 'FULFILLED';

// =============================================================================
// Public Journey Demand
// =============================================================================

/**
 * Canonical public Journey Demand marketplace read model.
 *
 * This is deliberately smaller than the Journey Demand aggregate.
 *
 * It contains only information required by the public marketplace.
 */
export interface PublicJourneyDemandResponse {
  readonly publicId: string;
  readonly requester: PublicJourneyDemandRequester;
  readonly status: PublicJourneyDemandStatus;
  readonly route: PublicJourneyDemandRoute;
  readonly schedule: PublicJourneyDemandSchedule;
  readonly capacity: PublicJourneyDemandCapacity;
  readonly pricing: PublicJourneyDemandPricing;
  readonly participants: readonly PublicJourneyDemandParticipant[];
}

// =============================================================================
// Query Handler
// =============================================================================

@Injectable()
export class GetPublicJourneyDemandsQueryHandler implements QueryHandler<
  GetPublicJourneyDemandsQuery,
  readonly PublicJourneyDemandResponse[]
> {
  public constructor(
    // -------------------------------------------------------------------------
    // Journey Demand Repository
    // -------------------------------------------------------------------------

    /**
     * Journey Demand remains the source of truth for public Demand inventory.
     *
     * The repository owns the public-visibility decision.
     *
     * The plural public operation is deliberately separate from
     * findJourneyDemands() because the latter returns root entities and does
     * not represent the public marketplace boundary.
     */
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,

    // -------------------------------------------------------------------------
    // Traveller Profile Public Query
    // -------------------------------------------------------------------------

    /**
     * Traveller Profile is resolved through its public application boundary.
     *
     * This handler does not access Traveller Profile persistence directly.
     */
    @Inject(
      TRAVELLER_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID,
    )
    private readonly getPublicTravellerByMemberHandler: QueryHandler<
      GetPublicTravellerByMemberQuery,
      PublicTravellerProfileResponse
    >,

    // -------------------------------------------------------------------------
    // Trust Profile Public Query
    // -------------------------------------------------------------------------

    /**
     * Trust Profile is resolved through its public application boundary.
     */
    @Inject(TRUST_PROFILE_TOKENS.QUERY_HANDLERS.GET_PUBLIC_BY_MEMBER_PUBLIC_ID)
    private readonly getPublicTrustProfileByMemberHandler: QueryHandler<
      GetPublicTrustProfileByMemberQuery,
      PublicTrustProfile
    >,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves all publicly discoverable Journey Demands, optionally filtered
   * by marketplace search criteria.
   *
   * An empty query is valid and means:
   *
   *     "Return all publicly discoverable Journey Demands."
   *
   * The repository decides which Demands are publicly visible.
   *
   * Once retrieved, this handler composes every Demand into the public
   * marketplace read model.
   *
   * IMPORTANT:
   *
   * The repository uses exactOptionalPropertyTypes.
   *
   * Therefore an optional property such as:
   *
   *     from?: string
   *
   * means the property may be omitted, but it must not explicitly be assigned
   * the value undefined.
   *
   * Conditional object spreading ensures that undefined query values are
   * omitted entirely while preserving the repository filter's readonly
   * contract.
   */
  public async execute(
    query: GetPublicJourneyDemandsQuery,
  ): Promise<readonly PublicJourneyDemandResponse[]> {
    const filters: PublicJourneyDemandFilters = {
      ...(query.from !== undefined ? { from: query.from } : {}),
      ...(query.to !== undefined ? { to: query.to } : {}),
      ...(query.date !== undefined ? { date: query.date } : {}),
      ...(query.limit !== undefined ? { limit: query.limit } : {}),
      ...(query.offset !== undefined ? { offset: query.offset } : {}),
    };

    const demands = await this.repository.findPublicJourneyDemands(filters);

    return Promise.all(
      demands.map((demand) => this.composePublicJourneyDemand(demand)),
    );
  }

  // ===========================================================================
  // Public Marketplace Composition
  // ===========================================================================

  /**
   * Composes one Journey Demand aggregate into the public marketplace
   * representation.
   *
   * This deliberately mirrors the singular public Demand handler.
   *
   * Collection and detail therefore expose the same public contract.
   */
  private async composePublicJourneyDemand(
    demand: JourneyDemandAggregate,
  ): Promise<PublicJourneyDemandResponse> {
    // -------------------------------------------------------------------------
    // Requester
    // -------------------------------------------------------------------------

    const requesterPromise = this.composeRequester(
      demand.requesterPublicId.value,
    );

    // -------------------------------------------------------------------------
    // Participants
    // -------------------------------------------------------------------------

    /**
     * Each participant requires Traveller and Trust resolution.
     *
     * Promise.all keeps independent public lookups concurrent rather than
     * serialising every participant lookup.
     */
    const participantsPromise = Promise.all(
      demand.participants.map((participant) =>
        this.composeParticipant(participant),
      ),
    );

    const [requester, participants] = await Promise.all([
      requesterPromise,
      participantsPromise,
    ]);

    // -------------------------------------------------------------------------
    // Public Projection
    // -------------------------------------------------------------------------

    return {
      publicId: demand.journeyDemand.publicId.value,

      requester,

      status: this.toPublicStatus(demand.status.value),

      route: this.toPublicRoute(demand),

      schedule: this.toPublicSchedule(demand),

      capacity: this.toPublicCapacity(demand),

      pricing: this.toPublicPricing(demand),

      participants,
    };
  }

  // ===========================================================================
  // Requester Composition
  // ===========================================================================

  /**
   * Resolves the opaque requester reference into the public Traveller and
   * Trust representations.
   *
   * The member identifier exists only inside this application-layer lookup.
   */
  private async composeRequester(
    memberPublicIdValue: string,
  ): Promise<PublicJourneyDemandRequester> {
    const memberPublicId = new MemberPublicId(memberPublicIdValue);

    const [traveller, trust] = await Promise.all([
      this.getPublicTravellerByMemberHandler.execute(
        new GetPublicTravellerByMemberQuery(memberPublicId),
      ),

      this.getPublicTrustProfileByMemberHandler.execute(
        new GetPublicTrustProfileByMemberQuery(memberPublicId.value),
      ),
    ]);

    return {
      traveller,
      trust,
    };
  }

  // ===========================================================================
  // Participant Composition
  // ===========================================================================

  /**
   * Resolves one Demand participant into the public marketplace projection.
   *
   * IMPORTANT:
   *
   * participant.memberPublicId is a cross-domain lookup key only.
   * It must never appear in the returned public read model.
   */
  private async composeParticipant(
    participant: JourneyDemandParticipantEntity,
  ): Promise<PublicJourneyDemandParticipant> {
    const memberPublicId = new MemberPublicId(participant.memberPublicId.value);

    const [traveller, trust] = await Promise.all([
      this.getPublicTravellerByMemberHandler.execute(
        new GetPublicTravellerByMemberQuery(memberPublicId),
      ),

      this.getPublicTrustProfileByMemberHandler.execute(
        new GetPublicTrustProfileByMemberQuery(memberPublicId.value),
      ),
    ]);

    return {
      publicId: participant.publicId.value,

      traveller,

      trust,

      seats: participant.seatCount(),

      status: this.toPublicParticipantStatus(participant.status.value),

      joinedAt: participant.joinedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Route Projection
  // ===========================================================================

  /**
   * Projects the Demand route into the public marketplace representation.
   *
   * The public route intentionally exposes:
   *
   *   - origin
   *   - destination
   *   - waypoints
   *
   * It does not expose:
   *
   *   - corridor publicId
   *   - corridorKey
   *   - persistence identifiers
   *   - aggregate internals
   */
  private toPublicRoute(
    demand: JourneyDemandAggregate,
  ): PublicJourneyDemandRoute {
    const corridor = demand.corridor;

    if (corridor === undefined) {
      throw new Error(
        `Public Journey Demand ${demand.journeyDemand.publicId.value} has no route.`,
      );
    }

    /**
     * The public route is derived from the Demand's domain waypoints.
     *
     * This avoids coupling the public projection to persistence-style
     * properties such as originLatitude or destinationLatitude.
     *
     * Origin and destination are identified by their domain waypoint types.
     */
    const originWaypoint = demand.waypoints.find((waypoint) =>
      waypoint.isOrigin(),
    );

    const destinationWaypoint = demand.waypoints.find((waypoint) =>
      waypoint.isDestination(),
    );

    if (originWaypoint === undefined) {
      throw new Error(
        `Public Journey Demand ${demand.journeyDemand.publicId.value} has no origin waypoint.`,
      );
    }

    if (destinationWaypoint === undefined) {
      throw new Error(
        `Public Journey Demand ${demand.journeyDemand.publicId.value} has no destination waypoint.`,
      );
    }

    return {
      origin: {
        name: originWaypoint.name.value,
        latitude: originWaypoint.latitude,
        longitude: originWaypoint.longitude,
      },

      destination: {
        name: destinationWaypoint.name.value,
        latitude: destinationWaypoint.latitude,
        longitude: destinationWaypoint.longitude,
      },

      waypoints: demand.waypoints.map((waypoint) => ({
        publicId: waypoint.publicId.value,

        type: this.toPublicWaypointType(waypoint.type.value),

        sequence: waypoint.sequence.value,

        name: waypoint.name.value,

        latitude: waypoint.latitude,

        longitude: waypoint.longitude,

        pickupRequired: waypoint.pickupRequired,

        dropoffRequired: waypoint.dropoffRequired,
      })),
    };
  }

  // ===========================================================================
  // Schedule Projection
  // ===========================================================================

  /**
   * Projects only the schedule information required by the public marketplace.
   *
   * Schedule publicId and other domain/persistence details are intentionally
   * excluded.
   */
  private toPublicSchedule(
    demand: JourneyDemandAggregate,
  ): PublicJourneyDemandSchedule {
    const schedule = demand.schedule;

    if (schedule === undefined) {
      throw new Error(
        `Public Journey Demand ${demand.journeyDemand.publicId.value} has no schedule.`,
      );
    }

    return {
      earliestDeparture: schedule.earliestDeparture.toISOString(),

      latestDeparture: schedule.latestDeparture.toISOString(),

      targetArrival: schedule.targetArrival?.toISOString() ?? null,

      maximumArrival: schedule.maximumArrival?.toISOString() ?? null,

      timezone: schedule.timezone.value,
    };
  }

  // ===========================================================================
  // Capacity Projection
  // ===========================================================================

  /**
   * Projects Demand capacity into the public marketplace representation.
   *
   * JourneyDemandSeats is a domain Value Object:
   *
   *     JourneyDemandSeats
   *          └── value: number
   *
   * The public marketplace contract deliberately exposes primitive numbers.
   *
   * remainingSeats is already exposed by the aggregate as a primitive number.
   */
  private toPublicCapacity(
    demand: JourneyDemandAggregate,
  ): PublicJourneyDemandCapacity {
    const capacity = demand.capacity;

    if (capacity === undefined) {
      throw new Error(
        `Public Journey Demand ${demand.journeyDemand.publicId.value} has no capacity.`,
      );
    }

    return {
      requestedSeats: capacity.requestedSeats.value,

      matchedSeats: capacity.matchedSeats,

      remainingSeats: demand.remainingSeats,
    };
  }

  // ===========================================================================
  // Pricing Projection
  // ===========================================================================

  /**
   * Projects pricing into the primitive public marketplace contract.
   *
   * Optional price Value Objects are converted to either their primitive
   * numeric value or null.
   */
  private toPublicPricing(
    demand: JourneyDemandAggregate,
  ): PublicJourneyDemandPricing {
    const pricing = demand.pricing;

    if (pricing === undefined) {
      throw new Error(
        `Public Journey Demand ${demand.journeyDemand.publicId.value} has no pricing.`,
      );
    }

    return {
      maximumPricePerSeat: pricing.maximumPricePerSeat?.value ?? null,

      preferredPricePerSeat: pricing.preferredPricePerSeat?.value ?? null,

      currency: pricing.currency.value,
    };
  }

  // ===========================================================================
  // Public Status
  // ===========================================================================

  /**
   * Restricts the internal Demand lifecycle to statuses that are meaningful
   * and safe for the public marketplace.
   */
  private toPublicStatus(status: string): PublicJourneyDemandStatus {
    switch (status) {
      case 'OPEN':
      case 'MATCHED':
      case 'CONVERTED':
      case 'FULFILLED':
        return status;

      default:
        throw new Error(`Invalid public Journey Demand status: ${status}.`);
    }
  }

  // ===========================================================================
  // Public Participant Status
  // ===========================================================================

  /**
   * Restricts participant status to the public contract.
   */
  private toPublicParticipantStatus(
    status: string,
  ): 'ACTIVE' | 'WITHDRAWN' | 'REMOVED' {
    switch (status) {
      case 'ACTIVE':
      case 'WITHDRAWN':
      case 'REMOVED':
        return status;

      default:
        throw new Error(
          `Invalid public Journey Demand participant status: ${status}.`,
        );
    }
  }

  // ===========================================================================
  // Public Waypoint Type
  // ===========================================================================

  /**
   * Restricts the domain waypoint type to the public marketplace contract.
   */
  private toPublicWaypointType(type: string): PublicJourneyDemandWaypointType {
    switch (type) {
      case 'ORIGIN':
      case 'DESTINATION':
      case 'PICKUP':
      case 'DROPOFF':
      case 'WAYPOINT':
        return type;

      default:
        throw new Error(
          `Invalid public Journey Demand waypoint type: ${type}.`,
        );
    }
  }
}
