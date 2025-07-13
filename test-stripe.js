const Stripe = require('stripe');
require('dotenv').config();

async function testStripeConnection() {
  console.log('🔍 Testando conexão com Stripe...\n');
  
  // Verificar se a chave existe
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY não encontrada no arquivo .env');
    console.error('Configure sua chave secreta do Stripe no arquivo .env');
    return;
  }
  
  // Verificar formato da chave
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
    console.error('❌ Formato de chave inválido. Deve começar com sk_test_ ou sk_live_');
    return;
  }
  
  if (key.length < 50) {
    console.error('❌ Chave muito curta. Chaves do Stripe devem ter pelo menos 50 caracteres');
    return;
  }
  
  console.log('✅ Formato da chave válido');
  console.log(`📋 Tipo: ${key.startsWith('sk_test_') ? 'Teste' : 'Produção'}`);
  console.log(`📏 Tamanho: ${key.length} caracteres\n`);
  
  try {
    const stripe = Stripe(key);
    
    // Testar conexão listando produtos
    console.log('🔄 Testando conexão...');
    const products = await stripe.products.list({ limit: 3 });
    
    console.log('✅ Conexão com Stripe estabelecida com sucesso!');
    console.log(`📦 Produtos encontrados: ${products.data.length}`);
    
    if (products.data.length > 0) {
      console.log('\n📋 Produtos existentes:');
      products.data.forEach(product => {
        console.log(`   - ${product.name} (${product.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Stripe:');
    console.error(`   ${error.message}`);
    
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Dica: Verifique se sua chave do Stripe está correta');
    }
  }
}

testStripeConnection();
