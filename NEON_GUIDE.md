# 🗄️ Guia: Criar Banco PostgreSQL no Neon (GRÁTIS)

## Passo 1: Criar Conta no Neon

1. **Acesse**: https://neon.tech (já abri para você!)
2. **Clique em**: "Sign Up" ou "Get Started"
3. **Escolha uma opção**:
   - ✅ **Recomendado**: "Continue with GitHub" (mais rápido)
   - Ou: Email + senha

## Passo 2: Criar Projeto

Após fazer login, você verá a dashboard.

1. **Clique em**: "Create Project" (ou "New Project")
2. **Preencha os campos**:
   - **Project name**: `gestfrota`
   - **Database name**: `gestfrota` (ou deixe o padrão)
   - **Region**: Escolha a mais próxima:
     - 🇧🇷 Se tiver "São Paulo" → escolha essa
     - 🇺🇸 Caso contrário: "US East (Ohio)" ou "US East (N. Virginia)"
   - **Postgres version**: Deixe a mais recente (padrão)

3. **Clique em**: "Create Project"

## Passo 3: Copiar Connection String

Após criar, você verá uma tela com a **Connection String**.

1. **Procure por**: "Connection string" ou "Connection details"
2. **Você verá algo assim**:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/gestfrota?sslmode=require
   ```

3. **COPIE ESSA STRING COMPLETA** - você vai precisar dela!

4. **GUARDE EM ALGUM LUGAR SEGURO** (pode ser um arquivo .txt temporário)

## ⚠️ IMPORTANTE!

- A connection string contém:
  - Username (usuário do banco)
  - **Password** (senha - aparece só uma vez!)
  - Host (servidor do banco)
  - Database name (nome do banco)

- Se você perder a senha, terá que resetar.

## ✅ Pronto!

Quando você tiver copiado a connection string, **me envie** e eu vou:
1. Configurar no Vercel para a API
2. Fazer o deploy da API
3. Executar as migrations para criar as tabelas
4. Popular o banco com o usuário admin

**Copie e cole aqui a connection string que você recebeu** (começa com `postgresql://`)
