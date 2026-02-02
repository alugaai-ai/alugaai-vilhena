
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const NeighborhoodAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sugestoes = [
    "Academias próximas",
    "Escolas e Creches",
    "Supermercados",
    "Postos de Combustível"
  ];

  const askAssistant = async (customQuery?: string) => {
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;
    
    setLoading(true);
    setResponse(null);
    setLinks([]);
    setError(null);

    try {
      // Coordenadas base de Vilhena, RO
      let latitude = -12.740;
      let longitude = -60.145;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // CRITICAL FIX: Google Maps tool is only supported in Gemini 2.5 series
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: `Localize em Vilhena, RO: "${activeQuery}". 
        REGRAS: 
        1. Responda em no MÁXIMO 12 palavras. 
        2. Seja direto e útil para quem está procurando aluguel.
        3. Exemplo: "Excelentes opções no Centro e Jardim Eldorado, próximos a conveniências."`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: { 
            retrievalConfig: { 
              latLng: { latitude, longitude } 
            } 
          }
        },
      });

      setResponse(result.text || 'Resultados encontrados em Vilhena:');
      
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extractedLinks = chunks
        .filter((c: any) => c.maps)
        .map((c: any) => ({
          title: c.maps.title,
          uri: c.maps.uri
        }));
      setLinks(extractedLinks);
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      setError('O assistente está sobrecarregado. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-2xl rounded-[4rem] border border-white p-10 md:p-20 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] w-full max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#ff8c00] to-[#e67e00] rounded-[2.5rem] text-white mb-8 shadow-2xl">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
        </div>
        <h3 className="text-5xl md:text-7xl font-[1000] text-[#004a8e] mb-4 tracking-tighter uppercase leading-[0.8]">Radar Local</h3>
        <p className="text-[#ff8c00] font-black uppercase tracking-[0.4em] text-[10px] italic">Especialista em Vilhena</p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && askAssistant()}
            placeholder="O que tem por perto?"
            className="w-full px-12 py-8 bg-white/60 border-4 border-transparent rounded-[3.5rem] text-slate-800 text-2xl focus:border-[#ff8c00] outline-none transition-all shadow-xl text-center font-black placeholder:text-slate-300"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {sugestoes.map((s, i) => (
            <button key={i} onClick={() => { setQuery(s); askAssistant(s); }} className="px-8 py-3 bg-white border-2 border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-[#ff8c00] hover:text-[#ff8c00] transition-all shadow-sm">{s}</button>
          ))}
        </div>

        <button 
          onClick={() => askAssistant()} 
          disabled={loading} 
          className="w-full py-8 bg-[#004a8e] text-white rounded-[3rem] font-[1000] text-xl hover:bg-[#ff8c00] transition-all shadow-2xl uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Escaneando Vilhena...' : 'Consultar Agora'}
        </button>

        {error && <p className="text-center text-red-500 font-black text-xs uppercase tracking-widest">{error}</p>}
      </div>

      {(response || links.length > 0) && (
        <div className="mt-24 space-y-16 animate-in zoom-in duration-500">
          {response && (
            <div className="bg-[#004a8e] p-10 rounded-[3rem] shadow-2xl border-b-8 border-[#ff8c00]">
              <p className="text-white font-[1000] text-2xl md:text-3xl leading-tight uppercase tracking-tighter text-center">
                "{response}"
              </p>
            </div>
          )}

          {links.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {links.map((link, i) => (
                <a 
                  key={i} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center justify-center bg-white border-4 border-slate-50 p-12 rounded-[4rem] hover:border-[#ff8c00] hover:shadow-[0_40px_80px_-20px_rgba(255,140,0,0.2)] transition-all duration-500 text-center"
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-[#004a8e] mb-8 group-hover:bg-[#ff8c00] group-hover:text-white transition-all shadow-lg">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <h4 className="text-[#004a8e] font-[1000] text-2xl uppercase tracking-tighter leading-none mb-4 group-hover:text-[#ff8c00] transition-colors">
                    {link.title}
                  </h4>
                  <div className="px-8 py-3 bg-slate-50 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-[#ff8c00]/10 group-hover:text-[#ff8c00] transition-all">
                    Ver localização exata &rarr;
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NeighborhoodAssistant;
