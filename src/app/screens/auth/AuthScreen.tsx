import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, EyeOff, Eye, AlertCircle, CheckCircle, Loader2, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name);
    if (error) {
      setError(error.message || 'Ocorreu um erro. Tente novamente.');
    } else if (!isLogin) {
      setSuccess('Conta criada com sucesso! Faça o login.');
      setIsLogin(true);
    }
    setLoading(false);
  };
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-rose-200/30 rounded-full blur-3xl"
        />
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-200"
          >
            <Wallet className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2"
          >
            Finanças Pro
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-lg"
          >
            Controle suas finanças com estilo
          </motion.p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/10 p-8 border border-white/20"
        >
          <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 will-change-transform ${
                isLogin
                  ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Entrar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 will-change-transform ${
                !isLogin
                  ? 'bg-white text-emerald-600 shadow-lg shadow-emerald-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Criar Conta
            </motion.button>
          </div>
          <motion.form
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900"
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <p className="text-rose-700 text-sm">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 text-sm text-gray-500"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Seguro
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Rápido
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Gratuito
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
