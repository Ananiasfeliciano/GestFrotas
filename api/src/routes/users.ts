import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const updateProfileSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
    email: z.string().email('Email inválido').optional(),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
});

// Middleware to extract user from token
const authenticate = (req: any, res: any, next: any) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Token não fornecido' });

    const token = auth.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

    try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        req.userId = payload.sub;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

export default (prisma: PrismaClient) => {
    // List all users
    router.get('/', authenticate, async (req: any, res) => {
        try {
            const users = await prisma.user.findMany({
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    });

    // Create new user
    router.post('/', authenticate, async (req: any, res) => {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
            }

            const hash = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { name, email, password: hash, role: role || 'manager' },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            });

            res.status(201).json(user);
        } catch (error: any) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Email já está em uso' });
            }
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    });

    // Get current user profile
    router.get('/me', authenticate, async (req: any, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.userId },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            });

            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar perfil' });
        }
    });

    // Update profile
    router.put('/me', authenticate, async (req: any, res) => {
        try {
            const data = updateProfileSchema.parse(req.body);

            const user = await prisma.user.update({
                where: { id: req.userId },
                data,
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            });

            res.json(user);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Email já está em uso' });
            }
            res.status(500).json({ error: 'Erro ao atualizar perfil' });
        }
    });

    // Change password
    router.put('/me/password', authenticate, async (req: any, res) => {
        try {
            const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

            const user = await prisma.user.findUnique({ where: { id: req.userId } });
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return res.status(400).json({ error: 'Senha atual incorreta' });
            }

            // Hash new password
            const hash = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: req.userId },
                data: { password: hash }
            });

            res.json({ message: 'Senha alterada com sucesso' });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao alterar senha' });
        }
    });

    return router;
};
