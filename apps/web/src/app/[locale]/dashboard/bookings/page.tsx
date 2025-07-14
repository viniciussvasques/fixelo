'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Star, MessageCircle, Search, Plus, ArrowRight, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useUserBookings } from '@/hooks/use-user-bookings'
import { useAuthStore } from '@/store/auth-store'

export default function BookingsPage() {
  const router = useRouter()
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const { isLoading: authLoading } = useAuthStore()
  const { bookings, stats, loading, error, refetch } = useUserBookings()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PENDING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'REJECTED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado'
      case 'IN_PROGRESS':
        return 'Em Andamento'
      case 'PENDING':
        return 'Pendente'
      case 'COMPLETED':
        return 'Concluído'
      case 'CANCELLED':
        return 'Cancelado'
      case 'REJECTED':
        return 'Rejeitado'
      default:
        return status
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
      case 'price':
        return b.totalAmount - a.totalAmount
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const upcomingBookings = sortedBookings.filter(booking => 
    booking.status === 'CONFIRMED' || booking.status === 'PENDING'
  )

  const currentBookings = sortedBookings.filter(booking => 
    booking.status === 'IN_PROGRESS'
  )

  const pastBookings = sortedBookings.filter(booking => 
    booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REJECTED'
  )

  const handleViewDetails = (bookingId: string) => {
    router.push(`/${locale}/dashboard/bookings/${bookingId}`)
  }

  const handleContactProvider = (providerId: string) => {
    router.push(`/${locale}/dashboard/messages?provider=${providerId}`)
  }

  const handleReschedule = (bookingId: string) => {
    // TODO: Implement reschedule functionality
    console.log('Reschedule booking:', bookingId)
  }

  const handleCancel = (bookingId: string) => {
    // TODO: Implement cancel functionality
    console.log('Cancel booking:', bookingId)
  }

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-bold">
                {booking.service?.title?.charAt(0) || 'S'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xl text-gray-900 truncate">
                {booking.service?.title || 'Serviço'}
              </h3>
              <Badge className={`px-3 py-1 text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                {getStatusLabel(booking.status)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8 ring-2 ring-white shadow-md">
                <AvatarImage src={booking.provider?.profilePicture} />              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {booking.provider?.firstName?.charAt(0) || 'P'}
              </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {booking.provider?.firstName} {booking.provider?.lastName || 'Prestador'}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-600">{booking.provider?.rating || 0}</span>
              </div>
              {booking.provider?.isVerified && (
                <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Verificado
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{booking.service?.description || booking.notes || 'Sem descrição disponível'}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Data & Hora</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.scheduledFor).toLocaleDateString('pt-BR')} às {new Date(booking.scheduledFor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Duração</p>
                  <p className="text-sm font-medium text-gray-900">{booking.duration || 60} min</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Localização</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.location?.address || booking.service?.location || 'A definir'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Preço</p>
                  <p className="text-lg font-bold text-gray-900">
                    {booking.currency || '$'}{booking.totalAmount || booking.service?.price || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                onClick={() => handleViewDetails(booking.id)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
              >
                Ver Detalhes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactProvider(booking.providerId)}
                className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReschedule(booking.id)}
                    className="border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 text-yellow-700"
                  >
                    Reagendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(booking.id)}
                    className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (authLoading || loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <div className="text-lg font-medium text-gray-900">Carregando suas reservas...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Erro ao carregar reservas: {error}</div>
          <Button onClick={refetch} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Minhas Reservas</h1>
          <p className="text-lg text-gray-600">
            Gerencie seus agendamentos de serviços ({stats.total} total)
          </p>
        </div>
        <Button 
          onClick={() => router.push(`/${locale}/services`)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Buscar Serviços
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8 border-0 shadow-xl bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar por serviço ou prestador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 border-gray-200">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 border-gray-200">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
            Próximas ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="current" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
            Em Andamento ({currentBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
            Concluídas ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-8">
          <div className="space-y-6">
            {upcomingBookings.length === 0 ? (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Nenhuma reserva próxima
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Você não tem nenhum agendamento confirmado ou pendente.
                  </p>
                  <Button 
                    onClick={() => router.push(`/${locale}/services`)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Buscar Serviços
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="current" className="mt-8">
          <div className="space-y-6">
            {currentBookings.length === 0 ? (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Nenhum serviço em andamento
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Você não tem nenhum serviço sendo executado no momento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              currentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-8">
          <div className="space-y-6">
            {pastBookings.length === 0 ? (
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Nenhuma reserva concluída
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Você ainda não concluiu nenhum serviço.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}