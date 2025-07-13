// Script de teste para autenticação
export const setupMockAuth = () => {
  if (typeof window !== 'undefined') {
    // Token JWT real obtido da API (válido por mais tempo)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWQwanU4OXAwMDAwZzNxdXZ6M2lyaDU4IiwiZW1haWwiOiJwcm92aWRlckB0ZXN0LmNvbSIsInJvbGUiOiJQUk9WSURFUiIsImlhdCI6MTc1MjM0NDAwNywiZXhwIjoxNzUyMzQ0OTA3fQ.aqNFf4zcKM24tv_RL_PMHdIksfi4hSfhpEB1Q83Y4vs'
    const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWQwanU4OXAwMDAwZzNxdXZ6M2lyaDU4IiwiZW1haWwiOiJwcm92aWRlckB0ZXN0LmNvbSIsInJvbGUiOiJQUk9WSURFUiIsImlhdCI6MTc1MjM0NDAwNywianRpIjoiY21kMGp1ODlwMDAwMGczcXV2ejNpcmg1OC0xNzUyMzQ0MDA3NzU0IiwiZXhwIjoxNzUyOTQ4ODA3fQ.3--SLtx60uqEWUYUdn9MAzJLt99FkF9Bf8Ja4cueA6M'
    
    // Dados do usuário
    const user = {
      id: 'cmd0ju89p0000g3quvz3irh58',
      email: 'provider@test.com',
      firstName: 'Test',
      lastName: 'Provider',
      phone: '+1234567890',
      role: 'PROVIDER',
      status: 'ACTIVE',
      preferredLanguage: 'EN',
      avatar: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
    
    // Configurar localStorage
    localStorage.setItem('auth_token', validToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('fixelo-auth', JSON.stringify({
      state: {
        user,
        isAuthenticated: true
      },
      version: 0
    }))
    
    console.log('🔐 Mock auth configured successfully')
    console.log('👤 User:', user)
    console.log('🎫 Token set in localStorage')
    
    return { user, token: validToken }
  }
  return null
}

// Verificar se o token está expirado
export const isTokenExpired = () => {
  const token = localStorage.getItem('auth_token')
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
  } catch (error) {
    return true
  }
}

// Obter novo token da API
export const getNewToken = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'provider@test.com',
        password: 'test123'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      const { accessToken, refreshToken, user } = data
      
      // Configurar localStorage
      localStorage.setItem('auth_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      localStorage.setItem('fixelo-auth', JSON.stringify({
        state: {
          user,
          isAuthenticated: true
        },
        version: 0
      }))
      
      console.log('🔐 New token obtained successfully')
      return accessToken
    }
  } catch (error) {
    console.error('❌ Error getting new token:', error)
  }
  
  return null
}

// Executar automaticamente quando o script é carregado
if (typeof window !== 'undefined') {
  setupMockAuth()
} 