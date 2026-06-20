import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Check } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import type { ThemeName } from '../../types';

const ACCENTS: { value: ThemeName; label: string; hex: string }[] = [
  { value: 'emerald', label: 'Esmeralda', hex: '#3fa679' },
  { value: 'blue', label: 'Azul', hex: '#4f86e8' },
  { value: 'purple', label: 'Roxo', hex: '#9b7be0' },
  { value: 'rose', label: 'Rosa', hex: '#e0728c' },
];

const CURRENCIES: { value: string; label: string; symbol: string }[] = [
  { value: 'BRL', label: 'Real', symbol: 'R$' },
  { value: 'USD', label: 'Dólar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
];

const TOTAL_STEPS = 3;

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { preferences, updatePreferences } = useFinance();
  const { theme, darkMode, currency } = preferences;
  const [step, setStep] = useState(0);

  const next = () => (step < TOTAL_STEPS - 1 ? setStep((s) => s + 1) : onDone());

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <div
        className="flex-1 flex flex-col max-w-md w-full mx-auto px-[26px]"
        style={{
          paddingTop: 'calc(20px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Topo: dots + pular */}
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 22 : 7,
                  background: i === step ? 'var(--accent)' : 'var(--line)',
                }}
              />
            ))}
          </div>
          <button
            onClick={onDone}
            className="text-[13.5px] font-semibold"
            style={{ color: 'var(--faint)' }}
          >
            Pular
          </button>
        </div>

        {/* Conteúdo do passo */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
            >
              {step === 0 && <WelcomeStep />}
              {step === 1 && (
                <AppearanceStep
                  theme={theme}
                  darkMode={darkMode}
                  onTheme={(t) => updatePreferences({ theme: t })}
                  onDark={(d) => updatePreferences({ darkMode: d })}
                />
              )}
              {step === 2 && (
                <CurrencyStep
                  currency={currency}
                  onSelect={(c) => updatePreferences({ currency: c })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Botão avançar */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={next}
          className="w-full py-3.5 rounded-[16px] font-bold"
          style={{
            background: 'var(--theme-gradient)',
            color: 'var(--accent-on)',
            boxShadow: '0 14px 30px -12px var(--accent)',
          }}
        >
          {step === TOTAL_STEPS - 1 ? 'Começar' : 'Continuar'}
        </motion.button>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center">
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] mb-6"
        style={{
          background: 'var(--theme-gradient)',
          color: 'var(--accent-on)',
          boxShadow: '0 18px 40px -16px var(--accent)',
        }}
      >
        <Wallet className="w-10 h-10" />
      </div>
      <h1 className="text-[28px] font-extrabold tracking-[-0.02em] mb-2">
        Bem-vindo ao Finanças Pro
      </h1>
      <p className="text-[15px] leading-relaxed max-w-[300px] mx-auto" style={{ color: 'var(--muted)' }}>
        Registre lançamentos, defina metas e acompanhe seus gráficos — tudo num só lugar, com a sua cara.
      </p>
    </div>
  );
}

function AppearanceStep({
  theme,
  darkMode,
  onTheme,
  onDark,
}: {
  theme: ThemeName;
  darkMode: boolean;
  onTheme: (t: ThemeName) => void;
  onDark: (d: boolean) => void;
}) {
  return (
    <div>
      <h2 className="text-[24px] font-extrabold tracking-[-0.02em] mb-1.5">Deixe com a sua cara</h2>
      <p className="text-[14px] mb-7" style={{ color: 'var(--muted)' }}>
        Escolha a cor de destaque e o modo de exibição.
      </p>

      <p className="text-[13px] font-medium mb-3" style={{ color: 'var(--muted)' }}>
        Cor de destaque
      </p>
      <div className="grid grid-cols-2 gap-3 mb-7">
        {ACCENTS.map((a) => {
          const active = theme === a.value;
          return (
            <button
              key={a.value}
              onClick={() => onTheme(a.value)}
              className="flex items-center gap-3 p-3.5 rounded-[16px] border transition-all"
              style={{
                borderColor: active ? a.hex : 'var(--line)',
                background: active ? 'var(--accent-dim)' : 'var(--surface)',
              }}
            >
              <span className="w-7 h-7 rounded-full flex-none" style={{ background: a.hex }} />
              <span className="text-[14px] font-semibold flex-1 text-left">{a.label}</span>
              {active && <Check size={17} strokeWidth={2.6} style={{ color: a.hex }} />}
            </button>
          );
        })}
      </div>

      <div
        className="flex items-center justify-between p-4 rounded-[16px] border"
        style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
      >
        <span className="text-[14px] font-medium">Modo escuro</span>
        <button
          onClick={() => onDark(!darkMode)}
          aria-label="Alternar modo escuro"
          className="w-14 h-8 rounded-full relative transition-colors"
          style={{ background: darkMode ? 'var(--accent)' : 'var(--surface2)' }}
        >
          <motion.div
            animate={{ x: darkMode ? 24 : 0 }}
            className="w-6 h-6 rounded-full absolute top-1 left-1"
            style={{ background: '#fff' }}
          />
        </button>
      </div>
    </div>
  );
}

function CurrencyStep({ currency, onSelect }: { currency: string; onSelect: (c: string) => void }) {
  return (
    <div>
      <h2 className="text-[24px] font-extrabold tracking-[-0.02em] mb-1.5">Sua moeda</h2>
      <p className="text-[14px] mb-7" style={{ color: 'var(--muted)' }}>
        Usada para exibir todos os valores no app.
      </p>
      <div className="space-y-3">
        {CURRENCIES.map((c) => {
          const active = currency === c.value;
          return (
            <button
              key={c.value}
              onClick={() => onSelect(c.value)}
              className="w-full flex items-center gap-3.5 p-4 rounded-[16px] border transition-all"
              style={{
                borderColor: active ? 'var(--accent)' : 'var(--line)',
                background: active ? 'var(--accent-dim)' : 'var(--surface)',
              }}
            >
              <span
                className="w-11 h-11 rounded-[13px] flex-none flex items-center justify-center text-[17px] font-extrabold tnum"
                style={{ background: 'var(--surface2)', color: 'var(--accent)' }}
              >
                {c.symbol}
              </span>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-bold">{c.label}</div>
                <div className="text-[12.5px]" style={{ color: 'var(--faint)' }}>
                  {c.value}
                </div>
              </div>
              {active && <Check size={19} strokeWidth={2.6} style={{ color: 'var(--accent)' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
