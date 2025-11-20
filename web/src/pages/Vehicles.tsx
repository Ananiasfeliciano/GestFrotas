import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import VehicleForm from '../components/VehicleForm';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Plus, RefreshCw, Edit2, Trash2, Calendar, Gauge } from 'lucide-react';

type Vehicle = {
    id: string;
    plate: string;
    model?: string;
    brand?: string;
    year?: number;
    km?: number;
    status?: string;
}

export default function Vehicles() {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canEdit = user?.role === 'admin' || user?.role === 'manager';
    const canDelete = user?.role === 'admin';

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (e: any) {
            setError(e.response?.data?.error || 'Erro ao carregar veículos');
        }
        setLoading(false);
    }

    useEffect(() => { load() }, []);

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) return;
        try {
            await api.delete(`/vehicles/${id}`);
            load();
        } catch (e: any) {
            alert(e.response?.data?.error || 'Erro ao excluir');
        }
    }

    const getStatusVariant = (status?: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'maintenance': return 'warning';
            case 'inactive': return 'secondary';
            default: return 'default';
        }
    };

    const getStatusLabel = (status?: string) => {
        const labels: Record<string, string> = {
            active: 'Ativo',
            inactive: 'Inativo',
            maintenance: 'Manutenção'
        };
        return labels[status || 'active'] || status;
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Veículos</h1>
                        <p className="text-gray-500">Gerencie a frota da sua empresa</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={load} title="Atualizar">
                            <RefreshCw size={20} />
                        </Button>
                        {canEdit && (
                            <Button onClick={() => { setEditing(null); setShowForm(true); }}>
                                <Plus size={20} className="mr-2" />
                                Novo Veículo
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {showForm && (
                    <Card className="mb-6 border-brand-100 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editing ? 'Editar Veículo' : 'Novo Veículo'}
                                </h2>
                                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </Button>
                            </div>
                            <VehicleForm
                                editItem={editing}
                                onSaved={() => { setShowForm(false); load(); }}
                            />
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <RefreshCw className="animate-spin text-brand-600" size={32} />
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">Nenhum veículo cadastrado</p>
                        {canEdit && (
                            <Button
                                variant="link"
                                onClick={() => { setEditing(null); setShowForm(true); }}
                                className="mt-2"
                            >
                                Cadastrar o primeiro
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {vehicles.map(v => (
                            <Card key={v.id} className="hover:shadow-md transition-shadow group">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-xl font-bold text-gray-900">{v.plate}</div>
                                            <div className="text-sm text-gray-500 font-medium">
                                                {v.brand} {v.model}
                                            </div>
                                        </div>
                                        <Badge variant={getStatusVariant(v.status)}>
                                            {getStatusLabel(v.status)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar size={16} className="mr-2 text-gray-400" />
                                            <span>Ano: {v.year || '-'}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Gauge size={16} className="mr-2 text-gray-400" />
                                            <span>{(v.km ?? 0).toLocaleString('pt-BR')} KM</span>
                                        </div>
                                    </div>

                                    {(canEdit || canDelete) && (
                                        <div className="flex gap-2 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {canEdit && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => { setEditing(v); setShowForm(true); }}
                                                >
                                                    <Edit2 size={14} className="mr-2" />
                                                    Editar
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleDelete(v.id)}
                                                >
                                                    <Trash2 size={14} className="mr-2" />
                                                    Excluir
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
