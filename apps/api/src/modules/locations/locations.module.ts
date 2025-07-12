import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { PrismaService } from '@fixelo/prisma';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, PrismaService],
  exports: [LocationsService],
})
export class LocationsModule {} 