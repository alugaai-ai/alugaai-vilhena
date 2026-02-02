
import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { APP_CONFIG, ICONS } from '../constants';
import PropertyCard from '../components/PropertyCard';
import NeighborhoodAssistant from '../components/NeighborhoodAssistant';

interface HomeProps {
  properties: Property[];
}

const Home: React.FC<HomeProps> = ({ properties }) => {
  const featured = properties.filter(p => p.isFeatured).slice(0, 3);

  return (
    <div className="bg-[#fcfdff]">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#004a8e]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 grayscale-[0.5]"
            alt="Aluguel Vilhena"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#004a8e]/95 via-[#004a8e]/80 to-[#fcfdff]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-pulse"></span>
            <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Marketplace de Vilhena</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-[1000] text-white tracking-tighter mb-8 leading-tight drop-shadow-2xl">
            Alugou, <span className="text-[#ff8c00]">entrou!</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-blue-50 max-w-3xl mx-auto mb-16 leading-relaxed font-medium opacity-95">
            O jeito mais rápido de morar em Vilhena - RO. Sem fiador, sem caução abusivo, direto com quem manda.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link
              to="/listings"
              className="group px-14 py-7 bg-[#ff8c00] text-white font-black rounded-[2.5rem] hover:bg-[#e67e00] hover:scale-105 transition-all shadow-xl text-2xl flex items-center justify-center gap-4"
            >
              Ver Imóveis
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
            <div>
              <div className="text-[#ff8c00] font-black uppercase tracking-[0.4em] text-xs mb-3">Vilhena Exclusive</div>
              <h2 className="text-5xl font-[1000] text-[#004a8e] tracking-tighter uppercase leading-none">Destaques da Semana</h2>
            </div>
            <Link to="/listings" className="text-[#004a8e] font-black uppercase text-xs tracking-widest border-b-4 border-[#ff8c00] pb-2 hover:text-[#ff8c00] transition-colors">Ver todos os imóveis</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featured.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA PARA PROPRIETÁRIOS - NOVO */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-4 bg-orange-100 text-[#ff8c00] rounded-3xl mb-8">
              <ICONS.HouseOrange className="w-12 h-12" />
            </div>
            <h2 className="text-4xl md:text-6xl font-[1000] text-[#004a8e] tracking-tight uppercase mb-8 leading-tight">
              Tem um imóvel para alugar em Vilhena?
            </h2>
            <p className="text-xl text-slate-500 font-bold mb-12 max-w-2xl mx-auto">
              Anuncie direto no Aluga Aí e tenha gestão completa: chat com inquilinos, contratos digitais e zero taxas de imobiliária.
            </p>
            <Link 
              to="/auth" 
              className="inline-block px-12 py-6 bg-[#004a8e] text-white font-[1000] rounded-[2rem] text-xl uppercase tracking-widest shadow-2xl hover:bg-[#ff8c00] transition-all"
            >
              Anunciar Meu Imóvel Grátis
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NeighborhoodAssistant />
        </div>
      </section>
    </div>
  );
};

export default Home;
