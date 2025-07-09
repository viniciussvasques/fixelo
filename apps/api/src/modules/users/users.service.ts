import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@fixelo/prisma';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserListResponseDto, ChangePasswordDto } from './dto/user.dto';
import { UserRole, Language, PlanType } from '@fixelo/common';
// Prisma não exporta enums como nomeados; usaremos literais em strings
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, phone, password, role = UserRole.CLIENT, ...userData } = createUserDto;

    // Check if email already exists
    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email }
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if phone already exists
    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone }
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        email,
        phone,
        password: hashedPassword,
        role,
        status: 'ACTIVE',
        language: userData.language || Language.EN,
        country: userData.country || 'USA',
        state: userData.state || 'FL',
        verified: false,
        planType: role === UserRole.PROVIDER ? PlanType.FREE : PlanType.FREE,
        leadsUsed: 0,
        leadsLimit: role === UserRole.PROVIDER ? 10 : 0,
        rating: 0,
        reviewCount: 0,
        completedBookings: 0,
        isActive: true,
        emailVerified: false,
        preferredLanguage: userData.language || 'en',
        bio: userData.bio || null,
      }
    });

    return this.formatUserResponse(user);
  }

  async findAll(page = 1, limit = 10, role?: UserRole, status?: string, city?: string, state?: string): Promise<UserListResponseDto> {
    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users: users.map(user => this.formatUserResponse(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUserResponse(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    return user ? this.formatUserResponse(user) : null;
  }

  async findByPhone(phone: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { phone }
    });

    return user ? this.formatUserResponse(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email }
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if phone is being changed and already exists
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: updateUserDto.phone }
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        ...(hashedPassword && { password: hashedPassword }),
        updatedAt: new Date()
      }
    });

    return this.formatUserResponse(updatedUser);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { 
        isActive: false,
        status: 'INACTIVE'
      }
    });

    return { message: 'User deactivated successfully' };
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { password: true }
    });

    if (!user || !user.password) {
      throw new NotFoundException('User not found or password not set');
    }

    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword }
    });

    return { message: 'Password changed successfully' };
  }

  async deactivate(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { 
        status: 'INACTIVE',
        isActive: false 
      }
    });

    return this.formatUserResponse(updatedUser);
  }

  async activate(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { 
        status: 'ACTIVE',
        isActive: true 
      }
    });

    return this.formatUserResponse(updatedUser);
  }

  async verifyUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { verified: true }
    });

    return this.formatUserResponse(updatedUser);
  }

  async verifyEmail(id: string): Promise<{ message: string }> {
    await this.prisma.user.update({
      where: { id },
      data: { emailVerified: true }
    });

    return { message: 'Email verified successfully' };
  }

  // Removed verifyPhone, phoneVerified field does not exist

  async updatePlan(id: string, planType: PlanType): Promise<UserResponseDto> {
    const leadsLimit = planType === PlanType.PRO ? 999999 : 10;
    
    const user = await this.prisma.user.update({
      where: { id },
      data: { 
        planType,
        leadsLimit,
        updatedAt: new Date()
      }
    });

    return this.formatUserResponse(user);
  }

  async incrementLeadsUsed(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { leadsUsed: { increment: 1 } }
    });
  }

  async updateRating(id: string, newRating: number, reviewCount: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { 
        rating: newRating,
        reviewCount
      }
    });
  }

  // Removed earnings/spent update helpers; fields not in schema

  async getProviders(page = 1, limit = 10, city?: string, state?: string, verified?: boolean): Promise<UserListResponseDto> {
    const where: any = { 
      role: UserRole.PROVIDER,
      isActive: true,
      status: 'ACTIVE'
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }

    if (verified !== undefined) {
      where.verified = verified;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { verified: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users: users.map(user => this.formatUserResponse(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getTopProviders(limit = 10): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole.PROVIDER,
        isActive: true,
        status: 'ACTIVE',
        verified: true,
        rating: { gte: 4.0 }
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: limit
    });

    return users.map(user => this.formatUserResponse(user));
  }

  async searchUsers(query: string, role?: UserRole, page = 1, limit = 10): Promise<UserListResponseDto> {
    const where: any = {
      isActive: true,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { businessName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users: users.map(user => this.formatUserResponse(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Helper method to format user response, removing sensitive data
  private formatUserResponse(user: any): UserResponseDto {
    const { password, ...userWithoutSensitiveData } = user;
    
    return {
      ...userWithoutSensitiveData,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
      displayName: user.businessName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || user.phone
    };
  }
} 