
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { DEMO_USER, ADMIN_USER, DEMO_RENTER } from '../mockData';
import { APP_CONFIG, ICONS } from '../constants';

interface AuthProps {
  onLogin: (u: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'owner' | 'renter'>('renter');
  
  // Campos de Formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [income, setIncome] = useState('');
  const [pixKey, setPixKey] = useState('');
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('⚠️ Insira um e-mail válido para receber nossas notificações.');
      return;
    }

    if (!isLogin && !acceptTerms) {
      setError('⚠️ Você precisa aceitar os Termos de Uso para continuar.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        if (email === ADMIN_USER.email && password === 'admin123') {
          onLogin(ADMIN_USER);
          navigate('/dashboard');
        } else if (email === DEMO_USER.email && password === 'dono123') {
          onLogin(DEMO_USER);
          navigate('/dashboard');
        } else {
          if (password === '123456') {
             const mockUser: User = {
               id: 'u-session',
               name: 'Usuário Conectado',
               email,
               phone: '(69) 99999-0000',
               role: 'renter',
               registrationDate: new Date().toISOString()
             };
             onLogin(mockUser);
             navigate('/dashboard');
          } else {
            setError('⚠️ E-mail ou senha incorretos.');
            setLoading(false);
          }
        }
      } else {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name,
          email,
          phone,
          cpf,
          birthDate,
          role,
          monthlyIncome: role === 'renter' ? income : undefined,
          pixKey: role === 'owner' ? pixKey : undefined,
          registrationDate: new Date().toISOString(),
          isVerified: false,
        };
        onLogin(newUser);
        navigate('/dashboard');
      }
    }, 1200);
  };

  const inputClasses = "w-full px-6 py-4 bg-white rounded-2xl border-2 border-slate-300 focus:border-[#004a8e] focus:ring-4 focus:ring-blue-500/10 outline-none font-black text-slate-900 text-sm placeholder:text-slate-400 transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-[#fcfdff] md:bg-[#002d57] flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 hidden md:block">
         <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-8">
        <div className="flex justify-center mb-6">
          <ICONS.Logo />
        </div>
        <h2 className="text-3xl font-[1000] text-[#004a8e] md:text-white uppercase tracking-tighter leading-none">
          {isLogin ? 'Portal de Acesso' : 'Cadastre seu Perfil'}
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 md:text-blue-200/60 mt-4">
          {isLogin ? 'Gerencie seus aluguéis em Vilhena' : 'Preencha os dados para começar no Aluga Aí'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white py-12 px-8 sm:px-12 shadow-2xl rounded-[3rem] border border-slate-100">
          
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-black uppercase tracking-widest rounded-xl">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="flex gap-2 mb-8 bg-slate-100 p-2 rounded-2xl">
              <button 
                type="button"
                onClick={() => setRole('renter')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'renter' ? 'bg-[#004a8e] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sou Inquilino
              </button>
              <button 
                type="button"
                onClick={() => setRole('owner')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'owner' ? 'bg-[#ff8c00] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sou Proprietário
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuthSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-300">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Nome Completo</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputClasses} placeholder="Ex: João da Silva" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">CPF</label>
                  <input type="text" required placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">WhatsApp</label>
                  <input type="tel" required placeholder="(69) 90000-0000" value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} />
                </div>
                {role === 'renter' ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Nascimento</label>
                      <input type="date" required value={birthDate} onChange={e => setBirthDate(e.target.value)} className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Renda Mensal (R$)</label>
                      <input type="number" required placeholder="Ex: 3500" value={income} onChange={e => setIncome(e.target.value)} className={inputClasses} />
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Chave PIX (Para Receber Aluguéis)</label>
                    <input type="text" required placeholder="CPF, E-mail ou Telefone" value={pixKey} onChange={e => setPixKey(e.target.value)} className={inputClasses} />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">E-mail Principal</label>
              <input 
                type="email" 
                required 
                value={email}
                placeholder="Ex: seuemail@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses} 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">Sua Senha</label>
              <input 
                type="password" 
                required 
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses} 
              />
            </div>

            {!isLogin && (
              <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all ${acceptTerms ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-6 h-6 rounded-md border-slate-300 text-[#004a8e] focus:ring-[#004a8e] cursor-pointer" 
                />
                <label htmlFor="terms" className="text-[11px] font-black text-slate-700 leading-tight cursor-pointer uppercase">
                  Li e concordo com os <button type="button" onClick={() => setShowTerms(true)} className="text-[#004a8e] underline">Termos e Regras</button>.
                </label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-6 rounded-[2rem] font-black text-white uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 text-xs ${loading ? 'bg-slate-400' : (role === 'owner' && !isLogin ? 'bg-[#ff8c00] hover:bg-[#e67e00]' : 'bg-[#004a8e] hover:bg-[#003a70]')}`}
            >
              {loading ? 'Validando...' : (isLogin ? 'Entrar no Portal' : 'Finalizar Cadastro')}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black text-slate-500 hover:text-[#004a8e] uppercase tracking-widest border-b-2 border-slate-200 hover:border-[#004a8e] transition-all pb-1"
            >
              {isLogin ? "Não tem conta? Criar Perfil" : 'Já possui cadastro? Login'}
            </button>
          </div>
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[80vh] overflow-y-auto p-12 shadow-2xl relative border-4 border-[#004a8e]/10">
              <button onClick={() => setShowTerms(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-3xl font-[1000] text-[#004a8e] uppercase mb-8 tracking-tight">Regras do Ecossistema</h3>
              <div className="prose prose-sm text-slate-700 font-bold space-y-6">
                <section>
                  <p className="font-black text-[#ff8c00] uppercase text-xs tracking-widest mb-2">1. Veracidade dos Dados</p>
                  <p>Dados falsos resultam em banimento imediato. Suas informações são validadas para garantir a segurança da negociação.</p>
                </section>
                <section>
                  <p className="font-black text-[#ff8c00] uppercase text-xs tracking-widest mb-2">2. Comunicação</p>
                  <p>Utilizaremos seu e-mail e WhatsApp para notificações críticas de aluguel e agendamento de visitas.</p>
                </section>
                <section>
                  <p className="font-black text-[#ff8c00] uppercase text-xs tracking-widest mb-2">3. Negociação Direta</p>
                  <p>O Aluga Aí facilita a conexão. Toda negociação financeira é de responsabilidade direta entre as partes.</p>
                </section>
              </div>
              <button onClick={() => { setAcceptTerms(true); setShowTerms(false); }} className="mt-12 w-full py-6 bg-[#004a8e] text-white font-black rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-lg">Entendi e Aceito</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
