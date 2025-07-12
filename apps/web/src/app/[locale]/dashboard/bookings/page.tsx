'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Star, MessageCircle, Search } from 'lucide-react'
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
        return 'bg-blue-100 text-blue-800'
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-800'
      case 'Agendado':
        return 'bg-green-100 text-green-800'
      case 'Concluído':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    router.push(`/dashboard/bookings/${bookingId}`)
  }

  const handleContactProvider = (providerId: string) => {
    router.push(`/dashboard/messages?provider=${providerId}`)
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={booking.image}
            alt={booking.service}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {booking.service}
              </h3>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={booking.provider.avatar} />
                <AvatarFallback>
                  {booking.provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{booking.provider.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500">{booking.provider.rating}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{booking.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {booking.date} às {booking.time}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{booking.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{booking.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">{booking.price}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => handleViewDetails(booking.id)}
              >
                Ver Detalhes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactProvider(booking.provider.name)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Mensagem
              </Button>
              {(booking.status === 'Confirmado' || booking.status === 'Agendado') && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReschedule(booking.id)}
                  >
                    Reagendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(booking.id)}
                    className="text-red-600 hover:text-red-700"
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Reservas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus agendamentos de serviços
          </p>
        </div>
        <Button onClick={() => router.push(`/${locale}/services`)}>
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por serviço ou prestador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Próximas ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="current">
            Em Andamento ({currentBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Concluídas ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma reserva próxima
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Você não tem nenhum agendamento confirmado ou pendente.
                  </p>
                  <Button onClick={() => router.push(`/${locale}/services`)}>
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

        <TabsContent value="current" className="mt-6">
          <div className="space-y-4">
            {currentBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum serviço em andamento
                  </h3>
                  <p className="text-gray-600">
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

        <TabsContent value="past" className="mt-6">
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma reserva concluída
                  </h3>
                  <p className="text-gray-600">
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