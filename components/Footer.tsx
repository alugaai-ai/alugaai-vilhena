
import React from 'react';
import { APP_CONFIG, ICONS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#002d57] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center">
              {/* Estilização específica da logo para o rodapé: Texto em branco */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ff8c00] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-7 w-7" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-3xl font-[1000] tracking-tighter uppercase italic text-white whitespace-nowrap">
                  Aluga <span className="text-[#ff8c00]">Aí</span>
                </span>
              </div>
            </div>
            <p className="text-blue-100 max-w-sm font-medium leading-relaxed opacity-80">
              O marketplace moderno de aluguel direto em Vilhena. Conectando donos e inquilinos com transparência, segurança e 100% sem burocracia.
            </p>
            <div className="mt-8 flex items-center gap-4">
               <a href="https://instagram.com/alugaai_ro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-[#ff8c00] transition-all px-4 py-2 rounded-xl text-sm font-bold border border-white/5">
                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                 {APP_CONFIG.instagram}
               </a>
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-[#ff8c00] uppercase tracking-[0.3em] mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-100 hover:text-[#ff8c00] transition-colors text-sm font-bold">Buscar Imóvel</a></li>
              <li><a href="#" className="text-blue-100 hover:text-[#ff8c00] transition-colors text-sm font-bold">Anunciar Imóvel</a></li>
              <li><a href={`mailto:${APP_CONFIG.supportEmail}`} className="text-blue-100 hover:text-[#ff8c00] transition-colors text-sm font-bold">Suporte</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-[#ff8c00] uppercase tracking-[0.3em] mb-6">Políticas</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-100 hover:text-[#ff8c00] transition-colors text-sm font-bold">Privacidade</a></li>
              <li><a href="#" className="text-blue-100 hover:text-[#ff8c00] transition-colors text-sm font-bold">Termos de Uso</a></li>
              <li><a href="#" className="text-blue-100 hover:text-[#ff8c00] transition-colors text-sm font-bold">Segurança</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest opacity-60">
              &copy; {new Date().getFullYear()} {APP_CONFIG.name}. Todos os direitos reservados.
            </p>
            <p className="text-[10px] text-blue-300/50 mt-1 uppercase font-bold">Vilhena - Rondônia</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Tecnologia e Performance:</span>
            <span className="text-lg text-white font-[1000] italic tracking-tighter hover:text-[#ff8c00] cursor-default transition-all">
              {APP_CONFIG.devCredits}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
