import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, FileText, CheckCircle, XCircle, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

type Inspection = {
    id: string;
    vehicleId: string;
    partnerId?: string;
    date: string;
    status: string;
    items: string; // JSON string
    notes?: string;
    cost?: number;
    odometer?: number;
    fuelLevel?: string;
    vehicle?: { plate: string; model: string };
    partner?: { name: string };
};

type ChecklistItem = {
    id: string;
    label: string;
    status: 'ok' | 'nok' | 'na';
    note?: string;
};

type ChecklistCategory = {
    id: string;
    title: string;
    items: ChecklistItem[];
};

const DEFAULT_CATEGORIES: ChecklistCategory[] = [
    {
        id: 'exterior',
        title: 'Exterior',
        items: [
            { id: 'ext_1', label: 'Lataria / Pintura', status: 'ok' },
            { id: 'ext_2', label: 'Vidros / Para-brisas', status: 'ok' },
            { id: 'ext_3', label: 'Espelhos Retrovisores', status: 'ok' },
            { id: 'ext_4', label: 'Limpadores', status: 'ok' },
            { id: 'ext_5', label: 'Luzes (Faróis, Setas, Freio)', status: 'ok' },
        ]
    },
    {
        id: 'interior',
        title: 'Interior',
        items: [
            { id: 'int_1', label: 'Bancos / Estofamento', status: 'ok' },
            { id: 'int_2', label: 'Painel de Instrumentos', status: 'ok' },
            { id: 'int_3', label: 'Ar Condicionado', status: 'ok' },
            { id: 'int_4', label: 'Cintos de Segurança', status: 'ok' },
        ]
    },
    {
        id: 'engine',
        title: 'Mecânica / Motor',
        items: [
            { id: 'mec_1', label: 'Nível de Óleo', status: 'ok' },
            { id: 'mec_2', label: 'Líquido de Arrefecimento', status: 'ok' },
            { id: 'mec_3', label: 'Fluido de Freio', status: 'ok' },
            { id: 'mec_4', label: 'Bateria', status: 'ok' },
            { id: 'mec_5', label: 'Correias / Mangueiras', status: 'ok' },
        ]
    },
    {
        id: 'tires',
        title: 'Pneus',
        items: [
            { id: 'pneu_1', label: 'Dianteiro Esquerdo', status: 'ok' },
            { id: 'pneu_2', label: 'Dianteiro Direito', status: 'ok' },
            { id: 'pneu_3', label: 'Traseiro Esquerdo', status: 'ok' },
            { id: 'pneu_4', label: 'Traseiro Direito', status: 'ok' },
            { id: 'pneu_5', label: 'Estepe', status: 'ok' },
        ]
    },
    {
        id: 'safety',
        title: 'Segurança',
        items: [
            { id: 'seg_1', label: 'Extintor', status: 'ok' },
            { id: 'seg_2', label: 'Macaco / Chave de Roda', status: 'ok' },
            { id: 'seg_3', label: 'Documentação', status: 'ok' },
        ]
    }
];

export default function Inspections() {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        vehicleId: '',
        partnerId: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        cost: 0,
        odometer: 0,
        fuelLevel: '1/1',
    });

    const [categories, setCategories] = useState<ChecklistCategory[]>(DEFAULT_CATEGORIES);

    async function load() {
        setLoading(true);
        try {
            const [inspRes, vehRes, partRes] = await Promise.all([
                api.get('/inspections'),
                api.get('/vehicles'),
                api.get('/partners')
            ]);
            setInspections(inspRes.data);
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
            // Flatten items for status check
            const allItems = categories.flatMap(c => c.items);
            const status = allItems.some(i => i.status === 'nok') ? 'FAILED' : 'PASSED';

            const payload = {
                ...formData,
                partnerId: formData.partnerId || undefined, // Send undefined if empty string
                status,
                items: JSON.stringify(categories),
            };

            await api.post('/inspections', payload);
            setShowForm(false);
            // Reset form
            setFormData({
                vehicleId: '',
                partnerId: '',
                date: new Date().toISOString().split('T')[0],
                notes: '',
                cost: 0,
                odometer: 0,
                fuelLevel: '1/1',
            });
            setCategories(DEFAULT_CATEGORIES); // Reset checklist
            load();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error || 'Erro ao salvar inspeção';
            alert(message);
        }
    }

    function generatePDF(inspection: Inspection) {
        const doc = new jsPDF();
        const categoriesData: ChecklistCategory[] = JSON.parse(inspection.items);

        // Header
        doc.setFillColor(67, 56, 202); // Indigo 700
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('Relatório de Inspeção Veicular', 14, 25);

        // Info Box
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        const vehicle = inspection.vehicle ? `${inspection.vehicle.plate} - ${inspection.vehicle.model}` : 'N/A';
        const partner = inspection.partner ? inspection.partner.name : 'Interna';
        const status = inspection.status === 'PASSED' ? 'APROVADO' : 'REPROVADO';

        autoTable(doc, {
            startY: 45,
            head: [['Veículo', 'Data', 'Status', 'Parceiro']],
            body: [[
                vehicle,
                format(new Date(inspection.date), 'dd/MM/yyyy'),
                status,
                partner
            ]],
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fontStyle: 'bold' }
        });

        // Details (KM, Fuel, Cost)
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 5,
            head: [['Odômetro', 'Combustível', 'Custo']],
            body: [[
                `${inspection.odometer || 0} KM`,
                inspection.fuelLevel || '-',
                `R$ ${inspection.cost || 0}`
            ]],
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fontStyle: 'bold' }
        });

        let currentY = (doc as any).lastAutoTable.finalY + 10;

        // Checklist Categories
        categoriesData.forEach(cat => {
            // Check if we need a new page
            if (currentY > 250) {
                doc.addPage();
                currentY = 20;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(cat.title, 14, currentY);
            currentY += 2;

            autoTable(doc, {
                startY: currentY,
                head: [['Item', 'Status', 'Observação']],
                body: cat.items.map(item => [
                    item.label,
                    item.status.toUpperCase(),
                    item.note || '-'
                ]),
                theme: 'grid',
                headStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0] },
                styles: { fontSize: 9 },
                columnStyles: {
                    0: { cellWidth: 80 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 'auto' }
                },
                didParseCell: function (data) {
                    if (data.section === 'body' && data.column.index === 1) {
                        const status = data.cell.raw as string;
                        if (status === 'OK') data.cell.styles.textColor = [22, 163, 74]; // Green
                        if (status === 'NOK') data.cell.styles.textColor = [220, 38, 38]; // Red
                    }
                }
            });

            currentY = (doc as any).lastAutoTable.finalY + 10;
        });

        if (inspection.notes) {
            if (currentY > 250) {
                doc.addPage();
                currentY = 20;
            }
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Observações Gerais:', 14, currentY);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const splitNotes = doc.splitTextToSize(inspection.notes, 180);
            doc.text(splitNotes, 14, currentY + 6);
        }

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount} - Gerado por GestFrota`, 105, 290, { align: 'center' });
        }

        doc.save(`inspecao-${inspection.vehicle?.plate}-${format(new Date(inspection.date), 'yyyyMMdd')}.pdf`);
    }

    const updateItemStatus = (catIdx: number, itemIdx: number, status: 'ok' | 'nok' | 'na') => {
        const newCategories = [...categories];
        newCategories[catIdx].items[itemIdx].status = status;
        setCategories(newCategories);
    };

    const updateItemNote = (catIdx: number, itemIdx: number, note: string) => {
        const newCategories = [...categories];
        newCategories[catIdx].items[itemIdx].note = note;
        setCategories(newCategories);
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Inspeções</h1>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus size={20} className="mr-2" />
                        Nova Inspeção
                    </Button>
                </div>

                {showForm && (
                    <Card className="border-brand-100 shadow-lg">
                        <CardHeader>
                            <CardTitle>Nova Inspeção Detalhada</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parceiro (Opcional)</label>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={formData.partnerId}
                                            onChange={e => setFormData({ ...formData, partnerId: e.target.value })}
                                        >
                                            <option value="">Selecione...</option>
                                            {partners.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Input
                                        label="Data"
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        label="Odômetro (KM)"
                                        type="number"
                                        value={formData.odometer}
                                        onChange={e => setFormData({ ...formData, odometer: Number(e.target.value) })}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Combustível</label>
                                        <select
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            value={formData.fuelLevel}
                                            onChange={e => setFormData({ ...formData, fuelLevel: e.target.value })}
                                        >
                                            <option value="Reserva">Reserva</option>
                                            <option value="1/4">1/4</option>
                                            <option value="1/2">1/2</option>
                                            <option value="3/4">3/4</option>
                                            <option value="1/1">Cheio</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Custo (R$)"
                                        type="number"
                                        value={formData.cost}
                                        onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Categorized Checklist */}
                                <div className="space-y-6">
                                    <h3 className="font-bold text-lg border-b pb-2">Checklist</h3>
                                    {categories.map((cat, catIdx) => (
                                        <div key={cat.id} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-brand-700 mb-3">{cat.title}</h4>
                                            <div className="space-y-3">
                                                {cat.items.map((item, itemIdx) => (
                                                    <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-3 rounded border shadow-sm">
                                                        <span className="w-48 font-medium text-sm">{item.label}</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItemStatus(catIdx, itemIdx, 'ok')}
                                                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${item.status === 'ok' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                            >
                                                                OK
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItemStatus(catIdx, itemIdx, 'nok')}
                                                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${item.status === 'nok' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                            >
                                                                NOK
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItemStatus(catIdx, itemIdx, 'na')}
                                                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${item.status === 'na' ? 'bg-gray-200 text-gray-700 ring-2 ring-gray-400' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                            >
                                                                N/A
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Observação..."
                                                            className="flex-1 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                                            value={item.note || ''}
                                                            onChange={e => updateItemNote(catIdx, itemIdx, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Input
                                    label="Observações Gerais"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />

                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit">Salvar Inspeção</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4">
                    {inspections.map(insp => (
                        <Card key={insp.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${insp.status === 'PASSED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {insp.status === 'PASSED' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{insp.vehicle?.plate} - {insp.vehicle?.model}</h3>
                                        <p className="text-sm text-gray-500">
                                            {format(new Date(insp.date), 'dd/MM/yyyy')} • {insp.partner?.name || 'Interna'}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => generatePDF(insp)}>
                                    <Printer size={16} className="mr-2" />
                                    Relatório PDF
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
