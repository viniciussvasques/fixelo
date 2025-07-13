import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { PrismaService } from '@fixelo/prisma';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentsController, PaymentMethodController],
  providers: [PaymentsService, PaymentMethodService, PrismaService],
  exports: [PaymentsService, PaymentMethodService],
})
export class PaymentsModule {} 