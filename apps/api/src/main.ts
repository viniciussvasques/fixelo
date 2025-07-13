import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

console.log('✅ STRIPE_SECRET_KEY definida diretamente:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');
console.log('✅ Comprimento da chave:', process.env.STRIPE_SECRET_KEY?.length);

// NÃO CARREGAR dotenv - pode sobrescrever as variáveis
// require('dotenv').config({ path: '../../.env' });
// require('dotenv').config({ path: '.env' });

async function bootstrap() {
  // Verificação final das variáveis
  console.log('🔍 VERIFICAÇÃO FINAL - STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');
  console.log('🔍 VERIFICAÇÃO FINAL - Comprimento:', process.env.STRIPE_SECRET_KEY?.length);
  
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:19006',
      'http://localhost:19000',
      'exp://localhost:19000',
      'exp://localhost:19006',
    ],
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Enhanced API documentation endpoint with HTML interface
  app.use('/api/docs', (req, res) => {
    const endpoints = {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/refresh': 'Refresh token',
        'POST /api/auth/logout': 'Logout user',
        'POST /api/auth/forgot-password': 'Forgot password',
        'POST /api/auth/reset-password': 'Reset password',
      },
      users: {
        'GET /api/users/profile': 'Get user profile',
        'PUT /api/users/profile': 'Update user profile',
        'PUT /api/users/change-password': 'Change password',
        'DELETE /api/users/profile': 'Delete user account',
      },
      services: {
        'GET /api/services': 'Get all services',
        'POST /api/services': 'Create service (PROVIDER only)',
        'GET /api/services/:id': 'Get service by ID',
        'PUT /api/services/:id': 'Update service (PROVIDER only)',
        'DELETE /api/services/:id': 'Delete service (PROVIDER only)',
        'GET /api/services/categories': 'Get service categories',
        'GET /api/services/featured': 'Get featured services',
      },
      bookings: {
        'GET /api/bookings': 'Get user bookings',
        'POST /api/bookings': 'Create booking (CLIENT only)',
        'GET /api/bookings/:id': 'Get booking by ID',
        'PUT /api/bookings/:id/status': 'Update booking status',
        'DELETE /api/bookings/:id': 'Cancel booking',
        'POST /api/bookings/:id/confirm': 'Confirm booking',
        'POST /api/bookings/:id/complete': 'Complete booking',
      },
      chat: {
        'GET /api/chat/bookings/:bookingId/messages': 'Get chat messages',
        'POST /api/chat/messages': 'Send message',
        'DELETE /api/chat/messages/:messageId': 'Delete message',
        'GET /api/chat/chats': 'Get all user chats',
        'WebSocket /socket.io': 'Real-time chat connection',
      },
      reviews: {
        'GET /api/reviews': 'Get reviews',
        'POST /api/reviews': 'Create review (CLIENT only)',
        'PUT /api/reviews/:id': 'Update review',
        'DELETE /api/reviews/:id': 'Delete review',
        'POST /api/reviews/:id/response': 'Respond to review (PROVIDER only)',
        'GET /api/reviews/my/given': 'Get my given reviews',
        'GET /api/reviews/my/received': 'Get my received reviews',
      },
      payments: {
        'POST /api/payments/process': 'Process payment',
        'POST /api/payments/subscription': 'Subscribe to plan',
        'POST /api/payments/refund': 'Request refund',
        'GET /api/payments/history': 'Get payment history',
        'POST /api/payments/webhook/stripe': 'Stripe webhook',
      },
      'payment-methods': {
        'GET /api/payment-methods': 'Get user payment methods',
        'POST /api/payment-methods': 'Add payment method',
        'PUT /api/payment-methods/:id': 'Update payment method',
        'DELETE /api/payment-methods/:id': 'Delete payment method',
        'PUT /api/payment-methods/:id/set-default': 'Set default payment method',
      },
      ads: {
        'GET /api/ads/campaigns': 'Get user ad campaigns',
        'POST /api/ads/campaigns': 'Create ad campaign (PROVIDER only)',
        'PUT /api/ads/campaigns/:id': 'Update ad campaign',
        'POST /api/ads/boost': 'Boost service',
        'GET /api/ads/analytics': 'Get ad analytics',
        'POST /api/ads/leads/purchase': 'Purchase leads',
      },
      plans: {
        'GET /api/plans': 'Get all available plans',
        'GET /api/plans/comparison': 'Compare FREE vs PRO plans',
        'GET /api/plans/:planId': 'Get plan details by ID',
        'GET /api/plans/user/current': 'Get current user plan',
        'GET /api/plans/user/limits': 'Get user lead limits',
        'GET /api/plans/user/rewards': 'Get user conversion rewards',
        'GET /api/plans/user/rotation': 'Get top list rotation schedule',
        'POST /api/plans/upgrade/pro': 'Upgrade to PRO plan (PROVIDER only)',
        'POST /api/plans/downgrade/free': 'Downgrade to FREE plan (PROVIDER only)',
        'GET /api/plans/admin/stats': 'Get admin plan statistics (ADMIN only)',
        'PUT /api/plans/admin/user/:userId/plan/:planId': 'Update user plan (ADMIN only)',
      },
    };

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fixelo API Documentation</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #fafafa;
                color: #333;
                line-height: 1.6;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 0;
                text-align: center;
                margin-bottom: 40px;
                border-radius: 10px;
            }
            
            .header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .info-section {
                background: white;
                padding: 30px;
                border-radius: 10px;
                margin-bottom: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .info-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            
            .info-card h3 {
                color: #667eea;
                margin-bottom: 10px;
            }
            
            .endpoints-section {
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .section-title {
                background: #667eea;
                color: white;
                padding: 20px 30px;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .endpoint-group {
                border-bottom: 1px solid #eee;
            }
            
            .endpoint-group:last-child {
                border-bottom: none;
            }
            
            .group-header {
                background: #f8f9fa;
                padding: 15px 30px;
                font-weight: 600;
                color: #495057;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 1px solid #eee;
            }
            
            .endpoint {
                padding: 15px 30px;
                border-bottom: 1px solid #f1f1f1;
                display: flex;
                align-items: center;
                transition: background-color 0.2s;
            }
            
            .endpoint:hover {
                background: #f8f9fa;
            }
            
            .endpoint:last-child {
                border-bottom: none;
            }
            
            .method {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-right: 15px;
                min-width: 60px;
                text-align: center;
            }
            
            .method.get { background: #61affe; color: white; }
            .method.post { background: #49cc90; color: white; }
            .method.put { background: #fca130; color: white; }
            .method.patch { background: #50e3c2; color: white; }
            .method.delete { background: #f93e3e; color: white; }
            .method.websocket { background: #9c27b0; color: white; }
            
            .endpoint-path {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.9rem;
                color: #495057;
                margin-right: 20px;
                flex: 1;
            }
            
            .endpoint-description {
                color: #6c757d;
                font-size: 0.9rem;
            }
            
            .auth-info {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
            
            .auth-info strong {
                color: #856404;
            }
            
            .roles {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .role {
                background: #667eea;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .container {
                    padding: 10px;
                }
                
                .header h1 {
                    font-size: 2rem;
                }
                
                .endpoint {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .endpoint-path {
                    margin-right: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 Fixelo API</h1>
                <p>Services Marketplace Platform - API Documentation v1.0.0</p>
            </div>
            
            <div class="info-section">
                <div class="info-grid">
                    <div class="info-card">
                        <h3>🌐 Base URL</h3>
                        <p><code>http://localhost:3001/api</code></p>
                    </div>
                    <div class="info-card">
                        <h3>📡 WebSocket</h3>
                        <p><code>ws://localhost:3001/socket.io</code></p>
                    </div>
                    <div class="info-card">
                        <h3>🔒 Authentication</h3>
                        <p>Bearer Token (JWT)</p>
                    </div>
                    <div class="info-card">
                        <h3>🌍 Languages</h3>
                        <p>English, Portuguese, Spanish</p>
                    </div>
                </div>
                
                <div class="auth-info">
                    <strong>🔐 Authentication Required:</strong> Most endpoints require a valid JWT token in the Authorization header: <code>Authorization: Bearer &lt;token&gt;</code>
                    <div class="roles">
                        <span class="role">CLIENT</span>
                        <span class="role">PROVIDER</span>
                        <span class="role">ADMIN</span>
                    </div>
                </div>
            </div>
            
            <div class="endpoints-section">
                <div class="section-title">📚 API Endpoints</div>
                ${Object.entries(endpoints).map(([group, groupEndpoints]) => `
                    <div class="endpoint-group">
                        <div class="group-header">${group}</div>
                        ${Object.entries(groupEndpoints).map(([endpoint, description]) => {
                            const [method, path] = endpoint.split(' ');
                            const methodClass = method.toLowerCase() === 'websocket' ? 'websocket' : method.toLowerCase();
                            return `
                                <div class="endpoint">
                                    <span class="method ${methodClass}">${method}</span>
                                    <span class="endpoint-path">${path}</span>
                                    <span class="endpoint-description">${description}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
  
  await app.listen(3001);
  console.log('🚀 API is running on: http://localhost:3001');
  console.log('📚 API Documentation: http://localhost:3001/api/docs');
}
bootstrap();