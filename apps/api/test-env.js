require('dotenv').config({ path: '.env' });

console.log('🔍 TEST - STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);
console.log('🔍 TEST - STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length);
console.log('🔍 TEST - Current working directory:', process.cwd());
console.log('🔍 TEST - NODE_ENV:', process.env.NODE_ENV); 