
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Property, User, Chat } from '../types';
import PropertyCard from '../components/PropertyCard';
import ChatModal from '../components/ChatModal';
import { ICONS } from '../constants';

interface RenterDashboardProps {
  user: User;
  properties: Property[];
  chats: Chat[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSendMessage: (propertyId: string, renterId: string, ownerId: string, text: string) => void;
  onUpdateRadar: (enabled: boolean) => void;
}

const RenterDashboard: React.FC<RenterDashboardProps> = ({ 
  user, properties, chats, favorites, onToggleFavorite, onSendMessage, onUpdateRadar
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'favorites' | 'alerts'>('messages');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatIdToOpen = params.get('openChat');
    if (chatIdToOpen) {
      const foundChat = chats.find(c => c.id === chatIdToOpen);
      if (foundChat) {
        setActiveTab('messages');
        setActiveChat(foundChat);
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location, chats, navigate]);

  const myChats = useMemo(() => {
    return chats
      .filter(c => c.renterId === user.id)
      .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
  }, [chats, user.id]);

  const favoriteProperties = useMemo(() => {
    return properties.filter(p => favorites.includes(p.id));
  }, [properties, favorites]);

  const recentListings = useMemo(() => {
    return properties.filter(p => p.isActive).slice(0, 3);
  }, [properties]);

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert("Seu navegador não suporta notificações.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      onUpdateRadar(true);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner de Radar de Imóveis (Exclusivo Inquilino) */}
        <div className={`mb-12 p-8 rounded-[3rem] shadow-2xl border-4 transition-all overflow-hidden relative flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top duration-700 ${user.radarEnabled ? 'bg-gradient-to-r from-[#004a8e] to-[#002d57] border-white/10' : 'bg-white border-slate-100'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff8c00]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl relative transition-colors ${user.radarEnabled ? 'bg-[#ff8c00]' : 'bg-slate-300'}`}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {user.radarEnabled && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                </span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h3 className={`text-2xl font-[1000] uppercase tracking-tight leading-none ${user.radarEnabled ? 'text-white' : 'text-[#004a8e]'}`}>
                {user.radarEnabled ? 'Radar Ativado 📡' : 'Radar Desativado ⚠️'}
              </h3>
              <p className={`text-xs font-black uppercase tracking-widest mt-3 opacity-70 ${user.radarEnabled ? 'text-blue-200' : 'text-slate-400'}`}>
                {user.radarEnabled ? 'Você recebe alertas de novos imóveis até fora do app.' : 'Ative para não perder novas oportunidades em Vilhena.'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={user.radarEnabled ? () => onUpdateRadar(false) : handleRequestPermission}
            className={`relative z-10 px-10 py-5 font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all whitespace-nowrap ${user.radarEnabled ? 'bg-white text-[#004a8e] hover:bg-red-50' : 'bg-[#ff8c00] text-white hover:bg-[#e67e00]'}`}
          >
            {user.radarEnabled ? 'Desativar Radar' : 'Ativar Agora'}
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-[#004a8e] font-black text-3xl shadow-xl border-4 border-[#004a8e]/5">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-[1000] text-[#004a8e] tracking-tighter uppercase leading-none">Meu Espaço</h1>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mt-3">{user.name} • Perfil Inquilino</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2 px-4">
          {[
            { id: 'messages', label: `Mensagens (${myChats.length})` },
            { id: 'favorites', label: `Favoritos (${favorites.length})` },
            { id: 'alerts', label: 'Radar de Imóveis' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#004a8e] text-white shadow-2xl' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-3xl min-h-[500px] overflow-hidden">
          
          {activeTab === 'messages' && (
            <div className="p-10 md:p-20">
              <h2 className="text-3xl font-[1000] text-[#004a8e] uppercase mb-12 tracking-tighter">Minhas Conversas</h2>
              
              {myChats.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {myChats.map(c => {
                    const prop = properties.find(p => p.id === c.propertyId);
                    const lastMsg = c.messages[c.messages.length - 1];
                    if (!prop) return null;
                    
                    return (
                      <button 
                        key={c.id} 
                        onClick={() => setActiveChat(c)}
                        className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-between hover:border-[#ff8c00] hover:bg-white transition-all text-left group shadow-sm hover:shadow-xl"
                      >
                        <div className="flex items-center gap-8">
                          <img src={prop.images[0]} className="w-20 h-20 rounded-3xl object-cover shadow-lg border-2 border-white" alt="" />
                          <div>
                            <p className="font-[1000] text-[#004a8e] uppercase text-sm mb-2">{prop.title}</p>
                            <p className="text-slate-500 font-bold text-sm line-clamp-1 italic opacity-60">
                              "{lastMsg?.text}"
                            </p>
                          </div>
                        </div>
                        <div className="hidden md:block">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#ff8c00] group-hover:underline">Falar com Dono &rarr;</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-24 text-center opacity-30 flex flex-col items-center">
                  <svg className="w-20 h-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <p className="font-black uppercase tracking-widest text-xs">Nenhum contato realizado ainda.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="p-10 md:p-20">
              <h2 className="text-3xl font-[1000] text-[#004a8e] uppercase mb-12 tracking-tighter">Meus Imóveis Favoritos</h2>
              {favoriteProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {favoriteProperties.map(p => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Sua lista está vazia. Explore Vilhena!</p>
                   <button onClick={() => navigate('/listings')} className="mt-8 px-10 py-5 bg-[#004a8e] text-white font-black rounded-2xl uppercase text-[10px] tracking-widest">Buscar Imóveis</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="p-10 md:p-20">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-[1000] text-[#004a8e] uppercase mb-4 tracking-tighter">Configurações de Radar</h2>
                <p className="text-slate-500 font-bold text-lg mb-12">Você recebe avisos privilegiados via Push (notificação do navegador) sempre que um novo imóvel entra no marketplace.</p>
                
                <div className="space-y-8">
                  <div className={`p-10 rounded-[2.5rem] border-4 transition-all flex items-center justify-between ${user.radarEnabled ? 'bg-blue-50 border-[#004a8e]/10' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                    <div className="flex items-center gap-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${user.radarEnabled ? 'bg-[#004a8e]' : 'bg-slate-400'}`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      </div>
                      <div>
                        <p className="font-[1000] text-[#004a8e] uppercase text-lg">Alertas Push Ativados</p>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Status do Browser: {Notification.permission === 'granted' ? 'Permitido ✅' : 'Bloqueado ❌'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={user.radarEnabled ? () => onUpdateRadar(false) : handleRequestPermission}
                      className={`w-20 h-10 rounded-full relative transition-all ${user.radarEnabled ? 'bg-[#004a8e]' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-all ${user.radarEnabled ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="pt-10 border-t border-slate-100">
                    <h3 className="text-sm font-black text-[#ff8c00] uppercase tracking-widest mb-8">Novidades Recentes do Radar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {recentListings.map(p => (
                         <div key={p.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-[#ff8c00] transition-all">
                           <img src={p.images[0]} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                           <div className="flex-1">
                             <p className="font-black text-[#004a8e] uppercase text-[10px] leading-tight mb-1">{p.title}</p>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.location}</p>
                           </div>
                           <button onClick={() => navigate(`/property/${p.id}`)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#ff8c00] shadow-sm group-hover:bg-[#ff8c00] group-hover:text-white transition-all">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                           </button>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeChat && (
        <ChatModal 
          isOpen={true} 
          onClose={() => setActiveChat(null)} 
          chat={chats.find(c => c.id === activeChat.id) || null} 
          currentUser={user} 
          onSendMessage={(text) => onSendMessage(activeChat.propertyId, user.id, activeChat.ownerId, text)}
          property={properties.find(p => p.id === activeChat.propertyId)!}
        />
      )}
    </div>
  );
};

export default RenterDashboard;
