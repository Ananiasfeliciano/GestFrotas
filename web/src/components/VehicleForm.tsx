import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function VehicleForm({ onSaved, editItem }: { onSaved: () => void; editItem?: any }) {
  const [plate, setPlate] = useState(editItem?.plate || '');
  const [model, setModel] = useState(editItem?.model || '');
  const [brand, setBrand] = useState(editItem?.brand || '');
  const [year, setYear] = useState(editItem?.year || '');
  const [km, setKm] = useState(editItem?.km || '');
  const [status, setStatus] = useState(editItem?.status || 'active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPlate(editItem?.plate || '');
    setModel(editItem?.model || '');
    setBrand(editItem?.brand || '');
    setYear(editItem?.year || '');
    setKm(editItem?.km || '');
    setStatus(editItem?.status || 'active');
  }, [editItem]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { 
      plate: plate.trim().toUpperCase(), 
      model: model.trim() || undefined, 
      brand: brand.trim() || undefined, 
      year: year ? Number(year) : undefined,
      km: km ? Number(km) : undefined,
      status
    };

    try {
      if (editItem) {
        await api.put(`/vehicles/${editItem.id}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }
      onSaved();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Erro ao salvar veículo';
      const details = err.response?.data?.details;
      
      if (details && Array.isArray(details)) {
        setError(`${errorMsg}: ${details.map((d: any) => d.message).join(', ')}`);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Placa *</label>
          <input 
            value={plate} 
            onChange={e=>setPlate(e.target.value)} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="ABC-1234"
            required
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Marca</label>
          <input 
            value={brand} 
            onChange={e=>setBrand(e.target.value)} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Fiat, VW, etc"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Modelo</label>
          <input 
            value={model} 
            onChange={e=>setModel(e.target.value)} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Uno, Gol, etc"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ano</label>
          <input 
            type="number"
            value={year} 
            onChange={e=>setYear(e.target.value)} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="2020"
            min="1900"
            max="2100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quilometragem</label>
          <input 
            type="number"
            value={km} 
            onChange={e=>setKm(e.target.value)} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="50000"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={e=>setStatus(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="maintenance">Em Manutenção</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button 
          type="button"
          onClick={onSaved}
          className="px-4 py-2 border rounded hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Salvando...' : editItem ? '💾 Salvar' : '➕ Criar'}
        </button>
      </div>
    </form>
  );
}
