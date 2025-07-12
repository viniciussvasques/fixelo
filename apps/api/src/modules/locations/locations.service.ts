import { Injectable } from '@nestjs/common';
import { PrismaService } from '@fixelo/prisma';
import { FLORIDA_CITIES } from '@fixelo/common';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCities() {
    try {
      // Get unique cities from services and users (for priority ordering)
      const citiesFromServices = await this.prisma.service.findMany({
        where: { isActive: true },
        select: { city: true },
        distinct: ['city']
      });

      const citiesFromUsers = await this.prisma.user.findMany({
        where: { isActive: true },
        select: { city: true },
        distinct: ['city']
      });

      // Get cities with actual data (services/users)
      const activeCities = new Set([
        ...citiesFromServices.map(s => s.city).filter(Boolean),
        ...citiesFromUsers.map(u => u.city).filter(Boolean)
      ]);

      // Use the complete Florida cities list from constants
      const allFloridaCities = [...FLORIDA_CITIES];

      // Sort cities: active cities first, then alphabetically
      const sortedCities = allFloridaCities.sort((a, b) => {
        const aIsActive = activeCities.has(a);
        const bIsActive = activeCities.has(b);
        
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
        return a.localeCompare(b);
      });

      return {
        success: true,
        data: sortedCities,
        meta: {
          totalCities: sortedCities.length,
          activeCities: activeCities.size
        }
      };
    } catch (error) {
      console.error('Error fetching cities:', error);
      return {
        success: false,
        error: 'Failed to fetch cities',
        data: [...FLORIDA_CITIES].sort() // Fallback to all Florida cities
      };
    }
  }
} 