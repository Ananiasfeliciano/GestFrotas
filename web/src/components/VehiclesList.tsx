import { useEffect, useState } from 'react'
import { api } from '../services/api';
import VehicleForm from './VehicleForm';
import { useAuth } from '../context/AuthContext';

type Vehicle = { 
  id: string; 
  plate: string; 
  model?: string; 
  brand?: string;
  year?: number;
  km?: number;
  status?: string;
}

export default function VehiclesList(){
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<any|null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const res = await api.get('/vehicles')
      setVehicles(res.data)
    }catch(e: any){ 
      setError(e.response?.data?.error || 'Erro ao carregar veículos')
    }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  async function handleDelete(id: string){
    if(!confirm('Tem certeza que deseja excluir este veículo?')) return;
    try{
      await api.delete(`/vehicles/${id}`);
      load();
    }catch(e: any){ 
      alert(e.response?.data?.error || 'Erro ao excluir') 
    }
  }

  const getStatusBadge = (status?: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    
    const statusLabels: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      maintenance: 'Manutenção'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs ${statusColors[status || 'active']}`}>
        {statusLabels[status || 'active']}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Veículos</h1>
        <div className="space-x-2">
          {canEdit && (
            <button 
              onClick={()=>{ setEditing(null); setShowForm(true); }} 
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              + Novo veículo
            </button>
          )}
          <button 
            onClick={load} 
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">
              {editing ? 'Editar Veículo' : 'Novo Veículo'}
            </h2>
            <button 
              onClick={()=>setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Fechar
            </button>
          </div>
          <VehicleForm 
            editItem={editing} 
            onSaved={()=>{ setShowForm(false); load(); }} 
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-8 bg-white rounded shadow">
          <p className="text-gray-500">Nenhum veículo cadastrado</p>
          {canEdit && (
            <button 
              onClick={()=>{ setEditing(null); setShowForm(true); }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Cadastrar primeiro veículo
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-lg font-bold text-indigo-600">{v.plate}</div>
                  {v.brand && v.model && (
                    <div className="text-sm text-gray-600">{v.brand} {v.model}</div>
                  )}
                </div>
                {getStatusBadge(v.status)}
              </div>
              
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                {v.year && <div>📅 Ano: {v.year}</div>}
                <div>🛣️ KM: {(v.km ?? 0).toLocaleString('pt-BR')}</div>
              </div>

              {(canEdit || canDelete) && (
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  {canEdit && (
                    <button 
                      onClick={()=>{ setEditing(v); setShowForm(true); }} 
                      className="flex-1 px-2 py-1 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
                    >
                      ✏️ Editar
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={()=>handleDelete(v.id)} 
                      className="flex-1 px-2 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50"
                    >
                      🗑️ Excluir
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
