import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { registerSchema, loginSchema } from '../validators/schemas';

export default function (prisma: PrismaClient) {
  const router = Router();
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

  router.post('/register', async (req, res) => {
    console.log('Register request received:', req.body);
    try {
      const validated = registerSchema.parse(req.body);
      console.log('Validation passed');
      const hash = await bcrypt.hash(validated.password, 10);
      console.log('Password hashed');
      const user = await prisma.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          password: hash,
          role: validated.role
        }
      });
      console.log('User created:', user.id);
      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: 'Erro ao criar usuário: ' + error.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const validated = loginSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { email: validated.email } });
      if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
      const ok = await bcrypt.compare(validated.password, user.password);
      if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
      const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  });

  router.get('/me', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Token não fornecido' });
    const token = auth.split(' ')[1];
    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (e) {
      res.status(401).json({ error: 'Token inválido' });
    }
  });

  return router;
}
