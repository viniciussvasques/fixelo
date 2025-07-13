'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Star, MessageCircle, Search, Plus, Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function BookingsPage() {
  const router = useRouter()
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const bookings = [
    {
      id: 1,
      service: 'Limpeza Residencial Completa',
      provider: {
        name: 'Maria Silva',
        avatar: '/placeholder-avatar.jpg',
        rating: 4.9,
        isVerified: true
      },
      date: '2024-01-15',
      time: '14:00',
      status: 'Confirmado',
      price: '$120',
      image: '/placeholder-service.jpg',
      location: 'Rua das Flores, 123',
      description: 'Limpeza completa incluindo todos os cômodos',
      duration: '3-4 horas'
    },
    {
      id: 2,
      service: 'Reparo Elétrico',
      provider: {
        name: 'João Santos',
        avatar: '/placeholder-avatar.jpg',
        rating: 4.8,
        isVerified: true
      },
      date: '2024-01-18',
      time: '10:00',
      status: 'Em andamento',
      price: '$85',
      image: '/placeholder-service.jpg',
      location: 'Av. Principal, 456',
      description: 'Instalação de tomadas e interruptores',
      duration: '2-3 horas'
    },
    {
      id: 3,
      service: 'Jardinagem',
      provider: {
        name: 'Ana Costa',
        avatar: '/placeholder-avatar.jpg',
        rating: 4.7,
        isVerified: false
      },
      date: '2024-01-20',
      time: '08:00',
      status: 'Agendado',
      price: '$95',
      image: '/placeholder-service.jpg',
      location: 'Rua Verde, 789',
      description: 'Poda e manutenção do jardim',
      duration: '4-5 horas'
    },
    {
      id: 4,
      service: 'Pintura Residencial',
      provider: {
        name: 'Roberto Mendes',
        avatar: '/placeholder-avatar.jpg',
        rating: 4.6,
        isVerified: true
      },
      date: '2024-01-05',
      time: '09:00',
      status: 'Concluído',
      price: '$200',
      image: '/placeholder-service.jpg',
      location: 'Rua Azul, 321',
      description: 'Pintura da sala e quartos',
      duration: '2 dias'
    },
    {
      id: 5,
      service: 'Encanamento',
      provider: {
        name: 'Pedro Oliveira',
        avatar: '/placeholder-avatar.jpg',
        rating: 4.5,
        isVerified: true
      },
      date: '2024-01-02',
      time: '11:00',
      status: 'Cancelado',
      price: '$110',
      image: '/placeholder-service.jpg',
      location: 'Av. Central, 654',
      description: 'Reparo de vazamento',
      duration: '1-2 horas'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Concluído':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'price':
        return parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''))
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const upcomingBookings = sortedBookings.filter(booking => 
    booking.status === 'Confirmado' || booking.status === 'Agendado'
  )

  const pastBookings = sortedBookings.filter(booking => 
    booking.status === 'Concluído' || booking.status === 'Cancelado'
  )

  const currentBookings = sortedBookings.filter(booking => 
    booking.status === 'Em andamento'
  )

  const handleViewDetails = (bookingId: number) => {
    router.push(`/${locale}/dashboard/bookings/${bookingId}`)
  }

  const handleContactProvider = (providerId: string) => {
    router.push(`/${locale}/dashboard/messages?provider=${providerId}`)
  }

  const handleReschedule = (bookingId: number) => {
    // TODO: Implement reschedule functionality
    console.log('Reschedule booking:', bookingId)
  }

  const handleCancel = (bookingId: number) => {
    // TODO: Implement cancel functionality
    console.log('Cancel booking:', bookingId)
  }

  const BookingCard = ({ booking }: { booking: typeof bookings[0] }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={booking.image}
              alt={booking.service}
              className="w-20 h-20 rounded-xl object-cover shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xl text-gray-900 truncate">
                {booking.service}
              </h3>
              <Badge className={`px-3 py-1 text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                {booking.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8 ring-2 ring-white shadow-md">
                <AvatarImage src={booking.provider.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  {booking.provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{booking.provider.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-600">{booking.provider.rating}</span>
              </div>
              {booking.provider.isVerified && (
                <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Verificado
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{booking.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Data & Hora</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.date} às {booking.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Duração</p>
                  <p className="text-sm font-medium text-gray-900">{booking.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Localização</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{booking.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Preço</p>
                  <p className="text-lg font-bold text-gray-900">{booking.price}</p>
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
                onClick={() => handleContactProvider(booking.provider.name)}
                className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              {(booking.status === 'Confirmado' || booking.status === 'Agendado') && (
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Minhas Reservas</h1>
          <p className="text-lg text-gray-600">
            Gerencie seus agendamentos de serviços
          </p>
        </div>
        <Button 
          onClick={() => router.push(`/${locale}/services`)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
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
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="em andamento">Em andamento</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="concluído">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
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