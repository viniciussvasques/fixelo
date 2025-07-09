# 🛠️ Admin Panel (AdminJS)

This document covers the administrative panel for the Fixelo platform, built with AdminJS.

## 📋 Overview

The Admin Panel provides a comprehensive interface for platform administrators to manage users, services, bookings, payments, and monitor system performance. It's built with AdminJS, offering a powerful and customizable admin interface.

**Status**: ❌ **Pending** - Planned for implementation

## 🏗️ Architecture

### Project Structure

```
apps/admin/
├── src/
│   ├── admin/
│   │   ├── resources/       # AdminJS resources
│   │   │   ├── users.ts
│   │   │   ├── services.ts
│   │   │   ├── bookings.ts
│   │   │   ├── payments.ts
│   │   │   └── reviews.ts
│   │   ├── components/      # Custom components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Reports.tsx
│   │   ├── actions/         # Custom actions
│   │   │   ├── export.ts
│   │   │   ├── bulk-actions.ts
│   │   │   └── reports.ts
│   │   └── config.ts        # AdminJS configuration
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── package.json
└── tsconfig.json
```

### Technology Stack

- **Framework**: AdminJS with Express
- **Database**: PostgreSQL via Prisma
- **Authentication**: AdminJS Auth
- **UI Framework**: React (AdminJS built-in)
- **Charts**: Chart.js
- **Export**: xlsx, csv
- **File Upload**: Multer

## 🚀 Features

### Core Features

1. **User Management**
   - View all users (clients, providers, admins)
   - Edit user profiles
   - Suspend/activate accounts
   - Role management
   - User analytics

2. **Service Management**
   - Approve/reject services
   - Edit service details
   - Category management
   - Service analytics
   - Featured services

3. **Booking Management**
   - View all bookings
   - Monitor booking status
   - Resolve disputes
   - Booking analytics
   - Refund processing

4. **Payment Management**
   - Transaction monitoring
   - Payment analytics
   - Refund processing
   - Fee management
   - Financial reports

5. **Review Management**
   - Moderate reviews
   - Flag inappropriate content
   - Review analytics
   - Response management

6. **System Analytics**
   - Platform metrics
   - User behavior
   - Revenue tracking
   - Performance monitoring

7. **Content Management**
   - Manage categories
   - System notifications
   - Email templates
   - App content

## 🔧 AdminJS Configuration

### Main Configuration

```typescript
// src/admin/config.ts
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

AdminJS.registerAdapter({
  Database,
  Resource,
});

const adminOptions = {
  resources: [
    {
      resource: { model: prisma.user, client: prisma },
      options: {
        navigation: {
          name: 'User Management',
          icon: 'Users',
        },
        properties: {
          password: { isVisible: false },
          refreshToken: { isVisible: false },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(request.payload.password, 10);
              }
              return request;
            },
          },
        },
      },
    },
    {
      resource: { model: prisma.service, client: prisma },
      options: {
        navigation: {
          name: 'Service Management',
          icon: 'Settings',
        },
        listProperties: ['title', 'category', 'price', 'active', 'createdAt'],
        filterProperties: ['category', 'active', 'provider'],
        actions: {
          approve: {
            actionType: 'record',
            component: false,
            handler: async (request, response, context) => {
              const { record } = context;
              await prisma.service.update({
                where: { id: record.id },
                data: { active: true, approvedAt: new Date() },
              });
              return {
                record: record.toJSON(),
                notice: {
                  message: 'Service approved successfully',
                  type: 'success',
                },
              };
            },
          },
        },
      },
    },
    {
      resource: { model: prisma.booking, client: prisma },
      options: {
        navigation: {
          name: 'Booking Management',
          icon: 'Calendar',
        },
        listProperties: ['id', 'service.title', 'client.name', 'status', 'scheduledAt'],
        filterProperties: ['status', 'createdAt'],
      },
    },
    {
      resource: { model: prisma.payment, client: prisma },
      options: {
        navigation: {
          name: 'Payment Management',
          icon: 'CreditCard',
        },
        listProperties: ['id', 'amount', 'status', 'createdAt'],
        filterProperties: ['status', 'createdAt'],
      },
    },
  ],
  rootPath: '/admin',
  loginPath: '/admin/login',
  logoutPath: '/admin/logout',
  branding: {
    companyName: 'Fixelo Admin',
    logo: '/assets/logo.png',
    softwareBrothers: false,
  },
  dashboard: {
    component: AdminJS.bundle('./components/Dashboard'),
  },
};

export const adminJs = new AdminJS(adminOptions);
```

### Authentication Setup

```typescript
// src/admin/auth.ts
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};
```

## 📊 Dashboard Components

### Main Dashboard

```typescript
// src/admin/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Box, H1, H2, Text } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    topServices: [],
  });

  const api = new ApiClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.getDashboardData();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <Box>
      <H1>Dashboard</H1>
      
      <Box display="flex" flexWrap="wrap" gap="lg">
        <Box flex="1" minWidth="200px">
          <Box bg="primary100" p="lg" borderRadius="lg">
            <H2>Total Users</H2>
            <Text fontSize="xl" fontWeight="bold">
              {stats.totalUsers.toLocaleString()}
            </Text>
          </Box>
        </Box>
        
        <Box flex="1" minWidth="200px">
          <Box bg="success100" p="lg" borderRadius="lg">
            <H2>Total Services</H2>
            <Text fontSize="xl" fontWeight="bold">
              {stats.totalServices.toLocaleString()}
            </Text>
          </Box>
        </Box>
        
        <Box flex="1" minWidth="200px">
          <Box bg="info100" p="lg" borderRadius="lg">
            <H2>Total Bookings</H2>
            <Text fontSize="xl" fontWeight="bold">
              {stats.totalBookings.toLocaleString()}
            </Text>
          </Box>
        </Box>
        
        <Box flex="1" minWidth="200px">
          <Box bg="warning100" p="lg" borderRadius="lg">
            <H2>Total Revenue</H2>
            <Text fontSize="xl" fontWeight="bold">
              ${stats.totalRevenue.toLocaleString()}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box mt="xl">
        <H2>Recent Bookings</H2>
        <RecentBookings bookings={stats.recentBookings} />
      </Box>

      <Box mt="xl">
        <H2>Top Services</H2>
        <TopServices services={stats.topServices} />
      </Box>
    </Box>
  );
};

export default Dashboard;
```

### Analytics Component

```typescript
// src/admin/components/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { Box, H2 } from '@adminjs/design-system';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    bookingTrends: [],
    revenueByCategory: [],
    topPerformers: [],
  });

  const userGrowthData = {
    labels: analyticsData.userGrowth.map(item => item.date),
    datasets: [
      {
        label: 'New Users',
        data: analyticsData.userGrowth.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const bookingTrendsData = {
    labels: analyticsData.bookingTrends.map(item => item.date),
    datasets: [
      {
        label: 'Bookings',
        data: analyticsData.bookingTrends.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const revenueByCategory = {
    labels: analyticsData.revenueByCategory.map(item => item.category),
    datasets: [
      {
        data: analyticsData.revenueByCategory.map(item => item.revenue),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <Box>
      <H2>Analytics</H2>
      
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap="lg" mt="lg">
        <Box>
          <H3>User Growth</H3>
          <Line data={userGrowthData} />
        </Box>
        
        <Box>
          <H3>Booking Trends</H3>
          <Bar data={bookingTrendsData} />
        </Box>
        
        <Box>
          <H3>Revenue by Category</H3>
          <Doughnut data={revenueByCategory} />
        </Box>
        
        <Box>
          <H3>Top Performers</H3>
          <TopPerformersTable performers={analyticsData.topPerformers} />
        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;
```

## 🔍 Custom Actions

### Bulk Actions

```typescript
// src/admin/actions/bulk-actions.ts
import { ActionRequest, ActionResponse } from 'adminjs';

export const bulkApproveServices = {
  actionType: 'bulk',
  component: false,
  handler: async (request: ActionRequest, response: ActionResponse, context: any) => {
    const { records } = context;
    
    const promises = records.map(async (record: any) => {
      await context.resource.update(record.id, {
        active: true,
        approvedAt: new Date(),
      });
    });

    await Promise.all(promises);

    return {
      records: records.map((record: any) => record.toJSON()),
      notice: {
        message: `${records.length} services approved successfully`,
        type: 'success',
      },
    };
  },
};

export const bulkSuspendUsers = {
  actionType: 'bulk',
  component: false,
  handler: async (request: ActionRequest, response: ActionResponse, context: any) => {
    const { records } = context;
    
    const promises = records.map(async (record: any) => {
      await context.resource.update(record.id, {
        active: false,
        suspendedAt: new Date(),
      });
    });

    await Promise.all(promises);

    return {
      records: records.map((record: any) => record.toJSON()),
      notice: {
        message: `${records.length} users suspended successfully`,
        type: 'success',
      },
    };
  },
};
```

### Export Actions

```typescript
// src/admin/actions/export.ts
import * as XLSX from 'xlsx';
import { ActionRequest, ActionResponse } from 'adminjs';

export const exportToExcel = {
  actionType: 'resource',
  component: false,
  handler: async (request: ActionRequest, response: ActionResponse, context: any) => {
    const { resource } = context;
    
    const records = await resource.findMany({});
    
    const data = records.map(record => {
      const params = record.params;
      return {
        ID: params.id,
        Name: params.name,
        Email: params.email,
        Role: params.role,
        'Created At': params.createdAt,
        'Updated At': params.updatedAt,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    
    return buffer;
  },
};
```

## 📊 Reports System

### Revenue Reports

```typescript
// src/admin/components/Reports.tsx
import React, { useState, useEffect } from 'react';
import { Box, H2, Button, DatePicker } from '@adminjs/design-system';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    averageOrderValue: 0,
    topCategories: [],
    topProviders: [],
  });

  const generateReport = async () => {
    try {
      const response = await fetch('/admin/api/reports/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange),
      });
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const exportReport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/admin/api/reports/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dateRange, ...reportData }),
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report.${format}`;
      a.click();
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  return (
    <Box>
      <H2>Revenue Reports</H2>
      
      <Box display="flex" gap="md" alignItems="end" mb="lg">
        <DatePicker
          value={dateRange.startDate}
          onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
          placeholder="Start Date"
        />
        <DatePicker
          value={dateRange.endDate}
          onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
          placeholder="End Date"
        />
        <Button onClick={generateReport}>Generate Report</Button>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="lg" mb="lg">
        <Box bg="primary100" p="lg" borderRadius="lg">
          <H3>Total Revenue</H3>
          <Text fontSize="xl" fontWeight="bold">
            ${reportData.totalRevenue.toLocaleString()}
          </Text>
        </Box>
        
        <Box bg="success100" p="lg" borderRadius="lg">
          <H3>Total Bookings</H3>
          <Text fontSize="xl" fontWeight="bold">
            {reportData.totalBookings.toLocaleString()}
          </Text>
        </Box>
        
        <Box bg="info100" p="lg" borderRadius="lg">
          <H3>Average Order Value</H3>
          <Text fontSize="xl" fontWeight="bold">
            ${reportData.averageOrderValue.toFixed(2)}
          </Text>
        </Box>
      </Box>

      <Box display="flex" gap="md" mb="lg">
        <Button variant="primary" onClick={() => exportReport('pdf')}>
          Export PDF
        </Button>
        <Button variant="secondary" onClick={() => exportReport('excel')}>
          Export Excel
        </Button>
      </Box>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap="lg">
        <Box>
          <H3>Top Categories</H3>
          <TopCategoriesTable categories={reportData.topCategories} />
        </Box>
        
        <Box>
          <H3>Top Providers</H3>
          <TopProvidersTable providers={reportData.topProviders} />
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
```

## 🔒 Security & Permissions

### Role-Based Access

```typescript
// src/admin/middleware/auth.ts
import { AdminJSContext } from 'adminjs';

export const canAccessResource = (context: AdminJSContext) => {
  const { currentAdmin } = context;
  
  if (!currentAdmin) {
    return false;
  }

  return currentAdmin.role === 'ADMIN';
};

export const canModifyResource = (context: AdminJSContext) => {
  const { currentAdmin } = context;
  
  if (!currentAdmin) {
    return false;
  }

  return currentAdmin.role === 'ADMIN' && currentAdmin.permissions?.includes('modify');
};

export const canDeleteResource = (context: AdminJSContext) => {
  const { currentAdmin } = context;
  
  if (!currentAdmin) {
    return false;
  }

  return currentAdmin.role === 'ADMIN' && currentAdmin.permissions?.includes('delete');
};
```

### Audit Logging

```typescript
// src/admin/middleware/audit.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auditLogger = async (action: string, resource: string, recordId: string, userId: string, changes?: any) => {
  await prisma.auditLog.create({
    data: {
      action,
      resource,
      recordId,
      userId,
      changes: changes ? JSON.stringify(changes) : null,
      timestamp: new Date(),
    },
  });
};

export const auditMiddleware = (action: string, resource: string) => {
  return async (request: any, response: any, context: any) => {
    const { currentAdmin, record } = context;
    
    if (currentAdmin && record) {
      await auditLogger(
        action,
        resource,
        record.id,
        currentAdmin.id,
        request.payload
      );
    }
    
    return { request, response, context };
  };
};
```

## 🔧 Configuration & Setup

### Environment Variables

```env
# Admin Panel Configuration
ADMIN_EMAIL=admin@fixelo.com
ADMIN_PASSWORD=secure-admin-password
ADMIN_SESSION_SECRET=your-session-secret
ADMIN_COOKIE_PASSWORD=your-cookie-password

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fixelo

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=admin@fixelo.com
EMAIL_PASS=your-email-password
```

### Package Dependencies

```json
{
  "dependencies": {
    "adminjs": "^7.0.0",
    "@adminjs/express": "^6.0.0",
    "@adminjs/prisma": "^4.0.0",
    "@adminjs/upload": "^4.0.0",
    "express": "^4.18.0",
    "express-session": "^1.17.0",
    "bcrypt": "^5.1.0",
    "multer": "^1.4.0",
    "xlsx": "^0.18.0",
    "chart.js": "^4.0.0",
    "react-chartjs-2": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/bcrypt": "^5.0.0",
    "@types/multer": "^1.4.0",
    "typescript": "^5.0.0"
  }
}
```

## 🚀 Deployment

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  admin:
    build: .
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - ADMIN_SESSION_SECRET=${ADMIN_SESSION_SECRET}
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads
```

## 📊 Monitoring & Metrics

### System Metrics

```typescript
// src/admin/components/SystemMetrics.tsx
import React, { useState, useEffect } from 'react';
import { Box, H2, Progress } from '@adminjs/design-system';

const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    serverHealth: 'healthy',
    databaseConnections: 45,
    memoryUsage: 68,
    cpuUsage: 32,
    diskUsage: 78,
    activeUsers: 1247,
    responseTime: 156,
  });

  useEffect(() => {
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/admin/api/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  return (
    <Box>
      <H2>System Metrics</H2>
      
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="lg">
        <Box>
          <H3>Server Health</H3>
          <Text color={metrics.serverHealth === 'healthy' ? 'success' : 'error'}>
            {metrics.serverHealth.toUpperCase()}
          </Text>
        </Box>
        
        <Box>
          <H3>Active Users</H3>
          <Text fontSize="xl" fontWeight="bold">
            {metrics.activeUsers.toLocaleString()}
          </Text>
        </Box>
        
        <Box>
          <H3>Memory Usage</H3>
          <Progress value={metrics.memoryUsage} max={100} />
          <Text>{metrics.memoryUsage}%</Text>
        </Box>
        
        <Box>
          <H3>CPU Usage</H3>
          <Progress value={metrics.cpuUsage} max={100} />
          <Text>{metrics.cpuUsage}%</Text>
        </Box>
        
        <Box>
          <H3>Disk Usage</H3>
          <Progress value={metrics.diskUsage} max={100} />
          <Text>{metrics.diskUsage}%</Text>
        </Box>
        
        <Box>
          <H3>Average Response Time</H3>
          <Text fontSize="xl" fontWeight="bold">
            {metrics.responseTime}ms
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SystemMetrics;
```

## 🎯 Implementation Plan

### Phase 1: Basic Setup
- [ ] AdminJS configuration
- [ ] Authentication system
- [ ] Basic resource management
- [ ] Dashboard setup

### Phase 2: Advanced Features
- [ ] Custom components
- [ ] Analytics integration
- [ ] Bulk actions
- [ ] Export functionality

### Phase 3: Reporting
- [ ] Revenue reports
- [ ] User analytics
- [ ] Performance metrics
- [ ] Audit logging

### Phase 4: Security & Optimization
- [ ] Role-based permissions
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Monitoring setup

---

The Admin Panel will provide comprehensive platform management capabilities, enabling administrators to efficiently monitor, manage, and analyze all aspects of the Fixelo platform. The implementation will follow AdminJS best practices and provide a user-friendly interface for all administrative tasks.

For API integration details, refer to the backend documentation in `/docs/modules/`. 