import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@fixelo/common';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles); 