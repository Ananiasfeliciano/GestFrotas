import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit2, Trash2, Wrench, ShoppingBag, Fuel, Phone, MapPin, Mail } from 'lucide-react';

type Partner = {
    id: string;
    name: string;
    type: 'WORKSHOP' | 'SUPPLIER' | 'GAS_STATION';
    email?: string;
    phone?: string;
    address?: string;
};

export default function Partners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'WORKSHOP' | 'SUPPLIER' | 'GAS_STATION'>('WORKSHOP');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Partner | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    async function load() {
        setLoading(true);
        try {
            const res = await api.get('/partners');
            setPartners(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => { load() }, []);

    const filteredPartners = partners.filter(p => p.type === activeTab);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/partners/${editing.id}`, { ...formData, type: activeTab });
            } else {
                await api.post('/partners', { ...formData, type: activeTab });
            }
            setShowForm(false);
            setEditing(null);
            setFormData({ name: '', email: '', phone: '', address: '' });
            load();
        } catch (error) {
            alert('Erro ao salvar parceiro');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza?')) return;
        try {
            await api.delete(`/partners/${id}`);
            load();
        } catch (error) {
            alert('Erro ao excluir');
        }
    }

    function openForm(partner?: Partner) {
        if (partner) {
            setEditing(partner);
            setFormData({
                name: partner.name,
                email: partner.email || '',
                phone: partner.phone || '',
                address: partner.address || ''
            });
        } else {
            setEditing(null);
            setFormData({ name: '', email: '', phone: '', address: '' });
        }
        setShowForm(true);
    }

    const tabs = [
        { id: 'WORKSHOP', label: 'Oficinas', icon: Wrench },
        { id: 'SUPPLIER', label: 'Auto Peças', icon: ShoppingBag },
        { id: 'GAS_STATION', label: 'Postos', icon: Fuel },
    ] as const;

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Parceiros</h1>
                    <Button onClick={() => openForm()}>
                        <Plus size={20} className="mr-2" />
                        Novo Parceiro
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 border-b border-gray-200">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'border-brand-600 text-brand-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon size={16} className="mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {showForm && (
                    <Card className="border-brand-100 shadow-lg">
                        <CardHeader>
                            <CardTitle>{editing ? 'Editar Parceiro' : 'Novo Parceiro'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Nome"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <Input
                                        label="Telefone"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="Endereço"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit">Salvar</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPartners.map(partner => (
                        <Card key={partner.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="font-bold text-lg text-gray-900">{partner.name}</div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openForm(partner)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(partner.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    {partner.email && (
                                        <div className="flex items-center">
                                            <Mail size={14} className="mr-2 text-gray-400" />
                                            {partner.email}
                                        </div>
                                    )}
                                    {partner.phone && (
                                        <div className="flex items-center">
                                            <Phone size={14} className="mr-2 text-gray-400" />
                                            {partner.phone}
                                        </div>
                                    )}
                                    {partner.address && (
                                        <div className="flex items-center">
                                            <MapPin size={14} className="mr-2 text-gray-400" />
                                            {partner.address}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredPartners.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            Nenhum parceiro encontrado nesta categoria.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
