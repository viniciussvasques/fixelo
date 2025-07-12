'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { 
  ArrowLeft,
  Plus,
  Upload,
  MapPin,
  DollarSign,
  Clock,
  Tag,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useFloridaCities } from '@/hooks/use-cities'
import { useAuthStore } from '@/store/auth-store'
import { api } from '@/lib/api'

// Categorias de serviços disponíveis
const SERVICE_CATEGORIES = [
  { value: 'HOUSE_CLEANING', label: 'House Cleaning' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'LANDSCAPING', label: 'Landscaping' },
  { value: 'PAINTING', label: 'Painting' },
  { value: 'HANDYMAN', label: 'Handyman' },
  { value: 'PEST_CONTROL', label: 'Pest Control' },
  { value: 'APPLIANCE_REPAIR', label: 'Appliance Repair' },
  { value: 'ROOFING', label: 'Roofing' },
  { value: 'FLOORING', label: 'Flooring' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'POOL_MAINTENANCE', label: 'Pool Maintenance' },
  { value: 'MOVING', label: 'Moving' },
  { value: 'OTHER', label: 'Other' }
]

export default function CreateServicePage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('services')
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  const { cities, isLoading: citiesLoading } = useFloridaCities()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    currency: 'USD',
    city: '',
    state: 'FL',
    address: '',
    zipCode: '',
    images: [] as string[],
    tags: [] as string[],
    newTag: ''
  })

  // Verificar se usuário está autenticado
  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You need to be logged in to create services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(`/${locale}/auth`)}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Verificar se é um provedor
  if (user.role !== 'PROVIDER') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only providers can create services.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validações
      if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.city) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          variant: "destructive"
        })
        return
      }

      // Preparar dados para API
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: formData.duration ? parseInt(formData.duration) : 60,
        currency: formData.currency,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        zipCode: formData.zipCode,
        images: formData.images,
        tags: formData.tags
      }

      const response = await api.post('/services', serviceData)

      if (response.data.success) {
        toast({
          title: 'Service Created!',
          description: 'Your service has been created successfully.',
        })

        router.push(`/${locale}/dashboard/services`)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error creating service. Please try again.',
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Plus className="mr-3 h-8 w-8 text-blue-600" />
                Create New Service
              </h1>
            </div>
            <p className="text-gray-600">
              Set up your service offering for potential customers
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the essential details about your service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Professional House Cleaning"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your service in detail..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Pricing & Duration
            </CardTitle>
            <CardDescription>
              Set your service pricing and estimated duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="60"
                  min="15"
                  step="15"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Service Location
            </CardTitle>
            <CardDescription>
              Where do you provide this service?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => handleInputChange('city', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {citiesLoading ? (
                      <SelectItem value="" disabled>Loading cities...</SelectItem>
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
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="12345"
                  maxLength={5}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address for service location"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Service Tags
            </CardTitle>
            <CardDescription>
              Add tags to help customers find your service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={formData.newTag}
                onChange={(e) => handleInputChange('newTag', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!formData.newTag.trim()}
              >
                Add Tag
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Service Images
            </CardTitle>
            <CardDescription>
              Upload images to showcase your service (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Image upload functionality will be implemented here
              </p>
              <p className="text-xs text-gray-500">
                Support for JPG, PNG files up to 5MB each
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Creating...' : 'Create Service'}
          </Button>
        </div>
      </form>
    </div>
  )
} 