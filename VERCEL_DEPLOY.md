# 🚀 Deploy no Vercel - GestFrota

## ✅ O que já temos:
- ✅ Código no GitHub: https://github.com/Ananiasfeliciano/gestfrota
- ✅ Banco de dados Neon criado e configurado

## 📋 Próximo Passo: Deploy da API

### Passo 1: Acessar Vercel

1. **Acesse**: https://vercel.com
2. **Faça login** com sua conta do GitHub (clique em "Continue with GitHub")

### Passo 2: Importar Projeto

1. **Clique em**: "Add New..." → "Project"
2. **Procure** pelo repositório `gestfrota`
3. **Clique em**: "Import" ao lado do repositório

### Passo 3: Configurar Projeto API

Na tela de configuração:

1. **Project Name**: Digite `gestfrota-api`

2. **Framework Preset**: Deixe como "Other"

3. **Root Directory**: 
   - Clique em "Edit"
   - Selecione a pasta **`api`**
   - Clique em "Continue"

4. **Build Command**: `npm run vercel-build`

5. **Output Directory**: `dist`

### Passo 4: Adicionar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione EXATAMENTE estas variáveis:

**Variável 1:**
- Name: `DATABASE_URL`
- Value: `postgresql://neondb_owner:npg_C7TsFYJjgt3G@ep-lively-rain-ahgh17jv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`

**Variável 2:**
- Name: `JWT_SECRET`
- Value: `5489be6f503e34e68280b09bdf729b3bfcae83a1cd9fc90212e2f863636ebdbd`

**Variável 3:**
- Name: `PORT`
- Value: `3001`

**Variável 4:**
- Name: `NODE_ENV`
- Value: `production`

**Variável 5:**
- Name: `SEED_ADMIN_EMAIL`
- Value: `admin@gestfrota.com`

**Variável 6:**
- Name: `SEED_ADMIN_PASSWORD`
- Value: `Admin@123!`

### Passo 5: Deploy!

1. **Clique em**: "Deploy"
2. **Aguarde** (vai levar uns 2-3 minutos)
3. Quando aparecer "Congratulations! 🎉", **COPIE A URL** da sua API

A URL será algo como: `https://gestfrota-api-xxxx.vercel.app`

---

## ⏭️ Depois do Deploy da API

Quando terminar, me avise e eu vou:
1. Executar as migrations no banco (criar tabelas)
2. Popular com o usuário admin
3. Te ajudar a fazer o deploy do frontend

**Me avise quando o deploy da API terminar e me envie a URL!**
