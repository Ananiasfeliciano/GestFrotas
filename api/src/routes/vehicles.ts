import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';
import { vehicleSchema, vehicleUpdateSchema } from '../validators/schemas';

export default function(prisma: PrismaClient) {
  const router = Router();

  router.get('/', authMiddleware, async (req, res) => {
    try {
      const list = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
  });

  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const v = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
      if (!v) return res.status(404).json({ error: 'Veículo não encontrado' });
      res.json(v);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  });

  router.post('/', authMiddleware, requireRole('admin','manager'), async (req, res) => {
    try {
      const validated = vehicleSchema.parse(req.body);
      const v = await prisma.vehicle.create({ data: validated });
      res.json(v);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Placa já cadastrada' });
      }
      res.status(500).json({ error: 'Erro ao criar veículo' });
    }
  });

  router.put('/:id', authMiddleware, requireRole('admin','manager'), async (req, res) => {
    try {
      const validated = vehicleUpdateSchema.parse(req.body);
      const v = await prisma.vehicle.update({
        where: { id: req.params.id },
        data: validated
      });
      res.json(v);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
  });

  router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      await prisma.vehicle.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      res.status(500).json({ error: 'Erro ao excluir veículo' });
    }
  });

  return router;
}
