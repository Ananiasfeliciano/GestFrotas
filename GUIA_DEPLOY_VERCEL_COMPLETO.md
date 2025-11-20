# 🚀 Guia Completo de Deploy - GestFrota na Vercel

## 📌 Visão Geral

Este guia irá te ajudar a fazer o deploy completo do sistema GestFrota na Vercel usando o dashboard web.

**O que vamos fazer:**
1. ✅ Deploy da API (Backend)
2. ✅ Configurar variáveis de ambiente
3. ✅ Rodar migrations do banco de dados
4. ✅ Deploy do Frontend (Web)
5. ✅ Testar o sistema completo

---

## 🔐 Informações Importantes

**Repositório GitHub:** https://github.com/Ananiasfeliciano/gestfrota

**Banco de Dados Neon:**
```
postgresql://neondb_owner:npg_C7TsFYJjgt3G@ep-lively-rain-ahgh17jv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**JWT Secret:**
```
5489be6f503e34e68280b09bdf729b3bfcae83a1cd9fc90212e2f863636ebdbd
```

---

## 📋 PARTE 1: Deploy da API

### Passo 1: Acessar Vercel

1. Acesse: **https://vercel.com**
2. Faça login com sua conta GitHub

### Passo 2: Importar Projeto

1. Clique em **"Add New..."** → **"Project"**
2. Procure pelo repositório **`gestfrota`**
3. Clique em **"Import"**

### Passo 3: Configurar API

Na tela de configuração do projeto:

#### 3.1 Nome do Projeto
```
gestfrota-api
```

#### 3.2 Framework Preset
- Selecione: **"Other"**

#### 3.3 Root Directory
- Clique em **"Edit"**
- Selecione a pasta **`api`**
- Clique em **"Continue"**

#### 3.4 Build & Development Settings

**Build Command:**
```bash
npm run vercel-build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

### Passo 4: Variáveis de Ambiente da API

Clique em **"Environment Variables"** e adicione as seguintes variáveis:

#### Variável 1: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://neondb_owner:npg_C7TsFYJjgt3G@ep-lively-rain-ahgh17jv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
- **Environment:** Production, Preview, Development (marque todos)

#### Variável 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `5489be6f503e34e68280b09bdf729b3bfcae83a1cd9fc90212e2f863636ebdbd`
- **Environment:** Production, Preview, Development (marque todos)

#### Variável 3: PORT
- **Name:** `PORT`
- **Value:** `3001`
- **Environment:** Production, Preview, Development (marque todos)

#### Variável 4: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production

#### Variável 5: SEED_ADMIN_EMAIL
- **Name:** `SEED_ADMIN_EMAIL`
- **Value:** `admin@gestfrota.com`
- **Environment:** Production, Preview, Development (marque todos)

#### Variável 6: SEED_ADMIN_PASSWORD
- **Name:** `SEED_ADMIN_PASSWORD`
- **Value:** `Admin@123!`
- **Environment:** Production, Preview, Development (marque todos)

### Passo 5: Deploy da API

1. Clique em **"Deploy"**
2. Aguarde o build (pode levar 2-5 minutos)
3. **IMPORTANTE:** Copie a URL da API quando o deploy terminar
   - Será algo como: `https://gestfrota-api-xxxx.vercel.app`

---

## 🗄️ PARTE 2: Rodar Migrations do Banco

Após o deploy da API, você precisa rodar as migrations para criar as tabelas no banco Neon.

### Opção A: Via Vercel CLI (Recomendado)

No seu terminal local, execute:

```bash
cd "c:\Users\bckmi\OneDrive\Desktop\FLEET GESTAO DE FROTAS\fleet-saas-latest\api"
npx prisma migrate deploy --schema=./src/prisma/schema.prisma
```

### Opção B: Via Neon Dashboard

1. Acesse: https://console.neon.tech
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute o SQL das migrations manualmente

---

## 🌐 PARTE 3: Deploy do Frontend

### Passo 1: Novo Projeto na Vercel

1. Na Vercel, clique em **"Add New..."** → **"Project"**
2. Procure novamente pelo repositório **`gestfrota`**
3. Clique em **"Import"**

### Passo 2: Configurar Frontend

#### 2.1 Nome do Projeto
```
gestfrota-web
```

#### 2.2 Framework Preset
- Selecione: **"Vite"**

#### 2.3 Root Directory
- Clique em **"Edit"**
- Selecione a pasta **`web`**
- Clique em **"Continue"**

#### 2.4 Build & Development Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

### Passo 3: Variáveis de Ambiente do Frontend

Clique em **"Environment Variables"** e adicione:

#### Variável: VITE_API_URL
- **Name:** `VITE_API_URL`
- **Value:** `https://SUA-URL-DA-API.vercel.app/api`
  - **IMPORTANTE:** Substitua `SUA-URL-DA-API` pela URL real da API que você copiou no Passo 5 da Parte 1
  - **NÃO ESQUEÇA** de adicionar `/api` no final!
- **Environment:** Production, Preview, Development (marque todos)

**Exemplo:**
```
https://gestfrota-api-abc123.vercel.app/api
```

### Passo 4: Deploy do Frontend

1. Clique em **"Deploy"**
2. Aguarde o build (pode levar 2-5 minutos)
3. Quando terminar, copie a URL do frontend
   - Será algo como: `https://gestfrota-web-xxxx.vercel.app`

---

## ✅ PARTE 4: Testar o Sistema

### 1. Acessar o Frontend

1. Abra a URL do frontend no navegador
2. Você deve ver a tela de login do GestFrota

### 2. Fazer Login

Use as credenciais do admin:
- **Email:** `admin@gestfrota.com`
- **Senha:** `Admin@123!`

### 3. Verificar Funcionalidades

Teste as principais funcionalidades:
- ✅ Dashboard
- ✅ Cadastro de Veículos
- ✅ Cadastro de Motoristas
- ✅ Cadastro de Parceiros
- ✅ Inspeções
- ✅ Manutenções
- ✅ Abastecimentos

---

## 🔧 Troubleshooting

### Problema: API não responde

**Solução:**
1. Verifique se todas as variáveis de ambiente foram configuradas
2. Vá em **Deployments** → Clique no deployment → **View Function Logs**
3. Procure por erros nos logs

### Problema: Frontend não conecta com a API

**Solução:**
1. Verifique se a variável `VITE_API_URL` está correta
2. Certifique-se de que adicionou `/api` no final da URL
3. Teste a API diretamente acessando: `https://sua-api.vercel.app/health`

### Problema: Erro de autenticação

**Solução:**
1. Verifique se as migrations foram executadas
2. Verifique se o `JWT_SECRET` está configurado corretamente
3. Tente fazer um novo deploy da API

### Problema: Banco de dados vazio

**Solução:**
1. Execute as migrations novamente
2. Execute o seed para criar o usuário admin:
```bash
cd "c:\Users\bckmi\OneDrive\Desktop\FLEET GESTAO DE FROTAS\fleet-saas-latest\api"
npm run seed
```

---

## 📝 Resumo das URLs

Após concluir o deploy, você terá:

- **API:** `https://gestfrota-api-xxxx.vercel.app`
- **Frontend:** `https://gestfrota-web-xxxx.vercel.app`
- **Banco de Dados:** Neon PostgreSQL (já configurado)

---

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. **Configurar domínio personalizado** (opcional)
   - Na Vercel, vá em Settings → Domains
   - Adicione seu domínio personalizado

2. **Monitorar logs**
   - Acompanhe os logs na aba "Logs" de cada projeto

3. **Configurar alertas**
   - Configure notificações para erros em produção

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs na Vercel
2. Verifique se todas as variáveis de ambiente estão corretas
3. Certifique-se de que o banco Neon está acessível

**Boa sorte com o deploy! 🚀**
