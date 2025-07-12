'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, MapPin, Clock, TrendingUp, Star } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Service } from '@/types/api';

export default function ServicesPage() {
  const t = useTranslations();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalViews: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    loadServices();
    loadStats();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProviderServices();
      setServices(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.getProviderStats();
      setStats(response.data?.data || {
        totalServices: 5,
        activeServices: 4,
        totalViews: 125,
        totalBookings: 32,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm(t('services.confirmDelete'))) {
      try {
        await apiClient.deleteService(serviceId);
        loadServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const handleToggleService = async (serviceId: string, active: boolean) => {
    try {
      await apiClient.updateService(serviceId, { active });
      loadServices();
    } catch (error) {
      console.error('Failed to update service:', error);
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
              Miami, FL
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">
              {t('services.active')}
            </Badge>
            <Badge variant="outline">$45</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.description}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold">125</div>
            <div className="text-xs text-muted-foreground">{t('services.views')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">15</div>
            <div className="text-xs text-muted-foreground">{t('services.bookings')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              4.8
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
            <Button variant="outline" size="sm" onClick={() => window.open(`/services/${service.id}`, '_blank')}>
              <Eye className="w-4 h-4 mr-1" />
              {t('common.view')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = `/dashboard/services/edit/${service.id}`}>
              <Edit className="w-4 h-4 mr-1" />
              {t('common.edit')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleService(service.id, false)}
            >
              {t('services.deactivate')}
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
        <Button onClick={() => window.location.href = '/dashboard/services/create'}>
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
          {services.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">{t('services.noServices')}</p>
                  <p className="mb-4">{t('services.noServicesDescription')}</p>
                  <Button onClick={() => window.location.href = '/dashboard/services/create'}>
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
          {services.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg">{t('services.noActiveServices')}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            services.map(renderServiceCard)
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg">{t('services.noInactiveServices')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 