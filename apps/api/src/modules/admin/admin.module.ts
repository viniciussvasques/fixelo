import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {} 