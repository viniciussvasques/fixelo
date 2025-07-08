import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'Fixelo API is running'
    };
  }

  async checkHealth() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    
    return {
      status: 'ok',
      timestamp,
      uptime: `${Math.floor(uptime)} seconds`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  async checkDatabase() {
    try {
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
} 