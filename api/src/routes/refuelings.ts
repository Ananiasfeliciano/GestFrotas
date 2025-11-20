import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const router = Router();

const refuelingSchema = z.object({
    vehicleId: z.string().uuid(),
    date: z.string(),
    odometer: z.number().positive(),
    liters: z.number().positive(),
    costPerLiter: z.number().positive(),
    totalCost: z.number().positive(),
    fuelType: z.enum(['GASOLINE', 'DIESEL', 'ETHANOL', 'CNG']),
    driver: z.string().min(1),
    notes: z.string().optional(),
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

// Calculate consumption based on previous refueling
async function calculateConsumption(
    prisma: PrismaClient,
    vehicleId: string,
    currentOdometer: number,
    currentLiters: number
): Promise<number | null> {
    // Get the most recent refueling for this vehicle
    const previousRefueling = await prisma.refueling.findFirst({
        where: { vehicleId },
        orderBy: { odometer: 'desc' },
    });

    if (!previousRefueling) {
        // First refueling for this vehicle, no consumption to calculate
        return null;
    }

    const kmDriven = currentOdometer - previousRefueling.odometer;
    if (kmDriven <= 0) {
        return null; // Invalid odometer reading
    }

    // Consumption = km driven / liters used in current refueling
    const consumption = kmDriven / currentLiters;
    return Math.round(consumption * 100) / 100; // Round to 2 decimal places
}

export default (prisma: PrismaClient) => {
    // List all refuelings
    router.get('/', authenticate, async (req: any, res) => {
        try {
            const { vehicleId } = req.query;
            const where = vehicleId ? { vehicleId: vehicleId as string } : {};

            const refuelings = await prisma.refueling.findMany({
                where,
                include: { vehicle: true },
                orderBy: { date: 'desc' },
            });

            res.json(refuelings);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar abastecimentos' });
        }
    });

    // Get refueling by ID
    router.get('/:id', authenticate, async (req: any, res) => {
        try {
            const refueling = await prisma.refueling.findUnique({
                where: { id: req.params.id },
                include: { vehicle: true },
            });

            if (!refueling) {
                return res.status(404).json({ error: 'Abastecimento não encontrado' });
            }

            res.json(refueling);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar abastecimento' });
        }
    });

    // Get statistics
    router.get('/stats/summary', authenticate, async (req: any, res) => {
        try {
            const { vehicleId, startDate, endDate } = req.query;

            const where: any = {};
            if (vehicleId) where.vehicleId = vehicleId;
            if (startDate || endDate) {
                where.date = {};
                if (startDate) where.date.gte = new Date(startDate as string);
                if (endDate) where.date.lte = new Date(endDate as string);
            }

            const refuelings = await prisma.refueling.findMany({
                where,
                include: { vehicle: true },
            });

            // Calculate statistics
            const totalCost = refuelings.reduce((sum, r) => sum + r.totalCost, 0);
            const totalLiters = refuelings.reduce((sum, r) => sum + r.liters, 0);

            const refuelingsWithConsumption = refuelings.filter(r => r.consumption !== null);
            const avgConsumption = refuelingsWithConsumption.length > 0
                ? refuelingsWithConsumption.reduce((sum, r) => sum + (r.consumption || 0), 0) / refuelingsWithConsumption.length
                : 0;

            // Group by vehicle for per-vehicle stats
            const byVehicle = refuelings.reduce((acc: any, r) => {
                if (!acc[r.vehicleId]) {
                    acc[r.vehicleId] = {
                        vehicle: r.vehicle,
                        count: 0,
                        totalCost: 0,
                        totalLiters: 0,
                        consumptions: [],
                    };
                }
                acc[r.vehicleId].count++;
                acc[r.vehicleId].totalCost += r.totalCost;
                acc[r.vehicleId].totalLiters += r.liters;
                if (r.consumption) acc[r.vehicleId].consumptions.push(r.consumption);
                return acc;
            }, {});

            const vehicleStats = Object.values(byVehicle).map((v: any) => ({
                vehicle: v.vehicle,
                count: v.count,
                totalCost: v.totalCost,
                totalLiters: v.totalLiters,
                avgConsumption: v.consumptions.length > 0
                    ? v.consumptions.reduce((a: number, b: number) => a + b, 0) / v.consumptions.length
                    : null,
            }));

            res.json({
                totalRefuelings: refuelings.length,
                totalCost: Math.round(totalCost * 100) / 100,
                totalLiters: Math.round(totalLiters * 100) / 100,
                avgConsumption: Math.round(avgConsumption * 100) / 100,
                vehicleStats,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao calcular estatísticas' });
        }
    });

    // Create refueling
    router.post('/', authenticate, async (req: any, res) => {
        try {
            const data = refuelingSchema.parse(req.body);

            // Calculate consumption
            const consumption = await calculateConsumption(
                prisma,
                data.vehicleId,
                data.odometer,
                data.liters
            );

            const refueling = await prisma.refueling.create({
                data: {
                    ...data,
                    date: new Date(data.date),
                    consumption,
                },
                include: { vehicle: true },
            });

            res.status(201).json(refueling);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar abastecimento' });
        }
    });

    // Update refueling
    router.put('/:id', authenticate, async (req: any, res) => {
        try {
            const data = refuelingSchema.partial().parse(req.body);

            // If odometer or liters changed, recalculate consumption
            let consumption: number | null | undefined = undefined;
            if (data.odometer !== undefined || data.liters !== undefined) {
                const current = await prisma.refueling.findUnique({
                    where: { id: req.params.id },
                });

                if (current) {
                    consumption = await calculateConsumption(
                        prisma,
                        current.vehicleId,
                        data.odometer ?? current.odometer,
                        data.liters ?? current.liters
                    );
                }
            }

            const updateData: any = { ...data };
            if (data.date) updateData.date = new Date(data.date);
            if (consumption !== undefined) updateData.consumption = consumption;

            const refueling = await prisma.refueling.update({
                where: { id: req.params.id },
                data: updateData,
                include: { vehicle: true },
            });

            res.json(refueling);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            res.status(500).json({ error: 'Erro ao atualizar abastecimento' });
        }
    });

    // Delete refueling
    router.delete('/:id', authenticate, async (req: any, res) => {
        try {
            await prisma.refueling.delete({
                where: { id: req.params.id },
            });

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar abastecimento' });
        }
    });

    return router;
};
