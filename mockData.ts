
import { Property, ListingStatus, PropertyType, User, Contract } from './types';

export const DEMO_USER: User = {
  id: 'u1',
  name: 'Ricardo Silva',
  email: 'ricardo@vilhena.com.br',
  phone: '(69) 98400-0000',
  role: 'owner',
  avatar: 'https://picsum.photos/id/64/100/100',
  isVerified: true,
  isBlocked: false,
  registrationDate: '2023-10-01T00:00:00Z'
};

export const DEMO_RENTER: User = {
  id: 'u_test',
  name: 'João Inquilino',
  email: 'inquilino@teste.com',
  phone: '(69) 99999-8888',
  role: 'renter',
  avatar: 'https://picsum.photos/id/102/100/100',
  isVerified: true,
  isBlocked: false,
  registrationDate: '2023-11-15T00:00:00Z'
};

export const ADMIN_USER: User = {
  id: 'adm1',
  name: 'Equipe Admin',
  email: 'admin@alugaai.com.br',
  phone: '(69) 3321-0000',
  role: 'admin',
  avatar: 'https://picsum.photos/id/1/100/100',
  registrationDate: '2023-01-01T08:00:00Z'
};

export const DEMO_PROPERTIES: Property[] = [
  {
    id: 'p1',
    ownerId: 'u1',
    title: 'Loft Moderno no Centro de Vilhena',
    description: 'Um belo loft de conceito aberto no coração de Vilhena. Pé direito alto, janelas amplas e acabamento de primeira linha.',
    price: 1850,
    currency: 'BRL',
    city: 'Vilhena',
    state: 'RO',
    cityId: 'vilhena-ro',
    location: 'Centro',
    address: 'Rua 737, numero 1371, Cristo Rei, Vilhena - RO',
    type: PropertyType.LOFT,
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    images: ['https://images.unsplash.com/photo-1536376074432-bf121770b440?auto=format&fit=crop&q=80&w=800'],
    status: ListingStatus.AVAILABLE,
    isActive: true,
    isFeatured: true,
    views: 1240,
    createdAt: '2023-10-01',
    features: ['Lavanderia', 'Ar-condicionado', 'Aceita Pets', 'Mobiliado']
  },
  {
    id: 'p3',
    ownerId: 'u1',
    title: 'Sala Empresarial no Edifício Master',
    description: 'Sala comercial pronta para uso. Ideal para consultórios, escritórios de advocacia ou tecnologia. Localização premium com recepção.',
    price: 2400,
    currency: 'BRL',
    city: 'Vilhena',
    state: 'RO',
    cityId: 'vilhena-ro',
    location: 'Centro',
    address: 'Av. Major Amarante, 1200 - Centro, Vilhena',
    type: PropertyType.COMMERCIAL_ROOM,
    bedrooms: 0,
    bathrooms: 1,
    area: 45,
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800'],
    status: ListingStatus.AVAILABLE,
    isActive: true,
    isFeatured: true,
    views: 520,
    createdAt: '2024-02-01',
    features: ['Ar Central', 'Segurança 24h', 'Internet Fibra', 'Vaga Privativa']
  },
  {
    id: 'p4',
    ownerId: 'u1',
    title: 'Quitinete Prática no Jardim Eldorado',
    description: 'Quitinete individual com excelente custo-benefício. Ambiente seguro, perto de mercados e faculdade.',
    price: 850,
    currency: 'BRL',
    city: 'Vilhena',
    state: 'RO',
    cityId: 'vilhena-ro',
    location: 'Jardim Eldorado',
    address: 'Rua J-22, Jardim Eldorado, Vilhena',
    type: PropertyType.KITCHENETTE,
    bedrooms: 1,
    bathrooms: 1,
    area: 32,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
    status: ListingStatus.AVAILABLE,
    isActive: true,
    isFeatured: false,
    views: 2100,
    createdAt: '2024-01-20',
    features: ['Água Inclusa', 'WIFI Coletivo', 'Câmeras de Segurança']
  },
  {
    id: 'p2',
    ownerId: 'u2',
    title: 'Casa Ampla no Jardim América',
    description: 'Excelente casa residencial em bairro tranquilo de Vilhena. Quintal grande e área gourmet.',
    price: 2800,
    currency: 'BRL',
    city: 'Vilhena',
    state: 'RO',
    cityId: 'vilhena-ro',
    location: 'Jardim América',
    address: 'Av. Brigadeiro Eduardo Gomes, Vilhena - RO',
    type: PropertyType.HOUSE,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'],
    status: ListingStatus.AVAILABLE,
    isActive: true,
    isFeatured: false,
    views: 850,
    createdAt: '2023-11-15',
    features: ['Garagem Coberta', 'Churrasqueira', 'Portão Eletrônico']
  }
];

export const DEMO_CONTRACTS: Contract[] = [
  {
    id: 'cont-001',
    propertyId: 'p1',
    renterId: 'u_test',
    ownerId: 'u1',
    tenantData: {
      fullName: 'João Inquilino de Teste',
      cpf: '123.456.789-00',
      rg: '987654-SSP/RO',
      profession: 'Empresário',
      email: 'inquilino@teste.com'
    },
    contractSettings: {
      durationMonths: 12,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      rentValue: 1850
    },
    status: 'draft',
    createdAt: new Date().toISOString()
  }
];
