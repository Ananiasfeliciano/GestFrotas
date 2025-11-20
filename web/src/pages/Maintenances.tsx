import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, Wrench, Calendar, DollarSign, Car, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

type Maintenance = {
    id: string;
    vehicleId: string;
    partnerId: string;
    description: string;
    date: string;
    cost: number;
    odometer: number;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
    vehicle?: { plate: string; model: string };
    partner?: { name: string };
};

export default function Maintenances() {
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vehicleId: '',
        partnerId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        cost: 0,
        odometer: 0,
        status: 'SCHEDULED',
    });

    async function load() {
        setLoading(true);
        try {
            const [maintRes, vehRes, partRes] = await Promise.all([
                api.get('/maintenances'),
                api.get('/vehicles'),
                api.get('/partners')
            ]);
            setMaintenances(maintRes.data);
            setVehicles(vehRes.data);
            setPartners(partRes.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => { load() }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/maintenances', formData);
            setShowForm(false);
            setFormData({
                vehicleId: '',
                partnerId: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                cost: 0,
                odometer: 0,
                status: 'SCHEDULED',
            });
            load();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao salvar manutenção';
            alert(message);
        }
    }

    const statusColors = {
        SCHEDULED: 'bg-blue-100 text-blue-800',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
        COMPLETED: 'bg-green-100 text-green-800',
    };

    const statusLabels = {
        SCHEDULED: 'Agendado',
        IN_PROGRESS: 'Em Andamento',
        COMPLETED: 'Concluído',
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Manutenções</h1>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus size={20} className="mr-2" />
                        Nova Manutenção
                    </Button>
                </div>

                {showForm && (
                    <Card className="border-brand-100 shadow-lg">
                        <CardHeader>
                            <CardTitle>Registrar Manutenção</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Veículo</label>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={formData.vehicleId}
                                            onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {vehicles.map(v => (
                                                <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Oficina / Parceiro</label>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={formData.partnerId}
                                            onChange={e => setFormData({ ...formData, partnerId: e.target.value })}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {partners.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <Input
                                    label="Descrição do Serviço"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Input
                                        label="Data"
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Custo (R$)"
                                        type="number"
                                        value={formData.cost}
                                        onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                                        required
                                    />
                                    <Input
                                        label="Odômetro (KM)"
                                        type="number"
                                        value={formData.odometer}
                                        onChange={e => setFormData({ ...formData, odometer: Number(e.target.value) })}
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="SCHEDULED">Agendado</option>
                                            <option value="IN_PROGRESS">Em Andamento</option>
                                            <option value="COMPLETED">Concluído</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit">Salvar</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4">
                    {maintenances.map(maint => (
                        <Card key={maint.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Wrench size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{maint.description}</h3>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Car size={14} />
                                                    {maint.vehicle?.plate}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Wrench size={14} />
                                                    {maint.partner?.name}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {format(new Date(maint.date), 'dd/MM/yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <Badge className={statusColors[maint.status]}>
                                            {statusLabels[maint.status]}
                                        </Badge>
                                        <span className="font-bold text-gray-900">
                                            R$ {maint.cost.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {maintenances.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">
                            <Wrench size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Nenhuma manutenção registrada.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
