const { config } = require('dotenv');
const path = require('path');

// Carrega as variáveis de ambiente
config({ path: path.join(__dirname, '.env') });

console.log('🔧 Testando configurações de ambiente...\n');

// Testa JWT
console.log('JWT Configuration:');
console.log('- JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET ? '✅ Configurado' : '❌ Não encontrado');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '❌ Não encontrado');
console.log('- JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? '✅ Configurado' : '❌ Não encontrado');

// Testa Stripe
console.log('\nStripe Configuration:');
console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurado' : '❌ Não encontrado');
console.log('- STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? '✅ Configurado' : '❌ Não encontrado');

// Testa URLs
console.log('\nAPI Configuration:');
console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || '❌ Não encontrado');
console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Não encontrado');

// Testa Database
console.log('\nDatabase Configuration:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurado' : '❌ Não encontrado');

console.log('\n✅ Teste de configurações concluído!');
