import { forwardRef, Module } from '@nestjs/common';

import { JourneyModule } from '../journey/journey.module';
import { SocialModule } from '../social/social.module';
import { TrustModule } from '../trust/trust.module';
import { AssetsModule } from '../assets/assets.module';
import { IdentityModule } from '../identity/identity.module';
import { FinancialModule } from '../financial/financial.module';
import { JourneyBookingModule } from '../journey-booking/journey-booking.module';

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

import { JourneyBoardingController } from './presentation/rest/controllers/journey-boarding.controller';

import { JOURNEY_BOARDING_PROVIDERS } from './infrastructure/dependency-injection/journey-boarding.providers';

import { JOURNEY_BOARDING_TOKENS } from './application/journey-boarding.tokens';

import {
  BoardPassengerHandler,
  BoardProviderHandler,
  CancelJourneyBoardingHandler,
  CreateJourneyBoardingHandler,
  MarkPassengerNoShowHandler,
  OpenJourneyBoardingHandler,
  RemoveParticipantHandler,
  StartJourneyHandler,
  WithdrawParticipantHandler,
} from './application/command-handlers';

import {
  GetJourneyBoardingHandler,
  GetJourneyBoardingByJourneyHandler,
  GetJourneyBoardingParticipantsHandler,
  GetJourneyBoardingParticipantSummaryHandler,
  ListJourneyBoardingsHandler,
} from './application/query-handlers';

@Module({
  imports: [
    IdentityModule,
    TrustModule,
    SocialModule,
    AssetsModule,
    FinancialModule,
    PrismaModule,

    forwardRef(() => JourneyModule),
    forwardRef(() => JourneyBookingModule),
  ],

  controllers: [JourneyBoardingController],

  providers: [
    // Infrastructure
    ...JOURNEY_BOARDING_PROVIDERS,

    // Journey Boarding lifecycle
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneyBoardingHandler,
    },
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.OPEN,
      useClass: OpenJourneyBoardingHandler,
    },
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.START_JOURNEY,
      useClass: StartJourneyHandler,
    },
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelJourneyBoardingHandler,
    },

    // Provider boarding
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PROVIDER,
      useClass: BoardProviderHandler,
    },

    // Passenger boarding
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.BOARD_PASSENGER,
      useClass: BoardPassengerHandler,
    },
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.MARK_PASSENGER_NO_SHOW,
      useClass: MarkPassengerNoShowHandler,
    },

    // Participant lifecycle
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.WITHDRAW_PARTICIPANT,
      useClass: WithdrawParticipantHandler,
    },
    {
      provide: JOURNEY_BOARDING_TOKENS.COMMAND_HANDLERS.REMOVE_PARTICIPANT,
      useClass: RemoveParticipantHandler,
    },

    // Journey Boarding queries
    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetJourneyBoardingHandler,
    },
    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY,
      useClass: GetJourneyBoardingByJourneyHandler,
    },
    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.LIST,
      useClass: ListJourneyBoardingsHandler,
    },

    // Participant queries
    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_PARTICIPANTS,
      useClass: GetJourneyBoardingParticipantsHandler,
    },

    // Participant summary
    {
      provide: JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_PARTICIPANT_SUMMARY,
      useClass: GetJourneyBoardingParticipantSummaryHandler,
    },
  ],

  exports: [
    JOURNEY_BOARDING_TOKENS.REPOSITORY,
    JOURNEY_BOARDING_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY,
  ],
})
export class JourneyBoardingModule {}

export default JourneyBoardingModule;
