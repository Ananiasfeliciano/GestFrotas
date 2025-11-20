import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();

const partnerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    type: z.enum(["WORKSHOP", "SUPPLIER", "GAS_STATION"]),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export default (prisma: PrismaClient) => {
    // List all partners
    router.get('/', async (req, res) => {
        try {
            const partners = await prisma.partner.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.json(partners);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar parceiros' });
        }
    });

    // Create partner
    router.post('/', async (req, res) => {
        try {
            const data = partnerSchema.parse(req.body);
            const partner = await prisma.partner.create({ data });
            res.status(201).json(partner);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao criar parceiro' });
        }
    });

    // Update partner
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const data = partnerSchema.parse(req.body);
            const partner = await prisma.partner.update({
                where: { id },
                data
            });
            res.json(partner);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao atualizar parceiro' });
        }
    });

    // Delete partner
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.partner.delete({ where: { id } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir parceiro' });
        }
    });

    return router;
};
