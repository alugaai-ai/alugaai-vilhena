
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { ICONS } from '../constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getDashboardLabel = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Painel Master';
    if (user.role === 'owner') return 'Minha Gestão';
    return 'Meu Painel';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ICONS.Logo />
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold ${
                  isActive('/') ? 'border-[#ff8c00] text-[#004a8e]' : 'border-transparent text-slate-500 hover:text-[#004a8e]'
                }`}
              >
                Início
              </Link>
              <Link
                to="/listings"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold ${
                  isActive('/listings') ? 'border-[#ff8c00] text-[#004a8e]' : 'border-transparent text-slate-500 hover:text-[#004a8e]'
                }`}
              >
                Imóveis em Vilhena
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-[#004a8e] bg-blue-50 rounded-full hover:bg-[#004a8e] hover:text-white transition-all border border-blue-100"
                >
                  {getDashboardLabel()}
                </Link>
                <button
                  onClick={onLogout}
                  className="text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-8 py-3 text-sm font-black uppercase tracking-widest text-white bg-[#004a8e] rounded-full hover:bg-[#ff8c00] transition-all shadow-xl active:scale-95"
              >
                Anunciar / Entrar
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button - Placeholder for mobile refinement */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
