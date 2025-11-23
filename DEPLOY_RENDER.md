# Deploy GestFrota no Render + Netlify

## Guia Completo de Deploy

Este guia mostra como fazer deploy do sistema GestFrota usando **Render** (API + Database) e **Netlify** (Frontend).

---

## Parte 1: Deploy da API no Render

### Passo 1: Criar Conta no Render
1. Acesse https://render.com
2. Clique em "Get Started"
3. Conecte sua conta GitHub

### Passo 2: Criar PostgreSQL Database
1. No dashboard do Render, clique em **"New +"**
2. Selecione **"PostgreSQL"**
3. Configure:
   - **Name:** `gestfrota-db`
   - **Database:** `gestfrota`
   - **User:** `gestfrota`
   - **Region:** Oregon (Free)
   - **Plan:** Free
4. Clique em **"Create Database"**
5. ⏳ Aguarde a criação (1-2 minutos)
6. 📋 **Copie a "Internal Database URL"** (você vai precisar)

### Passo 3: Criar Web Service (API)
1. No dashboard, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:

**Build & Deploy:**
- **Name:** `gestfrota-api`
- **Region:** Oregon (Free)
- **Branch:** `main`
- **Root Directory:** `api`
- **Runtime:** Node
- **Build Command:**
  ```bash
  npm install && npx prisma generate --schema=./src/prisma/schema.prisma && npx prisma migrate deploy --schema=./src/prisma/schema.prisma
  ```
- **Start Command:**
  ```bash
  npx ts-node server.ts
  ```

**Environment Variables:**
Adicione estas variáveis (clique em "Add Environment Variable"):

```bash
NODE_VERSION=18
DATABASE_URL=[Cole a Internal Database URL aqui]
JWT_SECRET=sua-chave-secreta-super-segura-aqui-min-32-caracteres
NODE_ENV=production
PORT=4000
SEED_ADMIN_EMAIL=admin@gestfrota.com
SEED_ADMIN_PASSWORD=Admin@123
```

5. Clique em **"Create Web Service"**
6. ⏳ Aguarde o deploy (3-5 minutos)

### Passo 4: Executar Seed (Criar Usuário Admin)
1. Após o deploy, vá em **"Shell"** no menu lateral
2. Execute:
   ```bash
   npm run seed
   ```
3. ✅ Usuário admin criado!

### Passo 5: Testar a API
1. Copie a URL da sua API (ex: `https://gestfrota-api.onrender.com`)
2. Acesse: `https://gestfrota-api.onrender.com/health`
3. Deve retornar: `{"status":"ok"}`

---

## Parte 2: Deploy do Frontend no Netlify

### Passo 1: Criar Conta no Netlify
1. Acesse https://netlify.com
2. Clique em "Sign up"
3. Conecte sua conta GitHub

### Passo 2: Criar Novo Site
1. No dashboard, clique em **"Add new site"** → **"Import an existing project"**
2. Selecione **"Deploy with GitHub"**
3. Escolha seu repositório `GestFrotas`
4. Configure:

**Build settings:**
- **Base directory:** `web`
- **Build command:** `npm run build`
- **Publish directory:** `web/dist`

**Environment variables:**
Clique em "Add environment variables":
```bash
VITE_API_URL=https://gestfrota-api.onrender.com/api
```
⚠️ **IMPORTANTE:** Substitua `gestfrota-api.onrender.com` pela URL real da sua API do Render!

5. Clique em **"Deploy site"**
6. ⏳ Aguarde o deploy (2-3 minutos)

### Passo 3: Configurar Domínio (Opcional)
1. Vá em **"Site settings"** → **"Domain management"**
2. Clique em **"Options"** → **"Edit site name"**
3. Escolha um nome: `gestfrota-seuempresa.netlify.app`
4. Ou configure domínio customizado

---

## Parte 3: Testar o Sistema

### Acesse o Sistema
1. Abra a URL do Netlify (ex: `https://gestfrota-seuempresa.netlify.app`)
2. Faça login com:
   - **Email:** admin@gestfrota.com
   - **Senha:** Admin@123
3. ✅ Teste todas as funcionalidades!

---

## Configurações Importantes

### CORS na API
O arquivo `api/server.ts` já está configurado com CORS aberto. Se quiser restringir:

```typescript
app.use(cors({
  origin: 'https://gestfrota-seuempresa.netlify.app'
}));
```

### Variáveis de Ambiente - Resumo

**Render (API):**
```bash
NODE_VERSION=18
DATABASE_URL=[Auto-preenchido pelo Render]
JWT_SECRET=[Gere uma chave segura]
NODE_ENV=production
PORT=4000
SEED_ADMIN_EMAIL=admin@gestfrota.com
SEED_ADMIN_PASSWORD=Admin@123
```

**Netlify (Frontend):**
```bash
VITE_API_URL=https://sua-api.onrender.com/api
```

---

## Troubleshooting

### ❌ API não conecta
**Problema:** Frontend não consegue acessar a API

**Solução:**
1. Verifique se `VITE_API_URL` no Netlify está correto
2. Acesse `https://sua-api.onrender.com/health` - deve retornar `{"status":"ok"}`
3. Verifique logs no Render: **Logs** → **Deploy Logs**
4. Verifique se CORS está configurado

### ❌ Erro de Database
**Problema:** API não conecta ao banco

**Solução:**
1. Verifique se `DATABASE_URL` está correto no Render
2. Verifique se o database foi criado
3. Execute migrations: No Shell do Render:
   ```bash
   npx prisma migrate deploy --schema=./src/prisma/schema.prisma
   ```

### ❌ Erro 500 na API
**Problema:** Erros internos da API

**Solução:**
1. Vá em **Logs** no Render
2. Procure por erros
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Verifique se o Prisma Client foi gerado

### ❌ Build falhou no Netlify
**Problema:** Build do frontend falha

**Solução:**
1. Verifique se `base directory` está como `web`
2. Verifique se `build command` está como `npm run build`
3. Verifique se `publish directory` está como `web/dist`
4. Veja os logs de build no Netlify

### ⚠️ API hiberna (Free Tier)
**Problema:** Primeira requisição demora muito

**Solução:**
- No free tier do Render, a API hiberna após 15min de inatividade
- A primeira requisição após hibernação demora ~30-60s
- Para evitar: upgrade para plano pago ($7/mês) ou use serviço de ping

---

## Comandos Úteis

### Acessar Shell da API (Render)
1. Vá no serviço da API
2. Clique em **"Shell"** no menu lateral
3. Execute comandos:

```bash
# Ver logs
npm run logs

# Executar migrations
npx prisma migrate deploy --schema=./src/prisma/schema.prisma

# Criar usuário admin
npm run seed

# Ver status do banco
npx prisma studio --schema=./src/prisma/schema.prisma
```

### Rebuild da API
1. Vá em **"Manual Deploy"**
2. Clique em **"Clear build cache & deploy"**

### Rebuild do Frontend
1. No Netlify, vá em **"Deploys"**
2. Clique em **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## Custos

### Render (Free Tier)
- ✅ API: Grátis (com hibernação)
- ✅ PostgreSQL: Grátis por 90 dias, depois $7/mês
- ⚠️ Limite: 750 horas/mês

### Netlify (Free Tier)
- ✅ Hosting: Grátis
- ✅ 100GB bandwidth/mês
- ✅ Build: 300 minutos/mês

**Total:** Grátis por 90 dias, depois $7/mês

---

## Próximos Passos

1. ✅ Configure domínio customizado
2. ✅ Configure backup do banco de dados
3. ✅ Configure monitoramento (UptimeRobot)
4. ✅ Configure emails (SendGrid, Resend)
5. ✅ Configure analytics (Google Analytics, Plausible)

---

## Suporte

- **Render Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Prisma Docs:** https://www.prisma.io/docs

🎉 **Deploy concluído com sucesso!**
