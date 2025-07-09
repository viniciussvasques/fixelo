import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@fixelo/prisma';
import { CreateServiceDto, UpdateServiceDto, ServiceSearchDto, ServiceResponseDto, ServiceListResponseDto, ServiceCategoriesResponseDto } from './dto/service.dto';
import { UserRole } from '@fixelo/common';
import { ServiceCategory, ServiceStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto, providerId: string): Promise<ServiceResponseDto> {
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
      select: { role: true, isActive: true }
    });

    if (!provider || provider.role !== UserRole.PROVIDER) {
      throw new ForbiddenException('Only providers can create services');
    }

    if (!provider.isActive) {
      throw new ForbiddenException('Account is not active');
    }

    const service = await this.prisma.service.create({
      data: {
        ...createServiceDto,
        providerId,
        status: ServiceStatus.ACTIVE,
        isActive: true,
      },
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
            rating: true,
            reviewCount: true,
            verified: true,
          }
        }
      }
    });

    return this.formatServiceResponse(service);
  }

  async findAll(searchDto: ServiceSearchDto): Promise<ServiceListResponseDto> {
    const {
      query,
      category,
      city,
      state,
      minPrice,
      maxPrice,
      latitude,
      longitude,
      radius,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      verifiedOnly,
      tags
    } = searchDto;

    const where: any = {
      isActive: true,
      status: ServiceStatus.ACTIVE,
      provider: {
        isActive: true,
        ...(verifiedOnly && { verified: true })
      }
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: query.split(' ') } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (state) {
      where.state = state;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    let distanceSort = false;
    if (latitude && longitude && radius) {
      const latDelta = radius / 69;
      const lngDelta = radius / (69 * Math.cos(latitude * Math.PI / 180));
      
      where.latitude = {
        gte: latitude - latDelta,
        lte: latitude + latDelta
      };
      where.longitude = {
        gte: longitude - lngDelta,
        lte: longitude + lngDelta
      };
      
      if (sortBy === 'distance') {
        distanceSort = true;
      }
    }

    let orderBy: any = {};
    if (!distanceSort) {
      switch (sortBy) {
        case 'price':
          orderBy.price = sortOrder;
          break;
        case 'rating':
          orderBy.provider = { rating: sortOrder };
          break;
        case 'createdAt':
        default:
          orderBy.createdAt = sortOrder;
          break;
      }
    }

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: {
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              businessName: true,
              avatar: true,
              rating: true,
              reviewCount: true,
              verified: true,
            }
          }
        },
        orderBy: !distanceSort ? orderBy : undefined,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.service.count({ where })
    ]);

    let sortedServices = services;
    if (distanceSort && latitude && longitude) {
      sortedServices = services
        .map(service => ({
          ...service,
          distance: this.calculateDistance(
            latitude,
            longitude,
            service.latitude || 0,
            service.longitude || 0
          )
        }))
        .filter(service => service.distance <= radius)
        .sort((a, b) => sortOrder === 'asc' ? a.distance - b.distance : b.distance - a.distance);
    }

    return {
      services: sortedServices.map(service => this.formatServiceResponse(service)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
            rating: true,
            reviewCount: true,
            verified: true,
          }
        }
      }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.formatServiceResponse(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId: string): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: { providerId: true }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.providerId !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
            rating: true,
            reviewCount: true,
            verified: true,
          }
        }
      }
    });

    return this.formatServiceResponse(updatedService);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: { providerId: true }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.providerId !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.prisma.service.update({
      where: { id },
      data: { isActive: false, status: ServiceStatus.INACTIVE }
    });

    return { message: 'Service deleted successfully' };
  }

  async getCategories(): Promise<ServiceCategoriesResponseDto> {
    const categoriesWithCounts = await this.prisma.service.groupBy({
      by: ['category'],
      where: { isActive: true, status: ServiceStatus.ACTIVE },
      _count: { category: true }
    });

    const categories = categoriesWithCounts.map(item => ({
      category: item.category,
      name: this.formatCategoryName(item.category),
      count: item._count.category,
      icon: this.getCategoryIcon(item.category)
    }));

    return { categories };
  }

  async findByProvider(providerId: string, page = 1, limit = 10): Promise<ServiceListResponseDto> {
    const where = { providerId, isActive: true };
    
    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: {
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              businessName: true,
              avatar: true,
              rating: true,
              reviewCount: true,
              verified: true,
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.service.count({ where })
    ]);

    return {
      services: services.map(service => this.formatServiceResponse(service)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getFeaturedServices(limit = 10): Promise<ServiceResponseDto[]> {
    const services = await this.prisma.service.findMany({
      where: {
        isActive: true,
        status: ServiceStatus.ACTIVE,
        provider: {
          isActive: true,
          verified: true
        }
      },
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
            rating: true,
            reviewCount: true,
            verified: true,
          }
        }
      },
      orderBy: [
        { provider: { rating: 'desc' } },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return services.map(service => this.formatServiceResponse(service));
  }

  private formatServiceResponse(service: any): ServiceResponseDto {
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      currency: 'USD',
      duration: service.duration,
      images: service.images || [],
      status: service.status,
      isActive: service.isActive,
      tags: service.tags || [],
      address: service.address,
      city: service.city,
      state: service.state,
      zipCode: service.zipCode,
      latitude: service.latitude,
      longitude: service.longitude,
      provider: service.provider,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
  }

  // Helper method to format category names for display
  private formatCategoryName(category: ServiceCategory): string {
    return category.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Helper method to get category icons
  private getCategoryIcon(category: ServiceCategory): string {
    const icons: Record<string, string> = {
      'HOUSE_CLEANING': '🏠',
      'DEEP_CLEANING': '🧽',
      'MOVE_IN_OUT_CLEANING': '📦',
      'OFFICE_CLEANING': '🏢',
      'WINDOW_CLEANING': '🪟',
      'PRESSURE_WASHING': '💨',
      'GUTTER_CLEANING': '🏠',
      'ROOF_CLEANING': '🏠',
      'POOL_CLEANING': '🏊',
      'LAWN_MOWING': '🌿',
      'LANDSCAPING': '🌺',
      'TREE_TRIMMING': '🌳',
      'SPRINKLER_REPAIR': '💧',
      'PEST_CONTROL': '🐛',
      'HANDYMAN': '🔧',
      'ELECTRICAL_WORK': '⚡',
      'PLUMBING': '🚰',
      'HVAC_REPAIR': '❄️',
      'APPLIANCE_REPAIR': '🔧',
      'PAINTING': '🎨',
      'FLOORING': '🏠',
      'ROOFING': '🏠',
      'KITCHEN_REMODELING': '🍽️',
      'BATHROOM_REMODELING': '🛁',
      'CARPENTRY': '🪚',
      'DRYWALL_REPAIR': '🏠',
      'TILE_INSTALLATION': '🔲',
      'CABINET_INSTALLATION': '🗄️',
      'COUNTERTOP_INSTALLATION': '🏠',
      'MOVING_SERVICES': '📦',
      'PACKING_SERVICES': '📦',
      'FURNITURE_ASSEMBLY': '🪑',
      'JUNK_REMOVAL': '🗑️',
      'STORAGE_SERVICES': '🏪',
      'DELIVERY_SERVICES': '🚚',
      'COURIER_SERVICES': '🚚',
      'AUTO_REPAIR': '🚗',
      'OIL_CHANGE': '🛢️',
      'CAR_WASH': '🚗',
      'DETAILING': '✨',
      'TIRE_SERVICES': '🛞',
      'BRAKE_REPAIR': '🚗',
      'ENGINE_REPAIR': '🔧',
      'TRANSMISSION_REPAIR': '⚙️',
      'AUTO_GLASS_REPAIR': '🪟',
      'MOBILE_MECHANIC': '🚗',
      'HAIR_STYLING': '💇',
      'HAIR_COLORING': '🎨',
      'HAIR_EXTENSIONS': '💇‍♀️',
      'BARBERING': '✂️',
      'NAIL_SERVICES': '💅',
      'MANICURE_PEDICURE': '💅',
      'MASSAGE_THERAPY': '💆',
      'FACIAL_TREATMENTS': '🧴',
      'EYEBROW_THREADING': '👁️',
      'EYELASH_EXTENSIONS': '👁️',
      'MAKEUP_SERVICES': '💋',
      'PERSONAL_TRAINING': '💪',
      'YOGA_INSTRUCTION': '🧘',
      'NUTRITION_COACHING': '🥗',
      'WEDDING_PLANNING': '💒',
      'PARTY_PLANNING': '🎈',
      'CATERING': '🍽️',
      'PHOTOGRAPHY': '📸',
      'VIDEOGRAPHY': '🎥',
      'DJ_SERVICES': '🎧',
      'LIVE_MUSIC': '🎵',
      'EVENT_DECORATION': '🎨',
      'BARTENDING': '🍸',
      'SECURITY_SERVICES': '🛡️',
      'TUTORING': '📚',
      'MUSIC_LESSONS': '🎵',
      'LANGUAGE_LESSONS': '🗣️',
      'COMPUTER_REPAIR': '💻',
      'PHONE_REPAIR': '📱',
      'IT_SUPPORT': '💻',
      'WEB_DESIGN': '🌐',
      'GRAPHIC_DESIGN': '🎨',
      'ACCOUNTING': '💰',
      'TAX_PREPARATION': '📋',
      'LEGAL_SERVICES': '⚖️',
      'NOTARY_SERVICES': '📋',
      'TRANSLATION_SERVICES': '🗣️',
      'PET_GROOMING': '✂️',
      'DOG_WALKING': '🚶',
      'PET_SITTING': '🐱',
      'PET_BOARDING': '🏠',
      'VETERINARY_SERVICES': '🩺',
      'PET_TRAINING': '🎾',
      'PET_TRANSPORTATION': '🚗',
      'BABYSITTING': '👶',
      'NANNY_SERVICES': '👩‍👧‍👦',
      'ELDER_CARE': '👴',
      'COMPANION_CARE': '🤝',
      'RESPITE_CARE': '🏥',
      'PHYSICAL_THERAPY': '💪',
      'OCCUPATIONAL_THERAPY': '🏥',
      'SPEECH_THERAPY': '🗣️',
      'MENTAL_HEALTH_COUNSELING': '🧠',
      'MEDICAL_TRANSPORT': '🚑',
      'PHARMACY_DELIVERY': '💊',
      'MEDICAL_EQUIPMENT': '🩺',
      'DRIVING_LESSONS': '🚗',
      'SPORTS_COACHING': '⚽',
      'LIFE_COACHING': '🧠',
      'CAREER_COACHING': '💼',
      'SKILL_TRAINING': '🎯',
      'CARPET_STEAM_CLEANING': '🧽',
      'UPHOLSTERY_CLEANING': '🛋️',
      'TILE_GROUT_CLEANING': '🔲',
      'MATTRESS_CLEANING': '🛏️',
      'VENT_CLEANING': '🌬️',
      'CHIMNEY_CLEANING_SERVICE': '🏠',
      'BIOHAZARD_CLEANING': '☣️',
      'HOME_STAGING': '🏠',
      'PROPERTY_MANAGEMENT': '🏢',
      'REAL_ESTATE_PHOTOGRAPHY': '📸',
      'HOME_INSPECTION': '🔍',
      'APPRAISAL': '📊',
      'MAGIC_SHOWS': '🎩',
      'CLOWNS': '🤡',
      'FACE_PAINTING': '🎨',
      'BALLOON_ARTIST': '🎈',
      'COSTUME_RENTAL': '👗',
      'EQUIPMENT_RENTAL': '🛠️',
      'TOOL_RENTAL': '🔨',
      'OTHER': '🔧'
    };

    return icons[category] || '🔧';
  }

  // Helper method to calculate distance between two points in miles
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
} 