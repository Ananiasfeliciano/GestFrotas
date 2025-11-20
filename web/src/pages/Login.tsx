import { useState, FormEvent } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, Truck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao fazer login';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Truck className="h-8 w-8" />
            GestFrota
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-6">Gerencie sua frota com eficiência e inteligência.</h1>
          <p className="text-brand-200 text-lg">
            Controle total sobre veículos, manutenções e motoristas em uma única plataforma.
          </p>
        </div>
        <div className="relative z-10 text-sm text-brand-300">
          © 2025 GestFrota
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GestFrota</h1>
            <p className="text-gray-600">Sistema de Gestão de Frotas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Entrar na Plataforma
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500">
            Não tem uma conta? <Link to="/register" className="text-brand-600 hover:underline font-medium">Cadastre-se gratuitamente</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
