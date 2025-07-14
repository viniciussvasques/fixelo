# 🌐 CONFIGURAÇÃO COMPLETA DO DOMÍNIO FIXELO

## 📋 **RESUMO DO SISTEMA**

O sistema Fixelo possui 4 aplicações principais:
- **Web App** (Next.js) - Interface principal para usuários
- **API Backend** (Node.js) - API REST para web e mobile
- **Admin Panel** (AdminJS) - Painel administrativo
- **Mobile Apps** (React Native) - Apps para clientes e prestadores

## 🏗️ **ARQUITETURA DE CONTAINERS**

```
┌─────────────────────────────────────────────────────┐
│                    NGINX PROXY                      │
├─────────────────────────────────────────────────────┤
│  Web App     │  API Server   │  Admin Panel         │
│  Container   │  Container    │  Container           │
│  Port 3000   │  Port 3001    │  Port 3002           │
├─────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis Cache  │  Portainer           │
│  Container   │  Container    │  Container           │
│  Port 5432   │  Port 6379    │  Port 9443           │
└─────────────────────────────────────────────────────┘
```

## 🌍 **CONFIGURAÇÃO DNS NO DYNADOT**

### **1. Registros Principais:**

**IMPORTANTE:** No Dynadot, para o domínio raiz (fixelo.app), deixe o campo "Subhost" **COMPLETAMENTE VAZIO**

```dns
Tipo: A
Nome: (campo Subhost VAZIO - não digite nada)
Valor: 178.156.159.193
TTL: 300

Tipo: A
Nome: www
Valor: 178.156.159.193
TTL: 300

Tipo: A
Nome: api
Valor: 178.156.159.193
TTL: 300

Tipo: A
Nome: admin
Valor: 178.156.159.193
TTL: 300
```

### **Como configurar no painel Dynadot:**
1. Acesse DNS Settings
2. Para o domínio principal (fixelo.app):
   - **Subhost:** **DEIXE COMPLETAMENTE VAZIO** (não digite nada)
   - **Record Type:** A
   - **IP Address:** 178.156.159.193
3. Para www.fixelo.app:
   - **Subhost:** www
   - **Record Type:** A  
   - **IP Address:** 178.156.159.193
4. Para api.fixelo.app:
   - **Subhost:** api
   - **Record Type:** A
   - **IP Address:** 178.156.159.193
5. Para admin.fixelo.app:
   - **Subhost:** admin
   - **Record Type:** A
   - **IP Address:** 178.156.159.193

### **2. Registros Opcionais (para subdomínios específicos):**

```dns
Tipo: CNAME
Nome: cdn
Valor: seu-dominio.com
TTL: 300

Tipo: CNAME
Nome: static
Valor: seu-dominio.com
TTL: 300
```

## 🚀 **COMANDOS DE DEPLOY**

### **1. Executar o script de configuração:**
```bash
sudo ./deploy-production.sh
```

### **2. Configurar variáveis de ambiente:**
```bash
# Edite o arquivo .env.production com suas credenciais
nano /var/www/fixelo/.env.production
```

### **3. Iniciar todos os serviços:**
```bash
systemctl start fixelo-stack
```

### **4. Verificar status:**
```bash
docker ps
systemctl status fixelo-stack
```

## 🔒 **CONFIGURAÇÃO SSL AUTOMÁTICA**

Após configurar o DNS, execute:
```bash
certbot --nginx -d fixelo.app -d www.fixelo.app -d api.fixelo.app -d admin.fixelo.app
```

## 📱 **URLs DOS SERVIÇOS**

### **Produção:**
- **Site Principal:** `https://fixelo.app`
- **API Mobile:** `https://api.fixelo.app`
- **Painel Admin:** `https://admin.fixelo.app`
- **Docker Manager:** `https://fixelo.app:9080`

### **Endpoints da API para Mobile:**
- **Base URL:** `https://api.fixelo.app`
- **Auth:** `https://api.fixelo.app/auth`
- **Users:** `https://api.fixelo.app/users`
- **Services:** `https://api.fixelo.app/services`
- **Orders:** `https://api.fixelo.app/orders`
- **WebSocket:** `wss://api.fixelo.app/socket.io`

## 🔧 **COMANDOS DE MANUTENÇÃO**

### **Atualizar sistema:**
```bash
cd /var/www/fixelo
git pull
docker-compose -f docker-compose.prod.yml build
systemctl restart fixelo-stack
```

### **Ver logs:**
```bash
# Logs de todos os containers
docker-compose -f docker-compose.prod.yml logs -f

# Logs específicos
docker-compose -f docker-compose.prod.yml logs -f web
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f admin

# Logs do Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### **Backup do banco:**
```bash
docker-compose -f docker-compose.prod.yml --profile backup run backup
```

### **Reiniciar serviços específicos:**
```bash
docker-compose -f docker-compose.prod.yml restart web
docker-compose -f docker-compose.prod.yml restart api
docker-compose -f docker-compose.prod.yml restart admin
```

## 📋 **CHECKLIST PÓS-DEPLOY**

- [ ] DNS configurado e propagado (teste: `nslookup fixelo.app`)
- [ ] SSL configurado para todos os subdomínios
- [ ] Todos os containers rodando (`docker ps`)
- [ ] Sites acessíveis via HTTPS
- [ ] API respondendo corretamente
- [ ] Painel admin funcionando
- [ ] WebSocket conectando (para chat em tempo real)
- [ ] Backup automático configurado
- [ ] Monitoramento ativo

## 🛡️ **SEGURANÇA**

### **Firewall configurado automaticamente:**
- Porta 22 (SSH)
- Porta 80 (HTTP - redireciona para HTTPS)
- Porta 443 (HTTPS)
- Porta 9080 (Portainer - acesso restrito)

### **Para restringir acesso ao painel admin, edite:**
```bash
nano /etc/nginx/sites-available/fixelo-production
```

E descomente as linhas:
```nginx
# allow SEU_IP;
# deny all;
```

## 📞 **SUPORTE**

### **Comandos de diagnóstico:**
```bash
# Status geral
docker ps
systemctl status fixelo-stack
nginx -t

# Conectividade
curl -I https://fixelo.app
curl -I https://api.fixelo.app
curl -I https://admin.fixelo.app

# Logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f
```

### **Solução de problemas comuns:**
1. **Site não carrega:** Verifique se o DNS propagou e SSL está ativo
2. **API não responde:** Verifique logs do container API
3. **Erro 502:** Verifique se os containers estão rodando
4. **SSL inválido:** Reexecute o certbot
5. **Containers param:** Verifique logs e reinicie o stack
