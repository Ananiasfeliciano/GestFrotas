# 🔧 Guia de Instalação e Configuração

## ⚡ Quick Start (Instalação Rápida)

### 1. Instalar dependências

**Backend (API):**
```powershell
cd api
npm install
```

**Frontend (Web):**
```powershell
cd web
npm install
```

### 2. Configurar variáveis de ambiente

**Backend** - Copie e edite:
```powershell
cd api
Copy-Item .env.example .env
# Edite o arquivo .env com suas configurações
```

**Frontend** - Copie e edite:
```powershell
cd web
Copy-Item .env.example .env
# Edite o arquivo .env
```

### 3. Configurar banco de dados (PostgreSQL)

**Opção A - Docker (Recomendado para dev):**
```powershell
docker-compose up -d db
```

**Opção B - PostgreSQL local:**
- Instale PostgreSQL 15+
- Crie um database chamado `fleet`
- Atualize `DATABASE_URL` no `.env`

### 4. Executar migrations e seed

```powershell
cd api
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 5. Iniciar servidores

**Terminal 1 - Backend:**
```powershell
cd api
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd web
npm run dev
```

### 6. Acessar aplicação

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Health Check: http://localhost:4000/health

**Credenciais padrão:**
- Email: `admin@fleet.local`
- Senha: `Admin@123`

---

## 📋 Troubleshooting de Instalação

### Erro: "Cannot find module"
```powershell
# Limpar cache e reinstalar
cd api
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

cd ../web
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Erro: Prisma Client não gerado
```powershell
cd api
npx prisma generate
```

### Erro: Porta já em uso
```powershell
# Verificar processo na porta 4000
netstat -ano | findstr :4000

# Matar processo (substitua <PID>)
taskkill /PID <PID> /F
```

### Erro: Conexão com banco recusada
1. Verifique se o PostgreSQL está rodando
2. Confirme a `DATABASE_URL` no `.env`
3. Teste a conexão:
```powershell
cd api
npx prisma db pull
```

---

## 🐳 Instalação com Docker (Tudo junto)

```powershell
docker-compose up --build
```

Depois execute as migrations dentro do container:
```powershell
docker-compose exec api npx prisma migrate dev --name init
docker-compose exec api npm run seed
```

---

## 🚀 Preparar para Produção

### Build do Frontend
```powershell
cd web
npm run build
```
Output estará em `web/dist/`

### Build do Backend
```powershell
cd api
npm run build
```
Output estará em `api/dist/`

### Executar em produção localmente
```powershell
# Backend
cd api
npm start

# Frontend (serve build)
cd web
npm run preview
```

---

## 📦 Variáveis de Ambiente Obrigatórias

### API (`api/.env`)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/fleet
JWT_SECRET=your-super-secret-key-here-min-32-chars
PORT=4000
```

### Web (`web/.env`)
```env
VITE_API_URL=http://localhost:4000/api
```

---

## ✅ Checklist de Instalação

- [ ] Node.js 20+ instalado
- [ ] PostgreSQL instalado/rodando (ou Docker)
- [ ] `api/.env` configurado
- [ ] `web/.env` configurado
- [ ] `npm install` executado em `/api`
- [ ] `npm install` executado em `/web`
- [ ] `npx prisma generate` executado
- [ ] `npx prisma migrate dev` executado
- [ ] `npm run seed` executado
- [ ] API rodando em http://localhost:4000
- [ ] Web rodando em http://localhost:5173
- [ ] Login funcionando

---

## 🔑 Gerar JWT_SECRET Seguro

```powershell
# Usando Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Ou PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

---

## 📚 Próximos Passos

Após instalação bem-sucedida:

1. ✅ Teste o login com credenciais padrão
2. ✅ Crie um novo veículo
3. ✅ Teste edição e exclusão
4. 📖 Leia `DEPLOY_VERCEL.md` para deploy
5. 📖 Leia `README.md` para documentação completa

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Verifique logs do terminal da API
3. Confirme versões:
```powershell
node --version  # deve ser 20+
npm --version   # deve ser 9+
docker --version # opcional
```

---

**✨ Instalação concluída! Bom desenvolvimento!**
