
import React from 'react';

interface AdBannerProps {
  slot: string;
  className?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, className = "", format = 'horizontal' }) => {
  const formatClasses = {
    horizontal: 'h-24 w-full max-w-4xl mx-auto',
    vertical: 'h-[600px] w-[160px]',
    rectangle: 'h-[250px] w-[300px]'
  };

  return (
    <div className={`my-8 ${className}`}>
      <div className={`${formatClasses[format]} bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden group transition-all hover:bg-slate-200/50`}>
        <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded shadow-sm">Publicidade</div>
        <div className="text-center">
          <p className="text-slate-400 font-medium text-sm">Espaço reservado para Google AdSense</p>
          <p className="text-[10px] text-slate-300 font-mono mt-1">Slot: {slot}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default AdBanner;
