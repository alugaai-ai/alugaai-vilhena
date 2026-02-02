
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Property, FilterState, PropertyType } from '../types';
import PropertyCard from '../components/PropertyCard';

interface ListingsProps {
  properties: Property[];
  neighborhoods: string[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const Listings: React.FC<ListingsProps> = ({ properties, neighborhoods, favorites, onToggleFavorite }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    search: '',
    city: '',
    neighborhood: '',
    state: '',
    features: []
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (showOnlyFavorites && !favorites.includes(p.id)) return false;
      
      const matchSearch = p.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          p.location.toLowerCase().includes(filters.search.toLowerCase());
      const matchMin = filters.minPrice === '' || p.price >= parseInt(filters.minPrice);
      const matchMax = filters.maxPrice === '' || p.price <= parseInt(filters.maxPrice);
      const matchNeighborhood = filters.neighborhood === '' || p.location.toLowerCase().includes(filters.neighborhood.toLowerCase());
      const matchType = filters.type === '' || p.type === filters.type;
      
      return matchSearch && matchMin && matchMax && matchNeighborhood && matchType;
    });
  }, [properties, filters, showOnlyFavorites, favorites]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#fcfdff] min-h-screen pb-32">
      <div className="bg-[#004a8e] pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#ff8c00]/15 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-white/5 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
            <span className="text-white text-[9px] font-[900] uppercase tracking-[0.4em]">Radar Vilhena Ativo</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-[1000] text-white mb-12 tracking-tighter uppercase leading-[0.9]">
            Encontre sua <br/><span className="text-[#ff8c00]">nova casa.</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Digite o que você procura..."
              className="w-full px-10 py-7 rounded-[3rem] bg-white/10 backdrop-blur-3xl border-2 border-white/20 focus:border-[#ff8c00] outline-none font-bold text-lg text-white placeholder:text-white/30 shadow-2xl transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-80 space-y-8">
          <div className="bg-white/60 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] sticky top-28">
            <div className="space-y-12">
              {/* Tipo de Imóvel */}
              <div className="relative" ref={typeDropdownRef}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Tipo de Imóvel</label>
                <button 
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className={`w-full flex items-center justify-between px-8 py-5 rounded-[2.2rem] font-black text-sm transition-all border-2 ${isTypeOpen ? 'bg-white border-[#ff8c00] text-[#004a8e] shadow-lg' : 'bg-white/50 border-white text-slate-600 shadow-sm'}`}
                >
                  <span className="truncate">{filters.type || 'Todos os Tipos'}</span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${isTypeOpen ? 'rotate-180 text-[#ff8c00]' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isTypeOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.1)] py-4 animate-in fade-in slide-in-from-top-4 duration-300 max-h-60 overflow-y-auto">
                    {Object.values(PropertyType).map(t => (
                      <button 
                        key={t}
                        onClick={() => { setFilters({...filters, type: t}); setIsTypeOpen(false); }}
                        className={`w-full text-left px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${filters.type === t ? 'text-[#ff8c00] bg-orange-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bairro - Digitar e Selecionar Dinâmico */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Onde em Vilhena?</label>
                <div className="relative group">
                  <input 
                    type="text"
                    list="vilhena-neighborhoods-datalist"
                    name="neighborhood"
                    value={filters.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Busque o bairro..."
                    className="w-full px-8 py-5 bg-white/50 backdrop-blur-md rounded-[2.2rem] font-black text-slate-700 outline-none border-2 border-white focus:border-[#ff8c00] focus:bg-white shadow-sm transition-all text-sm placeholder:text-slate-300"
                  />
                  <datalist id="vilhena-neighborhoods-datalist">
                    {neighborhoods.map(n => <option key={n} value={n} />)}
                  </datalist>
                </div>
              </div>

              {/* Orçamento */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Orçamento Limite</label>
                <div className="relative">
                  <span className="absolute left-7 top-1/2 -translate-y-1/2 text-[10px] font-[1000] text-[#ff8c00]">R$</span>
                  <input 
                    type="number" 
                    name="maxPrice" 
                    value={filters.maxPrice} 
                    onChange={handleInputChange} 
                    placeholder="Sem limite" 
                    className="w-full pl-16 pr-8 py-5 bg-white/50 backdrop-blur-md rounded-[2.2rem] font-[1000] text-[#004a8e] text-lg outline-none border-2 border-white focus:border-[#ff8c00] focus:bg-white shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="pt-10 border-t border-white/60">
                <button 
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`w-full py-5 rounded-[2.2rem] font-[1000] text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${showOnlyFavorites ? 'bg-[#ff8c00] text-white' : 'bg-white/80 text-[#004a8e] border-2 border-white'}`}
                >
                  <svg className="w-4 h-4" fill={showOnlyFavorites ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {showOnlyFavorites ? 'Ver Todos' : 'Meus Favoritos'}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-10 px-8 py-4 bg-white/20 backdrop-blur-3xl rounded-[2.2rem] border border-white/40 shadow-sm">
            <span className="text-[#004a8e] font-[1000] text-[11px] uppercase tracking-[0.5em]">
              Vilhena • {filteredProperties.length} imóveis ativos
            </span>
          </div>
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-12' : 'flex flex-col gap-12'}>
            {filteredProperties.length > 0 ? (
              filteredProperties.map(prop => <PropertyCard key={prop.id} property={prop} horizontal={view === 'list'} />)
            ) : (
              <div className="py-32 text-center bg-white/40 backdrop-blur-2xl rounded-[4rem] border border-white/60 flex flex-col items-center">
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">Nenhum imóvel combina com sua busca.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
