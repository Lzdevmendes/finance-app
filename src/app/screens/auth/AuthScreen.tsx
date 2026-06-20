import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, EyeOff, Eye, AlertCircle, CheckCircle, Loader2, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const inputClass = 'w-full px-4 py-3 rounded-[14px] border outline-none transition-all focus:ring-2';
const inputStyle = { background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' };

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name);
    if (!result.ok) {
      setError(result.error.message || 'Ocorreu um erro. Tente novamente.');
    } else if (!isLogin) {
      setSuccess('Conta criada com sucesso! Faça o login.');
      setIsLogin(true);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Background decorations (accent-tinted) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'var(--accent-dim)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'var(--accent-dim)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] mb-5"
            style={{
              background: 'var(--theme-gradient)',
              color: 'var(--accent-on)',
              boxShadow: '0 18px 40px -16px var(--accent)',
            }}
          >
            <Wallet className="w-10 h-10" />
          </div>
          <h1 className="text-[34px] font-extrabold tracking-[-0.02em] mb-1">Finanças Pro</h1>
          <p className="text-[15px]" style={{ color: 'var(--muted)' }}>
            Controle suas finanças com estilo
          </p>
        </div>

        <div
          className="rounded-[24px] p-7 border shadow-2xl"
          style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
        >
          <div
            className="flex gap-1.5 p-1 rounded-[16px] mb-7"
            style={{ background: 'var(--surface2)' }}
          >
            {[
              { login: true, label: 'Entrar' },
              { login: false, label: 'Criar conta' },
            ].map((tab) => {
              const active = isLogin === tab.login;
              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setIsLogin(tab.login);
                    setError('');
                    setSuccess('');
                  }}
                  className="flex-1 py-2.5 rounded-[12px] font-semibold text-[14px] transition-all"
                  style={
                    active
                      ? { background: 'var(--surface)', color: 'var(--accent)', boxShadow: '0 2px 8px -2px rgba(0,0,0,.15)' }
                      : { color: 'var(--faint)' }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="block text-[13px] font-medium" style={{ color: 'var(--muted)' }}>
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium" style={{ color: 'var(--muted)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium" style={{ color: 'var(--muted)' }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--faint)' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="p-3.5 rounded-[14px] flex items-center gap-3 border"
                  style={{ background: 'rgba(207,91,63,.1)', borderColor: 'rgba(207,91,63,.3)' }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--expense)' }} />
                  <p className="text-[13px]" style={{ color: 'var(--expense)' }}>{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="p-3.5 rounded-[14px] flex items-center gap-3 border"
                  style={{ background: 'rgba(111,215,163,.1)', borderColor: 'rgba(111,215,163,.3)' }}
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--income)' }} />
                  <p className="text-[13px]" style={{ color: 'var(--income)' }}>{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3.5 rounded-[16px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'var(--theme-gradient)',
                color: 'var(--accent-on)',
                boxShadow: '0 14px 30px -12px var(--accent)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {isLogin ? 'Entrar' : 'Criar conta'}
                </>
              )}
            </motion.button>
          </form>
        </div>

        <div className="text-center mt-6 text-[13px]" style={{ color: 'var(--faint)' }}>
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Seguro
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Rápido
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Gratuito
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
