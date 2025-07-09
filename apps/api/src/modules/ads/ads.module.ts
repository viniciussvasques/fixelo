import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '@fixelo/prisma';
import { PaymentMethodService } from '../payments/payment-method.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdsController],
  providers: [AdsService, PaymentMethodService, PrismaService],
  exports: [AdsService]
})
export class AdsModule {} 