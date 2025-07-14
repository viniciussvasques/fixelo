'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card key={service.id} className="group hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 truncate mb-2">
                {service.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{service.location || 'Miami, FL'}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <Badge 
                variant={service.status === 'ACTIVE' ? 'default' : 'secondary'}
                className={`${service.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } border-0 font-medium`}
              >
                {service.status === 'ACTIVE' ? t('services.active') : t('services.inactive')}
              </Badge>
              <div className="text-lg font-bold text-green-600">
                ${service.price}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-lg font-bold text-gray-900">{(service as any).views || 0}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{t('services.views')}</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">{(service as any).bookingCount || service.bookings?.length || 0}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{t('services.bookings')}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-lg font-bold text-gray-900">{service.rating || 0}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{t('services.rating')}</div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{t('services.created')}: {new Date(service.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/${locale}/services/${service.id}`, '_blank')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <Eye className="w-4 h-4 mr-1" />
                {t('common.view')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push(`/${locale}/dashboard/services/edit/${service.id}`)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-900"
              >
                <Edit className="w-4 h-4 mr-1" />
                {t('common.edit')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleService(service.id, service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                className={`${service.status === 'ACTIVE' 
                  ? 'border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-900' 
                  : 'border-green-300 text-green-700 hover:bg-green-50 hover:text-green-900'
                }`}
              >
                {service.status === 'ACTIVE' ? t('services.deactivate') : t('services.activate')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteService(service.id)}
                className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-900"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <div className="text-lg font-medium text-gray-900">{t('common.loading')}</div>
          <div className="text-sm text-gray-500">Carregando seus serviços...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{t('services.title')}</h1>
          <p className="text-gray-600 text-lg">{t('services.subtitle')}</p>
        </div>
        <Button 
          onClick={() => router.push(`/${locale}/dashboard/services/create`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('services.createService')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-700">{t('services.totalServices')}</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalServices}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700">{t('services.activeServices')}</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeServices}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-700">{t('services.totalViews')}</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalViews}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-700">{t('services.totalBookings')}</p>
                <p className="text-3xl font-bold text-orange-900">{stats.totalBookings}</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b border-gray-200 px-6 pt-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium"
              >
                {t('services.allServices')}
              </TabsTrigger>
              <TabsTrigger 
                value="active"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium"
              >
                {t('services.activeOnly')}
              </TabsTrigger>
              <TabsTrigger 
                value="inactive"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium"
              >
                {t('services.inactiveOnly')}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="all" className="mt-0">
              {!Array.isArray(services) || services.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('services.noServices')}</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">{t('services.noServicesDescription')}</p>
                  <Button 
                    onClick={() => router.push(`/${locale}/dashboard/services/create`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('services.createFirstService')}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {services.map(renderServiceCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              {!Array.isArray(services) || services.filter(service => service.status === 'ACTIVE').length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('services.noActiveServices')}</h3>
                  <p className="text-gray-600">Ative alguns serviços para começar a receber reservas.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {services.filter(service => service.status === 'ACTIVE').map(renderServiceCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="inactive" className="mt-0">
              {!Array.isArray(services) || services.filter(service => service.status !== 'ACTIVE').length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('services.noInactiveServices')}</h3>
                  <p className="text-gray-600">Todos os seus serviços estão ativos e disponíveis.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {services.filter(service => service.status !== 'ACTIVE').map(renderServiceCard)}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 