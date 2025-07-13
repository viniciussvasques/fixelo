'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, MapPin, Clock, TrendingUp, Star } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Service } from '@/types/api';
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store';

export default function ServicesPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalViews: 0,
    totalBookings: 0,
  });

  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadServices();
      loadStats();
    }
  }, [authLoading, isAuthenticated]);

  // Recarregar quando a página ficar visível (usuário volta da criação)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        loadServices();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProviderServices();
      console.log('📋 Services API Response:', response);
      
      // A API retorna { services: [...], total: x, page: y, limit: z }
      let servicesData = [];
      if (response.data) {
        if ((response.data as any).services && Array.isArray((response.data as any).services)) {
          servicesData = (response.data as any).services;
        } else if (Array.isArray((response.data as any).data)) {
          servicesData = (response.data as any).data;
        } else if (Array.isArray(response.data)) {
          servicesData = response.data;
        }
      }
      
      console.log('📋 Services Data:', servicesData);
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load services:', error);
      setServices([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.getProviderStats();
      console.log('📊 Stats API Response:', response);
      
      // Garantir que stats seja um objeto válido
      let statsData = {
        totalServices: 0,
        activeServices: 0,
        totalViews: 0,
        totalBookings: 0,
      };
      
      if (response.data) {
        // Mapear os dados da API para o formato esperado
        const apiData = response.data.data || response.data;
        statsData = {
          totalServices: apiData.servicesCount || 0,
          activeServices: apiData.servicesCount || 0, // Assumindo que todos os serviços retornados são ativos
          totalViews: apiData.totalViews || 0,
          totalBookings: apiData.bookingsCount || 0,
        };
      }
      
      console.log('📊 Stats Data:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Manter stats padrão em caso de erro
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm(t('services.confirmDelete'))) {
      try {
        await apiClient.deleteService(serviceId);
        loadServices(); // Recarregar a lista após exclusão
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert(t('services.error') || 'Error deleting service');
      }
    }
  };

  const handleToggleService = async (serviceId: string, status: string) => {
    try {
      await apiClient.updateService(serviceId, { status });
      loadServices(); // Recarregar a lista após atualização
    } catch (error) {
      console.error('Failed to update service:', error);
      alert(t('services.error') || 'Error updating service');
    }
  };

  const renderServiceCard = (service: Service) => (
    <Card key={service.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{service.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" />
              {service.location || 'Miami, FL'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={service.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {service.status === 'ACTIVE' ? t('services.active') : t('services.inactive')}
            </Badge>
            <Badge variant="outline">
              ${service.price}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.description}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold">{(service as any).views || 0}</div>
            <div className="text-xs text-muted-foreground">{t('services.views')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{(service as any).bookingCount || service.bookings?.length || 0}</div>
            <div className="text-xs text-muted-foreground">{t('services.bookings')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              {service.rating || 0}
            </div>
            <div className="text-xs text-muted-foreground">{t('services.rating')}</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {t('services.created')}: {new Date(service.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(`/${locale}/services/${service.id}`, '_blank')}>
              <Eye className="w-4 h-4 mr-1" />
              {t('common.view')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/${locale}/dashboard/services/edit/${service.id}`)}>
              <Edit className="w-4 h-4 mr-1" />
              {t('common.edit')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleService(service.id, service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
            >
              {service.status === 'ACTIVE' ? t('services.deactivate') : t('services.activate')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeleteService(service.id)}>
              <Trash2 className="w-4 h-4 mr-1" />
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('services.title')}</h1>
          <p className="text-muted-foreground">{t('services.subtitle')}</p>
        </div>
        <Button onClick={() => router.push(`/${locale}/dashboard/services/create`)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('services.createService')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('services.totalServices')}</p>
                <p className="text-2xl font-bold">{stats.totalServices}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('services.activeServices')}</p>
                <p className="text-2xl font-bold">{stats.activeServices}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('services.totalViews')}</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('services.totalBookings')}</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('services.allServices')}</TabsTrigger>
          <TabsTrigger value="active">{t('services.activeOnly')}</TabsTrigger>
          <TabsTrigger value="inactive">{t('services.inactiveOnly')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {!Array.isArray(services) || services.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">{t('services.noServices')}</p>
                  <p className="mb-4">{t('services.noServicesDescription')}</p>
                  <Button onClick={() => router.push(`/${locale}/dashboard/services/create`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('services.createFirstService')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            services.map(renderServiceCard)
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {!Array.isArray(services) || services.filter(service => service.status === 'ACTIVE').length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg">{t('services.noActiveServices')}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            services.filter(service => service.status === 'ACTIVE').map(renderServiceCard)
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {!Array.isArray(services) || services.filter(service => service.status !== 'ACTIVE').length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg">{t('services.noInactiveServices')}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            services.filter(service => service.status !== 'ACTIVE').map(renderServiceCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 