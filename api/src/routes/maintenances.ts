import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();

const maintenanceSchema = z.object({
    vehicleId: z.string().uuid(),
    partnerId: z.string().uuid(),
    description: z.string().min(3),
    date: z.string().transform(str => new Date(str)),
    cost: z.number().min(0),
    odometer: z.number().min(0),
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED']),
});

export default (prisma: PrismaClient) => {
    // List all maintenances
    router.get('/', async (req, res) => {
        try {
            const maintenances = await prisma.maintenance.findMany({
                include: {
                    vehicle: true,
                    partner: true
                },
                orderBy: { date: 'desc' }
            });
            res.json(maintenances);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar manutenções' });
        }
    });

    // Create maintenance
    router.post('/', async (req, res) => {
        try {
            const data = maintenanceSchema.parse(req.body);
            const maintenance = await prisma.maintenance.create({ data });
            res.status(201).json(maintenance);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao criar manutenção' });
        }
    });

    // Update maintenance
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const data = maintenanceSchema.parse(req.body);
            const maintenance = await prisma.maintenance.update({
                where: { id },
                data
            });
            res.json(maintenance);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao atualizar manutenção' });
        }
    });

    // Delete maintenance
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.maintenance.delete({ where: { id } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir manutenção' });
        }
    });

    return router;
};
