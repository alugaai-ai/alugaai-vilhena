
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-[#002d57]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3.5rem] w-full max-w-md p-10 shadow-2xl border border-white/20 animate-in zoom-in duration-300 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-[#ff8c00]">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-3xl font-[1000] text-[#004a8e] tracking-tight uppercase mb-4 leading-tight">
          Gostou deste imóvel?
        </h3>
        <p className="text-slate-500 font-bold mb-10 leading-relaxed">
          Crie sua conta ou entre agora para salvar seus favoritos e não perder esta oportunidade em Vilhena.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => {
              onClose();
              navigate('/auth');
            }}
            className="w-full py-6 bg-[#ff8c00] text-white font-[1000] rounded-3xl uppercase tracking-widest shadow-xl hover:bg-[#e67e00] transition-all"
          >
            Entrar / Cadastrar
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors"
          >
            Continuar Explorando
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
