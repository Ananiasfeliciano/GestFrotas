# ⚡ Comandos Rápidos - Fleet SaaS

## 🚀 Instalação Inicial (First Time Setup)

```powershell
# 1. Instalar dependências
cd api; npm install; cd ..
cd web; npm install; cd ..

# 2. Configurar .env
cd api; Copy-Item .env.example .env; cd ..
cd web; Copy-Item .env.example .env; cd ..

# 3. Banco de dados
docker-compose up -d db

# 4. Migrations
cd api
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ..
```

---

## 🏃 Desenvolvimento (Daily)

```powershell
# Terminal 1 - Backend
cd api; npm run dev

# Terminal 2 - Frontend  
cd web; npm run dev

# Terminal 3 - Database (se usar Docker)
docker-compose up db
```

---

## 🗄️ Database

```powershell
# Gerar Prisma Client
cd api; npx prisma generate

# Criar migration
cd api; npx prisma migrate dev --name nome_da_migration

# Executar migrations (prod)
cd api; npx prisma migrate deploy

# Popular banco com seed
cd api; npm run seed

# Abrir Prisma Studio (GUI)
cd api; npx prisma studio

# Reset completo do banco
cd api; npx prisma migrate reset
```

---

## 🏗️ Build para Produção

```powershell
# Build Backend
cd api
npm run build
npm start

# Build Frontend
cd web
npm run build
npm run preview
```

---

## 🐳 Docker

```powershell
# Iniciar tudo
docker-compose up --build

# Apenas banco
docker-compose up -d db

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Ver logs
docker-compose logs -f api
docker-compose logs -f web
```

---

## 🧪 Testes & Debug

```powershell
# Testar API
curl http://localhost:4000/health

# Testar conexão DB
cd api; npx prisma db pull

# Ver schema atual
cd api; npx prisma format

# Validar schema
cd api; npx prisma validate
```

---

## 🔧 Troubleshooting

```powershell
# Limpar cache npm
cd api; Remove-Item -Recurse node_modules; npm install
cd web; Remove-Item -Recurse node_modules; npm install

# Verificar porta em uso
netstat -ano | findstr :4000
netstat -ano | findstr :5173

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Recriar Prisma Client
cd api
Remove-Item -Recurse node_modules/.prisma
Remove-Item -Recurse node_modules/@prisma
npx prisma generate
```

---

## 📦 Deploy Vercel

```powershell
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod

# Ver logs
vercel logs

# Baixar env vars
vercel env pull
```

---

## 🔐 Utilidades

```powershell
# Gerar JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Verificar versões
node --version
npm --version
docker --version

# Ver variáveis de ambiente
cd api; Get-Content .env
cd web; Get-Content .env
```

---

## 📊 Análise de Código

```powershell
# Ver tamanho do build
cd web; npm run build
Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum

# Listar dependências
cd api; npm list --depth=0
cd web; npm list --depth=0
```

---

## 🔄 Git

```powershell
# Init e primeiro commit
git init
git add .
git commit -m "Initial commit - Fleet SaaS optimized"
git branch -M main
git remote add origin <seu-repo>
git push -u origin main

# Ignorar .env (se já commitou)
git rm --cached api/.env
git rm --cached web/.env
git commit -m "Remove .env files"
```

---

## ⚙️ Configuração Rápida

### Gerar novo .env
```powershell
# API
@"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fleet
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
PORT=4000
SEED_ADMIN_EMAIL=admin@fleet.com
SEED_ADMIN_PASSWORD=Admin@123!
"@ | Out-File -FilePath api/.env -Encoding utf8

# Web
@"
VITE_API_URL=http://localhost:4000/api
"@ | Out-File -FilePath web/.env -Encoding utf8
```

---

## 📈 Monitoramento

```powershell
# Ver processos Node
Get-Process node

# Ver uso de memória
Get-Process node | Select-Object ProcessName, WorkingSet

# Logs em tempo real (Windows)
Get-Content api/logs/app.log -Wait -Tail 50
```

---

## 🎯 Atalhos Úteis

```powershell
# Resetar e recriar tudo
docker-compose down -v
cd api; Remove-Item -Recurse node_modules; npm install; npx prisma generate; npx prisma migrate dev; npm run seed
cd ../web; Remove-Item -Recurse node_modules; npm install

# Quick restart
docker-compose restart

# Ver status
docker-compose ps
```

---

## 📚 Referências Rápidas

- Docs API: http://localhost:4000/health
- Frontend: http://localhost:5173
- Prisma Studio: http://localhost:5555
- PostgreSQL: localhost:5432

---

**💡 Dica:** Salve este arquivo nos favoritos para referência rápida!
