// Script de teste para autenticação
export const setupMockAuth = () => {
  if (typeof window !== 'undefined') {
    // Simular um token de autenticação
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    localStorage.setItem('auth_token', mockToken)
    localStorage.setItem('refresh_token', 'mock_refresh_token')
    
    console.log('Mock auth token set up successfully')
  }
}

export const clearMockAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    console.log('Mock auth cleared')
  }
}

// Executar automaticamente quando o script é carregado
if (typeof window !== 'undefined') {
  setupMockAuth()
} 