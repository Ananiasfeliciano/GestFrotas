# 🔐 Variáveis de Ambiente - GestFrota

## Para API (Vercel - gestfrota-api)

Copie e cole estas variáveis no Vercel quando for fazer o deploy da API:

```
DATABASE_URL=postgresql://neondb_owner:npg_C7TsFYJjgt3G@ep-lively-rain-ahgh17jv-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=5489be6f503e34e68280b09bdf729b3bfcae83a1cd9fc90212e2f863636ebdbd
PORT=3001
NODE_ENV=production
SEED_ADMIN_EMAIL=admin@gestfrota.com
SEED_ADMIN_PASSWORD=Admin@123!
```

## Para Web (Vercel - gestfrota-web)

⚠️ **IMPORTANTE**: Você vai adicionar isso DEPOIS do deploy da API!

```
VITE_API_URL=https://SUA-API.vercel.app/api
```

(Substitua `SUA-API` pela URL que o Vercel der para a API)

---

## ⚠️ SEGURANÇA

- **NÃO** compartilhe esse arquivo com ninguém
- **NÃO** commite no git (já está no .gitignore)
- Essas credenciais dão acesso ao seu banco de dados
