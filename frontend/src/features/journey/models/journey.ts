// -----------------------------------------------------------------------------
// sisiMove — Journey Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the Journey aggregate.
//
// This model represents Journey state returned by the API. It does not expose
// Prisma/database implementation details.
//
// Cross-domain references remain opaque public IDs.
// -----------------------------------------------------------------------------

import type { JourneyAsset } from './journey-asset';
import type { JourneyCapacity } from './journey-capacity';
import type { JourneyCorridor } from './journey-corridor';
import type { JourneyPreferences } from './journey-preferences';
import type { JourneyPricing } from './journey-pricing';
import type { JourneySchedule } from './journey-schedule';
import type { JourneyVehicle } from './journey-vehicle';
import { JourneyStatus } from './journey-status';

export interface Journey {
  publicId: string;

  providerPublicId: string;

  status: JourneyStatus;

  publishedAt: string | null;

  startedAt: string | null;

  completionRequestedAt: string | null;

  completedAt: string | null;

  cancelledAt: string | null;

  expiredAt: string | null;

  version: number;

  corridor: JourneyCorridor | null;

  schedule: JourneySchedule | null;

  vehicle: JourneyVehicle | null;

  capacity: JourneyCapacity | null;

  pricing: JourneyPricing | null;

  preferences: JourneyPreferences | null;

  assets: JourneyAsset[];

  createdAt: string;

  updatedAt: string;
}