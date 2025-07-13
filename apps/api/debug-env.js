require('dotenv').config({ path: '.env' });

console.log('=== DEBUG ENVIRONMENT VARIABLES ===');
console.log('Current working directory:', process.cwd());
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length);
console.log('STRIPE_SECRET_KEY type:', typeof process.env.STRIPE_SECRET_KEY);

console.log('\n=== All STRIPE variables ===');
Object.keys(process.env)
  .filter(key => key.startsWith('STRIPE_'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key]?.substring(0, 20)}...`);
  });

console.log('\n=== Validation test ===');
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.log('❌ STRIPE_SECRET_KEY not found');
} else if (stripeKey === 'sk_test_...' || stripeKey === 'sk_live_...') {
  console.log('❌ STRIPE_SECRET_KEY is placeholder');
} else if (stripeKey.length < 50) {
  console.log('❌ STRIPE_SECRET_KEY is too short:', stripeKey.length);
} else {
  console.log('✅ STRIPE_SECRET_KEY is valid');
}
