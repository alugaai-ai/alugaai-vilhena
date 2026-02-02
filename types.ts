
export enum ListingStatus {
  AVAILABLE = 'Disponível',
  RENTED = 'Alugado',
  PENDING = 'Pendente'
}

export enum PropertyType {
  APARTMENT = 'Apartamento',
  HOUSE = 'Casa',
  STUDIO = 'Studio/Flat',
  LOFT = 'Loft',
  KITCHENETTE = 'Quitinete',
  COMMERCIAL_ROOM = 'Sala Empresarial',
  STORE = 'Ponto Comercial/Loja',
  WAREHOUSE = 'Galpão/Depósito',
  VILLA = 'Mansão',
  LAND = 'Terreno/Lote'
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  isActive: boolean;
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;    
  state: string;   
  cityId: string; 
  location: string; 
  address: string;  
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number; 
  images: string[];
  status: ListingStatus;
  isActive: boolean; 
  isFeatured: boolean;
  views: number;
  createdAt: string;
  features: string[];
  reports?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'owner' | 'renter';
  avatar?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  
  // Novos campos de CRM
  cpf?: string;
  birthDate?: string;
  fullAddress?: string;
  monthlyIncome?: string; // Para Inquilinos
  pixKey?: string;       // Para Proprietários
  registrationDate: string;
  
  pushEnabled?: boolean;
  radarEnabled?: boolean; // Alerta de novos imóveis para inquilinos
  lastActive?: string;
}

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  search: string;
  city: string;       
  neighborhood: string;
  state: string;
  features: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  propertyId: string;
  renterId: string;
  ownerId: string;
  messages: ChatMessage[];
  lastUpdate: string;
  status: 'open' | 'concluded';
}

export interface Contract {
  id: string;
  propertyId: string;
  renterId: string;
  ownerId: string;
  tenantData: {
    fullName: string;
    cpf: string;
    rg: string;
    profession: string;
    email: string;
  };
  contractSettings: {
    durationMonths: number;
    startDate: string;
    endDate: string;
    rentValue: number;
    additionalNotes?: string;
  };
  status: 'draft' | 'signed';
  createdAt: string;
}
