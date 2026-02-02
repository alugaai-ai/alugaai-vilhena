
import React, { useState, useRef, useEffect } from 'react';
import { Property, PropertyType, ListingStatus } from '../types';

interface PropertyFormProps {
  onSave: (property: Property) => void;
  onClose: () => void;
  ownerId: string;
  initialData?: Property | null;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSave, onClose, ownerId, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: PropertyType.HOUSE,
    location: '',
    address: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    features: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [processingImages, setProcessingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        type: initialData.type || PropertyType.HOUSE,
        location: initialData.location || '',
        address: initialData.address || '',
        bedrooms: initialData.bedrooms?.toString() || '1',
        bathrooms: initialData.bathrooms?.toString() || '1',
        area: initialData.area?.toString() || '',
        features: initialData.features?.join(', ') || ''
      });
      setImages(initialData.images || []);
    }
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setProcessingImages(true);
    // Fix: Explicitly type the filesArray as File[] to avoid 'unknown' type in map which causes errors in some environments
    const filesArray: File[] = Array.from(files);
    
    const readAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const base64Results = await Promise.all(filesArray.map(file => readAsBase64(file)));
      setImages(prev => [...prev, ...base64Results]);
    } catch (err) {
      console.error("Error reading files", err);
      setErrors(prev => [...prev, "Erro ao processar imagens. Tente novamente."]);
    } finally {
      setProcessingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = [];

    if (!formData.title.trim()) newErrors.push("Dê um título para seu imóvel.");
    if (images.length < 1) newErrors.push("Adicione pelo menos 1 foto do imóvel.");
    if (!formData.price || Number(formData.price) <= 0) newErrors.push("Defina um valor de aluguel válido.");
    if (!formData.location.trim()) newErrors.push("Informe o bairro.");
    if (!formData.address.trim()) newErrors.push("Informe o endereço completo para o contrato.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const newProperty: Property = {
      id: initialData ? initialData.id : `p-${Date.now()}`,
      ownerId,
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      currency: 'BRL',
      city: 'Vilhena',
      state: 'RO',
      cityId: 'vilhena-ro',
      location: formData.location,
      address: formData.address,
      type: formData.type,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      images: images,
      status: ListingStatus.AVAILABLE,
      isActive: initialData ? initialData.isActive : true,
      isFeatured: initialData ? initialData.isFeatured : false,
      views: initialData ? initialData.views : 0,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
    };

    onSave(newProperty);
  };

  return (
    <div className="fixed inset-0 z-[700] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-[1000] text-[#004a8e] uppercase tracking-tight">
              {initialData ? 'Editar Anúncio' : 'Novo Anúncio'}
            </h2>
            <p className="text-[#ff8c00] text-[10px] font-black uppercase tracking-widest">Marketplace Vilhena - RO</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {errors.length > 0 && (
            <div className="p-6 bg-red-50 border-l-8 border-red-500 rounded-3xl animate-in shake duration-300">
              {errors.map((err, i) => <p key={i} className="text-red-700 text-xs font-black uppercase tracking-widest mb-1">{err}</p>)}
            </div>
          )}

          {/* Galeria de Fotos */}
          <div className="space-y-4">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Galeria de Fotos do Imóvel</label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-100 group shadow-md">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <button 
                type="button"
                disabled={processingImages}
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-[#ff8c00] hover:text-[#ff8c00] bg-slate-50 transition-all group disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-[#ff8c00] group-hover:text-white transition-all">
                  {processingImages ? <div className="w-6 h-6 border-4 border-[#004a8e] border-t-transparent rounded-full animate-spin"></div> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest mt-3">{processingImages ? 'Lendo...' : 'Anexar Fotos'}</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Título do Anúncio</label>
              <input type="text" placeholder="Ex: Loft Industrial com Vista Livre no Centro" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-[1000] text-slate-900 border-4 border-transparent focus:border-[#ff8c00] outline-none transition-all shadow-inner" />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Aluguel Mensal (R$)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-[1000] text-[#004a8e] text-3xl outline-none border-4 border-transparent focus:border-[#ff8c00] shadow-inner" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tipo de Imóvel</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as PropertyType})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-black text-slate-900 outline-none shadow-inner cursor-pointer">
                {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bairro</label>
              <input type="text" placeholder="Ex: Jardim Eldorado" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-black outline-none shadow-inner" />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Endereço Completo (Para contratos)</label>
              <input type="text" placeholder="Rua, Número, Complemento..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-black outline-none shadow-inner" />
            </div>

            <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quartos</label><input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-black outline-none shadow-inner" /></div>
            <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Banheiros</label><input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-black outline-none shadow-inner" /></div>
            <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Área (m²)</label><input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-black outline-none shadow-inner" /></div>

            <div className="md:col-span-2 lg:col-span-3">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Destaques (separados por vírgula)</label>
               <input type="text" placeholder="Ex: Garagem Coberta, Aceita Pets, Mobiliado" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] font-bold outline-none shadow-inner" />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Descrição Detalhada</label>
              <textarea rows={5} placeholder="Fale sobre o imóvel..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-8 bg-slate-50 rounded-[3rem] font-medium text-slate-700 outline-none shadow-inner resize-none focus:border-[#004a8e] transition-all border-4 border-transparent"></textarea>
            </div>
          </div>

          <button type="submit" disabled={processingImages} className="w-full py-8 bg-[#004a8e] text-white font-[1000] rounded-[3.5rem] shadow-[0_25px_50px_rgba(0,74,142,0.3)] hover:bg-[#ff8c00] hover:scale-105 uppercase tracking-[0.4em] transition-all text-xl active:scale-95 disabled:opacity-50">
            {initialData ? 'Atualizar Meu Anúncio' : 'Publicar Anúncio'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
