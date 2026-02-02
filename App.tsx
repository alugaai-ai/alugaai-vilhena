
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Property, User, Chat, Contract, CityConfig, ChatMessage } from './types';
import { DEMO_PROPERTIES, DEMO_USER, ADMIN_USER, DEMO_RENTER, DEMO_CONTRACTS } from './mockData';
import { APP_CONFIG, BRAZILIAN_CITIES_DB } from './constants';

// Views
import Home from './views/Home';
import Listings from './views/Listings';
import PropertyDetails from './views/PropertyDetails';
import OwnerDashboard from './views/OwnerDashboard';
import RenterDashboard from './views/RenterDashboard';
import AdminDashboard from './views/AdminDashboard';
import Auth from './views/Auth';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPromptModal from './components/AuthPromptModal';

const DEFAULT_NEIGHBORHOODS = [
  "Centro", "Jardim Eldorado", "Jardim América", "Cristo Rei", 
  "Setor 19", "Bodanese", "BNH", "Parque Cidade Jardim", 
  "Nova Vilhena", "São José", "Alto Alegre", "Bela Vista", 
  "Industrial", "Tancredo Neves", "5º BEC", "Maria Moura", 
  "Assossete", "Jardim Araucária", "Residencial Alvorada", 
  "Greenville", "Solar de Vilhena", "Residencial Moises de Freitas",
  "Jardim Social", "Parque São Paulo", "Cohab", "Rural"
].sort();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]); 
  const [chats, setChats] = useState<Chat[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [activeCities, setActiveCities] = useState<CityConfig[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [userFavorites, setUserFavorites] = useState<Record<string, string[]>>({});
  const [notifications, setNotifications] = useState<{id: number, text: string, type: 'success' | 'info', image?: string}[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  useEffect(() => {
    try {
      const savedCities = localStorage.getItem('rentcore_active_cities');
      if (savedCities) setActiveCities(JSON.parse(savedCities));
      else setActiveCities(BRAZILIAN_CITIES_DB);

      const savedNeighborhoods = localStorage.getItem('rentcore_neighborhoods');
      if (savedNeighborhoods) setNeighborhoods(JSON.parse(savedNeighborhoods));
      else setNeighborhoods(DEFAULT_NEIGHBORHOODS);

      const savedProperties = localStorage.getItem('rentcore_properties');
      if (savedProperties) setProperties(JSON.parse(savedProperties));
      else setProperties(DEMO_PROPERTIES);

      const savedUsers = localStorage.getItem('rentcore_all_users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      else setUsers([DEMO_USER, ADMIN_USER, { ...DEMO_RENTER, radarEnabled: true }]);

      const savedUser = localStorage.getItem('rentcore_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedChats = localStorage.getItem('rentcore_chats');
      if (savedChats) setChats(JSON.parse(savedChats));
      else setChats([]);

      const savedContracts = localStorage.getItem('rentcore_contracts');
      if (savedContracts) setContracts(JSON.parse(savedContracts));
      else setContracts(DEMO_CONTRACTS);

      const savedFavorites = localStorage.getItem('rentcore_user_favorites');
      if (savedFavorites) setUserFavorites(JSON.parse(savedFavorites));
    } catch (e) {
      console.error("Failed to load state from storage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rentcore_all_users', JSON.stringify(users));
    localStorage.setItem('rentcore_chats', JSON.stringify(chats));
    localStorage.setItem('rentcore_contracts', JSON.stringify(contracts));
    localStorage.setItem('rentcore_user_favorites', JSON.stringify(userFavorites));
    localStorage.setItem('rentcore_active_cities', JSON.stringify(activeCities));
    localStorage.setItem('rentcore_neighborhoods', JSON.stringify(neighborhoods));
    if (properties.length > 0) localStorage.setItem('rentcore_properties', JSON.stringify(properties));
    if (user) localStorage.setItem('rentcore_user', JSON.stringify(user));
  }, [properties, users, chats, contracts, userFavorites, user, activeCities, neighborhoods]);

  const notify = (text: string, type: 'success' | 'info' = 'success', image?: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type, image }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rentcore_user');
    notify('Sessão encerrada.', 'info');
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
    // Notify all renters with radar enabled
    users.forEach(u => {
      if (u.role === 'renter' && u.radarEnabled) {
        // In a real app, this would be a push notification
        console.log(`Radar push sent to ${u.name}`);
      }
    });
    notify(`Novo imóvel publicado em ${newProp.location}!`, 'success', newProp.images[0]);
  };

  const handleSendMessage = (propertyId: string, renterId: string, ownerId: string, text: string) => {
    const chatId = `${propertyId}-${renterId}`;
    const senderId = user?.id || renterId;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      text,
      timestamp: new Date().toISOString()
    };

    setChats(prev => {
      const existingChatIndex = prev.findIndex(c => c.id === chatId);
      let updatedChats = [...prev];
      if (existingChatIndex >= 0) {
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          messages: [...updatedChats[existingChatIndex].messages, newMessage],
          lastUpdate: new Date().toISOString()
        };
        const chatToMove = updatedChats.splice(existingChatIndex, 1)[0];
        updatedChats = [chatToMove, ...updatedChats];
      } else {
        const newChat: Chat = { id: chatId, propertyId, renterId, ownerId, messages: [newMessage], lastUpdate: new Date().toISOString(), status: 'open' };
        updatedChats = [newChat, ...prev];
      }
      return updatedChats;
    });
  };

  const handleToggleFavorite = (id: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const favs = userFavorites[user.id] || [];
    const updated = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    setUserFavorites({...userFavorites, [user.id]: updated});
    notify(favs.includes(id) ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const publicProperties = properties.filter(p => p.isActive);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <div className="fixed top-28 right-6 z-[200] space-y-4 pointer-events-none w-full max-w-sm">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-3xl shadow-2xl border-l-8 font-black text-xs uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-right duration-300 pointer-events-auto bg-white ${n.type === 'success' ? 'border-emerald-500 text-emerald-800' : 'border-[#004a8e] text-[#004a8e]'}`}>
                {n.image && (
                  <img src={n.image} className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white" alt="Notificação" />
                )}
                <div className="flex-1">{n.text}</div>
              </div>
            ))}
          </div>

          <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          
          <Routes>
            <Route path="/" element={<Home properties={publicProperties} />} />
            <Route path="/listings" element={<Listings properties={publicProperties} neighborhoods={neighborhoods} favorites={user ? userFavorites[user.id] || [] : []} onToggleFavorite={handleToggleFavorite} />} />
            <Route path="/property/:id" element={<PropertyDetails properties={properties} currentUser={user} chats={chats} favorites={user ? userFavorites[user.id] || [] : []} onToggleFavorite={handleToggleFavorite} onSendMessage={handleSendMessage} onCreateContract={()=>{}} />} />
            <Route 
              path="/dashboard" 
              element={
                user ? (
                  user.role === 'admin' ? (
                    <AdminDashboard 
                      user={user} 
                      properties={properties} 
                      users={users} 
                      contracts={contracts} 
                      activeCities={activeCities} 
                      neighborhoods={neighborhoods}
                      onUpdateNeighborhoods={setNeighborhoods}
                      onToggleProp={(id) => setProperties(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))} 
                      onToggleUser={(id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u))} 
                      onVerifyUser={(id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: true } : u))}
                      onToggleCity={(id) => setActiveCities(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))} 
                      onAddCity={(c) => setActiveCities(prev => [...prev, c])}
                      onRemoveCity={(id) => setActiveCities(prev => prev.filter(c => c.id !== id))}
                    />
                  ) : user.role === 'owner' ? (
                    <OwnerDashboard 
                      user={user} 
                      properties={properties} 
                      chats={chats}
                      contracts={contracts}
                      favorites={[]}
                      onUpdate={(p) => setProperties(prev => prev.map(item => item.id === p.id ? p : item))} 
                      onDelete={(id) => setProperties(prev => prev.filter(p => p.id !== id))} 
                      onAdd={handleAddProperty}
                      onVerifyUser={()=>{}}
                      onToggleFavorite={handleToggleFavorite}
                      onCreateContract={()=>{}}
                      onSendMessage={handleSendMessage}
                    />
                  ) : (
                    <RenterDashboard 
                      user={user} 
                      properties={properties} 
                      chats={chats} 
                      favorites={userFavorites[user.id] || []}
                      onToggleFavorite={handleToggleFavorite}
                      onSendMessage={handleSendMessage}
                      onUpdateRadar={(enabled) => {
                        const updatedUser = { ...user, radarEnabled: enabled };
                        setUser(updatedUser);
                        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
                      }}
                    />
                  )
                ) : <Navigate to="/auth" />
              } 
            />
            <Route path="/auth" element={<Auth onLogin={(u) => { setUser(u); }} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
