# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

## [2.0.0] - 2025-11-18

### ✨ Adicionado
- Validação de entrada com Zod em todas as rotas
- Health check endpoint (`/health`)
- Error handler centralizado e robusto
- Interceptor de erros no frontend (auto-logout em 401)
- Scripts otimizados para build na Vercel
- TypeScript em 100% do projeto (frontend + backend)
- `.gitignore` completo
- `.vercelignore` para otimizar deploy
- Documentação completa de deploy (`DEPLOY_VERCEL.md`)
- README.md melhorado com guias completos
- Graceful shutdown no servidor
- CORS configurado adequadamente
- Tratamento específico de erros do Prisma

### 🔧 Modificado
- Token JWT agora expira em 7 dias (era 1h)
- Todas mensagens de erro traduzidas para português
- Rotas retornam mensagens de erro mais descritivas
- AuthContext migrado para TypeScript com tipagem forte
- Login.jsx → Login.tsx com validação melhorada
- PrivateRoute.jsx → PrivateRoute.tsx
- api.js → api.ts com interceptors
- Melhorias de segurança nas senhas e validações

### 🐛 Corrigido
- Falta de tipos @types/bcrypt, @types/cors, @types/node
- Inconsistências entre .js e .tsx no frontend
- Falta de tratamento de erros em requisições async
- CORS blocking em produção
- Problemas de build na Vercel
- Falta de validação de dados de entrada

### 🔒 Segurança
- Validação de todos os inputs com Zod
- Mensagens de erro genéricas em produção
- Hash de senhas com bcrypt (10 rounds)
- JWT com secret configurável
- Proteção contra SQL injection via Prisma
- Proteção de rotas por role (RBAC)

### 📚 Documentação
- Guia completo de deploy na Vercel
- README expandido com exemplos práticos
- Documentação de endpoints da API
- Troubleshooting comum
- Checklist de deploy

### ⚡ Performance
- Build otimizado com Vite
- Migrations automáticas no deploy
- Prisma Client gerado no build
- Assets comprimidos no frontend

---

## [1.0.0] - Data Anterior

### Inicial
- Setup básico do projeto
- Autenticação JWT
- CRUD de veículos
- Docker Compose
- Frontend React com Tailwind
