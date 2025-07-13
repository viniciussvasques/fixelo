'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useCategories } from '@/hooks/use-categories';
import { useFloridaCities } from '@/hooks/use-cities';
import { Service } from '@/types/api';
import { toast } from 'sonner';

export default function EditServicePage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    city: '',
    address: '',
    tags: '',
  });

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { cities, isLoading: citiesLoading } = useFloridaCities();

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getService(serviceId);
      const serviceData = response.data.data || response.data;
      
      setService(serviceData);
      setFormData({
        title: serviceData.title || '',
        description: serviceData.description || '',
        category: serviceData.category || '',
        price: serviceData.price?.toString() || '',
        duration: serviceData.duration?.toString() || '',
        city: serviceData.location || serviceData.city || '',
        address: serviceData.address || '',
        tags: serviceData.tags?.join(', ') || '',
      });
    } catch (error) {
      console.error('Failed to load service:', error);
      toast.error(t('services.error') || 'Error loading service');
      router.push(`/${locale}/dashboard/services`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.duration || !formData.city) {
      toast.error(t('services.fillRequiredFields') || 'Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        location: formData.city,
        address: formData.address,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      };

      await apiClient.updateService(serviceId, updateData);
      
      toast.success(t('services.serviceUpdated') || 'Service updated successfully');
      router.push(`/${locale}/dashboard/services`);
    } catch (error) {
      console.error('Failed to update service:', error);
      toast.error(t('services.error') || 'Error updating service');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('services.notFound') || 'Service not found'}</p>
          <Button onClick={() => router.push(`/${locale}/dashboard/services`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/dashboard/services`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('services.editService')}</h1>
          <p className="text-muted-foreground">{t('services.editServiceDescription') || 'Update your service information'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('services.basicInformation')}</CardTitle>
            <CardDescription>{t('services.basicInformationDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">{t('services.serviceTitle')} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={t('services.serviceTitlePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">{t('services.description')} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('services.descriptionPlaceholder')}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">{t('services.category')} *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('services.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      {t('common.loading')}
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Duration */}
        <Card>
          <CardHeader>
            <CardTitle>{t('services.pricingDuration')}</CardTitle>
            <CardDescription>{t('services.pricingDurationDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">{t('services.price')} (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">{t('services.duration')} ({t('services.minutes')}) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="60"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>{t('services.serviceLocation')}</CardTitle>
            <CardDescription>{t('services.serviceLocationDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="city">{t('services.city')} *</Label>
              <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('services.selectCity')} />
                </SelectTrigger>
                <SelectContent>
                  {citiesLoading ? (
                    <SelectItem value="loading" disabled>
                      {t('services.loadingCities')}
                    </SelectItem>
                  ) : (
                    cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">{t('services.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={t('services.addressPlaceholder')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>{t('services.serviceTags')}</CardTitle>
            <CardDescription>{t('services.serviceTagsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="tags">{t('services.tags')}</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder={t('services.addTagPlaceholder')}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('services.tagsHelp') || 'Separate tags with commas'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/dashboard/services`)}
          >
            {t('services.cancel')}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('services.updating') || 'Updating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('services.updateService') || 'Update Service'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 