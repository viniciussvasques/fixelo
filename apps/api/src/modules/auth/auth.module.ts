import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PrismaService } from '@fixelo/prisma';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRY', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    PrismaService,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {} 