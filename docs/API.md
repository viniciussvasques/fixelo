# 🚀 Fixelo - Documentação Completa das APIs

> **Documentação completa de todos os endpoints da API do Fixelo**  
> **Base URL:** `http://localhost:3001/api`  
> **Versão:** 1.0.0  
> **Última atualização:** Janeiro 2025

## 📋 Índice

- [🔐 Autenticação](#-autenticação)
- [👥 Usuários](#-usuários)
- [🛍️ Serviços](#️-serviços)
- [📅 Agendamentos](#-agendamentos)
- [💳 Pagamentos](#-pagamentos)
- [⭐ Avaliações](#-avaliações)
- [💬 Chat](#-chat)
- [📊 Anúncios](#-anúncios)
- [💼 Planos](#-planos)
- [👑 Admin](#-admin)
- [🏥 Saúde](#-saúde)
- [📍 Localização](#-localização)
- [📢 Notificações](#-notificações)

---

## 🔐 Autenticação

### **POST** `/auth/register`
**Descrição:** Registrar novo usuário na plataforma  
**Autenticação:** Não requerida  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "João",
  "lastName": "Silva",
  "role": "CLIENT" | "PROVIDER",
  "phone": "+55 11 99999-9999",
  "city": "São Paulo",
  "state": "SP"
}
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### **POST** `/auth/login`
**Descrição:** Fazer login na plataforma  
**Autenticação:** Não requerida  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### **POST** `/auth/logout`
**Descrição:** Fazer logout e invalidar tokens  
**Autenticação:** Bearer Token  

### **POST** `/auth/refresh`
**Descrição:** Renovar access token usando refresh token  
**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### **POST** `/auth/forgot-password`
**Descrição:** Solicitar redefinição de senha  
**Body:**
```json
{
  "email": "user@example.com"
}
```

### **POST** `/auth/reset-password`
**Descrição:** Redefinir senha com token  
**Body:**
```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

### **POST** `/auth/verify-email`
**Descrição:** Verificar email com token  
**Body:**
```json
{
  "token": "verification_token"
}
```

### **POST** `/auth/resend-verification`
**Descrição:** Reenviar email de verificação  
**Body:**
```json
{
  "email": "user@example.com"
}
```

---

## 👥 Usuários

### **GET** `/users/profile`
**Descrição:** Obter perfil do usuário logado  
**Autenticação:** Bearer Token  

### **PATCH** `/users/profile`
**Descrição:** Atualizar perfil do usuário logado  
**Autenticação:** Bearer Token  
**Body:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "phone": "+55 11 99999-9999",
  "bio": "Descrição do usuário",
  "avatar": "url_da_imagem"
}
```

### **GET** `/users/:id`
**Descrição:** Obter perfil público de um usuário  
**Parâmetros:** `id` - ID do usuário  

### **POST** `/users/upload-avatar`
**Descrição:** Upload de avatar do usuário  
**Autenticação:** Bearer Token  
**Content-Type:** multipart/form-data  

---

## 🛍️ Serviços

### **POST** `/services`
**Descrição:** Criar novo serviço (apenas provedores)  
**Autenticação:** Bearer Token + Role PROVIDER  
**Body:**
```json
{
  "title": "Limpeza Residencial",
  "description": "Serviço completo de limpeza",
  "category": "HOUSE_CLEANING",
  "price": 150.00,
  "duration": 180,
  "city": "São Paulo",
  "state": "SP",
  "address": "Rua das Flores, 123",
  "images": ["url1", "url2"],
  "tags": ["limpeza", "residencial"]
}
```

### **GET** `/services`
**Descrição:** Listar todos os serviços com filtros  
**Query Parameters:**
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `category` - Filtrar por categoria
- `city` - Filtrar por cidade
- `minPrice` - Preço mínimo
- `maxPrice` - Preço máximo
- `sortBy` - Ordenar por: rating, price, distance, newest
- `sortOrder` - Ordem: asc, desc

### **GET** `/services/categories`
**Descrição:** Obter todas as categorias de serviços com contadores  
**Resposta:**
```json
{
  "categories": [
    {
      "category": "HOUSE_CLEANING",
      "name": "House Cleaning",
      "count": 25,
      "icon": "🏠"
    }
  ]
}
```

### **GET** `/services/featured`
**Descrição:** Obter serviços em destaque  
**Query Parameters:**
- `limit` - Número de serviços (padrão: 10)

### **GET** `/services/search`
**Descrição:** Buscar serviços por texto  
**Query Parameters:**
- `q` - Texto de busca
- `category` - Categoria
- `city` - Cidade
- `radius` - Raio de busca em km
- `minPrice` - Preço mínimo
- `maxPrice` - Preço máximo

### **GET** `/services/provider/:providerId`
**Descrição:** Obter serviços de um provedor específico  
**Parâmetros:** `providerId` - ID do provedor

### **GET** `/services/nearby`
**Descrição:** Buscar serviços próximos por geolocalização  
**Query Parameters:**
- `latitude` - Latitude
- `longitude` - Longitude
- `radius` - Raio em km (padrão: 25)
- `category` - Categoria opcional

### **GET** `/services/:id`
**Descrição:** Obter detalhes de um serviço específico  
**Parâmetros:** `id` - ID do serviço

### **PATCH** `/services/:id`
**Descrição:** Atualizar serviço (apenas dono ou admin)  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID do serviço

### **DELETE** `/services/:id`
**Descrição:** Deletar serviço (apenas dono ou admin)  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID do serviço

---

## 📅 Agendamentos

### **POST** `/bookings`
**Descrição:** Criar novo agendamento  
**Autenticação:** Bearer Token + Role CLIENT  
**Body:**
```json
{
  "serviceId": "service_id",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "duration": 120,
  "notes": "Observações especiais",
  "address": "Endereço do serviço",
  "city": "São Paulo",
  "totalAmount": 150.00
}
```

### **GET** `/bookings`
**Descrição:** Listar agendamentos do usuário  
**Autenticação:** Bearer Token  
**Query Parameters:**
- `status` - Filtrar por status
- `page` - Página
- `limit` - Itens por página

### **GET** `/bookings/:id`
**Descrição:** Obter detalhes de um agendamento  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID do agendamento

### **PATCH** `/bookings/:id`
**Descrição:** Atualizar agendamento  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID do agendamento

### **POST** `/bookings/:id/cancel`
**Descrição:** Cancelar agendamento  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID do agendamento  
**Body:**
```json
{
  "reason": "Motivo do cancelamento"
}
```

### **POST** `/bookings/:id/complete`
**Descrição:** Marcar agendamento como completo (apenas provedor)  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID do agendamento

### **POST** `/bookings/:id/confirm`
**Descrição:** Confirmar agendamento (apenas provedor)  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID do agendamento

---

## 💳 Pagamentos

### **POST** `/payments/create-intent`
**Descrição:** Criar intenção de pagamento no Stripe  
**Autenticação:** Bearer Token  
**Body:**
```json
{
  "amount": 150.00,
  "bookingId": "booking_id",
  "paymentMethodId": "pm_stripe_id"
}
```

### **POST** `/payments/confirm`
**Descrição:** Confirmar pagamento  
**Autenticação:** Bearer Token  
**Body:**
```json
{
  "paymentIntentId": "pi_stripe_id"
}
```

### **GET** `/payments/history`
**Descrição:** Histórico de pagamentos do usuário  
**Autenticação:** Bearer Token  
**Query Parameters:**
- `page` - Página
- `limit` - Itens por página
- `status` - Filtrar por status

### **POST** `/payments/refund`
**Descrição:** Solicitar reembolso  
**Autenticação:** Bearer Token  
**Body:**
```json
{
  "paymentId": "payment_id",
  "reason": "Motivo do reembolso"
}
```

### **GET** `/payments/methods`
**Descrição:** Listar métodos de pagamento salvos  
**Autenticação:** Bearer Token  

### **POST** `/payments/methods`
**Descrição:** Adicionar método de pagamento  
**Autenticação:** Bearer Token  
**Body:**
```json
{
  "paymentMethodId": "pm_stripe_id",
  "isDefault": true
}
```

### **DELETE** `/payments/methods/:id`
**Descrição:** Remover método de pagamento  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID do método de pagamento

---

## ⭐ Avaliações

### **POST** `/reviews`
**Descrição:** Criar nova avaliação  
**Autenticação:** Bearer Token + Role CLIENT  
**Body:**
```json
{
  "bookingId": "booking_id",
  "serviceId": "service_id",
  "providerId": "provider_id",
  "rating": 5,
  "comment": "Excelente serviço!"
}
```

### **GET** `/reviews`
**Descrição:** Listar avaliações com filtros  
**Query Parameters:**
- `serviceId` - Filtrar por serviço
- `providerId` - Filtrar por provedor
- `rating` - Filtrar por rating
- `page` - Página
- `limit` - Itens por página

### **GET** `/reviews/:id`
**Descrição:** Obter detalhes de uma avaliação  
**Parâmetros:** `id` - ID da avaliação

### **PATCH** `/reviews/:id`
**Descrição:** Atualizar avaliação (apenas autor)  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID da avaliação

### **DELETE** `/reviews/:id`
**Descrição:** Deletar avaliação (apenas autor ou admin)  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID da avaliação

### **POST** `/reviews/:id/response`
**Descrição:** Responder avaliação (apenas provedor)  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID da avaliação  
**Body:**
```json
{
  "response": "Obrigado pela avaliação!"
}
```

---

## 💬 Chat

### **POST** `/chat/messages`
**Descrição:** Enviar mensagem  
**Autenticação:** Bearer Token  
**Body:**
```json
{
  "bookingId": "booking_id",
  "receiverId": "user_id",
  "content": "Mensagem de texto",
  "messageType": "TEXT"
}
```

### **GET** `/chat/bookings/:bookingId/messages`
**Descrição:** Obter mensagens de um agendamento  
**Autenticação:** Bearer Token  
**Parâmetros:** `bookingId` - ID do agendamento

### **POST** `/chat/messages/:messageId/read`
**Descrição:** Marcar mensagem como lida  
**Autenticação:** Bearer Token  
**Parâmetros:** `messageId` - ID da mensagem

### **GET** `/chat/bookings/:bookingId/unread-count`
**Descrição:** Contar mensagens não lidas  
**Autenticação:** Bearer Token  
**Parâmetros:** `bookingId` - ID do agendamento

### **GET** `/chat/chats`
**Descrição:** Listar todas as conversas do usuário  
**Autenticação:** Bearer Token  

### **DELETE** `/chat/messages/:messageId`
**Descrição:** Deletar mensagem  
**Autenticação:** Bearer Token  
**Parâmetros:** `messageId` - ID da mensagem

---

## 📊 Anúncios

### **POST** `/ads/campaigns`
**Descrição:** Criar campanha de anúncio  
**Autenticação:** Bearer Token + Role PROVIDER  
**Body:**
```json
{
  "serviceId": "service_id",
  "name": "Campanha Limpeza",
  "adType": "BOOST",
  "budget": 100.00,
  "budgetType": "DAILY",
  "startDate": "2024-01-15",
  "endDate": "2024-01-30",
  "targeting": {
    "cities": ["São Paulo", "Rio de Janeiro"],
    "categories": ["HOUSE_CLEANING"]
  }
}
```

### **GET** `/ads/campaigns`
**Descrição:** Listar campanhas do provedor  
**Autenticação:** Bearer Token + Role PROVIDER  
**Query Parameters:**
- `status` - Filtrar por status
- `adType` - Filtrar por tipo
- `page` - Página
- `limit` - Itens por página

### **GET** `/ads/campaigns/:id`
**Descrição:** Obter detalhes de uma campanha  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID da campanha

### **PATCH** `/ads/campaigns/:id`
**Descrição:** Atualizar campanha  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID da campanha

### **POST** `/ads/campaigns/:id/activate`
**Descrição:** Ativar campanha  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID da campanha

### **POST** `/ads/campaigns/:id/pause`
**Descrição:** Pausar campanha  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID da campanha

### **POST** `/ads/boost`
**Descrição:** Criar boost rápido para serviço  
**Autenticação:** Bearer Token + Role PROVIDER  
**Body:**
```json
{
  "serviceId": "service_id",
  "duration": 7,
  "budget": 50.00,
  "targetCities": "São Paulo,Rio de Janeiro"
}
```

### **POST** `/ads/campaigns/:id/bid`
**Descrição:** Fazer lance em leilão  
**Autenticação:** Bearer Token + Role PROVIDER  
**Parâmetros:** `id` - ID da campanha  
**Body:**
```json
{
  "bidAmount": 2.50,
  "maxBid": 5.00
}
```

### **GET** `/ads/analytics`
**Descrição:** Obter analytics de campanhas  
**Autenticação:** Bearer Token + Role PROVIDER  
**Query Parameters:**
- `campaignId` - ID da campanha específica
- `startDate` - Data de início
- `endDate` - Data de fim
- `groupBy` - Agrupar por: day, week, month

### **GET** `/ads/stats`
**Descrição:** Obter estatísticas gerais de ADS  
**Autenticação:** Bearer Token + Role PROVIDER  

### **POST** `/ads/leads/purchase`
**Descrição:** Comprar leads extras  
**Autenticação:** Bearer Token + Role PROVIDER  
**Body:**
```json
{
  "quantity": 10,
  "paymentMethodId": "pm_stripe_id"
}
```

### **POST** `/ads/upgrade-plan`
**Descrição:** Upgrade para plano PRO  
**Autenticação:** Bearer Token + Role PROVIDER  
**Body:**
```json
{
  "planType": "PRO",
  "billingPeriod": "monthly",
  "paymentMethodId": "pm_stripe_id"
}
```

### **GET** `/ads/admin/stats`
**Descrição:** Estatísticas gerais da plataforma (Admin)  
**Autenticação:** Bearer Token + Role ADMIN  

---

## 💼 Planos

### **GET** `/plans`
**Descrição:** Listar todos os planos disponíveis  

### **GET** `/plans/:id`
**Descrição:** Obter detalhes de um plano  
**Parâmetros:** `id` - ID do plano

### **GET** `/plans/user/current`
**Descrição:** Obter plano atual do usuário  
**Autenticação:** Bearer Token + Role PROVIDER  

### **GET** `/plans/user/usage`
**Descrição:** Obter uso atual do plano  
**Autenticação:** Bearer Token + Role PROVIDER  

### **GET** `/plans/user/limits`
**Descrição:** Obter limites do plano atual  
**Autenticação:** Bearer Token + Role PROVIDER  

### **GET** `/plans/user/rewards`
**Descrição:** Obter recompensas disponíveis  
**Autenticação:** Bearer Token + Role PROVIDER  

### **POST** `/plans/upgrade/pro`
**Descrição:** Upgrade para plano PRO  
**Autenticação:** Bearer Token + Role PROVIDER  
**Body:**
```json
{
  "billingPeriod": "monthly",
  "paymentMethodId": "pm_stripe_id"
}
```

### **POST** `/plans/downgrade/free`
**Descrição:** Downgrade para plano FREE  
**Autenticação:** Bearer Token + Role PROVIDER  

---

## 👑 Admin

### **GET** `/admin/dashboard`
**Descrição:** Painel administrativo principal  
**Autenticação:** Bearer Token + Role ADMIN  

### **GET** `/admin/dashboard/stats`
**Descrição:** Estatísticas do dashboard  
**Autenticação:** Bearer Token + Role ADMIN  

### **GET** `/admin/dashboard/metrics`
**Descrição:** Métricas detalhadas  
**Autenticação:** Bearer Token + Role ADMIN  

### **GET** `/admin/dashboard/revenue`
**Descrição:** Dados de receita  
**Autenticação:** Bearer Token + Role ADMIN  

### **GET** `/admin/users`
**Descrição:** Listar todos os usuários  
**Autenticação:** Bearer Token + Role ADMIN  
**Query Parameters:**
- `role` - Filtrar por role
- `status` - Filtrar por status
- `page` - Página
- `limit` - Itens por página

### **GET** `/admin/users/:id`
**Descrição:** Obter detalhes de um usuário  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do usuário

### **PUT** `/admin/users/:id`
**Descrição:** Atualizar usuário  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do usuário

### **POST** `/admin/users/:id/suspend`
**Descrição:** Suspender usuário  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do usuário

### **POST** `/admin/users/:id/activate`
**Descrição:** Ativar usuário  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do usuário

### **DELETE** `/admin/users/:id`
**Descrição:** Deletar usuário  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do usuário

### **GET** `/admin/services`
**Descrição:** Listar todos os serviços  
**Autenticação:** Bearer Token + Role ADMIN  

### **GET** `/admin/services/:id`
**Descrição:** Obter detalhes de um serviço  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do serviço

### **PUT** `/admin/services/:id`
**Descrição:** Atualizar serviço  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do serviço

### **POST** `/admin/services/:id/approve`
**Descrição:** Aprovar serviço  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do serviço

### **POST** `/admin/services/:id/suspend`
**Descrição:** Suspender serviço  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do serviço

### **DELETE** `/admin/services/:id`
**Descrição:** Deletar serviço  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do serviço

### **GET** `/admin/bookings`
**Descrição:** Listar todos os agendamentos  
**Autenticação:** Bearer Token + Role ADMIN  

### **GET** `/admin/bookings/:id`
**Descrição:** Obter detalhes de um agendamento  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do agendamento

### **POST** `/admin/bookings/:id/resolve-dispute`
**Descrição:** Resolver disputa de agendamento  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do agendamento

### **PUT** `/admin/bookings/:id/status`
**Descrição:** Alterar status do agendamento  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID do agendamento

### **GET** `/admin/reviews`
**Descrição:** Listar todas as avaliações  
**Autenticação:** Bearer Token + Role ADMIN  

### **GET** `/admin/reviews/:id`
**Descrição:** Obter detalhes de uma avaliação  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID da avaliação

### **POST** `/admin/reviews/:id/moderate`
**Descrição:** Moderar avaliação  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID da avaliação

### **DELETE** `/admin/reviews/:id`
**Descrição:** Deletar avaliação  
**Autenticação:** Bearer Token + Role ADMIN  
**Parâmetros:** `id` - ID da avaliação

---

## 🏥 Saúde

### **GET** `/health`
**Descrição:** Verificar saúde da API  
**Autenticação:** Não requerida  
**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected"
}
```

---

## 📍 Localização

### **GET** `/locations/cities`
**Descrição:** Obter lista de cidades disponíveis na Flórida  
**Autenticação:** Não requerida  
**Resposta:**
```json
{
  "success": true,
  "data": [
    "Miami", "Orlando", "Tampa", "Jacksonville",
    "Fort Lauderdale", "St. Petersburg", "Tallahassee",
    "Sarasota", "Cape Coral", "West Palm Beach"
  ],
  "meta": {
    "totalCities": 20,
    "activeCities": 8
  }
}
```

---

## 📢 Notificações

### **GET** `/notifications`
**Descrição:** Listar notificações do usuário  
**Autenticação:** Bearer Token  
**Query Parameters:**
- `read` - Filtrar por lidas/não lidas
- `type` - Filtrar por tipo
- `page` - Página
- `limit` - Itens por página

### **POST** `/notifications/:id/read`
**Descrição:** Marcar notificação como lida  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID da notificação

### **POST** `/notifications/mark-all-read`
**Descrição:** Marcar todas as notificações como lidas  
**Autenticação:** Bearer Token  

### **DELETE** `/notifications/:id`
**Descrição:** Deletar notificação  
**Autenticação:** Bearer Token  
**Parâmetros:** `id` - ID da notificação

---

## 📝 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Requisição bem-sucedida, sem conteúdo |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de dados |
| 422 | Unprocessable Entity - Erro de validação |
| 500 | Internal Server Error - Erro interno |

---

## 🔑 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Inclua o token no header:

```
Authorization: Bearer <access_token>
```

### Roles Disponíveis:
- **CLIENT** - Cliente que contrata serviços
- **PROVIDER** - Provedor que oferece serviços  
- **ADMIN** - Administrador da plataforma

---

## 📊 Paginação

Endpoints que retornam listas suportam paginação:

**Query Parameters:**
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máximo: 100)

**Resposta:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}
```

---

## 🔍 Filtros e Ordenação

### Filtros Comuns:
- `status` - Filtrar por status
- `category` - Filtrar por categoria
- `city` - Filtrar por cidade
- `startDate` / `endDate` - Filtrar por período

### Ordenação:
- `sortBy` - Campo para ordenação
- `sortOrder` - Ordem: `asc` ou `desc`

---

## 🚨 Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "details": {
    "field": "Erro específico do campo"
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## 📞 Suporte

Para dúvidas sobre a API:
- **Email:** dev@fixelo.com
- **Documentação:** http://localhost:3001/api/docs
- **Status:** http://localhost:3001/health

---

**Última atualização:** Janeiro 2025  
**Versão da API:** 1.0.0 