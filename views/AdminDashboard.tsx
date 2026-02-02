
import React, { useState, useMemo } from 'react';
import { Property, User, CityConfig, Contract, PropertyType } from '../types';

interface AdminDashboardProps {
  user: User | null;
  properties: Property[];
  users: User[];
  contracts: Contract[];
  activeCities: CityConfig[];
  neighborhoods: string[];
  onUpdateNeighborhoods: (list: string[]) => void;
  onToggleProp: (id: string) => void;
  onToggleUser: (id: string) => void;
  onVerifyUser: (id: string) => void;
  onToggleCity: (cityId: string) => void;
  onAddCity: (city: CityConfig) => void;
  onRemoveCity: (cityId: string) => void;
}

const BRAZIL_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
].sort();

const REGIONS = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'] as const;

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, properties, users, contracts, activeCities, neighborhoods, onUpdateNeighborhoods,
  onToggleProp, onToggleUser, onVerifyUser, onToggleCity, onAddCity, onRemoveCity 
}) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'props' | 'cities' | 'neighborhoods' | 'users'>('monitor');
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('RO');
  const [newCityRegion, setNewCityRegion] = useState<typeof REGIONS[number]>('Norte');
  const [newNeighborhood, setNewNeighborhood] = useState('');

  // Lógica das Métricas em Barra
  const chartData = useMemo(() => {
    const types = [PropertyType.HOUSE, PropertyType.APARTMENT, PropertyType.STUDIO, PropertyType.COMMERCIAL_ROOM];
    return types.map(type => ({
      label: type,
      total: properties.filter(p => p.type === type).length,
      active: properties.filter(p => p.type === type && p.isActive).length
    }));
  }, [properties]);

  const stats = useMemo(() => ({
    totalRevenue: properties.reduce((acc, p) => acc + p.price, 0),
    activeCount: properties.filter(p => p.isActive).length,
    verifiedUsers: users.filter(u => u.isVerified).length
  }), [properties, users]);

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    onAddCity({
      id: `city-${newCityName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      name: newCityName,
      state: newCityState,
      isActive: true,
      region: newCityRegion
    });
    setNewCityName('');
  };

  const handleAddNeighborhood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNeighborhood.trim()) return;
    onUpdateNeighborhoods([...neighborhoods, newNeighborhood.trim()].sort());
    setNewNeighborhood('');
  };

  if (!user || user.role !== 'admin') return <div className="p-20 text-center font-black text-slate-400 uppercase">Acesso Restrito</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Master */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-[1000] text-[#004a8e] tracking-tighter uppercase leading-none">Central <span className="text-[#ff8c00]">Master</span></h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2">Gestão Global da Plataforma</p>
          </div>
          
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
            {[
              { id: 'monitor', label: 'Monitor' },
              { id: 'props', label: 'Imóveis' },
              { id: 'cities', label: 'Pólos' },
              { id: 'neighborhoods', label: 'Bairros' },
              { id: 'users', label: 'Contas' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#004a8e] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. MONITOR (METRICS) */}
        {activeTab === 'monitor' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-sm font-black text-[#004a8e] uppercase tracking-widest">Inventário por Categoria</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#004a8e] rounded-full"></div><span className="text-[9px] font-black text-slate-400 uppercase">Ativos</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ff8c00] rounded-full"></div><span className="text-[9px] font-black text-slate-400 uppercase">Total</span></div>
                </div>
              </div>

              <div className="h-64 flex items-end justify-around gap-2 px-4">
                {chartData.map((d, i) => {
                  const max = Math.max(...chartData.map(x => x.total)) || 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="w-full flex items-end justify-center gap-1 h-48">
                        <div className="w-3 bg-[#ff8c00] rounded-t-md transition-all duration-700" style={{ height: `${(d.total/max)*100}%` }}></div>
                        <div className="w-3 bg-[#004a8e] rounded-t-md transition-all duration-700" style={{ height: `${(d.active/max)*100}%` }}></div>
                      </div>
                      <span className="mt-4 text-[9px] font-black text-slate-400 uppercase text-center leading-tight truncate w-full">{d.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Volume Total</p>
                <p className="text-3xl font-[1000] text-[#004a8e]">R$ {(stats.totalRevenue/1000).toFixed(1)}k</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Oferta Ativa</p>
                <p className="text-3xl font-[1000] text-[#ff8c00]">{stats.activeCount} Und</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Owners Verificados</p>
                <p className="text-3xl font-[1000] text-emerald-500">{stats.verifiedUsers}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. IMÓVEIS (PROPERTIES) */}
        {activeTab === 'props' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Imóvel</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Bairro</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {properties.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover grayscale" alt="" />
                        <span className="text-xs font-black text-slate-700 uppercase">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase">{p.location}</td>
                    <td className="px-8 py-5 text-xs font-black text-[#004a8e]">R$ {p.price}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => onToggleProp(p.id)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase ${p.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {p.isActive ? 'Online' : 'Pausado'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. PÓLOS (CITIES) */}
        {activeTab === 'cities' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-[#004a8e] uppercase mb-6">Injetar Novo Pólo Operacional</h3>
              <form onSubmit={handleAddCity} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow w-full">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Cidade</label>
                  <input 
                    type="text" 
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="Nome da Cidade..."
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00] transition-all"
                  />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">UF</label>
                  <select 
                    value={newCityState}
                    onChange={(e) => setNewCityState(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00] cursor-pointer"
                  >
                    {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Região</label>
                  <select 
                    value={newCityRegion}
                    onChange={(e) => setNewCityRegion(e.target.value as any)}
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00] cursor-pointer"
                  >
                    {REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full md:w-auto px-8 py-4 bg-[#004a8e] text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg hover:bg-[#ff8c00] transition-all">Ativar Pólo</button>
              </form>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCities.map(city => (
                <div key={city.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-[#ff8c00] transition-all shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-[#004a8e] uppercase leading-none">{city.name}</p>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">{city.state}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{city.region}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onToggleCity(city.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${city.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                      {city.isActive ? '✓' : '!'}
                    </button>
                    {city.id !== 'vilhena-ro' && (
                      <button onClick={() => onRemoveCity(city.id)} className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. BAIRROS (NEIGHBORHOODS) */}
        {activeTab === 'neighborhoods' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-bottom duration-500">
            <h3 className="text-sm font-black text-[#004a8e] uppercase mb-8">Mapeamento de Bairros (Vilhena)</h3>
            <form onSubmit={handleAddNeighborhood} className="flex gap-4 mb-10">
              <input 
                type="text" 
                value={newNeighborhood}
                onChange={(e) => setNewNeighborhood(e.target.value)}
                placeholder="Novo Bairro..."
                className="flex-grow p-4 bg-slate-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00]"
              />
              <button type="submit" className="px-8 py-4 bg-[#ff8c00] text-white font-black rounded-xl uppercase text-[10px] tracking-widest">Mapear</button>
            </form>
            <div className="flex flex-wrap gap-3">
              {neighborhoods.map(n => (
                <div key={n} className="px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase flex items-center gap-3">
                  {n}
                  <button onClick={() => onUpdateNeighborhoods(neighborhoods.filter(x => x !== n))} className="text-red-300 hover:text-red-500">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CONTAS (USERS) */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {users.map(u => (
              <div key={u.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#004a8e] font-black text-lg">{u.name.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-[#004a8e] uppercase text-xs">{u.name}</p>
                      {u.isVerified && <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>}
                    </div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{u.role} • {u.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!u.isVerified && u.role === 'owner' && (
                    <button onClick={() => onVerifyUser(u.id)} className="px-3 py-2 bg-emerald-50 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Verificar</button>
                  )}
                  <button onClick={() => onToggleUser(u.id)} className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${u.isBlocked ? 'bg-orange-500 text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                    {u.isBlocked ? 'Liberar' : 'Banir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
