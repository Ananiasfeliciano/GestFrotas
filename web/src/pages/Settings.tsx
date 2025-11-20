import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Lock, Bell, LogOut, Trash2, Save, Users, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

type Tab = 'profile' | 'security' | 'preferences' | 'users' | 'account';

export default function Settings() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Profile state
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Users management state
    const [users, setUsers] = useState<any[]>([]);
    const [showUserForm, setShowUserForm] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'manager',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    async function loadUsers() {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        }
    }, [activeTab]);

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            await api.put('/users/me', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Perfil atualizado com sucesso!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await api.put('/users/me/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Senha alterada com sucesso!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateUser(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            await api.post('/users', newUserData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Usuário criado com sucesso!');
            setNewUserData({ name: '', email: '', password: '', role: 'manager' });
            setShowUserForm(false);
            loadUsers();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar usuário');
        } finally {
            setLoading(false);
        }
    }

    const tabs = [
        { id: 'profile' as Tab, label: 'Perfil', icon: User },
        { id: 'security' as Tab, label: 'Segurança', icon: Lock },
        { id: 'preferences' as Tab, label: 'Preferências', icon: Bell },
        { id: 'users' as Tab, label: 'Usuários', icon: Users },
        { id: 'account' as Tab, label: 'Conta', icon: LogOut },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                    <p className="text-gray-500">Gerencie suas preferências e configurações da conta</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                                            ? 'border-brand-500 text-brand-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                  `}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Message/Error Display */}
                {message && (
                    <div className="p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                        {error}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Perfil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nome Completo"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                                            {user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gerente' : 'Operador'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Membro desde</label>
                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                                            {user?.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={loading}>
                                        <Save size={18} className="mr-2" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Alterar Senha</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <Input
                                    label="Senha Atual"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nova Senha"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Confirmar Nova Senha"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={loading}>
                                        <Lock size={18} className="mr-2" />
                                        Alterar Senha
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferências do Sistema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                                    <select className="w-full md:w-1/2 rounded-md border border-gray-300 p-2" disabled>
                                        <option>Claro (em breve)</option>
                                    </select>
                                    <p className="text-sm text-gray-500 mt-1">Recurso disponível em breve</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                                    <select className="w-full md:w-1/2 rounded-md border border-gray-300 p-2" disabled>
                                        <option>Português (Brasil)</option>
                                    </select>
                                    <p className="text-sm text-gray-500 mt-1">Recurso disponível em breve</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notificações</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="rounded" defaultChecked disabled />
                                            <span className="text-sm text-gray-600">Notificações por email (em breve)</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="rounded" disabled />
                                            <span className="text-sm text-gray-600">Notificações push (em breve)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Gerenciar Usuários</CardTitle>
                                    <Button onClick={() => setShowUserForm(!showUserForm)}>
                                        <Plus size={18} className="mr-2" />
                                        Novo Usuário
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {showUserForm && (
                                    <form onSubmit={handleCreateUser} className="mb-6 p-4 border rounded-md bg-gray-50">
                                        <h3 className="font-medium text-lg mb-4">Criar Novo Usuário</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Input
                                                label="Nome"
                                                value={newUserData.name}
                                                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                                required
                                            />
                                            <Input
                                                label="Email"
                                                type="email"
                                                value={newUserData.email}
                                                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Input
                                                label="Senha"
                                                type="password"
                                                value={newUserData.password}
                                                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                                required
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                                                <select
                                                    className="w-full rounded-md border border-gray-300 p-2"
                                                    value={newUserData.role}
                                                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                                >
                                                    <option value="operator">Operador</option>
                                                    <option value="manager">Gerente</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" isLoading={loading}>Criar Usuário</Button>
                                            <Button type="button" variant="outline" onClick={() => setShowUserForm(false)}>Cancelar</Button>
                                        </div>
                                    </form>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((u) => (
                                                <tr key={u.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {u.role === 'admin' ? 'Administrador' : u.role === 'manager' ? 'Gerente' : 'Operador'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {format(new Date(u.createdAt), 'dd/MM/yyyy')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ações da Conta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Button onClick={() => logout()} variant="outline" className="w-full md:w-auto">
                                            <LogOut size={18} className="mr-2" />
                                            Sair da Conta
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Excluir sua conta removerá permanentemente todos os seus dados. Esta ação não pode ser desfeita.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                            onClick={() => alert('Recurso de exclusão de conta será implementado em breve')}
                                        >
                                            <Trash2 size={18} className="mr-2" />
                                            Excluir Conta
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </Layout>
    );
}
