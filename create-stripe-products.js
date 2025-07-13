const Stripe = require('stripe');
require('dotenv').config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  console.error('Please configure your Stripe secret key in .env file');
  process.exit(1);
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
  try {
    console.log('🔄 Criando produtos no Stripe...');

    // Criar produto Free (gratuito)
    const freeProduct = await stripe.products.create({
      name: 'Fixelo Free Plan',
      description: 'Free plan for service providers',
      metadata: {
        plan_type: 'FREE'
      }
    });

    console.log('✅ Produto Free criado:', freeProduct.id);

    // Criar produto Pro
    const proProduct = await stripe.products.create({
      name: 'Fixelo Pro Plan',
      description: 'Professional plan for service providers',
      metadata: {
        plan_type: 'PRO'
      }
    });

    console.log('✅ Produto Pro criado:', proProduct.id);

    // Criar preço para o plano Pro (mensal)
    const proPriceMonthly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 3480, // $34.80 em centavos
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan_type: 'PRO',
        billing_period: 'monthly'
      }
    });

    console.log('✅ Preço Pro mensal criado:', proPriceMonthly.id);

    // Criar preço para o plano Pro (anual)
    const proPriceYearly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 33408, // $34.80 * 12 * 0.8 (20% desconto anual)
      currency: 'usd',
      recurring: {
        interval: 'year'
      },
      metadata: {
        plan_type: 'PRO',
        billing_period: 'yearly'
      }
    });

    console.log('✅ Preço Pro anual criado:', proPriceYearly.id);

    console.log('\n📋 Resumo dos produtos criados:');
    console.log('Free Product ID:', freeProduct.id);
    console.log('Pro Product ID:', proProduct.id);
    console.log('Pro Monthly Price ID:', proPriceMonthly.id);
    console.log('Pro Yearly Price ID:', proPriceYearly.id);

    console.log('\n🔑 Chaves para configurar no backend:');
    console.log('STRIPE_FREE_PRODUCT_ID:', freeProduct.id);
    console.log('STRIPE_PRO_PRODUCT_ID:', proProduct.id);
    console.log('STRIPE_PRO_MONTHLY_PRICE_ID:', proPriceMonthly.id);
    console.log('STRIPE_PRO_YEARLY_PRICE_ID:', proPriceYearly.id);

  } catch (error) {
    console.error('❌ Erro ao criar produtos:', error);
  }
}

createStripeProducts(); 