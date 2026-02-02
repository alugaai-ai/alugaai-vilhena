
import React, { useState, useMemo, useEffect } from 'react';
import { Property, User, PropertyType } from '../types';

interface ContractGeneratorProps {
  isOpen: boolean;
  property: Property;
  renter: User;
  onGenerate: (data: any) => void;
  onClose: () => void;
}

type ContractModel = 'residencial' | 'comercial' | 'temporada';

const CONTRACT_MODELS = {
  residencial: {
    title: 'Residencial Padrão',
    subtitle: 'Lei 8.245/91 - Prazo sugerido: 30 meses',
    baseClauses: 'Cláusulas Base: Reajuste anual pelo IPCA, Multa de 3 aluguéis por rescisão antecipada, Vistoria obrigatória na entrada e saída, Pagamento até o dia 05 de cada mês.'
  },
  comercial: {
    title: 'Comercial Profissional',
    subtitle: 'Foco em Pontos Comerciais e Lojas',
    baseClauses: 'Cláusulas Base: Direito de Luvas não incluso (salvo pactuado), Reajuste pelo IGP-M, Manutenção de fachadas por conta do locatário, Seguro contra incêndio obrigatório.'
  },
  temporada: {
    title: 'Temporada (Até 90 dias)',
    subtitle: 'Férias, Trabalho ou Eventos',
    baseClauses: 'Cláusulas Base: Pagamento antecipado integral, Proibição de sublocação, Taxa de limpeza fixa, Inventário de móveis e eletros incluso no anexo.'
  }
};

const ContractGenerator: React.FC<ContractGeneratorProps> = ({ isOpen, property, renter, onGenerate, onClose }) => {
  const [step, setStep] = useState<'renter-info' | 'model-selection' | 'clauses'>('renter-info');
  const [selectedModel, setSelectedModel] = useState<ContractModel>('residencial');
  
  // Inteligência de seleção de modelo
  useEffect(() => {
    const commercialTypes = [
      PropertyType.COMMERCIAL_ROOM, 
      PropertyType.STORE, 
      PropertyType.WAREHOUSE, 
      PropertyType.LAND
    ];
    if (commercialTypes.includes(property.type)) {
      setSelectedModel('comercial');
    } else {
      setSelectedModel('residencial');
    }
  }, [property.type]);

  const [renterData, setRenterData] = useState({
    fullName: renter.name || '',
    cpf: '',
    rg: '',
    profession: '',
    email: renter.email || ''
  });

  const [settings, setSettings] = useState({
    durationMonths: 12,
    rentValue: property.price,
    extraClauses: ''
  });

  const finalContractText = useMemo(() => {
    const base = CONTRACT_MODELS[selectedModel].baseClauses;
    return `${base}\n\n--- CLÁUSULAS EXTRAS ---\n${settings.extraClauses || 'Nenhuma cláusula extra adicionada.'}`;
  }, [selectedModel, settings.extraClauses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[800] bg-[#002d57]/95 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Progressivo */}
        <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#004a8e] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-[1000] text-[#004a8e] uppercase tracking-tight leading-none">Contrato Digital</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${step === 'renter-info' ? 'bg-[#ff8c00]' : 'bg-slate-200'}`}></span>
                <span className={`w-2 h-2 rounded-full ${step === 'model-selection' ? 'bg-[#ff8c00]' : 'bg-slate-200'}`}></span>
                <span className={`w-2 h-2 rounded-full ${step === 'clauses' ? 'bg-[#ff8c00]' : 'bg-slate-200'}`}></span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Passo {step === 'renter-info' ? '1' : step === 'model-selection' ? '2' : '3'} de 3</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* PASSO 1: DADOS DO INQUILINO */}
          {step === 'renter-info' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#004a8e] shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <p className="text-xs font-black text-[#004a8e] uppercase tracking-widest">Identificação do Locatário</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Nome Completo</label>
                  <input type="text" placeholder="Como no RG/CPF" value={renterData.fullName} onChange={e => setRenterData({...renterData, fullName: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00] text-slate-900" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">CPF</label>
                    <input placeholder="000.000.000-00" value={renterData.cpf} onChange={e => setRenterData({...renterData, cpf: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">RG</label>
                    <input placeholder="Ex: 1234567" value={renterData.rg} onChange={e => setRenterData({...renterData, rg: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Profissão</label>
                  <input placeholder="Ex: Analista de Sistemas" value={renterData.profession} onChange={e => setRenterData({...renterData, profession: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#ff8c00]" />
                </div>
              </div>
              
              <button onClick={() => setStep('model-selection')} className="w-full py-6 bg-[#004a8e] text-white font-[1000] rounded-[2rem] uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">Próximo Passo &rarr;</button>
            </div>
          )}

          {/* PASSO 2: MODELO DE CONTRATO */}
          {step === 'model-selection' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h3 className="text-lg font-[1000] text-[#004a8e] uppercase tracking-tight text-center">Escolha o Modelo Jurídico</h3>
              <p className="text-center text-slate-400 font-bold text-xs uppercase tracking-widest">Modelos atualizados conforme Legislação 2024</p>
              
              <div className="grid grid-cols-1 gap-4 mt-6">
                {(Object.keys(CONTRACT_MODELS) as ContractModel[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedModel(key)}
                    className={`p-6 rounded-[2rem] border-4 text-left transition-all flex items-center justify-between group ${selectedModel === key ? 'bg-[#004a8e] border-[#004a8e] text-white shadow-xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-blue-100'}`}
                  >
                    <div>
                      <p className={`font-[1000] uppercase text-sm ${selectedModel === key ? 'text-white' : 'text-[#004a8e]'}`}>{CONTRACT_MODELS[key].title}</p>
                      <p className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${selectedModel === key ? 'text-blue-200' : 'text-slate-400'}`}>{CONTRACT_MODELS[key].subtitle}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors ${selectedModel === key ? 'border-white/20 bg-white/10 text-white' : 'border-slate-100 text-transparent'}`}>
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setStep('renter-info')} className="flex-1 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-[2rem] uppercase text-[10px]">Voltar</button>
                 <button onClick={() => setStep('clauses')} className="flex-[2] py-5 bg-[#004a8e] text-white font-[1000] rounded-[2rem] uppercase tracking-widest text-xs shadow-xl">Configurar Cláusulas</button>
              </div>
            </div>
          )}

          {/* PASSO 3: CLÁUSULAS E FINALIZAÇÃO */}
          {step === 'clauses' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                <p className="text-[10px] font-black text-[#ff8c00] uppercase tracking-widest">Resumo das Cláusulas Master</p>
                <p className="text-slate-700 font-bold text-xs mt-3 leading-relaxed bg-white/50 p-4 rounded-xl border border-orange-200/30">
                  {CONTRACT_MODELS[selectedModel].baseClauses}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valor Mensal (R$)</label>
                  <input type="number" value={settings.rentValue} onChange={e => setSettings({...settings, rentValue: Number(e.target.value)})} className="w-full p-5 bg-slate-50 border-4 border-[#ff8c00] rounded-2xl font-[1000] text-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Prazo (Meses)</label>
                  <input type="number" value={settings.durationMonths} onChange={e => setSettings({...settings, durationMonths: Number(e.target.value)})} className="w-full p-5 bg-slate-50 rounded-2xl font-[1000] text-xl outline-none border-2 border-slate-100" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cláusulas Extras Personalizadas</label>
                <textarea 
                  rows={5} 
                  placeholder="Ex: Proibido animais de grande porte. Vaga de garagem número 12." 
                  value={settings.extraClauses} 
                  onChange={e => setSettings({...settings, extraClauses: e.target.value})} 
                  className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-sm font-bold text-slate-800 outline-none focus:border-[#004a8e] shadow-inner" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setStep('model-selection')} className="flex-1 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-[2rem] uppercase text-[10px]">Voltar</button>
                 <button 
                  onClick={() => onGenerate({ renterData, selectedModel, settings, fullText: finalContractText })} 
                  className="flex-[2] py-6 bg-[#ff8c00] text-white font-[1000] rounded-[2.5rem] uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(255,140,0,0.3)] hover:scale-105 transition-all"
                >
                  Gerar Contrato Digital
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;
