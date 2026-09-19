import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login, loginError } = useApp();
  const [email, setEmail] = useState('diretoria@pradosocial.com.br');
  const [password, setPassword] = useState('prado2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(email, password);
      setIsSubmitting(false);
    }, 300);
  };

  const fillQuickAccess = () => {
    setEmail('diretoria@pradosocial.com.br');
    setPassword('prado2026');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A192F] p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle architectural background details */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#1E3A8A]/30 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80">
        {/* Navy Header Strip with Gold Accents */}
        <div className="bg-[#0A192F] px-8 pt-8 pb-7 text-center relative border-b border-[#C5A059]/30">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#0F213D] border border-[#C5A059]/50 shadow-inner mb-4">
            <span className="font-brand text-2xl font-bold text-[#C5A059] tracking-wider">PS</span>
          </div>

          <h1 className="text-xl font-bold text-white tracking-wide uppercase">
            Agência Prado Social
          </h1>
          <p className="text-xs text-slate-300 font-medium tracking-wider uppercase mt-1">
            Sistema Interno de Gestão Comercial
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[11px] text-[#E0C688] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Acesso Restrito & Protegido</span>
          </div>
        </div>

        {/* Form Area */}
        <div className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider mb-2">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="diretoria@pradosocial.com.br"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#0A192F] uppercase tracking-wider">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={fillQuickAccess}
                  className="text-[11px] font-medium text-[#C5A059] hover:underline"
                >
                  Preencher dados padrão
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-[#C5A059] hover:bg-[#B38E46] active:bg-[#A37E36] text-[#0A192F] font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>{isSubmitting ? 'Validando Acesso...' : 'Acessar Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security details footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Usuário único autorizado</span>
            <span className="font-mono text-slate-400">v1.0 • Seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
