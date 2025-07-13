# 🔧 Configuração do Stripe para Fixelo

## Problema Identificado
O erro que você está vendo indica que as chaves do Stripe não estão configuradas corretamente no arquivo `.env`.

```
POST http://localhost:3001/api/plans/checkout-session 400 (Bad Request)
Erro: Please configure a valid Stripe secret key in environment variables.
```

## ✅ Solução: Configurar Chaves do Stripe

### 1. Obter Chaves do Stripe

1. **Acesse o Dashboard do Stripe:**
   - Vá para: https://dashboard.stripe.com/
   - Faça login ou crie uma conta

2. **Obter Chaves de Teste:**
   - No dashboard, vá para `Developers` > `API keys`
   - Copie as seguintes chaves:
     - **Publishable key** (começa com `pk_test_`)
     - **Secret key** (começa com `sk_test_` - clique em "Reveal")

### 2. Configurar no Arquivo .env

Edite o arquivo `.env` na raiz do projeto (`c:\fixelo\.env`) e substitua as chaves:

```bash
# Payment (Stripe Keys)
STRIPE_SECRET_KEY="sk_test_sua_chave_secreta_aqui"
STRIPE_PUBLISHABLE_KEY="pk_test_sua_chave_publica_aqui" 
STRIPE_WEBHOOK_SECRET="whsec_sua_chave_webhook_aqui"
```

### 3. Testar Configuração

Execute o script de teste para verificar se está funcionando:

```bash
node test-stripe.js
```

### 4. Configurar Produtos no Stripe (Opcional)

Se você quiser criar produtos personalizados:

```bash
node create-stripe-products.js
```

### 5. Reiniciar o Servidor

Após configurar as chaves, reinicie o servidor da API:

```bash
cd apps/api
npm run start:dev
```

## 🔍 Verificação

Para verificar se está funcionando:

1. Acesse: http://localhost:3000/dashboard/subscription
2. Tente criar uma sessão de checkout
3. O erro deve desaparecer

## 📝 Notas Importantes

- **Nunca comite** as chaves reais do Stripe no git
- Use sempre chaves de **teste** (`sk_test_`) durante desenvolvimento
- As chaves de produção (`sk_live_`) só devem ser usadas em produção

## 🆘 Comandos de Diagnóstico

```bash
# Testar conexão com Stripe
node test-stripe.js

# Verificar variáveis de ambiente
echo $env:STRIPE_SECRET_KEY

# Verificar se o arquivo .env existe
dir .env
```

## 🆘 Se Ainda Houver Problemas

Verifique se:
- A chave secreta tem pelo menos 50 caracteres
- A chave começa com `sk_test_` (para teste) ou `sk_live_` (para produção)
- Não há espaços extras no início/fim da chave
- O arquivo `.env` está na raiz do projeto (`c:\fixelo\.env`)
- O servidor foi reiniciado após configurar as variáveis
