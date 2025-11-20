# 🚀 GestFrota - Guia de Deploy COMPLETO

## ✅ Parte 1: Git Local (JÁ FEITO!)

O código já está pronto no git local com o commit inicial criado.

---

## 📌 Parte 2: GitHub (FAÇA AGORA)

### Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `gestfrota`
   - **Description**: "Sistema de Gestão de Frotas - GestFrota"
   - **Visibility**: Public ou Private (sua escolha)
   - ⚠️ **NÃO** marque "Add README" ou ".gitignore"
3. Clique em **"Create repository"**

### Passo 2: Conectar e Fazer Push

Copie e execute estes comandos **UM POR VEZ** no terminal:

```bash
# 1. Adicionar remote (substitua SEU-USUARIO pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/SEU-USUARIO/gestfrota.git

# 2. Fazer push
git push -u origin main
```

**Se pedir credenciais:**
- Use seu username do GitHub
- Para senha, use um **Personal Access Token** (não a senha da conta)
- Como criar token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

---

## 🗄️ Parte 3: Criar Banco de Dados (Neon - GRÁTIS)

### Passo 1: Criar Conta e Projeto

1. Acesse: https://neon.tech
2. Clique em **"Sign Up"** (pode usar conta do GitHub)
3. Após login, clique em **"Create Project"**
4. Configure:
   - **Project name**: `gestfrota`
   - **Database name**: `gestfrota`
   - **Region**: Brazil (São Paulo) - se disponível, ou US East
5. Clique em **"Create Project"**

### Passo 2: Copiar Connection String

1. Na dashboard do Neon, você verá a **Connection String**
2. Copie a string que começa com `postgresql://`
3. **GUARDE ESSA STRING** - você vai precisar dela no Vercel

Exemplo:
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/gestfrota?sslmode=require
```

---

## ☁️ Parte 4: Deploy API no Vercel

### Passo 1: Importar Projeto

1. Acesse: https://vercel.com (faça login com GitHub)
2. Clique em **"Add New..."** → **"Project"**
3. Selecione o repositório **"gestfrota"**
4. Clique em **"Import"**

### Passo 2: Configurar Projeto API

Na tela de configuração:

1. **Project Name**: `gestfrota-api`
2. **Framework Preset**: `Other`
3. **Root Directory**: Clique em **"Edit"** → Selecione **`api`**
4. **Build Command**: `npm run vercel-build`
5. **Output Directory**: `dist`

### Passo 3: Adicionar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Cole a string do Neon |
| `JWT_SECRET` | Cole: `5489be6f503e34e68280b09bdf729b3bfcae83a1cd9fc90212e2f863636ebdbd` |
| `PORT` | `3001` |
| `NODE_ENV` | `production` |
| `SEED_ADMIN_EMAIL` | `admin@gestfrota.com` |
| `SEED_ADMIN_PASSWORD` | `Admin@123!` |

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde até ver "Congratulations! 🎉"
3. **COPIE A URL** da sua API (ex: `https://gestfrota-api.vercel.app`)

### Passo 5: Configurar Database (IMPORTANTE!)

1. Na página do projeto no Vercel, vá em **Settings** → **General**
2. Copie o nome do projeto
3. Abra um terminal e execute:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Ir para pasta da API
cd "c:/Users/bckmi/OneDrive/Desktop/FLEET GESTAO DE FROTAS/fleet-saas-latest/api"

# Linkar ao projeto
vercel link

# Puxar variáveis de ambiente
vercel env pull

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Popular banco (criar admin)
npm run seed
```

---

## 🌐 Parte 5: Deploy Web no Vercel

### Passo 1: Importar Novamente

1. Volte para: https://vercel.com
2. Clique em **"Add New..."** → **"Project"**
3. Selecione novamente o repositório **"gestfrota"**
4. Clique em **"Import"**

### Passo 2: Configurar Projeto Web

Na tela de configuração:

1. **Project Name**: `gestfrota` (ou `gestfrota-web`)
2. **Framework Preset**: `Vite`
3. **Root Directory**: Clique em **"Edit"** → Selecione **`web`**
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`

### Passo 3: Adicionar Variável de Ambiente

Clique em **"Environment Variables"** e adicione:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://gestfrota-api.vercel.app/api` |

⚠️ **IMPORTANTE**: Use a URL da API que você copiou no Passo 4 da API!

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde até ver "Congratulations! 🎉"
3. Clique em **"Visit"** para abrir seu site!

---

## ✅ Parte 6: Testar Tudo

1. Acesse a URL do seu frontend (ex: `https://gestfrota.vercel.app`)
2. Faça login com:
   - **Email**: `admin@gestfrota.com`
   - **Senha**: `Admin@123!`
3. Teste:
   - Criar um veículo
   - Criar um parceiro
   - Criar uma manutenção
   - Ver dashboard

---

## 🎯 URLs do Seu Projeto

Depois de tudo configurado, você terá:

- **Frontend**: `https://gestfrota.vercel.app`
- **API**: `https://gestfrota-api.vercel.app`
- **GitHub**: `https://github.com/SEU-USUARIO/gestfrota`
- **Database**: Painel do Neon

---

## 🆘 Se Algo Der Errado

### Erro na API:
1. Vá no Vercel → `gestfrota-api` → **Deployments**
2. Clique no último deployment → **View Function Logs**
3. Veja o erro e me envie

### Erro no Frontend:
1. Verifique se `VITE_API_URL` está correto
2. Abra o console do navegador (F12)
3. Veja os erros na aba "Console"

### Database não conecta:
1. Teste a connection string localmente
2. Verifique se está usando `?sslmode=require` no final
3. Confirme que adicionou a variável no Vercel

---

## 📝 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código pushado
- [ ] Banco Neon criado
- [ ] API deployada no Vercel
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Web deployado no Vercel
- [ ] Login funcionando
- [ ] Sistema operacional

**🎉 Parabéns! Seu GestFrota está no ar!**
