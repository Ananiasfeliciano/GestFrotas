import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Plus, TrendingUp, DollarSign, Droplet, BarChart3 } from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Refueling {
    id: string;
    vehicleId: string;
    vehicle: { plate: string; model?: string };
    date: string;
    odometer: number;
    liters: number;
    costPerLiter: number;
    totalCost: number;
    fuelType: string;
    driver: string;
    consumption: number | null;
    notes?: string;
}

interface Stats {
    totalRefuelings: number;
    totalCost: number;
    totalLiters: number;
    avgConsumption: number;
    vehicleStats: {
        vehicle: { plate: string; model?: string };
        count: number;
        totalCost: number;
        totalLiters: number;
        avgConsumption: number | null;
    }[];
}

export default function Refuelings() {
    const [refuelings, setRefuelings] = useState<Refueling[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState('');

    const [formData, setFormData] = useState({
        vehicleId: '',
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        liters: '',
        costPerLiter: '',
        fuelType: 'GASOLINE',
        driver: '',
        notes: '',
    });

    useEffect(() => {
        loadData();
        loadVehicles();
    }, [selectedVehicle]);

    async function loadData() {
        try {
            const token = localStorage.getItem('token');
            const params = selectedVehicle ? `?vehicleId=${selectedVehicle}` : '';

            const [refuelingsRes, statsRes] = await Promise.all([
                api.get(`/refuelings${params}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get(`/refuelings/stats/summary${params}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
            ]);

            setRefuelings(refuelingsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadVehicles() {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/vehicles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVehicles(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const totalCost = parseFloat(formData.liters) * parseFloat(formData.costPerLiter);

            await api.post('/refuelings', {
                ...formData,
                odometer: parseFloat(formData.odometer),
                liters: parseFloat(formData.liters),
                costPerLiter: parseFloat(formData.costPerLiter),
                totalCost,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFormData({
                vehicleId: '',
                date: new Date().toISOString().split('T')[0],
                odometer: '',
                liters: '',
                costPerLiter: '',
                fuelType: 'GASOLINE',
                driver: '',
                notes: '',
            });
            setShowForm(false);
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao criar abastecimento');
        } finally {
            setLoading(false);
        }
    }

    // Prepare chart data
    const chartData = refuelings
        .filter(r => r.consumption !== null)
        .slice(0, 10)
        .reverse()
        .map(r => ({
            date: format(new Date(r.date), 'dd/MM'),
            consumption: r.consumption,
            vehicle: r.vehicle.plate,
        }));

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Abastecimentos</h1>
                        <p className="text-gray-500">Gerencie e monitore os abastecimentos da frota</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)}>
                        <Plus size={18} className="mr-2" />
                        Novo Abastecimento
                    </Button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Gasto</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            R$ {stats.totalCost.toFixed(2)}
                                        </p>
                                    </div>
                                    <DollarSign className="text-green-600" size={32} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Litros</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.totalLiters.toFixed(1)} L
                                        </p>
                                    </div>
                                    <Droplet className="text-blue-600" size={32} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Consumo Médio</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.avgConsumption.toFixed(1)} km/L
                                        </p>
                                    </div>
                                    <TrendingUp className="text-orange-600" size={32} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Abastecimentos</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.totalRefuelings}
                                        </p>
                                    </div>
                                    <BarChart3 className="text-purple-600" size={32} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Consumption Chart */}
                {chartData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Consumo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis label={{ value: 'km/L', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="consumption" stroke="#f97316" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filtrar por Veículo
                                </label>
                                <select
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    value={selectedVehicle}
                                    onChange={(e) => setSelectedVehicle(e.target.value)}
                                >
                                    <option value="">Todos os veículos</option>
                                    {vehicles.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.plate} {v.model && `- ${v.model}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form */}
                {showForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Novo Abastecimento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Veículo *
                                        </label>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={formData.vehicleId}
                                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                            required
                                        >
                                            <option value="">Selecione o veículo</option>
                                            {vehicles.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    {v.plate} {v.model && `- ${v.model}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <Input
                                        label="Data *"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Quilometragem (km) *"
                                        type="number"
                                        step="0.1"
                                        value={formData.odometer}
                                        onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Litros *"
                                        type="number"
                                        step="0.01"
                                        value={formData.liters}
                                        onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Preço por Litro (R$) *"
                                        type="number"
                                        step="0.01"
                                        value={formData.costPerLiter}
                                        onChange={(e) => setFormData({ ...formData, costPerLiter: e.target.value })}
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de Combustível *
                                        </label>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={formData.fuelType}
                                            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                            required
                                        >
                                            <option value="GASOLINE">Gas olina</option>
                                            <option value="DIESEL">Diesel</option>
                                            <option value="ETHANOL">Etanol</option>
                                            <option value="CNG">GNV</option>
                                        </select>
                                    </div>

                                    <Input
                                        label="Condutor *"
                                        value={formData.driver}
                                        onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                        required
                                    />
                                </div>

                                <Input
                                    label="Observações"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />

                                <div className="flex gap-2">
                                    <Button type="submit" isLoading={loading}>Salvar</Button>
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Refuelings List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Abastecimentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Km</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Litros</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condutor</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {refuelings.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(r.date), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {r.vehicle.plate}
                                                {r.vehicle.model && <span className="text-gray-500 ml-1">({r.vehicle.model})</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {r.odometer.toLocaleString()} km
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {r.liters.toFixed(2)} L
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                R$ {r.totalCost.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                                                {r.consumption ? `${r.consumption.toFixed(2)} km/L` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {r.driver}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Per-Vehicle Stats */}
                {stats && stats.vehicleStats.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Estatísticas por Veículo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Abastecimentos</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Gasto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Litros</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumo Médio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {stats.vehicleStats.map((vs, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {vs.vehicle.plate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {vs.count}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    R$ {vs.totalCost.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {vs.totalLiters.toFixed(2)} L
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                                                    {vs.avgConsumption ? `${vs.avgConsumption.toFixed(2)} km/L` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}
