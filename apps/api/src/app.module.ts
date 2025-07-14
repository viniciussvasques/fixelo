import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './modules/chat/chat.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AdsModule } from './modules/ads/ads.module';
import { PlansModule } from './modules/plans/plans.module';
import { HealthModule } from './modules/health/health.module';
import { ServicesModule } from './services/services.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { LocationsModule } from './modules/locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    AdsModule,
    PlansModule,
    ChatModule,
    HealthModule,
    AdminModule,
    LocationsModule,
  ],
})
export class AppModule {} 