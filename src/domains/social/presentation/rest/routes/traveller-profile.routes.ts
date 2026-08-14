// src/domains/social/presentation/rest/routes/traveller-profile.routes.ts

import type { Type } from '@nestjs/common';

import { TravellerProfileController } from '../controllers/traveller-profile.controller';

export const travellerProfileRoutes: Type<unknown>[] = [
  TravellerProfileController,
];
