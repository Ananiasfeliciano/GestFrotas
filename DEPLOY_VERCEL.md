# 🚀 Deploy na Vercel - GestFrota

## 📋 Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Banco de dados PostgreSQL (recomendado: Neon, Supabase, ou Railway)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## 🗄️ Configurar Banco de Dados

### Opção 1: Neon (Recomendado)
1. Acesse https://neon.tech
2. Crie um novo projeto
3. Copie a string de conexão (DATABASE_URL)

### Opção 2: Supabase
1. Acesse https://supabase.com
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a connection string no formato PostgreSQL

### Opção 3: Railway
1. Acesse https://railway.app
2. Crie um novo projeto PostgreSQL
3. Copie a DATABASE_URL

## 📦 Deploy do Frontend (Web)

### 1. Push do código para o Git
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <seu-repositorio>
git push -u origin main
```

### 2. Configurar na Vercel
1. Acesse https://vercel.com/new
2. Importe seu repositório
3. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Adicione as variáveis de ambiente:
   - `VITE_API_URL`: URL da sua API (será configurada no próximo passo)

5. Clique em "Deploy"

## 🔧 Deploy da API (Backend)

### Opção A: Deploy Separado na Vercel

1. Crie um novo projeto na Vercel
2. Importe o mesmo repositório
3. Configure:
   - **Root Directory**: `api`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`

4. Adicione as variáveis de ambiente:
   ```
   DATABASE_URL=<sua-connection-string-postgresql>
   JWT_SECRET=<gere-uma-chave-secreta-forte>
   PORT=4000
   ```

5. Deploy e copie a URL da API

6. Volte no projeto do Frontend e atualize a variável:
   - `VITE_API_URL`: `https://sua-api.vercel.app/api`

### Opção B: Monorepo (Recomendado para Produção)

1. Na Vercel, crie um único projeto
2. Configure para usar o `vercel.json` na raiz
3. Adicione todas as variáveis de ambiente

## 🗝️ Variáveis de Ambiente

### API (Produção - Vercel)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=sua_chave_secreta_super_segura_aqui
PORT=4000
NODE_ENV=production
SEED_ADMIN_EMAIL=admin@gestfrota.com
SEED_ADMIN_PASSWORD=Admin@123!
```

### API (Local - Desenvolvimento)
```env
DATABASE_URL=file:./dev.db
JWT_SECRET=5489be6f503e34e68280b09bdf729b3bfcae83a1cd9fc90212e2f863636ebdbd
PORT=4000
NODE_ENV=development
SEED_ADMIN_EMAIL=admin@gestfrota.com
SEED_ADMIN_PASSWORD=Admin@123
```

### Web (`web/.env`)
```env
VITE_API_URL=https://sua-api.vercel.app/api
```

**⚠️ IMPORTANTE**: Nunca commite arquivos `.env` no Git!

**💡 DICA**: Para desenvolvimento local, use:
- `npm run dev:local` na pasta `api` (usa SQLite via `schema.local.prisma`)
- `npm run dev` usa o schema Postgres padrão (requer DATABASE_URL válido)

## 🔐 Gerar JWT_SECRET Seguro

```bash
# No terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📊 Executar Migrations e Seed

Após o primeiro deploy da API:

1. Acesse o painel da Vercel
2. Vá em "Deployments" > Selecione o último deployment
3. Abra o terminal da função ou use o Vercel CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Executar comando no projeto
vercel env pull
cd api
npm run migrate:deploy
npm run seed
```

## ✅ Checklist de Deploy

- [ ] Banco de dados PostgreSQL criado
- [ ] DATABASE_URL configurada
- [ ] JWT_SECRET gerado e configurado
- [ ] Frontend deployado na Vercel
- [ ] API deployada na Vercel
- [ ] VITE_API_URL apontando para a API
- [ ] Migrations executadas
- [ ] Seed executado (usuário admin criado)
- [ ] Teste de login funcionando
- [ ] CORS configurado corretamente

## 🧪 Testar Deploy

1. Acesse a URL do frontend
2. Faça login com:
   - Email: admin@gestfrota.com (ou o configurado em SEED_ADMIN_EMAIL)
   - Senha: Admin@123! (ou o configurado em SEED_ADMIN_PASSWORD)

## 🔄 Atualizações Futuras

Sempre que fizer push para o repositório:
1. Vercel fará rebuild automático
2. Se houver mudanças no schema do Prisma, execute migrations manualmente

## 🐛 Troubleshooting

### Erro: "Cannot find module @prisma/client"
```bash
cd api
npm run prisma:generate
```

### Erro: "Database connection failed"
- Verifique se DATABASE_URL está correta
- Confirme que o banco permite conexões externas
- Teste a conexão string localmente

### Erro: "CORS blocked"
- Verifique se VITE_API_URL está correta
- Confirme que o backend está permitindo a origem do frontend

### API retorna 404
- Verifique se as rotas começam com `/api`
- Confirme o vercel.json na pasta api

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Prisma com Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Neon Database](https://neon.tech/docs)

## 🎯 Próximos Passos Recomendados

1. Configurar domínio customizado na Vercel
2. Adicionar monitoramento (Sentry, LogRocket)
3. Implementar analytics
4. Configurar CI/CD mais robusto
5. Adicionar testes automatizados
6. Implementar rate limiting
7. Configurar backup automático do banco

---

**Desenvolvido com ❤️ para GestFrota**
