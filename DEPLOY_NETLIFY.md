# Variáveis de Ambiente para Netlify

## Frontend (Web)

Configure estas variáveis no painel do Netlify (Site settings > Environment variables):

```
VITE_API_URL=https://sua-api.railway.app/api
```

**Importante:** Substitua `sua-api.railway.app` pela URL real da sua API após o deploy.

---

## Backend (API) - Deploy Separado

A API precisa ser deployada em um serviço que suporte Node.js e banco de dados.

### Opções Recomendadas:

1. **Railway** (Recomendado)
   - Suporta Node.js + PostgreSQL
   - Deploy automático via GitHub
   - Free tier disponível

2. **Render**
   - Suporta Node.js + PostgreSQL
   - Deploy automático via GitHub
   - Free tier disponível

3. **Heroku**
   - Suporta Node.js + PostgreSQL
   - Requer cartão de crédito

---

## Variáveis de Ambiente da API

Configure estas variáveis no serviço escolhido (Railway/Render):

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura-aqui

# Node Environment
NODE_ENV=production

# Port (geralmente fornecido automaticamente)
PORT=4000

# Seed Admin (opcional)
SEED_ADMIN_EMAIL=admin@gestfrota.com
SEED_ADMIN_PASSWORD=Admin@123
```

---

## Passos para Deploy

### 1. Deploy da API (Railway - Recomendado)

1. Acesse https://railway.app
2. Conecte sua conta GitHub
3. Crie novo projeto
4. Adicione PostgreSQL database
5. Adicione serviço do GitHub (selecione seu repositório)
6. Configure as variáveis de ambiente acima
7. Railway fará deploy automático

### 2. Deploy do Frontend (Netlify)

1. Acesse https://netlify.com
2. Conecte sua conta GitHub
3. Selecione o repositório
4. Configure:
   - Base directory: `web`
   - Build command: `npm run build`
   - Publish directory: `web/dist`
5. Adicione variável de ambiente:
   - `VITE_API_URL` = URL da sua API do Railway
6. Deploy!

---

## Após o Deploy

1. Acesse a URL do Netlify
2. Faça login com: admin@gestfrota.com / Admin@123
3. Teste todas as funcionalidades
4. Configure domínio customizado (opcional)

---

## Troubleshooting

### API não conecta
- Verifique se `VITE_API_URL` está correto
- Verifique se a API está rodando (acesse URL/health)
- Verifique CORS na API

### Erro de build no Netlify
- Verifique se `base directory` está como `web`
- Verifique se todas as dependências estão no package.json
- Verifique logs de build no Netlify

### Erro de database
- Verifique `DATABASE_URL` no Railway/Render
- Execute migrations: `npx prisma migrate deploy`
- Execute seed: `npm run seed`
