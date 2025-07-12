import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('cities')
  @ApiOperation({ 
    summary: 'Get available cities',
    description: 'Get list of cities where services are available'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cities retrieved successfully'
  })
  async getCities() {
    return this.locationsService.getCities();
  }
} 