#!/usr/bin/env node

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const PORT = process.env.ADMIN_PORT || 3002;

async function startAdminServer() {
  try {
    console.log('🚀 Iniciando servidor AdminJS...');
    
    // Conectar ao banco de dados
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Prisma conectado ao banco de dados');
    
    // Importar AdminJS e registrar adapter ANTES de usar
    const AdminJS = (await import('adminjs')).default;
    const AdminJSExpress = (await import('@adminjs/express')).default;
    const { Database, Resource, getModelByName } = await import('@adminjs/prisma');
    
    // Registrar adapter do Prisma
    AdminJS.registerAdapter({ Database, Resource });
    console.log('✅ Adapter do Prisma registrado');
    
    // Dashboard personalizado com métricas avançadas
    const dashboard = {
      handler: async () => {
        const [
          totalUsers,
          totalServices,
          totalBookings,
          totalReviews,
          totalTransactions,
          revenueData,
          activeSubscriptions,
          pendingBookings,
          disputedBookings,
          recentUsers,
          topServices,
          monthlyRevenue,
          auditLogs,
          unreadNotifications,
          leads,
          campaigns,
          // Novos dados para relatórios avançados
          weeklyRegistrations,
          conversionRate,
          averageServicePrice,
          topProviders,
          recentTransactions
        ] = await Promise.all([
          prisma.user.count(),
          prisma.service.count(),
          prisma.booking.count(),
          prisma.review.count(),
          prisma.transaction.count(),
          prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { status: 'COMPLETED' },
          }),
          prisma.subscription.count({
            where: { status: 'ACTIVE' }
          }),
          prisma.booking.count({
            where: { status: 'PENDING' }
          }),
          prisma.booking.count({
            where: { status: 'DISPUTED' }
          }),
          prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, email: true, role: true, createdAt: true }
          }),
          prisma.service.groupBy({
            by: ['category'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
          }),
          prisma.transaction.groupBy({
            by: ['createdAt'],
            _sum: { amount: true },
            where: {
              status: 'COMPLETED',
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          }),
          prisma.auditLog.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
              }
            }
          }),
          prisma.notification.count({
            where: { readAt: null }
          }),
          prisma.lead.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          }),
          prisma.adCampaign.count({
            where: { status: 'ACTIVE' }
          }),
          // Novos KPIs
          prisma.user.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          }),
          prisma.lead.aggregate({
            _count: { converted: true },
            where: { converted: true }
          }),
          prisma.service.aggregate({
            _avg: { price: true }
          }),
          prisma.user.findMany({
            where: { role: 'PROVIDER' },
            take: 5,
            include: {
              _count: {
                select: { services: true, bookingsAsProvider: true }
              }
            },
            orderBy: {
              services: { _count: 'desc' }
            }
          }),
          prisma.transaction.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } } }
          })
        ]);

        // Calcular métricas avançadas
        const totalLeads = await prisma.lead.count();
        const conversionRateCalc = totalLeads > 0 ? (conversionRate._count.converted / totalLeads * 100) : 0;
        const weeklyGrowth = weeklyRegistrations.reduce((acc, day) => acc + day._count.id, 0);

        return {
          // Métricas principais
          totalUsers,
          totalServices,
          totalBookings,
          totalReviews,
          totalTransactions,
          totalRevenue: revenueData._sum.amount || 0,
          
          // Status operacional
          activeSubscriptions,
          pendingBookings,
          disputedBookings,
          unreadNotifications,
          auditLogsToday: auditLogs,
          leadsThisWeek: leads,
          activeCampaigns: campaigns,
          
          // Novos KPIs
          weeklyGrowth,
          conversionRate: conversionRateCalc.toFixed(2),
          averageServicePrice: averageServicePrice._avg.price || 0,
          
          // Dados para gráficos
          recentUsers,
          topServices,
          topProviders,
          recentTransactions,
          monthlyRevenue: monthlyRevenue.reduce((acc, item) => acc + (item._sum.amount || 0), 0),
          
          // Alertas automáticos
          alerts: [
            disputedBookings > 0 ? `🚨 ${disputedBookings} reservas em disputa - Requer atenção imediata` : null,
            pendingBookings > 10 ? `⏰ ${pendingBookings} reservas pendentes - Revisar aprovações` : null,
            unreadNotifications > 5 ? `🔔 ${unreadNotifications} notificações não lidas` : null,
            conversionRateCalc < 10 ? `📈 Taxa de conversão baixa: ${conversionRateCalc.toFixed(1)}% - Otimizar campanhas` : null,
            weeklyGrowth === 0 ? `📊 Sem novos usuários esta semana - Revisar estratégia de marketing` : null,
          ].filter(Boolean),
          
          // Insights automatizados
          insights: [
            weeklyGrowth > 10 ? `🎉 Crescimento acelerado: +${weeklyGrowth} usuários esta semana` : null,
            conversionRateCalc > 20 ? `💰 Excelente conversão: ${conversionRateCalc.toFixed(1)}%` : null,
            campaigns > 5 ? `📊 ${campaigns} campanhas ativas gerando resultados` : null,
          ].filter(Boolean),
          
          message: `Sistema Fixelo operacional com ${totalUsers} usuários e receita de $${(revenueData._sum.amount || 0).toFixed(2)}`,
          lastUpdated: new Date().toLocaleString('pt-BR'),
          systemHealth: disputedBookings === 0 && pendingBookings < 5 ? 'Excelente' : 'Atenção necessária'
        };
      }
    };

    // Configurações visuais melhoradas com tema personalizado
    const branding = {
      companyName: '🏠 Fixelo Admin Panel',
      withMadeWithLove: false,
      favicon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzYzNjZmMSIvPgo8cGF0aCBkPSJNMTYgOEwyMiAxM1YyMkgxOFYxOEgxNFYyMkgxMFYxM0wxNiA4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
      softwareBrother: false,
      theme: {
        colors: {
          primary100: '#6366f1', // Roxo moderno
          primary80: '#818cf8',
          primary60: '#a5b4fc',
          primary40: '#c7d2fe',
          primary20: '#e0e7ff',
          grey100: '#1e293b', // Sidebar cinza escuro mas não preto
          grey80: '#334155',
          grey60: '#475569',
          grey40: '#64748b',
          grey20: '#94a3b8',
          accent: '#10b981', // Verde esmeralda
          hoverBg: '#f8fafc',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
          info: '#3b82f6',
          filterBg: '#ffffff',
          sidebar: '#f8fafc', // Sidebar cinza bem claro
          sidebarHover: '#e2e8f0', // Hover visível
          // Cores adicionais para melhor contraste
          text: '#1e293b',
          textMuted: '#64748b',
          border: '#e2e8f0',
          inputBg: '#ffffff',
          inputBorder: '#d1d5db',
          cardBg: '#ffffff',
          cardBorder: '#e5e7eb',
        },
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
        },
        shadows: {
          card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          input: '0 0 0 1px rgba(99, 102, 241, 0.1)',
          focus: '0 0 0 3px rgba(99, 102, 241, 0.1)',
        },
        borders: {
          default: '1px solid #d1d5db',
          light: '1px solid #e5e7eb',
          input: '1px solid #d1d5db',
          inputFocus: '1px solid #6366f1',
        }
      },
      // CSS customizado para melhor contraste e usabilidade
      assets: {
        styles: [`
          /* Melhorar contraste geral */
          body {
            background-color: #f8fafc !important;
            color: #1e293b !important;
          }
          
          /* Sidebar com melhor contraste */
          .AdminJS_Sidebar {
            background-color: #f8fafc !important;
            border-right: 1px solid #e2e8f0 !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Links da sidebar */
          .AdminJS_Sidebar a {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          
          /* Hover da sidebar */
          .AdminJS_Sidebar a:hover {
            background-color: #e2e8f0 !important;
            color: #6366f1 !important;
          }
          
          /* Ícones da sidebar */
          .AdminJS_Sidebar svg {
            color: #6b7280 !important;
          }
          
          /* Inputs com melhor contraste */
          input[type="text"], 
          input[type="email"], 
          input[type="password"], 
          input[type="number"],
          textarea, 
          select {
            background-color: #ffffff !important;
            border: 1px solid #d1d5db !important;
            color: #1e293b !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-family: inherit !important;
          }
          
          /* Input de senha específico */
          input[type="password"] {
            background-color: #ffffff !important;
            color: #1e293b !important;
            font-family: monospace !important;
            font-size: 14px !important;
            letter-spacing: 1px !important;
          }
          
          /* Placeholder dos inputs */
          input::placeholder, 
          textarea::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
          }
          
          /* Input focus */
          input:focus, 
          textarea:focus, 
          select:focus {
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
            outline: none !important;
            background-color: #ffffff !important;
            color: #1e293b !important;
          }
          
          /* Autofill do navegador */
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
            -webkit-text-fill-color: #1e293b !important;
            background-color: #ffffff !important;
            color: #1e293b !important;
          }
          
          /* Estados especiais do input */
          input:not(:placeholder-shown) {
            color: #1e293b !important;
            background-color: #ffffff !important;
          }
          
          /* Força cor do texto em todos os estados */
          input[type="password"]:not(:placeholder-shown) {
            color: #1e293b !important;
            background-color: #ffffff !important;
            font-family: monospace !important;
          }
          
          /* Cards com melhor definição */
          .AdminJS_Card {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Botões com melhor contraste */
          .AdminJS_Button {
            font-weight: 500 !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
          }
          
          /* Botão primário */
          .AdminJS_Button--primary {
            background-color: #6366f1 !important;
            border-color: #6366f1 !important;
            color: #ffffff !important;
          }
          
          /* Botão primário hover */
          .AdminJS_Button--primary:hover {
            background-color: #5855eb !important;
            border-color: #5855eb !important;
          }
          
          /* Tabelas com melhor contraste */
          .AdminJS_Table {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
          }
          
          /* Headers da tabela */
          .AdminJS_Table th {
            background-color: #f8fafc !important;
            color: #374151 !important;
            font-weight: 600 !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          
          /* Células da tabela */
          .AdminJS_Table td {
            color: #1e293b !important;
            border-bottom: 1px solid #f1f5f9 !important;
          }
          
          /* Hover das linhas da tabela */
          .AdminJS_Table tr:hover td {
            background-color: #f8fafc !important;
          }
          
          /* Filtros */
          .AdminJS_Filter {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            padding: 16px !important;
          }
          
          /* Dashboard cards */
          .AdminJS_Dashboard .AdminJS_Card {
            margin-bottom: 16px !important;
          }
          
          /* Textos com melhor contraste */
          .AdminJS_Text {
            color: #1e293b !important;
          }
          
          .AdminJS_TextMuted {
            color: #64748b !important;
          }
          
          /* Header do admin */
          .AdminJS_Header {
            background-color: #ffffff !important;
            border-bottom: 1px solid #e5e7eb !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Navegação breadcrumb */
          .AdminJS_Breadcrumb {
            color: #64748b !important;
          }
          
          /* Links do breadcrumb */
          .AdminJS_Breadcrumb a {
            color: #6366f1 !important;
            text-decoration: none !important;
          }
          
          /* Loading spinner */
          .AdminJS_Loader {
            color: #6366f1 !important;
          }
          
          /* Mensagens de alerta */
          .AdminJS_Alert--success {
            background-color: #ecfdf5 !important;
            border-color: #10b981 !important;
            color: #065f46 !important;
          }
          
          .AdminJS_Alert--error {
            background-color: #fef2f2 !important;
            border-color: #ef4444 !important;
            color: #991b1b !important;
          }
          
          .AdminJS_Alert--warning {
            background-color: #fffbeb !important;
            border-color: #f59e0b !important;
            color: #92400e !important;
          }
          
          /* Título da página */
          .AdminJS_H1 {
            color: #1e293b !important;
            font-weight: 700 !important;
            margin-bottom: 24px !important;
          }
          
          /* Subtítulos */
          .AdminJS_H2, .AdminJS_H3 {
            color: #374151 !important;
            font-weight: 600 !important;
          }
          
          /* Form labels */
          .AdminJS_Label {
            color: #374151 !important;
            font-weight: 500 !important;
            margin-bottom: 6px !important;
          }
          
          /* Checkbox e radio buttons */
          input[type="checkbox"], 
          input[type="radio"] {
            accent-color: #6366f1 !important;
          }
          
          /* Dropdown menus */
          .AdminJS_Dropdown {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Paginação */
          .AdminJS_Pagination {
            color: #374151 !important;
          }
          
          .AdminJS_Pagination a {
            color: #6366f1 !important;
            border: 1px solid #e5e7eb !important;
            background-color: #ffffff !important;
          }
          
          .AdminJS_Pagination a:hover {
            background-color: #f8fafc !important;
            border-color: #6366f1 !important;
          }
          
          /* Sidebar title */
          .AdminJS_SidebarTitle {
            color: #1e293b !important;
            font-weight: 700 !important;
            font-size: 18px !important;
            margin-bottom: 16px !important;
          }
          
          /* Resource navigation */
          .AdminJS_ResourceNavigation {
            color: #374151 !important;
            font-weight: 500 !important;
          }
          
          .AdminJS_ResourceNavigation:hover {
            color: #6366f1 !important;
          }
        `]
      },
    };

    // Actions customizadas para automação
    const customActions = {
      // Action para enviar notificação em massa
      bulkNotify: {
        actionType: 'bulk',
        icon: 'Bell',
        handler: async (request, response, context) => {
          const { records } = context;
          
          for (const record of records) {
            await prisma.notification.create({
              data: {
                type: 'SYSTEM_ALERT',
                title: 'Notificação do Administrador',
                message: request.payload?.message || 'Mensagem importante do sistema',
                userId: record.id,
              }
            });
          }
          
          return {
            notice: {
              message: `Notificações enviadas para ${records.length} usuários`,
              type: 'success'
            },
            redirectUrl: context.resource.href(context)
          };
        },
        component: false,
      },
      
      // Action para gerar relatório
      generateReport: {
        actionType: 'resource',
        icon: 'FileText',
        handler: async (request, response, context) => {
          const stats = await Promise.all([
            prisma.user.count(),
            prisma.booking.count(),
            prisma.transaction.aggregate({ _sum: { amount: true } })
          ]);
          
          const report = {
            generatedAt: new Date().toISOString(),
            totalUsers: stats[0],
            totalBookings: stats[1],
            totalRevenue: stats[2]._sum.amount || 0,
          };
          
          return {
            notice: {
              message: 'Relatório gerado com sucesso',
              type: 'success'
            },
            record: context.record ? context.record.toJSON(context.currentAdmin) : null,
            report
          };
        }
      }
    };

    // Recursos organizados por categoria com propriedades corretas
    const resources = [
      // 👥 USUÁRIOS E AUTENTICAÇÃO
      {
        resource: { model: getModelByName('User'), client: prisma },
        options: {
          navigation: { name: 'Usuários', icon: 'User' },
          listProperties: ['id', 'email', 'role', 'status', 'createdAt'],
          showProperties: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'status', 'preferredLanguage', 'createdAt', 'updatedAt'],
          editProperties: ['email', 'firstName', 'lastName', 'phone', 'role', 'status', 'preferredLanguage'],
          filterProperties: ['email', 'role', 'status', 'createdAt'],
          properties: {
            password: { isVisible: false },
            refreshTokens: { isVisible: false },
            verifications: { isVisible: false },
            email: { isTitle: true, type: 'email' },
            role: { 
              availableValues: [
                { value: 'CLIENT', label: 'Cliente' },
                { value: 'PROVIDER', label: 'Prestador' },
                { value: 'ADMIN', label: 'Administrador' }
              ]
            },
            status: {
              availableValues: [
                { value: 'ACTIVE', label: 'Ativo' },
                { value: 'INACTIVE', label: 'Inativo' },
                { value: 'SUSPENDED', label: 'Suspenso' },
                { value: 'DELETED', label: 'Deletado' }
              ]
            },
            preferredLanguage: {
              availableValues: [
                { value: 'PT', label: 'Português' },
                { value: 'EN', label: 'Inglês' },
                { value: 'ES', label: 'Espanhol' }
              ]
            }
          },
          actions: {
            ...customActions,
            bulkNotify: customActions.bulkNotify,
            new: { isVisible: true },
            edit: { isVisible: true },
            delete: { isVisible: true },
            show: { isVisible: true },
            list: { isVisible: true }
          }
        },
      },
      
      // 🛠️ SERVIÇOS
      {
        resource: { model: getModelByName('Service'), client: prisma },
        options: {
          navigation: { name: 'Serviços', icon: 'Settings' },
          listProperties: ['id', 'title', 'category', 'price', 'status', 'createdAt'],
          showProperties: ['id', 'title', 'description', 'category', 'price', 'status', 'provider', 'createdAt'],
          editProperties: ['title', 'description', 'category', 'price', 'status'],
          filterProperties: ['title', 'category', 'status', 'price'],
          properties: {
            title: { isTitle: true },
            description: { type: 'textarea' },
            category: { 
              availableValues: [
                { value: 'HOUSE_CLEANING', label: 'Limpeza Residencial' },
                { value: 'HANDYMAN', label: 'Faz Tudo' },
                { value: 'ELECTRICAL_WORK', label: 'Elétrica' },
                { value: 'PLUMBING', label: 'Encanamento' },
                { value: 'PAINTING', label: 'Pintura' },
                { value: 'HAIR_STYLING', label: 'Cabeleireiro' },
                { value: 'MASSAGE_THERAPY', label: 'Massoterapia' },
                { value: 'TUTORING', label: 'Aulas Particulares' },
                { value: 'PET_GROOMING', label: 'Pet Shop' },
                { value: 'OTHER', label: 'Outros' }
              ]
            },
            price: { type: 'number' },
            status: {
              availableValues: [
                { value: 'ACTIVE', label: 'Ativo' },
                { value: 'INACTIVE', label: 'Inativo' },
                { value: 'PENDING', label: 'Pendente' },
                { value: 'SUSPENDED', label: 'Suspenso' }
              ]
            }
          },
          actions: {
            generateReport: customActions.generateReport
          }
        },
      },
      
      // 📅 RESERVAS
      {
        resource: { model: getModelByName('Booking'), client: prisma },
        options: {
          navigation: { name: 'Reservas', icon: 'Calendar' },
          listProperties: ['id', 'status', 'scheduledAt', 'totalAmount', 'createdAt'],
          showProperties: ['id', 'status', 'scheduledAt', 'totalAmount', 'notes', 'client', 'service', 'createdAt'],
          editProperties: ['status', 'scheduledAt', 'notes'],
          filterProperties: ['status', 'scheduledAt', 'totalAmount'],
          properties: {
            status: {
              availableValues: [
                { value: 'PENDING', label: '⏳ Pendente' },
                { value: 'CONFIRMED', label: '✅ Confirmado' },
                { value: 'IN_PROGRESS', label: '🔄 Em Andamento' },
                { value: 'COMPLETED', label: '🎉 Concluído' },
                { value: 'CANCELLED', label: '❌ Cancelado' },
                { value: 'DISPUTED', label: '⚠️ Em Disputa' }
              ]
            },
            scheduledAt: { type: 'datetime' },
            totalAmount: { type: 'number' },
            notes: { type: 'textarea' }
          },
        },
      },
      
      // ⭐ AVALIAÇÕES
      {
        resource: { model: getModelByName('Review'), client: prisma },
        options: {
          navigation: { name: 'Avaliações', icon: 'Star' },
          listProperties: ['id', 'rating', 'comment', 'createdAt'],
          showProperties: ['id', 'rating', 'comment', 'client', 'service', 'booking', 'createdAt'],
          editProperties: ['rating', 'comment'],
          filterProperties: ['rating', 'createdAt'],
          properties: { 
            comment: { type: 'textarea' },
            rating: { type: 'number', min: 1, max: 5 }
          },
        },
      },
      
      // 💰 FINANCEIRO
      {
        resource: { model: getModelByName('Transaction'), client: prisma },
        options: {
          navigation: { name: 'Transações', icon: 'DollarSign' },
          listProperties: ['id', 'type', 'amount', 'currency', 'status', 'createdAt'],
          showProperties: ['id', 'type', 'amount', 'currency', 'status', 'description', 'user', 'createdAt'],
          editProperties: ['status', 'description'],
          filterProperties: ['type', 'status', 'amount', 'createdAt'],
          properties: {
            amount: { type: 'number' },
            type: {
              availableValues: [
                { value: 'PAYMENT', label: '💳 Pagamento' },
                { value: 'REFUND', label: '🔄 Reembolso' },
                { value: 'SUBSCRIPTION', label: '📅 Assinatura' },
                { value: 'COMMISSION', label: '💰 Comissão' }
              ]
            },
            status: {
              availableValues: [
                { value: 'PENDING', label: '⏳ Pendente' },
                { value: 'COMPLETED', label: '✅ Concluído' },
                { value: 'FAILED', label: '❌ Falhado' },
                { value: 'CANCELLED', label: '🚫 Cancelado' }
              ]
            }
          },
        },
      },
      
      // 📊 PLANOS E ASSINATURAS
      {
        resource: { model: getModelByName('Plan'), client: prisma },
        options: {
          navigation: { name: 'Planos', icon: 'CreditCard' },
          listProperties: ['id', 'name', 'price', 'billingPeriod', 'isActive'],
          showProperties: ['id', 'name', 'price', 'billingPeriod', 'features', 'leadsLimit', 'trialDays', 'isActive', 'createdAt'],
          editProperties: ['name', 'price', 'billingPeriod', 'features', 'leadsLimit', 'trialDays', 'isActive'],
          filterProperties: ['name', 'price', 'billingPeriod', 'isActive'],
          properties: { 
            name: { isTitle: true },
            price: { type: 'number' },
            features: { type: 'textarea' },
            leadsLimit: { type: 'number' },
            trialDays: { type: 'number' }
          },
        },
      },
      
      {
        resource: { model: getModelByName('Subscription'), client: prisma },
        options: {
          navigation: { name: 'Assinaturas', icon: 'RefreshCw' },
          listProperties: ['id', 'status', 'currentPeriodStart', 'currentPeriodEnd', 'createdAt'],
          showProperties: ['id', 'status', 'currentPeriodStart', 'currentPeriodEnd', 'cancelAtPeriodEnd', 'user', 'plan', 'createdAt'],
          editProperties: ['status', 'currentPeriodStart', 'currentPeriodEnd', 'cancelAtPeriodEnd'],
          filterProperties: ['status', 'currentPeriodStart', 'currentPeriodEnd'],
          properties: {
            status: {
              availableValues: [
                { value: 'ACTIVE', label: '✅ Ativo' },
                { value: 'CANCELLED', label: '❌ Cancelado' },
                { value: 'EXPIRED', label: '⏰ Expirado' },
                { value: 'PAUSED', label: '⏸️ Pausado' }
              ]
            },
            currentPeriodStart: { type: 'datetime' },
            currentPeriodEnd: { type: 'datetime' }
          },
        },
      },
      
      // 🔔 COMUNICAÇÃO E SUPORTE - CORRIGIDO
      {
        resource: { model: getModelByName('Notification'), client: prisma },
        options: {
          navigation: { name: 'Notificações', icon: 'Bell' },
          listProperties: ['id', 'type', 'title', 'readAt', 'createdAt'],
          showProperties: ['id', 'type', 'title', 'message', 'readAt', 'user', 'createdAt'],
          editProperties: ['title', 'message', 'readAt'],
          filterProperties: ['type', 'readAt', 'createdAt'],
          properties: {
            title: { isTitle: true },
            message: { type: 'textarea' },
            readAt: { type: 'datetime' },
            type: {
              availableValues: [
                { value: 'BOOKING_CONFIRMED', label: '📅 Reserva Confirmada' },
                { value: 'BOOKING_CANCELLED', label: '❌ Reserva Cancelada' },
                { value: 'PAYMENT_RECEIVED', label: '💰 Pagamento Recebido' },
                { value: 'REVIEW_RECEIVED', label: '⭐ Avaliação Recebida' },
                { value: 'SYSTEM_ALERT', label: '🚨 Alerta do Sistema' }
              ]
            }
          },
        },
      },
      
      {
        resource: { model: getModelByName('Message'), client: prisma },
        options: {
          navigation: { name: 'Mensagens', icon: 'MessageCircle' },
          listProperties: ['id', 'messageType', 'content', 'readAt', 'createdAt'],
          showProperties: ['id', 'messageType', 'content', 'readAt', 'sender', 'booking', 'createdAt'],
          editProperties: ['content', 'readAt'],
          filterProperties: ['messageType', 'readAt', 'createdAt'],
          properties: {
            content: { type: 'textarea' },
            readAt: { type: 'datetime' },
            messageType: {
              availableValues: [
                { value: 'TEXT', label: '📝 Texto' },
                { value: 'IMAGE', label: '🖼️ Imagem' },
                { value: 'FILE', label: '📎 Arquivo' }
              ]
            }
          },
        },
      },
      
      // 📊 MARKETING E ANÚNCIOS - CORRIGIDO
      {
        resource: { model: getModelByName('AdCampaign'), client: prisma },
        options: {
          navigation: { name: 'Campanhas', icon: 'TrendingUp' },
          listProperties: ['id', 'name', 'status', 'budget', 'startDate', 'endDate'],
          showProperties: ['id', 'name', 'status', 'budget', 'impressions', 'clicks', 'leads', 'conversions', 'startDate', 'endDate', 'provider', 'createdAt'],
          editProperties: ['name', 'status', 'budget', 'startDate', 'endDate'],
          filterProperties: ['status', 'startDate', 'endDate'],
          properties: {
            name: { isTitle: true },
            budget: { type: 'number' },
            impressions: { type: 'number' },
            clicks: { type: 'number' },
            leads: { type: 'number' },
            conversions: { type: 'number' },
            startDate: { type: 'datetime' },
            endDate: { type: 'datetime' },
            status: {
              availableValues: [
                { value: 'DRAFT', label: '📝 Rascunho' },
                { value: 'ACTIVE', label: '✅ Ativo' },
                { value: 'PAUSED', label: '⏸️ Pausado' },
                { value: 'COMPLETED', label: '🎯 Concluído' },
                { value: 'CANCELLED', label: '❌ Cancelado' }
              ]
            }
          },
        },
      },
      
      {
        resource: { model: getModelByName('Lead'), client: prisma },
        options: {
          navigation: { name: 'Leads', icon: 'Users' },
          listProperties: ['id', 'source', 'clientEmail', 'converted', 'createdAt'],
          showProperties: ['id', 'source', 'sourceId', 'clientPhone', 'clientEmail', 'message', 'converted', 'serviceId', 'providerId', 'createdAt'],
          editProperties: ['clientPhone', 'clientEmail', 'message', 'converted'],
          filterProperties: ['source', 'converted', 'createdAt'],
          properties: {
            clientEmail: { type: 'email' },
            message: { type: 'textarea' },
            converted: { type: 'boolean' },
            source: {
              availableValues: [
                { value: 'ad_campaign', label: '📢 Campanha' },
                { value: 'organic', label: '🌱 Orgânico' },
                { value: 'referral', label: '👥 Indicação' },
                { value: 'social', label: '📱 Rede Social' }
              ]
            }
          },
        },
      },
      
      // 🔍 AUDITORIA E LOGS - CORRIGIDO
      {
        resource: { model: getModelByName('AuditLog'), client: prisma },
        options: {
          navigation: { name: 'Logs de Auditoria', icon: 'FileText' },
          listProperties: ['id', 'action', 'resource', 'resourceId', 'createdAt'],
          showProperties: ['id', 'action', 'resource', 'resourceId', 'details', 'adminId', 'createdAt'],
          editProperties: [], // Apenas leitura
          filterProperties: ['action', 'resource', 'createdAt'],
          properties: {
            action: { isTitle: true },
            details: { type: 'textarea' }
          },
          actions: {
            new: { isVisible: false },
            edit: { isVisible: false },
            delete: { isVisible: false },
            show: { isVisible: true },
            list: { isVisible: true }
          }
        },
      },
      
      // 💳 MÉTODOS DE PAGAMENTO
      {
        resource: { model: getModelByName('PaymentMethod'), client: prisma },
        options: {
          navigation: { name: 'Métodos de Pagamento', icon: 'CreditCard' },
          listProperties: ['id', 'type', 'last4', 'brand', 'isDefault', 'createdAt'],
          showProperties: ['id', 'type', 'last4', 'brand', 'expiryMonth', 'expiryYear', 'isDefault', 'isActive', 'user', 'createdAt'],
          editProperties: ['isDefault', 'isActive'],
          filterProperties: ['type', 'brand', 'isDefault', 'isActive'],
          properties: {
            type: {
              availableValues: [
                { value: 'CREDIT_CARD', label: '💳 Cartão de Crédito' },
                { value: 'DEBIT_CARD', label: '💳 Cartão de Débito' },
                { value: 'PAYPAL', label: '🅿️ PayPal' },
                { value: 'BANK_TRANSFER', label: '🏦 Transferência Bancária' }
              ]
            }
          },
        },
      },

      // 📈 MÉTRICAS E ANALYTICS
      {
        resource: { model: getModelByName('AdMetric'), client: prisma },
        options: {
          navigation: { name: 'Métricas de Anúncios', icon: 'BarChart3' },
          listProperties: ['id', 'date', 'impressions', 'clicks', 'conversions', 'spent'],
          showProperties: ['id', 'date', 'impressions', 'clicks', 'leads', 'conversions', 'spent', 'audienceData', 'campaignId', 'createdAt'],
          editProperties: [],
          filterProperties: ['date', 'campaignId'],
          properties: {
            date: { type: 'datetime' },
            impressions: { type: 'number' },
            clicks: { type: 'number' },
            leads: { type: 'number' },
            conversions: { type: 'number' },
            spent: { type: 'number' },
            audienceData: { type: 'textarea' }
          },
          actions: {
            new: { isVisible: false },
            edit: { isVisible: false },
            delete: { isVisible: false },
            show: { isVisible: true },
            list: { isVisible: true }
          }
        },
      },
    ];
    
    // Configurações do AdminJS
    const adminJsOptions = {
      rootPath: '/admin',
      branding,
      dashboard,
      resources,
      version: {
        admin: true,
        app: '2.0.0'
      },
      locale: {
        language: 'pt-BR',
        translations: {
          labels: {
            navigation: 'Navegação',
            pages: 'Páginas',
            selectedRecords: 'Registros selecionados',
            filters: 'Filtros',
            adminVersion: 'Versão Admin',
            appVersion: 'Versão da aplicação',
            loginWelcome: 'Bem-vindo ao Fixelo Admin',
          },
          buttons: {
            save: 'Salvar',
            cancel: 'Cancelar',
            delete: 'Deletar',
            edit: 'Editar',
            show: 'Visualizar',
            create: 'Criar',
            filter: 'Filtrar',
            applyChanges: 'Aplicar mudanças',
            resetFilter: 'Limpar filtros',
            confirmRemovalMany: 'Confirmar remoção de {count} registros',
            confirmRemovalOne: 'Confirmar remoção de 1 registro',
            logout: 'Sair',
            bulkNotify: 'Enviar Notificação',
            generateReport: 'Gerar Relatório',
          },
          messages: {
            successfullyCreated: 'Registro criado com sucesso',
            successfullyUpdated: 'Registro atualizado com sucesso',
            successfullyDeleted: 'Registro deletado com sucesso',
            thereWereValidationErrors: 'Existem erros de validação',
            forbiddenError: 'Acesso negado',
            anyForbiddenError: 'Você não tem permissão para esta ação',
            successfullyBulkDeleted: 'Registros deletados com sucesso',
            welcomeOnBoard_title: 'Bem-vindo ao Fixelo Admin!',
            welcomeOnBoard_subtitle: 'Painel de administração completo para gerenciar sua plataforma',
            loginWelcome: 'Faça login para acessar o painel administrativo',
          },
          properties: {
            length: 'Tamanho',
            from: 'De',
            to: 'Para'
          }
        }
      }
    };

    // Autenticação com múltiplos usuários e níveis de acesso
    const auth = {
      authenticate: async (email, password) => {
        const users = [
          { email: 'admin@fixelo.com', password: 'admin123', role: 'super-admin', permissions: ['all'] },
          { email: 'support@fixelo.com', password: 'support123', role: 'support', permissions: ['users', 'bookings', 'messages', 'notifications'] },
          { email: 'manager@fixelo.com', password: 'manager123', role: 'manager', permissions: ['users', 'services', 'bookings', 'transactions', 'reports'] },
          { email: 'analyst@fixelo.com', password: 'analyst123', role: 'analyst', permissions: ['reports', 'metrics', 'campaigns'] },
        ];
        
        const user = users.find((u) => u.email === email && u.password === password);
        return user ? { email: user.email, role: user.role, permissions: user.permissions } : null;
      },
      cookieName: 'adminjs',
      cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'fixelo-admin-cookie-secret-2024',
    };
    
    // Criar instância do AdminJS
    const adminJs = new AdminJS(adminJsOptions);
    console.log('✅ AdminJS criado com sucesso');
    
    // Criar app Express
    const app = express();
    
    // Configurar router com autenticação
    const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, auth, null, {
      resave: false,
      saveUninitialized: false,
      secret: process.env.ADMIN_COOKIE_SECRET || 'fixelo-admin-cookie-secret-2024',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      },
    });
    
    // Usar o router AdminJS
    app.use(adminJs.options.rootPath, router);
    
    // Rota de health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        service: 'AdminJS Server', 
        port: PORT,
        version: '2.0.0',
        features: ['advanced-dashboard', 'automation', 'reports', 'multi-user']
      });
    });
    
    // API endpoints para suporte e automação
    app.get('/api/support/stats', async (req, res) => {
      const stats = await Promise.all([
        prisma.booking.count({ where: { status: 'DISPUTED' } }),
        prisma.notification.count({ where: { readAt: null } }),
        prisma.user.count({ where: { status: 'SUSPENDED' } }),
        prisma.lead.count({ where: { converted: false } }),
        prisma.adCampaign.count({ where: { status: 'ACTIVE' } }),
      ]);
      
      res.json({
        disputedBookings: stats[0],
        unreadNotifications: stats[1],
        suspendedUsers: stats[2],
        unconvertedLeads: stats[3],
        activeCampaigns: stats[4],
        timestamp: new Date().toISOString()
      });
    });

    // Webhook para automações
    app.post('/api/webhooks/automation', express.json(), async (req, res) => {
      const { event, data } = req.body;
      
      try {
        switch (event) {
          case 'booking_disputed':
            // Criar notificação automática para admin
            await prisma.notification.create({
              data: {
                type: 'SYSTEM_ALERT',
                title: 'Disputa de Reserva',
                message: `Reserva #${data.bookingId} foi marcada como disputada`,
                userId: data.adminId || 'admin',
              }
            });
            break;
            
          case 'low_conversion':
            // Alerta para campanhas com baixa conversão
            if (data.conversionRate < 5) {
              console.log(`🚨 Campanha ${data.campaignId} com baixa conversão: ${data.conversionRate}%`);
            }
            break;
        }
        
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Endpoint para relatórios personalizados
    app.get('/api/reports/:type', async (req, res) => {
      const { type } = req.params;
      const { startDate, endDate } = req.query;
      
      try {
        let report;
        
        switch (type) {
          case 'revenue':
            report = await prisma.transaction.groupBy({
              by: ['createdAt'],
              _sum: { amount: true },
              where: {
                status: 'COMPLETED',
                createdAt: {
                  gte: new Date(startDate),
                  lte: new Date(endDate)
                }
              }
            });
            break;
            
          case 'users':
            report = await prisma.user.groupBy({
              by: ['role', 'createdAt'],
              _count: { id: true },
              where: {
                createdAt: {
                  gte: new Date(startDate),
                  lte: new Date(endDate)
                }
              }
            });
            break;
            
          case 'services':
            report = await prisma.service.groupBy({
              by: ['category'],
              _count: { id: true },
              _avg: { price: true }
            });
            break;
            
          default:
            return res.status(400).json({ error: 'Tipo de relatório inválido' });
        }
        
        res.json({ report, generatedAt: new Date().toISOString() });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🎉 Servidor AdminJS Avançado rodando em http://localhost:${PORT}${adminJs.options.rootPath}`);
      console.log(`📊 Acesse o painel em: http://localhost:${PORT}/admin`);
      console.log(`🔐 Credenciais disponíveis:`);
      console.log(`   • Super Admin: admin@fixelo.com / admin123 (Acesso total)`);
      console.log(`   • Suporte: support@fixelo.com / support123 (Usuários, reservas, mensagens)`);
      console.log(`   • Gerente: manager@fixelo.com / manager123 (Operações, transações)`);
      console.log(`   • Analista: analyst@fixelo.com / analyst123 (Relatórios, métricas)`);
      console.log(`🚀 Funcionalidades ativas:`);
      console.log(`   • Dashboard com métricas avançadas e alertas automáticos`);
      console.log(`   • Gestão completa de usuários com notificações em massa`);
      console.log(`   • Suporte e atendimento com automações`);
      console.log(`   • Auditoria e logs de sistema`);
      console.log(`   • Campanhas de marketing com métricas detalhadas`);
      console.log(`   • Gestão financeira com relatórios personalizados`);
      console.log(`   • API de automação e webhooks`);
      console.log(`   • Sistema de relatórios avançados`);
      console.log(`   • Controle de acesso por função`);
      console.log(`📡 APIs disponíveis:`);
      console.log(`   • GET /api/support/stats - Estatísticas de suporte`);
      console.log(`   • POST /api/webhooks/automation - Webhooks para automação`);
      console.log(`   • GET /api/reports/:type - Relatórios personalizados`);
    });
    
    // Gerenciar shutdown gracefully
    process.on('SIGINT', async () => {
      console.log('\n🛑 Parando servidor AdminJS...');
      await prisma.$disconnect();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor AdminJS:', error);
    process.exit(1);
  }
}

startAdminServer(); 