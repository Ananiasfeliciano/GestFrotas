# 📋 GestFrota - Checklist de Deploy

## ✅ Pré-Deploy (Checklist Local)

### 1. Código e Configuração
- [ ] Todas as alterações committadas no git
- [ ] Código testado localmente
- [ ] Build executado com sucesso: `npm run build:all`
- [ ] `.env.example` criados (API e Web)
- [ ] `.env` adicionados ao `.gitignore`

### 2. Variáveis de Ambiente
- [ ] `JWT_SECRET` gerado (use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] Variáveis configuradas em `api/.env`
- [ ] Variáveis configuradas em `web/.env`

### 3. Database
- [ ] Escolhido provedor (Neon/Supabase/Railway)
- [ ] `DATABASE_URL` obtida do provedor
- [ ] Schema Prisma atualizado com todos os modelos

## 🚀 Deploy - Passo a Passo

### Fase 1: GitHub
```bash
# 1. Inicializar repositório (se ainda não fez)
git init
git add .
git commit -m "feat: Deploy inicial GestFrota v1.0"
git branch -M main

# 2. Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/seu-usuario/gestfrota.git
git push -u origin main
```

### Fase 2: Database (PostgreSQL)

#### 📝 Opção Recomendada: Neon
1. Acessar: https://neon.tech
2. Criar novo projeto
3. Copiar connection string
4. Guardar para próxima fase

### Fase 3: Vercel - API (Backend)

1. Acessar: https://vercel.com/new
2. **Import Git Repository** → Selecionar seu repositório
3. Configurar projeto:
   - **Project Name**: `gestfrota-api`
   - **Framework Preset**: Other
   - **Root Directory**: `api`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`

4. **Environment Variables** (adicionar todas):
   ```
   DATABASE_URL=sua-connection-string-postgresql
   JWT_SECRET=seu-jwt-secret-gerado
   PORT=3001
   NODE_ENV=production
   SEED_ADMIN_EMAIL=admin@gestfrota.com
   SEED_ADMIN_PASSWORD=SuaSenhaSegura123!
   ```

5. Clicar em **Deploy**
6. **Aguardar** deploy finalizar
7. **Copiar** a URL da API (ex: `https://gestfrota-api.vercel.app`)

### Fase 4: Migrations e Seed

Após API deployada, executar via Vercel CLI:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Link ao projeto (selecionar gestfrota-api)
cd api
vercel link

# Executar migrations
vercel env pull
npx prisma generate
npx prisma migrate deploy

# Popular banco (criar usuário admin)
npm run seed
```

### Fase 5: Vercel - Web (Frontend)

1. Acessar: https://vercel.com/new
2. **Import Git Repository** → Mesmo repositório
3. Configurar projeto:
   - **Project Name**: `gestfrota`
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://gestfrota-api.vercel.app/api
   ```
   ⚠️ **Importante**: Use a URL da API copiada na Fase 3

5. Clicar em **Deploy**
6. Aguardar finalizar

## ✅ Pós-Deploy (Verificação)

### 1. Testes Funcionais
- [ ] Acessar URL do frontend (ex: `https://gestfrota.vercel.app`)
- [ ] Fazer login com credenciais do seed:
  - Email: `admin@gestfrota.com`
  - Senha: Conforme `SEED_ADMIN_PASSWORD`
- [ ] Testar navegação entre páginas
- [ ] Criar um veículo de teste
- [ ] Criar um parceiro de teste
- [ ] Criar uma manutenção de teste
- [ ] Verificar dashboard com dados

### 2. Verificações Técnicas
- [ ] API respondendo em `https://sua-api.vercel.app/health`
- [ ] Frontend carregando corretamente
- [ ] Sem erros 404 ou CORS no console
- [ ] Autenticação funcionando (JWT)
- [ ] Database conectado (sem erros de conexão)

### 3. Segurança
- [ ] Arquivo `.env` NÃO está no GitHub
- [ ] JWT_SECRET é diferente do exemplo
- [ ] Senha do admin foi alterada
- [ ] CORS configurado corretamente

## 📝 Informações Importantes

### URLs do Projeto
- **Frontend**: https://gestfrota.vercel.app
- **API**: https://gestfrota-api.vercel.app
- **GitHub**: https://github.com/seu-usuario/gestfrota

### Credenciais Iniciais
- **Email**: admin@gestfrota.com
- **Senha**: (definida em `SEED_ADMIN_PASSWORD`)

### Comandos Úteis

```bash
# Verificar logs da API
vercel logs gestfrota-api --follow

# Verificar logs do Frontend
vercel logs gestfrota --follow

# Redeployar API
cd api && vercel --prod

# Redeployar Frontend
cd web && vercel --prod
```

## 🆘 Troubleshooting

### Erro: "Cannot find module @prisma/client"
```bash
cd api
vercel env pull
npx prisma generate
vercel --prod
```

### Erro: "Database connection failed"
1. Verificar `DATABASE_URL` nas env vars do Vercel
2. Testar connection string localmente
3. Verificar se banco permite conexões externas

### Erro: "CORS policy"
1. Verificar `VITE_API_URL` no frontend
2. Confirmar que API permite origem do frontend
3. Checar arquivo `api/src/server.ts` configuração CORS

### Erro: "401 Unauthorized"
1. Verificar se `JWT_SECRET` é o mesmo na API
2. Fazer logout e login novamente
3. Limpar localStorage do navegador

## 📚 Próximos Passos

Após deploy bem-sucedido:

1. [ ] Configurar domínio customizado (opcional)
2. [ ] Configurar monitoramento (Sentry)
3. [ ] Configurar backups automáticos do banco
4. [ ] Adicionar mais usuários via Settings
5. [ ] Começar a usar o sistema!

---

**🎉 Parabéns! Seu GestFrota está no ar!**
