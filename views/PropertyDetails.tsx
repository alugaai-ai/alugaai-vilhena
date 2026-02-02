
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, ListingStatus, User, Chat } from '../types';
import { ICONS, APP_CONFIG } from '../constants';
import NeighborhoodAssistant from '../components/NeighborhoodAssistant';
import ChatModal from '../components/ChatModal';
import { DEMO_USER } from '../mockData';

interface PropertyDetailsProps {
  properties: Property[];
  currentUser: User | null;
  chats: Chat[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSendMessage: (propertyId: string, renterId: string, ownerId: string, text: string) => void;
  onCreateContract: (propertyId: string, renterId: string, ownerId: string, data: any) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  properties, 
  currentUser, 
  chats, 
  favorites,
  onToggleFavorite,
  onSendMessage, 
  onCreateContract 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showVisitFeedback, setShowVisitFeedback] = useState(false);

  // Simula busca do dono (em um app real viria do banco pelo ownerId)
  const owner = DEMO_USER; 

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Imóvel Não Encontrado</h2>
          <button onClick={() => navigate('/listings')} className="text-[#004a8e] font-semibold">&larr; Voltar para Busca</button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(property.id);

  const handleSendMessage = (text: string) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    onSendMessage(property.id, currentUser.id, property.ownerId, text);
  };

  const requestVisit = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    // Dispara a mensagem e abre o modal
    handleSendMessage("Olá! Gostaria de agendar uma visita para conhecer este imóvel em Vilhena. Quais horários você tem disponível?");
    setShowVisitFeedback(true);
    setIsChatOpen(true);
    setTimeout(() => setShowVisitFeedback(false), 3000);
  };

  const openChat = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setIsChatOpen(true);
  };

  return (
    <div className="bg-[#fcfdff] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-white text-slate-500 hover:text-[#004a8e] transition-all font-black uppercase text-[10px] tracking-widest shadow-sm">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar para Busca
          </button>

          <button 
            onClick={() => onToggleFavorite(property.id)}
            className={`p-4 rounded-full shadow-xl transition-all border border-white/40 ${isFavorite ? 'bg-[#ff8c00]/80 text-white backdrop-blur-xl scale-110' : 'bg-white/40 backdrop-blur-md text-slate-400 hover:text-[#ff8c00]'}`}
          >
            <svg className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Lado Esquerdo: Imagens e Descrição */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl relative border-8 border-white">
                <img src={property.images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
              </div>
              {property.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {property.images.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)} className={`flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === idx ? 'border-[#ff8c00] scale-105 shadow-xl' : 'border-white opacity-60'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-xl">
              <div className="mb-6">
                <span className="bg-[#004a8e]/10 backdrop-blur-sm border border-[#004a8e]/20 text-[#004a8e] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{property.type}</span>
              </div>
              <h1 className="text-4xl font-[1000] text-[#004a8e] leading-none tracking-tighter uppercase mb-6">{property.title}</h1>
              <div className="flex items-center text-slate-500 mb-10 gap-2">
                <div className="bg-white/50 backdrop-blur-sm p-2 rounded-full border border-white">
                  <ICONS.Location />
                </div>
                <span className="text-lg font-bold text-slate-700">{property.location} - Vilhena, RO</span>
              </div>
              <div className="grid grid-cols-3 gap-8 py-10 border-t border-white/60">
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 text-center">
                  <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mb-1">Quartos</p>
                  <p className="text-2xl font-[1000] text-[#004a8e]">{property.bedrooms}</p>
                </div>
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 text-center">
                  <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mb-1">Banheiros</p>
                  <p className="text-2xl font-[1000] text-[#004a8e]">{property.bathrooms}</p>
                </div>
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 text-center">
                  <p className="text-slate-400 text-[9px] uppercase font-black tracking-widest mb-1">Área</p>
                  <p className="text-2xl font-[1000] text-[#004a8e]">{property.area} m²</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/40 backdrop-blur-2xl p-12 rounded-[3rem] border border-white shadow-xl">
              <h3 className="text-2xl font-[1000] text-[#004a8e] uppercase tracking-tighter mb-6">Informações do Radar</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium whitespace-pre-wrap italic">{property.description}</p>
            </div>
          </div>

          {/* Lado Direito: Preço e Proprietário */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="p-10 bg-white/40 backdrop-blur-2xl border border-white rounded-[3.5rem] shadow-2xl">
                <div className="mb-10 text-center">
                  <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest mb-2">Aluguel em Vilhena</p>
                  <div className="bg-white/50 backdrop-blur-lg border border-white inline-block px-8 py-4 rounded-[2.5rem] shadow-sm">
                    <div className="text-5xl font-[1000] text-[#004a8e] tracking-tighter">
                      R${property.price.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <button 
                    onClick={openChat}
                    className="w-full py-6 bg-[#ff8c00]/90 backdrop-blur-md text-white rounded-[2rem] font-[1000] text-xl uppercase tracking-widest shadow-xl hover:scale-105 transition-all border border-white/20"
                  >
                    Falar com Dono
                  </button>
                  <button 
                    onClick={requestVisit}
                    className="w-full py-6 bg-[#004a8e]/90 backdrop-blur-md text-white rounded-[2rem] font-[1000] text-xl uppercase tracking-widest shadow-xl hover:scale-105 transition-all border border-white/20"
                  >
                    Agendar Visita
                  </button>
                </div>

                {/* Card do Proprietário */}
                <div className="pt-10 border-t border-white/60">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Gestão Direta</p>
                  <div className="flex items-center gap-4 bg-white/30 backdrop-blur-md p-4 rounded-[2rem] border border-white/50">
                    <div className="w-14 h-14 bg-[#ff8c00] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {owner.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#004a8e] uppercase text-sm flex items-center gap-2 leading-none">
                        {owner.name}
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                      </p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">Proprietário Verificado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentUser && (
        <ChatModal 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          chat={chats.find(c => c.id === `${property.id}-${currentUser.id}`) || null} 
          currentUser={currentUser} 
          onSendMessage={handleSendMessage}
          property={property}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
