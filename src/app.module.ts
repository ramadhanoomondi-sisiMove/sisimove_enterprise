
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Infrastructure
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { EventsModule } from './infrastructure/events/events.module';
import { LoggingModule } from './infrastructure/logging/winston/logging.module';
import { SecurityModule } from './infrastructure/security/security.module';
import { HttpModule } from './infrastructure/http/http.module';

// Bounded Contexts
import { IdentityModule } from './domains/identity/identity.module';
import { AuthModule } from './domains/auth/auth.module';
import { AssetsModule } from './domains/assets/assets.module';
import { SocialModule } from './domains/social/social.module';
import { TrustModule } from './domains/trust/trust.module';
import { JourneyModule } from './domains/journey/journey.module';
import { JourneyDemandModule } from './domains/journey-demand/journey-demand.module';
import { JourneyBookingModule } from './domains/journey-booking/journey-booking.module';
import { JourneyBoardingModule } from './domains/journey-boarding/journey-boarding.module';
import { JourneyCompletionModule } from './domains/journey-completion/journey-completion.module';
import { CommercialModule } from './domains/commercial/commercial.module';
import { FinancialModule } from './domains/financial/financial.module';
import { FinancialPaymentProvidersModule } from './domains/financial-payment-providers/financial-payment-providers.module';
import { AccountingModule } from './domains/accounting/accounting.module';
import { MessagingModule } from './domains/messaging/messaging.module';
import { NotificationModule } from './domains/notification/notification.module';
import { SupportModule } from './domains/support/support.module';

// External Integrations
import { MpesaModule } from './mpesa/mpesa.module';

@Module({
  imports: [
    // Global application configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Infrastructure
    ScheduleModule.forRoot(),
    PrismaModule,
    EventsModule,
    LoggingModule,
    SecurityModule,
    HttpModule,

    // Bounded Contexts
    IdentityModule,
    AuthModule,
    AssetsModule,
    SocialModule,
    TrustModule,
    JourneyModule,
    JourneyDemandModule,
    JourneyBookingModule,
    JourneyBoardingModule,
    JourneyCompletionModule,
    CommercialModule,
    FinancialModule,
    FinancialPaymentProvidersModule,
    AccountingModule,
    MessagingModule,
    NotificationModule,
    SupportModule,

    // External Integrations
    MpesaModule,
  ],
})
export class AppModule {}

// Default Export
export default AppModule;
