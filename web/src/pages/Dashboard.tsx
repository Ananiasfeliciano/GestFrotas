import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, AlertTriangle, Activity, ClipboardCheck, Plus, ArrowRight, Fuel, Wrench } from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeVehicles: 0,
        maintenanceVehicles: 0,
        totalPartners: 0,
        totalInspections: 0,
        pendingInspections: 0,
        availability: 0
    });

    const [vehicleStatusData, setVehicleStatusData] = useState<any[]>([]);
    const [inspectionHistoryData, setInspectionHistoryData] = useState<any[]>([]);
    const [recentInspections, setRecentInspections] = useState<any[]>([]);
    const [refuelingStats, setRefuelingStats] = useState({ totalCost: 0, totalLiters: 0 });
    const [recentRefuelings, setRecentRefuelings] = useState<any[]>([]);
    const [maintenanceStats, setMaintenanceStats] = useState({ totalCost: 0, totalMaintenances: 0 });
    const [recentMaintenances, setRecentMaintenances] = useState<any[]>([]);

    async function loadStats() {
        try {
            const [vehRes, partRes, inspRes, refuelRes, maintRes] = await Promise.all([
                api.get('/vehicles'),
                api.get('/partners'),
                api.get('/inspections'),
                api.get('/refuelings'),
                api.get('/maintenances')
            ]);

            const vehicles = vehRes.data;
            const partners = partRes.data;
            const inspections = inspRes.data;

            // Basic Stats
            setStats({
                totalVehicles: vehicles.length,
                activeVehicles: vehicles.filter((v: any) => v.status === 'active').length,
                maintenanceVehicles: vehicles.filter((v: any) => v.status === 'maintenance').length,
                totalPartners: partners.length,
                totalInspections: inspections.length,
                pendingInspections: inspections.filter((i: any) => i.status === 'PENDING').length,
                availability: vehicles.length > 0
                    ? Math.round((vehicles.filter((v: any) => v.status === 'active').length / vehicles.length) * 100)
                    : 0
            });

            // Chart Data: Vehicle Status
            const activeCount = vehicles.filter((v: any) => v.status === 'active').length;
            const maintenanceCount = vehicles.filter((v: any) => v.status === 'maintenance').length;
            const outOfServiceCount = vehicles.filter((v: any) => v.status === 'out_of_service').length;

            setVehicleStatusData([
                { name: 'Ativos', value: activeCount, color: '#22c55e' }, // Green
                { name: 'Manutenção', value: maintenanceCount, color: '#eab308' }, // Yellow
                { name: 'Fora de Serviço', value: outOfServiceCount, color: '#ef4444' }, // Red
            ]);

            // Chart Data: Inspections History (Last 6 months)
            const history = [];
            for (let i = 5; i >= 0; i--) {
                const date = subMonths(new Date(), i);
                const monthKey = format(date, 'yyyy-MM');
                const monthLabel = format(date, 'MMM', { locale: ptBR });

                const count = inspections.filter((insp: any) => insp.date.startsWith(monthKey)).length;
                history.push({ name: monthLabel.toUpperCase(), inspecoes: count });
            }
            setInspectionHistoryData(history);

            // Recent Activity
            setRecentInspections(inspections.slice(0, 5));

            // Refueling Stats
            const refuelings = refuelRes.data;
            const totalCost = refuelings.reduce((sum: number, r: any) => sum + (r.totalCost || 0), 0);
            const totalLiters = refuelings.reduce((sum: number, r: any) => sum + (r.liters || 0), 0);
            setRefuelingStats({ totalCost, totalLiters });
            setRecentRefuelings(refuelings.slice(0, 5));

            // Maintenance Stats
            const maintenances = maintRes.data;
            const totalMaintenanceCost = maintenances.reduce((sum: number, m: any) => sum + (m.cost || 0), 0);
            setMaintenanceStats({ totalCost: totalMaintenanceCost, totalMaintenances: maintenances.length });
            setRecentMaintenances(maintenances.slice(0, 5));

        } catch (error) {
            console.error('Erro ao carregar estatísticas', error);
        }
    }

    useEffect(() => { loadStats() }, []);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header & Quick Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Visão geral da sua frota</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/vehicles">
                            <Button variant="outline" size="sm">
                                <Plus size={16} className="mr-2" />
                                Veículo
                            </Button>
                        </Link>
                        <Link to="/partners">
                            <Button variant="outline" size="sm">
                                <Plus size={16} className="mr-2" />
                                Parceiro
                            </Button>
                        </Link>
                        <Link to="/inspections">
                            <Button size="sm">
                                <Plus size={16} className="mr-2" />
                                Inspeção
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-brand-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total de Veículos</CardTitle>
                            <Car className="h-4 w-4 text-brand-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                            <p className="text-xs text-gray-500">Frota cadastrada</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Disponibilidade</CardTitle>
                            <Activity className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.availability}%</div>
                            <p className="text-xs text-gray-500">{stats.activeVehicles} veículos ativos</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Manutenção</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.maintenanceVehicles}</div>
                            <p className="text-xs text-gray-500">Veículos parados</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Inspeções Pendentes</CardTitle>
                            <ClipboardCheck className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingInspections}</div>
                            <p className="text-xs text-gray-500">Aguardando revisão</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status da Frota</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={vehicleStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {vehicleStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Inspeções</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inspectionHistoryData}>
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                    <Bar dataKey="inspecoes" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentInspections.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhuma atividade recente.</p>
                            ) : (
                                recentInspections.map((insp) => (
                                    <div key={insp.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${insp.status === 'PASSED' ? 'bg-green-100 text-green-600' : insp.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                <ClipboardCheck size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Inspeção: {insp.vehicle?.plate}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(insp.date), 'dd/MM/yyyy')} • {insp.partner?.name || 'Interna'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-sm font-medium ${insp.status === 'PASSED' ? 'text-green-600' : insp.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {insp.status === 'PASSED' ? 'Aprovado' : insp.status === 'FAILED' ? 'Reprovado' : 'Pendente'}
                                            </span>
                                            <Link to="/inspections" className="text-gray-400 hover:text-brand-600">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Refueling Stats Card */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Custo Total Combustível</CardTitle>
                            <Fuel className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R$ {refuelingStats.totalCost.toFixed(2)}</div>
                            <p className="text-xs text-gray-500">{refuelingStats.totalLiters.toFixed(2)} litros abastecidos</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Refuelings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Últimos Abastecimentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentRefuelings.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum abastecimento registrado.</p>
                            ) : (
                                recentRefuelings.map((refuel) => (
                                    <div key={refuel.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                <Fuel size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {refuel.vehicle?.plate || 'Veículo não identificado'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(refuel.date), 'dd/MM/yyyy')} • {refuel.liters}L
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-900">
                                                R$ {refuel.totalCost?.toFixed(2) || '0.00'}
                                            </span>
                                            <Link to="/refuelings" className="text-gray-400 hover:text-brand-600">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Stats Card */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Custo Total Manutenções</CardTitle>
                            <Wrench className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R$ {maintenanceStats.totalCost.toFixed(2)}</div>
                            <p className="text-xs text-gray-500">{maintenanceStats.totalMaintenances} manutenções realizadas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Maintenances */}
                <Card>
                    <CardHeader>
                        <CardTitle>Últimas Manutenções</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentMaintenances.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhuma manutenção registrada.</p>
                            ) : (
                                recentMaintenances.map((maint) => (
                                    <div key={maint.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                                                <Wrench size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {maint.vehicle?.plate || 'Veículo não identificado'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(maint.date), 'dd/MM/yyyy')} • {maint.partner?.name || 'Oficina'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-gray-900 block">
                                                    R$ {maint.cost?.toFixed(2) || '0.00'}
                                                </span>
                                                <span className={`text-xs ${maint.status === 'COMPLETED' ? 'text-green-600' :
                                                        maint.status === 'IN_PROGRESS' ? 'text-yellow-600' :
                                                            'text-blue-600'
                                                    }`}>
                                                    {maint.status === 'COMPLETED' ? 'Concluído' :
                                                        maint.status === 'IN_PROGRESS' ? 'Em Andamento' :
                                                            'Agendado'}
                                                </span>
                                            </div>
                                            <Link to="/maintenances" className="text-gray-400 hover:text-brand-600">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
