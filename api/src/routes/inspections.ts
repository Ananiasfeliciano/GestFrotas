import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();

const inspectionSchema = z.object({
    vehicleId: z.string().uuid(),
    partnerId: z.string().uuid().optional().nullable(),
    status: z.string(), // PASSED, FAILED, PENDING
    items: z.string(), // JSON string
    notes: z.string().optional(),
    cost: z.number().optional(),
    odometer: z.number().optional(),
    fuelLevel: z.string().optional(),
    date: z.string().optional().transform(str => str ? new Date(str) : new Date()),
});

export default (prisma: PrismaClient) => {
    // List all inspections
    router.get('/', async (req, res) => {
        try {
            const inspections = await prisma.inspection.findMany({
                include: {
                    vehicle: true,
                    partner: true
                },
                orderBy: { date: 'desc' }
            });
            res.json(inspections);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar inspeções' });
        }
    });

    // Create inspection
    router.post('/', async (req, res) => {
        try {
            const data = inspectionSchema.parse(req.body);
            const inspection = await prisma.inspection.create({ data });
            res.status(201).json(inspection);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao criar inspeção' });
        }
    });

    // Update inspection
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const data = inspectionSchema.parse(req.body);
            const inspection = await prisma.inspection.update({
                where: { id },
                data
            });
            res.json(inspection);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao atualizar inspeção' });
        }
    });

    // Delete inspection
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.inspection.delete({ where: { id } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir inspeção' });
        }
    });

    return router;
};
