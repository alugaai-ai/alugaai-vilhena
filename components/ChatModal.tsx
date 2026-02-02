
import React, { useState, useEffect, useRef } from 'react';
import { Chat, User, Property } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat | null;
  currentUser: User;
  onSendMessage: (text: string) => void;
  property: Property;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, chat, currentUser, onSendMessage, property }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chat?.messages, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg h-[80vh] sm:h-[600px] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#004a8e] text-white">
          <div className="flex items-center gap-3">
            <img src={property.images[0]} className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" alt="" />
            <div>
              <p className="font-black text-sm leading-tight uppercase tracking-tight">{property.title}</p>
              <p className="text-[9px] opacity-70 uppercase font-black tracking-widest">Aluguel Direto</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50 flex flex-col">
          {!chat || chat.messages.length === 0 ? (
            <div className="text-center py-20 my-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#004a8e]">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Inicie a conversa agora</p>
            </div>
          ) : (
            chat.messages.map((m) => (
              <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-[1.5rem] text-sm shadow-sm ${
                  m.senderId === currentUser.id 
                    ? 'bg-[#004a8e] text-white rounded-tr-none' 
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none font-bold'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  <p className="text-[8px] mt-1 text-right opacity-50 font-black">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - CORREÇÃO DE CONTRASTE TOTAL */}
        <div className="p-5 border-t border-slate-100 bg-white">
          <form className="flex gap-3" onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            onSendMessage(text);
            setText('');
          }}>
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Perguntar ao dono..."
              className="flex-grow px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#ff8c00] focus:bg-white outline-none text-sm text-slate-900 font-[1000] placeholder:text-slate-300 transition-all shadow-inner"
            />
            <button type="submit" className="bg-[#ff8c00] text-white p-4 rounded-2xl hover:bg-[#004a8e] transition-all shadow-xl active:scale-95">
              <svg className="h-6 w-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
