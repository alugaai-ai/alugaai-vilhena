
import React from 'react';
import { Link } from 'react-router-dom';
import { Property, ListingStatus } from '../types';
import { ICONS, APP_CONFIG } from '../constants';

interface PropertyCardProps {
  property: Property;
  horizontal?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, horizontal }) => {
  const isAvailable = property.status === ListingStatus.AVAILABLE;

  return (
    <Link 
      to={`/property/${property.id}`}
      className={`bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all group flex flex-col ${horizontal ? 'md:flex-row' : ''}`}
    >
      <div className={`relative overflow-hidden ${horizontal ? 'md:w-80 h-64 md:h-auto' : 'h-64'}`}>
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {property.isFeatured && (
            <div className="bg-[#ff8c00]/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest border border-white/20">
              Destaque
            </div>
          )}
          <div className="bg-white/40 backdrop-blur-md text-[#004a8e] text-[9px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1.5 border border-white/30">
            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
            Direto com Dono
          </div>
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[4px]">
            <span className="bg-white/80 backdrop-blur-lg px-8 py-3 rounded-2xl font-black text-slate-900 shadow-xl text-xs tracking-widest border border-white">ALUGADO</span>
          </div>
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-50/50 backdrop-blur-sm border border-blue-100/50 px-3 py-1 rounded-full text-[10px] font-black text-[#004a8e] uppercase tracking-widest">{property.type}</span>
          <div className="bg-orange-50/50 backdrop-blur-sm border border-orange-100/50 px-4 py-1.5 rounded-2xl text-xl font-[1000] text-[#004a8e]">
            R${property.price.toLocaleString('pt-BR')}
          </div>
        </div>
        <h3 className="text-xl font-[1000] text-slate-900 mb-2 line-clamp-1 group-hover:text-[#ff8c00] transition-colors uppercase tracking-tight">{property.title}</h3>
        <div className="flex items-center text-slate-500 text-[11px] font-black uppercase tracking-widest mb-6">
          <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100/50 p-1.5 rounded-full mr-2">
            <ICONS.Location />
          </div>
          <span className="opacity-80">{property.location}</span>
        </div>
        
        <div className="mt-auto pt-6 border-t border-white/40 flex items-center gap-4">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-50/30 backdrop-blur-md rounded-2xl border border-blue-100/20">
            <div className="text-[#004a8e]"><ICONS.Bed /></div>
            <span className="font-black text-slate-700 text-xs">{property.bedrooms}</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-orange-50/30 backdrop-blur-md rounded-2xl border border-orange-100/20">
            <div className="text-[#ff8c00]"><ICONS.Bath /></div>
            <span className="font-black text-slate-700 text-xs">{property.bathrooms}</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-slate-50/30 backdrop-blur-md rounded-2xl border border-slate-100/20">
            <div className="text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </div>
            <span className="font-black text-slate-700 text-xs">{property.area}m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
