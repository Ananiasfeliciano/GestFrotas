import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, Wrench, Calendar, Car, Trash2, DollarSign, Edit } from 'lucide-react';
import { format } from 'date-fns';

type Service = {
    id: string;
    description: string;
    cost: number;
};

type Maintenance = {
    id: string;
    vehicleId: string;
    partnerId: string;
    description: string;
    date: string;
    cost: number;
    odometer: number;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
    services?: Service[];
    vehicle?: { plate: string; model: string };
    partner?: { name: string };
};

export default function Maintenances() {
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        vehicleId: '',
        partnerId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        odometer: 0,
        status: 'SCHEDULED',
    });

    const [services, setServices] = useState<Service[]>([
        { id: '1', description: '', cost: 0 }
    ]);

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

    const addService = () => {
        setServices([...services, { id: Date.now().toString(), description: '', cost: 0 }]);
    };

    const removeService = (id: string) => {
        if (services.length > 1) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    const updateService = (id: string, field: 'description' | 'cost', value: string | number) => {
        setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleEdit = (maint: Maintenance) => {
        setIsEditing(true);
        setEditingId(maint.id);
        setFormData({
            vehicleId: maint.vehicleId,
            partnerId: maint.partnerId,
            description: maint.description,
            date: maint.date.split('T')[0],
            odometer: maint.odometer,
            status: maint.status,
        });

        try {
            const parsedServices = maint.services ? JSON.parse(maint.services as any) : [];
            setServices(parsedServices.length > 0 ? parsedServices : [{ id: '1', description: '', cost: 0 }]);
        } catch (e) {
            setServices([{ id: '1', description: '', cost: 0 }]);
        }

        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
        setFormData({
            vehicleId: '',
            partnerId: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            odometer: 0,
            status: 'SCHEDULED',
        });
        setServices([{ id: '1', description: '', cost: 0 }]);
    };

    const calculateTotal = () => {
        return services.reduce((sum, service) => sum + (service.cost || 0), 0);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const totalCost = calculateTotal();
            const servicesDescription = services
                .filter(s => s.description.trim())
                .map(s => `${s.description} - R$ ${s.cost.toFixed(2)}`)
                .join(' | ');

            const payload = {
                ...formData,
                description: servicesDescription || formData.description,
                cost: totalCost,
                services: JSON.stringify(services)
            };

            if (isEditing && editingId) {
                await api.put(`/maintenances/${editingId}`, payload);
            } else {
                await api.post('/maintenances', payload);
            }

            handleCancelEdit();
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
                            <CardTitle>{isEditing ? 'Editar Manutenção' : 'Registrar Manutenção Detalhada'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
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

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        label="Data"
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
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

                                {/* Services List */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">Serviços Realizados</h3>
                                        <Button type="button" variant="outline" size="sm" onClick={addService}>
                                            <Plus size={16} className="mr-2" />
                                            Adicionar Serviço
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {services.map((service, index) => (
                                            <div key={service.id} className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg border">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Descrição do Serviço {index + 1}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                                            placeholder="Ex: Troca de óleo, Alinhamento..."
                                                            value={service.description}
                                                            onChange={e => updateService(service.id, 'description', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Valor (R$)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                                            placeholder="0.00"
                                                            value={service.cost}
                                                            onChange={e => updateService(service.id, 'cost', Number(e.target.value))}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                {services.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeService(service.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors mt-6"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <DollarSign size={20} className="text-brand-600" />
                                                Valor Total da Manutenção
                                            </span>
                                            <span className="text-2xl font-bold text-brand-600">
                                                R$ {calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Input
                                    label="Observações Gerais (Opcional)"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Informações adicionais sobre a manutenção..."
                                />

                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit">{isEditing ? 'Atualizar Manutenção' : 'Salvar Manutenção'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4">
                    {maintenances.map(maint => {
                        let parsedServices: Service[] = [];
                        try {
                            parsedServices = maint.services ? JSON.parse(maint.services as any) : [];
                        } catch (e) {
                            parsedServices = [];
                        }

                        return (
                            <Card key={maint.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <Wrench size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">Manutenção - {maint.vehicle?.plate}</h3>
                                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Car size={14} />
                                                            {maint.vehicle?.model}
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
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(maint)}
                                                    className="mt-2"
                                                >
                                                    <Edit size={16} className="mr-2" />
                                                    Editar
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Services Detail */}
                                        {parsedServices.length > 0 && (
                                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                <h4 className="font-semibold text-sm text-gray-700 mb-3">Serviços Realizados:</h4>
                                                {parsedServices.map((service, idx) => (
                                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                                                        <span className="text-sm text-gray-700">{service.description}</span>
                                                        <span className="text-sm font-medium text-gray-900">R$ {service.cost.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center pt-3 border-t-2 border-brand-200">
                                                    <span className="font-bold text-gray-900">Total</span>
                                                    <span className="text-lg font-bold text-brand-600">
                                                        R$ {maint.cost.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {maint.description && !parsedServices.length && (
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                                {maint.description}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

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
