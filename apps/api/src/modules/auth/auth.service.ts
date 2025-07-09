import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@fixelo/prisma';
import { normalizePhone, isValidPhone } from '@fixelo/utils';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

// Importar tipo User do Prisma Client gerado
type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  city?: string | null;
  state?: string | null;
  preferredLanguage: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone, role, city, state, preferredLanguage } = registerDto;

    // Verificar se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Normalizar e validar telefone se fornecido
    let normalizedPhone: string | undefined;
    if (phone) {
      if (!isValidPhone(phone)) {
        throw new BadRequestException('Invalid phone number format');
      }
      normalizedPhone = normalizePhone(phone);
      
      // Verificar se o telefone já existe
      const existingPhoneUser = await this.prisma.user.findUnique({
        where: { phone: normalizedPhone },
      });
      
      if (existingPhoneUser) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: normalizedPhone,
        role,
        city,
        state,
        preferredLanguage: preferredLanguage || 'en',
        isActive: true,
        emailVerified: false,
      },
    });

    // Gerar tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar se a conta está ativa
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Atualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Gerar tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Verificar refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Buscar usuário
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verificar se o refresh token ainda é válido no banco
      const storedRefreshToken = await this.prisma.refreshToken.findFirst({
        where: {
          userId: user.id,
          token: refreshToken,
          expiresAt: { gt: new Date() },
        },
      });

      if (!storedRefreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Gerar novos tokens
      const tokens = await this.generateTokens(user);

      // Remover o refresh token antigo
      await this.prisma.refreshToken.delete({
        where: { id: storedRefreshToken.id },
      });

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Remover refresh token específico
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Remover todos os refresh tokens do usuário
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && user.isActive) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }

  private async generateTokens(user: User): Promise<Omit<AuthResponseDto, 'user'>> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessTokenExpiry = this.configService.get('JWT_ACCESS_EXPIRY') || '15m';
    const refreshTokenExpiry = this.configService.get('JWT_REFRESH_EXPIRY') || '7d';

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: accessTokenExpiry,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiry,
    });

    // Calcular tempo de expiração do refresh token
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7); // 7 dias

    // Salvar refresh token no banco
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutos em segundos
    };
  }
} 