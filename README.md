# GestFrota - Sistema de Gestão de Frotas

Sistema completo de gestão de frotas desenvolvido com stack moderna e pronto para produção na Vercel.

## 🚀 Stack Tecnológica

### Backend (API)
- **Node.js** + **Express** - Framework web robusto
- **TypeScript** - Tipagem estática
- **Prisma ORM** - ORM moderno para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Zod** - Validação de schemas
- **Bcrypt** - Hash de senhas

### Frontend (Web)
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento SPA
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
gestfrota/
├── api/                    # Backend
│   ├── src/
│   │   ├── middleware/     # Middlewares (auth, etc)
│   │   ├── prisma/         # Schema e seeds
│   │   ├── routes/         # Rotas da API
│   │   ├── validators/     # Schemas de validação (Zod)
│   │   └── server.ts       # Entry point
│   ├── .env.example        # Exemplo de variáveis
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json         # Config Vercel
├── web/                    # Frontend
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── context/        # Context API (Auth)
│   │   ├── pages/          # Páginas
│   │   ├── routes/         # Rotas protegidas
│   │   ├── services/       # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml      # Ambiente local
├── DEPLOY_VERCEL.md        # Guia de deploy
└── README.md
```

## 🔧 Funcionalidades

### ✅ Implementadas

- **Autenticação completa**
  - Login/Logout
  - JWT com expiração de 7 dias
  - Proteção de rotas
  - Context API para estado global

- **Gestão de Usuários**
  - Registro de usuários
  - Roles (admin, manager, operator)
  - Middleware de autorização

- **Gestão de Veículos**
  - CRUD completo (Create, Read, Update, Delete)
  - Validação de dados com Zod
  - Filtros e ordenação
  - Controle de permissões por role

- **Segurança**
  - Senhas hasheadas com bcrypt
  - Validação de entrada em todas as rotas
  - CORS configurado
  - Tratamento de erros centralizado
  - Health check endpoint

- **DevOps**
  - Docker Compose para desenvolvimento local
  - Configuração Vercel pronta
  - Migrations automáticas
  - Seeds de dados iniciais

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose (opcional)
- Git

### 1. Clone o repositório
```bash
git clone <seu-repo>
cd gestfrota
```

### 2. Configure as variáveis de ambiente

**API** (`api/.env`):
```bash
cp api/.env.example api/.env
```

Edite `api/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gestfrota?schema=public
JWT_SECRET=sua_chave_secreta_aqui
PORT=4000
SEED_ADMIN_EMAIL=admin@gestfrota.com
SEED_ADMIN_PASSWORD=Admin@123
```

**Web** (`web/.env`):
```bash
cp web/.env.example web/.env
```

Edite `web/.env`:
```env
VITE_API_URL=http://localhost:4000/api
```

### 3. Inicie o banco de dados
```bash
docker-compose up -d db
```

### 4. Configure a API
```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

A API estará rodando em http://localhost:4000

### 5. Configure o Frontend
```bash
cd web
npm install
npm run dev
```

O frontend estará em http://localhost:5173

### 6. Acesse o sistema
- URL: http://localhost:5173
- Email: admin@gestfrota.com
- Senha: Admin@123

## 🐳 Executar com Docker (Completo)

```bash
docker-compose up --build
```

Isso iniciará:
- PostgreSQL em `localhost:5432`
- API em `localhost:4000`
- Web em `localhost:5173`

## 📦 Deploy na Vercel

Siga o guia completo em [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)

**Resumo rápido:**
1. Crie um banco PostgreSQL (Neon, Supabase, Railway)
2. Push para Git
3. Importe na Vercel
4. Configure variáveis de ambiente
5. Deploy!

## 🔐 Roles e Permissões

| Role     | Permissões                                      |
|----------|-------------------------------------------------|
| admin    | Todas (CRUD veículos, usuários, deletar)       |
| manager  | Criar e editar veículos                         |
| operator | Apenas visualizar                               |

## 🧪 Endpoints da API

### Auth
- `POST /api/auth/register` - Criar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário autenticado

### Vehicles
- `GET /api/vehicles` - Listar veículos (autenticado)
- `GET /api/vehicles/:id` - Buscar veículo (autenticado)
- `POST /api/vehicles` - Criar veículo (admin/manager)
- `PUT /api/vehicles/:id` - Atualizar veículo (admin/manager)
- `DELETE /api/vehicles/:id` - Deletar veículo (admin)

### Health
- `GET /health` - Health check

## 🛠️ Scripts Disponíveis

### API
```bash
npm run dev          # Desenvolvimento com hot-reload
npm run build        # Build de produção
npm start            # Iniciar produção
npm run seed         # Popular banco com dados iniciais
npm run prisma:generate   # Gerar Prisma Client
npm run migrate:deploy    # Executar migrations
npm run vercel-build      # Build para Vercel
```

### Web
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
```

## 🔄 Próximas Melhorias Sugeridas

- [ ] Implementar refresh tokens
- [ ] Adicionar testes (Jest/Vitest)
- [ ] Dashboard com gráficos
- [ ] Gestão de manutenções
- [ ] Histórico de quilometragem
- [ ] Upload de documentos
- [ ] Notificações
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Multi-tenancy
- [ ] Logs de auditoria

## 🐛 Troubleshooting

### Erro: "Port already in use"
```bash
# Encontre o processo usando a porta
netstat -ano | findstr :4000
# Mate o processo
taskkill /PID <PID> /F
```

### Erro: Prisma Client não encontrado
```bash
cd api
npm run prisma:generate
```

### Erro: Migrations pendentes
```bash
cd api
npx prisma migrate deploy
```

## 📄 Licença

MIT

## 👨‍💻 Desenvolvedor

Desenvolvido com as melhores práticas por um Desenvolvedor Sênior.

---

**Desenvolvido por [Your Name]**

**⚡ GestFrota - Pronto para produção na Vercel!**
