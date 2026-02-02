
import React from 'react';
import { CityConfig } from './types';

export const APP_CONFIG = {
  name: 'Aluga Aí',
  tagline: 'Alugou, entrou! Direto com o dono em Vilhena - RO.',
  currency: 'BRL',
  currencySymbol: 'R$',
  defaultCityId: 'vilhena-ro', // Agora usa ID único
  defaultCity: 'Vilhena',
  defaultState: 'RO',
  supportEmail: 'ceoempreendimentos69@gmail.com',
  instagram: '@alugaai_oficial',
  devCredits: 'C&C TECH',
  ownerCommission: 0,
  featuredListingPrice: 97.00
};

// Base de dados inicial para expansão nacional
export const BRAZILIAN_CITIES_DB: CityConfig[] = [
  { id: 'vilhena-ro', name: 'Vilhena', state: 'RO', isActive: true, region: 'Norte' },
  { id: 'porto-velho-ro', name: 'Porto Velho', state: 'RO', isActive: false, region: 'Norte' },
  { id: 'cuiaba-mt', name: 'Cuiabá', state: 'MT', isActive: false, region: 'Centro-Oeste' },
  { id: 'sao-paulo-sp', name: 'São Paulo', state: 'SP', isActive: false, region: 'Sudeste' },
  { id: 'curitiba-pr', name: 'Curitiba', state: 'PR', isActive: false, region: 'Sul' },
  { id: 'salvador-ba', name: 'Salvador', state: 'BA', isActive: false, region: 'Nordeste' }
];

export const COLORS = {
  primary: '#004a8e',
  secondary: '#ff8c00',
  primaryLight: '#e6f0fa',
  secondaryLight: '#fff5e6',
  accent: '#f59e0b'
};

export const ICONS = {
  Logo: ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-12 h-12 bg-[#ff8c00] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <span className="text-3xl font-[1000] tracking-tighter uppercase italic text-[#004a8e] whitespace-nowrap">
        Aluga <span className="text-[#ff8c00]">Aí</span>
      </span>
    </div>
  ),
  HouseOrange: ({ className = "w-24 h-24" }: { className?: string }) => (
    <div className={`${className} bg-gradient-to-br from-[#ff8c00] to-[#e67e00] rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(255,140,0,0.3)] border-4 border-white/20`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  ),
  Bed: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 11a1 1 0 100-2 1 1 0 000 2zm1-2a1 1 0 011-1h1a1 1 0 011 1v1h1V9a1 1 0 011-1h1a1 1 0 011 1v1h1V9a1 1 0 011-1h1a1 1 0 011 1v1a2 2 0 01-2 2h-1a2 2 0 01-2-2H9v1a2 2 0 01-2 2H6a2 2 0 01-2-2V9a1 1 0 011-1h1a1 1 0 011 1v1h1V9z" /></svg>,
  Bath: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zm7-4a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zm7 2a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V9z" /></svg>,
  Location: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
};
