
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Property, User, Chat, Contract } from '../types';
import { ICONS } from '../constants';
import PropertyForm from '../components/PropertyForm';
import ChatModal from '../components/ChatModal';

interface OwnerDashboardProps {
  user: User | null;
  properties: Property[];
  chats: Chat[];
  contracts: Contract[];
  favorites: string[];
  onUpdate: (p: Property) => void;
  onDelete: (id: string) => void;
  onAdd: (p: Property) => void;
  onVerifyUser: () => void;
  onToggleFavorite: (id: string) => void;
  onCreateContract: (propertyId: string, renterId: string, ownerId: string, data: any) => void;
  onSendMessage: (propertyId: string, renterId: string, ownerId: string, text: string) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ 
  user, properties, chats, contracts, 
  onUpdate, onDelete, onAdd, onVerifyUser, onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'chats' | 'contracts' | 'account'>('listings');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [activeOwnerChat, setActiveOwnerChat] = useState<Chat | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const location = useLocation();
  const navigate = useNavigate();

  // Detecção de Deep Linking via URL (para notificações push)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatIdToOpen = params.get('openChat');
    if (chatIdToOpen) {
      const foundChat = chats.find(c => c.id === chatIdToOpen);
      if (foundChat) {
        setActiveTab('chats');
        setActiveOwnerChat(foundChat);
        // Limpa o parâmetro da URL para não reabrir em refresh acidental
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location, chats, navigate]);

  const myProperties = properties.filter(p => p.ownerId === user?.id);
  
  const stats = useMemo(() => ({
    totalViews: myProperties.reduce((acc, curr) => acc + (curr.views || 0), 0),
    activeCount: myProperties.filter(p => p.isActive).length,
    unreadMessages: chats.filter(c => c.ownerId === user?.id && c.messages[c.messages.length - 1].senderId !== user?.id).length
  }), [myProperties, chats, user?.id]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Este navegador não suporta notificações de desktop.");
      return;
    }
    
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
    
    if (permission === 'granted') {
      new Notification("Alertas Aluga Aí Vilhena Ativados!", {
        body: "Você será avisado sempre que receber uma nova proposta.",
        icon: 'https://cdn-icons-png.flaticon.com/512/609/609803.png'
      });
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner de Notificações */}
        {notificationStatus !== 'granted' && (
          <div className="mb-12 bg-gradient-to-r from-[#004a8e] to-[#002d57] p-8 rounded-[2.5rem] shadow-2xl border-4 border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top duration-700">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#ff8c00] rounded-2xl flex items-center justify-center text-white animate-bounce shadow-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-[1000] text-white uppercase tracking-tight">Ative os Alertas de Negócio</h3>
                <p className="text-blue-100 text-sm font-bold opacity-80">Receba notificações instantâneas e responda interessados na hora.</p>
              </div>
            </div>
            <button 
              onClick={requestNotificationPermission}
              className="px-10 py-4 bg-white text-[#004a8e] font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-[#ff8c00] hover:text-white transition-all whitespace-nowrap"
            >
              Habilitar Notificações Push
            </button>
          </div>
        )}

        {/* Métricas Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#004a8e]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <div>
              <p className="text-4xl font-[1000] text-[#004a8e] leading-none">{stats.totalViews}</p>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Visualizações Totais</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff8c00]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
            <div>
              <p className="text-4xl font-[1000] text-[#ff8c00] leading-none">{stats.activeCount}</p>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Anúncios Ativos</p>
            </div>
          </div>
          <div className="bg-[#004a8e] p-8 rounded-[2.5rem] shadow-xl flex items-center gap-6 text-white">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div>
              <p className="text-4xl font-[1000] leading-none">{stats.unreadMessages}</p>
              <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mt-2">Novas Mensagens</p>
            </div>
          </div>
        </div>

        {/* Tabs Control */}
        <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
          <button onClick={() => setActiveTab('listings')} className={`px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'listings' ? 'bg-[#004a8e] text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>Gestão de Imóveis</button>
          <button onClick={() => setActiveTab('chats')} className={`px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'chats' ? 'bg-[#004a8e] text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>Conversas Ativas</button>
          <button onClick={() => setActiveTab('account')} className={`px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'account' ? 'bg-[#004a8e] text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>Dados do Perfil</button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl min-h-[500px] overflow-hidden">
          {activeTab === 'listings' && (
            <div className="p-10 md:p-16">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-[1000] text-[#004a8e] uppercase tracking-tight">Seu Portfólio</h2>
                <button onClick={() => setIsAddingProperty(true)} className="px-8 py-4 bg-[#ff8c00] text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all">+ Adicionar Imóvel</button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {myProperties.map(p => (
                  <div key={p.id} className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center justify-between border border-slate-100 group hover:border-[#ff8c00] transition-all">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <img src={p.images[0]} className="w-24 h-24 rounded-3xl object-cover shadow-lg border-2 border-white" alt="" />
                        <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.isActive ? 'bg-emerald-50 text-white' : 'bg-slate-400 text-white'}`}>
                          {p.isActive ? 'No Site' : 'Pausado'}
                        </div>
                      </div>
                      <div>
                        <p className="font-[1000] text-[#004a8e] uppercase text-base mb-1">{p.title}</p>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{p.location} • R$ {p.price.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setEditingProperty(p)} className="px-6 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-[#004a8e] hover:bg-[#004a8e] hover:text-white transition-all">Editar</button>
                      <button onClick={() => onDelete(p.id)} className="px-6 py-3 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-full transition-all">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chats' && (
             <div className="p-10 md:p-16">
                <h2 className="text-2xl font-[1000] text-[#004a8e] uppercase mb-10 tracking-tight">Histórico de Contatos</h2>
                <div className="space-y-4">
                   {chats.filter(c => c.ownerId === user?.id).map(c => {
                     const prop = properties.find(p => p.id === c.propertyId);
                     const lastMsg = c.messages[c.messages.length - 1];
                     return (
                       <button key={c.id} onClick={() => setActiveOwnerChat(c)} className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:bg-white hover:border-[#ff8c00] transition-all text-left">
                          <div className="flex items-center gap-6">
                            <img src={prop?.images[0]} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                            <div>
                              <p className="font-black text-[#004a8e] text-sm uppercase">Interessado em {prop?.title}</p>
                              <p className="text-xs text-slate-500 font-bold italic line-clamp-1">"{lastMsg.text}"</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-[#ff8c00] uppercase tracking-widest">Abrir Chat</span>
                       </button>
                     );
                   })}
                </div>
             </div>
          )}

          {activeTab === 'account' && (
             <div className="p-16 flex flex-col items-center">
                <div className="w-32 h-32 bg-[#ff8c00] rounded-[3rem] shadow-2xl flex items-center justify-center text-white text-5xl font-black mb-8 border-8 border-white">
                  {user?.name.charAt(0)}
                </div>
                <h2 className="text-3xl font-[1000] text-[#004a8e] uppercase">{user?.name}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{user?.email}</p>
             </div>
          )}
        </div>
      </div>

      {(isAddingProperty || editingProperty) && (
        <PropertyForm 
          ownerId={user?.id || ''} 
          initialData={editingProperty}
          onSave={(p) => { 
            editingProperty ? onUpdate(p) : onAdd(p); 
            setIsAddingProperty(false); 
            setEditingProperty(null); 
          }} 
          onClose={() => { 
            setIsAddingProperty(false); 
            setEditingProperty(null); 
          }} 
        />
      )}
      
      {activeOwnerChat && (
        <ChatModal 
          isOpen={true}
          onClose={() => setActiveOwnerChat(null)}
          chat={chats.find(c => c.id === activeOwnerChat.id) || null}
          currentUser={user!}
          property={properties.find(p => p.id === activeOwnerChat.propertyId)!}
          onSendMessage={(text) => onSendMessage(activeOwnerChat.propertyId, activeOwnerChat.renterId, user!.id, text)}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
